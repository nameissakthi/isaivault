import { TextInput, useColorScheme } from "react-native"

import Colors from "../constants/Colors"

const ThemedTextInput = ({ style, value, onChangeHook, ...props }) => {

    const theme = useColorScheme();

    const colors = theme === 'dark' ? Colors.dark : Colors.light;

    return (
        <>
            <TextInput style={[{
                backgroundColor: colors.elevated,
                color : colors.text,
                borderRadius: 8,
                paddingVertical: 15,
                paddingHorizontal : 10
            }, style]} placeholderTextColor={colors.text} {...props} />
        </>
    )
}

export default ThemedTextInput