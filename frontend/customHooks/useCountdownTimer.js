import { useState, useEffect, useMemo } from "react";

// Function to calculate time remaining
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

// Custom hook for countdown
export function useCountdownTimer(input) {
  // Memoize input to prevent unnecessary updates
  const stableInput = useMemo(() => input, [JSON.stringify(input)]);

  // Single listing state
  const [timeLeft, setTimeLeft] = useState(
    Array.isArray(stableInput) ? {} : calculateTimeRemaining(stableInput)
  );

  useEffect(() => {
    if (!stableInput) return;

    const updateTimer = () => {
      const newTimeLeft = Array.isArray(stableInput)
        ? stableInput.reduce((acc, listing) => {
            acc[listing.id] = calculateTimeRemaining(listing.end_time);
            return acc;
          }, {})
        : calculateTimeRemaining(stableInput);

      // ✅ Only update state if the countdown values have actually changed
      setTimeLeft((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newTimeLeft)) {
          return newTimeLeft;
        }
        return prev;
      });
    };

    updateTimer(); // Initial calculation
    const interval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(interval); // ✅ Cleanup to prevent memory leaks
  }, [stableInput]);

  return timeLeft;
}
