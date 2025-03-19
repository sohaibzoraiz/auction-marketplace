// app/page.js
"use client";
import { useState, useEffect } from 'react';

//import HeroSlider from './components/HeroSlider';
import Home2Banner from "./components/slider/Home2Banner";
import Home2Category from "./components/category/Home2Category";
import Home2Banner2 from "./components/slider/Home2Banner2";
//import Home2Banner3 from "./components/slider/Home2Banner3";
import Home2latestAuction from "./components/latest-auction/Home2latestAuction";
import FeaturedListings from './components/FeaturedListings';
import AllListings from './components/AllListings';


function HomePage() {
    const [featuredListings, setFeaturedListings] = useState([]);
    const [allListings, setAllListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // Fetch featured listings (premium members only)
                const featuredResponse = await fetch('/api/auctions/featured');
                if (!featuredResponse.ok) {
                    console.error('Error fetching featured listings:', featuredResponse.statusText);
                    return;
                }

                try {
                    const featuredData = await featuredResponse.json();
                    setFeaturedListings(featuredData);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    const text = await featuredResponse.text();
                    console.log('Non-JSON response:', text);
                }

                // Fetch all listings
                const allResponse = await fetch('/api/auctions');
                if (!allResponse.ok) {
                    console.error('Error fetching all listings:', allResponse.statusText);
                    return;
                }

                try {
                    const allData = await allResponse.json();
                    setAllListings(allData);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    const text = await allResponse.text();
                    console.log('Non-JSON response:', text);
                }
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        fetchListings();
    }, []);

    return (
        <div>
            
            <Home2Banner />
            <Home2Category />
            <Home2latestAuction />
            <Home2Banner2 />
            <FeaturedListings listings={featuredListings} />
            <AllListings listings={allListings} />
            
        </div>
    );
}

export default HomePage;
