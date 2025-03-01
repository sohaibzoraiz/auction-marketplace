"use client"
import React, { createContext, useEffect } from "react";
import { connectSocket } from "../components/socket";

export const SocketContext = createContext(null);

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    useEffect(() => {
        connectSocket(); // Initialize the socket connection on app load
    }, []);

    return <SocketContext.Provider value={null}>{children}</SocketContext.Provider>;
};
