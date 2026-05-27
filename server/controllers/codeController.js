const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const {
  runCode,
  runAgainstTestCases
} = require('../services/codeRunnerService');
const { updateAfterSubmission } = require('../services/progressService');

const buildProblemFilter = (user, problemId) => {
  const filter = { _id: problemId };
  if (user.role !== 'admin') {
    filter.isPublished = true;
  }
  return filter;
};

const sanitizeVisibleFailure = (result) => {
  if (!result) {
    return null;
  }

  return {
    input: result.input,
    expectedOutput: result.expectedOutput,
    actualOutput: result.actualOutput,
    status: result.status
  };
};

const toPlainTestCase = (testCase, visibility) => ({
  ...(testCase.toObject ? testCase.toObject() : testCase),
  visibility
});

// @desc    Run code against visible test cases or custom input
// @route   POST /api/code/run
exports.run = async (req, res) => {
  try {
    const { problemId, language, code, customInput } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: 'problemId, language, and code are required.'
      });
    }

    const problem = await Problem.findOne(buildProblemFilter(req.user, problemId));
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    if (problem.problemType !== 'Coding') {
      return res.status(400).json({
        success: false,
        message: 'Run is only supported for coding problems.'
      });
    }

    if (customInput !== undefined && customInput !== null && customInput !== '') {
      const result = await runCode({
        sourceCode: code,
        language,
        stdin: customInput
      });

      return res.json({
        success: true,
        data: {
          stdout: result.stdout,
          stderr: result.stderr,
          compile_output: result.compile_output,
          status: result.status,
          runtime: result.time ? `${result.time}s` : '',
          memory: result.memory,
          testCaseResults: [
            {
              input: customInput,
              actualOutput: result.stdout
            }
          ]
        }
      });
    }

    const execution = await runAgainstTestCases({
      code,
      language,
      testCases: problem.visibleTestCases || []
    });

    const compileOutput = execution.results.find((item) => item.compile_output)?.compile_output || '';
    const stderr = execution.results.find((item) => item.stderr)?.stderr || '';

    res.json({
      success: true,
      data: {
        stdout: execution.results.map((item) => item.actualOutput).join('\n'),
        stderr,
        compile_output: compileOutput,
        status: execution.status,
        runtime: execution.runtime,
        memory: execution.memory,
        testCaseResults: execution.results.map((item) => ({
          input: item.input,
          expectedOutput: item.expectedOutput,
          actualOutput: item.actualOutput,
          passed: item.passed,
          status: item.status,
          runtime: item.runtime,
          memory: item.memory
        }))
      }
    });
  } catch (error) {
    const statusCode =
      error.message.includes('Unsupported language') || error.message.includes('required')
        ? 400
        : error.message.includes('configured')
          ? 500
          : 502;

    res.status(statusCode).json({ success: false, message: error.message });
  }
};

// @desc    Submit code against visible and hidden test cases
// @route   POST /api/code/submit
exports.submit = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: 'problemId, language, and code are required.'
      });
    }

    const problem = await Problem.findOne(buildProblemFilter(req.user, problemId));
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    if (problem.problemType !== 'Coding') {
      return res.status(400).json({
        success: false,
        message: 'Submit is only supported for coding problems.'
      });
    }

    const visibleCases = (problem.visibleTestCases || []).map((testCase) =>
      toPlainTestCase(testCase, 'visible')
    );
    const hiddenCases = (problem.hiddenTestCases || []).map((testCase) =>
      toPlainTestCase(testCase, 'hidden')
    );

    const execution = await runAgainstTestCases({
      code,
      language,
      testCases: [...visibleCases, ...hiddenCases]
    });

    const firstVisibleFailure = execution.results.find(
      (item, index) => !item.passed && [...visibleCases, ...hiddenCases][index]?.visibility === 'visible'
    );
    const firstExecutionFailure = execution.results.find(
      (item) => item.status === 'Compilation Error' || item.status === 'Runtime Error' || item.status === 'Time Limit Exceeded'
    );

    const submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      domain: problem.domain,
      topic: problem.topic,
      language,
      code,
      status: execution.status,
      passedTestCases: execution.passedCount,
      totalTestCases: execution.totalCount,
      runtime: execution.runtime,
      memory: execution.memory,
      errorMessage:
        firstExecutionFailure?.compile_output ||
        firstExecutionFailure?.stderr ||
        (execution.status === 'Wrong Answer' ? 'Wrong Answer' : '')
    });

    await updateAfterSubmission({
      userId: req.user._id,
      problem,
      status: execution.status
    });

    res.json({
      success: true,
      data: {
        submissionId: submission._id,
        status: execution.status,
        passedTestCases: execution.passedCount,
        totalTestCases: execution.totalCount,
        failedTestCase: sanitizeVisibleFailure(firstVisibleFailure),
        runtime: execution.runtime,
        memory: execution.memory
      }
    });
  } catch (error) {
    const statusCode =
      error.message.includes('Unsupported language') || error.message.includes('required')
        ? 400
        : error.message.includes('configured')
          ? 500
          : 502;

    res.status(statusCode).json({ success: false, message: error.message });
  }
};
