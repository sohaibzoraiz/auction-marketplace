"use client";

import React, { useState } from 'react';
import Link from 'next/link';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            // Implement backend API call here (e.g., fetch or Axios)
            fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
                .catch((err) => console.error(err));
        } catch (err) { console.error(err); }
    }

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
            <h1>Login Here...</h1>
            <Link href="/register" className="text-blue-600 hover:text-blue-800">Don't have an account? Register Here!</Link>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full p-2 pl-10 text-sm text-gray-700 border border-gray rounded-md focus:border-blue focus:bg-white focus:text-black"
                    />
                </div>

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full p-2 pl-10 text-sm text-gray-700 border border-gray rounded-md focus:border-blue focus:bg-white focus:text-black"
                    />
                </div>

                <button
                    type={'submit'}
                    className={"bg-orange hover:bg-orange-dark py-[8.5px] px-[25.5px] cursor-pointer transition duration-[300ms]"}
                >
                    Login
                </button>

            </form>
        </div>
    );
}

export default LoginPage;
