import {
    Modal,
    Pressable,
    Text,
    View
} from "react-native";

import {
    useState
} from "react";

import {
    useAudioPlayer,
    useAudioPlayerStatus
} from "expo-audio";

import MusicOptionsMenu from "../screen_components/MusicOptionsMenu";
import PlaylistPicker from "../screen_components/PlaylistPicker";

import {
    SafeAreaView
} from "react-native-safe-area-context";

import {
    useAudioPlayerContext
} from "../../context/AudioPlayerContext";

const MusicPlayer = ({
    source,
    name,
    music
}) => {
    const player = useAudioPlayer(source);

    const status =
        useAudioPlayerStatus(player);

    const {
        addToQueue
    } = useAudioPlayerContext();

    const [
        isMusicOptionsVisible,
        setIsMusicOptionsVisible
    ] = useState(false);

    const [
        isPlaylistPickerVisible,
        setIsPlaylistPickerVisible
    ] = useState(false);

    const togglePlayback = () => {
        if (status.playing) {
            player.pause();
        } else {
            player.play();
        }
    };

    const handleOpenOptions = () => {
        setIsMusicOptionsVisible(true);
    };

    const handleCloseOptions = () => {
        setIsMusicOptionsVisible(false);
    };

    const handleAddToQueue = () => {
        if (!music) {
            return;
        }

        addToQueue(music);
        setIsMusicOptionsVisible(false);
    };

    const handleAddToPlaylist = () => {
        if (!music) {
            return;
        }

        setIsMusicOptionsVisible(false);

        setTimeout(() => {
            setIsPlaylistPickerVisible(true);
        }, 250);
    };

    const handleClosePlaylistPicker = () => {
        setIsPlaylistPickerVisible(false);
    };

    if (!source) {
        return null;
    }

    return (
        <>
            <SafeAreaView
                style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 96,
                    padding: 16,
                    borderRadius: 18,
                    backgroundColor: "#222",
                    flexDirection: "row",
                    alignItems: "center",
                    zIndex: 1000,
                    elevation: 1000
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        flex: 1,
                        color: "#fff",
                        fontSize: 15,
                        fontWeight: "600"
                    }}
                >
                    {name}
                </Text>

                <Pressable
                    onPress={handleOpenOptions}
                    hitSlop={10}
                    style={{
                        width: 44,
                        height: 44,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 8
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 28,
                            fontWeight: "700"
                        }}
                    >
                        ⋮
                    </Text>
                </Pressable>

                <Pressable
                    onPress={togglePlayback}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#fff"
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            color: "#000"
                        }}
                    >
                        {status.playing
                            ? "❚❚"
                            : "▶"}
                    </Text>
                </Pressable>
            </SafeAreaView>

            <Modal
                visible={isMusicOptionsVisible}
                transparent
                animationType="none"
                onRequestClose={
                    handleCloseOptions
                }
            >
                <Pressable
                    onPress={handleCloseOptions}
                    style={{
                        flex: 1,
                        backgroundColor:
                            "rgba(0,0,0,0.5)",
                        justifyContent: "flex-end"
                    }}
                >
                    <Pressable
                        onPress={event =>
                            event.stopPropagation()
                        }
                        style={{
                            marginHorizontal: 12,
                            marginBottom: 12,
                            padding: 20,
                            borderRadius: 24,
                            backgroundColor: "#222"
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 18,
                                fontWeight: "700",
                                marginBottom: 10
                            }}
                        >
                            Music Options
                        </Text>

                        <Pressable
                            onPress={
                                handleAddToQueue
                            }
                            style={{
                                paddingVertical: 16
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 16
                                }}
                            >
                                Add to Queue
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={
                                handleAddToPlaylist
                            }
                            style={{
                                paddingVertical: 16
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 16
                                }}
                            >
                                Add to Playlist
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() =>
                                console.log(
                                    "Download:",
                                    music
                                )
                            }
                            style={{
                                paddingVertical: 16
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 16
                                }}
                            >
                                Download to Local
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={
                                handleCloseOptions
                            }
                            style={{
                                paddingVertical: 16
                            }}
                        >
                            <Text
                                style={{
                                    color: "#ff5555",
                                    fontSize: 16,
                                    fontWeight: "600"
                                }}
                            >
                                Cancel
                            </Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

            <PlaylistPicker
                visible={
                    isPlaylistPickerVisible
                }
                music={music}
                onClose={
                    handleClosePlaylistPicker
                }
            />

            <MusicOptionsMenu
                visible={false}
                onClose={() => {}}
            />
        </>
    );
};

export default MusicPlayer;