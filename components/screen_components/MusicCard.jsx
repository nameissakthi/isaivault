import {
    View,
    Text,
    useColorScheme,
    Pressable
} from "react-native";

import Colors from "../../constants/Colors";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { capitalizeEachWord } from "../../constants/Utils";

const MusicCard = ({ name, onPress, onMenuPress }) => {

    const theme = useColorScheme();

    const colors = theme === "dark"
        ? Colors.dark
        : Colors.light;

    return (
        <View
            style={{
                width: "100%",
                minHeight: 70,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.elevated,
                marginBottom: 10,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: theme === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)",
            }}
        >

            <Pressable
                onPress={onPress}
                style={({ pressed }) => ({
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 14,
                    paddingVertical: 10,
                    opacity: pressed ? 0.75 : 1,
                })}
            >

                <View
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.background,
                        marginRight: 12,
                    }}
                >
                    <MaterialDesignIcons
                        name="music-note"
                        size={25}
                        color={colors.text}
                    />
                </View>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                    }}
                >

                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            color: colors.text,
                            fontSize: 16,
                            fontWeight: "600",
                        }}
                    >
                        {capitalizeEachWord(name)}
                    </Text>

                    <Text
                        style={{
                            color: colors.textSecondary,
                            fontSize: 13,
                            marginTop: 4,
                        }}
                    >
                        Audio
                    </Text>

                </View>

            </Pressable>

            <Pressable
                onPress={() => {
                    onMenuPress?.();
                }}
                hitSlop={10}
                style={({ pressed }) => ({
                    width: 54,
                    height: 70,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: pressed ? 0.7 : 1,
                })}
            >
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "transparent",
                    }}
                >
                    <MaterialDesignIcons
                        name="dots-vertical"
                        size={24}
                        color={colors.text}
                    />
                </View>
            </Pressable>

        </View>
    );
};

export default MusicCard;