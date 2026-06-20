const express = require('express');
const router = express.Router();
const { getDevOpsMetrics } = require('../controllers/devopsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/metrics', protect, getDevOpsMetrics);

module.exports = router;
