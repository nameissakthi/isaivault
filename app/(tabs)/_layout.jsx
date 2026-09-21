import { Tabs } from "expo-router"
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons"
import { useColorScheme } from "react-native"

import Colors from "../../constants/Colors";

const _layout = () => {
    const theme = useColorScheme();
    const colors = theme === 'dark' ? Colors.dark : Colors.light;
    return (
        <>
            <Tabs screenOptions={{
                headerShown: false,
                tabBarInactiveBackgroundColor : colors.stack,
                tabBarActiveBackgroundColor : colors.elevated,
                tabBarInactiveTintColor : colors.textSecondary,
                tabBarActiveTintColor : colors.text
            }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        tabBarIcon: () => <MaterialDesignIcons
                            name="home"
                            size={30}
                            color={colors.text} 
                        />,
                    }}
                />

                <Tabs.Screen
                    name="playlist"
                    options={{
                        title: "Playlist",
                        tabBarIcon : () => <MaterialDesignIcons
                            name="book-music"
                            size={30}
                            color={colors.text}
                        />
                    }}
                />

                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "Settings",
                        tabBarIcon : () => <MaterialDesignIcons
                            name="account-music"
                            size={30}
                            color={colors.text}
                        />
                    }}
                />
            </Tabs>
        </>
    )
}

export default _layout