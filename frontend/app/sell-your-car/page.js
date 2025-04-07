
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
  
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFeaturedImageChange = (e) => {
        setFeaturedImage(e.target.files[0]);
    };

    const handleCarImagesChange = (e) => {
        setCarImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Remove token retrieval from localStorage
            // const token = localStorage.getItem('accessToken');
    
            // Create FormData to send files
            const formDataWithImages = new FormData();
            // ... append form fields and images ...
    
            // Call the backend API to create a new auction listing
            const response = await fetch(`/api/auctions/create`, {
                method: 'POST',
                credentials: 'include', // ensure HTTP-only cookies are sent automatically
                // Removed manual Authorization header
                body: formDataWithImages,
            });
    
            if (!response.ok) {
                throw new Error('Failed to create auction');
            }
            console.log("Front End Form Data = ", formData);
        } catch (err) {
            setError(err.message || 'Failed to create auction');
        }
    };
    



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
        <div className="container pt-110 mb-110">
          <Breadcrumb2 pagetitle="Register" currentPage="register" />
    <div className="container pt-110 mb-110">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="contact-form-area">
            <div className="section-title mb-30 text-center">
                  <h2>Sell Your<span>Car</span></h2>
                </div>
          <MultiStepForm userType={userData.plan} />
          </div>
        </div>
        </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="contact-form-area">
              <h2 className="text-center mb-4">Create New Auction</h2>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>City*</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                  </div>
  
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>Car Make*</label>
                      <input type="text" name="carMake" value={formData.carMake} onChange={handleChange} required />
                    </div>
                  </div>
  
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>Year Model*</label>
                      <input type="text" name="yearModel" value={formData.yearModel} onChange={handleChange} required />
                    </div>
                  </div>
  
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>Registration City*</label>
                      <input type="text" name="registrationCity" value={formData.registrationCity} onChange={handleChange} required />
                    </div>
                  </div>
  
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>Mileage*</label>
                      <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required />
                    </div>
                  </div>
  
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>Demand Price*</label>
                      <input type="number" name="demandPrice" value={formData.demandPrice} onChange={handleChange} required />
                    </div>
                  </div>
  
                  <div className="col-md-12 mb-20">
                    <div className="form-inner">
                      <label>Description*</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                  </div>
  
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>Inspection Company Name*</label>
                      <input type="text" name="inspectionCompanyName" value={formData.inspectionCompanyName} onChange={handleChange} required />
                    </div>
                  </div>
  
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>Inspection Report*</label>
                      <input type="text" name="inspectionReport" value={formData.inspectionReport} onChange={handleChange} required />
                    </div>
                  </div>
  
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>Listing Type*</label>
                      <select name="listingType" value={formData.listingType} onChange={handleChange} required>
                        <option value="">Select Listing Type</option>
                        <option value="auction">Auction</option>
                        <option value="fixed-price">Fixed Price</option>
                      </select>
                    </div>
                  </div>
  
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>Reserve Price*</label>
                      <input type="number" name="reservePrice" value={formData.reservePrice} onChange={handleChange} 
                        disabled={userData && userData.plan !== 'premium'} />
                    </div>
                  </div>
  
                  {userData && userData.plan === 'premium' ? (
                    <div className="col-md-6 mb-20">
                      <div className="form-inner">
                        <label>End Time*</label>
                        <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} />
                      </div>
                    </div>
                  ) : (
                    <div className="col-md-12">
                      <p>End Time will be automatically set to 15 days from now.</p>
                    </div>
                  )}
  
                  {/* Featured Image Upload */}
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>Featured Image*</label>
                      <input type="file" onChange={handleFeaturedImageChange} accept="image/*" />
                      {featuredImage && (
                        <img src={URL.createObjectURL(featuredImage)} alt="Featured" className="mt-2 max-h-40" />
                      )}
                    </div>
                  </div>
  
                  {/* Car Images Upload */}
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>Car Images*</label>
                      <input type="file" multiple onChange={handleCarImagesChange} accept="image/*" />
                      <div className="flex mt-2">
                        {carImages.map((image, index) => (
                          <img key={index} src={URL.createObjectURL(image)} alt={`Car ${index}`} className="max-h-40 mr-2" />
                        ))}
                      </div>
                    </div>
                  </div>
  
                  <div className="col-md-12">
                    <div className="form-inner">
                      <button className="primary-btn btn-hover w-100" type="submit">
                        Create Auction
                        <span style={{ top: "40.5px", left: "84.2344px" }} />
                      </button>
                    </div>
                  </div>
  
                  {error && (
                    <div className="col-md-12 mt-2">
                      <p className="text-danger">{error}</p>
                    </div>
                  )}
                </div>
              </form>
  
              {/* Options Links */}
              <div className="text-center mt-3">
                <Link href="/pricing" className="text-decoration-none me-3">Get Yearly Subscription</Link>
                <Link href="/featured-listing" className="text-decoration-none">Opt for Featured Listing</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default CreateAuctionPage;
