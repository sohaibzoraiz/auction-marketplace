"use client"
//import React, { useState } from "react";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
//import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Breadcrumb2 from "../components/common/Breadcrumb2";

function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { userData, setUserData, isLoading } = useContext(UserContext) ?? {};
    useEffect(() => {
      if (!isLoading && userData) {
          const originalUrl = new URLSearchParams(window.location.search).get("redirect") || "/";
          router.push(originalUrl); // Redirect to previous page or home
      }
  }, [isLoading, userData, router]);
  



    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!response.ok) throw new Error("Invalid credentials");

            const userResponse = await fetch("/api/auth/user", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const userData = await userResponse.json();
            setUserData(userData);

            const originalUrl = new URLSearchParams(window.location.search).get("redirect");
            if (originalUrl) {
                router.push(originalUrl);
            } else {
                router.push("/");
            }
        } catch (error) {
            setError(error.message);
        }
    }
    if (isLoading) return <p>Loading...</p>;
    if (userData) return null;


    return (
      <>
      <Breadcrumb2 pagetitle="Login" currentPage="login" />
        <div className="container pt-110 mb-110">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="contact-form-area">
            <div className="section-title">
                  <h2>Sign <span>In</span></h2>
                </div>
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12 mb-20">
                    <div className="form-inner">
                      <label>Email*</label>
                      <input
                        type="email"
                        placeholder="info@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
  
                  <div className="col-md-12 mb-20">
                    <div className="form-inner">
                      <label>Password*</label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
  
                  <div className="col-md-12">
                    <div className="form-inner">
                      <button className="primary-btn btn-hover w-100" type="submit">
                        Login
                        <span style={{ top: "40.5px", left: "84.2344px" }} />
                      </button>
                    </div>
                  </div>
  
                  {error && (
                    <div className="col-md-12 mt-2">
                      <p className="text-danger">{error}</p>
                    </div>
                  )}
                </div>
              </form>
              <div className="text-center mt-3">
                <Link href="/register" className="text-decoration-none">
                  Don&apos;t have an account? Register Here!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
}

export default LoginPage;
