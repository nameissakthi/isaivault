import {
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
import { SafeAreaView } from "react-native-safe-area-context";

const MusicPlayer = ({ source, name }) => {

    const player = useAudioPlayer(source);

    const status = useAudioPlayerStatus(player);

    const [progressWidth, setProgressWidth] = useState(0);

    const togglePlayback = () => {

        if (status.playing) {
            player.pause();
        } else {
            player.play();
        }
    };

    if (!source) {
        return null;
    }

    return (
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
                alignItems: "center"
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
                    {status.playing ? "❚❚" : "▶"}
                </Text>

            </Pressable>

        </SafeAreaView>
    );
};

export default MusicPlayer;