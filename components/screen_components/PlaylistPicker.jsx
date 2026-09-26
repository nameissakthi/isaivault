import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    TextInput,
    ScrollView,
    useColorScheme,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback
} from "react-native";

import { useState } from "react";

import { usePlaylist } from "../../context/PlaylistContext";

import Loading from "../Loading";

const PlaylistPicker = ({
    visible,
    music,
    onClose
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const colors = {
        surface: isDark ? "#1C1C1E" : "#FFFFFF",
        secondarySurface: isDark ? "#2C2C2E" : "#F2F2F7",
        input: isDark ? "#2C2C2E" : "#F2F2F7",
        text: isDark ? "#FFFFFF" : "#111111",
        secondaryText: isDark ? "#AFAFAF" : "#666666",
        border: isDark ? "#3A3A3C" : "#E0E0E0",
        overlay: "rgba(0, 0, 0, 0.55)",
        primary: isDark ? "#FFFFFF" : "#111111",
        primaryText: isDark ? "#111111" : "#FFFFFF"
    };

    const {
        playlists,
        createPlaylist,
        addMusicToPlaylist
    } = usePlaylist();

    const [isCreating, setIsCreating] =
        useState(false);

    const [playlistName, setPlaylistName] =
        useState("");

    const [isAddingMusic, setIsAddingMusic] =
        useState(false);

    const isBusy =
        isCreating || isAddingMusic;

    const resetState = () => {
        setIsCreating(false);
        setPlaylistName("");
        setIsAddingMusic(false);
    };

    const handleClose = () => {
        if (isAddingMusic) {
            return;
        }

        resetState();
        onClose();
    };

    const handlePlaylistPress = async (
        playlist
    ) => {
        if (!music || isBusy) {
            return;
        }

        try {
            setIsAddingMusic(true);

            const success =
                await addMusicToPlaylist(
                    playlist.id,
                    music
                );

            if (!success) {
                setIsAddingMusic(false);
                return;
            }

            resetState();
            onClose();
        } catch (error) {
            console.log(
                "Add To Playlist Error:",
                error.message
            );

            setIsAddingMusic(false);
        }
    };

    const handleCreatePlaylist = async () => {
        const name =
            playlistName.trim();

        if (!name || isBusy) {
            return;
        }

        try {
            setIsCreating(true);

            const playlist =
                await createPlaylist(name);

            if (!playlist) {
                setIsCreating(false);
                return;
            }

            setPlaylistName("");
            setIsCreating(false);
        } catch (error) {
            console.log(
                "Create Playlist Error:",
                error.message
            );

            setIsCreating(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={[
                    styles.overlay,
                    {
                        backgroundColor:
                            colors.overlay
                    }
                ]}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                <Pressable
                    style={
                        StyleSheet.absoluteFill
                    }
                    onPress={handleClose}
                />

                <View
                    style={[
                        styles.container,
                        {
                            backgroundColor:
                                colors.surface
                        }
                    ]}
                >
                    <View
                        style={styles.header}
                    >
                        <View
                            style={
                                styles.headerText
                            }
                        >
                            <Text
                                style={[
                                    styles.title,
                                    {
                                        color:
                                            colors.text
                                    }
                                ]}
                            >
                                {isCreating
                                    ? "Create Playlist"
                                    : "Add to Playlist"}
                            </Text>

                            {music?.name &&
                                !isCreating && (
                                    <Text
                                        numberOfLines={
                                            1
                                        }
                                        style={[
                                            styles.subtitle,
                                            {
                                                color:
                                                    colors.secondaryText
                                            }
                                        ]}
                                    >
                                        {music.name}
                                    </Text>
                                )}
                        </View>

                        <Pressable
                            onPress={
                                handleClose
                            }
                            disabled={
                                isBusy
                            }
                            style={[
                                styles.closeButton,
                                {
                                    backgroundColor:
                                        colors.secondarySurface,
                                    opacity:
                                        isBusy
                                            ? 0.5
                                            : 1
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.closeText,
                                    {
                                        color:
                                            colors.text
                                    }
                                ]}
                            >
                                ×
                            </Text>
                        </Pressable>
                    </View>

                    {isCreating ? (
                        <View
                            style={
                                styles.createContainer
                            }
                        >
                            <Text
                                style={[
                                    styles.createTitle,
                                    {
                                        color:
                                            colors.text
                                    }
                                ]}
                            >
                                New Playlist
                            </Text>

                            <Text
                                style={[
                                    styles.createDescription,
                                    {
                                        color:
                                            colors.secondaryText
                                    }
                                ]}
                            >
                                Give your playlist a
                                name
                            </Text>

                            <TextInput
                                value={
                                    playlistName
                                }
                                onChangeText={
                                    setPlaylistName
                                }
                                placeholder="Playlist name"
                                placeholderTextColor={
                                    colors.secondaryText
                                }
                                autoFocus
                                maxLength={50}
                                editable={
                                    !isCreating
                                }
                                style={[
                                    styles.input,
                                    {
                                        color:
                                            colors.text,
                                        backgroundColor:
                                            colors.input,
                                        borderColor:
                                            colors.border
                                    }
                                ]}
                                onSubmitEditing={
                                    handleCreatePlaylist
                                }
                                returnKeyType="done"
                            />

                            <View
                                style={
                                    styles.createActions
                                }
                            >
                                <Pressable
                                    onPress={() => {
                                        if (
                                            isCreating
                                        ) {
                                            return;
                                        }

                                        setIsCreating(
                                            false
                                        );

                                        setPlaylistName(
                                            ""
                                        );
                                    }}
                                    style={[
                                        styles.cancelButton,
                                        {
                                            backgroundColor:
                                                colors.secondarySurface
                                        }
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.cancelText,
                                            {
                                                color:
                                                    colors.text
                                            }
                                        ]}
                                    >
                                        Cancel
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={
                                        handleCreatePlaylist
                                    }
                                    disabled={
                                        !playlistName.trim() ||
                                        isCreating
                                    }
                                    style={[
                                        styles.createButton,
                                        {
                                            backgroundColor:
                                                colors.primary,
                                            opacity:
                                                !playlistName.trim() ||
                                                isCreating
                                                    ? 0.45
                                                    : 1
                                        }
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.createButtonText,
                                            {
                                                color:
                                                    colors.primaryText
                                            }
                                        ]}
                                    >
                                        {isCreating
                                            ? "Creating..."
                                            : "Create"}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        <>
                            <ScrollView
                                style={
                                    styles.list
                                }
                                contentContainerStyle={
                                    styles.listContent
                                }
                                showsVerticalScrollIndicator={
                                    false
                                }
                            >
                                {playlists.length ===
                                0 ? (
                                    <View
                                        style={[
                                            styles.emptyContainer,
                                            {
                                                backgroundColor:
                                                    colors.secondarySurface
                                            }
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.emptyIcon,
                                                {
                                                    backgroundColor:
                                                        colors.surface
                                                }
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.emptyIconText,
                                                    {
                                                        color:
                                                            colors.text
                                                    }
                                                ]}
                                            >
                                                ♪
                                            </Text>
                                        </View>

                                        <Text
                                            style={[
                                                styles.emptyTitle,
                                                {
                                                    color:
                                                        colors.text
                                                }
                                            ]}
                                        >
                                            No playlists yet
                                        </Text>

                                        <Text
                                            style={[
                                                styles.emptyText,
                                                {
                                                    color:
                                                        colors.secondaryText
                                                }
                                            ]}
                                        >
                                            Create a
                                            playlist to
                                            organize your
                                            favorite
                                            music.
                                        </Text>
                                    </View>
                                ) : (
                                    playlists.map(
                                        playlist => (
                                            <Pressable
                                                key={
                                                    playlist.id
                                                }
                                                onPress={() =>
                                                    handlePlaylistPress(
                                                        playlist
                                                    )
                                                }
                                                disabled={
                                                    isBusy
                                                }
                                                style={({
                                                    pressed
                                                }) => [
                                                    styles.playlistItem,
                                                    {
                                                        backgroundColor:
                                                            pressed
                                                                ? colors.secondarySurface
                                                                : colors.surface,
                                                        borderColor:
                                                            colors.border,
                                                        opacity:
                                                            isBusy
                                                                ? 0.5
                                                                : 1
                                                    }
                                                ]}
                                            >
                                                <View
                                                    style={[
                                                        styles.playlistIcon,
                                                        {
                                                            backgroundColor:
                                                                colors.secondarySurface
                                                        }
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.playlistIconText,
                                                            {
                                                                color:
                                                                    colors.text
                                                            }
                                                        ]}
                                                    >
                                                        ♪
                                                    </Text>
                                                </View>

                                                <View
                                                    style={
                                                        styles.playlistInfo
                                                    }
                                                >
                                                    <Text
                                                        numberOfLines={
                                                            1
                                                        }
                                                        style={[
                                                            styles.playlistName,
                                                            {
                                                                color:
                                                                    colors.text
                                                            }
                                                        ]}
                                                    >
                                                        {
                                                            playlist.name
                                                        }
                                                    </Text>

                                                    <Text
                                                        style={[
                                                            styles.songCount,
                                                            {
                                                                color:
                                                                    colors.secondaryText
                                                            }
                                                        ]}
                                                    >
                                                        {
                                                            playlist
                                                                .musics
                                                                .length
                                                        }{" "}
                                                        {playlist
                                                            .musics
                                                            .length ===
                                                        1
                                                            ? "song"
                                                            : "songs"}
                                                    </Text>
                                                </View>

                                                <Text
                                                    style={[
                                                        styles.arrow,
                                                        {
                                                            color:
                                                                colors.secondaryText
                                                        }
                                                    ]}
                                                >
                                                    ›
                                                </Text>
                                            </Pressable>
                                        )
                                    )
                                )}
                            </ScrollView>

                            <Pressable
                                onPress={() =>
                                    setIsCreating(
                                        true
                                    )
                                }
                                disabled={
                                    isBusy
                                }
                                style={[
                                    styles.newPlaylistButton,
                                    {
                                        backgroundColor:
                                            colors.primary,
                                        opacity:
                                            isBusy
                                                ? 0.5
                                                : 1
                                    }
                                ]}
                            >
                                <View
                                    style={[
                                        styles.plusContainer,
                                        {
                                            backgroundColor:
                                                isDark
                                                    ? "#3A3A3C"
                                                    : "#333333"
                                        }
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.plus
                                        }
                                    >
                                        +
                                    </Text>
                                </View>

                                <Text
                                    style={[
                                        styles.newPlaylistText,
                                        {
                                            color:
                                                colors.primaryText
                                        }
                                    ]}
                                >
                                    Create New Playlist
                                </Text>
                            </Pressable>
                        </>
                    )}

                    {isAddingMusic && (
                        <TouchableWithoutFeedback
                            onPress={() => {}}
                        >
                            <View
                                style={[
                                    styles.loadingOverlay,
                                    {
                                        backgroundColor:
                                            colors.surface
                                    }
                                ]}
                            >
                                <Loading />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20
    },

    container: {
        width: "100%",
        maxWidth: 430,
        maxHeight: "78%",
        borderRadius: 26,
        padding: 20,
        overflow: "hidden",
        elevation: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.25,
        shadowRadius: 18
    },

    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18
    },

    headerText: {
        flex: 1,
        marginRight: 12
    },

    title: {
        fontSize: 21,
        fontWeight: "700"
    },

    subtitle: {
        fontSize: 13,
        marginTop: 5
    },

    closeButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center"
    },

    closeText: {
        fontSize: 27,
        fontWeight: "300",
        lineHeight: 29
    },

    list: {
        maxHeight: 350
    },

    listContent: {
        gap: 8,
        paddingBottom: 4
    },

    playlistItem: {
        minHeight: 68,
        borderRadius: 17,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10
    },

    playlistIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center"
    },

    playlistIconText: {
        fontSize: 22
    },

    playlistInfo: {
        flex: 1,
        marginLeft: 13
    },

    playlistName: {
        fontSize: 16,
        fontWeight: "600"
    },

    songCount: {
        fontSize: 12,
        marginTop: 4
    },

    arrow: {
        fontSize: 27,
        marginRight: 8
    },

    emptyContainer: {
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 28,
        paddingHorizontal: 25
    },

    emptyIcon: {
        width: 58,
        height: 58,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12
    },

    emptyIconText: {
        fontSize: 26
    },

    emptyTitle: {
        fontSize: 16,
        fontWeight: "700"
    },

    emptyText: {
        fontSize: 13,
        textAlign: "center",
        lineHeight: 19,
        marginTop: 6
    },

    newPlaylistButton: {
        minHeight: 58,
        borderRadius: 17,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        marginTop: 14
    },

    plusContainer: {
        width: 42,
        height: 42,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center"
    },

    plus: {
        color: "#FFFFFF",
        fontSize: 27,
        fontWeight: "300"
    },

    newPlaylistText: {
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 13
    },

    createContainer: {
        paddingTop: 8
    },

    createTitle: {
        fontSize: 17,
        fontWeight: "700"
    },

    createDescription: {
        fontSize: 13,
        marginTop: 5,
        marginBottom: 14
    },

    input: {
        height: 52,
        borderRadius: 15,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 15
    },

    createActions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 14
    },

    cancelButton: {
        flex: 1,
        height: 50,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center"
    },

    cancelText: {
        fontSize: 15,
        fontWeight: "600"
    },

    createButton: {
        flex: 1,
        height: 50,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center"
    },

    createButtonText: {
        fontSize: 15,
        fontWeight: "700"
    }
});

export default PlaylistPicker;