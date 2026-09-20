import { router, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext"

import Loading from "../Loading";
import { useEffect } from "react";

const UserOnly = ({ children }) => {
  
    const { user, isLoading, isAuthenticated } = useAuth();
    const ROUTER = useRouter();

    useEffect(() => {
        if(isAuthenticated && user !== null) ROUTER.replace("/login");
        else ROUTER.replace("/(tabs)");
    }, [isAuthenticated, user, location]);

    if(isLoading) return <Loading />;

    return children;
}

export default UserOnly