import { Background } from "expo-router/build/react-navigation";
import { Spacer, ThemedButton, ThemedLinkButton, ThemedText, ThemedView } from "../../components/components";
import { useAuth } from "../../context/AuthContext";

const settings = () => {

	const { user, logout, isLoading } = useAuth()

	return (
		<ThemedView safe style={{
			flex : 1
		}}>
			<ThemedText style={{
				fontSize : 25,
				fontWeight : 800
			}}>Settings</ThemedText>

			<Spacer />

			<ThemedView style={{
				paddingHorizontal : 20
			}}>
				<ThemedView>
					<ThemedText>Name : </ThemedText>
					<ThemedText>{user?.name}</ThemedText>
				</ThemedView>

				<ThemedView>
					<ThemedText>Email : </ThemedText>
					<ThemedText>{user?.email}</ThemedText>
				</ThemedView>
			</ThemedView>

			{
				isLoading ?
				<ThemedButton style={{backgroundColor : "red"}} width={"100%"} title={"Logging Out...."} disabled /> :
				<ThemedButton style={{backgroundColor : "red"}} width={"100%"} title={"Logout"} onPress={logout} />
			}
		</ThemedView>
	)
}

export default settings