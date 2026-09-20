import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../context/LibraryContext";

import { Loading } from "../components/components";

const index = ({ children }) => {

	const { isLoading, isAuthenticated } = useAuth();
	const { isLibraryLoading, musicFolder } = useLibrary();

	if (isLoading || isLibraryLoading) return <Loading />;

	if (!isAuthenticated) return <Redirect href={"/(auth)/login"} />

	if (!musicFolder) return <Redirect href={"/(setup)"} />

	return <Redirect href={"/(tabs)"} />
}

export default index