const express = require('express');
const {
  getProblems,
  getProblemBySlug,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemsByDomain,
  getProblemsByTopic,
  getProgress
} = require('../controllers/problemController');
const { run, submit } = require('../controllers/codeController');
const { getMySubmissions } = require('../controllers/submissionController');
const { optionalProtect, protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', optionalProtect, getProblems);
router.get('/progress', protect, getProgress);
router.post('/run', protect, run);
router.post('/submit', protect, submit);
router.get('/submissions', protect, getMySubmissions);

router.get('/domain/:domainId', optionalProtect, getProblemsByDomain);
router.get('/topic/:topicName', optionalProtect, getProblemsByTopic);
router.get('/:slug', optionalProtect, getProblemBySlug);
router.post('/', protect, adminOnly, createProblem);
router.put('/:id', protect, adminOnly, updateProblem);
router.delete('/:id', protect, adminOnly, deleteProblem);

module.exports = router;
