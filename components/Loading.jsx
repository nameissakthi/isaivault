import {
    Animated,
    Easing,
    StyleSheet,
    View
} from "react-native";

import {
    useEffect,
    useRef
} from "react";

import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";

const Loading = ({
    style,
    width = 180,
    height = 180
}) => {
    const animation1 =
        useRef(
            new Animated.Value(0.3)
        ).current;

    const animation2 =
        useRef(
            new Animated.Value(0.5)
        ).current;

    const animation3 =
        useRef(
            new Animated.Value(0.7)
        ).current;

    useEffect(() => {
        const createAnimation = (
            animation,
            delay
        ) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),

                    Animated.timing(
                        animation,
                        {
                            toValue: 1,
                            duration: 500,
                            easing: Easing.inOut(
                                Easing.ease
                            ),
                            useNativeDriver: true
                        }
                    ),

                    Animated.timing(
                        animation,
                        {
                            toValue: 0.3,
                            duration: 500,
                            easing: Easing.inOut(
                                Easing.ease
                            ),
                            useNativeDriver: true
                        }
                    )
                ])
            );
        };

        const first =
            createAnimation(
                animation1,
                0
            );

        const second =
            createAnimation(
                animation2,
                150
            );

        const third =
            createAnimation(
                animation3,
                300
            );

        first.start();
        second.start();
        third.start();

        return () => {
            first.stop();
            second.stop();
            third.stop();
        };
    }, []);

    return (
        <ThemedView
            safe
            style={[
                styles.container,
                style
            ]}
        >
            <View
                style={[
                    styles.animation,
                    {
                        width,
                        height
                    }
                ]}
            >
                <Animated.View
                    style={[
                        styles.bar,
                        {
                            transform: [
                                {
                                    scaleY:
                                        animation1
                                }
                            ]
                        }
                    ]}
                />

                <Animated.View
                    style={[
                        styles.bar,
                        {
                            transform: [
                                {
                                    scaleY:
                                        animation2
                                }
                            ]
                        }
                    ]}
                />

                <Animated.View
                    style={[
                        styles.bar,
                        {
                            transform: [
                                {
                                    scaleY:
                                        animation3
                                }
                            ]
                        }
                    ]}
                />
            </View>

            <ThemedText style={styles.text}>
                Loading...
            </ThemedText>
        </ThemedView>
    );
};

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        },

        animation: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
        },

        bar: {
            width: 14,
            height: 70,
            borderRadius: 10,
            backgroundColor: "#2E31FF"
        },

        text: {
            marginTop: 16,
            fontSize: 14,
            opacity: 0.7
        }
    });

export default Loading;