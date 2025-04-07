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
  
  const goToNextStep = () => setCurrentStep(prevStep => prevStep + 1);
  const goToPreviousStep = () => setCurrentStep(prevStep => prevStep - 1);

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
            {step > 1 && (
              <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            <button type="submit" className="primary-btn btn-hover">
              {step < 4 ? "Next" : "Submit"}
              <span style={{ top: "40.5px", left: "84.2344px" }} />
            </button>
          </div>
      </div>
    </FormProvider>
  );
}

export default MultiStepForm;