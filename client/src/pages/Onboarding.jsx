import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiMoon, FiSun, FiZap } from 'react-icons/fi';
import { analyzeDsaProfile, normalizeDsaLanguage } from '../utils/dsaPersonalization';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('codewave_theme') || 'light');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const activeDomainSlug = user?.activeDomain?.slug || user?.selectedDomain?.slug || 'dsa';
  const isDsa = activeDomainSlug === 'dsa';

  // Construct questions dynamically based on domain selection
  const buildQuestions = () => {
    let domainSpecificQuestions = [];

    if (activeDomainSlug === 'dsa') {
      domainSpecificQuestions = [
        {
          id: 'dsa_language',
          question: 'Which programming language do you want to learn DSA in?',
          options: [
            { label: 'C++', value: 'cpp', description: 'Standard for competitive programming.' },
            { label: 'Java', value: 'java', description: 'Great for big-tech interviews.' },
            { label: 'Python', value: 'python', description: 'Fastest to write and learn.' },
            { label: 'JavaScript', value: 'javascript', description: 'Best if you are targeting web roles.' }
          ]
        },
        {
          id: 'dsa_problem_experience',
          question: 'Have you solved coding problems before?',
          options: [
            { label: 'Never', value: 'never', description: 'We will begin with low-pressure guided practice.' },
            { label: 'Beginner', value: 'beginner', description: 'I solved a few class or beginner problems.' },
            { label: 'Some LeetCode', value: 'some_leetcode', description: 'I know the platform but need structure.' },
            { label: 'Regular practice', value: 'regular', description: 'I want a faster, interview-focused path.' }
          ]
        }
      ];
    } else if (activeDomainSlug === 'web-development') {
      domainSpecificQuestions = [
        {
          id: 'technologies',
          question: 'Which technologies do you already know?',
          multiple: true,
          options: [
            { label: 'HTML', value: 'html' },
            { label: 'CSS', value: 'css' },
            { label: 'JavaScript', value: 'js' },
            { label: 'React', value: 'react' },
            { label: 'Node.js', value: 'node' },
            { label: 'MongoDB', value: 'mongo' },
            { label: 'Git', value: 'git' },
            { label: 'None', value: 'none' }
          ]
        }
      ];
    } else if (activeDomainSlug === 'devops') {
      domainSpecificQuestions = [
        {
          id: 'devops_experience',
          question: 'Have you used Linux or terminal commands before?',
          options: [
            { label: 'Never', value: 'never', description: 'We will start with friendly bash command walkthroughs.' },
            { label: 'Basic command line', value: 'basic', description: 'I can navigate directories and move files.' },
            { label: 'Comfortable with scripts', value: 'comfortable', description: 'I can write simple scripts and install packages.' }
          ]
        }
      ];
    } else {
      // Open Source / Default
      domainSpecificQuestions = [
        {
          id: 'git_experience',
          question: 'Do you know how to use Git and GitHub?',
          options: [
            { label: 'Never', value: 'never', description: 'We will learn git init, clone, and basic commits.' },
            { label: 'Basic Commits', value: 'basic', description: 'I know how to push and pull from repositories.' },
            { label: 'Pull Requests & Branches', value: 'advanced', description: 'I know how to fork, branch, and open PRs.' }
          ]
        }
      ];
    }

    // Common profile indicators for AI roadmap duration & career milestones
    domainSpecificQuestions.push(
      {
        id: 'goal',
        question: 'What is your career goal?',
        options: [
          { label: 'Job Placement', value: 'job' },
          { label: 'Internship', value: 'internship' },
          { label: 'Freelancing', value: 'freelancing' },
          { label: 'Skill Exploration', value: 'exploration' }
        ]
      },
      {
        id: 'daily_time',
        question: 'How much time can you study daily?',
        options: [
          { label: '30 mins', value: 30 },
          { label: '1 hour', value: 60 },
          { label: '2+ hours', value: 120 }
        ]
      }
    );

    return domainSpecificQuestions;
  };

  const activeQuestions = buildQuestions();
  const currentQuestion = activeQuestions[currentStep];
  const progress = ((currentStep + 1) / activeQuestions.length) * 100;
  const dsaPreview = isDsa && answers.dsa_language ? analyzeDsaProfile(answers) : null;

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('codewave_theme', nextTheme);
    window.dispatchEvent(new Event('themechange'));
  };

  const handleOptionSelect = (value) => {
    const q = currentQuestion;
    if (q.multiple) {
      const currentAnswers = answers[q.id] || [];
      let newAnswers;
      if (value === 'none') {
        newAnswers = currentAnswers.includes('none') ? [] : ['none'];
      } else {
        const withoutNone = currentAnswers.filter(a => a !== 'none');
        newAnswers = withoutNone.includes(value)
          ? withoutNone.filter(a => a !== value)
          : [...withoutNone, value];
      }
      setAnswers({ ...answers, [q.id]: newAnswers });
      return;
    }

    const normalizedValue = q.id === 'dsa_language' ? normalizeDsaLanguage(value) : value;
    setAnswers({ ...answers, [q.id]: normalizedValue });
    if (currentStep < activeQuestions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleNext = async () => {
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setLoading(true);
    try {
      const analysis = isDsa ? analyzeDsaProfile(answers) : null;
      const onboardingAnswers = isDsa ? { ...answers, dsa_language: analysis.language, dsaAnalysis: analysis } : answers;

      // Extract skills mapping or fallback coding experience for onboarding logic
      const skillLevelMapping = isDsa 
        ? (answers.dsa_problem_experience === 'regular' ? 'comfortable' : answers.dsa_problem_experience === 'some_leetcode' ? 'some_problems' : 'basic')
        : (answers.web_page === 'yes' ? 'comfortable' : answers.web_page === 'somewhat' ? 'some_problems' : 'basic');

      await api.put('/auth/profile', {
        profile: {
          currentSkillLevel: skillLevelMapping,
          goal: answers.goal,
          dailyStudyTime: answers.daily_time,
          knownLanguages: isDsa ? [analysis.language] : (answers.technologies || []),
          onboardingAnswers
        }
      });

      await api.post('/ai/generate-roadmap', { answers: onboardingAnswers });
      await refreshUser();

      if (isDsa) {
        localStorage.setItem('dsa_lang', analysis.language);
        localStorage.setItem('dsa_analysis', JSON.stringify(analysis));
      }

      toast.success(isDsa ? 'Your adaptive DSA journey is ready!' : 'Your AI roadmap is ready!', {
        duration: 5000,
        icon: '✨'
      });
      navigate(isDsa ? '/roadmap' : '/dashboard');
    } catch (err) {
      toast.error('Failed to generate your personalized journey.');
    } finally {
      setLoading(false);
    }
  };

  const selected = answers[currentQuestion.id];
  const isNextDisabled = !selected || (currentQuestion.multiple && selected.length === 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 relative select-none">
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)] rounded-xl border border-[var(--border)] transition-all"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <FiSun className="text-xl text-amber-400" /> : <FiMoon className="text-xl text-indigo-500" />}
      </button>

      <div className="w-full max-w-xl mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-black text-[var(--text-light)] uppercase tracking-wider">Step {currentStep + 1} of {activeQuestions.length}</span>
          <span className="text-xs font-black text-[var(--primary)]">{Math.round(progress)}% Complete</span>
        </div>
        <div className="progress-container h-2 shadow-inner">
          <motion.div className="progress-bar-fill" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="onboarding-card max-w-xl w-full p-8 md:p-10"
        >
          <h2 className="text-2xl md:text-3xl font-black mb-1.5 leading-snug">{currentQuestion.question}</h2>
          <p className="text-xs text-[var(--text-light)] font-bold uppercase tracking-wider mb-8 flex items-center gap-2">
            {isDsa ? <><FiMessageSquare /> Code Guru is calibrating your first mission.</> : 'Tell us a bit about yourself so we can tailor your experience.'}
          </p>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
            {currentQuestion.options.map((opt) => {
              const isSelected = currentQuestion.multiple
                ? (answers[currentQuestion.id] || []).includes(opt.value)
                : answers[currentQuestion.id] === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => handleOptionSelect(opt.value)}
                  className={`option-card p-4 transition-all duration-300 flex items-center justify-between border-2 rounded-xl text-left w-full ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--text-main)] shadow-sm'
                      : 'border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-[var(--primary)] hover:bg-[var(--bg-sub)]'
                  }`}
                >
                  <div>
                    <span className="block font-black text-base">{opt.label}</span>
                    {opt.description && <span className="text-xs text-[var(--text-muted)] font-medium mt-0.5 block">{opt.description}</span>}
                  </div>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between items-center border-t border-[var(--border)] pt-6">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="text-[var(--text-light)] font-black uppercase text-xs hover:text-[var(--text-main)] disabled:opacity-0 transition-all"
            >
              Back
            </button>
            <button onClick={handleNext} disabled={isNextDisabled || loading} className="btn-primary py-3 px-6 text-xs uppercase tracking-wider">
              {loading ? 'Generating Journey...' : (currentStep === activeQuestions.length - 1 ? 'Start My Journey' : 'Continue')}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {isDsa && dsaPreview && Object.keys(answers).length > 1 && (
        <div className="mt-6 max-w-xl w-full grid grid-cols-3 gap-3 text-center">
          {[
            ['Start', dsaPreview.startLevelName],
            ['Pace', dsaPreview.recommendedPace],
            ['Timeline', dsaPreview.estimatedTimeline]
          ].map(([label, value]) => (
            <div key={label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3 shadow-sm">
              <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-widest flex justify-center items-center gap-1">
                {label === 'Pace' && <FiZap />} {label}
              </div>
              <div className="text-[10px] font-black text-[var(--text-main)] mt-1 leading-tight">{value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-[var(--text-light)] text-xs font-semibold uppercase tracking-wider">
        Your data is used solely to personalize your learning path.
      </div>
    </div>
  );
};

export default Onboarding;
