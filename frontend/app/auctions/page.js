"use client"
import { useState, useEffect } from 'react';
import AllListings from '../components/auction-components/AllListings';
import Breadcrumb2 from "../components/common/Breadcrumb2";

function auctions() {
    const [allListings, setAllListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const allResponse = await fetch('https://api.carmandi.com.pk/api/auctions');
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
                console.error('Error fetching all listings:', error);
            }
        };

        fetchListings();
    }, []);

    return (
        <>
            <Breadcrumb2 currentPage={"Auctions"} pagetitle={"Auctions"} />
            <AllListings listings={allListings} />
        </>
    );
}

export default auctions;