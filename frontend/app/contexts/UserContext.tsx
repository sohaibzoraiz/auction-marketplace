// contexts/UserContext.tsx
"use client"
import { createContext, useState, useEffect } from 'react';
//import { useRouter } from 'next/navigation';

interface UserContextValue {
    userData: Record<string, unknown> | null;
    setUserData: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>;
    fetchUser: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setUserData(null);
                return;
            }

            const response = await fetch('/api/auth/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                setUserData(null);
                return;
            }

            const userData = await response.json();
            setUserData(userData);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to fetch user data');
            } else {
                setError('Failed to fetch user data');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ userData, setUserData, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

