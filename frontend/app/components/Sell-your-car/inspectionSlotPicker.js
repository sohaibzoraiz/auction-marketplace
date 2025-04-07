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
  Tabs,
  Tab,
  Paper,
} from '@mui/material';

function InspectionSlotPicker() {
  const { control } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get('https://api.carmandi.com.pk/api/inspection/slots');
        setSlots(res.data);
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleTabChange = (_, newIndex) => {
    setSelectedDateIndex(newIndex);
  };

  const selectedDay = slots[selectedDateIndex];
  const availableSlots = selectedDay?.slots || [];

  return (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>Choose Inspection Slot</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Day Tabs */}
          <Paper elevation={1} sx={{ mb: 2 }}>
            <Tabs
              value={selectedDateIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
            >
              {slots.map((day) => (
                <Tab
                  key={day.date}
                  label={new Date(day.date).toLocaleDateString('en-PK', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                />
              ))}
            </Tabs>
          </Paper>

          {/* Slot Buttons */}
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
                    {new Date(time).toLocaleTimeString('en-PK', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
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
