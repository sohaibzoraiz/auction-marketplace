const pool = require('../db');

const getAvailableInspectionSlots = async (req, res) => {
  const today = new Date();
  today.setDate(today.getDate() + 1); // start from next day

  const slotsPerDay = 8;
  const startHour = 9;
  const endHour = 17;
  const maxSpots = 2;
  const days = 5;

  const slots = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const dateStr = date.toISOString().split('T')[0];

    for (let hour = startHour; hour < endHour; hour++) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      const slotISO = slotTime.toISOString();

      // Query existing bookings for this slot
      const result = await pool.query(
        `SELECT COUNT(*) FROM inspection_requests WHERE inspection_time = $1`,
        [slotISO]
      );
      const count = parseInt(result.rows[0].count, 10);

      if (count < maxSpots) {
        slots.push({ datetime: slotISO, remaining: maxSpots - count });
      }
    }
  }

  res.json(slots);
};

module.exports = {
  getAvailableInspectionSlots
};
