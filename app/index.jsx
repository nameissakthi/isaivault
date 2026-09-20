import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

import { Loading } from "../components/components";

const index = () => {

	const { isLoading, isAuthenticated } = useAuth();

	console.log(isAuthenticated + "from index");

	if(isLoading) return <Loading />

	if(isAuthenticated) return <Redirect href={"/(tabs)"} />

	return (
		<Redirect href={"/(auth)/login"} />
	)
}

export default index