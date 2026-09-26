import { useEffect, useState, useRef } from "react";

import {
    Alert,
    Animated,
    useColorScheme,
    View
} from "react-native";

import {
    MusicCard,
    MusicOptionsMenu,
    ThemedText,
    ThemedView,
    PlaylistPicker
} from "../../components/components";

import { useLibrary } from "../../context/LibraryContext";
import { useAuth } from "../../context/AuthContext";
import Colors from "../../constants/Colors";

import {
    useAudioPlayerContext
} from "../../context/AudioPlayerContext";

import {
    downloadMusicToLocal
} from "../../services/local/localMusicService";

import {
    deleteDriveFile
} from "../../services/drive/driveService";

const index = () => {
    const [musics, setMusics] = useState([]);
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [playlistMusic, setPlaylistMusic] = useState(null);
    const [isPlaylistPickerVisible, setIsPlaylistPickerVisible] = useState(false);

    const {
        getFilesFromGoogleDrive,
        isLibraryLoading
    } = useLibrary();

    const {
        playMusic,
        setQueue,
        addToQueue
    } = useAudioPlayerContext();

    const { user } = useAuth();

    const theme = useColorScheme();

    const colors = theme === "dark"
        ? Colors.dark
        : Colors.light;

    const scrollY =
        useRef(
            new Animated.Value(0)
        ).current;

    useEffect(() => {
        if (isLibraryLoading) {
            return;
        }

        const loadDriveFiles = async () => {
            try {
                const files =
                    await getFilesFromGoogleDrive();

                setMusics(files);
                setQueue(files);
            } catch (error) {
                console.log(
                    error.message
                );
            }
        };

        loadDriveFiles();
    }, [isLibraryLoading]);

    const headerHeight =
        scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [145, 70],
            extrapolate: "clamp"
        });

    const imageSize =
        scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [72, 38],
            extrapolate: "clamp"
        });

    const imageRadius =
        scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [36, 19],
            extrapolate: "clamp"
        });

    const nameSize =
        scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [26, 16],
            extrapolate: "clamp"
        });

    const nameWeight =
        scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [800, 600],
            extrapolate: "clamp"
        });

    const imageTranslateY =
        scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [0, -2],
            extrapolate: "clamp"
        });

    const subtitleOpacity =
        scrollY.interpolate({
            inputRange: [0, 60],
            outputRange: [1, 0],
            extrapolate: "clamp"
        });

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

    const handleDelete = async () => {
        if (!selectedMusic) {
            return;
        }

        Alert.alert(
            "Delete Music",
            `Are you sure you want to delete "${selectedMusic.name}" from Google Drive?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDriveFile(
                                selectedMusic.id
                            );

                            setMusics(current =>
                                current.filter(
                                    music =>
                                        music.id !==
                                        selectedMusic.id
                                )
                            );

                            setSelectedMusic(null);

                            Alert.alert(
                                "Deleted",
                                `${selectedMusic.name} has been deleted from Google Drive.`
                            );
                        } catch (error) {
                            console.log(
                                "Delete Error:",
                                error.message
                            );

                            Alert.alert(
                                "Delete Failed",
                                error.message
                            );
                        }
                    }
                }
            ]
        );
    };

    const handleAddToPlaylist = () => {
        if (!selectedMusic) {
            return;
        }

        setPlaylistMusic(selectedMusic);
        setIsPlaylistPickerVisible(true);
    };

    return (
        <ThemedView
            safe
            style={{
                flex: 1
            }}
        >
            <Animated.View
                style={{
                    height: headerHeight,
                    paddingHorizontal: 20,
                    justifyContent: "flex-end",
                    paddingBottom: 16,
                    backgroundColor:
                        colors.background,
                    zIndex: 10
                }}
            >
                <Animated.View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        transform: [
                            {
                                translateY:
                                    imageTranslateY
                            }
                        ]
                    }}
                >
                    <Animated.Image
                        source={{
                            uri: user?.photo
                        }}
                        style={{
                            width: imageSize,
                            height: imageSize,
                            borderRadius:
                                imageRadius,
                            marginRight: 12
                        }}
                    />

                    <View
                        style={{
                            flex: 1
                        }}
                    >
                        <Animated.Text
                            numberOfLines={1}
                            style={{
                                color: colors.text,
                                fontSize: nameSize,
                                fontWeight:
                                    nameWeight
                            }}
                        >
                            Hello, {user?.name}
                        </Animated.Text>

                        <Animated.Text
                            style={{
                                color:
                                    colors.textSecondary,
                                fontSize: 12,
                                marginTop: 3,
                                opacity:
                                    subtitleOpacity
                            }}
                        >
                            Your music library
                        </Animated.Text>
                    </View>
                </Animated.View>
            </Animated.View>

            <Animated.ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 14,
                    paddingBottom: 110
                }}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: scrollY
                                }
                            }
                        }
                    ],
                    {
                        useNativeDriver: false
                    }
                )}
            >
                <ThemedView
                    style={{
                        marginBottom: 14
                    }}
                >
                    <ThemedText
                        style={{
                            fontSize: 21,
                            fontWeight: "800"
                        }}
                    >
                        Your Music
                    </ThemedText>

                    <ThemedText
                        style={{
                            fontSize: 13,
                            color:
                                colors.textSecondary,
                            marginTop: 4
                        }}
                    >
                        {musics.length}{" "}
                        {musics.length === 1
                            ? "song"
                            : "songs"}
                    </ThemedText>
                </ThemedView>

                {musics.map((music) => {
                    if (!music) {
                        return null;
                    }

                    return (
                        <MusicCard
                            key={music.id}
                            name={music.name}
                            onPress={() =>
                                playMusic(music)
                            }
                            onMenuPress={() =>
                                setSelectedMusic(
                                    music
                                )
                            }
                        />
                    );
                })}
            </Animated.ScrollView>

            <MusicOptionsMenu
                visible={selectedMusic !== null}
                onClose={() => {
                    setSelectedMusic(null);
                }}
                onAddToQueue={() =>
                    addToQueue(selectedMusic)
                }
                onAddToPlaylist={handleAddToPlaylist}
                onDownload={handleDownload}
                onDelete={handleDelete}
            />

            <PlaylistPicker
                visible={isPlaylistPickerVisible}
                music={playlistMusic}
                onClose={() => {
                    setIsPlaylistPickerVisible(false);
                    setPlaylistMusic(null);
                    setSelectedMusic(null);
                }}
            />
        </ThemedView>
    );
};

export default index;