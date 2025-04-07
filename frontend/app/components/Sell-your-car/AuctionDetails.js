'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';

function AuctionDetailsStep({ userType }) {
  const { control, watch, setValue } = useFormContext();

  const startDate = watch('start_time');
  const endDate = watch('end_time');

  const [minEndDate, setMinEndDate] = useState(null);
  const [maxEndDate, setMaxEndDate] = useState(null);

  useEffect(() => {
    if (startDate) {
      const start = dayjs(startDate);
      const min = userType === 'premium' ? start : start.add(7, 'day');
      const max = userType === 'premium' ? start.add(30, 'day') : start.add(15, 'day');

      setMinEndDate(min);
      setMaxEndDate(max);

      // Reset end date if invalid
      if (endDate && (dayjs(endDate).isBefore(min) || dayjs(endDate).isAfter(max))) {
        setValue('end_time', null);
      }
    }
  }, [startDate, userType]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="row">
        <div className="col-md-6 mb-20">
        <Controller
  name="start_time"
  control={control}
  rules={{ required: true }}
  render={({ field }) => (
    <DatePicker
      label="Tentative Start Date"
      value={field.value ? dayjs(field.value) : null} // ← Convert to dayjs
      onChange={(date) => {
        field.onChange(date?.startOf('day').toISOString()); // ← Store as ISO
      }}
      disablePast
      renderInput={(params) => <TextField fullWidth {...params} />}
    />
  )}
/>
        </div>

        <div className="col-md-6 mb-20">
        <Controller
  name="end_time"
  control={control}
  rules={{ required: true }}
  render={({ field }) => (
    <DatePicker
      label="Auction End Date"
      value={field.value ? dayjs(field.value) : null} // ← Convert to dayjs
      onChange={(date) => {
        field.onChange(date?.startOf('day').toISOString()); // ← Store as ISO
      }}
      minDate={minEndDate}
      maxDate={maxEndDate}
      disablePast
      renderInput={(params) => <TextField fullWidth {...params} />}
    />
  )}
/>
          <Typography variant="caption" color="textSecondary">
            {userType === 'premium'
              ? 'You can select up to 30 days from start date'
              : 'You can select between 7 to 15 days from start date'}
          </Typography>
        </div>

        <div className="col-md-6 mb-20">
          <Controller
            name="reserve_price"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="Reserve Price"
                fullWidth
                type="number"
                {...field}
              />
            )}
          />
        </div>

        <div className="col-md-6 mb-20">
          <Controller
            name="is_featured"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <TextField
                select
                label="Featured Auction?"
                fullWidth
                SelectProps={{ native: true }}
                {...field}
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
              </TextField>
            )}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default AuctionDetailsStep;
