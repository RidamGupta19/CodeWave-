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
      goal: user.profile?.goal || 'job'
    };

    let aiResponse;

    // Try real AI API if configured
    if (process.env.AI_API_KEY && process.env.AI_API_KEY.length > 10) {
      try {
        const response = await fetch(process.env.AI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.AI_API_KEY}`
          },
          body: JSON.stringify({
            model: process.env.AI_MODEL || 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are CareerForge AI, a career guidance agent for BTech/engineering students. 
                User context: Domain=${context.domain}, Progress=${context.progress}%, Phase=${context.currentPhase}, 
                CompletedTopics=${context.completedTopics}, TestsPassed=${context.testsPassed}, 
                Streak=${context.dailyStreak}days, SkillLevel=${context.skillLevel}, Goal=${context.goal}.
                Provide personalized, actionable career advice. Be encouraging and specific.`
              },
              { role: 'user', content: message }
            ],
            max_tokens: 800,
            temperature: 0.7
          })
        });
        const data = await response.json();
        aiResponse = data.choices?.[0]?.message?.content || generateMockResponse(message, context);
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
