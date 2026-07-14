const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkFeature } = require('../middleware/featureFlagMiddleware');

// ==========================================
// 1. AI Interview (Key: ai_interview)
// ==========================================
router.get('/ai-interview/sessions', protect, checkFeature('ai_interview'), (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', title: 'MERN Stack Mock Interview', date: new Date(), score: 85, status: 'Completed' },
      { id: '2', title: 'Data Structures & Algorithms Drill', date: new Date(Date.now() - 86400000), score: 92, status: 'Completed' }
    ]
  });
});

router.post('/ai-interview/start', protect, checkFeature('ai_interview'), (req, res) => {
  res.json({
    success: true,
    message: 'Mock interview session initialized successfully.',
    sessionId: 'mock_session_' + Math.floor(Math.random() * 10000)
  });
});

// ==========================================
// 2. AI Resume Builder (Key: ai_resume_builder)
// ==========================================
router.get('/ai-resume/resumes', protect, checkFeature('ai_resume_builder'), (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', title: 'Full Stack Developer Resume', score: 88, lastUpdated: new Date() },
      { id: '2', title: 'DSA Software Engineer Profile', score: 94, lastUpdated: new Date(Date.now() - 172800000) }
    ]
  });
});

router.post('/ai-resume/analyze', protect, checkFeature('ai_resume_builder'), (req, res) => {
  res.json({
    success: true,
    score: 85,
    suggestions: [
      'Add more action verbs in your DSA project descriptions.',
      'Quantify your impact (e.g., optimized API latency by 30%).',
      'Include Docker/Kubernetes keywords for DevOps roles.'
    ]
  });
});

// ==========================================
// 3. Placement Portal (Key: placement_portal)
// ==========================================
router.get('/placement/drives', protect, checkFeature('placement_portal'), (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', company: 'Google', role: 'Software Engineer Intern', eligibilityXP: 1500, deadline: new Date(Date.now() + 518400000) },
      { id: '2', company: 'Amazon', role: 'SDE-1', eligibilityXP: 2000, deadline: new Date(Date.now() + 864000000) },
      { id: '3', company: 'Microsoft', role: 'Product Engineer', eligibilityXP: 2500, deadline: new Date(Date.now() + 1209600000) }
    ]
  });
});

// ==========================================
// 4. Job Board (Key: job_board)
// ==========================================
router.get('/job-board/jobs', protect, checkFeature('job_board'), (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', title: 'Frontend Developer (React)', company: 'TechSolutions', location: 'Remote / Bangalore', salary: '₹8-12 LPA', type: 'Full-time' },
      { id: '2', title: 'Backend Developer (Node.js)', company: 'DevScale', location: 'Remote / Pune', salary: '₹10-15 LPA', type: 'Full-time' },
      { id: '3', title: 'DevOps Engineer', company: 'CloudFlow', location: 'Hybrid / Hyderabad', salary: '₹12-18 LPA', type: 'Full-time' }
    ]
  });
});

module.exports = router;
