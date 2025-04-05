const express = require('express');
const router = express.Router();
const dropdownController = require('../controllers/dropdownController');

router.get('/makes', dropdownController.getMakes);
router.get('/models', dropdownController.getModelsByMake);
router.get('/variants', dropdownController.getVariantsByModel);
router.get('/years', dropdownController.getYearRangeByVersion);

module.exports = router;
