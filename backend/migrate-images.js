// migrate-images.js

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const csv = require('csv-parser');
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
const S3_BASE_URL = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/versions/`;
const CSV_PATH = path.join(__dirname, 'data', 'versions-2022-01-28.csv');

async function uploadToS3(buffer, filename, mimeType) {
  const key = `uploads/versions/${filename}`;
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

async function processVersion(version) {
  const { id, slug, generation_id, version_photos } = version;
  if (!version_photos || version_photos === '-' || version_photos === 'null') return;

  const photoUrls = version_photos.split('|').map(p => p.trim()).filter(Boolean);
  const uploadedUrls = [];

  try {
    for (const originalUrl of photoUrls) {
      if (originalUrl.includes(S3_BASE_URL)) {
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
      await client.query(
        'UPDATE car_versions SET version_photos = $1 WHERE id = $2',
        [newPhotoString, id]
      );
      console.log(`✅ Updated ${slug} (Gen ID: ${generation_id}) with ${uploadedUrls.length} image(s).`);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(`❌ Failed for ${slug} (Gen ID: ${generation_id}): ${err.message}`);
  }
}

async function importVersionPhotosFromCSV() {
  const rows = [];
  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on('data', row => rows.push(row))
    .on('end', async () => {
      let updated = 0;
      for (const row of rows) {
        const slug = row.version_slug?.trim();
        const genSlug = row.gen_slug?.trim();
        const photos = row.gen_photos?.trim();
        if (!slug || !genSlug || !photos || photos === '-') continue;

        const client = await pool.connect();
        try {
          const existing = await client.query(
            `SELECT version_photos FROM car_versions cv
             JOIN car_generations cg ON cv.generation_id = cg.id
             WHERE cv.slug = $1 AND cg.gen_slug = $2`,
            [slug, genSlug]
          );

          if (existing.rowCount === 1 && (!existing.rows[0].version_photos || !existing.rows[0].version_photos.includes('s3.'))) {
            const result = await client.query(
              `UPDATE car_versions SET version_photos = $1
               FROM car_generations
               WHERE car_versions.slug = $2
               AND car_generations.gen_slug = $3
               AND car_versions.generation_id = car_generations.id`,
              [photos, slug, genSlug]
            );

            if (result.rowCount > 0) {
              console.log(`🔄 Imported photos for ${slug} (${genSlug})`);
              updated++;
            }
          }
        } catch (err) {
          console.error(`⚠️ Failed to import ${slug} (${genSlug}): ${err.message}`);
        } finally {
          client.release();
        }
      }
      console.log(`✅ Imported version_photos for ${updated} version(s).`);
      migrateFromDatabase(); // run S3 upload after import
    });
}

async function migrateFromDatabase() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT id, slug, generation_id, version_photos FROM car_versions');
    console.log(`🔍 Found ${rows.length} versions to process.`);

    for (const version of rows) {
      await processVersion(version);
    }

    console.log('🎉 All version photos processed.');
  } catch (err) {
    console.error('💥 Error fetching versions:', err);
  } finally {
    client.release();
    process.exit();
  }
}

importVersionPhotosFromCSV();
