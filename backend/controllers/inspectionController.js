const pool = require('../db');

const getAvailableInspectionSlots = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Missing date parameter' });
  }

  try {
    const startDate = new Date(`${date}T00:00:00`);
    const endDate = new Date(`${date}T23:59:59`);

    const result = await pool.query(
      `SELECT inspection_time FROM inspection_requests
       WHERE inspection_time BETWEEN $1 AND $2`,
      [startDate, endDate]
    );

    const takenSlots = result.rows.map(row => row.inspection_time.toISOString());

    res.json({ takenSlots });
  } catch (err) {
    console.error('Error fetching inspection slots:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAvailableInspectionSlots,
};
