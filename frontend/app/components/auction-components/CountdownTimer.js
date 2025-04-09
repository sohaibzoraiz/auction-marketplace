'use client';
import { useNow } from '../../contexts/CountdownContext';

const getTimeLeft = (endTime, now) => {
  const difference = +new Date(endTime) - +now;
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
  const now = useNow();
  const timeLeft = getTimeLeft(endTime, now);

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
