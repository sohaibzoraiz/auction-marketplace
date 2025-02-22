// File Path: controllers/carController.js

const { Pool } = require('pg');
const { check, validationResult } = require('express-validator');

// PostgreSQL connection setup (adjust as needed)
const pool = new Pool({
    user: 'auction_user',
    host: 'localhost',
    database: 'car_auction',
    password: 'Zoraiz1!',
    port: 5432,
});

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

module.exports={createCarListing,
getAllCarListings,
updateCarListing,
deleteCarListing};
