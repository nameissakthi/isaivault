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
				}} />
			</LibraryProvider>
		</AuthProvider>
	)
}

export default RootLayout;