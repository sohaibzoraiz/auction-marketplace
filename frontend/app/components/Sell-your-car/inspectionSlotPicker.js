'use client';

import React, { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import axios from 'axios';
import {
  Box,
  Typography,
  Tabs,
  Tab,
 // ToggleButtonGroup,
 // ToggleButton,
  CircularProgress,
  Paper,
  Grid,
  Button,
  Tooltip,
  //useTheme
} from '@mui/material';

function InspectionSlotPicker() {
  const { control } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [slotsByDate, setSlotsByDate] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  //const theme = useTheme();

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get('https://api.carmandi.com.pk/api/inspection/slots');

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
    <Box className="w-100">
      <Typography variant="h6" align="center" gutterBottom>
        Choose Inspection Slot
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Tabs */}
          <div className="w-100 px-2">
            <Paper
              elevation={1}
              className="w-100 mb-3"
              sx={{ overflowX: 'auto', borderRadius: 1 }}
            >
              <Tabs
                value={selectedTabIndex}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="inspection-day-tabs"
                sx={{
                  '& .MuiTabs-scrollButtons': {
                    color: 'primary.main',
                  },
                  '& .MuiTabs-scrollButtons.Mui-disabled': {
                    opacity: 0.3,
                  },
                  px: 1,
                }}
              >
                {slotsByDate.map(({ date }) => (
                  <Tab
                    key={date}
                    label={new Date(date).toLocaleDateString('en-PK', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                    sx={{
                      textTransform: 'uppercase',
                      minWidth: 100,
                    }}
                  />
                ))}
              </Tabs>
            </Paper>
          </div>

          {/* Time Slots */}
          <Controller
            name="inspection_time"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Box className="d-flex justify-content-center px-2">
                <Grid container spacing={2} justifyContent="center">
                  {availableSlots.map(({ datetime, remaining }) => {
                    const selected = field.value === datetime;
                    const disabled = remaining <= 0;

                    const button = (
                      <Button
                        variant={selected ? 'contained' : 'outlined'}
                        color={selected ? 'primary' : 'inherit'}
                        disabled={disabled}
                        onClick={() => field.onChange(datetime)}
                        sx={{
                          minWidth: 100,
                          borderRadius: '6px',
                          px: 2,
                          py: 1.2,
                          backgroundColor: selected ? '#1976d2' : '#fff',
                          color: selected ? '#fff' : '#333',
                          borderColor: selected ? '#1976d2' : '#ccc',
                          '&:hover': {
                            backgroundColor: selected ? '#115293' : '#f2f2f2',
                          },
                        }}
                      >
                        {formatTime(datetime)}
                      </Button>
                    );

                    return (
                      <Grid item key={datetime}>
                        {disabled ? (
                          <Tooltip title="This slot is fully booked" arrow>
                            <span>{button}</span> {/* Required for disabled Tooltip to work */}
                          </Tooltip>
                        ) : (
                          button
                        )}
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}
          />
        </>
      )}
    </Box>
  );
}

export default InspectionSlotPicker;
