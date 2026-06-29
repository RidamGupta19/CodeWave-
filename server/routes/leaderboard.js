const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getGlobalLeaderboard,
  getCourseLeaderboard,
  getBatchLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getMyLeaderboardRecord
} = require('../controllers/leaderboardController');

// All leaderboard endpoints are protected
router.use(protect);

router.get('/global', getGlobalLeaderboard);
router.get('/course/:courseId', getCourseLeaderboard);
router.get('/batch/:batchId', getBatchLeaderboard);
router.get('/weekly', getWeeklyLeaderboard);
router.get('/monthly', getMonthlyLeaderboard);
router.get('/me', getMyLeaderboardRecord);

module.exports = router;
