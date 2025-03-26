"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [completeAddress, setCompleteAddress] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          contactNumber,
          completeAddress,
          identificationNumber,
        }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Registration failed");

      router.push("/login");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="container pt-110 mb-110">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="contact-form-area">
            <h2 className="text-center mb-4">Register</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12 mb-20">
                  <div className="form-inner">
                    <label>Name*</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

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

                {/* Confirm Password Field */}
                <div className="col-md-12 mb-20">
                  <div className="form-inner">
                    <label>Confirm Password*</label>
                    <input
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-12 mb-20">
                  <div className="form-inner">
                    <label>Contact Number*</label>
                    <input
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-12 mb-20">
                  <div className="form-inner">
                    <label>Complete Address*</label>
                    <textarea
                      rows={3}
                      placeholder="123 Street, City, Country"
                      value={completeAddress}
                      onChange={(e) => setCompleteAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-12 mb-20">
                  <div className="form-inner">
                    <label>Identification Number*</label>
                    <input
                      type="number"
                      placeholder="1234567890"
                      value={identificationNumber}
                      onChange={(e) => setIdentificationNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-inner">
                    <button className="primary-btn btn-hover w-100" type="submit">
                      Register
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
              <Link href="/login" className="text-decoration-none">
                Already have an account? Login Here!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
