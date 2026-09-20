import { Stack } from "expo-router"
import { AuthProvider } from "../context/AuthContext"
import { UserOnly } from "../components/components";

const RootLayout = () => {
	return (
		<AuthProvider>
			<UserOnly>
				<Stack screenOptions={{
					headerShown: true
				}}>

					<Stack.Screen name="index" options={{
						title: "Home"
					}} />

					<Stack.Screen name="(auth)" options={{
						headerShown: false
					}} />

					<Stack.Screen name="(tabs)" options={{
						headerShown: false
					}} />
				</Stack>
			</UserOnly>
		</AuthProvider>
	)
}

export default RootLayout;