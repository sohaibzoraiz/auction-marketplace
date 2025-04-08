
"use client";


import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserContext } from '../contexts/UserContext';
import MultiStepForm from '../components/Sell-your-car/MultiStepForm';
import Breadcrumb2 from "../components/common/Breadcrumb2";

function CreateAuctionPage() {
    const router = useRouter();
 //   const [user, setUser] = useState(null);
 //   const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [canCreateListing, setCanCreateListing] = useState(false);
    const [upgradeMessage, setUpgradeMessage] = useState('');
    const [featuredImage, setFeaturedImage] = useState(null);
    const [carImages, setCarImages] = useState([]);
        //using cookies
    const { userData, isLoading } = useContext(UserContext) ?? {};


    useEffect(() => {
        if (!isLoading) {

        if (!userData) {
          // If not logged in, redirect
          const originalUrl = window.location.pathname;
          router.push(`/login?redirect=${originalUrl}`);
        } else {
          // Check user plan, listing count, etc.
          if (userData.plan === 'basic') {
            if (userData.listingCount < 1) {
              setCanCreateListing(true);
            } else {
              setCanCreateListing(false);
              setUpgradeMessage('Basic plan users can only create one listing. Upgrade to create more.');
            }
          } else {
            setCanCreateListing(true);
          }
        }
    }
      }, [userData, router, isLoading]);

    return (
        <>
          <Breadcrumb2 pagetitle="Sell Your Car" currentPage="sell-your-car" />
    <div className="container pt-110 mb-110">
        <div className="row justify-content-center">
          <div className="col-lg-8">
          <MultiStepForm userType={userData.plan} />
          </div>
        </div>
        </div>

        
      </>
    );
}

export default CreateAuctionPage;
