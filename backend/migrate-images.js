// migrate-images.js

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
// migrateGenPhotosToS3.js (from database directly)

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');



const pool = new Pool({
  user: 'auction_user',
  host: 'localhost',
  database: 'car_auction',
  password: 'Zoraiz1!',
  port: 5432,
});

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;
const S3_BASE_URL = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/generations/`;

async function uploadToS3(buffer, filename, mimeType) {
  const key = `uploads/generations/${filename}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ACL: 'public-read'
  });
  await s3.send(command);
  return `${S3_BASE_URL}${filename}`;
}

async function processGeneration(gen) {
  const { id, gen_slug, gen_photos } = gen;
  if (!gen_photos || gen_photos === '-' || gen_photos === 'null') return;

  const photoUrls = gen_photos.split('|').map(p => p.trim()).filter(Boolean);
  const uploadedUrls = [];

  try {
    for (const originalUrl of photoUrls) {
      if (originalUrl.includes(S3_BASE_URL)) {
        // Already uploaded to S3, keep it as-is
        uploadedUrls.push(originalUrl);
        continue;
      }

      const response = await axios.get(originalUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);
      const extension = path.extname(originalUrl).split('?')[0].replace('.', '') || 'jpg';
      const filename = `${uuidv4()}.${extension}`;

      const uploadedUrl = await uploadToS3(buffer, filename, response.headers['content-type']);
      uploadedUrls.push(uploadedUrl);
    }

    const newPhotoString = uploadedUrls.join(' | ');
    const client = await pool.connect();
    try {
      await client.query('UPDATE car_generations SET gen_photos = $1 WHERE id = $2', [newPhotoString, id]);
      console.log(`✅ Updated ${gen_slug} (${id}) with ${uploadedUrls.length} image(s).`);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(`❌ Failed for ${gen_slug} (${id}): ${err.message}`);
  }
}

async function migrateFromDatabase() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT id, gen_slug, gen_photos FROM car_generations');
    console.log(`🔍 Found ${rows.length} generations to process.`);

    for (const gen of rows) {
      await processGeneration(gen);
    }

    console.log('🎉 All generations processed.');
  } catch (err) {
    console.error('💥 Error fetching generations:', err);
  } finally {
    client.release();
    process.exit();
  }
}

migrateFromDatabase();
