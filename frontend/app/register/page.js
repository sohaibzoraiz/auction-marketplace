"use client";

import React, { useState } from 'react';
import Link from 'next/link';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [completeAddress, setCompleteAddress] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            // Implement backend API call here (e.g., fetch or Axios)
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    contactNumber,
                    completeAddress,
                    identificationNumber
                }),
            });

            if (!response.ok) throw new Error('Failed to register');

            console.log('Registration successful');
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
            <h1>Register</h1>
            
<Link href="/login" className="text-blue-600 hover:text-blue-800">Already have an account? Login Here!</Link>

<form onSubmit={handleSubmit}>
    
<div className="mb-4">
<label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
<input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="" required="" 
className={"block w-full p-2 pl-10 text-sm text-gray-700 border border-gray rounded-md focus:border-blue focus:bg-white focus:text-black"} />
</div>

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

<div className="mb-4">
<label htmlFor="contact-number" className="block text-sm font-medium text-gray-700">Contact Number:</label>
<input type="tel" id="contact-number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="" required="" 
className={"block w-full p-2 pl-10 text-sm text-gray-700 border border-gray rounded-md focus:border-blue focus:bg-white focus:text-black"} />
</div>

<div className="mb-4">
<label htmlFor="complete-address" className="block text-sm font-medium text-gray-700">Complete Address:</label>
<textarea rows={3} cols={30}
id="complete-address"
value={completeAddress}
onChange={(e)=>setCompleteAddress(e.target.value)}
placeholder=""
required
className="w-full h-fit px-[15px] py-[12.5px] bg-transparent outline-none ring ring-inset ring-slate rounded-lg transition duration-[300ms]"
></textarea>
</div>

<div className="mb-4">
<label htmlFor="identification-number" className="block text-sm font-medium text-gray-700">Identification Number:</label>
<input type="number" id="identification-number"
value={identificationNumber}
onChange={(e)=> setIdentificationNumber(e.target.value)}
placeholder=""
required
className="w-full h-[40px] px-[15px] py-[12.5px] bg-transparent outline-none ring ring-inset ring-slate rounded-lg transition duration-[300ms]"
/>
</div>

<button type="submit" className="bg-orange hover:bg-orange-dark py-2.5 px-5 cursor-pointer transition duration-300ms">Register</button>

{error && <p style={{ color: "red" }}>{error}</p>}
</form>
</div>
    );
}

export default RegisterPage;
