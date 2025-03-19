// File Path: controllers/carController.js
const redisClient = require('../redisClient');
//const { Pool } = require('pg');
const pool = require('../db');  // Use the new db.js file
const { check, validationResult } = require('express-validator');

/* PostgreSQL connection setup (adjust as needed)
const pool = new Pool({
    user: 'auction_user',
    host: 'localhost',
    database: 'car_auction',
    password: 'Zoraiz1!',
    port: 5432,
});*/
/*
const createAuctionListing = async (req, res) => {
    try {
        const featuredImage = req.files['featuredImage'] ? req.files['featuredImage'][0].filename : null;
        const carImages = req.files['carImages'] ? req.files['carImages'].map(file => file.filename) : [];
        // Extract other form fields from the request body
        const {
            city,
            carMake,
            yearModel,
            registrationCity,
            mileage,
            demandPrice,
            description,
            inspectionCompanyName,
            inspectionReport,
            listingType,
            reservePrice,
            endTime
        } = req.body;
        const userId = req.user?.userId; // Use optional chaining
        const userPlan = req.user?.userPlan; // Use optional chaining // Assuming you have user information in the request

        const imagePaths = [];

        if (featuredImage) {
            imagePaths.push(`/uploads/${featuredImage}`); // Add featured image first
        }
        
        if (carImages) {
            carImages.forEach(image => {
                imagePaths.push(`/uploads/${image}`); // Then add car images
            });
        }
        
        const carPhotosJsonb = JSON.stringify(imagePaths);
        // Insert the new auction listing into the database
        const result = await pool.query(
            'INSERT INTO cars(user_id, city, car_make, year_model, registration_city, mileage, demand_price, description, inspection_company_name, inspection_report, listing_type, car_photos_jsonb) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id',
            [userId, city, carMake, yearModel, registrationCity, mileage, demandPrice, description, inspectionCompanyName, inspectionReport, listingType === 'auction', carPhotosJsonb]
        );

        const carId = result.rows[0].id;

        // Determine End Time (15 days for basic users, up to 30 days for premium users)
        let calculatedEndTime;
        if (userPlan === 'premium' && endTime) { // Use provided end time for premium users
            calculatedEndTime = new Date(endTime);
        } else {
            calculatedEndTime = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days from now for basic users
        }

        // Set reserve price to null for basic users if not provided
        let auctionReservePrice = null;
        if (userPlan === 'premium') {
            auctionReservePrice = reservePrice ? parseFloat(reservePrice) : null; // Use parseFloat and check for undefined
        }

        // Set initial current bid to 50% of demand price
        const initialCurrentBid = demandPrice / 2;

        // Insert new auction into auctions table

        const resultAuction = await pool.query(
            "INSERT INTO auctions(car_id, end_time, current_bid, reserve_price) VALUES($1, $2, $3, $4) RETURNING*",
            [carId, calculatedEndTime, initialCurrentBid, auctionReservePrice]
        );

        res.status(201).json({ message: 'Auction created successfully', auction: resultAuction.rows[0] });

    } catch (err) {
        console.error('Error creating auction listing:', err);
        res.status(500).json({ message: 'Failed to create auction listing' });
    }
};*/
const createAuctionListing = async (req, res) => {
    try {
      // Get uploaded files from S3 via multer-s3
      const featuredImage = req.files['featuredImage']
        ? req.files['featuredImage'][0].location
        : null;
      const carImages = req.files['carImages']
        ? req.files['carImages'].map(file => file.location)
        : [];
      
      // Extract other form fields from the request body
      const {
        city,
        carMake,
        yearModel,
        registrationCity,
        mileage,
        demandPrice,
        description,
        inspectionCompanyName,
        inspectionReport,
        listingType,
        reservePrice,
        endTime
      } = req.body;
      
      const userId = req.user?.userId; // Using optional chaining for safety
      const userPlan = req.user?.userPlan; // Assuming user information is present in the request
  
      // Build an array of image URLs from S3 (no local /uploads prefix)
      const imagePaths = [];
      if (featuredImage) {
        imagePaths.push(featuredImage);
      }
      if (carImages) {
        carImages.forEach(image => {
          imagePaths.push(image);
        });
      }
      
      // Convert the image paths to JSON (S3 URLs)
      const carPhotosJsonb = JSON.stringify(imagePaths);
      
      // Insert new car into the cars table
      const result = await pool.query(
        'INSERT INTO cars(user_id, city, car_make, year_model, registration_city, mileage, demand_price, description, inspection_company_name, inspection_report, listing_type, car_photos_jsonb) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id',
        [
          userId,
          city,
          carMake,
          yearModel,
          registrationCity,
          mileage,
          demandPrice,
          description,
          inspectionCompanyName,
          inspectionReport,
          listingType === 'auction',
          carPhotosJsonb
        ]
      );
  
      const carId = result.rows[0].id;
  
      // Determine End Time (15 days for basic users, up to 30 days for premium users)
      let calculatedEndTime;
      if (userPlan === 'premium' && endTime) { 
        // Use provided end time for premium users
        calculatedEndTime = new Date(endTime);
      } else {
        // 15 days from now for basic users
        calculatedEndTime = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
      }
  
      // Set reserve price to null for basic users if not provided
      let auctionReservePrice = null;
      if (userPlan === 'premium') {
        auctionReservePrice = reservePrice ? parseFloat(reservePrice) : null;
      }
  
      // Set initial current bid to 50% of demand price
      const initialCurrentBid = demandPrice / 2;
  
      // Insert new auction into the auctions table
      const resultAuction = await pool.query(
        "INSERT INTO auctions(car_id, end_time, current_bid, reserve_price) VALUES($1, $2, $3, $4) RETURNING*",
        [carId, calculatedEndTime, initialCurrentBid, auctionReservePrice]
      );
  
      res.status(201).json({ 
        message: 'Auction created successfully', 
        auction: resultAuction.rows[0] 
      });
    } catch (err) {
      console.error('Error creating auction listing:', err);
      res.status(500).json({ message: 'Failed to create auction listing' });
    }
  };
  


async function updateAuctionListing(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id, city, carMake, yearModel, registrationCity, mileage, demandPrice,
                description, inspectionCompanyName, inspectionReport, listingType, carPhotosJsonb, reservePrice, endTime } = req.body;

        if (!id || !city || !carMake || !yearModel || !registrationCity || !mileage || !demandPrice || !description || !inspectionCompanyName || !inspectionReport) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Determine listing type as boolean
        let isAuction = false;
        if (listingType === 'auction') {
            isAuction = true;
        }

        // Update existing car in cars table

        const resultCar = await pool.query(
            "UPDATE cars SET city=$1, car_make=$2, year_model=$3, registration_city=$4, mileage=$5, demand_price=$6, description=$7, inspection_company_name=$8, inspection_report=$9, listing_type=$10, car_photos_jsonb=$11 WHERE id=$12 RETURNING*",
            [city.trim(), carMake.trim(), yearModel.trim(), registrationCity.trim(),
             mileage.toString().trim(), demandPrice.toString().trim(),
             description.trim(), inspectionCompanyName.trim(), inspectionReport.trim(), isAuction,
             JSON.stringify(carPhotosJsonb), id]
        );

        if (resultCar.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });

        // Determine End Time (15 days for basic users, up to 30 days for premium users)
        let calculatedEndTime;
        if (req.user.plan === 'premium' && endTime) { // Use provided end time for premium users
            calculatedEndTime = new Date(endTime);
        } else {
            calculatedEndTime = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days from now for basic users
        }

        // Set reserve price to null for basic users if not provided
        let auctionReservePrice = null;
        if (req.user.plan === 'premium') {
            auctionReservePrice = reservePrice ? parseFloat(reservePrice) : null; // Use parseFloat and check for undefined
        }

        // Update existing auction in auctions table

        const resultAuction = await pool.query(
            "UPDATE auctions SET end_time=$1, reserve_price=$2 WHERE car_id=$3 RETURNING*",
            [calculatedEndTime, auctionReservePrice, id]
        );

        if (resultAuction.rows.length === 0) return res.status(404).json({ message: 'Auction not found' });

        res.json(resultAuction.rows[0]);

    } catch (error) {
        console.error('Error updating auction:', error);
        res.status(500).json({ message: 'Failed to update auction' });
    }
}

async function getAllAuctionListings(req, res) {
    
    try {
        const result = await pool.query(
            "SELECT c.id, c.city, c.car_make, c.year_model, c.registration_city, c.mileage, c.demand_price, c.description, c.inspection_company_name, c.inspection_report,c.car_photos_jsonb, a.end_time, a.current_bid, a.reserve_price " +
            "FROM cars c JOIN auctions a ON c.id = a.car_id"
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Error fetching auction listings:', error);
        res.status(500).json({ message: 'Failed to fetch auction listings' });
    }
}

async function getLatestListings(req, res) {
    try {
        const result = await pool.query(
            "SELECT c.id, c.city, c.car_make, c.year_model, c.registration_city, c.mileage, c.demand_price, c.description, c.inspection_company_name, c.inspection_report, c.car_photos_jsonb, a.end_time, a.current_bid, a.reserve_price " +
            "FROM cars c JOIN auctions a ON c.id = a.car_id " +
            "WHERE a.end_time > NOW() " + // Only include future auctions
            "ORDER BY a.end_time DESC " +  // Sort by the soonest ending auction
            "LIMIT 7"  // Get only the latest 7 valid listings
        );
        
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching auction listings:', error);
        res.status(500).json({ message: 'Failed to fetch auction listings' });
    }
}



async function getFeaturedAuctionListings(req, res) {
    try {
        
        const cacheKey = 'featured_listings';
    
        // Attempt to fetch from Redis
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          console.log('Serving featured listings from cache.');
          return res.json(JSON.parse(cachedData));
        }
           
        const result = await pool.query(
            "SELECT c.id, c.car_make, c.year_model, c.demand_price, c.car_photos_jsonb, a.end_time, a.current_bid, a.reserve_price " +
            "FROM cars c LEFT JOIN auctions a ON c.id = a.car_id JOIN subscriptions s ON c.user_id = s.user_id " +
            "WHERE s.subscription_plan_name = 'premium' AND s.subscription_end_date > NOW()"
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'No featured listings found' });
        } else {
            
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(result.rows));
            res.json(result.rows);

        }
    }
     catch (error) {
        console.error('Error fetching featured auction listings:', error);
        res.status(500).json({ message: 'Failed to fetch featured auction listings' });
    }
}
async function getSingleAuctionListing(req, res) {
    try {
        const { carMake, yearMake, id } = req.query;

        const result = await pool.query(
            "SELECT c.id, c.city, c.car_make, c.year_model, c.registration_city, c.mileage, c.demand_price, c.description, c.inspection_company_name, c.inspection_report, c.car_photos_jsonb, a.end_time, a.current_bid, a.reserve_price " +
            "FROM cars c JOIN auctions a ON c.id = a.car_id WHERE c.car_make = $1 AND c.year_model = $2 AND c.id = $3",
            [carMake, yearMake, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Auction listing not found' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error fetching single auction listing:', error);
        res.status(500).json({ message: 'Failed to fetch single auction listing' });
    }
}



async function deleteAuctionListing(req, res) {
    try {
        const id = req.params.id;

        // First, delete the auction from the auctions table
        const resultAuction = await pool.query(
            "DELETE FROM auctions WHERE car_id=$1 RETURNING*",
            [id]
        );

        if (resultAuction.rows.length === 0) return res.status(404).json({ message: 'Auction not found' });

        // Then, delete the car from the cars table
        const resultCar = await pool.query(
            "DELETE FROM cars WHERE id=$1 RETURNING*",
            [id]
        );

        if (resultCar.rows.length === 0) return res.status(404).json({ message: 'Car not found' });

        res.json(resultCar.rows[0]);

    } catch (error) {
        console.error('Error deleting auction:', error);
        res.status(500).json({ message: 'Failed to delete auction' });
    }
}

async function createCarListing(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { city, carMake, yearModel, registrationCity, mileage, demandPrice,
                description , listingType , carPhotosJsonb} = req.body;

        // Insert new car into database

        const result = await pool.query(
            "INSERT INTO cars(city ,car_make ,year_model ,registration_city,mileage,demand_price ,description ," +
            "listing_type ,car_photos_jsonb )VALUES($1,$2,$3,$4,$5,$6,$7 ,$8 ,$9 )RETURNING*",
            [city.trim(), carMake.trim(), yearModel.trim(), registrationCity.trim(),
             mileage.toString().trim(), demandPrice.toString().trim() ,
             description.trim() ,listingType ,
             JSON.stringify(carPhotosJsonb)]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        
console.error(error);
res.status(500).send("Error");
}
}
async function getAllCarListings(req, res) {
    try {
        const result = await pool.query("SELECT * FROM cars");

        res.json(result.rows);

    } catch (error) {
        
console.error(error);
res.status(500).send("Error");
}
}

async function updateCarListing(req, res) {
    try {
        const id = req.params.id;
        const { city, carMake, yearModel, registrationCity,
                mileage , demandPrice , description ,
                listingType , carPhotosJsonb} = req.body;

        // Update existing listing in database

        const result = await pool.query(
            "UPDATE cars SET city=$1 ,car_make=$2 ,year_model=$3 ," +
            "registration_city=$4,mileage=$5,demand_price =$6," +
            "description =$7," +
            "listing_type =$8," +
            "car_photos_jsonb =$9 WHERE id=$10 RETURNING*",
            [city.trim(), carMake.trim(), yearModel.trim(), registrationCity.trim(),
             mileage.toString().trim() ,
             demandPrice.toString().trim() ,
             description.trim() ,
             listingType ,
             JSON.stringify(carPhotosJsonb),
             id]
        );

if (result.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });

res.json(result.rows[0]);

} catch (error) {

console.error(error);
res.status(500).send("Error");
}
}

async function deleteCarListing(req,res){
try{
const id=req.params.id;

const result=await pool.query(
"DELETE FROM cars WHERE id=$1 RETURNING*",
[id]
);

if(result.rows.length===0)return res.status(404).json({message:"No such listing exists"});

res.json(result.rows[0]);

}catch(error){console.error(error);res.send(500,"Server error");}

}

module.exports={createAuctionListing, 
updateAuctionListing, 
getAllAuctionListings,
getLatestListings,
getFeaturedAuctionListings, 
getSingleAuctionListing,
deleteAuctionListing,
createCarListing,
getAllCarListings,
updateCarListing,
deleteCarListing};
