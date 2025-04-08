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
  const inspectionTime = watch('inspection_time');

  const [minStartDate, setMinStartDate] = useState(dayjs().add(1, 'day'));
  const [minEndDate, setMinEndDate] = useState(null);
  const [maxEndDate, setMaxEndDate] = useState(null);

  useEffect(() => {
    if (inspectionTime) {
      const minStart = dayjs(inspectionTime).add(1, 'day').startOf('day');
      setMinStartDate(minStart);
      if (startDate && dayjs(startDate).isBefore(minStart)) {
        setValue('start_time', null);
      }
    }
  }, [inspectionTime]);

  useEffect(() => {
    if (startDate) {
      const start = dayjs(startDate);
      const min = userType === 'premium' ? start : start.add(7, 'day');
      const max = userType === 'premium' ? start.add(30, 'day') : start.add(15, 'day');

      setMinEndDate(min);
      setMaxEndDate(max);

      if (endDate && (dayjs(endDate).isBefore(min) || dayjs(endDate).isAfter(max))) {
        setValue('end_time', null);
      }
    }
  }, [startDate, userType]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="row">
        <div className="section-title mb-30 text-center">
                          <h2>Auction <span>Details</span></h2>
                        </div>
        {/* Start Date */}
        <div className="col-md-6 mb-20">
          <Controller
            name="start_time"
            control={control}
            rules={{
              required: 'Date is required',
              validate: value => !isNaN(Date.parse(value)) || 'Invalid date format'
            }}
            render={({ field , fieldState}) => (
              <DatePicker
                label="Tentative Start Date"
                disablePast
                minDate={minStartDate}
                closeOnSelect={true}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date?.startOf('day').toISOString())}
                slotProps={{ textField: { fullWidth: true }, popper: { placement: 'bottom-start' } }}
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : ''}
                
              />
            )}
          />
        </div>

        {/* End Date */}
        <div className="col-md-6 mb-20">
          <Controller
            name="end_time"
            control={control}
            rules={{
              required: 'Date is required',
              validate: value => !isNaN(Date.parse(value)) || 'Invalid date format'
            }}
            render={({ field,  fieldState }) => (
              <DatePicker
                label="Auction End Date"
                disablePast
                minDate={minEndDate}
                maxDate={maxEndDate}
                closeOnSelect={true}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date?.startOf('day').toISOString())}
                slotProps={{ textField: { fullWidth: true } }}
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : ''}
                
              />
            )}
          />
          <Typography variant="caption" color="textSecondary">
            {userType === 'premium'
              ? 'You can select up to 30 days from start date'
              : 'You can select between 7 to 15 days from start date'}
          </Typography>
        </div>

        {/* Reserve Price */}
        <div className="col-md-6 mb-20">
          <Controller
            name="reserve_price"
            control={control}
            rules={{
              required: 'Contact Number is required',
              validate: value => value !== null && value !== '' || 'Contact Number is required'
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Reserve Price"
                type="number"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : ''}
                {...field}
              />
            )}
          />
        </div>

        {/* Featured Auction */}
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
