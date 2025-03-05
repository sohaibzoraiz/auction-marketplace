'use client';

import { createContext, useState, useEffect, useContext } from "react";
import { connectSocket } from "../components/socket";
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
  const { userData } = useContext(UserContext); // Access userData from UserContext

  useEffect(() => {
    if (userData && typeof window !== 'undefined') { // Only connect if userData is available and on the client
      connectSocket().then((sock) => {
        setSocket(sock);
      });
    }
  }, [userData]); // Re-run effect when userData changes

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
