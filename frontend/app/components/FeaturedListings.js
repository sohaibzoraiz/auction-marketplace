import Link from 'next/link';

function FeaturedListings({ listings }) {
    listings = Array.isArray(listings) ? listings : [];
   
    return (
        <section className="py-10">
    <h2 className="text-3xl font-bold mb-4">Featured Listings</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.map((listing) => (
            <div key={listing.id} className="bg-white p-4 rounded shadow-md">
                <img
    src={`http://localhost:3000${
        Array.isArray(listing.car_photos_jsonb)
            ? listing.car_photos_jsonb[0]
            : JSON.parse(listing.car_photos_jsonb)[0]
    }`}
    alt="Featured Image"
    className="max-h-40 mb-4"
/>
                <h3 className="text-lg font-bold">{listing.car_make}</h3>
                <p>Price: {listing.demand_price}</p>
                <Link href={`/auction/${listing.car_make}-${listing.year_model}-${listing.id}`}>
                    Bid Now
                </Link>
            </div>
        ))}
    </div>
</section>

    );
}

export default FeaturedListings;
