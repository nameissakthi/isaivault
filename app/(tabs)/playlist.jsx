import {
    ThemedText,
    ThemedView
} from "../../components/components";

import {
    StyleSheet,
    View,
    Pressable,
    TextInput,
    useColorScheme,
    ActivityIndicator
} from "react-native";

import {
    useRouter
} from "expo-router";

import {
    usePlaylist
} from "../../context/PlaylistContext";

import {
    useState
} from "react";

import Colors from "../../constants/Colors";

const Playlist = () => {
    const router = useRouter();

    const colorScheme =
        useColorScheme() || "light";

    const colors =
        Colors[colorScheme];

    const {
        playlists,
        createPlaylist
    } = usePlaylist();

    const [isCreating, setIsCreating] =
        useState(false);

    const [isCreatingPlaylist, setIsCreatingPlaylist] =
        useState(false);

    const [playlistName, setPlaylistName] =
        useState("");

    const handleCreatePlaylist =
        async () => {
            const name =
                playlistName.trim();

            if (
                !name ||
                isCreatingPlaylist
            ) {
                return;
            }

            try {
                setIsCreatingPlaylist(true);

                const playlist =
                    await createPlaylist(name);

                if (playlist) {
                    setPlaylistName("");
                    setIsCreating(false);
                }
            } catch (error) {
                console.log(
                    "Create Playlist Error:",
                    error.message
                );
            } finally {
                setIsCreatingPlaylist(false);
            }
        };

    return (
        <ThemedView
            safe
            style={[
                styles.container,
                {
                    backgroundColor:
                        colors.background
                }
            ]}
        >
            <View style={styles.header}>
                <View>
                    <ThemedText
                        style={styles.title}
                    >
                        Playlists
                    </ThemedText>

                    <ThemedText
                        style={styles.subtitle}
                    >
                        {playlists.length} playlists
                    </ThemedText>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.addButton,
                        {
                            backgroundColor:
                                colors.secondarySurface,
                            opacity:
                                isCreatingPlaylist ||
                                pressed
                                    ? 0.6
                                    : 1
                        }
                    ]}
                    disabled={
                        isCreatingPlaylist
                    }
                    onPress={() => {
                        setPlaylistName("");
                        setIsCreating(true);
                    }}
                >
                    <ThemedText
                        style={styles.addIcon}
                    >
                        +
                    </ThemedText>
                </Pressable>
            </View>

            {isCreating && (
                <View
                    style={[
                        styles.createContainer,
                        {
                            backgroundColor:
                                colors.surface
                        }
                    ]}
                >
                    <TextInput
                        value={playlistName}
                        onChangeText={
                            setPlaylistName
                        }
                        placeholder="Playlist name"
                        placeholderTextColor={
                            colors.secondaryText
                        }
                        autoFocus
                        editable={
                            !isCreatingPlaylist
                        }
                        style={[
                            styles.input,
                            {
                                color:
                                    colors.text,
                                backgroundColor:
                                    colors.secondarySurface,
                                borderColor:
                                    colors.border
                            }
                        ]}
                        onSubmitEditing={
                            handleCreatePlaylist
                        }
                        returnKeyType="done"
                    />

                    <View
                        style={
                            styles.createActions
                        }
                    >
                        <Pressable
                            style={[
                                styles.actionButton,
                                {
                                    backgroundColor:
                                        colors.secondarySurface,
                                    opacity:
                                        isCreatingPlaylist
                                            ? 0.4
                                            : 1
                                }
                            ]}
                            disabled={
                                isCreatingPlaylist
                            }
                            onPress={() => {
                                setPlaylistName("");
                                setIsCreating(false);
                            }}
                        >
                            <ThemedText>
                                Cancel
                            </ThemedText>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.actionButton,
                                {
                                    backgroundColor:
                                        colors.primary,
                                    opacity:
                                        !playlistName.trim() ||
                                        isCreatingPlaylist
                                            ? 0.4
                                            : 1
                                }
                            ]}
                            onPress={
                                handleCreatePlaylist
                            }
                            disabled={
                                !playlistName.trim() ||
                                isCreatingPlaylist
                            }
                        >
                            {isCreatingPlaylist ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />
                            ) : (
                                <ThemedText
                                    style={{
                                        color:
                                            "#FFFFFF"
                                    }}
                                >
                                    Create
                                </ThemedText>
                            )}
                        </Pressable>
                    </View>
                </View>
            )}

            {playlists.length === 0 ? (
                <View
                    style={
                        styles.emptyContainer
                    }
                >
                    <ThemedText
                        style={
                            styles.emptyTitle
                        }
                    >
                        No playlists yet
                    </ThemedText>

                    <ThemedText
                        style={
                            styles.emptyText
                        }
                    >
                        Create a playlist and start
                        adding your favorite music.
                    </ThemedText>
                </View>
            ) : (
                <View
                    style={
                        styles.playlistContainer
                    }
                >
                    {playlists.map(
                        (playlist) => (
                            <Pressable
                                key={playlist.id}
                                disabled={
                                    isCreatingPlaylist
                                }
                                style={({
                                    pressed
                                }) => [
                                    styles.playlistCard,
                                    {
                                        backgroundColor:
                                            colors.surface,
                                        borderColor:
                                            colors.border,
                                        opacity:
                                            isCreatingPlaylist
                                                ? 0.5
                                                : pressed
                                                    ? 0.7
                                                    : 1
                                    }
                                ]}
                                onPress={() => {
                                    router.push({
                                        pathname:
                                            "/playlist/[id]",
                                        params: {
                                            id:
                                                playlist.id
                                        }
                                    });
                                }}
                            >
                                <View
                                    style={[
                                        styles.artwork,
                                        {
                                            backgroundColor:
                                                colors.secondarySurface
                                        }
                                    ]}
                                >
                                    <ThemedText
                                        style={
                                            styles.artworkText
                                        }
                                    >
                                        ♪
                                    </ThemedText>
                                </View>

                                <View
                                    style={
                                        styles.playlistInfo
                                    }
                                >
                                    <ThemedText
                                        style={
                                            styles.playlistName
                                        }
                                    >
                                        {
                                            playlist.name
                                        }
                                    </ThemedText>

                                    <ThemedText
                                        style={
                                            styles.songCount
                                        }
                                    >
                                        {
                                            playlist
                                                .musics
                                                .length
                                        }{" "}
                                        songs
                                    </ThemedText>
                                </View>

                                <ThemedText
                                    style={
                                        styles.arrow
                                    }
                                >
                                    ›
                                </ThemedText>
                            </Pressable>
                        )
                    )}
                </View>
            )}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
    },

    header: {
        paddingTop: 20,
        paddingBottom: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    title: {
        fontSize: 30,
        fontWeight: "700"
    },

    subtitle: {
        marginTop: 4,
        opacity: 0.6,
        fontSize: 14
    },

    addButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center"
    },

    addIcon: {
        fontSize: 28,
        fontWeight: "400",
        lineHeight: 30
    },

    createContainer: {
        marginBottom: 20,
        padding: 14,
        borderRadius: 16
    },

    input: {
        height: 48,
        paddingHorizontal: 14,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1
    },

    createActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 12,
        gap: 10
    },

    actionButton: {
        minWidth: 80,
        height: 42,
        paddingHorizontal: 18,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },

    playlistContainer: {
        gap: 14
    },

    playlistCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 16,
        borderWidth: 1
    },

    artwork: {
        width: 64,
        height: 64,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center"
    },

    artworkText: {
        fontSize: 30
    },

    playlistInfo: {
        flex: 1,
        marginLeft: 14
    },

    playlistName: {
        fontSize: 17,
        fontWeight: "600"
    },

    songCount: {
        marginTop: 4,
        fontSize: 13,
        opacity: 0.6
    },

    arrow: {
        fontSize: 28,
        opacity: 0.5,
        marginLeft: 8
    },

    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "600"
    },

    emptyText: {
        marginTop: 8,
        textAlign: "center",
        opacity: 0.6,
        lineHeight: 20
    }
});

export default Playlist;