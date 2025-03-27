"use client";
import Link from "next/link";
import { useState } from "react";
//import { FaWhatsapp, FaHeart } from "react-icons/fa";
import { RiAuctionLine,RiWhatsappLine, RiHeart3Line } from "react-icons/ri";
import { IoCarSportSharp } from "react-icons/io5";
import UserDropdown from "../homepage/Dropdown";

const BottomNav = () => {
    const [active, setActive] = useState("");

    return (
        <div className="bottom-nav d-lg-none">
            <Link href="/whatsapp" className={`nav-item ${active === "whatsapp" ? "active" : ""}`} onClick={() => setActive("whatsapp")}>
                <RiWhatsappLine size={24} />
                <span>Whatsapp</span>
            </Link>
            <Link href="/sell-your-car" className={`nav-item ${active === "sell" ? "active" : ""}`} onClick={() => setActive("sell")}>
                <RiAuctionLine size={24} />
                <span>Sell</span>
            </Link>
            <Link href="/auctions" className={`nav-item ${active === "auctions" ? "active" : ""}`} onClick={() => setActive("auctions")}>
                <IoCarSportSharp size={50}/>
                
            </Link>
            <Link href="/wishlist" className={`nav-item ${active === "wishlist" ? "active" : ""}`} onClick={() => setActive("wishlist")}>
                <RiHeart3Line size={24} />
                <span>Wishlist</span>
            </Link>
            <UserDropdown variant="bottom-nav" />

        </div>
    );
};

export default BottomNav;
