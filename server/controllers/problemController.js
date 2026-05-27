const Problem = require('../models/Problem');
const UserProgress = require('../models/UserProgress');

const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseList = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : value.split(',').map((item) => item.trim());
    } catch (error) {
      return value.split(',').map((item) => item.trim());
    }
  }

  return [];
};

const cleanProblemPayload = (body = {}, { partial = false } = {}) => {
  const getValue = (field, fallback = '') => {
    if (partial && body[field] === undefined) {
      return undefined;
    }
    return body[field] ?? fallback;
  };

  const getList = (field, mapper = (value) => value) => {
    if (partial && body[field] === undefined) {
      return undefined;
    }
    return parseList(body[field]).map(mapper);
  };

  const getCodeObject = (field) => {
    if (partial && body[field] === undefined) {
      return undefined;
    }

    return {
      java: body[field]?.java || '',
      python: body[field]?.python || '',
      cpp: body[field]?.cpp || '',
      javascript: body[field]?.javascript || ''
    };
  };

  return {
    title: getValue('title')?.trim(),
    slug: getValue('slug')?.trim(),
    domain: getValue('domain', body.domainId) || body.domainId,
    phase: getValue('phase', body.phaseId ?? null) || body.phaseId || null,
    topic: getValue('topic')?.trim(),
    difficulty: getValue('difficulty', undefined),
    problemType: getValue('problemType', undefined),
    description: getValue('description', ''),
    inputFormat: getValue('inputFormat', ''),
    outputFormat: getValue('outputFormat', ''),
    constraints: getValue('constraints', ''),
    examples: getList('examples', (example) => ({
      input: example.input || '',
      output: example.output || '',
      explanation: example.explanation || ''
    })),
    visibleTestCases: getList('visibleTestCases', (testCase) => ({
      input: testCase.input || '',
      expectedOutput: testCase.expectedOutput || '',
      explanation: testCase.explanation || ''
    })),
    hiddenTestCases: getList('hiddenTestCases', (testCase) => ({
      input: testCase.input || '',
      expectedOutput: testCase.expectedOutput || '',
      explanation: testCase.explanation || ''
    })),
    starterCode: getCodeObject('starterCode'),
    functionSignature: getCodeObject('functionSignature'),
    expectedComplexity: getValue('expectedComplexity', ''),
    hints: getList('hints', (hint) => hint)?.filter(Boolean),
    editorial: getValue('editorial', ''),
    tags: getList('tags', (tag) => tag)?.filter(Boolean),
    relatedResources: getList('relatedResources', (resource) => ({
      title: resource.title || '',
      url: resource.url || '',
      type: resource.type || 'reference'
    })),
    isPublished:
      partial && body.isPublished === undefined
        ? undefined
        : body.isPublished === true || body.isPublished === 'true'
  };
};

const validateProblemPayload = (payload) => {
  const errors = [];

  if (!payload.title) errors.push('Title is required.');
  if (!payload.domain) errors.push('Domain is required.');
  if (!payload.topic) errors.push('Topic is required.');
  if (!payload.difficulty) errors.push('Difficulty is required.');
  if (!payload.problemType) errors.push('Problem type is required.');
  if (!payload.description) errors.push('Description is required.');

  if (payload.problemType === 'Coding') {
    if (!payload.visibleTestCases.length) {
      errors.push('At least one visible test case is required for coding problems.');
    }
    if (!payload.hiddenTestCases.length) {
      errors.push('At least one hidden test case is required for coding problems.');
    }
  }

  return errors;
};

const buildUserStatusMap = async (userId) => {
  if (!userId) {
    return { solved: new Set(), attempted: new Set() };
  }

  const progress = await UserProgress.findOne({ user: userId })
    .select('solvedProblems attemptedProblems')
    .lean();

  return {
    solved: new Set((progress?.solvedProblems || []).map((id) => id.toString())),
    attempted: new Set((progress?.attemptedProblems || []).map((id) => id.toString()))
  };
};

const serializeProblem = (problem, { isAdmin = false, statusMap } = {}) => {
  const data = problem.toObject ? problem.toObject() : { ...problem };
  const problemId = data._id.toString();

  if (statusMap) {
    data.userStatus = statusMap.solved.has(problemId)
      ? 'solved'
      : statusMap.attempted.has(problemId)
        ? 'attempted'
        : 'unsolved';
  }

  if (!isAdmin) {
    delete data.hiddenTestCases;
  }

  return data;
};

// @desc    Get problems with filters
// @route   GET /api/problems
exports.getProblems = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const filter = {};

    if (!isAdmin) {
      filter.isPublished = true;
    } else if (req.query.isPublished === 'true' || req.query.isPublished === 'false') {
      filter.isPublished = req.query.isPublished === 'true';
    }

    if (req.query.domainId) filter.domain = req.query.domainId;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.problemType) filter.problemType = req.query.problemType;
    if (req.query.topic) filter.topic = new RegExp(escapeRegExp(req.query.topic), 'i');
    if (req.query.tags) filter.tags = { $in: parseList(req.query.tags) };
    if (req.query.search) {
      const regex = new RegExp(escapeRegExp(req.query.search), 'i');
      filter.$or = [{ title: regex }, { topic: regex }, { tags: regex }];
    }

    const problems = await Problem.find(filter)
      .populate('domain', 'name slug')
      .populate('phase', 'name phaseNumber')
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    const statusMap = await buildUserStatusMap(req.user?._id);
    let data = problems.map((problem) => serializeProblem(problem, { isAdmin, statusMap }));

    if (req.query.status === 'solved') {
      data = data.filter((problem) => problem.userStatus === 'solved');
    } else if (req.query.status === 'unsolved') {
      data = data.filter((problem) => problem.userStatus !== 'solved');
    }

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single problem by slug
// @route   GET /api/problems/:slug
exports.getProblemBySlug = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const filter = { slug: req.params.slug };
    if (!isAdmin) {
      filter.isPublished = true;
    }

    const problem = await Problem.findOne(filter)
      .populate('domain', 'name slug icon color')
      .populate('phase', 'name phaseNumber')
      .populate('createdBy', 'fullName');

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const statusMap = await buildUserStatusMap(req.user?._id);
    const data = serializeProblem(problem, { isAdmin, statusMap });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a problem
// @route   POST /api/problems
exports.createProblem = async (req, res) => {
  try {
    const payload = cleanProblemPayload(req.body);
    const errors = validateProblemPayload(payload);

    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(' ') });
    }

    const problem = await Problem.create({
      ...payload,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a problem
// @route   PUT /api/problems/:id
exports.updateProblem = async (req, res) => {
  try {
    const existingProblem = await Problem.findById(req.params.id);
    if (!existingProblem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const partialPayload = cleanProblemPayload(req.body, { partial: true });
    const payload = {
      ...existingProblem.toObject(),
      ...Object.fromEntries(
        Object.entries(partialPayload).filter(([, value]) => value !== undefined)
      )
    };
    const errors = validateProblemPayload(payload);

    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(' ') });
    }

    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      {
        $set: Object.fromEntries(
          Object.entries(partialPayload).filter(([, value]) => value !== undefined)
        )
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a problem
// @route   DELETE /api/problems/:id
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    res.json({ success: true, message: 'Problem deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get problems by domain
// @route   GET /api/problems/domain/:domainId
exports.getProblemsByDomain = async (req, res) => {
  req.query.domainId = req.params.domainId;
  return exports.getProblems(req, res);
};

// @desc    Get problems by topic
// @route   GET /api/problems/topic/:topicName
exports.getProblemsByTopic = async (req, res) => {
  req.query.topic = req.params.topicName;
  return exports.getProblems(req, res);
};
