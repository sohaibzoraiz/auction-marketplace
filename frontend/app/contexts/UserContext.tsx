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
  isLoading: boolean;
}

const defaultContextValue: UserContextValue = {
  userData: null,
  setUserData: () => {},
  fetchUser: async () => {},
  isLoading: true,
};

const UserContext = createContext<UserContextValue>(defaultContextValue);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async (): Promise<void> => {
    console.log("Fetching user data...");
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/user", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        setUserData(null);
      } else {
        const { user } = await response.json(); // ✅ Extract properly
        setUserData(user ?? null); // just in case
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setUserData(null);
    } finally {
      setIsLoading(false); // Mark loading as complete
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, fetchUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};


export { UserProvider, UserContext };
