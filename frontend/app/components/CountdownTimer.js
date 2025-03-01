import React, { useState, useEffect } from 'react';

function CountdownTimerComponent({ endTime }) {
    const [countdown, setCountdown] = useState(calculateTimeLeft(endTime));

    useEffect(() => {
        if (!endTime) return;

        const intervalId = setInterval(() => {
            setCountdown(calculateTimeLeft(endTime));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [endTime]);

    function calculateTimeLeft(endTime) {
        if (!endTime) return 'Loading...';

        const now = new Date();
        const diff = new Date(endTime).getTime() - now.getTime();

        if (diff <= 0) {
            return 'Auction Ended';
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    }

    return (
        <div>
            <span>Ends in:</span>
            <span>{countdown}</span>
        </div>
    );
}

const CountdownTimer = React.memo(CountdownTimerComponent);

export default CountdownTimer;
