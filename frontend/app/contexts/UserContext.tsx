'use client';

import { createContext, useState, useEffect } from "react";

interface UserData {
  id: number;
  name: string;
  contact_number: string;
  email_address: string;
  complete_address: string;
  free_bids_remaining: string;
  identification_number: string;
  password?: string; // Optional if you don't want to expose it
  plan: string;
}

interface UserContextValue {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  fetchUser: () => Promise<void>;
}

const defaultContextValue: UserContextValue = {
  userData: null,
  setUserData: () => {},
  fetchUser: async () => {},
};

const UserContext = createContext<UserContextValue>(defaultContextValue);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async (): Promise<void> => {
    console.log("Fetching user data...");
    try {
      /*const token = localStorage.getItem("accessToken");
      if (!token) {
        setUserData(null);
        return;
      }

      const response = await fetch("/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
        */
      const response = await fetch("/api/auth/user", {
        method: "GET",
        credentials: "include", // ensures the HTTP‑only cookie is sent
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        setUserData(null);
        return;
      }

      const user = await response.json();
      setUserData(user);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
