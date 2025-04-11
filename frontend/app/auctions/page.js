/*"use client"
import { useState, useEffect } from 'react';
import AllListings from '../components/auction-components/AllListings';
import Breadcrumb2 from "../components/common/Breadcrumb2";
import { useSearchParams } from 'next/navigation';

export default function Auctions() {
    const [allListings, setAllListings] = useState([]);
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("q");

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const queryParam = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';
                const allResponse = await fetch(`/api/auctions${queryParam}`);
                if (!allResponse.ok) throw new Error('Failed to fetch');
    
                const allData = await allResponse.json();
                setAllListings(allData);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };
    
        fetchListings();
    }, [searchQuery]);
    /*useEffect(() => {
        const fetchListings = async () => {
            try {
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
}*/


import { Suspense } from "react";
import AuctionsWithSearchClient from "../../components/auction-components/AuctionsWithSearchClient";

export default function AuctionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuctionsWithSearchClient />
    </Suspense>
  );
}
