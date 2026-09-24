import { createContext, useContext, useEffect, useState } from "react";
import { loginWithGoogle, logoutFromGoogle, restoreGoogleSession } from "../services/auth/authService";

import { useAudioPlayerContext } from "../context/AudioPlayerContext";

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { stopMusic } = useAudioPlayerContext();

    useEffect(() => {

        const restoreSession = async () => {
            try {
                setIsLoading(true);
                const response = await restoreGoogleSession();

                if(response.success) setUser(response.user);
            } catch(error) {
                console.log(error.message);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        restoreSession();
    }, [])

    const login = async () => {
        try {
            setIsLoading(true);

            const result = await loginWithGoogle();

            if(result.success) setUser(result.user);

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

            stopMusic();
            
            await logoutFromGoogle();

            setUser(null);
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