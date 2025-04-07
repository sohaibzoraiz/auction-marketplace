'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';

function AuctionDetailsStep({ userType }) {
  const { control, watch, setValue } = useFormContext();

  const inspectionTime = watch('inspection_time');
  const startTime = watch('start_time');

  const [minStart, setMinStart] = useState('');
  const [minEnd, setMinEnd] = useState('');
  const [maxEnd, setMaxEnd] = useState('');

  // Set min start date (next day of inspection)
  useEffect(() => {
    if (inspectionTime) {
      const nextDay = dayjs(inspectionTime).add(1, 'day').startOf('day');
      setMinStart(nextDay.format('YYYY-MM-DD'));
      setValue('start_time', '');
    }
  }, [inspectionTime]);

  // Set end date range based on start date
  useEffect(() => {
    if (startTime) {
      const start = dayjs(startTime);
      const min = userType === 'premium' ? start : start.add(7, 'day');
      const max = userType === 'premium' ? start.add(30, 'day') : start.add(15, 'day');

      setMinEnd(min.format('YYYY-MM-DD'));
      setMaxEnd(max.format('YYYY-MM-DD'));

      const currentEnd = dayjs(watch('end_time'));
      if (currentEnd.isBefore(min) || currentEnd.isAfter(max)) {
        setValue('end_time', '');
      }
    }
  }, [startTime, userType]);

  // Helper to normalize date-only to 00:00:00 local time
  const normalizeDate = (dateStr) => {
    const date = dayjs(dateStr).startOf('day');
    return date.toISOString();
  };

  return (
    <Box className="row" mb={3}>
      {/* Start Date */}
      <Box className="col-md-6 mb-20">
        <Controller
          name="start_time"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              label="Tentative Start Date"
              fullWidth
              required
              inputProps={{ min: minStart }}
              onChange={(e) => {
                const iso = normalizeDate(e.target.value);
                field.onChange(iso);
              }}
            />
          )}
        />
      </Box>

      {/* End Date */}
      <Box className="col-md-6 mb-20">
        <Controller
          name="end_time"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              type="date"
              label="End Date"
              fullWidth
              required
              inputProps={{
                min: minEnd,
                max: maxEnd
              }}
              helperText={
                userType === 'premium'
                  ? 'You can select up to 30 days from start date'
                  : 'You can select between 7 to 15 days from start date'
              }
              onChange={(e) => {
                const iso = normalizeDate(e.target.value);
                field.onChange(iso);
              }}
            />
          )}
        />
      </Box>

      {/* Reserve Price */}
      <Box className="col-md-6 mb-20">
        <Controller
          name="reserve_price"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Reserve Price"
              fullWidth
              required
            />
          )}
        />
      </Box>

      {/* Featured Auction */}
      <Box className="col-md-6 mb-20">
        <Controller
          name="is_featured"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Featured Auction?"
              fullWidth
            >
              <MenuItem value={false}>No</MenuItem>
              <MenuItem value={true}>Yes</MenuItem>
            </TextField>
          )}
        />
      </Box>
    </Box>
  );
}

export default AuctionDetailsStep;
