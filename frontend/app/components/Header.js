// components/Header.tsx
"use client"
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';

function Header() {
    const { userData, setUserData } = useContext(UserContext) ?? {};
    const router = useRouter();
    
    if (!userData) {
        return (
            <nav className="bg-gray-800 text-white p-4 flex justify-between">
                <div className="flex items-center">
                    <Link href="/">
                        Home
                    </Link>
                </div>
                <ul className="flex items-center space-x-4">
                    <li>
                        <Link href="/sell-your-car">
                            Sell Your Car
                        </Link>
                    </li>
                    <li>
                        <Link href="/subscribe">
                            Subscribe
                        </Link>
                    </li>
                    <li>
                        <Link href="/login">
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link href="/register">
                            Register
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }

    const handleLogout = async () => {
        localStorage.removeItem('accessToken');
        setUserData(null); // Update state here
        router.push('/login');
    };
    if(userData.plan === 'premium'){
        userData.free_bids_remaining = 'unilimited';
       }
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between">
            <div className="flex items-center">
                <Link href="/">
                    Home
                </Link>
            </div>
            <ul className="flex items-center space-x-4">
                <li>
                    <Link href="/sell-your-car">
                        Sell Your Car
                    </Link>
                </li>
                <li>
                    <Link href="/subscribe">
                        Subscribe
                    </Link>
                </li>
                <li>
                    <p>Free Bids: {userData.free_bids_remaining}</p>
                </li>
                <li>
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Header;
