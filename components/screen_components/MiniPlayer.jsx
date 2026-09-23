import {
    Pressable,
    View,
    Text,
    useColorScheme
} from "react-native";

import {
    useEffect,
    useRef
} from "react";

import {
    useRouter,
    useSegments
} from "expo-router";

import {
    MaterialDesignIcons
} from "@react-native-vector-icons/material-design-icons";

import {
    useAudioPlayerContext
} from "../../context/AudioPlayerContext";

import Colors from "../../constants/Colors";

const MiniPlayer = () => {
    const theme = useColorScheme();

    const colors = theme === "dark"
        ? Colors.dark
        : Colors.light;

    const router = useRouter();
    const segments = useSegments();

    const openingPlayer = useRef(false);

    const {
        currentMusic,
        status,
        currentTime,
        duration,
        togglePlayback
    } = useAudioPlayerContext();

    const isPlayerScreen =
        segments.includes("(player)");

    useEffect(() => {
        if (!isPlayerScreen) {
            openingPlayer.current = false;
        }
    }, [isPlayerScreen]);

    const progress = duration > 0
        ? currentTime / duration
        : 0;

    if (!currentMusic || isPlayerScreen) {
        return null;
    }

    const openFullPlayer = () => {
        if (openingPlayer.current) {
            return;
        }

        openingPlayer.current = true;

        router.push("/(player)");
    };

    return (
        <View
            style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 96,
                height: 66,
                borderRadius: 18,
                backgroundColor: colors.elevated,
                borderWidth: 1,
                borderColor: theme === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.08)",
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                elevation: 8,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 3
                },
                shadowOpacity: 0.15,
                shadowRadius: 8
            }}
        >
            <Pressable
                onPress={openFullPlayer}
                disabled={openingPlayer.current}
                style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    opacity: openingPlayer.current
                        ? 0.6
                        : 1
                }}
            >
                <View
                    style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        backgroundColor: colors.surface,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 10
                    }}
                >
                    <MaterialDesignIcons
                        name="music-note"
                        size={23}
                        color={colors.text}
                    />
                </View>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center"
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                            color: colors.text,
                            fontSize: 14,
                            fontWeight: "600"
                        }}
                    >
                        {currentMusic.name}
                    </Text>

                    <Text
                        style={{
                            color: colors.textSecondary,
                            fontSize: 12,
                            marginTop: 3
                        }}
                    >
                        Audio
                    </Text>

                    <View
                        style={{
                            height: 3,
                            width: "100%",
                            backgroundColor: colors.surface,
                            borderRadius: 10,
                            marginTop: 7,
                            overflow: "hidden"
                        }}
                    >
                        <View
                            style={{
                                height: "100%",
                                width: `${Math.min(
                                    progress,
                                    1
                                ) * 100}%`,
                                backgroundColor: colors.text,
                                borderRadius: 10
                            }}
                        />
                    </View>
                </View>
            </Pressable>

            <Pressable
                onPress={togglePlayback}
                disabled={openingPlayer.current}
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: openingPlayer.current
                        ? 0.6
                        : 1
                }}
            >
                <MaterialDesignIcons
                    name={
                        status.playing
                            ? "pause"
                            : "play"
                    }
                    size={27}
                    color={colors.text}
                />
            </Pressable>
        </View>
    );
};

export default MiniPlayer;