// frontend/app/sell-your-car/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function CreateAuctionPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [canCreateListing, setCanCreateListing] = useState(false);
    const [upgradeMessage, setUpgradeMessage] = useState('');

    const [formData, setFormData] = useState({
        city: '',
        carMake: '',
        yearModel: '',
        registrationCity: '',
        mileage: '',
        demandPrice: '',
        description: '',
        inspectionCompanyName: '',
        inspectionReport: '',
        listingType: '',
        carPhotosJsonb: '',
        reservePrice: '',
        endTime: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                // Retrieve token from localStorage
                const token = localStorage.getItem('accessToken');

                if (!token) {
                    // If no token, redirect to login page
                    console.log('Token not found in localStorage');
                    const originalUrl = window.location.pathname;
                    router.push(`/login?redirect=${originalUrl}`);
                    return;
                }

                // Check if user is logged in and get user data
                const response = await fetch('/api/auth/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include token in header
                    },
                });
                if (!response.ok) {
                    // If not logged in, redirect to login page

                    const originalUrl = window.location.pathname;
                    router.push(`/login?redirect=${originalUrl}`);
                    return;
                }

                const userData = await response.json();
                console.log('User Data:', userData);
                setUser(userData);

                // Check user's plan and listing count
                if (userData.plan === 'basic') {
                    if (userData.listingCount < 1) {
                        setCanCreateListing(true);
                    } else {
                        setCanCreateListing(false);
                        setUpgradeMessage('Basic plan users can only create one listing. Upgrade to create more.');
                    }
                } else {
                    setCanCreateListing(true); // Premium plan users can create listings
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Retrieve token from localStorage
            const token = localStorage.getItem('accessToken');

            // Call the backend API to create a new auction listing
            const response = await fetch(`/api/auctions/create`, { // Corrected URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include token in header
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create auction');
            }
            console.log("Front End Form Data = " , formData)

            // Redirect to a success page or auction listing page
            //router.push('/auctions/success');
        } catch (err) {
            setError(err.message || 'Failed to create auction');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!canCreateListing) {
        return (
            <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
                <h1>Create New Auction</h1>
                <p>{upgradeMessage}</p>
                <Link href="/pricing" className="text-blue-600 hover:text-blue-800">Upgrade Plan</Link>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
            <h1>Create New Auction</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City:</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required
                        className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="carMake" className="block text-sm font-medium text-gray-700">Car Make:</label>
                    <input type="text" id="carMake" name="carMake" value={formData.carMake} onChange={handleChange} required
                        className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="yearModel" className="block text-sm font-medium text-gray-700">Year Model:</label>
                    <input type="text" id="yearModel" name="yearModel" value={formData.yearModel} onChange={handleChange} required
                        className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="registrationCity" className="block text-sm font-medium text-gray-700">Registration City:</label>
                    <input type="text" id="registrationCity" name="registrationCity" value={formData.registrationCity} onChange={handleChange} required
                        className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Mileage:</label>
                    <input type="number" id="mileage" name="mileage" value={formData.mileage} onChange={handleChange} required
                        className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="demandPrice" className="block text-sm font-medium text-gray-700">Demand Price:</label>
                    <input type="number" id="demandPrice" name="demandPrice" value={formData.demandPrice} onChange={handleChange} required
                        className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required
                        className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md"></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="inspectionCompanyName" className="block text-sm font-medium text-gray-700">Inspection Company Name:</label>
                    <input type="text" id="inspectionCompanyName" name="inspectionCompanyName" value={formData.inspectionCompanyName} onChange={handleChange} required
                        className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="inspectionReport" className="block text-sm font-medium text-gray-700">Inspection Report:</label>
                    <input type="text" id="inspectionReport" name="inspectionReport" value={formData.inspectionReport} onChange={handleChange} required
                        className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="listingType" className="block text-sm font-medium text-gray-700">Listing Type:</label>
                    <select id="listingType" name="listingType" value={formData.listingType} onChange={handleChange} required
                        className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md">
                        <option value="">Select Listing Type</option>
                        <option value="auction">Auction</option>
                        <option value="fixed-price">Fixed Price</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="carPhotosJsonb" className="block text-sm font-medium text-gray-700">Car Photos (JSON):</label>
                    <textarea id="carPhotosJsonb" name="carPhotosJsonb" value={formData.carPhotosJsonb} onChange={handleChange}
                        className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md"></textarea>
                </div>

                <div className="mb-4">
                    <label htmlFor="reservePrice" className="block text-sm font-medium text-gray-700">Reserve Price:</label>
                    <input type="number" id="reservePrice" name="reservePrice" value={formData.reservePrice} onChange={handleChange}
                        className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md" disabled={user && user.plan !== 'premium'} />
                </div>

                {user && user.plan === 'premium' ? (
                    <div className="mb-4">
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time:</label>
                        <input type="datetime-local" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange}
                            className="block w-full p-2 text-sm text-gray-700 border border-gray rounded-md" />
                    </div>
                ) : (
                    <div>
                        <p>End Time will be automatically set to 15 days from now.</p>
                    </div>
                )}
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">Create Auction</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
            <div className="mt-4">
                <p>Options:</p>
                <Link href="/pricing" className="text-blue-600 hover:text-blue-800">Get Yearly Subscription</Link>
                <Link href="/featured-listing" className="text-blue-600 hover:text-blue-800">Opt for Featured Listing</Link>
            </div>
        </div>
    );
}

export default CreateAuctionPage;
