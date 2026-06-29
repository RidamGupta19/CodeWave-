const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  recalculateRankings,
  resetStandings,
  getSettings,
  updateSettings,
  getGamificationAnalytics
} = require('../controllers/leaderboardController');

// All admin gamification endpoints are restricted to Admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.post('/recalculate', recalculateRankings);
router.post('/reset', resetStandings);
router.get('/analytics', getGamificationAnalytics);

module.exports = router;
