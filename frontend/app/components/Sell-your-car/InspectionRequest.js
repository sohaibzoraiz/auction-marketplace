'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
//import { TextField } from '@mui/material';
import InspectionSlotPicker from './inspectionSlotPicker'; // Adjust path as needed

function InspectionRequestStep() {
  const { register, control } = useFormContext();
  const inspectionCharges = 2500;

  return (
    <div className="row">
      {/* Inspection Slot Picker */}
      <div className="col-md-6 mb-20">
        <label>Inspection Date and Time*</label>
        <Controller
          name="inspection_time"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <>
              <InspectionSlotPicker value={field.value} onChange={field.onChange} />
              {fieldState.error && (
                <div className="text-danger mt-1">Please select a date and time</div>
              )}
            </>
          )}
        />
      </div>

      {/* Address Field */}
      <div className="col-md-6 mb-20">
        <label>Inspection Address*</label>
        <input
          type="text"
          {...register('inspection_address', { required: true })}
          className="form-control"
        />
      </div>

      {/* Contact Number */}
      <div className="col-md-6 mb-20">
        <label>Contact Number*</label>
        <input
          type="tel"
          {...register('inspection_contact', { required: true })}
          className="form-control"
        />
      </div>

      {/* Inspection Charges */}
      <div className="col-md-12 mb-20">
        <h3>Inspection Charges</h3>
        <div>
          <span>Inspection Fee</span>
          <span> PKR {inspectionCharges}</span>
        </div>
      </div>
    </div>
  );
}

export default InspectionRequestStep;
