'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import axios from 'axios';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from '@mui/material';

function InspectionSlotPicker() {
  const { control } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get('https://api.carmandi.com.pk/api/inspection/slots');
        setSlots(res.data);
        if (res.data.length > 0) {
          setSelectedDate(res.data[0].date);
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleDateChange = (_, newDate) => {
    if (newDate) setSelectedDate(newDate);
  };

  const availableSlots = slots.find(day => day.date === selectedDate)?.slots || [];

  return (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>Choose Inspection Slot</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Dates */}
          <ToggleButtonGroup
            value={selectedDate}
            exclusive
            onChange={handleDateChange}
            sx={{ mb: 2, flexWrap: 'wrap' }}
          >
            {slots.map(({ date }) => (
              <ToggleButton key={date} value={date}>
                {new Date(date).toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric' })}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Slots */}
          <Controller
            name="inspection_time"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <ToggleButtonGroup
                value={field.value}
                exclusive
                onChange={(_, val) => field.onChange(val)}
                sx={{ flexWrap: 'wrap' }}
              >
                {availableSlots.map(({ time, available }) => (
                  <ToggleButton
                    key={time}
                    value={time}
                    disabled={!available}
                  >
                    {time}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          />
        </>
      )}
    </Box>
  );
}

export default InspectionSlotPicker;
