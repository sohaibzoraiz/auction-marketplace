const express = require('express');
const router = express.Router();
const { getAvailableInspectionSlots } = require('../controllers/inspectionController');

router.get('/slots', getAvailableInspectionSlots);

module.exports = router;
