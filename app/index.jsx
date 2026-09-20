import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

import { Loading } from "../components/components";

const index = ({ children }) => {

	const { isLoading, isAuthenticated } = useAuth();

	if (isLoading) return <Loading />;

	console.log(isAuthenticated);

	return isAuthenticated
    ? <Redirect href="/(tabs)" />
    : <Redirect href="/(auth)/login" />;
}

export default index