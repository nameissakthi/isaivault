import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getDrivePlaylists,
    saveDrivePlaylists
} from "../services/drive/driveService";

import {
    useAuth
} from "./AuthContext";

const PlaylistContext =
    createContext(null);

export const PlaylistProvider = ({
    children
}) => {
    const {
        isAuthenticated
    } = useAuth();

    const [
        playlists,
        setPlaylists
    ] = useState([]);

    const [
        isPlaylistLoading,
        setIsPlaylistLoading
    ] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            setPlaylists([]);
            setIsPlaylistLoading(false);
            return;
        }

        loadPlaylists();
    }, [isAuthenticated]);

    const loadPlaylists = async () => {
        try {
            setIsPlaylistLoading(true);

            const storedPlaylists =
                await getDrivePlaylists();

            setPlaylists(
                Array.isArray(
                    storedPlaylists
                )
                    ? storedPlaylists
                    : []
            );
        } catch (error) {
            console.log(
                "Playlist Load Error:",
                error.message
            );

            setPlaylists([]);
        } finally {
            setIsPlaylistLoading(false);
        }
    };

    const savePlaylists = async (
        updatedPlaylists
    ) => {
        try {
            await saveDrivePlaylists(
                updatedPlaylists
            );

            setPlaylists(
                updatedPlaylists
            );

            return true;
        } catch (error) {
            console.log(
                "Playlist Save Error:",
                error.message
            );

            return false;
        }
    };

    const createPlaylist = async (
        name
    ) => {
        const trimmedName =
            name.trim();

        if (!trimmedName) {
            return null;
        }

        const existingPlaylist =
            playlists.find(
                playlist =>
                    playlist.name.toLowerCase() ===
                    trimmedName.toLowerCase()
            );

        if (existingPlaylist) {
            return null;
        }

        const newPlaylist = {
            id: Date.now().toString(),
            name: trimmedName,
            musics: []
        };

        const updatedPlaylists = [
            ...playlists,
            newPlaylist
        ];

        const saved =
            await savePlaylists(
                updatedPlaylists
            );

        if (!saved) {
            return null;
        }

        return newPlaylist;
    };

    const renamePlaylist = async (
        playlistId,
        newName
    ) => {
        const trimmedName =
            newName.trim();

        if (!playlistId || !trimmedName) {
            return false;
        }

        const existingPlaylist =
            playlists.find(
                playlist =>
                    playlist.id !== playlistId &&
                    playlist.name.toLowerCase() ===
                    trimmedName.toLowerCase()
            );

        if (existingPlaylist) {
            return false;
        }

        const updatedPlaylists =
            playlists.map(
                playlist => {
                    if (
                        playlist.id !==
                        playlistId
                    ) {
                        return playlist;
                    }

                    return {
                        ...playlist,
                        name: trimmedName
                    };
                }
            );

        return await savePlaylists(
            updatedPlaylists
        );
    };

    const deletePlaylist = async (
        playlistId
    ) => {
        const updatedPlaylists =
            playlists.filter(
                playlist =>
                    playlist.id !==
                    playlistId
            );

        return await savePlaylists(
            updatedPlaylists
        );
    };

    const addMusicToPlaylist = async (
        playlistId,
        music
    ) => {
        if (!playlistId || !music) {
            return false;
        }

        try {
            const currentPlaylists =
                await getDrivePlaylists();

            if (!Array.isArray(currentPlaylists)) {
                return false;
            }

            const playlistExists =
                currentPlaylists.some(
                    playlist =>
                        playlist.id === playlistId
                );

            if (!playlistExists) {
                console.log(
                    "Playlist not found:",
                    playlistId
                );

                return false;
            }

            const updatedPlaylists =
                currentPlaylists.map(
                    playlist => {
                        if (
                            playlist.id !==
                            playlistId
                        ) {
                            return playlist;
                        }

                        const existingMusics =
                            Array.isArray(
                                playlist.musics
                            )
                                ? playlist.musics
                                : [];

                        const alreadyExists =
                            existingMusics.some(
                                item =>
                                    item.id ===
                                    music.id
                            );

                        if (alreadyExists) {
                            return playlist;
                        }

                        return {
                            ...playlist,
                            musics: [
                                ...existingMusics,
                                music
                            ]
                        };
                    }
                );

            const saved =
                await savePlaylists(
                    updatedPlaylists
                );

            if (!saved) {
                return false;
            }

            return true;
        } catch (error) {
            console.log(
                "Add Music To Playlist Error:",
                error.message
            );

            return false;
        }
    };

    const removeMusicFromPlaylist =
        async (
            playlistId,
            musicId
        ) => {
            const updatedPlaylists =
                playlists.map(
                    playlist => {
                        if (
                            playlist.id !==
                            playlistId
                        ) {
                            return playlist;
                        }

                        return {
                            ...playlist,
                            musics:
                                playlist.musics.filter(
                                    music =>
                                        music.id !==
                                        musicId
                                )
                        };
                    }
                );

            return await savePlaylists(
                updatedPlaylists
            );
        };

    const getPlaylist = (
        playlistId
    ) => {
        return playlists.find(
            playlist =>
                playlist.id ===
                playlistId
        );
    };

    const value = {
        playlists,
        isPlaylistLoading,
        createPlaylist,
        renamePlaylist,
        deletePlaylist,
        addMusicToPlaylist,
        removeMusicFromPlaylist,
        getPlaylist,
        loadPlaylists
    };

    return (
        <PlaylistContext.Provider
            value={value}
        >
            {children}
        </PlaylistContext.Provider>
    );
};

export const usePlaylist = () => {
    const context =
        useContext(
            PlaylistContext
        );

    if (!context) {
        throw new Error(
            "usePlaylist must be used inside PlaylistProvider"
        );
    }

    return context;
};