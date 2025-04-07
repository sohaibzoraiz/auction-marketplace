'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Typography, Box } from '@mui/material';
import InspectionSlotPicker from '../common/InspectionSlotPicker'; // Adjust path if needed

function InspectionRequestStep() {
  const { control } = useFormContext();
  const inspectionCharges = 2500;

  return (
    <Box className="row" sx={{ gap: 2 }}>
      {/* Inspection Date & Time */}
      <Box className="col-md-6 mb-20">
        <Typography variant="subtitle1">Inspection Date and Time*</Typography>
        <Controller
          name="inspection_time"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <>
              <InspectionSlotPicker value={field.value} onChange={field.onChange} />
              {fieldState.error && (
                <Typography variant="caption" color="error">
                  Please select a date and time
                </Typography>
              )}
            </>
          )}
        />
      </Box>

      {/* Inspection Address */}
      <Box className="col-md-6 mb-20">
        <Controller
          name="inspection_address"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Inspection Address*"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error && "Inspection address is required"}
            />
          )}
        />
      </Box>

      {/* Contact Number */}
      <Box className="col-md-6 mb-20">
        <Controller
          name="inspection_contact"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Contact Number*"
              type="tel"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error && "Contact number is required"}
            />
          )}
        />
      </Box>

      {/* Charges Summary */}
      <Box className="col-md-12 mb-20">
        <Typography variant="h6">Inspection Charges</Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography>Inspection Fee</Typography>
          <Typography>PKR {inspectionCharges}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default InspectionRequestStep;
