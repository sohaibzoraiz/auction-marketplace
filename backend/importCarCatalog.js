// importCarCatalog.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Pool } = require('pg');

const DRY_RUN = false; // set to true to preview without inserting

const pool = new Pool({
  user: 'auction_user',
  host: 'localhost',
  database: 'car_auction',
  password: 'Zoraiz1!', // update this
  port: 5432,
});

const csvFilePath = path.join(__dirname, 'data', 'versions-2022-01-28.csv');

let insertedCount = 0;
let skippedCount = 0;
let initialVersionCount = 0;

async function insertIfNotExists(table, condition, insertValues, returning = 'id') {
  const client = await pool.connect();
  try {
    const conditionKeys = Object.keys(condition);
    const conditionVals = Object.values(condition);

    const whereClause = conditionKeys.map((k, i) => `${k} = $${i + 1}`).join(' AND ');
    const selectQuery = `SELECT ${returning} FROM ${table} WHERE ${whereClause}`;
    const result = await client.query(selectQuery, conditionVals);

    if (result.rows.length > 0) {
      console.log(`[SKIP] ${table} exists with`, condition);
      skippedCount++;
      return result.rows[0][returning];
    }

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would insert into ${table}:`, insertValues);
      return null;
    }

    const insertKeys = Object.keys(insertValues);
    const insertVals = Object.values(insertValues);
    const placeholders = insertVals.map((_, i) => `$${i + 1}`).join(', ');

    const insertQuery = `INSERT INTO ${table} (${insertKeys.join(', ')}) VALUES (${placeholders}) RETURNING ${returning}`;
    const insertResult = await client.query(insertQuery, insertVals);

    console.log(`[INSERTED] into ${table}:`, insertValues);
    insertedCount++;
    return insertResult.rows[0][returning];
  } finally {
    client.release();
  }
}

function cleanBool(value) {
  if (typeof value === 'string') {
    return ['true', '1'].includes(value.trim().toLowerCase());
  }
  return !!value;
}

function cleanInt(value) {
  const num = parseInt(value);
  return isNaN(num) ? null : num;
}

async function importCSV() {
  const client = await pool.connect();
  try {
    const versionCountResult = await client.query('SELECT COUNT(*) FROM car_versions');
    initialVersionCount = parseInt(versionCountResult.rows[0].count);
  } finally {
    client.release();
  }

  const rows = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => rows.push(data))
    .on('end', async () => {
      console.log(`Total rows in CSV: ${rows.length}`);

      for (const row of rows) {
        try {
          const makeName = row.make.trim();
          const modelName = row.model.trim();
          const genName = row.gen_g_name?.trim();

          const makeId = await insertIfNotExists('car_makes', { name: makeName }, { name: makeName });

          const modelId = await insertIfNotExists(
            'car_models',
            { make_id: makeId, name: modelName },
            {
              make_id: makeId,
              name: modelName,
              model_active: cleanBool(row.model_active),
              model_published: cleanBool(row.model_published),
            }
          );

          const generationId = await insertIfNotExists(
            'car_generations',
            { model_id: modelId, gen_slug: row.gen_slug },
            {
              model_id: modelId,
              gen_g_name: genName,
              gen_slug: row.gen_slug,
              gen_imported: cleanBool(row.gen_imported),
              start_year: cleanInt(row.gen_start_year),
              end_year: cleanInt(row.gen_end_year),
              gen_photos: row.gen_photos,
            }
          );

          await insertIfNotExists(
            'car_versions',
            { slug: row.version_slug, generation_id: generationId },
            {
              generation_id: generationId,
              name: row.version_name,
              slug: row.version_slug,
              version_active: cleanBool(row.version_active),
              version_popular: cleanBool(row.version_popular),
              version_published: cleanBool(row.version_published),
              version_imported: cleanBool(row.version_imported),
              version_price: row.version_price,
              version_safety: row.version_safety,
              version_exterior: row.version_exterior,
              version_instrumentation: row.version_instrumentation,
              version_infotainment: row.version_infotainment,
              version_comfort_convenience: row.version_comfort_convenience,
              version_dimentions: row.version_dimentions,
              version_engine_motor: row.version_engine_motor,
              version_transmission: row.version_transmission,
              version_steering: row.version_steering,
              version_suspension_brakes: row.version_suspension_brakes,
              version_wheels_tyres: row.version_wheels_tyres,
              version_fuel_economy: row.version_fuel_economy,
              version_colors: row.version_colors,
            }
          );
        } catch (err) {
          console.error('Failed to import row:', row, '\nError:', err);
        }
      }

      console.log('CSV import complete.');
      console.log(`Total inserted this run: ${insertedCount}`);
      console.log(`Total skipped this run: ${skippedCount}`);
      console.log(`Total processed from CSV: ${rows.length}`);
      console.log(`Initial car_versions count: ${initialVersionCount}`);
      console.log(`Final car_versions count: ${initialVersionCount + insertedCount}`);
      process.exit();
    });
}

importCSV();
