import {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef
} from "react";

import {
    useAudioPlayer,
    useAudioPlayerStatus
} from "expo-audio";

import { getDriveAudioSource } from "../services/drive/driveService";

const AudioPlayerContext = createContext(null);

export const AudioPlayerProvider = ({ children }) => {

    const [currentMusic, setCurrentMusic] = useState(null);

    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const player = useAudioPlayer(null);

    const status = useAudioPlayerStatus(player);

    const pendingPlay = useRef(false);
    const changingTrack = useRef(false);

    const currentTime = status.currentTime ?? 0;
    const duration = status.duration ?? 0;

    const addToQueue = (music) => {
        if (!music) return;

        setQueue(currentQueue => {

            const alreadyExists = currentQueue.some(
                item => item.id === music.id
            );

            if (alreadyExists) {
                return currentQueue;
            }

            return [
                ...currentQueue,
                music
            ];
        });
    };

    const removeFromQueue = (musicId) => {
        setQueue(currentQueue =>
            currentQueue.filter(
                music => music.id !== musicId
            )
        );
    };

    const clearQueue = () => {
        setQueue([]);
        setCurrentIndex(-1);
    };

    const loadMusic = async (music, index) => {

        if (!music) return;

        if (changingTrack.current) {
            return;
        }

        changingTrack.current = true;

        try {

            const source = await getDriveAudioSource(
                music.id
            );

            setCurrentMusic(music);
            setCurrentIndex(index);

            pendingPlay.current = true;

            player.replace(source);

        } catch (error) {

            pendingPlay.current = false;

            console.log(
                "Unable to load music:",
                error.message
            );

        } finally {

            changingTrack.current = false;

        }
    };

    useEffect(() => {

        if (!pendingPlay.current) {
            return;
        }

        if (!currentMusic) {
            return;
        }

        if (status.duration <= 0) {
            return;
        }

        pendingPlay.current = false;

        player.play();

    }, [
        currentMusic,
        status.duration
    ]);

    const playMusic = async (music) => {

        const index = queue.findIndex(
            item => item.id === music.id
        );

        if (index === -1) {
            return;
        }

        await loadMusic(
            music,
            index
        );
    };

    const togglePlayback = () => {

        if (!currentMusic) {
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
        player.play();
    };

    const stopMusic = () => {

        player.pause();

        setCurrentMusic(null);
        setCurrentIndex(-1);

        pendingPlay.current = false;
    };

    const seekTo = (position) => {
        player.seekTo(position);
    };

    const playNext = async () => {

        if (queue.length === 0) {
            return;
        }

        const nextIndex = currentIndex + 1;

        if (nextIndex >= queue.length) {
            return;
        }

        const nextMusic = queue[nextIndex];

        await loadMusic(
            nextMusic,
            nextIndex
        );
    };

    const playPrevious = async () => {

        if (queue.length === 0) {
            return;
        }

        const previousIndex = currentIndex - 1;

        if (previousIndex < 0) {
            return;
        }

        const previousMusic = queue[previousIndex];

        await loadMusic(
            previousMusic,
            previousIndex
        );
    };

    useEffect(() => {

        if (!status.didJustFinish) {
            return;
        }

        playNext();

    }, [
        status.didJustFinish
    ]);

    const value = {
        currentMusic,
        status,
        currentTime,
        duration,

        queue,
        currentIndex,
        setQueue,

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

    const context = useContext(
        AudioPlayerContext
    );

    if (!context) {
        throw new Error(
            "useAudioPlayerContext must be used inside AudioPlayerProvider"
        );
    }

    return context;
};