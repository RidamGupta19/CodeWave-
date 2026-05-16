import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
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
  },
  {
    id: 'learner_type',
    question: "What type of learner are you?",
    options: [
      { label: "Video learner", value: "video" },
      { label: "Practice-first", value: "practice" },
      { label: "Project-based", value: "project" },
      { label: "Mixed", value: "mixed" }
    ]
  }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleOptionSelect = (value) => {
    const q = questions[currentStep];
    if (q.multiple) {
      const currentAnswers = answers[q.id] || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(a => a !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [q.id]: newAnswers });
    } else {
      setAnswers({ ...answers, [q.id]: value });
      // Auto advance for single choice if not last
      if (currentStep < questions.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 300);
      }
    }
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
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

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fdfcfb]">
      <div className="w-full max-w-xl mb-12">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Step {currentStep + 1} of {questions.length}</span>
          <span className="text-sm font-bold text-primary">{Math.round(progress)}% Complete</span>
        </div>
        <div className="progress-container">
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="onboarding-card"
        >
          <h2 className="text-2xl font-extrabold mb-2 text-[#1a1a1a]">{questions[currentStep].question}</h2>
          <p className="text-gray-500 mb-8">Tell us a bit about yourself so we can tailor your experience.</p>

          <div className="space-y-3">
            {questions[currentStep].options.map((opt) => {
              const isSelected = questions[currentStep].multiple 
                ? (answers[questions[currentStep].id] || []).includes(opt.value)
                : answers[questions[currentStep].id] === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => handleOptionSelect(opt.value)}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block font-bold text-lg">{opt.label}</span>
                      {opt.description && <span className="text-sm text-gray-500">{opt.description}</span>}
                    </div>
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex justify-between items-center">
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="text-gray-400 font-bold hover:text-gray-600 disabled:opacity-0 transition-all"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              disabled={!answers[questions[currentStep].id] || (questions[currentStep].multiple && answers[questions[currentStep].id].length === 0)}
              className="btn-primary"
            >
              {loading ? 'Generating Journey...' : (currentStep === questions.length - 1 ? 'Start My Journey' : 'Continue')}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 text-center text-gray-400 text-sm">
        Your data is used solely to personalize your learning path.
      </div>
    </div>
  );
};

export default Onboarding;
