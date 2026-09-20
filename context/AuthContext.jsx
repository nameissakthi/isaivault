import { useRouter } from "expo-router";
import { createContext, useContext, useState } from "react";
import { loginWithGoogle, logoutFromGoogle } from "../services/auth/authService";

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const login = async () => {
        try {
            setIsLoading(true);

            const result = await loginWithGoogle();

            if(result.success) {
                setUser(result.user);
                router.replace("/(tabs)")
            }

            return result;

        } catch (error) {
            throw new Error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const logout = async () => {
        try {
            setIsLoading(true);
            
            await logoutFromGoogle();

            setUser(null);
            router.replace("/login");
        } catch (error) {
            throw new Error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const value = {
        user, isLoading, isAuthenticated : user !== null,
        login, logout
    }
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuth = () => {
    
    const context = useContext(AuthContext);

    if(!context) throw new Error("AuthContext must be used within AuthProvider")

    return context;
}

export {
    AuthProvider,
    useAuth
}