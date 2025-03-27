"use client";
import { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { UserContext } from "../../contexts/UserContext";
import { RiUserLine } from "react-icons/ri"; // User icon

const UserDropdown = ({ variant }) => {
    const { userData, setUserData } = useContext(UserContext) ?? {};
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setUserData(null);
                setIsOpen(false);
                router.push('/login');
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* Desktop Button */}
            {variant === "desktop" && (
                <button 
                    onClick={toggleDropdown} 
                    className="login-btn btn-hover d-lg-flex d-none align-items-center"
                >
                    My Account
                </button>
            )}

            {/* Sidebar Menu Button (Same as Current) */}
            {variant === "sidebar" && (
                <button onClick={toggleDropdown} className="login-btn p-2 w-100 text-start">
                    My Account
                </button>
            )}

            {/* Bottom Navbar Icon */}
            {variant === "bottom-nav" && (
                <Link href="#t" className={  "nav-item"} onClick={toggleDropdown}>
                <RiUserLine size={24} />
                <span>Account</span>
            </Link>
               
            )}

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={`position-absolute w-100 bg-white border rounded shadow z-3 ${variant === "sidebar" || variant === "bottom-nav" ? "bottom-100" : "start-0"}`}>

                    <ul className="list-unstyled m-0 p-2">
                        {userData ? (
                            <>
                                <li className="p-2 border-bottom">Bid Credits: {userData.free_bids_remaining}</li>
                                <li className="p-2 border-bottom"><Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
                                <li className="p-2 hover-bg-secondary"><button onClick={handleLogout}>Logout</button></li>
                            </>
                        ) : (
                            <>
                                <li className="p-2 border-bottom"><Link href="/login" onClick={() => setIsOpen(false)}>Login</Link></li>
                                <li className="p-2 border-bottom"><Link href="/register" onClick={() => setIsOpen(false)}>Register</Link></li>
                                <li className="p-2 hover-bg-secondary"><Link href="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </>
    );
};

export default UserDropdown;
