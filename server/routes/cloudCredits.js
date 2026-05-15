const express = require('express');
const router = express.Router();
const c = require('../controllers/cloudCreditController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', c.getCloudCredits);
router.post('/', protect, authorize('admin'), c.createCloudCredit);
router.put('/:id', protect, authorize('admin'), c.updateCloudCredit);
router.delete('/:id', protect, authorize('admin'), c.deleteCloudCredit);

module.exports = router;
