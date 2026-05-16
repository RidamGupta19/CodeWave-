const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role: role === 'admin' ? 'student' : (role || 'student') // prevent self-admin registration
    });

    const token = user.generateToken();
    
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = user.generateToken();

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profile: user.profile,
        selectedDomain: user.selectedDomain,
        overallProgress: user.overallProgress,
        dailyStreak: user.dailyStreak
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('selectedDomain')
      .populate('earnedBadges.badgeId')
      .populate('assignedMentor', 'fullName email');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (updates.fullName) user.fullName = updates.fullName;
    if (updates.profile) {
      user.profile = { ...user.profile.toObject(), ...updates.profile };
      // Check if profile is complete
      const p = user.profile;
      if (updates.profile.isProfileComplete !== undefined) {
        user.profile.isProfileComplete = updates.profile.isProfileComplete;
      } else {
        user.profile.isProfileComplete = !!(p.currentSkillLevel && p.goal);
      }
    }

    await user.save();

    // --- ADVANCED AI ROADMAP ENGINE ---
    if (updates.profile && updates.profile.onboardingAnswers) {
      const answers = updates.profile.onboardingAnswers;
      const technologies = answers.technologies || [];
      const experience = answers.coding_experience;
      const goal = answers.goal;
      const dailyTime = answers.daily_time || 60; // in minutes
      
      const Domain = require('../models/Domain');
      const Phase = require('../models/Phase');
      const Topic = require('../models/Topic');
      
      const webDev = await Domain.findOne({ slug: 'web-development' });
      if (webDev && user.selectedDomain && user.selectedDomain.toString() === webDev._id.toString()) {
        const phases = await Phase.find({ domainId: webDev._id }).sort('phaseNumber');
        
        let skipToPhase = 0;
        const autoCompletedTopics = [];
        let roadmapType = 'Steady Pace';
        let timelineMonths = 6;
        let aiSummary = '';
        let recommendedProjects = [];

        // 1. Skill Analysis & Level Skipping
        if (technologies.includes('html')) {
          const htmlPhase = phases.find(p => p.phaseNumber === 1);
          if (htmlPhase) {
            const htmlTopics = await Topic.find({ phaseId: htmlPhase._id });
            htmlTopics.forEach(t => autoCompletedTopics.push({ topicId: t._id, completedAt: new Date(), notes: 'Skipped via Onboarding' }));
            skipToPhase = 2;
          }
        }
        
        if (technologies.includes('css')) {
          const cssPhase = phases.find(p => p.phaseNumber === 2);
          if (cssPhase) {
            const cssTopics = await Topic.find({ phaseId: cssPhase._id });
            cssTopics.forEach(t => autoCompletedTopics.push({ topicId: t._id, completedAt: new Date(), notes: 'Skipped via Onboarding' }));
            skipToPhase = 3;
          }
        }

        if (experience === 'frontend' || experience === 'projects') {
          skipToPhase = Math.max(skipToPhase, 4);
          roadmapType = 'Fast-Track';
          timelineMonths -= 1;
        } else if (experience === 'intermediate') {
          skipToPhase = Math.max(skipToPhase, 6);
          roadmapType = 'Fast-Track';
          timelineMonths -= 2;
        }

        // 2. Pace & Timeline Analysis
        if (dailyTime < 60) {
          roadmapType = 'Extended Journey';
          timelineMonths += 2;
        } else if (dailyTime >= 120) {
          timelineMonths -= 1;
        }

        // 3. Goal Alignment & Projects
        if (goal === 'internship') {
          roadmapType = 'Internship-Focused';
          recommendedProjects = ['Full-stack E-commerce', 'Real-time Chat App', 'Team Collaboration Tool'];
          aiSummary = `Since your goal is an Internship, we've prioritized industry-standard MERN projects and GitHub collaboration. `;
        } else if (goal === 'freelancing') {
          roadmapType = 'Freelance-Focused';
          recommendedProjects = ['Portfolio Website', 'Client Dashboard', 'SaaS Landing Page'];
          aiSummary = `As a future Freelancer, we've focused on high-polish frontend work and client management tools. `;
        } else {
          recommendedProjects = ['Personal Blog', 'Task Manager', 'Social Media Clone'];
          aiSummary = `Your journey is designed for a well-rounded foundation in Full Stack engineering. `;
        }

        // 4. Final Construction
        const startingLevelName = phases.find(p => p.phaseNumber === skipToPhase)?.name || 'Internet Explorer';
        aiSummary += `You're starting from ${startingLevelName} ${skipToPhase > 0 ? 'due to your prior knowledge' : ''}. You can expect to be industry-ready in approximately ${timelineMonths} months at your current pace.`;

        // Update User Profile
        user.profile.roadmapType = roadmapType;
        user.profile.estimatedTimeline = `${timelineMonths} Months`;
        user.profile.aiSummary = aiSummary;
        user.profile.recommendedProjects = recommendedProjects;
        user.profile.xpMultiplier = experience === 'intermediate' ? 1.2 : 1.0;
        
        user.currentPhase = skipToPhase;
        const existingIds = user.completedTopics.map(t => t.topicId.toString());
        autoCompletedTopics.forEach(at => {
          if (!existingIds.includes(at.topicId.toString())) {
            user.completedTopics.push(at);
          }
        });

        const totalTopics = await Topic.countDocuments({ domainId: webDev._id, isActive: true });
        user.overallProgress = totalTopics > 0 ? Math.round((user.completedTopics.length / totalTopics) * 100) : 0;
        
        await user.save();
      }
    }
    // --- END AI ENGINE ---

    res.json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profile: user.profile,
        currentPhase: user.currentPhase,
        overallProgress: user.overallProgress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
