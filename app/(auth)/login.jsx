import { useColorScheme } from "react-native"
import { Logo, ThemedView, ThemedText, Spacer, ThemedButton } from "../../components/components"
import Colors from "../../constants/Colors"
import { useAuth } from "../../context/AuthContext";

import { loginWithGoogle } from "../../services/auth/authService"

const login = () => {

    const theme = useColorScheme();

    const colors = theme === 'dark' ? Colors.dark : Colors.light;

    const { login, isLoading } = useAuth();

    const handleGoogleLogin = async () => {
        try {
            const response = await login();

            console.log(response);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <ThemedView style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <ThemedView style={{
                flexDirection: "row",
                alignItems: "center"
            }}>
                <Logo width={80} height={80} />
                <ThemedText style={{
                    fontSize: 50,
                    fontWeight: 800,
                    marginTop: 10
                }}>IsaiVault</ThemedText>
            </ThemedView>

            <Spacer height={5} />
            <ThemedText style={{
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: colors.border,
                width: "70%",
                textAlign: "center",
                fontWeight: 100
            }}>Your music. Your Drive.</ThemedText>


            <Spacer height={100} />

            <ThemedView>
                {
                    isLoading ?
                    <ThemedButton width={300} title={"Signing In......"} disabled /> :
                    <ThemedButton width={300} title={"Continue With Google"} onPress={handleGoogleLogin} />
                }
            </ThemedView>
        </ThemedView>
    )
}

export default login