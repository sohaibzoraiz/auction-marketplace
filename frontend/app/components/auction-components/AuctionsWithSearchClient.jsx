// components/AuctionsWithSearchClient.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AllListings from "./AllListings";
import Breadcrumb2 from "../common/Breadcrumb2";

export default function AuctionsWithSearchClient() {
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

  return (
    <>
      <Breadcrumb2 currentPage={"Auctions"} pagetitle={"Auctions"} />
      <AllListings listings={allListings} />
    </>
  );
}
