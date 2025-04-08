'use client';

import React from 'react';
import { useFormContext, Controller, register } from 'react-hook-form';
import { TextField, Typography, Box, Button, CircularProgress } from '@mui/material';
import InspectionSlotPicker from './inspectionSlotPicker';

function InspectionRequestStep() {
  const { control, setValue } = useFormContext();
  const inspectionCharges = 2500;
  const [loadingLocation, setLoadingLocation] = React.useState(false);

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.display_name;

          if (address) {
            setValue('inspection_address', address, { shouldDirty: true, shouldTouch: true });
            setValue('inspection_lat', latitude);
            setValue('inspection_lng', longitude);

          } else {
            alert("Could not fetch address");
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          alert("Failed to get address from location");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve location");
        setLoadingLocation(false);
      }
    );
  };

  return (
    <div className="row">
      <div className="section-title mb-30 text-center">
        <h2>Inspection <span>Details</span></h2>
      </div>

      {/* Inspection Date and Time */}
      <div className="col-md-12 mb-20 text-center">
  <Typography variant="subtitle1" className="mb-2">
    Select Date & Time Slot
  </Typography>
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
</div>

      {/* Inspection Address */}
      <div className="col-md-6 mb-20">
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
        <Button
          className="mt-2"
          variant="outlined"
          size="small"
          onClick={handleUseMyLocation}
          disabled={loadingLocation}
        >
          {loadingLocation ? <CircularProgress size={20} /> : "Use My Location"}
        </Button>
      </div>
      <input type="hidden" {...register("inspection_lat")} />
      <input type="hidden" {...register("inspection_lng")} />


      {/* Contact Number */}
      <div className="col-md-6 mb-20">
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
      </div>

      {/* Charges */}
      <div className="col-md-12 mb-20">
        <Typography variant="h6">Inspection Charges</Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography>Inspection Fee</Typography>
          <Typography>PKR {inspectionCharges}</Typography>
        </Box>
      </div>
    </div>
  );
}

export default InspectionRequestStep;
