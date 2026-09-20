import { Animated, Pressable, useColorScheme } from "react-native"

import Colors from "../constants/Colors";
import ThemedText from "./ThemedText"
import { useRef } from "react";

const ThemedButton = ({ style, title, width = 100, height = 40, animated = false, ...props }) => {

    const theme = useColorScheme();

    const colors = theme === 'dark' ? Colors.dark : Colors.light;

    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.92,
            useNativeDriver: true
        }).start();
    }

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true
        }).start();
    }

    return (
        <>
            {
                animated
                    ?

                    <Pressable style={[{
                        width: width,
                        height: height,
                        justifyContent: "center",
                        borderRadius: 10,
                        backgroundColor: colors.elevated,
                    }, style]} onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>

                        <Animated.View
                            style={[{
                                transform: [{ scale: scaleValue }]
                            }]}
                        >
                            <ThemedText style={{
                                textAlign: 'center',
                                fontWeight: 800
                            }}>{title}</ThemedText>
                        </Animated.View>

                    </Pressable>

                    :
                    
                    <Pressable style={[{
                        width: width,
                        height: height,
                        justifyContent: "center",
                        borderRadius: 10,
                        backgroundColor: colors.elevated,
                    }, style]} {...props}>

                        <ThemedText style={{
                            textAlign: 'center',
                            fontWeight: 800
                        }}>{title}</ThemedText>

                    </Pressable>
            }
        </>
    )
}

export default ThemedButton