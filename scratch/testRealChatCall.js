const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', 'server', '.env') });

const testCall = async () => {
  const url = `${process.env.AI_API_URL}?key=${process.env.AI_API_KEY}`;
  
  // Mock insights
  const insights = {
    domain: 'No domain selected',
    phase: 0,
    xp: 0,
    streak: 0,
    progress: 0,
    completedCount: 0,
    preferredLang: 'JavaScript',
    strongestTopic: 'None',
    weakestTopic: 'None',
    consistency: 'Needs Focus',
    readinessPercent: 15
  };

  const onboardingSummary = "None provided";

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
  
  Student's Onboarding Background & Goal Parameters:
  ${onboardingSummary}
  
  Guidelines:
  1. Adapt your tone: Be humanized, extremely encouraging, practical, and highly data-driven. Always appreciate their efforts, celebrate small milestones, and motivate them to continue learning! Never demotivate them.
  2. Reference their actual metrics and onboarding context (experience level, goals, daily study time). Tell them exactly where to start and how to start their learning path on CareerForge based on their current stage.
  3. If they are weak at "${insights.weakestTopic}", suggest specific actionable code approaches or tracing strategies.
  4. Render your response beautifully in GitHub-flavored markdown with clean list metrics, code blocks, bold headers, and supportive emojis. Keep it concise but highly valuable.
  5. You are like ChatGPT — you can answer ANY general questions about programming, career prep, design, and software engineering. Do not restrict yourself to only performance reports.`;

  const userMessage = "what should domain i choose";

  const body = JSON.stringify({
    contents: [{
      parts: [{
        text: `${systemInstructions}\n\nUser Message: ${userMessage}`
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

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Result:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
};

testCall();
