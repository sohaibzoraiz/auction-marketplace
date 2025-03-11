/*import Link from 'next/link';

function FeaturedListings({ listings }) {
    listings = Array.isArray(listings) ? listings : [];
   
    return (
        <section className="py-10">
    <h2 className="text-3xl font-bold mb-4">Featured Listings</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.map((listing) => (
            <div key={listing.id} className="bg-white p-4 rounded shadow-md">
                <img
    src={`https://api.carmandi.com.pk${
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
*/
import Link from 'next/link';

function FeaturedListings({ listings }) {
  listings = Array.isArray(listings) ? listings : [];

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-4">Featured Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.map((listing) => {
          // Ensure car_photos_jsonb is an array. If stored as a string, parse it.
          let photos;
          if (typeof listing.car_photos_jsonb === 'string') {
            try {
              photos = JSON.parse(listing.car_photos_jsonb);
            } catch (err) {
              console.error("Error parsing car_photos_jsonb", err);
              photos = [];
            }
          } else {
            photos = listing.car_photos_jsonb;
          }

          // Use the first image's URL; since S3 URLs are stored, no prefix is needed.
          const imageUrl = photos && photos.length > 0 ? photos[0] : '/default-image.jpg';

          return (
            <div key={listing.id} className="bg-white p-4 rounded shadow-md">
              <img
                src={imageUrl}
                alt="Featured Image"
                className="max-h-40 mb-4"
              />
              <h3 className="text-lg font-bold">{listing.car_make}</h3>
              <p>Price: {listing.demand_price}</p>
              <Link href={`/auction/${listing.car_make}-${listing.year_model}-${listing.id}`}>
                Bid Now
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedListings;
