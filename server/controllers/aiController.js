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
    recommendations,
    onboardingAnswers: user.profile?.onboardingAnswers || {}
  };
};

// Generate highly custom, data-driven answers when no real AI keys are configured
const generateMockResponse = (userMessage, ins) => {
  const lowerMsg = userMessage.toLowerCase();

  // 1. Analyze performance / Weak topics
  if (lowerMsg.includes('weak') || lowerMsg.includes('improve') || lowerMsg.includes('performance') || lowerMsg.includes('analyze')) {
    return `### 📊 Dynamic Performance Analysis

Hello! Here is your personalized Code Guru diagnostic board for **${ins.domain}**:

* **Strongest Area:** You are currently strongest in **${ins.strongestTopic}**. You completed these lessons with high self-confidence parameters!
* **Revision Needed:** **${ins.weakestTopic}** is currently flagged as your primary area for review. You flagged this topic due to high complexity or low confidence.
* **Consistency Index:** **${ins.consistency}** (Active days in past 2 weeks: \`${ins.activeDaysLast14}\` days).
* **Test Performance:** Average score of \`${ins.avgScore}%\` across \`${ins.totalTestsAttempted}\` assessments.

#### 💡 Code Guru Blueprint Suggestions:
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

*🎯 **Code Guru Tip:** Always log your study time accurately. This updates our dynamic calendar tracking so I can adjust your learning pace recommendations!*`;
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

  // 6. Where to start / Onboarding analysis
  if (lowerMsg.includes('start') || lowerMsg.includes('how to start') || lowerMsg.includes('where to start') || lowerMsg.includes('onboarding')) {
    if (lowerMsg.includes('domain') || lowerMsg.includes('choose') || lowerMsg.includes('select') || lowerMsg.includes('which') || lowerMsg.includes('what')) {
      // Will be handled by the domain section below
    } else {
      const skillLevel = ins.onboardingAnswers?.coding_experience || 'beginner';
      const studyTime = ins.onboardingAnswers?.daily_time || '60';
      const goal = ins.onboardingAnswers?.goal || 'placements';
      const language = ins.preferredLang || 'JavaScript';

      return `### 🚀 Welcome to your Code Guru Onboarding Blueprint!
      
I've analyzed the onboarding answers you chose when setting up your **${ins.domain}** domain. Let's get you aligned on exactly where and how to start:

* **Onboarding Skill Level:** \`${skillLevel.toUpperCase()}\`
* **Primary Target Goal:** \`${goal.toUpperCase()}\`
* **Daily Commitment Plan:** \`${studyTime} minutes / day\`
* **Primary Language/Tech:** \`${language}\`

#### 🗺️ Where to Start:
1. Open your **[Mission Map](file:///roadmap)**. Since your roadmap has been calibrated to your background, your starting phase is **Level ${ins.phase}**. Your first active level node is unlocked!
2. Click on the first unlocked node (e.g. **Arrays** or **HTML Structure**) to enter its learning module.

#### 💡 How to Start & Proceed:
- **Watch the Tutorial**: Every level starts with a high-quality video lesson (e.g., Striver's recursion playlist) embedded directly in the Left Panel.
- **Trace the Logic**: If the lesson covers algorithms (like recursion), pay attention to the **interactive Call Stack tree visualizer** right below the video player. It helps you trace variables and stack frames!
- **Guided Assessments**: Complete guided theory MCQs or variable-tracing challenges in the Right Panel to build your foundational knowledge.
- **Solve Coding Checkpoints**: Once you unlock coding challenges, write your code directly in the Monaco editor and click **Run Code**. When all test cases pass, click **Complete Checkpoint** to earn **+50 XP** and unlock the next level!

*Remember: I am incredibly proud of you for starting this journey! Learning coding is a marathon, and consistency is your superpower. Let's make today a great day of learning! 🌟*`;
    }
  }

  // 6.5. Domain choice questions
  if (lowerMsg.includes('domain') && (lowerMsg.includes('choose') || lowerMsg.includes('select') || lowerMsg.includes('which') || lowerMsg.includes('start') || lowerMsg.includes('what'))) {
    return `### 🧭 Code Guru Domain Selection Guide
    
I would be absolutely delighted to help you choose the perfect domain! Selecting your learning path is a crucial milestone, and I'm here to ensure you feel confident and excited.

Currently, we offer two high-impact domains on CareerForge:

1. **Web Development (Frontend & Full-Stack Focus)**:
   * **Best For**: Creative minds who want to build visual projects, landing pages, and interactive web applications.
   * **Core Languages**: HTML, CSS, JavaScript.
   * **Why Choose It**: It's highly visual, has a gentler learning curve, and is excellent for building a portfolio of client/freelance work quickly.

2. **Data Structures & Algorithms (DSA - Interview Prep)**:
   * **Best For**: Students targeting technical interviews at top product-based companies (FAANG/MAANG) and building deep problem-solving intuition.
   * **Core Languages**: C++, Java, Python, or JavaScript.
   * **Why Choose It**: It's the benchmark for competitive coding rounds, strengthening your fundamental computational logic.

#### 💡 My Recommendation:
- If you are a complete beginner who wants to see immediate, visual results, choose **Web Development**.
- If you already know basic programming and want to focus heavily on placement coding rounds, select **DSA**.

*Remember, you can always switch domains or explore both! To choose a domain, click on the **[Domains](file:///domains)** tab in the sidebar and click **Forge My Path** under your chosen domain. Let's start building something incredible! 🚀*`;
  }

  // 7. ChatGPT style fallback for general questions
  if (!lowerMsg.includes('weak') && !lowerMsg.includes('learn next') && !lowerMsg.includes('weekly') && !lowerMsg.includes('project') && !lowerMsg.includes('readiness') && !lowerMsg.includes('internship') && !lowerMsg.includes('job')) {
    if (lowerMsg.length < 10) {
      return `### 👋 Hello! I'm Code Guru!
      
I am absolutely thrilled to support your learning journey today! Your dedication to mastering **${ins.domain}** is super inspiring. 

Tell me, what concepts or challenges are you exploring today? I can help you with:
- Explaining tricky code syntax and design patterns.
- Telling you **"where should I start?"** to review your onboarding plan.
- Explaining **"what domain should I choose?"** if you are deciding between Web Dev and DSA.
- Generating custom study schedules or placement tips.

Let's smash your goals today! What's on your mind? 🚀`;
    }

    return `### 💡 Code Guru Insights
    
That is a brilliant question! I love your curiosity and commitment to learning. Here is some personalized guidance to help you navigate:

1. **Write and Test Code**: When learning concepts (like recursion or styling layouts), type out the logic in the sandbox editor and run custom print statements. Experiencing the execution flow makes it stick!
2. **Celebrate the Small Wins**: Building a coding career is a step-by-step process. Appreciate how far you've come from choosing your **${ins.domain}** domain.
3. **Targeted Commitment**: Dedicate 15-30 minutes of focused practice today. Daily consistency is worth far more than cramming over weekends.

*Note: As Code Guru, I want to appreciate your curiosity! Keep asking questions. If you hook up a valid API key, I will be able to answer any custom code questions with full ChatGPT capabilities.*

What else would you like to explore next? I'm here to support you! 💪`;
  }

  // 8. Default fallback
  return `### ⚡ Code Guru Adaptive Dashboard

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
* Ask me: **"Where should I start?"** to see your onboarding guide.
* Ask me: **"What domain should I choose?"** to see a guide.

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

        const onboardingSummary = user.profile?.onboardingAnswers 
          ? Object.entries(user.profile.onboardingAnswers)
              .filter(([k]) => k !== 'dsaAnalysis')
              .map(([key, val]) => `- ${key.replace(/_/g, ' ')}: ${Array.isArray(val) ? val.join(', ') : val}`)
              .join('\n')
          : 'None provided';

        const systemInstructions = `You are Code Guru, a premium personalized coding mentor, career coach, and programming assistant for engineering students on CareerForge.
        
        You speak directly to the student's needs, whether they are asking general programming/career questions or performance-related ones. You are a fully capable ChatGPT-style helper, and you can answer ANY general questions about programming, career prep, choosing a learning domain, software design, and engineering.
        
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
        
        Student's Onboarding Background & Goal Parameters:
        ${onboardingSummary}
        
        Guidelines:
        1. Adapt your tone: Be humanized, extremely encouraging, practical, and highly data-driven. Always appreciate their efforts, celebrate small milestones, and motivate them to continue learning! Never demotivate them.
        2. Reference their actual metrics and onboarding context (experience level, goals, daily study time) where relevant. Tell them exactly where to start and how to start their learning path on CareerForge based on their current stage.
        3. If they are weak at "${insights.weakestTopic}", suggest specific actionable code approaches or tracing strategies.
        4. Render your response beautifully in GitHub-flavored markdown with clean list metrics, code blocks, bold headers, and supportive emojis.
        5. You act like ChatGPT — answer general queries (like "what should domain i choose") with deep, complete, and encouraging advice.`;

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

    // Determine Starting Level (Rule-Based)
    const user = await User.findById(userId).populate('selectedDomain');
    const domainSlug = user.selectedDomain?.slug || 'web-development';

    const experience = answers.coding_experience;
    const goal = answers.goal;
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
        } else if (solved === 'beginner' || knowsCore) {
          startingLevel = 1;
        } else {
          startingLevel = 0;
        }
        unlockedLevels = Array.from({ length: startingLevel + 1 }, (_, index) => index);
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
