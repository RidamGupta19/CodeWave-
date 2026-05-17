import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

const generalQuestions = [
  {
    id: 'coding_experience',
    question: "Have you done coding before?",
    options: [
      { label: "Never touched coding", value: "none", description: "I'm starting from absolute zero." },
      { label: "Basic college coding", value: "basic", description: "I know concepts like loops and variables." },
      { label: "Built small projects", value: "projects", description: "I've made some basic apps or websites." },
      { label: "Know frontend basics", value: "frontend", description: "I'm comfortable with HTML/CSS/JS." },
      { label: "Intermediate developer", value: "intermediate", description: "I've worked with frameworks like React." }
    ]
  },
  {
    id: 'goal',
    question: "What is your main goal?",
    options: [
      { label: "Internship", value: "internship" },
      { label: "Job", value: "job" },
      { label: "Freelancing", value: "freelancing" },
      { label: "Startup", value: "startup" },
      { label: "Exploration", value: "exploration" }
    ]
  },
  {
    id: 'daily_time',
    question: "How much time can you give daily?",
    options: [
      { label: "30 mins", value: 30 },
      { label: "1 hour", value: 60 },
      { label: "2+ hours", value: 120 }
    ]
  }
];

const dsaQuestions = [
  {
    id: 'dsa_language',
    question: "Preferred language for DSA?",
    options: [
      { label: "C++", value: "cpp", description: "Standard for competitive programming." },
      { label: "Java", value: "java", description: "Great for big-tech interviews." },
      { label: "Python", value: "python", description: "Fastest to write and learn." },
      { label: "JavaScript", value: "js", description: "Best if you're targeting web roles." }
    ]
  },
  {
    id: 'dsa_complexity',
    question: "Understanding of Big O Complexity?",
    options: [
      { label: "Absolute Beginner", value: "none", description: "I don't know what O(n) means." },
      { label: "Basic", value: "basic", description: "I know O(1), O(n), and O(n²)." },
      { label: "Comfortable", value: "advanced", description: "I can analyze nested loops and recursion." }
    ]
  },
  {
    id: 'dsa_recursion',
    question: "Comfort with Recursion?",
    options: [
      { label: "Scared of it", value: "none", description: "What is a base case?" },
      { label: "Know the basics", value: "basic", description: "I can do factorial and fibonacci." },
      { label: "Backtracking Ninja", value: "advanced", description: "I can solve N-Queens and Sudoku." }
    ]
  }
];

const webQuestions = [
  {
    id: 'technologies',
    question: "Which technologies do you know?",
    multiple: true,
    options: [
      { label: "HTML", value: "html" },
      { label: "CSS", value: "css" },
      { label: "JavaScript", value: "js" },
      { label: "React", value: "react" },
      { label: "Node.js", value: "node" },
      { label: "MongoDB", value: "mongo" },
      { label: "Git", value: "git" },
      { label: "None", value: "none" }
    ]
  },
  {
    id: 'web_page',
    question: "Can you build a basic responsive webpage?",
    options: [
      { label: "No", value: "no" },
      { label: "Somewhat", value: "somewhat" },
      { label: "Yes confidently", value: "yes" }
    ]
  }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('careerforge_theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('careerforge_theme', nextTheme);
    window.dispatchEvent(new Event('themechange'));
  };

  // Compute activeQuestions based on domain
  const getQuestions = () => {
    const domainSlug = user?.selectedDomain?.slug || 'web-development';
    if (domainSlug === 'dsa') {
      return [...generalQuestions, ...dsaQuestions];
    }
    return [...generalQuestions, ...webQuestions];
  };

  const activeQuestions = getQuestions();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const handleOptionSelect = (value) => {
    const q = activeQuestions[currentStep];
    if (q.multiple) {
      const currentAnswers = answers[q.id] || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(a => a !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [q.id]: newAnswers });
    } else {
      setAnswers({ ...answers, [q.id]: value });
      // Auto advance for single choice if not last
      if (currentStep < activeQuestions.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 300);
      }
    }
  };

  const handleNext = async () => {
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submit
      setLoading(true);
      try {
        // First save basic profile info
        const profileData = {
          currentSkillLevel: answers.coding_experience,
          goal: answers.goal,
          dailyStudyTime: answers.daily_time,
          knownLanguages: answers.technologies || [],
          onboardingAnswers: answers
        };

        await api.put('/auth/profile', { profile: profileData });
        
        // Then generate the AI roadmap
        await api.post('/ai/generate-roadmap', { answers });
        
        await refreshUser();
        toast.success("Your AI Roadmap has been generated! 🚀", {
          duration: 5000,
          icon: '✨'
        });
        navigate('/dashboard');
      } catch (err) {
        toast.error("Failed to generate your personalized journey.");
      } finally {
        setLoading(false);
      }
    }
  };

  const progress = ((currentStep + 1) / activeQuestions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 relative select-none">
      
      {/* Floating Theme Button */}
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
          <motion.div 
            className="progress-bar-fill" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="onboarding-card max-w-xl w-full p-8 md:p-10"
        >
          <h2 className="text-2xl md:text-3xl font-black mb-1.5 leading-snug">{activeQuestions[currentStep].question}</h2>
          <p className="text-xs text-[var(--text-light)] font-bold uppercase tracking-wider mb-8">Tell us a bit about yourself so we can tailor your experience.</p>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
            {activeQuestions[currentStep].options.map((opt) => {
              const isSelected = activeQuestions[currentStep].multiple 
                ? (answers[activeQuestions[currentStep].id] || []).includes(opt.value)
                : answers[activeQuestions[currentStep].id] === opt.value;

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
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center shrink-0"
                    >
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
            <button 
              onClick={handleNext}
              disabled={!answers[activeQuestions[currentStep].id] || (activeQuestions[currentStep].multiple && answers[activeQuestions[currentStep].id].length === 0)}
              className="btn-primary py-3 px-6 text-xs uppercase tracking-wider"
            >
              {loading ? 'Generating Journey...' : (currentStep === activeQuestions.length - 1 ? 'Start My Journey' : 'Continue')}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 text-center text-[var(--text-light)] text-xs font-semibold uppercase tracking-wider">
        Your data is used solely to personalize your learning path.
      </div>
    </div>
  );
};

export default Onboarding;
