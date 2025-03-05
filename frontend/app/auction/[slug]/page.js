"use client";

//import Image from 'next/image';
import { useContext, useState, useEffect } from 'react';
//import useBidding from '../../components/useBidding';
//import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext'; 
import { connectSocket, emitBid, listenForNewBids } from "../../components/socket";
import CountdownTimer from '../../components/CountdownTimer';


export default function Page({ params }) {
    console.log("Page component mounted or re-rendered");
    const [resolvedParams, setResolvedParams] = useState(null);
    
    
    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    if (!resolvedParams) return null;

    const { slug } = resolvedParams;

    if (!slug) return null;

    const [carMake, yearModel, id] = slug.split('-');

    return (
        <CarPage carMake={carMake} yearModel={yearModel} id={id} />
    );
}


function CarPage({ carMake, yearModel, id }) {
    //console.log("CarPage component mounted or re-rendered");
    const [data, setData] = useState(null);
    const [currentBid, setCurrentBid] = useState(0);
    //const [countdown, setCountdown] = useState(null); // Initialize 
    const { userData } = useContext(UserContext) ?? {};
    //const intervalIdRef = useRef(null);
    //const { placeBid } = useBidding();
    console.log(userData);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`https://api.carmandi.com.pk/api/auctions/single?carMake=${carMake}&yearMake=${yearModel}&id=${id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error fetching car: ${errorText}`);
                }
                const result = await response.json();
               // console.log(result);
                setData(result);
                setCurrentBid(parseFloat(result.current_bid));
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [carMake, yearModel, id]);
   
    /*useEffect(() => {
        if (!data) return;

        const endTime = new Date(data.end_time);
        const updateCountdown = () => {
            const now = new Date();
            if (endTime <= now) {
                setCountdown('Auction Ended');
                clearInterval(intervalIdRef.current);
                return;
            }

            const diff = endTime.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown(`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`);
        };

        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current); // Clear previous interval if exists
        }

        intervalIdRef.current = setInterval(updateCountdown, 1000);

        return () => {
            clearInterval(intervalIdRef.current); // Clear interval on cleanup
        };
    }, [data]);*/

    // Inside useEffect
    useEffect(() => {
        console.log("Data in useEffect:", data); // Debugging log
        if (!data) return;
    
        const handleNewBid = (bidData) => {
            console.log("Received new bid data:", bidData);
            if (bidData.auctionId === data.id) {
                setCurrentBid(bidData.amount);
                console.log("Updating bid for auction:", data.id);
            }
        };
    
        const cleanup = listenForNewBids(handleNewBid);
    
        return cleanup;
    }, [data]);
    
    
    if (!data) return <div>Loading...</div>;
    //if (!userData) return <div>Loading...</div>;

    const parsedCarPhotos = data.car_photos_jsonb || [];

    const increaseBid = () => {
        setCurrentBid(currentBid + 10000);
    };
   
    
   /* const handleBid = (carid) => {
        
        if (!userData) {
            window.location.href = `/login?redirect=${window.location.pathname}`;
            return;
        }
        
        if (userData && userData.plan === 'basic' && userData.freeBids <= 0) {
            alert('You have no free bids left.');
            return;
        }
       // console.log('Placing bid:', carid, currentBid);
        placeBid(carid, currentBid);
    };*/
    const handleBid = async (carid) => {
        if (!userData) {
            window.location.href = `/login?redirect=${window.location.pathname}`;
            return;
        }
    
        if (userData && userData.plan === 'basic' && userData.freeBids <= 0) {
            alert('You have no free bids left.');
            return;
        }
    
        try {
            await connectSocket(); // Wait for socket connection
            emitBid(carid, currentBid); // Emit bid event
        } catch (error) {
            console.error("Failed to connect socket:", error);
        }
    };
    

    return (
        <div className="flex flex-col md:flex-row">
            {/* Left Section: Images */}
            <div className="md:w-1/2">
                {parsedCarPhotos.length > 0 && (
                    <img src={`https://api.carmandi.com.pk${parsedCarPhotos[0]}`} alt="Featured Image" className="w-full h-96 object-cover" />
                )}
                <div className="flex gap-4 mt-4">
                    {parsedCarPhotos.slice(1).map((photo, index) => (
                        <img key={index} src={`https://api.carmandi.com.pk${photo}`} alt="Thumbnail" className="w-24 h-24 object-cover rounded" />
                    ))}
                </div>
            </div>

            {/* Right Section: Details */}
            <div className="md:w-1/2 p-4">
                <h1 className="text-3xl font-bold">{data.car_make} {data.year_model}</h1>
                <p className="flex items-center gap-2">
                    <span>Mileage:</span>
                    <span>{data.mileage}</span>
                    <span className="text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM14.5 7.5h-.79l-.28-.27a6.5 6.5 0 00-7.78 7.77l.27.28v.79a1 1 0 001 1h6a1 1 0 001-1v-.79z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <span>Registered in {data.registration_city}</span>
                </p>
                <p className="flex justify-between">
                    <span>Demand Price: {data.demand_price}</span>
                    <span>Reserve Price: {data.reserve_price}</span>
                </p>

                {/* Countdown Timer */}
                <div className="flex gap-2">
                    <CountdownTimer endTime={data.end_time} />
                </div>

                {/* Bid Input and Button */}
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={currentBid}
                        onChange={(e) => setCurrentBid(parseFloat(e.target.value))}
                        className="w-32 p-2 border border-gray-300 rounded"
                    />
                    <button
    onClick={() => handleBid(data.id)}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
    Bid Now
</button>
                    <button
                        onClick={increaseBid}
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

      
    );
}
