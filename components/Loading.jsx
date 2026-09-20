import { Image } from "react-native";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText"

const Loading = ({ style, width, height, ...props }) => {

    return (
        <ThemedView safe style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}>

            <Image
                source={{
                    uri: "https://assets-v2.lottiefiles.com/a/accc9456-0eba-11ef-8240-7bb7f6fcbd35/1ypAfT8vGS.gif"
                }}

                style={[{
                    width: width,
                    height: height
                }, style]}

                alt="Loading Music Player"

                {...props}
            />

            <ThemedText>Loading...</ThemedText>
        </ThemedView>
    )
}

export default Loading