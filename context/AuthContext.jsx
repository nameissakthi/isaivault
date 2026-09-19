import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async () => {
        try {
            setIsLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 5000));

            const result = {
                success : true,
                user : {
                    name : "sakthivel",
                    email : "sakthivel@gmail.com"
                }
            };

            if(result.success) {
                setUser(result.user);
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