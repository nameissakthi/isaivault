import {
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
    useColorScheme
} from "react-native";

import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    MaterialDesignIcons
} from "@react-native-vector-icons/material-design-icons";

import {
    useAudioPlayerContext
} from "../../context/AudioPlayerContext";

import {
    MusicOptionsMenu,
    PlaylistPicker
} from "../../components/components";

import Colors from "../../constants/Colors";
import { formatTime } from "../../constants/Utils";

import {
    deleteDriveFile
} from "../../services/drive/driveService";

import {
    downloadMusicToLocal
} from "../../services/local/localMusicService";

const Player = () => {
    const theme = useColorScheme();
    const colors = theme === "dark" ? Colors.dark : Colors.light;
    const router = useRouter();

    const [progressWidth, setProgressWidth] = useState(0);
    const [isMusicOptionsVisible, setIsMusicOptionsVisible] = useState(false);
    const [isPlaylistPickerVisible, setIsPlaylistPickerVisible] = useState(false);
    const [isQueueVisible, setIsQueueVisible] = useState(false);

    const {
        currentMusic,
        status,
        currentTime,
        duration,
        queue,
        currentIndex,
        togglePlayback,
        seekTo,
        playNext,
        playPrevious,
        playMusic,
        addToQueue,
        removeFromQueue,
        clearQueue
    } = useAudioPlayerContext();

    const progress = duration > 0
        ? Math.min(currentTime / duration, 1)
        : 0;

    const title = currentMusic?.title
        || currentMusic?.name
        || "Unknown song";

    const artist = currentMusic?.artist
        || "Unknown artist";

    const metadata = [
        ["Album", currentMusic?.album],
        ["Album artist", currentMusic?.albumArtist],
        ["Genre", currentMusic?.genre],
        ["Year", currentMusic?.year],
        ["Contributing artists", currentMusic?.contributingArtists],
        ["Track", currentMusic?.track]
    ].filter(([, value]) => (
        value !== undefined
        && value !== null
        && String(value).trim() !== ""
    ));

    const handleSeek = event => {
        if (!progressWidth || duration <= 0) {
            return;
        }

        const { locationX } = event.nativeEvent;

        const position = Math.max(
            0,
            Math.min(1, locationX / progressWidth)
        );

        seekTo(position * duration);
    };

    const handleAddToQueue = () => {
        if (!currentMusic) {
            return;
        }

        addToQueue(currentMusic);
        setIsMusicOptionsVisible(false);
    };

    const handleAddToPlaylist = () => {
        if (!currentMusic) {
            return;
        }

        setIsMusicOptionsVisible(false);
        setIsPlaylistPickerVisible(true);
    };

    const handleDownload = async () => {
        if (!currentMusic) {
            return;
        }

        try {
            await downloadMusicToLocal(currentMusic);

            Alert.alert(
                "Download Complete",
                `${title} has been saved to the IsaiVault folder.`
            );
        } catch (error) {
            Alert.alert(
                "Download Failed",
                error.message
            );
        }
    };

    const handleDelete = () => {
        if (!currentMusic) {
            return;
        }

        Alert.alert(
            "Delete Music",
            `Are you sure you want to delete "${title}" from Google Drive?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDriveFile(currentMusic.id);

                            Alert.alert(
                                "Deleted",
                                "The music file has been deleted from Google Drive."
                            );

                            router.back();
                        } catch (error) {
                            Alert.alert(
                                "Delete Failed",
                                error.message
                            );
                        }
                    }
                }
            ]
        );
    };

    const handleQueueItemPress = async music => {
        setIsQueueVisible(false);
        await playMusic(music);
    };

    const handleClearQueue = () => {
        Alert.alert(
            "Clear Queue",
            "Remove all upcoming songs from the queue?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: clearQueue
                }
            ]
        );
    };

    if (!currentMusic) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <MaterialDesignIcons
                    name="music-note-off"
                    size={56}
                    color={colors.textSecondary}
                />

                <Text
                    style={{
                        color: colors.text,
                        fontSize: 16,
                        marginTop: 16
                    }}
                >
                    No music playing
                </Text>

                <Pressable
                    onPress={() => router.back()}
                    style={{
                        marginTop: 20,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: colors.surface
                    }}
                >
                    <Text style={{ color: colors.text }}>
                        Go Back
                    </Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: colors.background
                }}
            >
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingBottom: 36
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={{
                            height: 64,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <Pressable
                            onPress={() => router.back()}
                            hitSlop={10}
                            style={{
                                width: 44,
                                height: 44,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <MaterialDesignIcons
                                name="chevron-down"
                                size={30}
                                color={colors.text}
                            />
                        </Pressable>

                        <View style={{ alignItems: "center" }}>
                            <Text
                                style={{
                                    color: colors.textSecondary,
                                    fontSize: 14,
                                    fontWeight: "700",
                                    letterSpacing: 1
                                }}
                            >
                                NOW PLAYING
                            </Text>

                            <Text
                                numberOfLines={1}
                                style={{
                                    color: colors.textSecondary,
                                    fontSize: 11,
                                    marginTop: 3
                                }}
                            >
                                {currentMusic.album || "IsaiVault"}
                            </Text>
                        </View>

                        <Pressable
                            onPress={() => setIsMusicOptionsVisible(true)}
                            hitSlop={10}
                            style={{
                                width: 44,
                                height: 44,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <MaterialDesignIcons
                                name="dots-vertical"
                                size={25}
                                color={colors.text}
                            />
                        </Pressable>
                    </View>

                    <View
                        style={{
                            width: "100%",
                            aspectRatio: 1,
                            maxWidth: 360,
                            alignSelf: "center",
                            marginTop: 12,
                            borderRadius: 24,
                            backgroundColor: colors.elevated,
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}
                    >
                        {currentMusic.artwork ? (
                            <Image
                                source={{
                                    uri: currentMusic.artwork
                                }}
                                resizeMode="cover"
                                style={{
                                    width: "100%",
                                    height: "100%"
                                }}
                            />
                        ) : (
                            <MaterialDesignIcons
                                name="music-note"
                                size={110}
                                color={colors.text}
                            />
                        )}
                    </View>

                    <Text
                        numberOfLines={2}
                        style={{
                            color: colors.text,
                            fontSize: 24,
                            fontWeight: "700",
                            marginTop: 26,
                            textAlign: "center"
                        }}
                    >
                        {title}
                    </Text>

                    <Text
                        numberOfLines={2}
                        style={{
                            color: colors.textSecondary,
                            fontSize: 15,
                            marginTop: 8,
                            textAlign: "center"
                        }}
                    >
                        {artist}
                    </Text>

                    {currentMusic.albumArtist ? (
                        <Text
                            numberOfLines={1}
                            style={{
                                color: colors.textSecondary,
                                fontSize: 12,
                                marginTop: 5,
                                textAlign: "center"
                            }}
                        >
                            Album artist: {currentMusic.albumArtist}
                        </Text>
                    ) : null}

                    <View style={{ marginTop: 30 }}>
                        <Pressable
                            onPress={handleSeek}
                            onLayout={event => {
                                setProgressWidth(
                                    event.nativeEvent.layout.width
                                );
                            }}
                            style={{
                                height: 5,
                                borderRadius: 10,
                                backgroundColor: colors.surface,
                                overflow: "hidden"
                            }}
                        >
                            <View
                                style={{
                                    height: "100%",
                                    width: `${progress * 100}%`,
                                    backgroundColor: colors.text,
                                    borderRadius: 10
                                }}
                            />
                        </Pressable>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 8
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.textSecondary,
                                    fontSize: 12
                                }}
                            >
                                {formatTime(currentTime)}
                            </Text>

                            <Text
                                style={{
                                    color: colors.textSecondary,
                                    fontSize: 12
                                }}
                            >
                                {formatTime(duration)}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 24
                        }}
                    >
                        <Pressable
                            onPress={playPrevious}
                            hitSlop={8}
                            style={{
                                width: 58,
                                height: 58,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <MaterialDesignIcons
                                name="skip-previous"
                                size={34}
                                color={colors.text}
                            />
                        </Pressable>

                        <Pressable
                            onPress={togglePlayback}
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 35,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: colors.text,
                                marginHorizontal: 16
                            }}
                        >
                            <MaterialDesignIcons
                                name={status.playing ? "pause" : "play"}
                                size={36}
                                color={colors.background}
                            />
                        </Pressable>

                        <Pressable
                            onPress={playNext}
                            hitSlop={8}
                            style={{
                                width: 58,
                                height: 58,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <MaterialDesignIcons
                                name="skip-next"
                                size={34}
                                color={colors.text}
                            />
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={() => setIsQueueVisible(true)}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            alignSelf: "center",
                            marginTop: 24,
                            paddingHorizontal: 18,
                            paddingVertical: 12,
                            borderRadius: 24,
                            backgroundColor: colors.surface
                        }}
                    >
                        <MaterialDesignIcons
                            name="playlist-music"
                            size={22}
                            color={colors.text}
                        />

                        <Text
                            style={{
                                color: colors.text,
                                fontSize: 14,
                                fontWeight: "600",
                                marginLeft: 8
                            }}
                        >
                            Open Queue ({queue.length})
                        </Text>
                    </Pressable>

                    {metadata.length > 0 ? (
                        <View
                            style={{
                                marginTop: 28,
                                padding: 16,
                                borderRadius: 18,
                                backgroundColor: colors.elevated
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 16,
                                    fontWeight: "700",
                                    marginBottom: 8
                                }}
                            >
                                Song information
                            </Text>

                            {metadata.map(([label, value]) => (
                                <View
                                    key={label}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        paddingVertical: 9,
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.surface
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.textSecondary,
                                            fontSize: 13,
                                            flex: 1
                                        }}
                                    >
                                        {label}
                                    </Text>

                                    <Text
                                        style={{
                                            color: colors.text,
                                            fontSize: 13,
                                            fontWeight: "500",
                                            flex: 1.5,
                                            textAlign: "right"
                                        }}
                                    >
                                        {String(value)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : null}
                </ScrollView>
            </SafeAreaView>

            <MusicOptionsMenu
                visible={isMusicOptionsVisible}
                onClose={() => setIsMusicOptionsVisible(false)}
                onAddToQueue={handleAddToQueue}
                onAddToPlaylist={handleAddToPlaylist}
                onDownload={handleDownload}
                onDelete={handleDelete}
            />

            <PlaylistPicker
                visible={isPlaylistPickerVisible}
                music={currentMusic}
                onClose={() => setIsPlaylistPickerVisible(false)}
            />

            <Modal
                visible={isQueueVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsQueueVisible(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >
                    <View
                        style={{
                            maxHeight: "75%",
                            minHeight: "40%",
                            backgroundColor: colors.background,
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            paddingHorizontal: 20,
                            paddingTop: 20,
                            paddingBottom: 28
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 18
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        color: colors.text,
                                        fontSize: 22,
                                        fontWeight: "700"
                                    }}
                                >
                                    Playing Queue
                                </Text>

                                <Text
                                    style={{
                                        color: colors.textSecondary,
                                        fontSize: 13,
                                        marginTop: 4
                                    }}
                                >
                                    {queue.length} songs
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                            >
                                <Pressable
                                    onPress={handleClearQueue}
                                    hitSlop={8}
                                    style={{ padding: 10 }}
                                >
                                    <MaterialDesignIcons
                                        name="playlist-remove"
                                        size={24}
                                        color={colors.text}
                                    />
                                </Pressable>

                                <Pressable
                                    onPress={() => setIsQueueVisible(false)}
                                    hitSlop={8}
                                    style={{ padding: 10 }}
                                >
                                    <MaterialDesignIcons
                                        name="close"
                                        size={24}
                                        color={colors.text}
                                    />
                                </Pressable>
                            </View>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            {queue.map((music, index) => {
                                const isCurrent =
                                    music.id === currentMusic.id;

                                return (
                                    <View
                                        key={music.id}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingVertical: 12,
                                            borderBottomWidth: 1,
                                            borderBottomColor: colors.surface
                                        }}
                                    >
                                        <Pressable
                                            onPress={() => handleQueueItemPress(music)}
                                            style={{
                                                flex: 1,
                                                flexDirection: "row",
                                                alignItems: "center"
                                            }}
                                        >
                                            {music.artwork ? (
                                                <Image
                                                    source={{
                                                        uri: music.artwork
                                                    }}
                                                    style={{
                                                        width: 44,
                                                        height: 44,
                                                        borderRadius: 8
                                                    }}
                                                />
                                            ) : (
                                                <MaterialDesignIcons
                                                    name={
                                                        isCurrent && status.playing
                                                            ? "volume-high"
                                                            : "music-note"
                                                    }
                                                    size={24}
                                                    color={
                                                        isCurrent
                                                            ? colors.text
                                                            : colors.textSecondary
                                                    }
                                                />
                                            )}

                                            <View
                                                style={{
                                                    flex: 1,
                                                    marginLeft: 14
                                                }}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        color: colors.text,
                                                        fontSize: 15,
                                                        fontWeight: isCurrent
                                                            ? "700"
                                                            : "500"
                                                    }}
                                                >
                                                    {music.title || music.name}
                                                </Text>

                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        color: colors.textSecondary,
                                                        fontSize: 12,
                                                        marginTop: 4
                                                    }}
                                                >
                                                    {music.artist || (
                                                        isCurrent
                                                            ? "Now playing"
                                                            : `Track ${index + 1}`
                                                    )}
                                                </Text>
                                            </View>
                                        </Pressable>

                                        {!isCurrent ? (
                                            <Pressable
                                                onPress={() => removeFromQueue(music.id)}
                                                hitSlop={8}
                                                style={{ padding: 10 }}
                                            >
                                                <MaterialDesignIcons
                                                    name="close"
                                                    size={21}
                                                    color={colors.textSecondary}
                                                />
                                            </Pressable>
                                        ) : null}
                                    </View>
                                );
                            })}

                            {queue.length === 0 ? (
                                <Text
                                    style={{
                                        color: colors.textSecondary,
                                        textAlign: "center",
                                        marginTop: 28
                                    }}
                                >
                                    Your queue is empty.
                                </Text>
                            ) : null}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default Player;