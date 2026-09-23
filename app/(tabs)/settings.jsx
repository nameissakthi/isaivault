import {
    Image,
    Pressable,
    ScrollView,
    useColorScheme,
    View
} from "react-native";

import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useRouter } from "expo-router";

import {
    ThemedText,
    ThemedView
} from "../../components/components";

import { useAuth } from "../../context/AuthContext";
import { useLibrary } from "../../context/LibraryContext";
import Colors from "../../constants/Colors";

import { setAppTheme } from "../../services/theme/themeService";

const settings = () => {

    const { user, logout, isLoading } = useAuth();

    const {
        rootFolder,
        musicFolder,
        removeFolderInfo
    } = useLibrary();

    const router = useRouter();

    const theme = useColorScheme();
    const colors = theme === "dark"
        ? Colors.dark
        : Colors.light;

    const isDark = theme === "dark";

    const toggleTheme = async () => {
        const newTheme =
            isDark ? "light" : "dark";

        await setAppTheme(newTheme);
    };

    const onLogout = async () => {
        try {
            await logout();
            await removeFolderInfo();

            router.replace("/(auth)/login");
        } catch (error) {
            console.log(error.message);
        }
    };

    const goToFolderSelectionScreen = () => {
        router.push("/(setup)");
    };

    const cardStyle = {
        backgroundColor: colors.elevated,
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.06)",
    };

    return (
        <ThemedView
            safe
            style={{ flex: 1 }}
        >

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 24,
                    paddingBottom: 190,
                }}
            >

                <ThemedView
                    style={{
                        alignItems: "center",
                        marginBottom: 30,
                    }}
                >

                    <View
                        style={{
                            width: 104,
                            height: 104,
                            borderRadius: 52,
                            padding: 3,
                            backgroundColor:
                                colors.elevated,
                        }}
                    >

                        <Image
                            source={{
                                uri: user?.photo
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 52,
                            }}
                            alt="User"
                        />

                    </View>

                    <ThemedText
                        style={{
                            fontSize: 26,
                            fontWeight: "800",
                            marginTop: 12,
                        }}
                    >
                        {user?.name}
                    </ThemedText>

                    <ThemedText
                        style={{
                            fontSize: 14,
                            opacity: 0.55,
                            marginTop: 4,
                        }}
                    >
                        Account Settings
                    </ThemedText>

                </ThemedView>

                <ThemedView style={cardStyle}>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 14,
                        }}
                    >

                        <View
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                backgroundColor:
                                    colors.surface,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 12,
                            }}
                        >

                            <MaterialDesignIcons
                                name="account"
                                size={23}
                                color={colors.text}
                            />

                        </View>

                        <View>

                            <ThemedText
                                style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                }}
                            >
                                Google Account
                            </ThemedText>

                            <ThemedText
                                style={{
                                    fontSize: 13,
                                    opacity: 0.55,
                                    marginTop: 2,
                                }}
                            >
                                Connected account
                            </ThemedText>

                        </View>

                    </View>

                    <View
                        style={{
                            backgroundColor:
                                colors.surface,
                            borderRadius: 12,
                            paddingHorizontal: 14,
                            paddingVertical: 12,
                        }}
                    >

                        <ThemedText
                            style={{
                                fontSize: 14,
                                opacity: 0.75,
                            }}
                            numberOfLines={1}
                        >
                            {user?.email}
                        </ThemedText>

                    </View>

                </ThemedView>

                <ThemedView
                    style={{
                        ...cardStyle,
                        marginTop: 14,
                    }}
                >

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >

                        <View
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                backgroundColor:
                                    colors.surface,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 12,
                            }}
                        >

                            <MaterialDesignIcons
                                name="folder"
                                size={23}
                                color={colors.text}
                            />

                        </View>

                        <View style={{ flex: 1 }}>

                            <ThemedText
                                style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                }}
                            >
                                Root Folder
                            </ThemedText>

                            <ThemedText
                                style={{
                                    fontSize: 13,
                                    opacity: 0.55,
                                    marginTop: 2,
                                }}
                            >
                                Google Drive location
                            </ThemedText>

                        </View>

                    </View>

                    <Pressable
                        onPress={
                            goToFolderSelectionScreen
                        }
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor:
                                colors.surface,
                            borderRadius: 12,
                            paddingHorizontal: 14,
                            paddingVertical: 13,
                            marginTop: 14,
                        }}
                    >

                        <ThemedText
                            style={{
                                flex: 1,
                                fontWeight: "600",
                            }}
                            numberOfLines={1}
                        >
                            {rootFolder?.name ??
                                "Not selected"}
                        </ThemedText>

                        <MaterialDesignIcons
                            name="chevron-right"
                            size={24}
                            color={
                                colors.textSecondary
                            }
                        />

                    </Pressable>

                </ThemedView>

                <ThemedView
                    style={{
                        ...cardStyle,
                        marginTop: 14,
                    }}
                >

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >

                        <View
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                backgroundColor:
                                    colors.surface,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 12,
                            }}
                        >

                            <MaterialDesignIcons
                                name="music-box"
                                size={23}
                                color={colors.text}
                            />

                        </View>

                        <View style={{ flex: 1 }}>

                            <ThemedText
                                style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                }}
                            >
                                Music Folder
                            </ThemedText>

                            <ThemedText
                                style={{
                                    fontSize: 13,
                                    opacity: 0.55,
                                    marginTop: 2,
                                }}
                            >
                                Folder containing your songs
                            </ThemedText>

                        </View>

                    </View>

                    <View
                        style={{
                            backgroundColor:
                                colors.surface,
                            borderRadius: 12,
                            paddingHorizontal: 14,
                            paddingVertical: 13,
                            marginTop: 14,
                        }}
                    >

                        <ThemedText
                            style={{
                                fontWeight: "600",
                            }}
                            numberOfLines={1}
                        >
                            {musicFolder?.name ??
                                "Not selected"}
                        </ThemedText>

                    </View>

                </ThemedView>

                <ThemedView
                    style={{
                        ...cardStyle,
                        marginTop: 14,
                    }}
                >

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >

                        <View
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                backgroundColor:
                                    colors.surface,
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 12,
                            }}
                        >

                            <MaterialDesignIcons
                                name={
                                    isDark
                                        ? "weather-night"
                                        : "white-balance-sunny"
                                }
                                size={23}
                                color={colors.text}
                            />

                        </View>

                        <View
                            style={{
                                flex: 1,
                            }}
                        >

                            <ThemedText
                                style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                }}
                            >
                                Appearance
                            </ThemedText>

                            <ThemedText
                                style={{
                                    fontSize: 13,
                                    opacity: 0.55,
                                    marginTop: 2,
                                }}
                            >
                                {isDark
                                    ? "Dark theme"
                                    : "Light theme"}
                            </ThemedText>

                        </View>

                        <Pressable
                            onPress={toggleTheme}
                            style={{
                                width: 54,
                                height: 32,
                                borderRadius: 20,
                                backgroundColor: isDark
                                    ? colors.text
                                    : colors.surface,
                                borderWidth: 1,
                                borderColor: isDark
                                    ? colors.text
                                    : theme === "dark"
                                        ? "rgba(255,255,255,0.10)"
                                        : "rgba(0,0,0,0.08)",
                                justifyContent: "center",
                                paddingHorizontal: 3,
                            }}
                        >

                            <View
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor:
                                        isDark
                                            ? colors.background
                                            : colors.text,
                                    alignSelf: isDark
                                        ? "flex-end"
                                        : "flex-start",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >

                                <MaterialDesignIcons
                                    name={
                                        isDark
                                            ? "weather-night"
                                            : "white-balance-sunny"
                                    }
                                    size={14}
                                    color={
                                        isDark
                                            ? colors.text
                                            : colors.background
                                    }
                                />

                            </View>

                        </Pressable>

                    </View>

                </ThemedView>

                <Pressable
                    onPress={onLogout}
                    disabled={isLoading}
                    style={{
                        height: 56,
                        borderRadius: 100,
                        marginTop: 24,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isDark
                            ? "rgba(255,70,70,0.14)"
                            : "rgba(220,40,40,0.08)",
                        borderWidth: 1,
                        borderColor: isDark
                            ? "rgba(255,70,70,0.25)"
                            : "rgba(220,40,40,0.15)",
                        opacity: isLoading ? 0.5 : 1,
                    }}
                >

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >

                        <MaterialDesignIcons
                            name="logout"
                            size={21}
                            color="#ef4444"
                        />

                        <ThemedText
                            style={{
                                color: "#ef4444",
                                fontSize: 15,
                                fontWeight: "700",
                                marginLeft: 8,
                            }}
                        >
                            {isLoading
                                ? "Logging Out..."
                                : "Logout"}
                        </ThemedText>

                    </View>

                </Pressable>

                <ThemedText
                    style={{
                        textAlign: "center",
                        fontSize: 12,
                        opacity: 0.45,
                        marginTop: 18,
                        marginBottom: 10,
                    }}
                >
                    Version 1.0.0
                </ThemedText>

            </ScrollView>

        </ThemedView>
    );
};

export default settings;