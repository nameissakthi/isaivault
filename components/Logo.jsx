import { Image, useColorScheme } from 'react-native'
import ThemedView from './ThemedView'
import Colors from '../constants/Colors';

const Logo = ({ style, width = 150, height = 150, ...props }) => {

    const theme = useColorScheme();

    const colors = theme === 'dark' ? Colors.dark : Colors.light;
    
    return (
        <ThemedView>
            <Image
                source={
                    require("../assets/logo.png")
                }

                style={[{
                    width: width,
                    height: height,
                    backgroundColor: colors.primary,
                    borderRadius: 5
                }, style]}

                alt='Logo'

                {...props}
            />
        </ThemedView>
    )
}

export default Logo