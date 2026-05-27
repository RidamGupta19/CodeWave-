const express = require('express');
const { run, submit } = require('../controllers/codeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/run', protect, run);
router.post('/submit', protect, submit);

module.exports = router;
