// contexts/UserContext.tsx
"use client"
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserContextValue {
    userData: any;
    setUserData: (data: any) => void;
    fetchUser: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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
                setError(err.message);
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
