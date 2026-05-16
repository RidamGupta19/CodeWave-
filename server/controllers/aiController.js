const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const Domain = require('../models/Domain');
const Phase = require('../models/Phase');

// Mock AI responses when no API key is configured
const generateMockResponse = (userMessage, context) => {
  const lowerMsg = userMessage.toLowerCase();
  const domain = context.domain || 'your selected domain';
  const progress = context.progress || 0;
  const phase = context.currentPhase || 1;

  if (lowerMsg.includes('roadmap') || lowerMsg.includes('path') || lowerMsg.includes('plan')) {
    return `Great question! Based on your profile, here's my suggestion for ${domain}:\n\n📋 **Your Personalized Roadmap:**\n1. You're currently in Phase ${phase} - keep pushing through!\n2. Your progress is at ${progress}% - ${progress < 30 ? "you're just getting started, focus on fundamentals" : progress < 60 ? "you're making good progress, start working on projects" : "you're almost there! Focus on advanced topics and portfolio"}\n3. **Next Steps:** Complete all topics in your current phase before moving to assessments\n4. **Daily Goal:** Dedicate at least 2 hours of focused study\n5. **Weekly Goal:** Complete at least 3-4 topics and one mini-project\n\n💡 **Pro Tip:** Don't just read - practice! Build small projects after each phase.`;
  }

  if (lowerMsg.includes('weak') || lowerMsg.includes('improve') || lowerMsg.includes('struggle')) {
    return `Let me analyze your learning pattern for ${domain}:\n\n🔍 **Areas to Improve:**\n1. Focus on hands-on practice - theory alone won't cut it\n2. Take the phase assessments seriously - they reveal gaps\n3. Revisit fundamentals if advanced topics feel overwhelming\n\n📚 **Recommended Actions:**\n- Practice on HackerRank/LeetCode daily\n- Build mini-projects for each phase\n- Join online communities for peer learning\n- Watch YouTube tutorials for visual learning\n\n🎯 **Remember:** Everyone struggles - it's part of the learning process!`;
  }

  if (lowerMsg.includes('job') || lowerMsg.includes('intern') || lowerMsg.includes('career')) {
    return `Here's career advice for ${domain}:\n\n💼 **Career Opportunities:**\n1. Complete your roadmap to build a solid foundation\n2. Build 3-5 portfolio projects\n3. Get HackerRank certifications listed in your domain\n4. Contribute to open source for visibility\n\n📝 **Resume Tips:**\n- Highlight projects over coursework\n- Include certifications and badges\n- Quantify your achievements\n\n🔗 **Resources:**\n- LinkedIn optimization\n- GitHub profile polish\n- Practice mock interviews\n\nYou're at ${progress}% completion - ${progress >= 70 ? "you're almost job-ready!" : "keep learning and building!"}`;
  }

  if (lowerMsg.includes('resource') || lowerMsg.includes('learn') || lowerMsg.includes('study')) {
    return `Here are curated resources for ${domain}:\n\n📖 **Learning Strategy:**\n1. **Theory:** GeeksforGeeks articles for concepts\n2. **Video:** YouTube search-based playlists\n3. **Practice:** HackerRank challenges\n4. **Projects:** Build real-world applications\n\n⏰ **Study Plan:**\n- Morning: Theory & concepts (1 hour)\n- Afternoon: Coding practice (1.5 hours)\n- Evening: Project work (1 hour)\n\n🏆 **Certifications:** Check your domain's recommended HackerRank certifications!\n\n💡 Don't forget to check the Cloud Credits section for free tools and services!`;
  }

  return `Thanks for your question about "${userMessage}"! 🤖\n\nHere's what I can help you with for ${domain}:\n\n📊 **Your Current Status:**\n- Domain: ${domain}\n- Phase: ${phase}\n- Progress: ${progress}%\n- Keep up the momentum!\n\n🎯 **Quick Suggestions:**\n1. Focus on completing your current phase topics\n2. Practice coding daily on HackerRank\n3. Build small projects to reinforce learning\n4. Take assessments when you're ready\n\n💬 **Ask me about:**\n- Career roadmap planning\n- Weak area identification\n- Job/internship preparation\n- Study resources & schedule\n- Specific technical topics\n\nI'm here to guide your career journey! 🚀`;
};

// @desc    Chat with AI career agent
// @route   POST /api/ai/chat
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.user._id).populate('selectedDomain');

    // Save user message
    await ChatMessage.create({ userId: req.user._id, role: 'user', content: message });

    // Build context
    const context = {
      domain: user.selectedDomain?.name || 'No domain selected',
      progress: user.overallProgress || 0,
      currentPhase: user.currentPhase || 1,
      completedTopics: user.completedTopics?.length || 0,
      testsPassed: user.testResults?.filter(t => t.passed)?.length || 0,
      dailyStreak: user.dailyStreak || 0,
      skillLevel: user.profile?.currentSkillLevel || 'beginner',
      goal: user.profile?.goal || 'job',
      dsaStats: {
        solved: user.dsaStats?.totalProblemsSolved || 0,
        strongest: user.dsaStats?.strongestTopic || 'N/A',
        weakest: user.dsaStats?.weakestTopic || 'N/A'
      }
    };

    let aiResponse;

    // Try real AI API if configured
    if (process.env.AI_API_KEY && process.env.AI_API_KEY.length > 10) {
      try {
        const isGemini = process.env.AI_API_URL.includes('generativelanguage.googleapis.com');
        
        let url = process.env.AI_API_URL;
        let body;
        let headers = { 'Content-Type': 'application/json' };

        if (isGemini) {
          url = `${process.env.AI_API_URL}?key=${process.env.AI_API_KEY}`;
          body = JSON.stringify({
            contents: [{
              parts: [{
                text: `You are CareerForge AI, a career guidance agent for BTech/engineering students. 
                User context: Domain=${context.domain}, Progress=${context.progress}%, Phase=${context.currentPhase}, 
                CompletedTopics=${context.completedTopics}, TestsPassed=${context.testsPassed}, 
                Streak=${context.dailyStreak}days, SkillLevel=${context.skillLevel}, Goal=${context.goal}.
                DSA Performance: Solved=${context.dsaStats.solved}, Strongest=${context.dsaStats.strongest}, Weakest=${context.dsaStats.weakest}.
                Provide personalized, actionable career advice. Be encouraging and specific. If they struggle with their "weakest" topic, give them specific study tips for that area.
                
                User Message: ${message}`
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
              {
                role: 'system',
                content: `You are CareerForge AI, a career guidance agent for BTech/engineering students. 
                User context: Domain=${context.domain}, Progress=${context.progress}%, Phase=${context.currentPhase}, 
                CompletedTopics=${context.completedTopics}, TestsPassed=${context.testsPassed}, 
                Streak=${context.dailyStreak}days, SkillLevel=${context.skillLevel}, Goal=${context.goal}.
                DSA Performance: Solved=${context.dsaStats.solved}, Strongest=${context.dsaStats.strongest}, Weakest=${context.dsaStats.weakest}.
                Provide personalized, actionable career advice. Be encouraging and specific. If they struggle with their "weakest" topic, give them specific study tips for that area.`
              },
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
          aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || generateMockResponse(message, context);
        } else {
          aiResponse = data.choices?.[0]?.message?.content || generateMockResponse(message, context);
        }
      } catch (apiError) {
        console.log('AI API error, using mock:', apiError.message);
        aiResponse = generateMockResponse(message, context);
      }
    } else {
      aiResponse = generateMockResponse(message, context);
    }

    // Save AI response
    await ChatMessage.create({
      userId: req.user._id,
      role: 'assistant',
      content: aiResponse,
      metadata: { domainContext: context.domain, progressContext: `${context.progress}%` }
    });

    res.json({ success: true, data: { message: aiResponse } });
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

    // 1. Determine Starting Level (Rule-Based)
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
        startingLevel = 5; // Stack & Queue Master
        unlockedLevels = [0, 1, 2, 3, 4, 5];
      } else if (complexity !== 'none' || recursion !== 'none') {
        startingLevel = 1; // Arrays Explorer
        unlockedLevels = [0, 1];
      } else {
        startingLevel = 0; // Programming Foundations
        unlockedLevels = [0];
      }
    } else {
      // Web Dev Logic
      const techs = answers.technologies || [];
      const knowsHTML = techs.includes('html');
      const knowsCSS = techs.includes('css');
      const knowsJS = techs.includes('js');
      
      if (knowsHTML && knowsCSS && knowsJS) {
        startingLevel = 4; // Skip to Logic Legend (JS) / Version Vanguard (Git)
        unlockedLevels = [0, 1, 2, 3, 4];
      } else if (knowsHTML && knowsCSS) {
        startingLevel = 3; // Style Sorcerer / Logic Legend
        unlockedLevels = [0, 1, 2, 3];
      } else if (knowsHTML) {
        startingLevel = 1; // Structure Sensei
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
