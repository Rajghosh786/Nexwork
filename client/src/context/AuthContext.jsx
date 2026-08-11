import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCurrentUser = async () => {
        const response = await api.get("/auth/me");

        return response.data.user;
    };

    const refreshUser = async () => {
        try {
            const currentUser = await fetchCurrentUser();

            setUser(currentUser);
            setIsAuthenticated(true);

            return currentUser;
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);

            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        setUser(response.data.user);
        setIsAuthenticated(true);

        return response.data;
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const checkAuthentication = async () => {
            try {
                const currentUser = await fetchCurrentUser();

                if (!isMounted) {
                    return;
                }

                setUser(currentUser);
                setIsAuthenticated(true);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setUser(null);
                setIsAuthenticated(false);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        checkAuthentication();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};