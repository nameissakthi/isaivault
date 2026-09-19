import { Pressable, useColorScheme } from "react-native"

import Colors from "../constants/Colors";
import ThemedText from "./ThemedText"

const ThemedButton = ({ style, title, width = 100, height = 40 , ...props }) => {

    const theme = useColorScheme();

    const colors = theme === 'dark' ? Colors.dark : Colors.light;

    return (
        <>
            <Pressable style={[{
                width : width,
                height : height,
                justifyContent: "center",
                borderRadius : 10,
                backgroundColor : colors.elevated,
            }, style]} {...props}>

                <ThemedText style={{
                    textAlign : 'center',
                    fontWeight : 800
                }}>{title}</ThemedText>

            </Pressable>
        </>
    )
}

export default ThemedButton