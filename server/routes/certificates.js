const express = require('express');
const router = express.Router();
const c = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, c.getUserCertificates);
router.get('/', protect, authorize('admin'), c.getAllCertificates);
router.post('/', protect, authorize('admin'), c.createCertificate);

module.exports = router;
