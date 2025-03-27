"use client";
import Link from "next/link";
import { useState } from "react";
import { FaWhatsapp, FaHeart, FaUser } from "react-icons/fa";
import { RiAuctionLine } from "react-icons/ri";

const BottomNav = () => {
    const [active, setActive] = useState("");

    return (
        <div className="bottom-nav d-lg-none">
            <Link href="/whatsapp" className={`nav-item ${active === "whatsapp" ? "active" : ""}`} onClick={() => setActive("whatsapp")}>
                <FaWhatsapp size={24} />
                <span>Whatsapp</span>
            </Link>
            <Link href="/shop" className={`nav-item ${active === "shop" ? "active" : ""}`} onClick={() => setActive("shop")}>
                <RiAuctionLine size={24} />
                <span>Auctions</span>
            </Link>
            <Link href="/wishlist" className={`nav-item ${active === "wishlist" ? "active" : ""}`} onClick={() => setActive("wishlist")}>
                <FaHeart size={24} />
                <span>Wishlist</span>
            </Link>
            <Link href="/account" className={`nav-item ${active === "account" ? "active" : ""}`} onClick={() => setActive("account")}>
                <FaUser size={24} />
                <span>Account</span>
            </Link>
        </div>
    );
};

export default BottomNav;
