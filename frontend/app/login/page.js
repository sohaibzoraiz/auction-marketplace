"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { setUserData } = useContext(UserContext) ?? {};

   // In LoginPage.js
async function handleSubmit(event) {
    event.preventDefault();
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        if (!response.ok) throw new Error('Invalid credentials');
        
        // Parse JSON response
        const data = await response.json();
        
        /*if (!data || !data.accessToken) {
            throw new Error('Invalid response from server');
        }
        
        const accessToken = data.accessToken;
        localStorage.setItem('accessToken', accessToken);*/
        console.log('Login successful');
        
        /*const userResponse = await fetch('/api/auth/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });*/
        const userResponse = await fetch('/api/auth/user', {
            method: 'GET',
            credentials: 'include', // Automatically sends the cookies
            headers: { 'Content-Type': 'application/json' },
          });
          
        const userData = await userResponse.json();
        setUserData(userData);
        const originalUrl = new URLSearchParams(window.location.search).get('redirect');
        
        if (originalUrl) {
            router.push(originalUrl);
        } else {
            router.push('/'); // Default to homepage if no redirect URL
        }
    } catch (error) {
        setError(error.message);
    }
}


    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
            <h1>Login</h1>
            
<Link href="/register" className="text-blue-600 hover:text-blue-800">Don&apos;t have an account? Register Here!</Link>

<form onSubmit={handleSubmit}>
    
<div className="mb-4">
<label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
<input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="" required="" 
className={"block w-full p-2 pl-10 text-sm text-gray-700 border border-gray rounded-md focus:border-blue focus:bg-white focus:text-black"} />
</div>

<div className="mb-4">
<label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
<input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" required="" 
className={"block w-full p-2 pl-10 text-sm text-gray-700 border border-gray rounded-md focus:border-blue focus:bg-white focus:text-black"} />
</div>

<button type="submit" className="bg-orange hover:bg-orange-dark py-2.5 px-5 cursor-pointer transition duration-300ms">Login</button>

{error && <p style={{ color: "red" }}>{error}</p>}
</form>
</div>
    );
}

export default LoginPage;
