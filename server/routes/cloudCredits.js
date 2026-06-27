const express = require('express');
const router = express.Router();
const c = require('../controllers/cloudCreditController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', c.getCloudCredits);
router.get('/my-claims', protect, c.getMyClaims);
router.post('/claim/:id', protect, c.claimCloudCredit);
router.get('/admin/claims', protect, authorize('admin'), c.getAdminClaims);
router.put('/admin/claims/:id', protect, authorize('admin'), c.updateClaimStatus);

router.post('/', protect, authorize('admin'), c.createCloudCredit);
router.put('/:id', protect, authorize('admin'), c.updateCloudCredit);
router.delete('/:id', protect, authorize('admin'), c.deleteCloudCredit);

module.exports = router;
