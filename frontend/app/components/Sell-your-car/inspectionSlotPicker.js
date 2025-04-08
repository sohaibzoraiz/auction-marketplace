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
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

function InspectionSlotPicker() {
  const { control } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [slotsByDate, setSlotsByDate] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <Box mb={3}>
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
      <Box sx={{ px: { xs: 1, md: 4 } }}>
        <Paper elevation={1} sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={selectedTabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="inspection-day-tabs"
            sx={{
              px: 1,
              '& .MuiTabs-scrollButtons.Mui-disabled': {
                opacity: 0.3,
              },
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
                sx={{ mx: 1 }}
              />
            ))}
          </Tabs>
        </Paper>
      </Box>

      {/* Slots */}
      <Controller
        name="inspection_time"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Box
            display="flex"
            justifyContent="center"
            sx={{ px: { xs: 1, md: 4 } }}
          >
            <ToggleButtonGroup
              value={field.value}
              exclusive
              onChange={(_, val) => field.onChange(val)}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 2,
                maxWidth: '800px',
              }}
            >
              {availableSlots.map(({ datetime, remaining }) => {
                const label = `${formatTime(datetime)}${remaining === 1 ? ' (1 left)' : ''}`;
                const isDisabled = remaining <= 0;

                const button = (
                  <ToggleButton
                    key={datetime}
                    value={datetime}
                    disabled={isDisabled}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      minWidth: 100,
                      px: 2,
                      py: 1.5,
                      border: '1px solid',
                      borderColor: theme => theme.palette.divider,
                      '&.Mui-selected': {
                        backgroundColor: theme => theme.palette.primary.main,
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: theme => theme.palette.primary.dark,
                        },
                      },
                      '&:disabled': {
                        color: '#999',
                        borderColor: '#ccc',
                        backgroundColor: '#f9f9f9',
                      },
                    }}
                  >
                    {label}
                  </ToggleButton>
                );

                return isDisabled ? (
                  <Tooltip key={datetime} title="This slot is fully booked" arrow>
                    <span>{button}</span>
                  </Tooltip>
                ) : (
                  button
                );
              })}
            </ToggleButtonGroup>
          </Box>
        )}
      />
    </>
  )}
</Box> );
}

export default InspectionSlotPicker;
