'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

function InspectionRequestStep() {
  const { register } = useFormContext();
  const inspectionCharges = 2500; // Inspection fee of 2500 PKR

  return (
    <div className="row">
      <div className="col-md-6 mb-20">
        <label>Inspection Date and Time*</label>
        <input type="datetime-local" {...register('inspection_time', { required: true })} className="form-control" />
      </div>

      <div className="col-md-6 mb-20">
        <label>Inspection Address*</label>
        <input type="text" {...register('inspection_address', { required: true })} className="form-control" />
      </div>

      <div className="col-md-6 mb-20">
        <label>Contact Number*</label>
        <input type="tel" {...register('inspection_contact', { required: true })} className="form-control" />
      </div>

      <div className="col-md-12 mb-20">
        <h3>Inspection Charges</h3>
        <div>
          <span>Inspection Fee</span>
          <span>PKR {inspectionCharges}</span>
        </div>
      </div>
    </div>
  );
}

export default InspectionRequestStep;