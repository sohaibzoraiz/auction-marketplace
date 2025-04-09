// File Path: controllers/carController.js
const redisClient = require('../redisClient');
//const { Pool } = require('pg');
const pool = require('../db');  // Use the new db.js file
const { check, validationResult } = require('express-validator');


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
        car_make,
        model,
        variant,
        make_id,
        model_id,
        version_id,
        generation_id,
        year_model,
        registration_city,
        mileage,
        demand_price,
        description,
        inspection_time,
        inspection_address,
        inspection_contact,
        inspection_lat,
        inspection_lng,
        payment_method,
        start_time,
        end_time,
        reserve_price,
        is_featured
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
      const carInsert = await pool.query(
        `INSERT INTO cars (
          user_id, city, car_make, model, variant,
          make_id, model_id, version_id, generation_id,
          year_model, registration_city, mileage, demand_price,
          description, car_photos_jsonb
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
        [
          userId,
          city,
          car_make,
          model,
          variant,
          make_id,
          model_id,
          version_id,
          generation_id,
          year_model,
          registration_city,
          mileage,
          demand_price,
          description,
          carPhotosJsonb
        ]
      );
  
      const carId = carInsert.rows[0].id;
      /*
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
      */

    
      // Step 2: Create a payment for the inspection
    const inspectionFee = 2500; // Fixed fee for now
    const paymentInsert = await pool.query(
        `INSERT INTO payments (
        user_id, payment_method, amount, payment_status, payment_type
        ) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
        userId,
        payment_method,
        inspectionFee,
        false, // Initially unpaid
        'inspection'
        ]
    );
    const paymentId = paymentInsert.rows[0].id;
    
    // Step 3: Insert into `inspection_requests`
    await pool.query(
        `INSERT INTO inspection_requests (
        user_id, car_id, inspection_time, inspection_address, inspection_contact,
        inspection_lat, inspection_lng, payment_id, inspection_fee
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
        userId,
        carId,
        inspection_time,
        inspection_address,
        inspection_contact,
        inspection_lat,
        inspection_lng,
        paymentId,
        inspectionFee
        ]
    );
      // Step 4: Create auction entry
      const initialBid = Math.round(parseFloat(reserve_price) * 0.8);
        await pool.query(
            `INSERT INTO auctions (
            car_id, start_time, end_time, current_bid, reserve_price, is_featured, winning_user_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
            carId,
            start_time,
            end_time,
            initialBid, // current_bid starts as 80% of demand_price
            reserve_price || null,
            is_featured || false,
            null // winning_user_id is initially null
        ]
    );
  
      res.status(201).json({ 
        message: 'Auction created successfully', 
        //auction: resultAuction.rows[0] 
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
            "SELECT c.id, c.city, c.car_make, c.year_model, c.registration_city, c.mileage, c.demand_price, c.description, c.car_photos_jsonb, a.end_time, a.current_bid, a.reserve_price " +
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
            "SELECT c.id, c.city, c.car_make, c.year_model, c.registration_city, c.mileage, c.demand_price, c.description,  c.car_photos_jsonb, a.end_time, a.current_bid, a.reserve_price " +
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
            "SELECT c.id, c.car_make, c.year_model, c.demand_price, c.car_photos_jsonb, " +
            "a.end_time, a.current_bid, a.reserve_price " +
            "FROM cars c " +
            "LEFT JOIN auctions a ON c.id = a.car_id " +
            "WHERE a.is_featured = true " +
            "AND a.start_time <= NOW() " +
            "AND a.end_time > NOW() " +
            "ORDER BY a.start_time DESC " +
            "LIMIT 7"
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
            "SELECT c.id, c.city, c.car_make, c.model, c.variant, c.year_model, c.registration_city, c.mileage, c.demand_price, c.description, c.car_photos_jsonb, a.start_time, a.end_time, a.current_bid, a.reserve_price a.winning_user_id a.active_status" +
            "FROM cars c JOIN auctions a ON c.id = a.car_id WHERE c.id = $1", [id]
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

const getBidHistory = async (req, res) => {
    try {
        const { carId } = req.query;
       // console.log("Car ID:", carId);
        const result = await pool.query(
            `SELECT b.amount, b.created_at, u.name 
             FROM bids b
             JOIN users u ON b.user_id = u.id
             WHERE b.car_id = $1
             ORDER BY b.created_at DESC`,
            [carId]
        );
        // console.log("Bid history:", result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching bid history:", error);
        res.status(500).json({ message: "Failed to fetch bid history" });
    }
};




module.exports={createAuctionListing, 
updateAuctionListing, 
getAllAuctionListings,
getLatestListings,
getFeaturedAuctionListings, 
getSingleAuctionListing,
deleteAuctionListing,
getBidHistory
};
