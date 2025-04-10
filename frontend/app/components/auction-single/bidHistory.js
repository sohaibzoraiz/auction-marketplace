import { useState, useEffect } from "react";

const BidHistory = ({ carId }) => {
    const [bids, setBids] = useState([]);
   // console.log(carId);
    useEffect(() => {
        if (!carId) return; // ✅ Prevents API call if carId is not available
    
        const fetchBidHistory = async () => {
            try {
                const response = await fetch(`https://api.carmandi.com.pk/api/auctions/bid-history?carId=${carId}`);
                if (!response.ok) throw new Error("Failed to fetch bid history");
    
                const data = await response.json();
                setBids(data);
            } catch (error) {
                console.error("Error fetching bid history:", error);
            }
        };
    
        fetchBidHistory();
    }, [carId]);
    
    return (
        <div className="addithonal-information">
            <table className="table total-table2">
                <thead>
                    <tr>
                        <th>Sr. Num.</th>
                        <th>Bidder</th>
                        <th>Bid Amount</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {bids.length > 0 ? (
                        bids.map((bid, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{bid.name}</td>
                                <td>PKR {(bid.amount ?? 0).toLocaleString()}</td>
                                <td>{new Date(bid.created_at).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No bids yet</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BidHistory;
