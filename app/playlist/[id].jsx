import {
    Alert,
    StyleSheet,
    View,
    Pressable,
    ScrollView
} from "react-native";

import {
    useLocalSearchParams,
    useRouter
} from "expo-router";

import { useState } from "react";

import {
    ThemedText,
    ThemedView,
    MusicOptionsMenu,
    PlaylistPicker
} from "../../components/components";

import {
    usePlaylist
} from "../../context/PlaylistContext";

import {
    useAudioPlayerContext
} from "../../context/AudioPlayerContext";

import {
    downloadMusicToLocal
} from "../../services/local/localMusicService";

const PlaylistDetails = () => {
    const router = useRouter();

    const { id } =
        useLocalSearchParams();

    const {
        getPlaylist,
        removeMusicFromPlaylist
    } = usePlaylist();

    const {
        playMusic,
        setQueue,
        addToQueue
    } = useAudioPlayerContext();

    const playlist =
        getPlaylist(id);

    const [selectedMusic, setSelectedMusic] =
        useState(null);

    const [playlistMusic, setPlaylistMusic] =
        useState(null);

    const [
        isPlaylistPickerVisible,
        setIsPlaylistPickerVisible
    ] = useState(false);

    if (!playlist) {
        return (
            <ThemedView
                safe
                style={styles.container}
            >
                <Pressable
                    style={styles.backButton}
                    onPress={() =>
                        router.back()
                    }
                >
                    <ThemedText
                        style={
                            styles.backText
                        }
                    >
                        ‹
                    </ThemedText>
                </Pressable>

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
                        Playlist not found
                    </ThemedText>
                </View>
            </ThemedView>
        );
    }

    const handlePlayAll = async () => {
        if (
            playlist.musics.length === 0
        ) {
            return;
        }

        setQueue(
            playlist.musics
        );

        await playMusic(
            playlist.musics[0]
        );
    };

    const handleMusicPress =
        async music => {
            setQueue(
                playlist.musics
            );

            await playMusic(
                music
            );
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

        setPlaylistMusic(
            selectedMusic
        );

        setIsPlaylistPickerVisible(
            true
        );
    };

    const handleClosePlaylistPicker =
        () => {
            setIsPlaylistPickerVisible(
                false
            );

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

    const handleDownload = async () => {
        if (!selectedMusic) {
            return;
        }

        try {
            const uri =
                await downloadMusicToLocal(
                    selectedMusic
                );

            console.log(
                "Downloaded to:",
                uri
            );

            Alert.alert(
                "Download Complete",
                `${selectedMusic.name} has been saved to the IsaiVault folder.`
            );
        } catch (error) {
            console.log(
                "Download Error:",
                error.message
            );

            Alert.alert(
                "Download Failed",
                error.message
            );
        }
    };

    return (
        <ThemedView
            safe
            style={styles.container}
        >
            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.content
                }
            >
                <Pressable
                    style={styles.backButton}
                    onPress={() =>
                        router.back()
                    }
                >
                    <ThemedText
                        style={
                            styles.backText
                        }
                    >
                        ‹
                    </ThemedText>
                </Pressable>

                <View
                    style={styles.hero}
                >
                    <View
                        style={
                            styles.artwork
                        }
                    >
                        <ThemedText
                            style={
                                styles.artworkText
                            }
                        >
                            ♪
                        </ThemedText>
                    </View>

                    <ThemedText
                        style={styles.title}
                    >
                        {playlist.name}
                    </ThemedText>

                    <ThemedText
                        style={
                            styles.songCount
                        }
                    >
                        {playlist.musics.length} songs
                    </ThemedText>
                </View>

                {playlist.musics.length >
                    0 && (
                    <View
                        style={
                            styles.actions
                        }
                    >
                        <Pressable
                            style={({
                                pressed
                            }) => [
                                styles.playButton,
                                pressed &&
                                    styles.pressed
                            ]}
                            onPress={
                                handlePlayAll
                            }
                        >
                            <ThemedText
                                style={
                                    styles.playIcon
                                }
                            >
                                ▶
                            </ThemedText>

                            <ThemedText
                                style={
                                    styles.playText
                                }
                            >
                                Play All
                            </ThemedText>
                        </Pressable>
                    </View>
                )}

                {playlist.musics.length ===
                0 ? (
                    <View
                        style={
                            styles.emptyPlaylist
                        }
                    >
                        <ThemedText
                            style={
                                styles.emptyTitle
                            }
                        >
                            This playlist is empty
                        </ThemedText>

                        <ThemedText
                            style={
                                styles.emptyText
                            }
                        >
                            Add songs from your
                            music library.
                        </ThemedText>
                    </View>
                ) : (
                    <View
                        style={
                            styles.musicList
                        }
                    >
                        {playlist.musics.map(
                            music => (
                                <View
                                    key={
                                        music.id
                                    }
                                    style={
                                        styles.musicRow
                                    }
                                >
                                    <Pressable
                                        style={({
                                            pressed
                                        }) => [
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
                                        <View
                                            style={
                                                styles.musicArtwork
                                            }
                                        >
                                            <ThemedText
                                                style={
                                                    styles.musicIcon
                                                }
                                            >
                                                ♪
                                            </ThemedText>
                                        </View>

                                        <View
                                            style={
                                                styles.musicInfo
                                            }
                                        >
                                            <ThemedText
                                                style={
                                                    styles.musicName
                                                }
                                                numberOfLines={
                                                    1
                                                }
                                            >
                                                {
                                                    music.name
                                                }
                                            </ThemedText>

                                            <ThemedText
                                                style={
                                                    styles.musicSubtitle
                                                }
                                                numberOfLines={
                                                    1
                                                }
                                            >
                                                Audio
                                            </ThemedText>
                                        </View>
                                    </Pressable>

                                    <Pressable
                                        style={
                                            styles.menuButton
                                        }
                                        onPress={() =>
                                            handleOpenMenu(
                                                music
                                            )
                                        }
                                    >
                                        <ThemedText
                                            style={
                                                styles.menuText
                                            }
                                        >
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
                onClose={
                    handleCloseMenu
                }
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
                onDownload={
                    handleDownload
                }
                onRemoveFromPlaylist={
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
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 120
    },
    backButton: {
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8
    },
    backText: {
        fontSize: 38,
        lineHeight: 38,
        opacity: 0.8
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
        marginTop: 4,
        fontSize: 11,
        opacity: 0.5
    },
    menuButton: {
        width: 48,
        height: 60,
        alignItems: "center",
        justifyContent: "center"
    },
    menuText: {
        fontSize: 26,
        lineHeight: 26,
        opacity: 0.6
    },
    emptyPlaylist: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 60,
        paddingHorizontal: 20
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "600"
    },
    emptyText: {
        marginTop: 8,
        fontSize: 14,
        opacity: 0.6,
        textAlign: "center"
    },
    pressed: {
        opacity: 0.7
    }
});

export default PlaylistDetails;