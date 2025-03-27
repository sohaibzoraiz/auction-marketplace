"use client";
import { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { UserContext } from "../../contexts/UserContext";

const UserDropdown = () => {
    const { userData, setUserData } = useContext(UserContext) ?? {};
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLogout = async () => {
        try {
          const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include', // Ensures cookies are included
          });
      
          if (response.ok) {
            // Clear user data in context
            setUserData(null);
            // Redirect to login page
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
        <div className="position-relative" ref={dropdownRef}>
            {/* Desktop Button */}
            <button 
                onClick={toggleDropdown} 
                className="login-btn btn-hover d-lg-flex d-none align-items-center"
            >
                <svg width={15} height={19} viewBox="0 0 15 19" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.8751 4.17663C11.875 5.00255 11.6183 5.8099 11.1375 6.49658C10.6567 7.18326 9.97335 7.71843 9.17389 8.03442C8.37443 8.35041 7.49475 8.43303 6.6461 8.27184C5.79744 8.11064 5.01792 7.71286 4.40611 7.12881C3.79429 6.54475 3.37766 5.80064 3.20889 4.99058C3.04012 4.18052 3.1268 3.34088 3.45796 2.57783C3.78912 1.81479 4.34989 1.16261 5.06937 0.703757C5.78884 0.244909 6.6347 7.28125e-09 7.5 0C8.07459 3.64089e-05 8.64354 0.108097 9.17438 0.318012C9.70521 0.527927 10.1875 0.835585 10.5938 1.22342C11.0001 1.61126 11.3223 2.07167 11.5422 2.57839C11.762 3.0851 11.8752 3.62818 11.8751 4.17663ZM7.5 9.58844C6.26105 9.58705 5.0354 9.83216 3.90124 10.3082C2.76708 10.7842 1.74932 11.4806 0.912902 12.353C-0.563582 13.8885 -0.20194 16.3311 1.6571 17.4243C3.41487 18.4546 5.43728 19 7.5 19C9.56272 19 11.5851 18.4546 13.3429 17.4243C15.2019 16.3311 15.5636 13.8885 14.0871 12.353C13.2507 11.4806 12.2329 10.7842 11.0988 10.3082C9.9646 9.83216 8.73895 9.58705 7.5 9.58844Z" />
                </svg>
                My Account
            </button>

            {/* Mobile Button */}
            <div className="btn-area d-lg-none d-flex w-100">
                <button onClick={toggleDropdown} className="login-btn btn-hover w-100">
                    <svg width={15} height={19} viewBox="0 0 15 19" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.8751 4.17663C11.875 5.00255 11.6183 5.8099 11.1375 6.49658C10.6567 7.18326 9.97335 7.71843 9.17389 8.03442C8.37443 8.35041 7.49475 8.43303 6.6461 8.27184C5.79744 8.11064 5.01792 7.71286 4.40611 7.12881C3.79429 6.54475 3.37766 5.80064 3.20889 4.99058C3.04012 4.18052 3.1268 3.34088 3.45796 2.57783C3.78912 1.81479 4.34989 1.16261 5.06937 0.703757C5.78884 0.244909 6.6347 7.28125e-09 7.5 0C8.07459 3.64089e-05 8.64354 0.108097 9.17438 0.318012C9.70521 0.527927 10.1875 0.835585 10.5938 1.22342C11.0001 1.61126 11.3223 2.07167 11.5422 2.57839C11.762 3.0851 11.8752 3.62818 11.8751 4.17663ZM7.5 9.58844C6.26105 9.58705 5.0354 9.83216 3.90124 10.3082C2.76708 10.7842 1.74932 11.4806 0.912902 12.353C-0.563582 13.8885 -0.20194 16.3311 1.6571 17.4243C3.41487 18.4546 5.43728 19 7.5 19C9.56272 19 11.5851 18.4546 13.3429 17.4243C15.2019 16.3311 15.5636 13.8885 14.0871 12.353C13.2507 11.4806 12.2329 10.7842 11.0988 10.3082C9.9646 9.83216 8.73895 9.58705 7.5 9.58844Z" />
                    </svg>
                    My Account
                </button>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="position-absolute start-0 w-100 bg-white border rounded shadow">
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
        </div>
    );
};

export default UserDropdown;
