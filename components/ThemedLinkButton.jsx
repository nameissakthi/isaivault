import { View, useColorScheme } from 'react-native'
import { Link } from 'expo-router';
import ThemedText from './ThemedText';
import Colors from '../constants/Colors';

const ThemedLinkButton = ({ style, title, paddingHorizontal = 15, paddingVertical = 10, toLink = "/", width, height }) => {

    const theme = useColorScheme();

    const colors = theme === 'dark' ? Colors.dark : Colors.light;

    return (
        <View style={{
            width : width,
            height : height,
            borderRadius : 5,
            backgroundColor : colors.primaryLight
        }}>
            <Link href={toLink} style={[{ paddingHorizontal: paddingHorizontal, paddingVertical: paddingVertical}, style]}>
                <ThemedText style={{
                    fontWeight : 800,
                    textAlign : "center"
                }}>{title}</ThemedText>
            </Link>
        </View>
    )
}

export default ThemedLinkButton