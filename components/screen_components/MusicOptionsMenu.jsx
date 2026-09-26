import {
    Modal,
    Pressable,
    View,
    useColorScheme,
    Animated,
    Easing
} from "react-native";

import { useEffect, useRef } from "react";

import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";

import Colors from "../../constants/Colors";

const MusicOptionsMenu = ({
    visible,
    onClose,
    onAddToQueue,
    onAddToPlaylist,
    onDownload,
    onDelete,
    onRemoveFromPlaylist
}) => {
    const theme = useColorScheme();

    const colors =
        theme === "dark"
            ? Colors.dark
            : Colors.light;

    const slideY = useRef(
        new Animated.Value(350)
    ).current;

    const opacity = useRef(
        new Animated.Value(0)
    ).current;

    useEffect(() => {
        if (!visible) {
            return;
        }

        slideY.setValue(350);
        opacity.setValue(0);

        Animated.parallel([
            Animated.timing(slideY, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(
                    Easing.cubic
                ),
                useNativeDriver: true
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 220,
                easing: Easing.out(
                    Easing.ease
                ),
                useNativeDriver: true
            })
        ]).start();
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(slideY, {
                toValue: 350,
                duration: 240,
                easing: Easing.in(
                    Easing.cubic
                ),
                useNativeDriver: true
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 180,
                easing: Easing.in(
                    Easing.ease
                ),
                useNativeDriver: true
            })
        ]).start(() => {
            onClose?.();
        });
    };

    const options = [
        {
            title: "Add to Queue",
            icon: "playlist-plus",
            onPress: onAddToQueue
        },
        {
            title: "Add to Playlist",
            icon: "playlist-music",
            onPress: onAddToPlaylist
        },
        {
            title: "Download to Local",
            icon: "download",
            onPress: onDownload
        },
        ...(onRemoveFromPlaylist
            ? [
                {
                    title: "Remove from Playlist",
                    icon: "playlist-remove",
                    onPress:
                        onRemoveFromPlaylist,
                    danger: true
                }
            ]
            : []),
        ...(onDelete
            ? [
                {
                    title: "Delete from Drive",
                    icon: "delete",
                    onPress: onDelete,
                    danger: true
                }
            ]
            : [])
    ];

    const handleOptionPress = async option => {
        handleClose();

        if (option.onPress) {
            await option.onPress();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <Animated.View
                style={{
                    flex: 1,
                    backgroundColor:
                        "rgba(0,0,0,0.45)",
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
                        onPress={event =>
                            event.stopPropagation()
                        }
                    >
                        <Animated.View
                            style={{
                                transform: [
                                    {
                                        translateY:
                                            slideY
                                    }
                                ]
                            }}
                        >
                            <ThemedView
                                style={{
                                    marginHorizontal: 12,
                                    marginBottom: 12,
                                    paddingTop: 8,
                                    paddingBottom: 10,
                                    paddingHorizontal: 8,
                                    borderRadius: 24,
                                    backgroundColor:
                                        colors.elevated,
                                    borderWidth: 1,
                                    borderColor:
                                        theme ===
                                            "dark"
                                            ? "rgba(255,255,255,0.08)"
                                            : "rgba(0,0,0,0.08)",
                                    elevation: 10,
                                    shadowColor:
                                        "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: -2
                                    },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 12
                                }}
                            >
                                <View
                                    style={{
                                        width: 40,
                                        height: 4,
                                        borderRadius: 10,
                                        alignSelf:
                                            "center",
                                        backgroundColor:
                                            colors.textSecondary,
                                        opacity: 0.35,
                                        marginBottom: 10
                                    }}
                                />

                                {options.map(
                                    option => (
                                        <Pressable
                                            key={
                                                option.title
                                            }
                                            onPress={() =>
                                                handleOptionPress(
                                                    option
                                                )
                                            }
                                            style={({
                                                pressed
                                            }) => ({
                                                minHeight: 56,
                                                flexDirection:
                                                    "row",
                                                alignItems:
                                                    "center",
                                                paddingHorizontal: 12,
                                                borderRadius: 14,
                                                backgroundColor:
                                                    pressed
                                                        ? colors.surface
                                                        : "transparent",
                                                opacity:
                                                    pressed
                                                        ? 0.7
                                                        : 1
                                            })}
                                        >
                                            <View
                                                style={{
                                                    width: 42,
                                                    height: 42,
                                                    borderRadius: 12,
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    backgroundColor:
                                                        option.danger
                                                            ? "rgba(239,68,68,0.10)"
                                                            : colors.surface,
                                                    marginRight: 12
                                                }}
                                            >
                                                <MaterialDesignIcons
                                                    name={
                                                        option.icon
                                                    }
                                                    size={
                                                        22
                                                    }
                                                    color={
                                                        option.danger
                                                            ? "#ef4444"
                                                            : colors.text
                                                    }
                                                />
                                            </View>

                                            <ThemedText
                                                style={{
                                                    flex: 1,
                                                    fontSize: 15,
                                                    fontWeight:
                                                        "600",
                                                    color:
                                                        option.danger
                                                            ? "#ef4444"
                                                            : colors.text
                                                }}
                                            >
                                                {
                                                    option.title
                                                }
                                            </ThemedText>

                                            <MaterialDesignIcons
                                                name="chevron-right"
                                                size={22}
                                                color={
                                                    colors.textSecondary
                                                }
                                            />
                                        </Pressable>
                                    )
                                )}
                            </ThemedView>
                        </Animated.View>
                    </Pressable>
                </Pressable>
            </Animated.View>
        </Modal>
    );
};

export default MusicOptionsMenu;