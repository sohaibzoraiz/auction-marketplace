'use client';

import { createContext, useState, useEffect, useContext } from "react";
import { connectSocket } from "../components/socket";
import { UserContext } from "./UserContext";

interface SocketContextValue {
  socket: any;
}

const defaultContextValue: SocketContextValue = {
  socket: null,
};

const SocketContext = createContext<SocketContextValue>(defaultContextValue);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const { userData } = useContext(UserContext); // We still have userData available if needed

  useEffect(() => {
    // Always connect the socket on the client, regardless of userData
    if (typeof window !== 'undefined') {
      connectSocket()
        .then((sock) => {
          setSocket(sock);
        })
        .catch((err) => {
          console.error("Error connecting socket:", err);
        });
    }
  }, []); // Run only once on mount

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
