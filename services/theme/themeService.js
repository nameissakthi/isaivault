import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

const THEME_KEY = "app_theme";

export const getSavedTheme = async () => {
    try {
        const theme = await AsyncStorage.getItem(THEME_KEY);

        if (theme === "light" || theme === "dark") {
            Appearance.setColorScheme(theme);
            return theme;
        }

        return null;
    } catch (error) {
        console.log("Theme Load Error:", error.message);
        return null;
    }
};

export const setAppTheme = async (theme) => {
    try {
        await AsyncStorage.setItem(THEME_KEY, theme);
        Appearance.setColorScheme(theme);
    } catch (error) {
        console.log("Theme Save Error:", error.message);
    }
};