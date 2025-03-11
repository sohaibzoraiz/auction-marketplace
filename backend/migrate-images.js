// migrate-images.js

require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const { Pool } = require('pg');

// Log AWS S3 Bucket for debugging
console.log("AWS_S3_BUCKET:", process.env.AWS_S3_BUCKET);

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,      
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,                  
});

const s3 = new AWS.S3();

// Initialize Postgres pool
const pool = new Pool({
  user: process.env.DB_USER || 'auction_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'car_auction',
  password: process.env.DB_PASSWORD || 'Zoraiz1!',
  port: process.env.DB_PORT || 5432,
});

// Directory where current images are stored
const uploadsDir = path.join(__dirname, '..', 'uploads'); 

// Function to upload a single file to S3
const uploadFileToS3 = (filePath, fileName) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (err) => {
      console.error('File Error', err);
      reject(err);
    });
    
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET, // Ensure this variable is set
      Key: `uploads/${Date.now().toString()}_${fileName}`, // Unique key for the file
      Body: fileStream,
      ACL: 'public-read', // Or adjust according to your needs
    };

    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.error('S3 Upload Error for file', fileName, err);
        reject(err);
      } else {
        console.log(`Uploaded ${fileName} successfully to ${data.Location}`);
        resolve(data.Location); // S3 URL
      }
    });
  });
};

// Function to update the database record for a given image
// You need to adjust this function to match your database schema.
// This sample function assumes that the local image path is stored in a JSON array.
const updateDatabaseWithS3Url = async (oldPath, s3Url) => {
  try {
    // Example query - adjust based on your schema and how images are stored
    const query = `
      UPDATE cars
      SET car_photos_jsonb = jsonb_replace(car_photos_jsonb, $1::text, $2::text)
      WHERE car_photos_jsonb::text LIKE $3
      RETURNING id
    `;
    const pattern = `%${oldPath}%`;
    const result = await pool.query(query, [oldPath, s3Url, pattern]);
    console.log('Updated database records for', oldPath, result.rows);
  } catch (err) {
    console.error('Error updating database for', oldPath, err);
  }
};

const migrateImages = async () => {
  try {
    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      console.error("Uploads directory does not exist:", uploadsDir);
      process.exit(1);
    }

    const files = fs.readdirSync(uploadsDir);
    console.log(`Found ${files.length} files in ${uploadsDir}`);
    
    for (const fileName of files) {
      const filePath = path.join(uploadsDir, fileName);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        console.log("Processing file:", fileName);
        // Upload file to S3
        const s3Url = await uploadFileToS3(filePath, fileName);
        // Update the database record for this file.
        const oldPath = `/uploads/${fileName}`; // Old local path stored in DB
        await updateDatabaseWithS3Url(oldPath, s3Url);
      }
    }
    console.log('Migration completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

migrateImages();
