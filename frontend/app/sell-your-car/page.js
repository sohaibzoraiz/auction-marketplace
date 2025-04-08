
"use client";


import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import Link from 'next/link';
import { UserContext } from '../contexts/UserContext';
import MultiStepForm from '../components/Sell-your-car/MultiStepForm';
import Breadcrumb2 from "../components/common/Breadcrumb2";

function CreateAuctionPage() {
    const router = useRouter();
 
    const { userData, isLoading } = useContext(UserContext) ?? {};


    useEffect(() => {
        if (!isLoading) {

        if (!userData) {
          // If not logged in, redirect
          const originalUrl = window.location.pathname;
          router.push(`/login?redirect=${originalUrl}`);
        } 
      }
    }, [userData, router, isLoading]);
    if (isLoading) return <p>Loading...</p>;
    if (!userData) return null;
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
