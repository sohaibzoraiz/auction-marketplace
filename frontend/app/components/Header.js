"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useReducer, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useRouter } from "next/navigation";

// Initial state for reducer
const initialState = {
  activeMenu: "",
  activeSubMenu: "",
  isSidebarOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_MENU":
      return {
        ...state,
        activeMenu: state.activeMenu === action.menu ? "" : action.menu,
        activeSubMenu: state.activeMenu === action.menu ? state.activeSubMenu : "",
      };
    case "TOGGLE_SUB_MENU":
      return {
        ...state,
        activeSubMenu: state.activeSubMenu === action.subMenu ? "" : action.subMenu,
      };
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
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { userData, setUserData } = useContext(UserContext) ?? {};
  const router = useRouter();
  const pathName = usePathname();

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

  // Function to toggle mobile menu
  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <header className="header-topbar-area">
      <div className="topbar-area">
        <div className="container">
          <div className="topbar-wrap flex justify-between">
            <div className="topbar-left">
              <ul className="contact-area flex space-x-4">
                <li>
                  <a href="mailto:info@example.com" className="text-gray-700">
                    info@example.com
                  </a>
                </li>
                <li>
                  <Link href="/how-to-buy">HOW TO BID</Link>
                </li>
                <li>
                  <Link href="/how-to-sell">SELL YOUR ITEM</Link>
                </li>
              </ul>
            </div>
            <div className="topbar-right">
              {!userData ? (
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/login">Login</Link>
                  </li>
                  <li>
                    <Link href="/register">Register</Link>
                  </li>
                </ul>
              ) : (
                <ul className="flex space-x-4">
                  <li>
                    <p>Free Bids: {userData.plan === "premium" ? "Unlimited" : userData.free_bids_remaining}</p>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-red-500">
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="header-area bg-white shadow-md">
        <div className="container flex justify-between items-center py-4">
          <Link href="/" className="text-lg font-bold">
            <img src="/assets/img/logo.svg" alt="Carmandi" className="h-10" />
          </Link>
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
            <button onClick={toggleMenu} className="text-gray-600">
              ☰
            </button>
          </div>

          <div className={`mobile-menu ${isMenuOpen ? "block" : "hidden"} md:hidden absolute bg-white w-full p-4 top-full left-0`}>
            <ul className="flex flex-col space-y-4">
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
                  <button onClick={handleLogout} className="text-red-500">
                    Logout
                  </button>
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
