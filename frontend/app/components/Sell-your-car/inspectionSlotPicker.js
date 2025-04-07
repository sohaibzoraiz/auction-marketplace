'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import axios from 'axios';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Paper,
} from '@mui/material';

function InspectionSlotPicker() {
  const { control } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [slotsByDate, setSlotsByDate] = useState([]); // [{ date, slots: [ {datetime, remaining} ] }]
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get('https://api.carmandi.com.pk/api/inspection/slots');

        // Group slots by date
        const grouped = {};
        res.data.forEach(({ datetime, remaining }) => {
          const dateStr = new Date(datetime).toISOString().split('T')[0];
          if (!grouped[dateStr]) {
            grouped[dateStr] = [];
          }
          grouped[dateStr].push({ datetime, remaining });
        });

        const groupedArray = Object.entries(grouped).map(([date, slots]) => ({
          date,
          slots,
        }));

        setSlotsByDate(groupedArray);
      } catch (err) {
        console.error('Error fetching inspection slots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleTabChange = (_, newIndex) => {
    setSelectedTabIndex(newIndex);
  };

  const selectedDay = slotsByDate[selectedTabIndex];
  const availableSlots = selectedDay?.slots || [];

  const formatTime = (datetime) => {
    return new Intl.DateTimeFormat('en-PK', {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(datetime));
  };

  return (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Choose Inspection Slot
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Day Tabs */}
          <Paper elevation={1} sx={{ mb: 2 }}>
            <Tabs
              value={selectedTabIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
            >
              {slotsByDate.map(({ date }) => (
                <Tab
                  key={date}
                  label={new Date(date).toLocaleDateString('en-PK', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                />
              ))}
            </Tabs>
          </Paper>

          {/* Time Slots */}
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
                {availableSlots.map(({ datetime, remaining }) => {
  const label = new Date(datetime).toLocaleTimeString('en-PK', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const helperText = remaining === 1
    ? ' (Only 1 spot left)'
    : remaining === 2
    ? ' (2 spots left)'
    : '';
                  return (
                    <ToggleButton
                      key={datetime}
                      value={datetime}
                      disabled={remaining <= 0}
                    >
                      {label}{helperText}
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            )}
          />
        </>
      )}
    </Box>
  );
}

export default InspectionSlotPicker;
