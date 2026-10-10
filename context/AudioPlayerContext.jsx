import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import {
    Platform
} from "react-native";

import {
    useAudioPlayer,
    useAudioPlayerStatus,
    setAudioModeAsync,
    requestNotificationPermissionsAsync
} from "expo-audio";

import {
    getDriveAudioSource
} from "../services/drive/driveService";

import {
    getDriveMusicMetadata
} from "../services/drive/musicMetadataService";

const AudioPlayerContext = createContext(null);

const getValidArtworkUrl = artwork => {
    if (typeof artwork !== "string" || !artwork.trim()) {
        return undefined;
    }

    const url = artwork.trim();

    if (/^(https?:\/\/|file:\/\/)/i.test(url)) {
        return url;
    }

    return undefined;
};

export const AudioPlayerProvider = ({ children }) => {
    const [currentMusic, setCurrentMusic] = useState(null);
    const [queue, setQueue] = useState([]);
    const [playlistQueue, setPlaylistQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const player = useAudioPlayer(null);
    const status = useAudioPlayerStatus(player);

    const queueRef = useRef([]);
    const playlistQueueRef = useRef([]);
    const currentMusicRef = useRef(null);
    const currentIndexRef = useRef(-1);
    const changingTrack = useRef(false);
    const shouldPlayAfterLoad = useRef(false);
    const finishHandled = useRef(false);
    const audioModeReady = useRef(Promise.resolve());

    const currentTime = status.currentTime ?? 0;
    const duration = status.duration ?? 0;

    useEffect(() => {
        audioModeReady.current = setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: true,
            interruptionMode: "doNotMix"
        }).catch(error => {
            console.log(
                "Unable to configure background audio:",
                error.message
            );
        });

        if (Platform.OS === "android") {
            requestNotificationPermissionsAsync().catch(error => {
                console.log(
                    "Unable to request notification permission:",
                    error.message
                );
            });
        }
    }, []);

    useEffect(() => {
        if (!currentMusic) {
            try {
                player.clearLockScreenControls();
            } catch (error) {
                console.log(
                    "Unable to clear lock-screen controls:",
                    error.message
                );
            }
            return;
        }

        let cancelled = false;

        const updateLockScreen = async () => {
            const artworkUrl = getValidArtworkUrl(
                currentMusic.artwork
            );

            const metadata = {
                title: currentMusic.title || currentMusic.name || "Unknown song",
                artist: currentMusic.artist || "Unknown artist",
                albumTitle: currentMusic.album || "IsaiVault",
                ...(artworkUrl ? { artworkUrl } : {})
            };

            try {
                await player.setActiveForLockScreen(true, metadata, {
                    showSeekBackward: true,
                    showSeekForward: true
                });

                if (!cancelled) {
                    await player.updateLockScreenMetadata(metadata);
                }
            } catch (error) {
                console.log(
                    "Unable to update lock-screen metadata:",
                    error.message
                );
            }
        };

        updateLockScreen();

        return () => {
            cancelled = true;
        };
    }, [currentMusic, player]);

    const updateQueue = nextQueue => {
        queueRef.current = nextQueue;
        setQueue(nextQueue);
    };

    const updatePlaylistQueue = nextQueue => {
        playlistQueueRef.current = nextQueue;
        setPlaylistQueue(nextQueue);
    };

    const updateCurrentMusic = music => {
        currentMusicRef.current = music;
        setCurrentMusic(music);
    };

    const updateCurrentIndex = index => {
        currentIndexRef.current = index;
        setCurrentIndex(index);
    };

    const loadMusic = async (music, options = {}) => {
        if (!music || changingTrack.current) {
            return;
        }

        changingTrack.current = true;
        shouldPlayAfterLoad.current = true;
        finishHandled.current = false;

        try {
            await audioModeReady.current;

            const source = await getDriveAudioSource(music.id);

            updateCurrentMusic({
                ...music,
                title: music.title || music.name || "Unknown song",
                artist: music.artist || "Unknown artist"
            });

            if (typeof options.playlistIndex === "number") {
                updateCurrentIndex(options.playlistIndex);
            }

            player.replace(source);

            getDriveMusicMetadata(music)
                .then(metadata => {
                    if (currentMusicRef.current?.id !== music.id) {
                        return;
                    }

                    updateCurrentMusic(metadata);
                })
                .catch(error => {
                    console.log(
                        "Unable to load music metadata:",
                        error.message
                    );
                });
        } catch (error) {
            shouldPlayAfterLoad.current = false;

            console.log(
                "Unable to load music:",
                error.message
            );
        } finally {
            changingTrack.current = false;
        }
    };

    const playMusic = async (music, playbackQueue = null) => {
        if (!music) {
            return;
        }

        if (Array.isArray(playbackQueue)) {
            const index = playbackQueue.findIndex(
                item => item.id === music.id
            );

            const nextPlaylist = index >= 0
                ? playbackQueue
                : [music, ...playbackQueue];

            updatePlaylistQueue(nextPlaylist);

            await loadMusic(music, {
                playlistIndex: index >= 0 ? index : 0
            });

            return;
        }

        updatePlaylistQueue([music]);

        await loadMusic(music, {
            playlistIndex: 0
        });
    };

    const addToQueue = music => {
        if (!music) {
            return;
        }

        if (currentMusicRef.current?.id === music.id) {
            return;
        }

        const alreadyQueued = queueRef.current.some(
            item => item.id === music.id
        );

        if (alreadyQueued) {
            return;
        }

        updateQueue([
            ...queueRef.current,
            music
        ]);
    };

    const removeFromQueue = musicId => {
        updateQueue(
            queueRef.current.filter(
                music => music.id !== musicId
            )
        );
    };

    const clearQueue = () => {
        updateQueue([]);
    };

    const playNext = async () => {
        if (changingTrack.current) {
            return;
        }

        const temporaryQueue = queueRef.current;

        if (temporaryQueue.length > 0) {
            const [nextMusic, ...remainingQueue] = temporaryQueue;

            updateQueue(remainingQueue);
            await loadMusic(nextMusic);
            return;
        }

        const playlist = playlistQueueRef.current;
        const nextIndex = currentIndexRef.current + 1;

        if (nextIndex < 0 || nextIndex >= playlist.length) {
            return;
        }

        await loadMusic(playlist[nextIndex], {
            playlistIndex: nextIndex
        });
    };

    const playPrevious = async () => {
        if (changingTrack.current) {
            return;
        }

        const playlist = playlistQueueRef.current;
        const previousIndex = currentIndexRef.current - 1;

        if (previousIndex < 0 || previousIndex >= playlist.length) {
            return;
        }

        await loadMusic(playlist[previousIndex], {
            playlistIndex: previousIndex
        });
    };

    const setPlaybackQueue = musics => {
        if (Array.isArray(musics)) {
            updateQueue(musics);
        }
    };

    const togglePlayback = () => {
        if (!currentMusicRef.current) {
            return;
        }

        if (status.playing) {
            player.pause();
        } else {
            player.play();
        }
    };

    const pauseMusic = () => {
        player.pause();
    };

    const resumeMusic = () => {
        if (currentMusicRef.current) {
            player.play();
        }
    };

    const stopMusic = () => {
        shouldPlayAfterLoad.current = false;
        finishHandled.current = true;

        player.pause();
        player.clearLockScreenControls();

        updateCurrentMusic(null);
        updateCurrentIndex(-1);
        updatePlaylistQueue([]);
        updateQueue([]);
    };

    const seekTo = position => {
        player.seekTo(position);
    };

    useEffect(() => {
        if (!shouldPlayAfterLoad.current || !status.isLoaded) {
            return;
        }

        shouldPlayAfterLoad.current = false;
        player.play();
    }, [status.isLoaded, currentMusic, player]);

    useEffect(() => {
        if (!status.didJustFinish) {
            finishHandled.current = false;
            return;
        }

        if (finishHandled.current) {
            return;
        }

        finishHandled.current = true;
        playNext();
    }, [status.didJustFinish]);

    const value = {
        currentMusic,
        status,
        currentTime,
        duration,
        queue,
        playlistQueue,
        currentIndex,
        setQueue: setPlaybackQueue,
        addToQueue,
        removeFromQueue,
        clearQueue,
        playMusic,
        togglePlayback,
        pauseMusic,
        resumeMusic,
        stopMusic,
        seekTo,
        playNext,
        playPrevious
    };

    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayerContext = () => {
    const context = useContext(AudioPlayerContext);

    if (!context) {
        throw new Error(
            "useAudioPlayerContext must be used inside AudioPlayerProvider"
        );
    }

    return context;
};
