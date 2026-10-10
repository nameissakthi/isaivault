import {
    useEffect,
    useState
} from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    useColorScheme
} from "react-native";

import { useRouter } from "expo-router";

import { useAuth } from "../../context/AuthContext";
import { useLibrary } from "../../context/LibraryContext";
import { useAudioPlayerContext } from "../../context/AudioPlayerContext";

import Colors from "../../constants/Colors";

import {
    MusicCard,
    MusicOptionsMenu,
    PlaylistPicker
} from "../../components/components";

const Home = () => {
    const router = useRouter();

    const colorScheme = useColorScheme();

    const colors = Colors[
        colorScheme === "dark" ? "dark" : "light"
    ];

    const { user } = useAuth();

    const {
        isLibraryLoading,
        getFilesFromGoogleDrive
    } = useLibrary();

    const {
        playMusic,
        addToQueue
    } = useAudioPlayerContext();

    const [musics, setMusics] = useState([]);
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaylistPickerVisible, setIsPlaylistPickerVisible] = useState(false);

    useEffect(() => {
        if (isLibraryLoading) return;

        loadMusic();
    }, [isLibraryLoading]);

    const loadMusic = async () => {
        try {
            setIsLoading(true);

            const files = await getFilesFromGoogleDrive();

            setMusics(files);
        } catch (error) {
            console.log(
                "Unable to load music:",
                error.message
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlayMusic = async music => {
        await playMusic(music, musics);
    };

    const handleAddToQueue = () => {
        if (!selectedMusic) return;

        addToQueue(selectedMusic);
    };

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background
                }
            ]}
        >
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View>
                        <Text
                            style={[
                                styles.greeting,
                                {
                                    color: colors.text
                                }
                            ]}
                        >
                            Hello
                        </Text>

                        <Text
                            style={[
                                styles.username,
                                {
                                    color: colors.text
                                }
                            ]}
                            numberOfLines={1}
                        >
                            {user?.name || "Music Lover"}
                        </Text>
                    </View>

                    <Pressable
                        onPress={() => router.push("/(tabs)/settings")}
                        style={[
                            styles.profile,
                            {
                                backgroundColor: colors.card
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styles.profileText,
                                {
                                    color: colors.text
                                }
                            ]}
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.titleContainer}>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: colors.text
                            }
                        ]}
                    >
                        Your Music
                    </Text>

                    <Text
                        style={[
                            styles.count,
                            {
                                color: colors.secondaryText
                            }
                        ]}
                    >
                        {musics.length} songs
                    </Text>
                </View>

                {isLoading ? (
                    <View style={styles.emptyContainer}>
                        <Text
                            style={[
                                styles.emptyText,
                                {
                                    color: colors.secondaryText
                                }
                            ]}
                        >
                            Loading music...
                        </Text>
                    </View>
                ) : musics.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text
                            style={[
                                styles.emptyText,
                                {
                                    color: colors.secondaryText
                                }
                            ]}
                        >
                            No music found
                        </Text>
                    </View>
                ) : (
                    <View style={styles.musicList}>
                        {musics.map(music => (
                            <MusicCard
                                key={music.id}
                                name={music.name}
                                onPress={() => handlePlayMusic(music)}
                                onMenuPress={() => setSelectedMusic(music)}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            <MusicOptionsMenu
                visible={selectedMusic !== null}
                onClose={() => setSelectedMusic(null)}
                onAddToQueue={handleAddToQueue}
                onAddToPlaylist={() => setIsPlaylistPickerVisible(true)}
                onDownload={() => {
                    console.log("Download:", selectedMusic);
                }}
                onDelete={() => {
                    console.log("Delete:", selectedMusic);
                }}
            />

            <PlaylistPicker
                visible={isPlaylistPickerVisible}
                music={selectedMusic}
                onClose={() => {
                    setIsPlaylistPickerVisible(false);
                    setSelectedMusic(null);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 140
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30
    },
    greeting: {
        fontSize: 15,
        opacity: 0.7
    },
    username: {
        fontSize: 25,
        fontWeight: "700",
        marginTop: 3,
        maxWidth: 250
    },
    profile: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: "center",
        justifyContent: "center"
    },
    profileText: {
        fontSize: 18,
        fontWeight: "700"
    },
    titleContainer: {
        marginBottom: 18
    },
    title: {
        fontSize: 23,
        fontWeight: "700"
    },
    count: {
        fontSize: 13,
        marginTop: 4
    },
    musicList: {
        gap: 12
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 80
    },
    emptyText: {
        fontSize: 15
    }
});

export default Home;