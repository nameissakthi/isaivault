import {
    Stack
} from "expo-router";

import {
    StatusBar
} from "expo-status-bar";

import {
    AuthProvider
} from "../context/AuthContext";

import {
    LibraryProvider
} from "../context/LibraryContext";

import {
    PlaylistProvider
} from "../context/PlaylistContext";

import {
    AudioPlayerProvider
} from "../context/AudioPlayerContext";

import { MiniPlayer } from "../components/components"

const RootLayout = () => {
    return (
        <AuthProvider>
            <LibraryProvider>
                <PlaylistProvider>
                    <AudioPlayerProvider>
                        <StatusBar style="auto" />

                        <Stack
                            screenOptions={{
                                headerShown: false
                            }}
                        />

                        <MiniPlayer />
                    </AudioPlayerProvider>
                </PlaylistProvider>
            </LibraryProvider>
        </AuthProvider>
    );
};

export default RootLayout;