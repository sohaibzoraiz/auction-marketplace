import io from "socket.io-client";

let socket; // Singleton instance

const connectSocket = () => {
    return new Promise((resolve, reject) => {
        if (!socket) {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                // Initialize socket only once
                socket = io("http://51.20.6.53:4000", {
                    auth: { accessToken },
                    reconnectionAttempts: Infinity,
                    reconnectionDelay: 1000,
                    reconnectionDelayMax: 5000,
                    randomizationFactor: 0.5,
                });

                // Listen for connection events
                socket.on("connect", () => {
                    console.log("Socket connected:", socket.id);
                    resolve(socket);
                });

                socket.on("connect_error", (err) => {
                    console.error("Connection error:", err.message);
                    reject(err);
                });
            } else {
                reject(new Error("Access token not found"));
            }
        } else if (!socket.connected) {
            // Reconnect if disconnected
            socket.connect();
            socket.on("connect", () => {
                console.log("Socket reconnected:", socket.id);
                resolve(socket);
            });
            socket.on("connect_error", (err) => {
                console.error("Reconnection error:", err.message);
                reject(err);
            });
        } else {
            // Socket already connected
            resolve(socket);
        }
    });
};

const emitBid = (auctionId, amount) => {
    if (socket && socket.connected) {
        socket.emit("place-bid", { auctionId, amount });
    } else {
        console.error("Socket not connected.");
    }
};

const listenForNewBids = (callback) => {
    if (socket) {
        socket.on("new-bid", callback);
        return () => {
            socket.off("new-bid", callback);
        };
    }
};


export { connectSocket, emitBid, listenForNewBids };
