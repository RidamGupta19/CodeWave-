const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const { updateAfterSubmission } = require('../services/progressService');

const buildFilters = (query = {}) => {
  const filter = {};
  if (query.problemId) filter.problem = query.problemId;
  if (query.userId) filter.user = query.userId;
  if (query.domainId) filter.domain = query.domainId;
  if (query.status) filter.status = query.status;
  if (query.language) filter.language = query.language;
  return filter;
};

const populateSubmissionQuery = (query) =>
  query
    .populate('user', 'fullName email')
    .populate('problem', 'title slug difficulty')
    .populate('domain', 'name slug')
    .sort({ submittedAt: -1 });

// @desc    Get all submissions (admin)
// @route   GET /api/submissions
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await populateSubmissionQuery(
      Submission.find(buildFilters(req.query))
    );
    res.json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's submissions
// @route   GET /api/submissions/my
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await populateSubmissionQuery(
      Submission.find({ ...buildFilters(req.query), user: req.user._id })
    );
    res.json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get submissions for a problem
// @route   GET /api/submissions/problem/:problemId
exports.getSubmissionsByProblem = async (req, res) => {
  try {
    const filter = { problem: req.params.problemId };
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    const submissions = await populateSubmissionQuery(Submission.find(filter));
    res.json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get submissions for a user
// @route   GET /api/submissions/user/:userId
exports.getSubmissionsByUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const submissions = await populateSubmissionQuery(
      Submission.find({ ...buildFilters(req.query), user: req.params.userId })
    );
    res.json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a submission manually
// @route   POST /api/submissions
exports.createSubmission = async (req, res) => {
  try {
    const { problemId, language, code, status, passedTestCases, totalTestCases, runtime, memory, errorMessage } = req.body;

    if (!problemId || !language || !code || !status) {
      return res.status(400).json({ success: false, message: 'problemId, language, code, and status are required.' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      domain: problem.domain,
      topic: problem.topic,
      language,
      code,
      status,
      passedTestCases: passedTestCases || 0,
      totalTestCases: totalTestCases || 0,
      runtime: runtime || '',
      memory: memory || '',
      errorMessage: errorMessage || ''
    });

    await updateAfterSubmission({
      userId: req.user._id,
      problem,
      status
    });

    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
