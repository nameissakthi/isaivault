import { ThemedLinkButton, ThemedText, ThemedView } from "../components/components";
import { useAuth } from "../context/AuthContext";

const index = () => {

	const { user, isAuthenticated } = useAuth();

	return (
		<ThemedView safe>
			<ThemedText>Index</ThemedText>

			<ThemedText>{isAuthenticated ? "YES" : "NO"}</ThemedText>

			{ user && <ThemedText>Welcome {user.name}</ThemedText> }

			<ThemedLinkButton toLink="/login" title={"Login"} />
		</ThemedView>
	)
}

export default index