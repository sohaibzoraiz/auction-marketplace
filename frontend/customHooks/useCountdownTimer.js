import { useState, useEffect } from "react";

// Function to calculate the time remaining
const calculateTimeRemaining = (endTime) => {
  const currentTime = new Date();
  const timeDifference = new Date(endTime) - currentTime;

  if (timeDifference <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  return {
    days: String(Math.floor(timeDifference / (1000 * 60 * 60 * 24))).padStart(2, "0"),
    hours: String(Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0"),
    minutes: String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0"),
    seconds: String(Math.floor((timeDifference % (1000 * 60)) / 1000)).padStart(2, "0"),
  };
};

// Custom hook to track countdown timers for multiple items
export function useCountdownTimer(listings) {
  const [timers, setTimers] = useState({});

  useEffect(() => {
    if (!Array.isArray(listings) || listings.length === 0) return;

    const updateTimers = () => {
      setTimers(
        listings.reduce((acc, listing) => {
          acc[listing.id] = calculateTimeRemaining(listing.end_time);
          return acc;
        }, {})
      );
    };

    updateTimers(); // Initial calculation
    const interval = setInterval(updateTimers, 1000); // Update every second

    return () => clearInterval(interval);
  }, [listings]);

  return timers;
}
