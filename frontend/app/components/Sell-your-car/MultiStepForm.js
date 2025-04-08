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
  

  const onSubmit = (data) => {
    // Handle the form submission to backend here
    console.log('Form Data Submitted:', data);
    
    // Send the form data to backend using axios or fetch
    // axios.post('/api/submit-form', data);
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