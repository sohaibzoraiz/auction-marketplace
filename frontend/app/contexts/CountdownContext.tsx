'use client';
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

const CountdownContext = createContext(new Date());



export const CountdownProvider = ({ children }: { children: ReactNode }) => {

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CountdownContext.Provider value={now}>
      {children}
    </CountdownContext.Provider>
  );
};

export const useNow = () => useContext(CountdownContext);
