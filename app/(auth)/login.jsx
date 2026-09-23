import {
    Image,
    Pressable,
    useColorScheme,
    View
} from "react-native";

import {
    Logo,
    ThemedView,
    ThemedText
} from "../../components/components";

import {
    MaterialDesignIcons
} from "@react-native-vector-icons/material-design-icons";

import Colors from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";


const login = () => {

    const theme = useColorScheme();

    const colors = theme === "dark"
        ? Colors.dark
        : Colors.light;

    const isDark = theme === "dark";

    const { login, isLoading } = useAuth();

    const router = useRouter();


    const handleGoogleLogin = async () => {
        try {
            await login();

            router.replace("/(setup)");
        } catch (error) {
            console.log(error.message);
        }
    };


    return (
        <ThemedView
            safe
            style={{
                flex: 1,
            }}
        >

            <ThemedView
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 30,
                }}
            >

                <ThemedView
                    style={{
                        alignItems: "center",
                    }}
                >

                    <Logo
                        width={100}
                        height={100}
                    />


                    <ThemedText
                        style={{
                            fontSize: 42,
                            fontWeight: "800",
                            marginTop: 20,
                            letterSpacing: -1.5,
                        }}
                    >
                        IsaiVault
                    </ThemedText>


                    <ThemedText
                        style={{
                            fontSize: 15,
                            opacity: 0.55,
                            marginTop: 8,
                            letterSpacing: 0.3,
                        }}
                    >
                        Your music. Your Drive.
                    </ThemedText>

                </ThemedView>


                <View
                    style={{
                        height: 70,
                    }}
                />

                <ThemedView
                    style={{
                        width: "100%",
                        alignItems: "center",
                    }}
                >

                    <ThemedText
                        style={{
                            fontSize: 14,
                            opacity: 0.6,
                            marginBottom: 14,
                        }}
                    >
                        Sign in to access your music
                    </ThemedText>


                    <Pressable
                        onPress={handleGoogleLogin}
                        disabled={isLoading}
                        style={({ pressed }) => ({
                            width: "100%",
                            maxWidth: 360,
                            height: 58,

                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",

                            borderRadius: 100,

                            backgroundColor: colors.elevated,

                            borderWidth: 1,
                            borderColor: isDark
                                ? "rgba(255,255,255,0.08)"
                                : "rgba(0,0,0,0.08)",

                            opacity: isLoading
                                ? 0.55
                                : pressed
                                    ? 0.75
                                    : 1,

                            elevation: 3,

                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: isDark ? 0.25 : 0.08,
                            shadowRadius: 6,
                        })}
                    >

                        <MaterialDesignIcons
                            name="google"
                            size={22}
                            color={colors.text}
                        />

                        <ThemedText
                            style={{
                                fontSize: 15,
                                fontWeight: "700",
                                marginLeft: 10,
                            }}
                        >
                            {isLoading
                                ? "Signing in..."
                                : "Continue with Google"
                            }
                        </ThemedText>

                    </Pressable>

                    <ThemedText
                        style={{
                            fontSize: 11,
                            opacity: 0.4,
                            textAlign: "center",
                            marginTop: 16,
                            lineHeight: 16,
                            maxWidth: 300,
                        }}
                    >
                        Connect your Google Drive to listen to
                        your music wherever you go.
                    </ThemedText>

                </ThemedView>

            </ThemedView>

            <ThemedView
                style={{
                    alignItems: "center",
                    paddingBottom: 20,
                }}
            >

                <ThemedText
                    style={{
                        fontSize: 11,
                        opacity: 0.4,
                    }}
                >
                    Made with ❤️ by Sakthivel
                </ThemedText>

            </ThemedView>

        </ThemedView>
    );
};


export default login;