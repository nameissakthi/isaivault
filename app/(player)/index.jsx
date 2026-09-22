import {
    Pressable,
    Text,
    View,
    useColorScheme
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context"

import {
    useState
} from "react";

import {
    useRouter
} from "expo-router";

import {
    MaterialDesignIcons
} from "@react-native-vector-icons/material-design-icons";

import {
    useAudioPlayerContext
} from "../../context/AudioPlayerContext";

import Colors from "../../constants/Colors";
import { formatTime } from "../../constants/Utils";

const Player = () => {

    const theme = useColorScheme();

    const colors = theme === "dark"
        ? Colors.dark
        : Colors.light;

    const router = useRouter();

    const [progressWidth, setProgressWidth] = useState(0);

    const {
        currentMusic,
        status,
        currentTime,
        duration,
        togglePlayback,
        seekTo,
        playNext,
        playPrevious
    } = useAudioPlayerContext();

    const progress = duration > 0
        ? currentTime / duration
        : 0;

    const handleSeek = (event) => {
        if (!progressWidth || duration <= 0) {
            return;
        }

        const { locationX } = event.nativeEvent;

        const position = Math.max(
            0,
            Math.min(
                1,
                locationX / progressWidth
            )
        );

        seekTo(position * duration);
    };

    if (!currentMusic) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
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
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
                paddingHorizontal: 24
            }}
        >

            <View
                style={{
                    height: 64,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >

                <Pressable
                    onPress={() => router.back()}
                    hitSlop={10}
                    style={{
                        width: 44,
                        height: 44,
                        alignItems: "center",
                        justifyContent: "center"
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
                        color: colors.textSecondary,
                        fontSize: 14,
                        fontWeight: "600"
                    }}
                >
                    NOW PLAYING
                </Text>

                <Pressable
                    hitSlop={10}
                    style={{
                        width: 44,
                        height: 44,
                        alignItems: "center",
                        justifyContent: "center"
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
                        backgroundColor: colors.elevated,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: theme === "dark"
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(0,0,0,0.06)"
                    }}
                >
                    <MaterialDesignIcons
                        name="music-note"
                        size={100}
                        color={colors.text}
                    />
                </View>

                <View
                    style={{
                        marginTop: 32
                    }}
                >

                    <Text
                        numberOfLines={2}
                        style={{
                            color: colors.text,
                            fontSize: 24,
                            fontWeight: "700"
                        }}
                    >
                        {currentMusic.name}
                    </Text>

                    <Text
                        style={{
                            color: colors.textSecondary,
                            fontSize: 14,
                            marginTop: 6
                        }}
                    >
                        Audio
                    </Text>

                </View>

                <View
                    style={{
                        marginTop: 30
                    }}
                >

                    <Pressable
                        onPress={handleSeek}
                        onLayout={(event) => {
                            setProgressWidth(
                                event.nativeEvent.layout.width
                            );
                        }}
                        style={{
                            height: 30,
                            justifyContent: "center"
                        }}
                    >

                        <View
                            style={{
                                height: 5,
                                width: "100%",
                                borderRadius: 10,
                                backgroundColor: colors.surface,
                                overflow: "hidden"
                            }}
                        >

                            <View
                                style={{
                                    height: "100%",
                                    width: `${Math.min(
                                        progress * 100,
                                        100
                                    )}%`,
                                    backgroundColor: colors.text,
                                    borderRadius: 10
                                }}
                            />

                        </View>

                    </Pressable>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 4
                        }}
                    >

                        <Text
                            style={{
                                color: colors.textSecondary,
                                fontSize: 12
                            }}
                        >
                            {formatTime(currentTime)}
                        </Text>

                        <Text
                            style={{
                                color: colors.textSecondary,
                                fontSize: 12
                            }}
                        >
                            {formatTime(duration)}
                        </Text>

                    </View>

                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 28
                    }}
                >

                    <Pressable
                        onPress={playPrevious}
                        style={{
                            width: 56,
                            height: 56,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <MaterialDesignIcons
                            name="skip-previous"
                            size={34}
                            color={colors.text}
                        />
                    </Pressable>

                    <Pressable
                        onPress={togglePlayback}
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: 35,
                            backgroundColor: colors.text,
                            alignItems: "center",
                            justifyContent: "center",
                            marginHorizontal: 24
                        }}
                    >
                        <MaterialDesignIcons
                            name={
                                status.playing
                                    ? "pause"
                                    : "play"
                            }
                            size={34}
                            color={colors.background}
                        />
                    </Pressable>

                    <Pressable
                        onPress={playNext}
                        style={{
                            width: 56,
                            height: 56,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <MaterialDesignIcons
                            name="skip-next"
                            size={34}
                            color={colors.text}
                        />
                    </Pressable>

                </View>

            </View>

        </SafeAreaView>
    );
};

export default Player;