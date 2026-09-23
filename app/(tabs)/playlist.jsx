import {
    ThemedText,
    ThemedView
} from "../../components/components";

import {
    StyleSheet,
    View,
    Pressable
} from "react-native";

import {
    useRouter
} from "expo-router";

import {
    usePlaylist
} from "../../context/PlaylistContext";

const Playlist = () => {
    const router = useRouter();

    const {
        playlists
    } = usePlaylist();

    return (
        <ThemedView
            safe
            style={styles.container}
        >
            <View style={styles.header}>
                <ThemedText style={styles.title}>
                    Playlists
                </ThemedText>

                <ThemedText style={styles.subtitle}>
                    {playlists.length} playlists
                </ThemedText>
            </View>

            {playlists.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyTitle}>
                        No playlists yet
                    </ThemedText>

                    <ThemedText style={styles.emptyText}>
                        Create a playlist and start adding your favorite music.
                    </ThemedText>
                </View>
            ) : (
                <View style={styles.playlistContainer}>
                    {playlists.map((playlist) => (
                        <Pressable
                            key={playlist.id}
                            style={({ pressed }) => [
                                styles.playlistCard,
                                pressed && styles.pressed
                            ]}
                            onPress={() => {
                                router.push({
                                    pathname: "/playlist/[id]",
                                    params: {
                                        id: playlist.id
                                    }
                                });
                            }}
                        >
                            <View style={styles.artwork}>
                                <ThemedText style={styles.artworkText}>
                                    ♪
                                </ThemedText>
                            </View>

                            <View style={styles.playlistInfo}>
                                <ThemedText style={styles.playlistName}>
                                    {playlist.name}
                                </ThemedText>

                                <ThemedText style={styles.songCount}>
                                    {playlist.musics.length} songs
                                </ThemedText>
                            </View>

                            <ThemedText style={styles.arrow}>
                                ›
                            </ThemedText>
                        </Pressable>
                    ))}
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
        paddingBottom: 24
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

    playlistContainer: {
        gap: 14
    },

    playlistCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 16,
        backgroundColor: "rgba(128, 128, 128, 0.12)"
    },

    pressed: {
        opacity: 0.7
    },

    artwork: {
        width: 64,
        height: 64,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(128, 128, 128, 0.2)"
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
        lineHeight: 20,
        textAlign: "center"
    }
});

export default Playlist;