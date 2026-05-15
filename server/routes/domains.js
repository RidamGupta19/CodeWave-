const express = require('express');
const router = express.Router();
const { getDomains, getDomain, createDomain, updateDomain, deleteDomain } = require('../controllers/domainController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getDomains);
router.get('/:id', getDomain);
router.post('/', protect, authorize('admin'), createDomain);
router.put('/:id', protect, authorize('admin'), updateDomain);
router.delete('/:id', protect, authorize('admin'), deleteDomain);

module.exports = router;
