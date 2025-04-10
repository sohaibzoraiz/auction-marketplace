// backend/controllers/dropdownController.js (modeled after carController.js)
const pool = require('../db');

// Get all car makes
const getMakes = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM car_makes ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching car makes:', err);
    res.status(500).json({ error: 'Failed to fetch car makes' });
  }
};

// Get models by make_id
const getModelsByMake = async (req, res) => {
  const { make_id } = req.query;
  if (!make_id) return res.status(400).json({ error: 'Missing make_id' });

  try {
    const result = await pool.query(
      'SELECT id, name FROM car_models WHERE make_id = $1 ORDER BY name',
      [make_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching car models:', err);
    res.status(500).json({ error: 'Failed to fetch car models' });
  }
};

// Get variants (versions) by model_id
const getVariantsByModel = async (req, res) => {
  const { model_id } = req.query;
  if (!model_id) return res.status(400).json({ error: 'Missing model_id' });

  try {
    const result = await pool.query(
      `SELECT cv.id, cv.slug, cv.name AS version_name, cv.generation_id
       FROM car_versions cv
       JOIN car_generations cg ON cv.generation_id = cg.id
       WHERE cg.model_id = $1
       ORDER BY cv.name`,
      [model_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching car variants:', err);
    res.status(500).json({ error: 'Failed to fetch car variants' });
  }
};

// Get year range by version_id
const getYearRangeByVersion = async (req, res) => {
  const { version_id } = req.query;
  if (!version_id) return res.status(400).json({ error: 'Missing version_id' });

  try {
    const result = await pool.query(
      `SELECT cg.start_year, cg.end_year
       FROM car_generations cg
       JOIN car_versions cv ON cv.generation_id = cg.id
       WHERE cv.id = $1`,
      [version_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Year range not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching year range:', err);
    res.status(500).json({ error: 'Failed to fetch year range' });
  }
};
const getVariantsByModelAndYear = async (req, res) => {
    const { model_id, year } = req.query;
  
    if (!model_id || !year) {
      return res.status(400).json({ message: 'Missing model_id or year parameter' });
    }
  
    try {
      const result = await pool.query(
        `SELECT cv.id, cv.slug, cv.name AS version_name, cv.generation_id
         FROM car_versions cv
         JOIN car_generations cg ON cv.generation_id = cg.id
         WHERE cg.model_id = $1
         AND $2 BETWEEN cg.start_year AND cg.end_year
         ORDER BY cv.name`,
        [model_id, year]
      );
  
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching variants by model and year:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const getYearRangesByModel = async (req, res) => {
    const { model_id } = req.query;
  
    if (!model_id) {
      return res.status(400).json({ message: 'Missing model_id' });
    }
  
    try {
      const result = await pool.query(
        `SELECT id AS generation_id, start_year, end_year
         FROM car_generations
         WHERE model_id = $1
         ORDER BY start_year DESC`,
        [model_id]
      );
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching year ranges:', error);
      res.status(500).json({ message: 'Failed to fetch year ranges' });
    }
  };
  

module.exports = {
  getMakes,
  getModelsByMake,
  getVariantsByModel,
  getYearRangeByVersion,
  getVariantsByModelAndYear,
  getYearRangesByModel,
  
};
