import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "../context/AuthContext";
import { LibraryProvider } from "../context/LibraryContext";
import { PlaylistProvider } from "../context/PlaylistContext";
import { AudioPlayerProvider } from "../context/AudioPlayerContext";
import { MiniPlayer } from "../components/components";
import { getSavedTheme } from "../services/theme/themeService";
import Loading from "../components/Loading";

const RootLayout = () => {
    const [themeLoaded, setThemeLoaded] =
        useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            await getSavedTheme();
            setThemeLoaded(true);
        };

        loadTheme();
    }, []);

    if (!themeLoaded) {
        return <Loading />;
    }

    return (
        <AudioPlayerProvider>
            <AuthProvider>
                <LibraryProvider>
                    <PlaylistProvider>
                        <StatusBar style="auto" />
                        <Stack
                            screenOptions={{
                                headerShown: false
                            }}
                        />
                        <MiniPlayer />
                    </PlaylistProvider>
                </LibraryProvider>
            </AuthProvider>
        </AudioPlayerProvider>
    );
};

export default RootLayout;