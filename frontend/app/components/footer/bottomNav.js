"use client";
import Link from "next/link";
import { useState } from "react";
//import { FaWhatsapp, FaHeart } from "react-icons/fa";
import { RiAuctionLine,RiWhatsappLine, RiHeart3Line } from "react-icons/ri";
import { IoCarSportSharp } from "react-icons/io5";
import UserDropdown from "../homepage/Dropdown";

const BottomNav = () => {
    const [active, setActive] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false); // for modal toggle

    return (
        <div className="bottom-nav d-lg-none">
            <Link href="/#" className={`nav-item ${active === "Search" ? "active" : ""}`} onClick={(e) => {
                e.preventDefault();
                setActive("Search");
                setIsSearchOpen(true); // open modal
                }}>
                <RiSearchLine  size={24} />
                <span>Search</span>
            </Link>
            <SearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <div className="separator"></div> {/* Separator */}
            <Link href="/sell-your-car" className={`nav-item ${active === "sell" ? "active" : ""}`} onClick={() => setActive("sell")}>
                <RiAuctionLine size={24} />
                <span>Sell</span>
            </Link>
            <div className="separator"></div> {/* Separator */}
            <Link href="/auctions" className={` nav-item auctions ${active === "auctions" ? "active" : ""}`} onClick={() => setActive("auctions")}>
            
            <span className="auctions-circle">
                <IoCarSportSharp size={50} color="#0d6efd"/>
                <span>Auctions</span>
            </span>
            </Link>
            <div className="separator"></div> {/* Separator */}
            <Link href="/#" className={`nav-item ${active === "wishlist" ? "active" : ""}`} onClick={() => setActive("wishlist")}>
                <RiHeart3Line size={24} />
                <span>Wishlist</span>
            </Link>
            <div className="separator"></div> {/* Separator */}
            <UserDropdown variant="bottom-nav" />

        </div>
    );
};

export default BottomNav;
