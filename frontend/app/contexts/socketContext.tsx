
'use client';

import { createContext, useState, useEffect, useContext } from "react";
import { connectSocket, disconnectSocket } from "../components/socket";
import { UserContext } from "./UserContext";
/* eslint-disable @typescript-eslint/no-explicit-any */
interface SocketContextValue {
  socket: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
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
  useEffect(() => {
    if (socket && userData && userData.id) {
      console.log("User logged in, reconnecting socket to update authentication...");
      disconnectSocket()
      connectSocket()
        .then((newSocket) => {
          setSocket(newSocket);
        })
        .catch((err) => console.error("Error reconnecting socket:", err));
    }
  }, [userData]); // re-run when userData changes

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };

