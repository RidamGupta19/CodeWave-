const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');

// Helper function to map database slugs to domainsProgress keys
const getProgressKey = (slug) => {
  if (!slug) return 'dsa';
  const lowercaseSlug = slug.toLowerCase();
  if (lowercaseSlug === 'web-development' || lowercaseSlug === 'webdev') return 'webdev';
  if (lowercaseSlug === 'open-source' || lowercaseSlug === 'opensource') return 'opensource';
  if (lowercaseSlug === 'devops') return 'devops';
  if (lowercaseSlug === 'dsa') return 'dsa';
  if (lowercaseSlug.includes('web') || lowercaseSlug.includes('ui-ux')) return 'webdev';
  if (lowercaseSlug.includes('open') || lowercaseSlug.includes('git')) return 'opensource';
  if (lowercaseSlug.includes('dsa') || lowercaseSlug.includes('data')) return 'dsa';
  return 'devops';
};

// @desc    Calculate performance insights dynamically for a user
const calculatePerformanceInsights = async (userId) => {
  const user = await User.findById(userId)
    .populate('activeDomain');

  if (!user) return null;

  const domain = user.activeDomain?.name || 'No domain selected';
  const domainSlug = user.activeDomain?.slug || 'web-development';
  const key = getProgressKey(domainSlug);
  const domainProgress = user.domainsProgress[key] || {
    xp: 0,
    currentPhase: 1,
    overallProgress: 0,
    completedTopics: [],
    weakConcepts: [],
    dsaStats: {}
  };

  const xp = domainProgress.xp || 0;
  const streak = user.dailyStreak || 0;
  const progress = domainProgress.overallProgress || 0;
  const phase = domainProgress.currentPhase || 0;
  const completedCount = domainProgress.completedTopics?.length || 0;
  
  // Programming Language preference
  const preferredLang = user.profile?.onboardingAnswers?.dsa_language || 
                        (user.profile?.onboardingAnswers?.technologies && user.profile.onboardingAnswers.technologies.length > 0 ? user.profile.onboardingAnswers.technologies[0] : 'JavaScript');

  // 1. Weak Topics Identification
  let weakTopics = [];
  if (domainProgress.dsaStats?.weakestTopic) {
    weakTopics.push(domainProgress.dsaStats.weakestTopic);
  }
  
  // Add weak concepts
  if (domainProgress.weakConcepts && domainProgress.weakConcepts.length > 0) {
    domainProgress.weakConcepts.forEach(c => {
      if (!weakTopics.includes(c)) weakTopics.push(c);
    });
  }

  // Populate completed topics title/details for checking confidence
  for (const t of (domainProgress.completedTopics || [])) {
    if (t.confidenceLevel <= 2 || t.difficultyFeedback === 'hard' || t.revisionNeeded) {
      const topicObj = await Topic.findById(t.topicId);
      if (topicObj && topicObj.title && !weakTopics.includes(topicObj.title)) {
        weakTopics.push(topicObj.title);
      }
    }
  }

  if (weakTopics.length === 0) {
    if (domainSlug === 'dsa') {
      weakTopics.push('Recursion Foundations');
    } else {
      weakTopics.push('Flexbox & Grid Alignment');
    }
  }

  // 2. Strong Topics Identification
  let strongTopics = [];
  if (domainProgress.dsaStats?.strongestTopic) {
    strongTopics.push(domainProgress.dsaStats.strongestTopic);
  }
  
  for (const t of (domainProgress.completedTopics || [])) {
    if (t.confidenceLevel >= 4 || t.difficultyFeedback === 'easy') {
      const topicObj = await Topic.findById(t.topicId);
      if (topicObj && topicObj.title && !strongTopics.includes(topicObj.title)) {
        strongTopics.push(topicObj.title);
      }
    }
  }

  if (strongTopics.length === 0) {
    if (domainSlug === 'dsa') {
      strongTopics.push('Array Traversal');
    } else {
      strongTopics.push('HTML Structure');
    }
  }

  // 3. Consistency Index based on active log
  const activeDaysLast14 = user.activityLog?.filter(log => {
    if (!log.date) return false;
    const logDate = new Date(log.date);
    const diffTime = Math.abs(new Date() - logDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 14;
  }).length || 0;

  let consistency = 'Needs Focus';
  if (activeDaysLast14 >= 5) consistency = 'Exceptional';
  else if (activeDaysLast14 >= 3) consistency = 'Moderate';

  // 4. Assessment Standing
  const tests = domainProgress.testResults || [];
  const passedTests = tests.filter(t => t.passed).length;
  const totalTestsAttempted = tests.length;
  const avgScore = totalTestsAttempted > 0 
    ? Math.round(tests.reduce((acc, curr) => acc + curr.score, 0) / totalTestsAttempted) 
    : 0;

  // 5. Internship / Job Readiness %
  let readinessPercent = Math.round((progress * 0.5) + (passedTests * 12) + (streak * 2));
  if (domainSlug === 'dsa') {
    const solved = domainProgress.dsaStats?.totalProblemsSolved || 0;
    readinessPercent = Math.round((progress * 0.4) + (Math.min(solved, 100) / 100 * 30) + (passedTests * 10) + (streak * 2));
  }
  readinessPercent = Math.min(Math.max(readinessPercent, 15), 98); // bounds 15% to 98%

  // 6. Actionable recommendations & insights
  const recommendations = [];
  const insights = [];

  if (domainSlug === 'dsa') {
    const solved = domainProgress.dsaStats?.totalProblemsSolved || 0;
    if (solved < 15) {
      recommendations.push("Solve at least 2 basic Array/String problems daily to build basic pattern memory.");
      insights.push("You're strongest in Arrays");
    } else {
      recommendations.push(`Incredible progress with ${solved} problems! Tackle advanced Stack/Queue operations next.`);
      insights.push(`You're progressing faster than expected in Algorithm logic.`);
    }

    if (weakTopics.includes('Recursion Foundations') || weakTopics.includes('Recursion')) {
      recommendations.push("Draw out recursive trees on paper for small inputs (e.g. fibonacci of 4) to trace stack frames.");
      insights.push("Recursion needs revision");
    } else {
      insights.push(`${weakTopics[0]} needs targeted revision this week.`);
    }
  } else {
    if (completedCount < 4) {
      recommendations.push("Complete HTML grid structure lessons to master standard viewport layouts.");
      insights.push("Focus on consistency this week");
    } else {
      recommendations.push("Initiate reusable Component architectures using custom UI variables.");
      insights.push("You're progressing faster than expected in styling layouts.");
    }
    
    if (weakTopics.length > 0) {
      insights.push(`${weakTopics[0]} needs revision`);
    }
  }

  if (streak < 3) {
    recommendations.push("Set a quick micro-goal: spend just 15 minutes today printing simple statements to restore your daily streak.");
  } else {
    insights.push(`Streak is burning bright at ${streak} days!`);
  }

  insights.push(`You are ${readinessPercent}% closer to internship readiness`);

  return {
    domain,
    domainSlug,
    xp,
    streak,
    progress,
    phase,
    completedCount,
    preferredLang,
    strongestTopic: strongTopics[0],
    weakestTopic: weakTopics[0],
    consistency,
    activeDaysLast14,
    avgScore,
    totalTestsAttempted,
    readinessPercent,
    insights,
    recommendations,
    onboardingAnswers: user.profile?.onboardingAnswers || {}
  };
};

// Generate highly custom, data-driven answers when no real AI keys are configured
const generateMockResponse = (userMessage, ins) => {
  const lowerMsg = userMessage.toLowerCase();

  // 1. Analyze performance / Weak topics
  if (lowerMsg.includes('weak') || lowerMsg.includes('improve') || lowerMsg.includes('performance') || lowerMsg.includes('analyze')) {
    return `Your metrics show **${ins.weakestTopic}** needs attention, while you're solid in **${ins.strongestTopic}**. 

What specifically feels tricky about ${ins.weakestTopic}: tracing variables, understanding the base cases, or writing the code?`;
  }

  // 2. What should I learn next
  if (lowerMsg.includes('learn next') || lowerMsg.includes('next step') || lowerMsg.includes('what should i learn')) {
    return `You've completed ${ins.completedCount} lessons in Phase ${ins.phase} of **${ins.domain}**.

Ready to open the next node on your Mission Map, or do you want to review ${ins.weakestTopic} first?`;
  }

  // 3. Weekly study plan / Schedule
  if (lowerMsg.includes('weekly') || lowerMsg.includes('plan') || lowerMsg.includes('schedule')) {
    return `Let's keep it simple: 15 mins of theory for **${ins.weakestTopic}** tomorrow, then tackle a new challenge in Phase ${ins.phase} on Wednesday. 

Does this pace work for you, or do you need a faster track?`;
  }

  // 4. Suggest a project
  if (lowerMsg.includes('project') || lowerMsg.includes('suggest a project')) {
    if (ins.domainSlug === 'dsa') {
      return `For DSA, let's build a mini **Recursion Tree Visualizer** in ${ins.preferredLang} to help you trace recursion depths.

Would you like to build that, or do you want a web-based game project?`;
    } else {
      return `For Web Dev, how about a **CSS Custom Theme Dashboard** with soft glassmorphism and real-time HSL color triggers?

Does that sound exciting, or would you prefer a portfolio landing page?`;
    }
  }

  // 5. Internship readiness
  if (lowerMsg.includes('readiness') || lowerMsg.includes('internship') || lowerMsg.includes('job')) {
    return `Your placement readiness score is at **${ins.readinessPercent}%**. We want to push that to 85%+ before you start applying.

Should we focus on clearing your pending assessments or solving more coding checkpoints first?`;
  }

  // 6. Where to start / Onboarding analysis
  if (lowerMsg.includes('start') || lowerMsg.includes('how to start') || lowerMsg.includes('where to start') || lowerMsg.includes('onboarding')) {
    if (lowerMsg.includes('domain') || lowerMsg.includes('choose') || lowerMsg.includes('select') || lowerMsg.includes('which') || lowerMsg.includes('what')) {
      // Fall through to domain check
    } else {
      return `Welcome! To start, open Level ${ins.phase} on your [Mission Map](file:///roadmap). I recommend checking the first video, tracing the call stack, and writing the checkpoint code.

What language are you hoping to use today?`;
    }
  }

  // 6.5. Domain choice questions
  if (lowerMsg.includes('domain') && (lowerMsg.includes('choose') || lowerMsg.includes('select') || lowerMsg.includes('which') || lowerMsg.includes('start') || lowerMsg.includes('what'))) {
    return `You're currently set to **${ins.domain}** with ${ins.preferredLang}. 

Tell me, what is your primary goal: building visual websites/apps, cracking technical DSA interviews, or just exploring coding?`;
  }

  // 7. ChatGPT style fallback for general questions
  if (!lowerMsg.includes('weak') && !lowerMsg.includes('learn next') && !lowerMsg.includes('weekly') && !lowerMsg.includes('project') && !lowerMsg.includes('readiness') && !lowerMsg.includes('internship') && !lowerMsg.includes('job')) {
    if (lowerMsg.length < 10) {
      return `Hey! I'm Code Guru, your coding companion. What concepts or challenges are you exploring today?`;
    }

    return `Got it! Usually, the best way to tackle this is to write a small test script and print the outputs. 

Do you want to write a quick experiment in the sandbox, or do you want me to explain this concept step-by-step?`;
  }

  // 8. Default fallback
  return `Hey there! Code Guru here. Currently tracking your progress in Phase ${ins.phase} of **${ins.domain}**.

What's on your mind: roadmap strategy, performance insights, or code help?`;
};

// @desc    Chat with AI career agent
// @route   POST /api/ai/chat
exports.chat = async (req, res) => {
  try {
    const { message, codeContext, language, currentError } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Save user message
    await ChatMessage.create({ userId: req.user._id, role: 'user', content: message });

    // Calculate actual data-driven performance insights
    const insights = await calculatePerformanceInsights(req.user._id);

    let aiResponse;

    // Try real AI API if configured
    if (process.env.AI_API_KEY && process.env.AI_API_KEY.length > 10) {
      try {
        const isGemini = process.env.AI_API_URL.includes('generativelanguage.googleapis.com');
        
        let url = process.env.AI_API_URL;
        let body;
        let headers = { 'Content-Type': 'application/json' };

        const onboardingSummary = user.profile?.onboardingAnswers 
          ? Object.entries(user.profile.onboardingAnswers)
              .filter(([k]) => k !== 'dsaAnalysis')
              .map(([key, val]) => `- ${key.replace(/_/g, ' ')}: ${Array.isArray(val) ? val.join(', ') : val}`)
              .join('\n')
          : 'None provided';

        const systemInstructions = `You are Code Guru, a smart, humanized senior developer friend, supportive guide, and interactive coding mentor for engineering students.
        
        CRITICAL CONVERSATION RULES:
        1. Keep responses extremely short: 2 to 6 lines maximum by default. Never dump giant explanations or write blog posts. Only provide deep explanations if specifically asked.
        2. Speak in a natural, casual, human conversational flow (like a real chat on Slack/Discord). Avoid robotic or over-structured markdown headers (no giant ### sections unless necessary).
        3. Make the user interact continuously: ALWAYS end your response with a short, natural follow-up or preference-based question (e.g. asking which option they prefer, what their goal is, or what is blocking them).
        4. Guide the user step-by-step using back-and-forth interaction instead of dumping all information at once.
        5. Naturally reference their metrics when relevant (streaks, preferred language, progress, weak topics) to personalize the chat. Celebrate their streaks, react to progress, or tease them gently on inconsistency (e.g., if streak is 0, tease them or tell them to solve 1 challenge). Do NOT repeat metrics redundantly.
        
        Student's context:
        - Domain: ${insights.domain} (Lvl ${insights.phase}, Progress ${insights.progress}%)
        - Streak: ${insights.streak} days (Consistency: ${insights.consistency})
        - Learning Language: ${insights.preferredLang}
        
        Current Editor Context (if applicable):
        - Code Language: ${language || 'None provided'}
        - User's Code: \n\`\`\`\n${codeContext || 'No code provided'}\n\`\`\`
        - Current Compiler Error: ${currentError || 'None'}
        
        If the user asks for help with an error or code, reference specific line numbers from the provided code. Suggest approaches and hint at the solution without giving away the complete final code immediately.
        
        Examples of style:
        - If they ask "what domain should I choose", reply with: "You already started with ${insights.preferredLang}. What interests you more: Web Dev, AI, placements, or app dev?"
        - If their streak is 0: "Hey, streak is at 0 days! Let's write 5 lines of code today to start the fire. What's holding you back?"
        - Keep formatting light: casual lists or brief bullet points. Avoid sounding like a textbook.`;

        if (isGemini) {
          url = `${process.env.AI_API_URL}?key=${process.env.AI_API_KEY}`;
          body = JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemInstructions}\n\nUser Message: ${message}`
              }]
            }],
            generationConfig: {
              maxOutputTokens: 2048,
              temperature: 0.7,
              thinkingConfig: {
                thinkingBudget: 0
              }
            }
          });
        } else {
          headers['Authorization'] = `Bearer ${process.env.AI_API_KEY}`;
          body = JSON.stringify({
            model: process.env.AI_MODEL || 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemInstructions },
              { role: 'user', content: message }
            ],
            max_tokens: 2048,
            temperature: 0.7
          });
        }

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body
        });

        const data = await response.json();
        
        if (isGemini) {
          aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || generateMockResponse(message, insights);
        } else {
          aiResponse = data.choices?.[0]?.message?.content || generateMockResponse(message, insights);
        }
      } catch (apiError) {
        console.log('AI API error, using mock:', apiError.message);
        aiResponse = generateMockResponse(message, insights);
      }
    } else {
      aiResponse = generateMockResponse(message, insights);
    }

    // Save AI response
    await ChatMessage.create({
      userId: req.user._id,
      role: 'assistant',
      content: aiResponse,
      metadata: { domainContext: insights.domain, progressContext: `${insights.progress}%` }
    });

    res.json({ success: true, data: { message: aiResponse } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get real-time dynamic performance analysis dashboard
// @route   GET /api/ai/performance-insights
exports.getPerformanceInsights = async (req, res) => {
  try {
    const insights = await calculatePerformanceInsights(req.user._id);
    if (!insights) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate personalized roadmap based on onboarding answers
// @route   POST /api/ai/generate-roadmap
exports.generateRoadmap = async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user._id;
    let startingLevel = 0;
    let unlockedLevels = [0];
    let xpMultiplier = 1.0;

    if (!answers) {
      return res.status(400).json({ success: false, message: 'Onboarding answers are required' });
    }

    const user = await User.findById(userId).populate('activeDomain');
    const domainSlug = user.activeDomain?.slug || 'web-development';
    const key = getProgressKey(domainSlug);

    const experience = (domainSlug === 'dsa')
      ? (answers.dsa_problem_experience || 'beginner')
      : (domainSlug === 'web-development' || domainSlug === 'webdev')
        ? (answers.web_page === 'yes' ? 'comfortable' : answers.web_page === 'somewhat' ? 'some_problems' : 'beginner')
        : (domainSlug === 'devops')
          ? (answers.devops_experience || 'beginner')
          : (answers.git_experience || 'beginner');

    const goal = answers.goal || 'job';
    const dailyTime = parseInt(answers.daily_time) || 60;

    // Starting Level Logic
    if (domainSlug === 'dsa') {
      if (answers.dsaAnalysis) {
        startingLevel = answers.dsaAnalysis.startingLevel || 0;
        unlockedLevels = Array.from({ length: startingLevel + 1 }, (_, index) => index);
      } else {
        const knownTopics = answers.dsa_known_topics || [];
        const solved = answers.dsa_problem_experience || 'never';
        const knowsCore = knownTopics.includes('loops') && knownTopics.includes('functions');
        const knowsArrays = knownTopics.includes('arrays');
        const knowsRecursion = knownTopics.includes('recursion');

        if (solved === 'regular' || (knowsArrays && knowsRecursion)) {
          startingLevel = 3;
        } else if (solved === 'some_leetcode' || knowsArrays) {
          startingLevel = 2;
        } else if (knowsCore) {
          startingLevel = 1;
        } else {
          startingLevel = 0; // Complete beginners start at level 0 (Basics)
        }
        unlockedLevels = Array.from({ length: startingLevel + 1 }, (_, index) => index);
      }
    } else if (domainSlug === 'web-development') {
      // Web Dev Logic
      const techs = answers.technologies || [];
      const knowsHTML = techs.includes('html');
      const knowsCSS = techs.includes('css');
      const knowsJS = techs.includes('js');
      
      if (knowsHTML && knowsCSS && knowsJS) {
        startingLevel = 4;
        unlockedLevels = [0, 1, 2, 3, 4];
      } else if (knowsHTML && knowsCSS) {
        startingLevel = 3;
        unlockedLevels = [0, 1, 2, 3];
      } else if (knowsHTML) {
        startingLevel = 1;
        unlockedLevels = [0, 1];
      } else {
        startingLevel = 0;
        unlockedLevels = [0];
      }
    } else if (domainSlug === 'devops') {
      const exp = answers.devops_experience || 'never';
      if (exp === 'comfortable') {
        startingLevel = 2;
      } else if (exp === 'basic') {
        startingLevel = 1;
      } else {
        startingLevel = 0;
      }
      unlockedLevels = Array.from({ length: startingLevel + 1 }, (_, index) => index);
    } else { // open-source
      const exp = answers.git_experience || 'never';
      if (exp === 'advanced') {
        startingLevel = 2;
      } else if (exp === 'basic') {
        startingLevel = 1;
      } else {
        startingLevel = 0;
      }
      unlockedLevels = Array.from({ length: startingLevel + 1 }, (_, index) => index);
    }

    // Goal-Based Customization
    let roadmapType = 'Steady Pace';
    let recommendedProjects = [];

    if (domainSlug === 'dsa' && answers.dsaAnalysis) {
      roadmapType = answers.dsaAnalysis.roadmapType;
      recommendedProjects = [
        'Recursive call-stack visualizer',
        'Array pattern notebook',
        'Personal DSA progress tracker'
      ];
      xpMultiplier = startingLevel >= 2 ? 1.25 : 1.0;
    } else if (goal === 'internship') {
      roadmapType = 'Internship-Focused';
      recommendedProjects = ['Personal Portfolio', 'Task Management App', 'E-commerce UI'];
      xpMultiplier = 1.2;
    } else if (goal === 'freelancing') {
      roadmapType = 'Freelance-Focused';
      recommendedProjects = ['Business Landing Page', 'Portfolio for Client', 'Contact Form Integration'];
      xpMultiplier = 1.1;
    } else if (goal === 'job') {
      roadmapType = 'Fast-Track';
      recommendedProjects = ['Full Stack Blog', 'Job Board Portal', 'Social Media Dashboard'];
      xpMultiplier = 1.3;
    }

    // Timeline Calculation based on daily study time
    let estimatedTimeline = '6 Months';
    let recommendedPace = 'Moderate';

    if (dailyTime < 60) {
      estimatedTimeline = '8-10 Months';
      recommendedPace = 'Slow & Steady';
      roadmapType = 'Extended Journey';
    } else if (dailyTime >= 120) {
      estimatedTimeline = '3-4 Months';
      recommendedPace = 'Aggressive';
    } else {
      estimatedTimeline = '5-6 Months';
      recommendedPace = 'Steady';
    }

    // Generate AI Summary
    let aiSummary = "";
    if (domainSlug === 'dsa') {
      if (answers.dsaAnalysis) {
        estimatedTimeline = answers.dsaAnalysis.estimatedTimeline || estimatedTimeline;
        recommendedPace = answers.dsaAnalysis.recommendedPace || recommendedPace;
        aiSummary = answers.dsaAnalysis.aiSummary;
      } else {
        const languageMap = { 'cpp': 'C++', 'java': 'Java', 'python': 'Python', 'javascript': 'JavaScript', 'js': 'JavaScript' };
        const lang = languageMap[answers.dsa_language] || 'C++';
        aiSummary = `Since you're targeting ${lang} for DSA, we've optimized your roadmap for it. Based on your ${experience} level, you're starting at Level ${startingLevel}. We've calculated a ${estimatedTimeline} timeline to get you interview-ready.`;
      }
    } else {
      aiSummary = `Based on your ${experience} background and your goal for a ${goal}, we've designed a ${roadmapType} path for you. You'll start at Level ${startingLevel}. We've estimated a ${estimatedTimeline} completion time.`;
    }

    // Update User Profile
    const updateObj = {
      'profile.onboardingAnswers': answers,
      'profile.currentSkillLevel': experience,
      'profile.goal': goal,
      'profile.dailyStudyTime': dailyTime,
      'profile.roadmapType': roadmapType,
      'profile.estimatedTimeline': estimatedTimeline,
      'profile.aiSummary': aiSummary,
      'profile.recommendedProjects': recommendedProjects,
      'profile.xpMultiplier': xpMultiplier,
      'profile.isProfileComplete': true
    };
    updateObj[`domainsProgress.${key}.currentPhase`] = startingLevel;

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $set: updateObj
    }, { new: true });

    res.json({
      success: true,
      data: {
        roadmapType,
        startingLevel,
        unlockedLevels,
        estimatedTimeline,
        recommendedPace,
        xpMultiplier,
        recommendedProjects,
        aiSummary,
        user: updatedUser
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get chat history
// @route   GET /api/ai/history
exports.getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear chat history
// @route   DELETE /api/ai/history
exports.clearHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
