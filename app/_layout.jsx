import { Stack } from "expo-router"
import { AuthProvider } from "../context/AuthContext"
import { LibraryProvider } from "../context/LibraryContext";
import { StatusBar } from "expo-status-bar";

const RootLayout = () => {
	return (
		<AuthProvider>
			<LibraryProvider>
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

					<Stack.Screen name="(setup)" options={{
						headerShown: false
					}} />
				</Stack>
			</LibraryProvider>
		</AuthProvider>
	)
}

export default RootLayout;