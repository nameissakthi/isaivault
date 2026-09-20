import { Stack } from "expo-router"
import { AuthProvider } from "../context/AuthContext"

const RootLayout = () => {
	return (
		<AuthProvider>
			<Stack screenOptions={{
				headerShown: false
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
		</AuthProvider>
	)
}

export default RootLayout;