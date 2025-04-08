// app/page.js
"use client";
import { useState, useEffect } from 'react';

import Home2Banner from "./components/homepage/slider/Home2Banner";
import Home2Category from "./components/category/Home2Category";
import Home2Banner2 from "./components/homepage/slider/Home2Banner2";
import Home2Banner3 from "./components/homepage/slider/Home2Banner3";
import Home2latestAuction from "./components/auction-components/latestAuction";
import FeaturedListings from './components/auction-components/FeaturedListings';
import Home2ProcessSection from "./components/process-section/Home2ProcessSection";
//import Home2Testimonial from "./components/testimonial/Home2Testimonial";
import Home2Faq from "./components/faq/Home2Faq";




function HomePage() {
    const [featuredListings, setFeaturedListings] = useState([]);
    const [latestListings, setlatestListings] = useState([]);

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
                // Fetch latest listings
                const latestResponse = await fetch('/api/auctions/latest');
                if (!latestResponse.ok) {
                    console.error('Error fetching latest listings:', latestResponse.statusText);
                    return;
                }

                try {
                    const latestData = await latestResponse.json();
                    setlatestListings(latestData);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    const text = await latestResponse.text();
                    console.log('Non-JSON response:', text);
                }
                if (typeof window !== 'undefined' && window.WOW) {
                    new window.WOW().init();
                    setTimeout(() => {
                      window.WOW?.sync?.();
                    }, 100); // Give time for DOM to update
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
            <Home2latestAuction listings={latestListings}/>
            <Home2Banner2 />
            {featuredListings.length > 0 ? (
                 <FeaturedListings listings={featuredListings} />
            ) : (
                 <div className="text-center py-10">No featured cars available right now.</div>
            )}
            <Home2Banner3 />
            <Home2ProcessSection />
            <Home2Faq />
           
            
            
        </div>
    );
}

export default HomePage;
//<AllListings listings={allListings} />