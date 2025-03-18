"use client";
import { useEffect } from "react";
import "@/public/assets/css/bootstrap-icons.css";
import "@/public/assets/css/boxicons.min.css";
import "@/public/assets/css/swiper-bundle.min.css";
import "react-modal-video/css/modal-video.css";
import "@/public/assets/css/slick-theme.css";
import "@/public/assets/css/animate.min.css";
import "@/public/assets/css/nice-select.css";
import "@/public/assets/css/slick.css";
import "@/public/assets/css/bootstrap.min.css";
import "@/public/assets/css/style.css";
import "./globals.css"; // Keep your global styles

import { Geist, Geist_Mono } from "next/font/google";
import { dmsans, playfair_display } from "@/fonts/font";

import ScrollTopBtn from "./components/common/ScrollTopBtn";
import useWow from "@/customHooks/useWow";
import Header from "./components/header.jsx";
import Footer from "./components/Footer";
import { UserProvider } from "./contexts/UserContext";
import { SocketProvider } from "./contexts/socketContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  useWow(); // Template animations

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <UserProvider>
      <SocketProvider>
        <html lang="en" className={`${playfair_display.variable} ${dmsans.variable} ${geistSans.variable} ${geistMono.variable}`}>
          <head>
            <link rel="icon" href="/assets/img/fav-icon.svg" type="image/x-icon" sizes="16x16" />
            <meta name="description" content="Your description here" />
            <meta name="keywords" content="next.js, SEO, meta tags" />
            <title>Probid - Multi Vendor Auction & Bidding</title>
          </head>
          <body className="antialiased">
            <Header />
            <main>{children}</main>
            <Footer />
            <ScrollTopBtn />
          </body>
        </html>
      </SocketProvider>
    </UserProvider>
  );
}
