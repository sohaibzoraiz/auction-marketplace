"use client";
import { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { UserContext } from "../../contexts/UserContext";
import { RiUserLine } from "react-icons/ri"; // User icon
import { useRouter } from 'next/navigation';

const UserDropdown = ({ variant }) => {
    const { userData, setUserData } = useContext(UserContext) ?? {};
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

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
                    <span style={{ top: "40.5px", left: "84.2344px" }} />
                </button>
            )}

            {/* Sidebar Menu Button (Same as Current) */}
            {variant === "sidebar" && (
                <button onClick={toggleDropdown} className="login-btn p-2 w-100 text-start">
                    My Account
                    <span style={{ top: "40.5px", left: "84.2344px" }} />
                </button>
            )}

            {/* Bottom Navbar Icon */}
            {variant === "bottom-nav" && (
                <Link href="#" className={  "nav-item"} onClick={toggleDropdown}>
                <RiUserLine size={24} />
                <span>Account</span>
            </Link>
               
            )}

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                ref={dropdownRef}
                className="dropdown-menu show position-absolute w-100 border rounded shadow-sm mt-1"
                style={{ zIndex: 1050 }}
              >
                <ul className="list-unstyled m-0">
                  {userData ? (
                    <>
                      <li className="dropdown-item-text text-muted">
                        Credits: {userData.plan === "premium" ? "Unlimited" : userData.free_bids_remaining}
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/dashboard");
                          }}
                        >
                          Dashboard
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/login");
                          }}
                        >
                          Login
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/register");
                          }}
                        >
                          Register
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/pricing");
                          }}
                        >
                          Pricing
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
                    )}
        </>
    );
};

export default UserDropdown;
