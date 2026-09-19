import { Text, useColorScheme } from 'react-native'

import Colors from "../constants/Colors"

const ThemedText = ({ style, primary=true, ...props }) => {

    const theme = useColorScheme();

    const colors = theme === 'dark' ? Colors.dark : Colors.light;


    return (
        <Text style={[{ color: primary ? colors.text : colors.textSecondary }, style]} {...props} />
    )
}

export default ThemedText