const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');

// Route: GET /api/recommendations/:userId
router.get('/:userId', getRecommendations);

module.exports = router;