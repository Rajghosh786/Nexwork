import {
    createContext,
    useContext,
    useEffect,
} from "react";

import socket from "../services/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            socket.disconnect();
            return;
        }

        const handleConnect = () => {
            console.log("Socket connected:", socket.id);

            socket.emit("join_user", user.id);
        };

        const handleDisconnect = (reason) => {
            console.log(
                "Socket disconnected:",
                reason
            );
        };

        const handleConnectError = (error) => {
            console.error(
                "Socket connection error:",
                error.message
            );
        };

        socket.on("connect", handleConnect);
        socket.on(
            "disconnect",
            handleDisconnect
        );
        socket.on(
            "connect_error",
            handleConnectError
        );

        if (!socket.connected) {
            socket.connect();
        } else {
            handleConnect();
        }

        return () => {
            socket.off(
                "connect",
                handleConnect
            );

            socket.off(
                "disconnect",
                handleDisconnect
            );

            socket.off(
                "connect_error",
                handleConnectError
            );

            socket.disconnect();
        };
    }, [isAuthenticated, user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};