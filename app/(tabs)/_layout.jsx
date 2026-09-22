import { Tabs } from "expo-router";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { View, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import MiniPlayer from "../../components/screen_components/MiniPlayer";

const _layout = () => {

    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;

    const isDark = theme === "dark";

    return (
        <View style={{
            flex : 1
        }}>
            <Tabs
                screenOptions={{
                    headerShown: false,

                    tabBarShowLabel: true,

                    tabBarActiveTintColor: colors.text,
                    tabBarInactiveTintColor: colors.textSecondary,

                    tabBarStyle: {
                        position: "absolute",

                        left: 16,
                        right: 16,
                        bottom: 16,

                        height: 68,

                        borderRadius: 100,

                        backgroundColor: isDark
                            ? "rgba(30, 30, 30, 0.88)"
                            : "rgba(255, 255, 255, 0.88)",

                        borderWidth: 1,
                        borderColor: isDark
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.08)",

                        elevation: 8,

                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        shadowOpacity: isDark ? 0.35 : 0.15,
                        shadowRadius: 12,

                        paddingHorizontal: 8,
                        paddingTop: 6,
                        paddingBottom: 6,
                    },

                    tabBarItemStyle: {
                        borderRadius: 100,
                        marginHorizontal: 4,
                    },

                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: "600",
                        marginTop: 2,
                    },
                }}
            >

                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",

                        tabBarIcon: ({ focused, color }) => (
                            <MaterialDesignIcons
                                name={focused ? "home" : "home-outline"}
                                size={25}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="playlist"
                    options={{
                        title: "Playlist",

                        tabBarIcon: ({ focused, color }) => (
                            <MaterialDesignIcons
                                name={focused ? "book-music" : "book-music-outline"}
                                size={25}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "Settings",

                        tabBarIcon: ({ focused, color }) => (
                            <MaterialDesignIcons
                                name={focused ? "account-music" : "account-music-outline"}
                                size={25}
                                color={color}
                            />
                        ),
                    }}
                />

            </Tabs>

            <MiniPlayer />
        </View>
    );
};

export default _layout;