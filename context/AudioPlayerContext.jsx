
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

import { getDriveAudioSource } from "../services/drive/driveService";

const AudioPlayerContext = createContext(null);

const sameMusic = (first, second) =>
    first && second &&
    String(first.id) === String(second.id);

export const AudioPlayerProvider = ({ children }) => {
    const [currentMusic, setCurrentMusic] = useState(null);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const player = useAudioPlayer(null);
    const status = useAudioPlayerStatus(player);

    const queueRef = useRef([]);
    const currentMusicRef = useRef(null);
    const currentIndexRef = useRef(-1);
    const queuedIdsRef = useRef(new Set());
    const shouldPlayAfterLoad = useRef(false);
    const changingTrack = useRef(false);
    const finishHandled = useRef(false);

    const currentTime = status.currentTime ?? 0;
    const duration = status.duration ?? 0;

    const commitQueue = (nextQueue) => {
        queueRef.current = nextQueue;
        setQueue(nextQueue);
    };

    const commitCurrentIndex = (index) => {
        currentIndexRef.current = index;
        setCurrentIndex(index);
    };

    const commitCurrentMusic = (music) => {
        currentMusicRef.current = music;
        setCurrentMusic(music);
    };

    const loadQueueMusic = async (music, index) => {
        if (!music || changingTrack.current) return;

        changingTrack.current = true;
        shouldPlayAfterLoad.current = true;
        finishHandled.current = false;

        try {
            const source = await getDriveAudioSource(music.id);

            commitCurrentMusic(music);
            commitCurrentIndex(index);

            player.replace(source);
        } catch (error) {
            shouldPlayAfterLoad.current = false;
            console.log("Unable to load music:", error.message);
        } finally {
            changingTrack.current = false;
        }
    };

    const playMusic = async (music, playbackQueue = null) => {
        if (!music || changingTrack.current) return;

        let nextQueue = Array.isArray(playbackQueue)
            ? [...playbackQueue]
            : [...queueRef.current];

        if (Array.isArray(playbackQueue)) {
            queuedIdsRef.current.clear();
        }

        let index = nextQueue.findIndex(
            item => sameMusic(item, music)
        );

        if (index === -1) {
            nextQueue.push(music);
            index = nextQueue.length - 1;
        } else {
            nextQueue[index] = music;
        }

        commitQueue(nextQueue);

        await loadQueueMusic(music, index);
    };

    const addToQueue = (music) => {
        if (!music) return;

        const activeMusic = currentMusicRef.current;
        let nextQueue = [...queueRef.current];

        if (!activeMusic) {
            const alreadyExists = nextQueue.some(
                item => sameMusic(item, music)
            );

            if (!alreadyExists) {
                nextQueue.push(music);
                commitQueue(nextQueue);
            }

            return;
        }

        if (sameMusic(activeMusic, music)) return;

        if (queuedIdsRef.current.has(String(music.id))) return;

        let activeIndex = currentIndexRef.current;

        if (activeIndex < 0 || !sameMusic(nextQueue[activeIndex], activeMusic)) {
            activeIndex = nextQueue.findIndex(
                item => sameMusic(item, activeMusic)
            );

            if (activeIndex === -1) {
                nextQueue = [activeMusic, ...nextQueue];
                activeIndex = 0;
            }
        }

        const existingIndex = nextQueue.findIndex(
            item => sameMusic(item, music)
        );

        if (existingIndex !== -1) {
            nextQueue.splice(existingIndex, 1);

            if (existingIndex < activeIndex) {
                activeIndex -= 1;
            }
        }

        let insertIndex = activeIndex + 1;

        while (
            insertIndex < nextQueue.length &&
            queuedIdsRef.current.has(String(nextQueue[insertIndex].id))
        ) {
            insertIndex += 1;
        }

        nextQueue.splice(insertIndex, 0, music);
        queuedIdsRef.current.add(String(music.id));

        commitQueue(nextQueue);
        commitCurrentIndex(activeIndex);
    };

    const removeFromQueue = (musicId) => {
        const nextQueue = [...queueRef.current];
        const removeIndex = nextQueue.findIndex(
            item => String(item.id) === String(musicId)
        );

        if (removeIndex === -1) return;
        if (removeIndex === currentIndexRef.current) return;

        nextQueue.splice(removeIndex, 1);
        queuedIdsRef.current.delete(String(musicId));

        if (removeIndex < currentIndexRef.current) {
            commitCurrentIndex(currentIndexRef.current - 1);
        }

        commitQueue(nextQueue);
    };

    const setPlaybackQueue = (musics) => {
        if (!Array.isArray(musics)) return;

        const nextQueue = [...musics];

        queuedIdsRef.current.clear();
        commitQueue(nextQueue);

        const index = currentMusicRef.current
            ? nextQueue.findIndex(
                item => sameMusic(item, currentMusicRef.current)
            )
            : -1;

        commitCurrentIndex(index);
    };

    const clearQueue = () => {
        shouldPlayAfterLoad.current = false;
        finishHandled.current = false;
        queuedIdsRef.current.clear();

        commitQueue([]);
        commitCurrentMusic(null);
        commitCurrentIndex(-1);

        player.pause();
        player.replace(null);
    };

    const togglePlayback = () => {
        if (!currentMusicRef.current) return;

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
        if (!currentMusicRef.current) return;

        player.play();
    };

    const stopMusic = () => {
        shouldPlayAfterLoad.current = false;
        finishHandled.current = false;

        player.pause();
        player.seekTo(0);

        commitCurrentMusic(null);
        commitCurrentIndex(-1);
    };

    const seekTo = (position) => {
        player.seekTo(position);
    };

    const playNext = async () => {
        if (changingTrack.current) return;

        const nextIndex = currentIndexRef.current + 1;
        const nextQueue = queueRef.current;

        if (nextIndex < 0 || nextIndex >= nextQueue.length) return;

        const nextMusic = nextQueue[nextIndex];

        queuedIdsRef.current.delete(String(nextMusic.id));

        await loadQueueMusic(nextMusic, nextIndex);
    };

    const playPrevious = async () => {
        if (changingTrack.current) return;

        const previousIndex = currentIndexRef.current - 1;

        if (previousIndex < 0) return;

        const previousMusic = queueRef.current[previousIndex];

        await loadQueueMusic(previousMusic, previousIndex);
    };

    useEffect(() => {
        if (!status.didJustFinish) {
            finishHandled.current = false;
            return;
        }

        if (finishHandled.current) return;

        finishHandled.current = true;
        playNext();
    }, [status.didJustFinish]);

    useEffect(() => {
        if (!shouldPlayAfterLoad.current) return;
        if (!status.isLoaded) return;

        shouldPlayAfterLoad.current = false;
        player.play();
    }, [status.isLoaded, status.duration, currentMusic]);

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
