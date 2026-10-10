import {
    Animated,
    Easing,
    Modal,
    Pressable,
    ScrollView,
    View,
    useColorScheme
} from "react-native";

import {
    useEffect,
    useRef
} from "react";

import {
    MaterialDesignIcons
} from "@react-native-vector-icons/material-design-icons";

import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";

import Colors from "../../constants/Colors";

import {
    useAudioPlayerContext
} from "../../context/AudioPlayerContext";

const QueueSheet = ({ visible, onClose }) => {
    const theme = useColorScheme();

    const colors = theme === "dark"
        ? Colors.dark
        : Colors.light;

    const {
        queue,
        currentMusic,
        currentIndex,
        playMusic,
        removeFromQueue,
        clearQueue
    } = useAudioPlayerContext();

    const slideY = useRef(
        new Animated.Value(500)
    ).current;

    const opacity = useRef(
        new Animated.Value(0)
    ).current;

    useEffect(() => {
        if (!visible) return;

        slideY.setValue(500);
        opacity.setValue(0);

        Animated.parallel([
            Animated.timing(slideY, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 220,
                useNativeDriver: true
            })
        ]).start();
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(slideY, {
                toValue: 500,
                duration: 240,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true
            })
        ]).start(() => {
            onClose?.();
        });
    };

    const handlePlayMusic = async music => {
        await playMusic(music, queue);
    };

    const handleClearQueue = () => {
        clearQueue();
        handleClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={handleClose}
        >
            <Animated.View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.45)",
                    opacity
                }}
            >
                <Pressable
                    onPress={handleClose}
                    style={{
                        flex: 1,
                        justifyContent: "flex-end"
                    }}
                >
                    <Pressable
                        onPress={event => event.stopPropagation()}
                    >
                        <Animated.View
                            style={{
                                transform: [{ translateY: slideY }]
                            }}
                        >
                            <ThemedView
                                style={{
                                    maxHeight: "78%",
                                    marginHorizontal: 10,
                                    marginBottom: 10,
                                    paddingTop: 10,
                                    paddingHorizontal: 16,
                                    paddingBottom: 18,
                                    borderRadius: 26,
                                    backgroundColor: colors.elevated,
                                    borderWidth: 1,
                                    borderColor: theme === "dark"
                                        ? "rgba(255,255,255,0.08)"
                                        : "rgba(0,0,0,0.08)",
                                    elevation: 12
                                }}
                            >
                                <View
                                    style={{
                                        width: 40,
                                        height: 4,
                                        borderRadius: 10,
                                        alignSelf: "center",
                                        backgroundColor: colors.textSecondary,
                                        opacity: 0.4,
                                        marginBottom: 16
                                    }}
                                />

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginBottom: 18
                                    }}
                                >
                                    <View>
                                        <ThemedText
                                            style={{
                                                fontSize: 22,
                                                fontWeight: "700"
                                            }}
                                        >
                                            Playing Queue
                                        </ThemedText>

                                        <ThemedText
                                            style={{
                                                fontSize: 13,
                                                color: colors.textSecondary,
                                                marginTop: 4
                                            }}
                                        >
                                            {queue.length} {queue.length === 1 ? "song" : "songs"}
                                        </ThemedText>
                                    </View>

                                    <Pressable
                                        onPress={handleClose}
                                        hitSlop={10}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <MaterialDesignIcons
                                            name="close"
                                            size={24}
                                            color={colors.text}
                                        />
                                    </Pressable>
                                </View>

                                {queue.length > 0 && (
                                    <Pressable
                                        onPress={handleClearQueue}
                                        style={{
                                            alignSelf: "flex-start",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingHorizontal: 12,
                                            paddingVertical: 9,
                                            borderRadius: 20,
                                            backgroundColor: colors.surface,
                                            marginBottom: 12
                                        }}
                                    >
                                        <MaterialDesignIcons
                                            name="delete-sweep-outline"
                                            size={19}
                                            color="#ef4444"
                                        />

                                        <ThemedText
                                            style={{
                                                marginLeft: 7,
                                                fontSize: 13,
                                                fontWeight: "600",
                                                color: "#ef4444"
                                            }}
                                        >
                                            Clear queue
                                        </ThemedText>
                                    </Pressable>
                                )}

                                {queue.length === 0 ? (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            paddingVertical: 48
                                        }}
                                    >
                                        <MaterialDesignIcons
                                            name="playlist-music-outline"
                                            size={54}
                                            color={colors.textSecondary}
                                        />

                                        <ThemedText
                                            style={{
                                                fontSize: 16,
                                                fontWeight: "600",
                                                marginTop: 12
                                            }}
                                        >
                                            Your queue is empty
                                        </ThemedText>

                                        <ThemedText
                                            style={{
                                                fontSize: 13,
                                                color: colors.textSecondary,
                                                marginTop: 6,
                                                textAlign: "center"
                                            }}
                                        >
                                            Add songs from your music options.
                                        </ThemedText>
                                    </View>
                                ) : (
                                    <ScrollView
                                        style={{
                                            flexGrow: 0
                                        }}
                                        contentContainerStyle={{
                                            paddingBottom: 8
                                        }}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        {queue.map((music, index) => {
                                            const isCurrent = currentMusic?.id === music.id;

                                            return (
                                                <View
                                                    key={`${music.id}-${index}`}
                                                    style={{
                                                        minHeight: 68,
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        paddingHorizontal: 8,
                                                        paddingVertical: 7,
                                                        marginBottom: 5,
                                                        borderRadius: 14,
                                                        backgroundColor: isCurrent
                                                            ? "rgba(34,197,94,0.12)"
                                                            : "transparent",
                                                        borderWidth: isCurrent ? 1 : 0,
                                                        borderColor: isCurrent
                                                            ? "rgba(34,197,94,0.35)"
                                                            : "transparent"
                                                    }}
                                                >
                                                    <Pressable
                                                        onPress={() => handlePlayMusic(music)}
                                                        style={{
                                                            flex: 1,
                                                            flexDirection: "row",
                                                            alignItems: "center"
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                width: 46,
                                                                height: 46,
                                                                borderRadius: 12,
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                backgroundColor: colors.surface
                                                            }}
                                                        >
                                                            <MaterialDesignIcons
                                                                name={isCurrent ? "volume-high" : "music-note"}
                                                                size={23}
                                                                color={isCurrent ? "#22c55e" : colors.text}
                                                            />
                                                        </View>

                                                        <View
                                                            style={{
                                                                flex: 1,
                                                                marginLeft: 12,
                                                                marginRight: 8
                                                            }}
                                                        >
                                                            <ThemedText
                                                                numberOfLines={1}
                                                                style={{
                                                                    fontSize: 14,
                                                                    fontWeight: isCurrent ? "700" : "600",
                                                                    color: isCurrent ? "#22c55e" : colors.text
                                                                }}
                                                            >
                                                                {music.name || "Unknown song"}
                                                            </ThemedText>

                                                            <ThemedText
                                                                numberOfLines={1}
                                                                style={{
                                                                    fontSize: 12,
                                                                    color: colors.textSecondary,
                                                                    marginTop: 4
                                                                }}
                                                            >
                                                                {isCurrent
                                                                    ? "Now playing"
                                                                    : index > currentIndex && currentIndex >= 0
                                                                        ? "Up next"
                                                                        : "In queue"}
                                                            </ThemedText>
                                                        </View>
                                                    </Pressable>

                                                    {!isCurrent && (
                                                        <Pressable
                                                            onPress={() => removeFromQueue(music.id)}
                                                            hitSlop={8}
                                                            style={{
                                                                width: 40,
                                                                height: 44,
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <MaterialDesignIcons
                                                                name="close-circle-outline"
                                                                size={22}
                                                                color={colors.textSecondary}
                                                            />
                                                        </Pressable>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                )}
                            </ThemedView>
                        </Animated.View>
                    </Pressable>
                </Pressable>
            </Animated.View>
        </Modal>
    );
};

export default QueueSheet;