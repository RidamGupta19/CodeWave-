export const DSA_LEVELS = [
  'Programming Foundations',
  'Arrays Explorer',
  'Hashing Hunter',
  'Recursion Survivor',
  'Linked List Warrior',
  'Stack & Queue Master',
  'Tree Master',
  'Graph Adventurer',
  'Dynamic Programming Beast',
  'Greedy Strategist',
  'Placement Challenger'
];

export const DSA_LANGUAGE_LABELS = {
  cpp: 'C++',
  java: 'Java',
  python: 'Python',
  javascript: 'JavaScript',
  js: 'JavaScript'
};

export const DSA_BADGES = [
  { minLevel: 0, name: 'Beginner Warrior' },
  { minLevel: 1, name: 'Array Rookie' },
  { minLevel: 3, name: 'Recursion Survivor' },
  { minLevel: 6, name: 'Tree Explorer' },
  { minLevel: 7, name: 'Graph Master' },
  { minLevel: 8, name: 'DP Beast' },
  { minLevel: 10, name: 'Placement Ready' }
];

export const normalizeDsaLanguage = (language) => {
  if (language === 'js') return 'javascript';
  return language || 'cpp';
};

export const getStreakRank = (streak = 0) => {
  if (streak >= 120) return { name: 'Legendary Coder', next: 'Maintain your legendary rhythm', color: 'text-fuchsia-500' };
  if (streak >= 60) return { name: 'Platinum', next: '120-day legendary streak', color: 'text-cyan-500' };
  if (streak >= 30) return { name: 'Gold', next: '60-day platinum streak', color: 'text-amber-500' };
  if (streak >= 5) return { name: 'Bronze', next: '30-day silver streak', color: 'text-orange-500' };
  return { name: 'Rookie', next: `${Math.max(5 - streak, 1)} days to Bronze`, color: 'text-indigo-500' };
};

export const getDsaBadgeForLevel = (level = 0) => {
  return [...DSA_BADGES].reverse().find((badge) => level >= badge.minLevel) || DSA_BADGES[0];
};

const hasKnown = (answers, topic) => (answers.dsa_known_topics || []).includes(topic);

export const analyzeDsaProfile = (answers = {}) => {
  const language = normalizeDsaLanguage(answers.dsa_language);
  const dailyTime = Number(answers.daily_time || 60);
  const solvedBefore = answers.dsa_problem_experience || 'never';
  const codingExperience = answers.coding_experience || 'never';
  const knownTopics = answers.dsa_known_topics || [];
  const goal = answers.goal || 'placements';

  let score = 0;
  if (codingExperience === 'basic') score += 1;
  if (codingExperience === 'some_problems') score += 2;
  if (codingExperience === 'comfortable') score += 3;
  if (hasKnown(answers, 'variables')) score += 1;
  if (hasKnown(answers, 'loops')) score += 1;
  if (hasKnown(answers, 'functions')) score += 1;
  if (hasKnown(answers, 'arrays')) score += 2;
  if (hasKnown(answers, 'recursion')) score += 2;
  if (solvedBefore === 'beginner') score += 1;
  if (solvedBefore === 'some_leetcode') score += 3;
  if (solvedBefore === 'regular') score += 5;

  let startingLevel = 0;
  let startReason = 'Start from printing and input/output so syntax never becomes a hidden blocker.';
  if (score >= 10) {
    startingLevel = 3;
    startReason = 'You already have coding reps, arrays, and recursion exposure, so foundations become a quick review.';
  } else if (score >= 7) {
    startingLevel = 2;
    startReason = 'Your basics are strong enough to move directly into hashing after a short arrays warm-up.';
  } else if (score >= 4 || (hasKnown(answers, 'loops') && hasKnown(answers, 'functions'))) {
    startingLevel = 1;
    startReason = 'You know enough programming basics to skip the slowest intro lessons and begin with arrays.';
  }

  const roadmapType = startingLevel >= 2 || solvedBefore === 'regular' ? 'Fast-Track' : 'Beginner Roadmap';
  const recommendedPace = dailyTime >= 120 ? 'Sprint Pace' : dailyTime >= 60 ? 'Steady Pace' : 'Micro-Learning Pace';
  const timeline = dailyTime >= 120
    ? (roadmapType === 'Fast-Track' ? '10-12 weeks' : '4-5 months')
    : dailyTime >= 60
      ? (roadmapType === 'Fast-Track' ? '4-5 months' : '6-7 months')
      : (roadmapType === 'Fast-Track' ? '6-8 months' : '9-10 months');

  const goalCopy = {
    placements: 'placement interview readiness',
    internship: 'internship screening confidence',
    problem_solving: 'clear problem-solving muscle',
    competitive: 'competitive programming foundations'
  };

  const weakTopics = [];
  if (!hasKnown(answers, 'recursion')) weakTopics.push('Recursion');
  if (!hasKnown(answers, 'arrays')) weakTopics.push('Arrays');
  if (knownTopics.length <= 2) weakTopics.push('Programming Foundations');

  const strongestTopic = hasKnown(answers, 'arrays') ? 'Arrays' : hasKnown(answers, 'functions') ? 'Functions' : 'Fresh Start';

  return {
    language,
    languageLabel: DSA_LANGUAGE_LABELS[language] || 'C++',
    skillLevel: score >= 10 ? 'intermediate' : score >= 5 ? 'builder' : 'beginner',
    startingLevel,
    startLevelName: DSA_LEVELS[startingLevel],
    roadmapType,
    recommendedPace,
    estimatedTimeline: timeline,
    startReason,
    strongestTopic,
    weakTopics: weakTopics.slice(0, 3),
    unlockedLevels: DSA_LEVELS.map((name, index) => ({ name, index, unlocked: index <= startingLevel })),
    aiSummary: `You are starting at Level ${startingLevel}: ${DSA_LEVELS[startingLevel]} in ${DSA_LANGUAGE_LABELS[language] || 'C++'}. This is a ${roadmapType.toLowerCase()} tuned for ${goalCopy[goal] || 'DSA mastery'} with a ${recommendedPace.toLowerCase()} timeline of ${timeline}. ${startReason}`
  };
};

export const getLessonAssessment = (topicTitle = '', language = 'cpp') => {
  const title = topicTitle.toLowerCase();
  const langLabel = DSA_LANGUAGE_LABELS[normalizeDsaLanguage(language)] || 'C++';

  if (title.includes('array')) {
    return [
      { type: 'MCQ', prompt: 'What is the time complexity of reading arr[i] by index?', answer: 'O(1)' },
      { type: 'Output', prompt: 'For arr = [2, 4, 6], what does arr[1] return?', answer: '4' },
      { type: 'Task', prompt: `Write a ${langLabel} loop that visits every element once.`, answer: 'Use a single for loop from 0 to n - 1.' }
    ];
  }

  if (title.includes('recursion')) {
    return [
      { type: 'MCQ', prompt: 'What must every recursive solution include?', answer: 'A base case.' },
      { type: 'Output', prompt: 'If factorial(3) = 3 * factorial(2), what is factorial(1)?', answer: '1' },
      { type: 'Task', prompt: 'Name one sign that recursion may cause stack overflow.', answer: 'No reachable base case or too much recursion depth.' }
    ];
  }

  if (title.includes('hash')) {
    return [
      { type: 'MCQ', prompt: 'Which structure is commonly used for frequency counting?', answer: 'Hash map.' },
      { type: 'Output', prompt: 'For nums = [1, 1, 2], frequency of 1 is?', answer: '2' },
      { type: 'Task', prompt: `Describe one ${langLabel} data structure for key-value lookup.`, answer: 'unordered_map, HashMap, dict, or Map.' }
    ];
  }

  return [
    { type: 'MCQ', prompt: 'Why do we dry run code before submitting?', answer: 'To catch logic and edge-case mistakes early.' },
    { type: 'Output', prompt: 'If x = 5 and x = x + 2, what is x?', answer: '7' },
    { type: 'Task', prompt: `Write the smallest ${langLabel} function that returns a value.`, answer: 'A function with a return statement.' }
  ];
};
