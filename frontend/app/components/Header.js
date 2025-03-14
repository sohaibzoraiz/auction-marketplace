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
    <header className="header-topbar-area bg-white shadow-sm border-b border-gray-200">
      <div className="topbar-area py-2 text-sm text-gray-700">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="mailto:info@example.com" className="flex items-center space-x-1">
              <span className="material-icons text-gray-500">email</span>
              <span>info@example.com</span>
            </a>
            <span className="border-l border-gray-300 h-4"></span>
            <a href="#" className="flex items-center space-x-1">
              <span className="material-icons text-gray-500">support_agent</span>
              <span>Customer support</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/how-to-buy" className="border px-3 py-1 rounded-full text-sm">HOW TO BID</Link>
            <Link href="/how-to-sell" className="border px-3 py-1 rounded-full text-sm">SELL YOUR ITEM</Link>
          </div>
        </div>
      </div>
      
      <nav className="container flex justify-between items-center py-4">
        <Link href="/">
          <img src="/assets/img/logo.svg" alt="ProBid" className="h-12" />
        </Link>
        
        <form onSubmit={handleSearch} className="flex bg-gray-100 p-2 rounded-full border border-gray-300 order-last md:order-none">
          <input 
            type="text" 
            className="px-3 py-2 border-none outline-none bg-transparent w-64" 
            placeholder="Search your product..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-full">
            <span className="material-icons">search</span>
          </button>
        </form>

        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li className={pathName === "/" ? "text-black font-bold" : ""}>
            <Link href="/">Home</Link>
          </li>
          <li className={pathName.startsWith("/auction") ? "text-black font-bold" : ""}>
            <Link href="/auction-grid">Auctions</Link>
          </li>
          <li className={pathName.startsWith("/blog") ? "text-black font-bold" : ""}>
            <Link href="/blog-grid">Blog</Link>
          </li>
          <li className={pathName === "/contact" ? "text-black font-bold" : ""}>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>

        <div className="hidden md:block order-last md:order-none">
          <Link href="/account" className="bg-black text-white px-4 py-2 rounded-full flex items-center space-x-1">
            <span className="material-icons">person</span>
            <span>My Account</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
