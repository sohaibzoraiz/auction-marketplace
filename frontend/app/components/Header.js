"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useReducer, useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useRouter } from "next/navigation";

// Initial state for reducer
const initialState = {
  isSidebarOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };
    default:
      return state;
  }
}

const Header = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { userData, setUserData } = useContext(UserContext) ?? {};
  const router = useRouter();
  const pathName = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setUserData(null);
        router.push("/login");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?query=${searchQuery}`);
  };

  return (
    <header className="header-topbar-area bg-white shadow-md">
      <div className="topbar-area py-2 border-b">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="mailto:info@example.com" className="text-gray-600">
              info@example.com
            </a>
            <Link href="/how-to-buy">HOW TO BID</Link>
            <Link href="/sell-your-car">SELL YOUR CAR</Link>
          </div>
          <div className="flex items-center space-x-4">
            {userData ? (
              <>
                <p className="text-sm">Free Bids: {userData.plan === "premium" ? "Unlimited" : userData.free_bids_remaining}</p>
                <button onClick={handleLogout} className="text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      <nav className="container flex justify-between items-center py-4">
        <Link href="/">
          <img src="/assets/img/logo.svg" alt="Carmandi" className="h-12" />
        </Link>
        
        <form onSubmit={handleSearch} className="hidden md:flex bg-gray-100 p-2 rounded-lg">
          <input 
            type="text" 
            className="px-3 py-2 border-none outline-none bg-transparent" 
            placeholder="Search your product..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="text-white bg-green-500 px-4 py-2 rounded-md">Search</button>
        </form>

        <ul className="hidden md:flex space-x-6">
          <li className={pathName === "/" ? "font-bold text-blue-600" : ""}>
            <Link href="/">Home</Link>
          </li>
          <li className={pathName.startsWith("/auction") ? "font-bold text-blue-600" : ""}>
            <Link href="/auction-grid">Auctions</Link>
          </li>
          <li className={pathName.startsWith("/blog") ? "font-bold text-blue-600" : ""}>
            <Link href="/blog-grid">Blog</Link>
          </li>
          <li className={pathName === "/contact" ? "font-bold text-blue-600" : ""}>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>

        <div className="md:hidden">
          <button onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })} className="text-gray-600">
            ☰
          </button>
        </div>
        
        <div className="hidden md:block">
          {userData ? (
            <Link href="/account" className="bg-black text-white px-4 py-2 rounded-md">My Account</Link>
          ) : (
            <Link href="/login" className="bg-black text-white px-4 py-2 rounded-md">My Account</Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {state.isSidebarOpen && (
        <div className="md:hidden bg-white absolute top-0 left-0 w-full h-screen p-6 shadow-lg z-50">
          <button onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })} className="text-gray-600 text-xl">✖</button>
          <ul className="flex flex-col space-y-4 mt-6">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/auction-grid">Auctions</Link>
            </li>
            <li>
              <Link href="/blog-grid">Blog</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            {userData ? (
              <li>
                <button onClick={handleLogout} className="text-red-500">Logout</button>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/login">Login</Link>
                </li>
                <li>
                  <Link href="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
