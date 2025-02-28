/*import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const useBidding = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        
        if (accessToken) {
          
        const socketInstance = io('http://localhost:4000', {
            auth: {
                accessToken: accessToken,
            },
            reconnectionAttempts: 5, // Retry up to 5 times
            reconnectionDelay: 1000, // Wait 2 seconds between retries
        });
        
        setSocket(socketInstance);
    }
    
    }, []);

    const placeBid = (auctionId, amount) => {
        
        console.log('Sending bid to server:', auctionId, amount);
        if (socket) {
            socket.emit('place-bid', { auctionId, amount});
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on('new-bid', (bidData) => {
                console.log('New bid received:', bidData);
            });
        }
    }, [socket]);

    return { placeBid };
};

export default useBidding;
*/
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket; // Singleton instance

const useBidding = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!socket) {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                // Initialize socket only once
                socket = io("http://localhost:4000", {
                    auth: { accessToken },
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                });

                // Listen for connection events
                socket.on("connect", () => {
                    console.log("Socket connected:", socket.id);
                    setIsConnected(true);
                });

                socket.on("disconnect", (reason) => {
                    console.log("Socket disconnected:", reason);
                    setIsConnected(false);
                });

                socket.on("connect_error", (err) => {
                    console.error("Connection error:", err.message);
                });
            }
        } else {
            // Ensure the socket reconnects when returning to the page
            if (!socket.connected) {
                socket.connect();
            }
        }

        return () => {
            // Do NOT disconnect the socket on unmount
            console.log("Component unmounted, but socket remains connected.");
        };
    }, []);

    useEffect(() => {
        if (socket) {
            const handleNewBid = (bidData) => {
                console.log("New bid received:", bidData);
            };

            // Register event listener
            socket.on("new-bid", handleNewBid);

            // Cleanup function to remove duplicate listeners
            return () => {
                socket.off("new-bid", handleNewBid);
            };
        }
    }, [socket]);

    const placeBid = (auctionId, amount) => {
        if (!socket || !isConnected) {
            console.error("Socket not connected.");
            return;
        }

        console.log("Sending bid to server:", auctionId, amount);
        socket.emit("place-bid", { auctionId, amount });
    };

    return { placeBid };
};

export default useBidding;
