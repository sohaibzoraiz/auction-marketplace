// app/auction/[slug]/page.js
//"use client";
//import { useRouter } from 'next/navigation';

export default async function Page({ params }) {
    const { slug } = await params;

    if (!slug) return null;

    const [carMake, yearModel, id] = slug.split('-');
    let data;
    // Fetch auction data using carMake, yearModel, and id
    try {
        const response = await fetch(`http://localhost:3000/api/auctions/single?carMake=${carMake}&yearMake=${yearModel}&id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(response);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching car: ${errorText}`);
        }
        const data1 = await response.json();
        data = data1;
        console.log(data1);
        
    }
    catch (error) {
        console.error(error);
    }
    
    let carPhotos = [];
    if (Array.isArray(data.car_photos_jsonb)) {
        carPhotos = data.car_photos_jsonb;
    } else {
        console.error('car_photos_jsonb is not a valid array:', data.car_photos_jsonb);
    }
    console.log(carPhotos);
    return (
        <div>
        <div className="flex flex-col md:flex-row">
                {/* Left Section: Images */}
                <div className="md:w-1/2">
                    <img src={`http://localhost:3000${carPhotos[0]}`} alt="Featured Image" className="w-full h-96 object-cover" />
                    <div className="flex gap-4 mt-4">
                        {carPhotos.slice(1).map((photo, index) => (
                            <img key={index} src={`http://localhost:3000${photo}`} alt="Thumbnail" className="w-24 h-24 object-cover rounded" />
                        ))}
                    </div>
                </div>
        </div>
        <div>
            <h1>Auction: {carMake} {yearModel} {id}</h1>
            {/* Render auction details */}
        </div>
        </div>
    );
}
