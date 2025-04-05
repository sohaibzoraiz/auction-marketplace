'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';

function AuctionDetailsStep({ userType }) {
  const { register, watch, setValue } = useFormContext();

  const startTime = watch('start_time');

  const [minEndDate, setMinEndDate] = useState('');
  const [maxEndDate, setMaxEndDate] = useState('');

  useEffect(() => {
    if (startTime) {
      const start = dayjs(startTime);
      const min = userType === 'premium' ? start : start.add(7, 'day');
      const max = userType === 'premium' ? start.add(30, 'day') : start.add(15, 'day');

      setMinEndDate(min.format('YYYY-MM-DDTHH:mm'));
      setMaxEndDate(max.format('YYYY-MM-DDTHH:mm'));

      // Reset end_time if it's now outside the allowed range
      const currentEnd = dayjs(watch('end_time'));
      if (currentEnd.isBefore(min) || currentEnd.isAfter(max)) {
        setValue('end_time', '');
      }
    }
  }, [startTime, userType]);

  return (
    <div className="row">
      <div className="col-md-6 mb-20">
        <label>Tentative Start Time*</label>
        <input
          type="datetime-local"
          {...register('start_time', { required: true })}
          className="form-control"
        />
      </div>

      <div className="col-md-6 mb-20">
        <label>End Time*</label>
        <input
          type="datetime-local"
          {...register('end_time', { required: true })}
          min={minEndDate}
          max={maxEndDate}
          className="form-control"
        />
        {userType === 'premium' ? (
          <small className="text-muted">You can select up to 30 days from start date</small>
        ) : (
          <small className="text-muted">You can select between 7 to 15 days from start date</small>
        )}
      </div>

      <div className="col-md-6 mb-20">
        <label>Reserve Price*</label>
        <input
          type="number"
          {...register('reserve_price', { required: true })}
          className="form-control"
        />
      </div>

      <div className="col-md-6 mb-20">
        <label>Featured Auction?</label>
        <select {...register('is_featured')} className="form-control">
          <option value={false}>No</option>
          <option value={true}>Yes</option>
        </select>
      </div>
    </div>
  );
}

export default AuctionDetailsStep;
