import { Stack } from "expo-router"
import { AuthProvider } from "../context/AuthContext"
import { StatusBar } from "expo-status-bar";

const RootLayout = () => {
	return (
		<AuthProvider>
			<StatusBar />
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