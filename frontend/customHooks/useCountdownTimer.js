import { useState, useEffect } from "react";

// Function to calculate the time remaining
const calculateTimeRemaining = (endTime) => {
  if (!endTime) return { days: "00", hours: "00", minutes: "00", seconds: "00" };

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

// Custom hook for both single and multiple listings
export function useCountdownTimer(input) {
  const [timeLeft, setTimeLeft] = useState(() => 
    Array.isArray(input) ? {} : calculateTimeRemaining(input)
  );

  useEffect(() => {
    if (!input) return;

    const updateTimer = () => {
      setTimeLeft(
        Array.isArray(input)
          ? input.reduce((acc, listing) => {
              acc[listing.id] = calculateTimeRemaining(listing.end_time);
              return acc;
            }, {})
          : calculateTimeRemaining(input)
      );
    };

    updateTimer(); // Initial calculation
    const interval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(interval);
  }, [input]);

  return timeLeft;
}
