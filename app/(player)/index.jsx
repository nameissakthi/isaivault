import {
    Alert,
    Pressable,
    Text,
    View,
    useColorScheme
} from "react-native";

import {
    useState
} from "react";

import {
    useRouter
} from "expo-router";

import {
    SafeAreaView
} from "react-native-safe-area-context";

import {
    MaterialDesignIcons
} from "@react-native-vector-icons/material-design-icons";

import {
    useAudioPlayerContext
} from "../../context/AudioPlayerContext";

import {
    MusicOptionsMenu,
    PlaylistPicker
} from "../../components/components";

import Colors from "../../constants/Colors";

import {
    formatTime
} from "../../constants/Utils";

import {
    deleteDriveFile
} from "../../services/drive/driveService";

import {
    downloadMusicToLocal
} from "../../services/local/localMusicService";

const Player = () => {
    const theme = useColorScheme();

    const colors = theme === "dark"
        ? Colors.dark
        : Colors.light;

    const router = useRouter();

    const [progressWidth, setProgressWidth] =
        useState(0);

    const [
        isMusicOptionsVisible,
        setIsMusicOptionsVisible
    ] = useState(false);

    const [
        isPlaylistPickerVisible,
        setIsPlaylistPickerVisible
    ] = useState(false);

    const {
        currentMusic,
        status,
        currentTime,
        duration,
        togglePlayback,
        seekTo,
        playNext,
        playPrevious,
        addToQueue
    } = useAudioPlayerContext();

    const progress = duration > 0
        ? currentTime / duration
        : 0;

    const handleSeek = (event) => {
        if (!progressWidth || duration <= 0) {
            return;
        }

        const { locationX } =
            event.nativeEvent;

        const position = Math.max(
            0,
            Math.min(
                1,
                locationX / progressWidth
            )
        );

        seekTo(position * duration);
    };

    const handleOpenOptions = () => {
        setIsMusicOptionsVisible(true);
    };

    const handleCloseOptions = () => {
        setIsMusicOptionsVisible(false);
    };

    const handleAddToQueue = () => {
        if (!currentMusic) {
            return;
        }

        addToQueue(currentMusic);
    };

    const handleAddToPlaylist = () => {
        if (!currentMusic) {
            return;
        }

        setIsPlaylistPickerVisible(true);
    };

    const handleDownload = async () => {
        if (!currentMusic) {
            return;
        }

        try {
            const uri =
                await downloadMusicToLocal(
                    currentMusic
                );

            Alert.alert(
                "Download Complete",
                `${currentMusic.name} has been saved to the IsaiVault folder.`
            );

            console.log(
                "Downloaded to:",
                uri
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

    const handleDelete = () => {
        if (!currentMusic) {
            return;
        }

        Alert.alert(
            "Delete Music",
            `Are you sure you want to delete "${currentMusic.name}" from Google Drive?`,
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
                                currentMusic.id
                            );

                            Alert.alert(
                                "Deleted",
                                `${currentMusic.name} has been deleted from Google Drive.`
                            );

                            router.back();
                        } catch (error) {
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

    if (!currentMusic) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor:
                        colors.background,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Text
                    style={{
                        color: colors.text,
                        fontSize: 16
                    }}
                >
                    No music playing
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor:
                        colors.background,
                    paddingHorizontal: 24
                }}
            >
                <View
                    style={{
                        height: 64,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent:
                            "space-between"
                    }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        hitSlop={10}
                        style={{
                            width: 44,
                            height: 44,
                            alignItems: "center",
                            justifyContent:
                                "center"
                        }}
                    >
                        <MaterialDesignIcons
                            name="chevron-down"
                            size={30}
                            color={colors.text}
                        />
                    </Pressable>

                    <Text
                        style={{
                            color:
                                colors.textSecondary,
                            fontSize: 14,
                            fontWeight: "600"
                        }}
                    >
                        NOW PLAYING
                    </Text>

                    <Pressable
                        onPress={handleOpenOptions}
                        hitSlop={10}
                        style={{
                            width: 44,
                            height: 44,
                            alignItems: "center",
                            justifyContent:
                                "center"
                        }}
                    >
                        <MaterialDesignIcons
                            name="dots-vertical"
                            size={25}
                            color={colors.text}
                        />
                    </Pressable>
                </View>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center"
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            aspectRatio: 1,
                            maxWidth: 360,
                            alignSelf: "center",
                            borderRadius: 28,
                            backgroundColor:
                                colors.elevated,
                            alignItems: "center",
                            justifyContent:
                                "center"
                        }}
                    >
                        <MaterialDesignIcons
                            name="music-note"
                            size={110}
                            color={colors.text}
                        />
                    </View>

                    <Text
                        numberOfLines={2}
                        style={{
                            color: colors.text,
                            fontSize: 24,
                            fontWeight: "700",
                            marginTop: 28,
                            textAlign: "center"
                        }}
                    >
                        {currentMusic.name}
                    </Text>

                    <Text
                        style={{
                            color:
                                colors.textSecondary,
                            fontSize: 14,
                            marginTop: 8,
                            textAlign: "center"
                        }}
                    >
                        Audio
                    </Text>

                    <View
                        style={{
                            marginTop: 32
                        }}
                    >
                        <Pressable
                            onPress={handleSeek}
                            onLayout={(event) => {
                                setProgressWidth(
                                    event.nativeEvent
                                        .layout.width
                                );
                            }}
                            style={{
                                height: 5,
                                borderRadius: 10,
                                backgroundColor:
                                    colors.surface,
                                overflow: "hidden"
                            }}
                        >
                            <View
                                style={{
                                    height: "100%",
                                    width:
                                        `${progress * 100}%`,
                                    backgroundColor:
                                        colors.text,
                                    borderRadius: 10
                                }}
                            />
                        </Pressable>

                        <View
                            style={{
                                flexDirection:
                                    "row",
                                justifyContent:
                                    "space-between",
                                marginTop: 8
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        colors.textSecondary,
                                    fontSize: 12
                                }}
                            >
                                {formatTime(
                                    currentTime
                                )}
                            </Text>

                            <Text
                                style={{
                                    color:
                                        colors.textSecondary,
                                    fontSize: 12
                                }}
                            >
                                {formatTime(
                                    duration
                                )}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 30
                        }}
                    >
                        <Pressable
                            onPress={playPrevious}
                            style={{
                                width: 54,
                                height: 54,
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center"
                            }}
                        >
                            <MaterialDesignIcons
                                name="skip-previous"
                                size={32}
                                color={colors.text}
                            />
                        </Pressable>

                        <Pressable
                            onPress={togglePlayback}
                            style={{
                                width: 68,
                                height: 68,
                                borderRadius: 34,
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                backgroundColor:
                                    colors.text
                            }}
                        >
                            <MaterialDesignIcons
                                name={
                                    status.playing
                                        ? "pause"
                                        : "play"
                                }
                                size={34}
                                color={
                                    colors.background
                                }
                            />
                        </Pressable>

                        <Pressable
                            onPress={playNext}
                            style={{
                                width: 54,
                                height: 54,
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center"
                            }}
                        >
                            <MaterialDesignIcons
                                name="skip-next"
                                size={32}
                                color={colors.text}
                            />
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>

            <MusicOptionsMenu
                visible={isMusicOptionsVisible}
                onClose={handleCloseOptions}
                onAddToQueue={handleAddToQueue}
                onAddToPlaylist={handleAddToPlaylist}
                onDownload={handleDownload}
                onDelete={handleDelete}
            />

            <PlaylistPicker
                visible={
                    isPlaylistPickerVisible
                }
                music={currentMusic}
                onClose={() => {
                    setIsPlaylistPickerVisible(
                        false
                    );
                }}
            />
        </>
    );
};

export default Player;