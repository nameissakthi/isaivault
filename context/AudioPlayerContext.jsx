import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import {
    useAudioPlayer,
    useAudioPlayerStatus,
    setAudioModeAsync
} from "expo-audio";

import { getDriveAudioSource } from "../services/drive/driveService";

const AudioPlayerContext = createContext(null);

export const AudioPlayerProvider = ({ children }) => {
    const [currentMusic, setCurrentMusic] = useState(null);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const player = useAudioPlayer(null);
    const status = useAudioPlayerStatus(player);

    const shouldPlayAfterLoad = useRef(false);
    const changingTrack = useRef(false);

    useEffect(() => {
        setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: true,
            interruptionMode: "doNotMix"
        }).catch(error => {
            console.log(
                "Audio Mode Error:",
                error.message
            );
        });
    }, []);

    const currentTime = status.currentTime ?? 0;
    const duration = status.duration ?? 0;

    const playMusic = async (music) => {
        if (!music) return;
        if (changingTrack.current) return;

        changingTrack.current = true;
        shouldPlayAfterLoad.current = true;

        try {
            const source = await getDriveAudioSource(music.id);

            setQueue([music]);
            setCurrentMusic(music);
            setCurrentIndex(0);

            player.setActiveForLockScreen(true, {
                title: music.name || "IsaiVault",
                artist: "IsaiVault"
            });

            player.replace(source);
        } catch (error) {
            shouldPlayAfterLoad.current = false;

            console.log(
                "Unable to play music:",
                error.message
            );
        } finally {
            changingTrack.current = false;
        }
    };

    useEffect(() => {
        if (!shouldPlayAfterLoad.current) return;
        if (!status.isLoaded) return;

        shouldPlayAfterLoad.current = false;

        player.play();
    }, [status.isLoaded]);

    const addToQueue = async (music) => {
        if (!music) return;

        const alreadyExists = queue.some(
            item => item.id === music.id
        );

        if (alreadyExists) return;

        setQueue(currentQueue => [
            ...currentQueue,
            music
        ]);
    };

    const removeFromQueue = (musicId) => {
        const index = queue.findIndex(
            music => music.id === musicId
        );

        if (index === -1) return;

        if (index === currentIndex) return;

        setQueue(currentQueue =>
            currentQueue.filter(
                music => music.id !== musicId
            )
        );
    };

    const clearQueue = () => {
        setQueue([]);
        setCurrentMusic(null);
        setCurrentIndex(-1);
        shouldPlayAfterLoad.current = false;

        player.pause();
        player.setActiveForLockScreen(false);
    };

    const togglePlayback = () => {
        if (!currentMusic) return;

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
        if (!currentMusic) return;

        player.play();
    };

    const stopMusic = () => {
        shouldPlayAfterLoad.current = false;

        player.pause();
        player.seekTo(0);
        player.setActiveForLockScreen(false);

        setCurrentMusic(null);
        setCurrentIndex(-1);
        setQueue([]);
    };

    const seekTo = (position) => {
        player.seekTo(position);
    };

    const playNext = async () => {
        if (queue.length === 0) return;

        const nextIndex = currentIndex + 1;

        if (nextIndex >= queue.length) return;

        const nextMusic = queue[nextIndex];

        await loadQueueMusic(nextMusic, nextIndex);
    };

    const playPrevious = async () => {
        if (queue.length === 0) return;

        const previousIndex = currentIndex - 1;

        if (previousIndex < 0) return;

        const previousMusic = queue[previousIndex];

        await loadQueueMusic(
            previousMusic,
            previousIndex
        );
    };

    const loadQueueMusic = async (music, index) => {
        if (!music) return;
        if (changingTrack.current) return;

        changingTrack.current = true;
        shouldPlayAfterLoad.current = true;

        try {
            const source = await getDriveAudioSource(music.id);

            setCurrentMusic(music);
            setCurrentIndex(index);

            player.setActiveForLockScreen(true, {
                title: music.name || "IsaiVault",
                artist: "IsaiVault"
            });

            player.replace(source);
        } catch (error) {
            shouldPlayAfterLoad.current = false;

            console.log(
                "Unable to load queued music:",
                error.message
            );
        } finally {
            changingTrack.current = false;
        }
    };

    useEffect(() => {
        if (!status.didJustFinish) return;

        playNext();
    }, [status.didJustFinish]);

    const setPlaybackQueue = (musics) => {
        if (!Array.isArray(musics)) return;

        setQueue(musics);
    };

    const value = {
        currentMusic,
        status,
        currentTime,
        duration,
        queue,
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