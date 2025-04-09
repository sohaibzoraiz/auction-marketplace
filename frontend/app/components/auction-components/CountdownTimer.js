'use client';
import { useEffect, useState } from 'react';

const getTimeLeft = (endTime) => {
  const difference = +new Date(endTime) - +new Date();
  const timeLeft = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  };

  if (difference > 0) {
    timeLeft.days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
    timeLeft.hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    timeLeft.minutes = String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0');
    timeLeft.seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, '0');
  }

  return timeLeft;
};

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <ul>
      <li className="times">{timeLeft.days}<span>Days</span></li>
      <li className="colon">:</li>
      <li className="times">{timeLeft.hours}<span>Hours</span></li>
      <li className="colon">:</li>
      <li className="times">{timeLeft.minutes}<span>Min</span></li>
      <li className="colon">:</li>
      <li className="times">{timeLeft.seconds}<span>Sec</span></li>
    </ul>
  );
};

export default CountdownTimer;
