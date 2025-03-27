"use client";
import Link from "next/link";
import { useState } from "react";
import { FaWhatsapp, FaHeart, FaUser } from "react-icons/fa";
import { RiAuctionLine } from "react-icons/ri";
import UserDropdown from "../homepage/Dropdown";

const BottomNav = () => {
    const [active, setActive] = useState("");

    return (
        <div className="bottom-nav d-lg-none">
            <Link href="/whatsapp" className={`nav-item ${active === "whatsapp" ? "active" : ""}`} onClick={() => setActive("whatsapp")}>
                <FaWhatsapp size={24} />
                <span>Whatsapp</span>
            </Link>
            <Link href="/auctions" className={`nav-item ${active === "shop" ? "active" : ""}`} onClick={() => setActive("shop")}>
                <RiAuctionLine size={24} />
                <span>Auctions</span>
            </Link>
            <Link href="/wishlist" className={`nav-item ${active === "wishlist" ? "active" : ""}`} onClick={() => setActive("wishlist")}>
                <FaHeart size={24} />
                <span>Wishlist</span>
            </Link>
            <UserDropdown variant="bottom-nav" />

        </div>
    );
};

export default BottomNav;
