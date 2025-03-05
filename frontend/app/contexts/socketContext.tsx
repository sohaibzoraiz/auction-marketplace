'use client';

import { createContext, useState, useEffect } from "react";
import { connectSocket } from "../components/socket";
/* eslint-disable @typescript-eslint/no-explicit-any */
interface SocketContextValue {
  socket: any;
}

const defaultContextValue: SocketContextValue = {
  socket: null,
};

const SocketContext = createContext<SocketContextValue>(defaultContextValue);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      connectSocket().then((sock) => {
        setSocket(sock);
      });
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
