const express = require('express');
const {
  getProblems,
  getProblemBySlug,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemsByDomain,
  getProblemsByTopic
} = require('../controllers/problemController');
const { optionalProtect, protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', optionalProtect, getProblems);
router.get('/domain/:domainId', optionalProtect, getProblemsByDomain);
router.get('/topic/:topicName', optionalProtect, getProblemsByTopic);
router.get('/:slug', optionalProtect, getProblemBySlug);
router.post('/', protect, adminOnly, createProblem);
router.put('/:id', protect, adminOnly, updateProblem);
router.delete('/:id', protect, adminOnly, deleteProblem);

module.exports = router;
