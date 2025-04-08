"use client";

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import CarDetailsStep from './CarDetails';
import AuctionDetailsStep from './AuctionDetails';
import InspectionRequestStep from './InspectionRequest';
import PaymentStep from './PaymentDetails';

function MultiStepForm({ userType }) {
  const [currentStep, setCurrentStep] = useState(1);
  const methods = useForm();

  const blurActiveElement = () => {
    const activeElement = document.activeElement;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
  };
  
  const goToNextStep = () => {
    blurActiveElement(); // 👈 Fixes the aria-hidden + focus warning
    setCurrentStep(prevStep => prevStep + 1);
  };
  
  const goToPreviousStep = () => {
    blurActiveElement(); // 👈 Also for going back
    setCurrentStep(prevStep => prevStep - 1);
  };
  

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    try {
      const formData = new FormData();
  
      // Flatten values into FormData
      for (const key in data) {
        if (Array.isArray(data[key])) {
          data[key].forEach((file) => formData.append(key, file));
        } else {
          formData.append(key, data[key]);
        }
      }
  
      const response = await fetch('https://api.carmandi.com.pk/api/auctions/create', {
        method: 'POST',
        body: formData,
        credentials: 'include', // if using cookies/session
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }
  
      alert('Auction created successfully!');
      console.log('Auction response:', result);
    } catch (error) {
      console.error('Auction create error:', error);
      alert('Failed to create auction.');
    }
  };
  

  return (
    <FormProvider {...methods}>
      <div className="multi-step-form">
        {/* Render Steps Based on Current Step */}
        {currentStep === 1 && <CarDetailsStep />}
        {currentStep === 2 && <InspectionRequestStep/>}
        {currentStep === 3 && <AuctionDetailsStep userType={userType}/>}
        {currentStep === 4 && <PaymentStep />}

        {/* Navigation */}
        <div className="d-flex justify-content-between mt-3">
  {currentStep > 1 && (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={goToPreviousStep}
    >
      Back
    </button>
  )}

  {currentStep < 4 ? (
    <button
      type="button"
      className="primary-btn btn-hover"
      onClick={methods.handleSubmit(goToNextStep)} // ✅ validation added here
    >
      Next
      <span style={{ top: "40.5px", left: "84.2344px" }} />
    </button>
  ) : (
    <button
      type="button"
      className="primary-btn btn-hover"
      onClick={methods.handleSubmit(onSubmit)}
    >
      Submit
      <span style={{ top: "40.5px", left: "84.2344px" }} />
    </button>
  )}
</div>


      </div>
    </FormProvider>
  );
}

export default MultiStepForm;