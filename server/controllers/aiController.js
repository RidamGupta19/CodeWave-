const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');

// @desc    Calculate performance insights dynamically for a user
const calculatePerformanceInsights = async (userId) => {
  const user = await User.findById(userId)
    .populate('selectedDomain')
    .populate('completedTopics.topicId');

  if (!user) return null;

  const domain = user.selectedDomain?.name || 'No domain selected';
  const domainSlug = user.selectedDomain?.slug || 'web-development';
  const xp = user.xp || 0;
  const streak = user.dailyStreak || 0;
  const progress = user.overallProgress || 0;
  const phase = user.currentPhase || 0;
  const completedCount = user.completedTopics?.length || 0;
  
  // Programming Language preference
  const preferredLang = user.profile?.onboardingAnswers?.dsa_language || 
                        (user.profile?.onboardingAnswers?.technologies && user.profile.onboardingAnswers.technologies.length > 0 ? user.profile.onboardingAnswers.technologies[0] : 'JavaScript');

  // 1. Weak Topics Identification
  let weakTopics = [];
  if (user.dsaStats?.weakestTopic) {
    weakTopics.push(user.dsaStats.weakestTopic);
  }
  
  user.completedTopics.forEach(t => {
    if ((t.confidenceLevel <= 2 || t.difficultyFeedback === 'hard' || t.revisionNeeded) && t.topicId?.title) {
      if (!weakTopics.includes(t.topicId.title)) {
        weakTopics.push(t.topicId.title);
      }
    }
  });

  if (weakTopics.length === 0) {
    if (domainSlug === 'dsa') {
      weakTopics.push('Recursion Foundations');
    } else {
      weakTopics.push('Flexbox & Grid Alignment');
    }
  }

  // 2. Strong Topics Identification
  let strongTopics = [];
  if (user.dsaStats?.strongestTopic) {
    strongTopics.push(user.dsaStats.strongestTopic);
  }
  
  user.completedTopics.forEach(t => {
    if ((t.confidenceLevel >= 4 || t.difficultyFeedback === 'easy') && t.topicId?.title) {
      if (!strongTopics.includes(t.topicId.title)) {
        strongTopics.push(t.topicId.title);
      }
    }
  });

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
  const tests = user.testResults || [];
  const passedTests = tests.filter(t => t.passed).length;
  const totalTestsAttempted = tests.length;
  const avgScore = totalTestsAttempted > 0 
    ? Math.round(tests.reduce((acc, curr) => acc + curr.score, 0) / totalTestsAttempted) 
    : 0;

  // 5. Internship / Job Readiness %
  let readinessPercent = Math.round((progress * 0.5) + (passedTests * 12) + (streak * 2));
  if (domainSlug === 'dsa') {
    const solved = user.dsaStats?.totalProblemsSolved || 0;
    readinessPercent = Math.round((progress * 0.4) + (Math.min(solved, 100) / 100 * 30) + (passedTests * 10) + (streak * 2));
  }
  readinessPercent = Math.min(Math.max(readinessPercent, 15), 98); // bounds 15% to 98%

  // 6. Actionable recommendations & insights
  const recommendations = [];
  const insights = [];

  if (domainSlug === 'dsa') {
    const solved = user.dsaStats?.totalProblemsSolved || 0;
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
    recommendations
  };
};

// Generate highly custom, data-driven answers when no real AI keys are configured
const generateMockResponse = (userMessage, ins) => {
  const lowerMsg = userMessage.toLowerCase();

  // 1. Analyze performance / Weak topics
  if (lowerMsg.includes('weak') || lowerMsg.includes('improve') || lowerMsg.includes('performance') || lowerMsg.includes('analyze')) {
    return `### 📊 Dynamic Performance Analysis

Hello! Here is your personalized mentor diagnostic board for **${ins.domain}**:

* **Strongest Area:** You are currently strongest in **${ins.strongestTopic}**. You completed these lessons with high self-confidence parameters!
* **Revision Needed:** **${ins.weakestTopic}** is currently flagged as your primary area for review. You flagged this topic due to high complexity or low confidence.
* **Consistency Index:** **${ins.consistency}** (Active days in past 2 weeks: \`${ins.activeDaysLast14}\` days).
* **Test Performance:** Average score of \`${ins.avgScore}%\` across \`${ins.totalTestsAttempted}\` assessments.

#### 💡 Mentor Blueprint Suggestions:
1. Re-open the **${ins.weakestTopic}** lecture page. Go through the optimal boilerplate, and try copying the source code to zero-to-coding to execute custom print outputs.
2. Build a mini project targeting **${ins.strongestTopic}** to solidify your pattern recognition.
3. Dedicate just 15-20 minutes daily. Consistency yields interview readiness far quicker than heavy cram sessions!`;
  }

  // 2. What should I learn next
  if (lowerMsg.includes('learn next') || lowerMsg.includes('next step') || lowerMsg.includes('what should i learn')) {
    return `### 🗺️ Next Expedition Target

Based on your current progress in **Phase ${ins.phase}** of the **${ins.domain}** roadmap:

* **Current Progress:** You have completed \`${ins.completedCount}\` lessons.
* **Current standing:** Level \`${ins.phase}\` Architect.
* **Next Action:** 
  1. Open the [Mission Map](file:///roadmap). Check if the active node contains unlocked topics.
  2. If you have active topics pending, click on the start challenge link to master it.
  3. If you have finished all topics in Level \`${ins.phase}\`, navigate to [Assessments](file:///assessments) and attempt the phase quiz to unlock the next level badge!

*🎯 **Mentorship Tip:** Always log your study time accurately. This updates our dynamic calendar tracking so I can adjust your learning pace recommendations!*`;
  }

  // 3. Weekly study plan / Schedule
  if (lowerMsg.includes('weekly') || lowerMsg.includes('plan') || lowerMsg.includes('schedule')) {
    return `### 📅 Your Adaptive Weekly Coaching Blueprint

Here is your high-impact study plan tailored for BTech students working in **${ins.preferredLang}**:

* **Monday - Tuesday (Fundamental Repair):**
  * Spend 30 minutes reading the theory sheets for **${ins.weakestTopic}**.
  * Trace at least 2 small diagrams of the logic using standard pen and paper.
* **Wednesday - Thursday (Core Skill Push):**
  * Complete 1 new topic in Phase ${ins.phase} of **${ins.domain}**.
  * Re-write the code examples from scratch.
* **Friday (Assessment Prep):**
  * Try a custom mock quiz. Revise any questions you got wrong.
* **Saturday - Sunday (Project Assembly):**
  * Draft a small portfolio utility using **${ins.strongestTopic}**. Commit it to your GitHub portfolio!

*Daily Commitment Estimate: **${ins.progress > 50 ? '60 mins' : '45 mins'} / day***`;
  }

  // 4. Suggest a project
  if (lowerMsg.includes('project') || lowerMsg.includes('suggest a project')) {
    if (ins.domainSlug === 'dsa') {
      return `### 🛠️ Portfolio Projects: Algorithmic Engineering

Since you are practicing DSA in **${ins.preferredLang}**, here are hands-on implementation projects to stand out to interviewers:

1. **Visual Recursion & Call-Stack Emulator (Medium):**
   * Build a console/web runner that prints step-by-step depth logs when computing recursion trees (like Fibonacci or N-Queens).
   * Highlights mastery in: **${ins.weakestTopic}** and Stack management.
2. **LeetCode Analytics Dashboard (Advanced):**
   * Build an app that parses your solved problem metrics to display strongest vs weakest sections.
   * Highlights mastery in: **${ins.strongestTopic}** and JSON schemas.

*Would you like me to draft step-by-step architecture files for one of these? Just type "Draft Call-Stack Emulator architecture"!*`;
    } else {
      return `### 🎨 Frontend/Full-Stack Project Recommendations

To show recruiters your mastery in **${ins.domain}**, build these beautiful applications:

1. **Dynamic HSL Theme Customizer dashboard (Intermediate):**
   * Build a landing workspace featuring soft glassmorphism, responsive grids, and instant dark/light themes using custom CSS property tokens.
   * Highlights mastery in: **${ins.strongestTopic}** and DOM styling.
2. **Interactive Career Map Board (Advanced):**
   * Build a web timeline where students can log milestone cards and see visual glowing lines for connected levels.
   * Highlights mastery in: **${ins.weakestTopic}** and State management.`;
    }
  }

  // 5. Internship readiness
  if (lowerMsg.includes('readiness') || lowerMsg.includes('internship') || lowerMsg.includes('job')) {
    return `### 💼 BTech Placement & Internship Readiness Audit

Here is your calculated standing:

* **Placement Readiness Score:** \`${ins.readinessPercent}%\`
* **Roadmap standing:** Phase ${ins.phase} Completed topics: \`${ins.completedCount}\`.
* **Coding Strength:** **${ins.strongestTopic}**
* **Consistency status:** **${ins.consistency}**

#### 📈 Strategic Strategy to hit 85%+:
1. ** DSA solved problem baseline:** Attempt at least 25 additional problems in **${ins.preferredLang}**.
2. **Phase Assessments:** Clear the upcoming level assessments to secure official badges.
3. **Daily Habit:** Spend 15 minutes daily on the console so your streak is constantly blazing.

*You're making incredible progress, keep pushing the boundaries daily! 🚀*`;
  }

  // 6. Default/Fallback
  return `### ⚡ CareerForge AI Adaptive Mentor Board

Welcome! I've run a deep diagnostic on your progress:

* **Target Domain:** \`${ins.domain}\`
* **Study Pace:** Level ${ins.phase} (XP: \`${ins.xp}\` | Streak: \`${ins.streak}\` days)
* **Strongest topic:** **${ins.strongestTopic}**
* **Needs focus:** **${ins.weakestTopic}**

#### 💬 High-Impact Prompt Shortcuts:
* Ask me: **"Analyze my DSA performance"** to see weak vs strong areas.
* Ask me: **"Create my weekly plan"** to generate a study blueprint.
* Ask me: **"Suggest a project for my level"** to see tailored projects.
* Ask me: **"How close am I to internship readiness?"** to run a job audit.

How can I coach you to success today? 🚀`;
};

// @desc    Chat with AI career agent
// @route   POST /api/ai/chat
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
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

        const systemInstructions = `You are CareerForge AI, a premium personalized coding mentor and adaptive learning coach for engineering students.
        
        You NEVER generate generic chatbot responses. You speak directly to the student's actual performance.
        
        Here is the student's real-time diagnostic performance metrics:
        - Domain: ${insights.domain}
        - Current Phase: ${insights.phase}
        - Current XP: ${insights.xp}
        - Streak: ${insights.streak} days
        - Roadmap Progress: ${insights.progress}%
        - Completed Lessons: ${insights.completedCount}
        - Preferred Language: ${insights.preferredLang}
        - Strongest Area: ${insights.strongestTopic}
        - Needs Revision: ${insights.weakestTopic}
        - Consistency standing: ${insights.consistency}
        - Internship Readiness Percentile: ${insights.readinessPercent}%
        
        Guidelines:
        1. Adapt your tone: Be humanized, highly encouraging, practical, and highly data-driven.
        2. Reference their actual metrics. If they ask about next steps, guide them to Phase ${insights.phase}.
        3. If they are weak at "${insights.weakestTopic}", suggest specific actionable code approaches or tracing strategies.
        4. Render your response beautifully in GitHub-flavored markdown with clean list metrics, code blocks, bold headers, and supportive emojis. Keep it concise but highly valuable.`;

        if (isGemini) {
          url = `${process.env.AI_API_URL}?key=${process.env.AI_API_KEY}`;
          body = JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemInstructions}\n\nUser Message: ${message}`
              }]
            }],
            generationConfig: {
              maxOutputTokens: 800,
              temperature: 0.7
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
            max_tokens: 800,
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

    // Determine Starting Level (Rule-Based)
    const user = await User.findById(userId).populate('selectedDomain');
    const domainSlug = user.selectedDomain?.slug || 'web-development';

    const experience = answers.coding_experience;
    const goal = answers.goal;
    const dailyTime = parseInt(answers.daily_time) || 60;

    // Starting Level Logic
    if (domainSlug === 'dsa') {
      const complexity = answers.dsa_complexity || 'none';
      const recursion = answers.dsa_recursion || 'none';
      const language = answers.dsa_language || 'cpp';

      if (complexity === 'advanced' && recursion === 'advanced') {
        startingLevel = 5;
        unlockedLevels = [0, 1, 2, 3, 4, 5];
      } else if (complexity !== 'none' || recursion !== 'none') {
        startingLevel = 1;
        unlockedLevels = [0, 1];
      } else {
        startingLevel = 0;
        unlockedLevels = [0];
      }
    } else {
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
      } else if (experience === 'basic' || experience === 'projects') {
        startingLevel = 1;
        unlockedLevels = [0, 1];
      } else {
        startingLevel = 0;
        unlockedLevels = [0];
      }
    }

    // Goal-Based Customization
    let roadmapType = 'Steady Pace';
    let recommendedProjects = [];

    if (goal === 'internship') {
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
      const languageMap = { 'cpp': 'C++', 'java': 'Java', 'python': 'Python', 'js': 'JavaScript' };
      const lang = languageMap[answers.dsa_language] || 'C++';
      aiSummary = `Since you're targeting ${lang} for DSA, we've optimized your roadmap for it. Based on your ${experience} level, you're starting at Level ${startingLevel}. We've calculated a ${estimatedTimeline} timeline to get you interview-ready.`;
    } else {
      aiSummary = `Based on your ${experience} background and your goal for a ${goal}, we've designed a ${roadmapType} path for you. You'll start at Level ${startingLevel}. We've estimated a ${estimatedTimeline} completion time.`;
    }

    // Update User Profile
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $set: {
        'profile.onboardingAnswers': answers,
        'profile.currentSkillLevel': experience,
        'profile.goal': goal,
        'profile.dailyStudyTime': dailyTime,
        'profile.roadmapType': roadmapType,
        'profile.estimatedTimeline': estimatedTimeline,
        'profile.aiSummary': aiSummary,
        'profile.recommendedProjects': recommendedProjects,
        'profile.xpMultiplier': xpMultiplier,
        'profile.isProfileComplete': true,
        'currentPhase': startingLevel
      }
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
