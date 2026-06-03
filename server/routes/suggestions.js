const express = require('express');
const router = express.Router();
const { submitSuggestion } = require('../controllers/suggestionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitSuggestion);

module.exports = router;
