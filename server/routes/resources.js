const express = require('express');
const router = express.Router();
const c = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', c.getResources);
router.post('/', protect, authorize('admin'), c.createResource);
router.put('/:id', protect, authorize('admin'), c.updateResource);
router.delete('/:id', protect, authorize('admin'), c.deleteResource);

module.exports = router;
