import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { getSavedTheme } from "../services/theme/themeService";

import { AuthProvider } from "../context/AuthContext";
import { LibraryProvider } from "../context/LibraryContext";
import { AudioPlayerProvider } from "../context/AudioPlayerContext";

const RootLayout = () => {

    useEffect(() => {
        getSavedTheme();
    }, []);

    return (
        <AuthProvider>
            <LibraryProvider>
                <AudioPlayerProvider>
                    <StatusBar style="auto" />
                    <Stack screenOptions={{ headerShown: false }} />
                </AudioPlayerProvider>
            </LibraryProvider>
        </AuthProvider>
    );
};

export default RootLayout;