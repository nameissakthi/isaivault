import {
    Alert,
    StyleSheet,
    View,
    Pressable,
    ScrollView,
    TextInput
} from "react-native";

import {
    useLocalSearchParams,
    useRouter
} from "expo-router";

import {
    useState
} from "react";

import {
    ThemedText,
    ThemedView,
    MusicOptionsMenu,
    PlaylistPicker,
    Loading
} from "../../components/components";

import {
    usePlaylist
} from "../../context/PlaylistContext";

import {
    useAudioPlayerContext
} from "../../context/AudioPlayerContext";

const PlaylistDetails = () => {
    const router = useRouter();

    const {
        id
    } = useLocalSearchParams();

    const {
        getPlaylist,
        renamePlaylist,
        deletePlaylist,
        removeMusicFromPlaylist
    } = usePlaylist();

    const {
        playMusic,
        setQueue,
        addToQueue
    } = useAudioPlayerContext();

    const playlist = getPlaylist(id);

    const [isRenaming, setIsRenaming] = useState(false);

    const [
        selectedMusic,
        setSelectedMusic
    ] = useState(null);

    const [
        playlistMusic,
        setPlaylistMusic
    ] = useState(null);

    const [
        isPlaylistPickerVisible,
        setIsPlaylistPickerVisible
    ] = useState(false);

    const [
        isPlaylistMenuVisible,
        setIsPlaylistMenuVisible
    ] = useState(false);

    const [
        isRenameVisible,
        setIsRenameVisible
    ] = useState(false);

    const [
        renameText,
        setRenameText
    ] = useState("");

    if (!playlist) {
        return (
            <ThemedView
                safe
                style={styles.container}
            >
                <View style={styles.topBar}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <ThemedText style={styles.backText}>
                            ‹
                        </ThemedText>
                    </Pressable>
                </View>

                <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyTitle}>
                        Playlist not found
                    </ThemedText>
                </View>
            </ThemedView>
        );
    }

    const handlePlayAll = async () => {
        if (playlist.musics.length === 0) {
            return;
        }

        setQueue(playlist.musics);

        await playMusic(
            playlist.musics[0]
        );
    };

    const handleMusicPress = async music => {
        setQueue(playlist.musics);

        await playMusic(music);
    };

    const handleOpenMenu = music => {
        setSelectedMusic(music);
    };

    const handleCloseMenu = () => {
        setSelectedMusic(null);
    };

    const handleAddToPlaylist = () => {
        if (!selectedMusic) {
            return;
        }

        setPlaylistMusic(selectedMusic);
        setIsPlaylistPickerVisible(true);
    };

    const handleClosePlaylistPicker = () => {
        setIsPlaylistPickerVisible(false);
        setPlaylistMusic(null);
    };

    const handleRemoveFromPlaylist =
        async () => {
            if (!selectedMusic) {
                return;
            }

            const musicId =
                selectedMusic.id;

            const playlistId =
                playlist.id;

            handleCloseMenu();

            await removeMusicFromPlaylist(
                playlistId,
                musicId
            );
        };

    const handleOpenPlaylistMenu = () => {
        setIsPlaylistMenuVisible(
            current => !current
        );
    };

    const handleRenamePress = () => {
        setIsPlaylistMenuVisible(false);
        setRenameText(playlist.name);
        setIsRenameVisible(true);
    };

    const handleRename = async () => {
        if (!playlist) {
            return;
        }

        const trimmedName =
            renameText.trim();

        if (!trimmedName) {
            return;
        }

        setIsRenaming(true);

        const success =
            await renamePlaylist(
                playlist.id,
                trimmedName
            );

        setIsRenaming(false);

        if (!success) {
            Alert.alert(
                "Rename Failed",
                "Could not rename the playlist."
            );
            return;
        }

        setIsRenameVisible(false);
        setRenameText("");
    };

    const handleDeletePress = () => {
        setIsPlaylistMenuVisible(false);

        Alert.alert(
            "Delete Playlist",
            `Are you sure you want to delete "${playlist.name}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const success =
                            await deletePlaylist(
                                playlist.id
                            );

                        if (success) {
                            router.back();
                        } else {
                            Alert.alert(
                                "Delete Failed",
                                "Unable to delete the playlist."
                            );
                        }
                    }
                }
            ]
        );
    };


    if (isRenaming) {
        return <Loading width={180} height={180} />;
    }

    return (
        <ThemedView
            safe
            style={styles.container}
        >
            <View style={styles.topBar}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ThemedText style={styles.backText}>
                        ‹
                    </ThemedText>
                </Pressable>

                <Pressable
                    style={styles.playlistMenuButton}
                    onPress={handleOpenPlaylistMenu}
                >
                    <ThemedText style={styles.playlistMenuText}>
                        ⋮
                    </ThemedText>
                </Pressable>

                {isPlaylistMenuVisible && (
                    <View style={styles.playlistMenu}>
                        <Pressable
                            style={styles.playlistMenuItem}
                            onPress={handleRenamePress}
                        >
                            <ThemedText style={styles.playlistMenuItemText}>
                                Rename
                            </ThemedText>
                        </Pressable>

                        <Pressable
                            style={styles.playlistMenuItem}
                            onPress={handleDeletePress}
                        >
                            <ThemedText
                                style={[
                                    styles.playlistMenuItemText,
                                    styles.deleteText
                                ]}
                            >
                                Delete
                            </ThemedText>
                        </Pressable>
                    </View>
                )}
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.content
                }
            >
                <View style={styles.hero}>
                    <View style={styles.artwork}>
                        <ThemedText style={styles.artworkText}>
                            ♪
                        </ThemedText>
                    </View>

                    <ThemedText style={styles.title}>
                        {playlist.name}
                    </ThemedText>

                    <ThemedText style={styles.songCount}>
                        {playlist.musics.length} songs
                    </ThemedText>
                </View>

                {playlist.musics.length > 0 && (
                    <View style={styles.actions}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.playButton,
                                pressed &&
                                styles.pressed
                            ]}
                            onPress={handlePlayAll}
                        >
                            <ThemedText style={styles.playIcon}>
                                ▶
                            </ThemedText>

                            <ThemedText style={styles.playText}>
                                Play All
                            </ThemedText>
                        </Pressable>
                    </View>
                )}

                {playlist.musics.length === 0 ? (
                    <View style={styles.emptyPlaylist}>
                        <ThemedText style={styles.emptyTitle}>
                            This playlist is empty
                        </ThemedText>

                        <ThemedText style={styles.emptyText}>
                            Add songs from your music library.
                        </ThemedText>
                    </View>
                ) : (
                    <View style={styles.musicList}>
                        {playlist.musics.map(
                            music => (
                                <View
                                    key={music.id}
                                    style={styles.musicRow}
                                >
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.musicContent,
                                            pressed &&
                                            styles.pressed
                                        ]}
                                        onPress={() =>
                                            handleMusicPress(
                                                music
                                            )
                                        }
                                    >
                                        <View style={styles.musicArtwork}>
                                            <ThemedText
                                                style={styles.musicIcon}
                                            >
                                                ♪
                                            </ThemedText>
                                        </View>

                                        <View style={styles.musicInfo}>
                                            <ThemedText
                                                style={styles.musicName}
                                                numberOfLines={1}
                                            >
                                                {music.name}
                                            </ThemedText>

                                            <ThemedText
                                                style={styles.musicSubtitle}
                                                numberOfLines={1}
                                            >
                                                Audio
                                            </ThemedText>
                                        </View>
                                    </Pressable>

                                    <Pressable
                                        style={styles.menuButton}
                                        onPress={() =>
                                            handleOpenMenu(
                                                music
                                            )
                                        }
                                    >
                                        <ThemedText style={styles.menuText}>
                                            ⋮
                                        </ThemedText>
                                    </Pressable>
                                </View>
                            )
                        )}
                    </View>
                )}
            </ScrollView>

            <MusicOptionsMenu
                visible={
                    selectedMusic !== null
                }
                onClose={handleCloseMenu}
                onAddToQueue={() => {
                    if (selectedMusic) {
                        addToQueue(
                            selectedMusic
                        );
                    }
                }}
                onAddToPlaylist={
                    handleAddToPlaylist
                }
                onDownload={() => {
                    if (selectedMusic) {
                        console.log(
                            "Download:",
                            selectedMusic
                        );
                    }
                }}
                onDelete={
                    handleRemoveFromPlaylist
                }
            />

            <PlaylistPicker
                visible={
                    isPlaylistPickerVisible
                }
                music={playlistMusic}
                onClose={
                    handleClosePlaylistPicker
                }
            />

            {isRenameVisible && (
                <View style={styles.renameOverlay}>
                    <View style={styles.renameModal}>
                        <ThemedText style={styles.renameTitle}>
                            Rename Playlist
                        </ThemedText>

                        <TextInput
                            value={renameText}
                            onChangeText={setRenameText}
                            placeholder="Playlist name"
                            placeholderTextColor="rgba(128, 128, 128, 0.7)"
                            style={styles.renameInput}
                            autoFocus
                            selectTextOnFocus
                        />

                        <View style={styles.renameActions}>
                            <Pressable
                                style={styles.renameCancelButton}
                                onPress={() =>
                                    setIsRenameVisible(false)
                                }
                            >
                                <ThemedText>
                                    Cancel
                                </ThemedText>
                            </Pressable>

                            <Pressable
                                style={styles.renameSaveButton}
                                onPress={handleRename}
                            >
                                <ThemedText>
                                    Save
                                </ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    topBar: {
        height: 54,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        position: "relative",
        zIndex: 10
    },

    backButton: {
        width: 44,
        height: 44,
        alignItems: "flex-start",
        justifyContent: "center"
    },

    backText: {
        fontSize: 38,
        lineHeight: 38,
        opacity: 0.8
    },

    playlistMenuButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center"
    },

    playlistMenuText: {
        fontSize: 28,
        lineHeight: 30,
        opacity: 0.8
    },

    playlistMenu: {
        position: "absolute",
        top: 48,
        right: 16,
        width: 150,
        borderRadius: 14,
        paddingVertical: 6,
        backgroundColor: "rgba(60, 60, 60, 0.98)",
        zIndex: 20,
        elevation: 8
    },

    playlistMenuItem: {
        paddingHorizontal: 16,
        paddingVertical: 13
    },

    playlistMenuItemText: {
        fontSize: 15
    },

    deleteText: {
        color: "#ff5c5c"
    },

    content: {
        paddingHorizontal: 16,
        paddingBottom: 40
    },

    hero: {
        alignItems: "center",
        marginTop: 10
    },

    artwork: {
        width: 150,
        height: 150,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
            "rgba(128, 128, 128, 0.15)"
    },

    artworkText: {
        fontSize: 64
    },

    title: {
        marginTop: 20,
        fontSize: 26,
        fontWeight: "700",
        textAlign: "center"
    },

    songCount: {
        marginTop: 5,
        fontSize: 14,
        opacity: 0.6
    },

    actions: {
        marginTop: 24,
        alignItems: "center"
    },

    playButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 13,
        borderRadius: 30,
        backgroundColor:
            "rgba(128, 128, 128, 0.18)"
    },

    playIcon: {
        fontSize: 15
    },

    playText: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: "600"
    },

    musicList: {
        marginTop: 28,
        gap: 8
    },

    musicRow: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 68,
        borderRadius: 14,
        backgroundColor:
            "rgba(128, 128, 128, 0.08)"
    },

    musicContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 8
    },

    musicArtwork: {
        width: 52,
        height: 52,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
            "rgba(128, 128, 128, 0.15)"
    },

    musicIcon: {
        fontSize: 24
    },

    musicInfo: {
        flex: 1,
        marginLeft: 12
    },

    musicName: {
        fontSize: 15,
        fontWeight: "600"
    },

    musicSubtitle: {
        marginTop: 3,
        fontSize: 12,
        opacity: 0.5
    },

    menuButton: {
        width: 48,
        height: 60,
        alignItems: "center",
        justifyContent: "center"
    },

    menuText: {
        fontSize: 24,
        opacity: 0.7
    },

    emptyPlaylist: {
        alignItems: "center",
        marginTop: 60
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "600"
    },

    emptyText: {
        marginTop: 8,
        fontSize: 14,
        opacity: 0.5,
        textAlign: "center"
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    pressed: {
        opacity: 0.6
    },

    renameOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        zIndex: 100,
        elevation: 100
    },

    renameModal: {
        width: "100%",
        maxWidth: 360,
        borderRadius: 18,
        padding: 20,
        backgroundColor: "rgba(45, 45, 45, 0.98)"
    },

    renameTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 18
    },

    renameInput: {
        height: 48,
        borderRadius: 10,
        paddingHorizontal: 14,
        fontSize: 16,
        color: "#ffffff",
        backgroundColor: "rgba(128, 128, 128, 0.15)"
    },

    renameActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 18,
        gap: 10
    },

    renameCancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 10
    },

    renameSaveButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor:
            "rgba(128, 128, 128, 0.2)"
    }
});

export default PlaylistDetails;