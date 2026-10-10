
import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import {
    useAudioPlayer,
    useAudioPlayerStatus
} from "expo-audio";

import {
    getDriveAudioSource
} from "../services/drive/driveService";

const AudioPlayerContext = createContext(null);

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

    const currentTime = status.currentTime ?? 0;
    const duration = status.duration ?? 0;

    const updateQueue = (nextQueue) => {
        queueRef.current = nextQueue;
        setQueue(nextQueue);
    };

    const updatePlaylistQueue = (nextQueue) => {
        playlistQueueRef.current = nextQueue;
        setPlaylistQueue(nextQueue);
    };

    const updateCurrentMusic = (music) => {
        currentMusicRef.current = music;
        setCurrentMusic(music);
    };

    const updateCurrentIndex = (index) => {
        currentIndexRef.current = index;
        setCurrentIndex(index);
    };

    const loadMusic = async (
        music,
        options = {}
    ) => {
        if (!music || changingTrack.current) {
            return;
        }

        changingTrack.current = true;
        shouldPlayAfterLoad.current = true;
        finishHandled.current = false;

        try {
            const source = await getDriveAudioSource(music.id);

            updateCurrentMusic(music);

            if (typeof options.playlistIndex === "number") {
                updateCurrentIndex(options.playlistIndex);
            }

            player.replace(source);
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

    const playMusic = async (
        music,
        playbackQueue = null
    ) => {
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

            const nextIndex = index >= 0 ? index : 0;

            updatePlaylistQueue(nextPlaylist);
            await loadMusic(music, {
                playlistIndex: nextIndex
            });

            return;
        }

        updatePlaylistQueue([music]);

        await loadMusic(music, {
            playlistIndex: 0
        });
    };

    const addToQueue = (music) => {
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

    const removeFromQueue = (musicId) => {
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

    const setPlaybackQueue = (musics) => {
        if (!Array.isArray(musics)) {
            return;
        }

        updateQueue(musics);
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
        if (!currentMusicRef.current) {
            return;
        }

        player.play();
    };

    const stopMusic = () => {
        shouldPlayAfterLoad.current = false;
        finishHandled.current = true;

        player.pause();
        player.seekTo(0);

        updateCurrentMusic(null);
        updateCurrentIndex(-1);
        updatePlaylistQueue([]);
        updateQueue([]);
    };

    const seekTo = (position) => {
        player.seekTo(position);
    };

    useEffect(() => {
        if (!shouldPlayAfterLoad.current || !status.isLoaded) {
            return;
        }

        shouldPlayAfterLoad.current = false;
        player.play();
    }, [status.isLoaded]);

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
