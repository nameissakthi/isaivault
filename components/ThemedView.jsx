import { View, useColorScheme } from 'react-native'

import Colors from "../constants/Colors"
import { SafeAreaView } from 'react-native-safe-area-context';


const ThemedView = ({ style, safe = false, ...props }) => {

    const theme = useColorScheme();

    const colors = theme === 'dark' ? Colors.dark : Colors.light;

    return (
        safe ? <SafeAreaView style={[{ backgroundColor: colors.background }, style]} {...props} />
            : <View style={[{ backgroundColor: colors.background }, style]} {...props} />
    )
}

export default ThemedView