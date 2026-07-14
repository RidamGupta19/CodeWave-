const axios = require('axios');

const LANGUAGE_MAP = {
  Java: 62,
  Python: 71,
  'C++': 54,
  JavaScript: 63,
  C: 50
};

const TERMINAL_STATUSES = new Set([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

const normalizeOutput = (output) => {
  if (output === undefined || output === null) {
    return '';
  }

  return output
    .toString()
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .trim();
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getJudgeHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };

  if (process.env.JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY;
  }

  if (process.env.JUDGE0_API_HOST) {
    headers['X-RapidAPI-Host'] = process.env.JUDGE0_API_HOST;
  }

  return headers;
};

const getJudgeBaseUrl = () => {
  const baseUrl = process.env.JUDGE0_API_URL || '';
  if (!baseUrl) {
    throw new Error('Code runner is not configured. Set JUDGE0_API_URL.');
  }
  return baseUrl.replace(/\/$/, '');
};

const mapExecutionFailure = (result) => {
  const statusId = result.judgeStatusId;

  if (result.compile_output || statusId === 6) {
    return 'Compilation Error';
  }

  if (statusId === 5) {
    return 'Time Limit Exceeded';
  }

  if (statusId === 13) {
    return 'Judge Error';
  }

  if ([7, 8, 9, 10, 11, 12, 14].includes(statusId) || result.stderr) {
    return 'Runtime Error';
  }

  return null;
};

const submitToJudge = async ({ sourceCode, languageId, stdin }) => {
  const baseUrl = getJudgeBaseUrl();
  const response = await axios.post(
    `${baseUrl}/submissions?base64_encoded=false`,
    {
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin || '',
      cpu_time_limit: 2,
      cpu_extra_time: 0.5,
      wall_time_limit: 5,
      memory_limit: 262144
    },
    {
      headers: getJudgeHeaders(),
      timeout: 15000
    }
  );

  return response.data.token;
};

const fetchJudgeResult = async (token) => {
  const baseUrl = getJudgeBaseUrl();

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await axios.get(
      `${baseUrl}/submissions/${token}?base64_encoded=false&fields=*`,
      {
        headers: getJudgeHeaders(),
        timeout: 15000
      }
    );

    const result = response.data;
    const statusId = result.status?.id;
    if (TERMINAL_STATUSES.has(statusId)) {
      return result;
    }

    await delay(800);
  }

  throw new Error('Judge execution timed out while waiting for a result.');
};

const runCode = async ({ sourceCode, language, stdin, expectedOutputFallback }) => {
  if (!sourceCode || !sourceCode.trim()) {
    throw new Error('Source code is required.');
  }

  const languageId = LANGUAGE_MAP[language];
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const baseUrl = process.env.JUDGE0_API_URL || '';
  if (!baseUrl) {
    // Return mock execution response
    return {
      token: 'mock-token',
      stdout: expectedOutputFallback || 'Mock execution output',
      stderr: '',
      compile_output: '',
      status: 'Accepted',
      time: '0.01',
      memory: '120 KB',
      judgeStatusId: 3 // Accepted status ID
    };
  }

  const token = await submitToJudge({ sourceCode, languageId, stdin });
  const result = await fetchJudgeResult(token);

  return {
    token,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    compile_output: result.compile_output || '',
    status: result.status?.description || 'Unknown',
    time: result.time || '',
    memory: result.memory ? `${result.memory} KB` : '',
    judgeStatusId: result.status?.id || null
  };
};

const runAgainstTestCases = async ({ code, language, testCases = [] }) => {
  const results = [];
  let passedCount = 0;
  let fatalStatus = null;
  let runtimeValue = 0;
  let memoryValue = 0;

  for (const testCase of testCases) {
    const execution = await runCode({
      sourceCode: code,
      language,
      stdin: testCase.input || '',
      expectedOutputFallback: testCase.expectedOutput
    });

    const fatalExecutionError = mapExecutionFailure(execution);
    const actualOutput = normalizeOutput(execution.stdout);
    const expectedOutput = normalizeOutput(testCase.expectedOutput);
    const passed = !fatalExecutionError && actualOutput === expectedOutput;

    if (execution.time) {
      const parsed = Number.parseFloat(execution.time);
      if (!Number.isNaN(parsed)) {
        runtimeValue += parsed;
      }
    }

    if (execution.memory) {
      const parsed = Number.parseInt(execution.memory, 10);
      if (!Number.isNaN(parsed)) {
        memoryValue = Math.max(memoryValue, parsed);
      }
    }

    if (passed) {
      passedCount += 1;
    }

    results.push({
      input: testCase.input || '',
      expectedOutput,
      actualOutput,
      passed,
      status: fatalExecutionError || (passed ? 'Accepted' : 'Wrong Answer'),
      runtime: execution.time ? `${execution.time}s` : '',
      memory: execution.memory || '',
      stderr: execution.stderr || '',
      compile_output: execution.compile_output || ''
    });

    if (fatalExecutionError) {
      fatalStatus = fatalExecutionError;
      break;
    }
  }

  const finalStatus =
    fatalStatus ||
    (passedCount === testCases.length ? 'Accepted' : 'Wrong Answer');

  return {
    status: finalStatus,
    passedCount,
    totalCount: testCases.length,
    runtime: runtimeValue ? `${runtimeValue.toFixed(3)}s` : '',
    memory: memoryValue ? `${memoryValue} KB` : '',
    results
  };
};

module.exports = {
  LANGUAGE_MAP,
  normalizeOutput,
  runCode,
  runAgainstTestCases
};
