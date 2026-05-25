import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  FiCheckCircle, FiPlay, FiBook, FiYoutube, FiCode, FiArrowLeft, 
  FiMessageSquare, FiZap, FiAward, FiClock, FiArrowRight, FiInfo,
  FiBookOpen, FiTerminal, FiAward as FiTrophy, FiChevronRight, FiMaximize2, FiMinimize2,
  FiList
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { getDsaLanguageContent, getCheckpointContent } from '../utils/dsaContent';
import { getLessonAssessment, normalizeDsaLanguage } from '../utils/dsaPersonalization';
import RecursionVisualizer from '../components/RecursionVisualizer';

// Audio Feedback Sound Engine for high gamification engagement
const playSoundEffect = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.2);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (err) {
    console.warn("Audio Context blocked by browser auto-play policy");
  }
};

// Helper to extract embedded URL supporting both video IDs and playlists dynamically
const getYouTubeEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  if (url.includes('playlist?list=') || url.includes('&list=')) {
    const match = url.match(/[?&]list=([^#\&\?]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/videoseries?list=${match[1]}`;
    }
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?rel=0&modestbranding=1&showinfo=0`;
  }
  return null;
};

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  // Topic state variables
  const [topic, setTopic] = useState(null);
  // Learning flow step state: 1=Video,2=Concept,3=Guided Practice,4=Challenge,5=Completed
  const [learningStep, setLearningStep] = useState(1);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const playerRef = useRef(null);
  const [allTopics, setAllTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studyTime, setStudyTime] = useState(30);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [isCpSidebarOpen, setIsCpSidebarOpen] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('learn');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const advanceStep = () => setLearningStep(prev => Math.min(prev + 1, 2));
  const isChallengeUnlocked = true;

  const isCompleted = useMemo(() => {
    return user?.completedTopics?.some(t => t.topicId === id || t.topicId?._id === id);
  }, [user, id]);

  const nextTopic = useMemo(() => {
    if (!topic || allTopics.length === 0) return null;
    const sorted = [...allTopics].sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentIndex = sorted.findIndex(t => t._id === id);
    if (currentIndex !== -1 && currentIndex < sorted.length - 1) {
      return sorted[currentIndex + 1];
    }
    return null;
  }, [allTopics, id, topic]);

  // Persist learning step in localStorage per topic
  useEffect(() => {
    if (!id) return;
    setIsVideoFinished(false);
    if (isCompleted) {
      setLearningStep(2);
    } else {
      const savedStep = localStorage.getItem(`dsa_learning_step_${id}`);
      setLearningStep(savedStep ? parseInt(savedStep, 10) : 1);
    }
  }, [id, isCompleted]);

  // Save learning step when it changes
  useEffect(() => {
    if (!id || learningStep === undefined) return;
    localStorage.setItem(`dsa_learning_step_${id}`, learningStep.toString());
  }, [id, learningStep]);
  
  // Custom Dynamic Languages & Tracks State
  const [selectedLang, setSelectedLang] = useState(() => normalizeDsaLanguage(localStorage.getItem('dsa_lang') || 'cpp'));
  const [useStriverAdvanced, setUseStriverAdvanced] = useState(() => localStorage.getItem('striver_advanced') === 'true');
  
  const langDisplayMap = { cpp: 'C++', java: 'Java', python: 'Python', javascript: 'JavaScript' };
  const currentLangName = langDisplayMap[selectedLang] || 'C++';
  
  // Interactive Code Playground States
  const [editorCode, setEditorCode] = useState('');
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [compilerStatus, setCompilerStatus] = useState('idle'); // 'idle' | 'running' | 'passed' | 'failed' | 'compile_error'
  const [challengePassed, setChallengePassed] = useState(false);
  const [currentTab, setCurrentTab] = useState('problem'); // 'problem' | 'playground'
  const [testResults, setTestResults] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [particles, setParticles] = useState([]);
  
  // LeetCode UI Specific States
  const [leftTab, setLeftTab] = useState('description'); // 'description' | 'approach' | 'submissions'
  const [activeConsoleTab, setActiveConsoleTab] = useState('testcase'); // 'testcase' | 'result'
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubCode, setSelectedSubCode] = useState(null);
  const [celebrationData, setCelebrationData] = useState(null);
  
  // Feedback States
  const [difficultyFeedback, setDifficultyFeedback] = useState('easy');
  const [confidenceLevel, setConfidenceLevel] = useState(3);
  const [revisionNeeded, setRevisionNeeded] = useState(false);

  // Progressive Question Difficulty State
  const [activeDifficulty, setActiveDifficulty] = useState(() => localStorage.getItem(`dsa_difficulty_${id}`) || 'beginner');
  const [lessonAnswers, setLessonAnswers] = useState({});
  
  useEffect(() => {
    if (id) {
      setActiveDifficulty(localStorage.getItem(`dsa_difficulty_${id}`) || 'beginner');
      setLessonAnswers({});
    }
  }, [id]);

  // ─── CHECKPOINT MODULE STATE (for "Start Coding" Level 0 & "Arrays Explorer" Level 1) ────
  // Derived dynamically from database metadata
  const CHECKPOINTS = useMemo(() => {
    if (!topic || !topic.checkpoints || topic.checkpoints.length === 0) {
      return ['cp1', 'cp2', 'cp3'];
    }
    return topic.checkpoints.map(cp => cp.id);
  }, [topic]);

  const CHECKPOINT_LABELS = useMemo(() => {
    if (!topic || !topic.checkpoints || topic.checkpoints.length === 0) {
      return {
        cp1: 'Intro to Programming',
        cp2: 'Variables & Conditions',
        cp3: 'Loops & Logic'
      };
    }
    const labels = {};
    topic.checkpoints.forEach(cp => {
      labels[cp.id] = cp.label;
    });
    return labels;
  }, [topic]);

  const CHECKPOINT_ICONS = useMemo(() => {
    if (!topic || !topic.checkpoints || topic.checkpoints.length === 0) {
      return { cp1: '👋', cp2: '🔀', cp3: '🔁' };
    }
    const icons = {};
    topic.checkpoints.forEach((cp, idx) => {
      const emojis = ['👋', '🔀', '🔁', '🧱', '🔍', '🔄', '📐', '🎯', '⚡', '🏆', '💎', '🚀', '🔥', '🧗', '🛠️', '🧬', '🧠', '⚙️', '🌟', '🎖️', '🎨', '🔮', '🗺️', '🏰', '🏹', '🛡️', '⚔️', '👑'];
      icons[cp.id] = emojis[idx % emojis.length];
    });
    return icons;
  }, [topic]);

  const [activeCheckpoint, setActiveCheckpoint] = useState('cp1');
  const [checkpointVideoFinished, setCheckpointVideoFinished] = useState(false);
  const [checkpointCodePassed, setCheckpointCodePassed] = useState(false);
  // Track which checkpoints have been completed for this topic
  const [completedCheckpoints, setCompletedCheckpoints] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`dsa_cp_done_${id}`) || '[]'); } catch { return []; }
  });
  const checkpointPlayerRef = useRef(null);

  useEffect(() => {
    if (id && topic) {
      const firstCp = (topic.checkpoints && topic.checkpoints.length > 0) ? topic.checkpoints[0].id : 'cp1';
      const saved = localStorage.getItem(`dsa_checkpoint_${id}`) || firstCp;
      
      const validCps = topic.checkpoints ? topic.checkpoints.map(cp => cp.id) : ['cp1', 'cp2', 'cp3'];
      if (validCps.includes(saved)) {
        setActiveCheckpoint(saved);
      } else {
        setActiveCheckpoint(firstCp);
        localStorage.setItem(`dsa_checkpoint_${id}`, firstCp);
      }
      
      setCheckpointVideoFinished(false);
      setCheckpointCodePassed(false);
      try {
        setCompletedCheckpoints(JSON.parse(localStorage.getItem(`dsa_cp_done_${id}`) || '[]'));
      } catch { setCompletedCheckpoints([]); }
    }
  }, [id, topic]);

  const markCheckpointComplete = (cpId) => {
    const updated = completedCheckpoints.includes(cpId) ? completedCheckpoints : [...completedCheckpoints, cpId];
    setCompletedCheckpoints(updated);
    localStorage.setItem(`dsa_cp_done_${id}`, JSON.stringify(updated));
    const idx = CHECKPOINTS.indexOf(cpId);
    if (idx < CHECKPOINTS.length - 1) {
      const next = CHECKPOINTS[idx + 1];
      setActiveCheckpoint(next);
      localStorage.setItem(`dsa_checkpoint_${id}`, next);
      setCheckpointVideoFinished(false);
      setCheckpointCodePassed(false);
      toast.success(`✅ Checkpoint ${idx + 1} done! Now: ${CHECKPOINT_LABELS[next]} 🚀`);
    } else {
      toast.success(`🏆 All ${CHECKPOINTS.length} checkpoints complete! Topic Mastered!`);
    }
  };

  useEffect(() => {
    if (id) {
      localStorage.setItem(`dsa_difficulty_${id}`, activeDifficulty);
    }
  }, [id, activeDifficulty]);

  // Advanced Layout Resizer & Fullscreen Editor States
  const [leftWidth, setLeftWidth] = useState(45); // percentage width for left details pane
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Synchronize Monaco theme with the global page theme on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setEditorTheme(isDark ? 'vs-dark' : 'light');
  }, []);

  // Sync workspace and page theme toggle
  const toggleWorkspaceTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setEditorTheme('light');
      localStorage.setItem('careerforge_theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      setEditorTheme('vs-dark');
      localStorage.setItem('careerforge_theme', 'dark');
    }
  };

  // Window mouse resize dragging event listeners
  const startResize = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const percentage = (e.clientX / window.innerWidth) * 100;
      if (percentage > 20 && percentage < 80) {
        setLeftWidth(percentage);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }
  }, []);



  // Sync initial language with user profile onboarding answers
  useEffect(() => {
    if (user?.profile?.onboardingAnswers?.dsa_language) {
      const savedLang = normalizeDsaLanguage(localStorage.getItem('dsa_lang') || user.profile.onboardingAnswers.dsa_language);
      setSelectedLang(savedLang);
    }
  }, [user]);

  // Save selected settings to local persistence
  useEffect(() => {
    localStorage.setItem('dsa_lang', selectedLang);
  }, [selectedLang]);

  useEffect(() => {
    localStorage.setItem('striver_advanced', useStriverAdvanced.toString());
  }, [useStriverAdvanced]);

  // Load topic & dependencies
  useEffect(() => {
    fetchTopic();
    // Scroll back to top on page refresh or navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get(`/progress/submissions/${id}`);
      setSubmissions(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    }
  };

  const fetchTopic = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/topics/${id}`);
      setTopic(res.data.data);
      
      // Reset ALL interactive playground variables on topic navigation
      setChallengePassed(false);
      setCompilerStatus('idle');
      setConsoleLogs([]);
      setTestResults([]);
      setSelectedSubCode(null);
      setEditorCode(''); // Clear editor so boilerplate loads fresh

      // Fetch adjacent topics within active phase for progress listing
      if (res.data.data.phaseId) {
        const phaseRes = await api.get(`/topics/phase/${res.data.data.phaseId._id || res.data.data.phaseId}`);
        setAllTopics(phaseRes.data.data);
      }

      // Automatically register starting topic in backend if not already logged
      const isStarted = user?.startedTopics?.some(t => t.topicId === id || t.topicId?._id === id);
      const isCompleted = user?.completedTopics?.some(t => t.topicId === id || t.topicId?._id === id);
      
      if (user && !isStarted && !isCompleted) {
        await api.post('/progress/start-topic', { topicId: id });
      }
      
      // Fetch submissions for submissions history list
      fetchSubmissions();
      if (user) {
        refreshUser();
      }

      if (isCompleted) {
        const completedData = user?.completedTopics?.find(t => t.topicId === id || t.topicId?._id === id);
        if (completedData) {
          setNotes(completedData.notes || '');
          setConfidenceLevel(completedData.confidenceLevel || 3);
          setDifficultyFeedback(completedData.difficultyFeedback || 'easy');
          setRevisionNeeded(completedData.revisionNeeded || false);
        }
      }

    } catch (err) {
      toast.error('Failed to load topic details');
      navigate('/roadmap');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic boilerplate loaders
  const isDsaDomain = topic?.domainId?.slug === 'dsa' || topic?.domainId === 'dsa' || 
                      (typeof topic?.domainId === 'object' && topic?.domainId?.slug === 'dsa');
  const isCheckpointModule = isDsaDomain && (topic?.isCheckpointModule === true || (topic?.title || '').toLowerCase() === 'start coding');
  const langContent = isDsaDomain ? getDsaLanguageContent(topic?.title, selectedLang, activeDifficulty, useStriverAdvanced, topic?.youtubeLink) : null;
  const lessonAssessment = isDsaDomain ? getLessonAssessment(topic?.title, selectedLang) : [];
  const lessonAssessmentComplete = !isDsaDomain || lessonAssessment.every((_, index) => (lessonAnswers[index] || '').trim().length > 0);

  // Active checkpoint content (only relevant when isCheckpointModule)
  const activeCheckpointContent = useMemo(() => {
    if (!isCheckpointModule) return null;
    return getCheckpointContent(activeCheckpoint, selectedLang);
  }, [isCheckpointModule, activeCheckpoint, selectedLang]);

  // For checkpoint module: use the unique embed URL baked into each checkpoint
  // Each checkpoint has its own pre-built videoEmbedUrl — NEVER the same video twice
  const checkpointVideoEmbedUrl = useMemo(() => {
    if (!isCheckpointModule || !activeCheckpointContent?.videoEmbedUrl) return null;
    return activeCheckpointContent.videoEmbedUrl;
  }, [isCheckpointModule, activeCheckpointContent]);

  const activeVideoEmbedUrl = useMemo(() => {
    if (langContent?.youtubeVideoId) {
      if (langContent.youtubeVideoId.length === 11) {
        return `https://www.youtube.com/embed/${langContent.youtubeVideoId}?rel=0&modestbranding=1&showinfo=0`;
      }
      return getYouTubeEmbedUrl(langContent.youtubeVideoId);
    }
    if (langContent?.youtubePlaylistId) {
      return `https://www.youtube.com/embed/videoseries?list=${langContent.youtubePlaylistId}`;
    }
    if (topic?.youtubeLink) {
      return getYouTubeEmbedUrl(topic.youtubeLink);
    }
    return null;
  }, [langContent, topic]);

  // Hook up YouTube Player state listener
  useEffect(() => {
    if (!activeVideoEmbedUrl || learningStep !== 1) return;

    let checkYTInterval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYTInterval);
        
        try {
          if (playerRef.current) {
            playerRef.current.destroy();
            playerRef.current = null;
          }
        } catch (e) {
          console.warn("Error destroying previous player", e);
        }

        try {
          playerRef.current = new window.YT.Player('tutorial-video-iframe', {
            events: {
              onStateChange: (event) => {
                // 0 is YT.PlayerState.ENDED
                if (event.data === 0) {
                  setIsVideoFinished(true);
                  toast.success("Tutorial video completed! Assessment is now unlocked! 🔓");
                }
              }
            }
          });
        } catch (err) {
          console.warn("Failed to instantiate YT.Player:", err);
        }
      }
    }, 1000);

    return () => {
      clearInterval(checkYTInterval);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {}
      }
    };
  }, [activeVideoEmbedUrl, learningStep]);

  // Reset boilerplate when topic, language, or difficulty changes
  useEffect(() => {
    if (langContent?.editorBoilerplate) {
      setEditorCode(langContent.editorBoilerplate);
      setTestResults([]);
      setConsoleLogs([]);
      setCompilerStatus('idle');
      setChallengePassed(false);
    }
  }, [id, selectedLang, activeDifficulty, langContent?.editorBoilerplate]);

  // Restores a historical submission back into the editor
  const handleLoadSubmission = (subCode, subLang) => {
    setSelectedLang(normalizeDsaLanguage(subLang));
    setEditorCode(subCode);
    toast.success("Loaded past submission code into the editor!");
  };

  // Play confetti animation
  const triggerConfettiExplosion = () => {
    const arr = [];
    const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
    for (let i = 0; i < 60; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * -20 - 10,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 6 + 5
      });
    }
    setParticles(arr);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setParticles([]);
    }, 3000);
  };

  // Safe client-side transpiler from Python, C++, Java to JS
  const transpileToJS = (code, language) => {
    let js = code;
    const lang = (language || 'cpp').toLowerCase();
    
    if (lang === 'javascript' || lang === 'js') {
      return js;
    }

    if (lang === 'python') {
      // Basic Python to JS transpiler
      js = js.replace(/#\s*(.*)$/gm, '// $1');
      js = js.replace(/\bpass\b/g, '');
      js = js.replace(/import\s+\w+/g, '');
      js = js.replace(/from\s+\w+\s+import\s+\w+/g, '');
      js = js.replace(/class\s+(\w+):/g, 'class $1 {');
      js = js.replace(/\bif\s+(.+?):/g, 'if ($1):');
      js = js.replace(/\belif\s+(.+?):/g, 'elif ($1):');
      js = js.replace(/\bwhile\s+(.+?):/g, 'while ($1):');
      
      // Remove type annotations in parameter lists and functions
      js = js.replace(/^(\s*)def\s+(\w+)\(([^)]*)\)\s*(->\s*[\w[\]]+)?:/gm, (match, indent, name, params) => {
        const cleanParams = params.split(',').map(p => {
          const parts = p.split(':');
          return parts[0].replace('self', '').trim();
        }).filter(Boolean).join(', ');
        
        const isStandalone = indent.length === 0;
        if (name === '__init__') {
          return `${indent}constructor(${cleanParams}) {`;
        }
        return isStandalone ? `${indent}function ${name}(${cleanParams}) {` : `${indent}${name}(${cleanParams}) {`;
      });

      // Replace Python syntax and logic keywords
      js = js.replace(/\bself\./g, 'this.');
      js = js.replace(/\bTrue\b/g, 'true');
      js = js.replace(/\bFalse\b/g, 'false');
      js = js.replace(/\bNone\b/g, 'null');
      js = js.replace(/\band\b/g, '&&');
      js = js.replace(/\bor\b/g, '||');
      js = js.replace(/\bnot\b/g, '!');
      js = js.replace(/\belif\b/g, 'else if');

      // Parsing Python indentation levels into braces
      const lines = js.split('\n');
      let output = [];
      let indentStack = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) {
          output.push(line);
          continue;
        }
        
        const match = line.match(/^(\s*)/);
        const indent = match ? match[1].length : 0;
        
        while (indentStack.length > 0 && indent < indentStack[indentStack.length - 1]) {
          indentStack.pop();
          output.push(' '.repeat(indentStack.length) + '}');
        }
        
        output.push(line);
        
        if (line.trim().endsWith('{') || line.trim().endsWith('(') || line.trim().endsWith(':')) {
          if (output[output.length - 1].trim().endsWith(':')) {
            // Replace trailing colon with an open curly brace
            output[output.length - 1] = output[output.length - 1].replace(/:$/, ' {');
          }
          indentStack.push(indent + 4);
        }
      }
      
      while (indentStack.length > 0) {
        indentStack.pop();
        output.push(' '.repeat(indentStack.length) + '}');
      }
      
      js = output.join('\n');
      
      // Division conversions
      js = js.replace(/(\w+)\s*\/\/\s*(\w+)/g, 'Math.floor($1 / $2)');
      js = js.replace(/(\w+)\s*\/\/=\s*(\w+)/g, '$1 = Math.floor($1 / $2)');

      // Strip class Solution if it was transpiled into the output
      if (js.includes('class Solution')) {
        js = js.replace(/class\s+Solution\s*\{/, '');
        const lastBraceIdx = js.lastIndexOf('}');
        if (lastBraceIdx !== -1) {
          js = js.slice(0, lastBraceIdx) + js.slice(lastBraceIdx + 1);
        }
      }
    }

    if (lang === 'cpp' || lang === 'java') {
      // Safe outer Solution class stripping for Java/C++ LeetCode style
      if (js.includes('class Solution')) {
        js = js.replace(/(?:public\s+)?class\s+Solution\s*\{/, '');
        const lastBraceIdx = js.lastIndexOf('}');
        if (lastBraceIdx !== -1) {
          js = js.slice(0, lastBraceIdx) + js.slice(lastBraceIdx + 1);
        }
      }

      // C++/Java to JS Type and Object translations
      js = js.replace(/#include\s+[<"][\w\/\.\+]+[>"]/g, '');
      js = js.replace(/import\s+java\..*;/g, '');
      js = js.replace(/package\s+[\w\.]+;/g, '');
      js = js.replace(/using\s+namespace\s+\w+;/g, '');
      js = js.replace(/\bstd::/g, '');
      js = js.replace(/(?:public\s+)?class\s+\w+\s*\{/g, ''); // strip outer wrapper class
      js = js.replace(/public\s+static\s+/g, '');
      js = js.replace(/private\s+/g, '');
      js = js.replace(/\b(public|private|protected)\s*:/g, ''); // C++ label modifiers
      
      // Remove complex types (vectors, pointers, arrays, references) without trailing word boundary
      js = js.replace(/\b(vector<int>&|vector<string>&|vector<double>&|vector<int>|vector<string>|vector<double>|TreeNode\*|ListNode\*|int\*|char\*|double\*|int\[\]|string\[\]|double\[\]|float\[\]|const)(?:\b)?/g, '');
      
      // Remove standard primitive types with word boundaries
      js = js.replace(/\b(int|bool|double|void|float|long|long\s+long|string|char|TreeNode|ListNode)\b/g, '');
      
      // Strip any stray C++ reference/pointer symbols and const keywords inside parameter declarations
      js = js.replace(/([,\(]\s*)[&*]/g, '$1');
      
      // Convert pointer arrows and nullptrs
      js = js.replace(/->/g, '.');
      js = js.replace(/\bnullptr\b/g, 'null');
      
      // Polyfill C++ vectors and standard Java ArrayList calls to native JS arrays
      js = js.replace(/\bpush_back\b/g, 'push');
      js = js.replace(/\bback\b\(\)/g, 'back');
      js = js.replace(/\bpop_back\b\(\)/g, 'pop()');
      js = js.replace(/\bsize\b\(\)/g, 'length');
      js = js.replace(/\bempty\b\(\)/g, 'length === 0');

      // Convert standalone function declaration without 'function' prefix
      js = js.replace(/^(\s*)([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/gm, (match, indent, name, params) => {
        const reserved = ['if', 'for', 'while', 'switch', 'catch', 'else', 'return'];
        if (reserved.includes(name)) {
          return match;
        }
        return `${indent}function ${name}(${params}) {`;
      });
    }

    return js;
  };

  // Robust compiler validation checks for statically typed languages & Python syntax rules
  const syntaxCheck = (code, lang) => {
    // Strip multi-line comments: /* ... */
    let cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, '');
    
    const lines = cleanCode.split('\n');
    let openBraces = 0;
    let openParens = 0;
    
    // Check braces/parens count
    for (let i = 0; i < cleanCode.length; i++) {
      if (cleanCode[i] === '{') openBraces++;
      if (cleanCode[i] === '}') openBraces--;
      if (cleanCode[i] === '(') openParens++;
      if (cleanCode[i] === ')') openParens--;
    }
    
    if (openBraces !== 0) {
      throw new Error("Compilation Error: Unmatched curly braces '{' or '}'. Check your code blocks!");
    }
    if (openParens !== 0) {
      throw new Error("Compilation Error: Unmatched parentheses '(' or ')'. Check your function calls/conditionals!");
    }

    for (let idx = 0; idx < lines.length; idx++) {
      let line = lines[idx].trim();
      const lineNum = idx + 1;
      
      // Strip trailing single-line comment
      if (line.includes('//')) {
        line = line.substring(0, line.indexOf('//')).trim();
      }
      
      // Strip trailing python comment
      if (lang === 'python' && line.includes('#')) {
        line = line.substring(0, line.indexOf('#')).trim();
      }
      
      if (!line) continue;
      
      if (lang === 'cpp' || lang === 'java') {
        // Check semicolons on statement lines
        const isControlStatement = line.startsWith('if') || line.startsWith('else') || 
                                   line.startsWith('for') || line.startsWith('while') || 
                                   line.startsWith('switch') || line.startsWith('class') || 
                                   line.startsWith('public') || line.startsWith('private') || 
                                   line.startsWith('protected') || line.startsWith('#include') || 
                                   line.startsWith('using namespace');
        const endsWithBlock = line.endsWith('{') || line.endsWith('}');
        
        if (!isControlStatement && !endsWithBlock && !line.endsWith(';')) {
          throw new Error(`expected ';' at the end of statement on line ${lineNum}`);
        }
        
        if (lang === 'cpp') {
          if (line.includes('cout') && line.includes('>>')) {
            throw new Error(`invalid stream insertion operator '>>' on line ${lineNum}. Did you mean '<<'?`);
          }
          if (line.includes('cin') && line.includes('<<')) {
            throw new Error(`invalid stream extraction operator '<<' on line ${lineNum}. Did you mean '>>'?`);
          }
        }
        
        if (lang === 'java') {
          if (line.includes('console.log') || line.includes('print(')) {
            throw new Error(`Java uses System.out.println() on line ${lineNum}, not console.log/print.`);
          }
        }
      }
      
      if (lang === 'python') {
        const isHeader = line.startsWith('def ') || line.startsWith('if ') || 
                         line.startsWith('elif ') || line.startsWith('else:') || 
                         line.startsWith('for ') || line.startsWith('while ');
        if (isHeader && !line.endsWith(':')) {
          throw new Error(`expected ':' at the end of header declaration on line ${lineNum}`);
        }
        if (line.includes('console.log') || line.includes('System.out') || line.includes('cout')) {
          throw new Error(`Python uses print() for output on line ${lineNum}.`);
        }
      }
      
      if (lang === 'javascript') {
        if (line.includes('System.out') || line.includes('cout') || line.includes('print(')) {
          throw new Error(`JavaScript uses console.log() for output on line ${lineNum}.`);
        }
      }
    }
  };

  // Genuine Sandboxed Code Execution Engine
  const executeSandbox = (userCode, lang, testCases, fnNameOverride = null) => {
    // Standard DS structures and vector prototypes injected in dynamic runner
    const polyfills = `
      class TreeNode {
        constructor(val, left = null, right = null) {
          this.val = val;
          this.left = left;
          this.right = right;
        }
      }
      class ListNode {
        constructor(val, next = null) {
          this.val = val;
          this.next = next;
        }
      }
      function createList(arr) {
        if (!arr || arr.length === 0) return null;
        let head = new ListNode(arr[0]);
        let curr = head;
        for (let i = 1; i < arr.length; i++) {
          curr.next = new ListNode(arr[i]);
          curr = curr.next;
        }
        return head;
      }
      function createTree(arr) {
        if (!arr || arr.length === 0) return null;
        let root = new TreeNode(arr[0]);
        let queue = [root];
        let i = 1;
        while (queue.length > 0 && i < arr.length) {
          let curr = queue.shift();
          if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            curr.left = new TreeNode(arr[i]);
            queue.push(curr.left);
          }
          i++;
          if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            curr.right = new TreeNode(arr[i]);
            queue.push(curr.right);
          }
          i++;
        }
        return root;
      }
      Array.prototype.back = function() { return this[this.length - 1]; };
      Array.prototype.empty = function() { return this.length === 0; };
      Array.prototype.push_back = function(x) { this.push(x); };
      Array.prototype.pop_back = function() { return this.pop(); };
    `;

    const logs = [];
    const results = [];

    logs.push(`⚡ Initializing compiler sandbox for ${lang.toUpperCase()}...`);

    if (!userCode || !userCode.trim()) {
      logs.push(`💥 Compilation Error: Solution code is empty!`);
      throw new Error("Compilation Error: Please write your solution code before running or submitting.");
    }

    // Run robust syntax checker
    try {
      syntaxCheck(userCode, lang);
    } catch (syntaxErr) {
      logs.push(`💥 Compilation Error: ${syntaxErr.message}`);
      throw new Error(`Compilation Error: ${syntaxErr.message}`);
    }

    logs.push(`📦 Parsing AST and transpiling constructs...`);
    
    let transpiled = '';
    try {
      transpiled = transpileToJS(userCode, lang);
    } catch (e) {
      logs.push(`💥 Transpilation Error: ${e.message}`);
      throw new Error(`Transpilation Error: ${e.message}`);
    }

    // Verify transpiled JS syntax first to catch early syntax/compilation errors
    try {
      const compileBody = polyfills + "\n" + transpiled;
      new Function(compileBody);
      logs.push(`✨ Syntax validation passed! No compilation errors detected.`);
    } catch (err) {
      logs.push(`💥 Compilation Syntax Error: ${err.message}`);
      throw new Error(`Compilation Error: ${err.message}`);
    }

    const normalizedTitle = (topic?.title || '').toLowerCase();

    logs.push(`⚙️ Evaluating standard check assertions...`);

    // Completely dynamic function name execution based on active level
    const fnName = fnNameOverride || langContent?.functionName || 'solution';
    const getCallExpr = (input) => `return String(${fnName}(${input}));`;

    testCases.forEach((tc, idx) => {
      const isHidden = idx >= 2;
      const runnerBody = polyfills + '\n' + transpiled + '\n' + getCallExpr(tc.input);

      try {
        const evalFn = new Function(runnerBody);
        const actualOutput = evalFn();
        
        const cleanActual = String(actualOutput).trim();
        const cleanExpected = String(tc.expected).trim();
        const isMatch = cleanActual === cleanExpected;
        
        results.push({
          ...tc,
          actual: cleanActual,
          status: isMatch ? 'passed' : 'failed',
          isHidden
        });
        
        if (isMatch) {
          if (isHidden) {
            logs.push(`🟢 Hidden Test Case ${idx + 1}: Passed successfully!`);
          } else {
            logs.push(`🟢 Sample Test Case ${idx + 1}: Passed! Expected: ${tc.expected}, Got: ${actualOutput}`);
          }
        } else {
          if (isHidden) {
            logs.push(`❌ Hidden Test Case ${idx + 1}: Failed (Wrong Answer)`);
          } else {
            logs.push(`❌ Sample Test Case ${idx + 1}: Failed! Expected: ${tc.expected}, Got: ${actualOutput}`);
          }
        }
      } catch (err) {
        results.push({
          ...tc,
          actual: `Error: ${err.message}`,
          status: 'failed',
          isHidden
        });
        if (isHidden) {
          logs.push(`💥 Hidden Test Case ${idx + 1}: Runtime Error!`);
        } else {
          logs.push(`💥 Sample Test Case ${idx + 1}: Runtime Error! ${err.message}`);
        }
      }
    });

    return { results, logs };
  };

  // Run code validation test cases (mock sandbox run)
  const handleRunCode = () => {
    setChallengePassed(false); // CRITICAL BUG FIX: Reset on run
    setCompilerStatus('running');
    setActiveConsoleTab('result');
    setConsoleLogs([
      `⚡ Initializing interactive environment for ${selectedLang.toUpperCase()}...`,
      `📦 Parsing source code syntax...`,
      `⚙️ Executing standard check assertions...`
    ]);

    setTimeout(() => {
      try {
        const { results, logs } = executeSandbox(editorCode, selectedLang, langContent.testCases);
        setTestResults(results);
        setConsoleLogs(logs);

        const passedAll = results.every(r => r.status === 'passed');
        if (passedAll) {
          setCompilerStatus('passed');
          setChallengePassed(true);
          playSoundEffect('success');
          toast.success("All test cases passed! Ready to submit! 🏆", { icon: '✨' });
        } else {
          setCompilerStatus('failed');
          setChallengePassed(false); // Strictly reset
          playSoundEffect('error');
          toast.error("Some test cases failed. Keep refining your logic!");
        }
      } catch (err) {
        setChallengePassed(false); // Strictly reset
        if (err.message.includes("Compilation Error")) {
          setCompilerStatus('compile_error');
        } else {
          setCompilerStatus('failed');
        }
        setConsoleLogs(prev => [...prev, `💥 Compiler Panic Error: ${err.message}`]);
        playSoundEffect('error');
        toast.error("Compilation / Execution Failed!");
      }
    }, 1200);
  };

  const getRank = (xp) => {
    if (xp >= 15000) return { title: 'Pro', badge: 'Recursion Wizard', style: 'badge-emerald text-emerald-400' };
    if (xp >= 5000) return { title: 'Coder', badge: 'Array Tactician', style: 'badge-gold text-amber-400' };
    if (xp >= 1000) return { title: 'Apprentice', badge: 'Loop Master', style: 'badge-silver text-slate-300' };
    return { title: 'Beginner', badge: 'Hello World Pioneer', style: 'text-indigo-400' };
  };

  const handleGamificationUpdate = () => {
    let totalXP = parseInt(localStorage.getItem('dsa_total_xp') || '0', 10);
    let streak = parseInt(localStorage.getItem('dsa_streak') || '0', 10);
    let lastSolveDate = localStorage.getItem('dsa_last_solve_date') || '';
    
    const todayStr = new Date().toDateString();
    const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
    
    if (lastSolveDate === yesterdayStr) {
      streak += 1;
    } else if (lastSolveDate !== todayStr) {
      streak = 1;
    }
    
    localStorage.setItem('dsa_streak', streak.toString());
    localStorage.setItem('dsa_last_solve_date', todayStr);
    
    const firstSolveKey = `dsa_first_solve_${id}_${activeDifficulty}`;
    const isFirstSolve = !localStorage.getItem(firstSolveKey);
    let xpEarned = 100;
    
    if (isFirstSolve) {
      xpEarned += 50;
      localStorage.setItem(firstSolveKey, 'true');
    }
    
    const prevXP = totalXP;
    totalXP += xpEarned;
    localStorage.setItem('dsa_total_xp', totalXP.toString());
    
    const oldRank = getRank(prevXP);
    const newRank = getRank(totalXP);
    const leveledUp = oldRank.title !== newRank.title;
    
    // Core Quotes Catalog from Blueprint
    const quotesFirstSolve = [
      "System output confirmed! You just successfully converted logic into code. The compiler nods in quiet respect.",
      "One small return statement for you, one giant leap for your software career. Welcome to the coder club!",
      "Variables declared, conditions met, and test cases conquered. The journey of a thousand algorithms begins with a single pass!"
    ];
    const quotesStreak = [
      "Three days in a row! Your brain is starting to compile logic faster than your local processor. Keep the streak active!",
      "5-Day Streak achieved! Like a well-optimized system, you are running at peak efficiency. Keep up the rhythm!",
      "Unstoppable! A full week of active coding. Your neural network is training beautifully on daily logic patterns."
    ];
    const quotesPerformance = [
      "Execution completed in record time! Your code runs with such lean simplicity, even the garbage collector is taking notes.",
      "A perfectly clean submission. Not a single redundant variable in sight. That's pure structural art!",
      "All test cases passed on the first run! Your logical foresight is starting to resemble an advanced static code analysis tool."
    ];
    
    let quote = "";
    if (streak === 3) {
      quote = quotesStreak[0];
    } else if (streak === 5) {
      quote = quotesStreak[1];
    } else if (streak >= 7 && streak % 7 === 0) {
      quote = quotesStreak[2];
    } else if (isFirstSolve) {
      quote = quotesFirstSolve[Math.floor(Math.random() * quotesFirstSolve.length)];
    } else {
      const allQuotes = [...quotesFirstSolve, ...quotesPerformance];
      quote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    }
    
    setCelebrationData({
      xpEarned,
      streak,
      quote,
      rank: newRank,
      leveledUp
    });
  };

  // Submits the code attempt, persisting to backend
  const handleSubmitCode = async () => {
    setChallengePassed(false); // CRITICAL BUG FIX: Reset on submit
    setCompilerStatus('running');
    setActiveConsoleTab('result');
    setConsoleLogs([
      `🚀 Initiating heavy-duty submission compiler suite...`,
      `📦 Packaging solution code files...`,
      `⚙️ Executing sandboxed test evaluation suite...`
    ]);

    setTimeout(async () => {
      try {
        const startTime = performance.now();
        const { results, logs } = executeSandbox(editorCode, selectedLang, langContent.testCases);
        const endTime = performance.now();
        
        setTestResults(results);
        setConsoleLogs(logs);

        const passedAll = results.every(r => r.status === 'passed');
        const passedCount = results.filter(r => r.status === 'passed').length;
        const totalCount = results.length;
        const runtime = Math.round(endTime - startTime + Math.random() * 5 + 5);

        const status = passedAll ? 'Accepted' : 'Wrong Answer';
        
        if (passedAll) {
          setCompilerStatus('passed');
          setChallengePassed(true);
          playSoundEffect('success');
          triggerConfettiExplosion();
          toast.success("Submission Accepted! +100 Quest XP Unlocked! 🏆", { icon: '✨' });
          
          // Progressive Difficulty Unlock Mechanism
          localStorage.setItem(`dsa_completed_${id}_${activeDifficulty}`, 'true');
          const difficulties = ['beginner', 'easy', 'medium', 'challenge'];
          const currentIdx = difficulties.indexOf(activeDifficulty);
          if (currentIdx !== -1 && currentIdx < difficulties.length - 1) {
            const nextDiff = difficulties[currentIdx + 1];
            toast.success(`New rank unlocked: ${nextDiff.toUpperCase()}! 🚀`);
          }
          
          // Trigger local gamification updates & celebration modal
          handleGamificationUpdate();
          
          // Automatically complete the topic in the background if not already completed!
          const isAlreadyCompleted = user?.completedTopics?.some(t => t.topicId === id || t.topicId?._id === id);
          if (!isAlreadyCompleted) {
            try {
              const res = await api.post('/progress/complete-topic', { 
                topicId: id,
                studyTimeMinutes: Number(studyTime),
                notes: notes || 'Code submitted successfully via editor.',
                difficultyFeedback: difficultyFeedback || 'easy',
                confidenceLevel: confidenceLevel || 5,
                revisionNeeded: false
              });
              if (res.data.success) {
                const { newlyEarnedBadges, newlyEarnedCertificate } = res.data.data;
                if ((newlyEarnedBadges && newlyEarnedBadges.length > 0) || newlyEarnedCertificate) {
                  setCelebrationData(prev => prev ? {
                    ...prev,
                    newlyEarnedBadges,
                    newlyEarnedCertificate
                  } : null);
                }
              }
            } catch (autoErr) {
              console.error('Failed to auto-complete topic:', autoErr);
            }
          }
        } else {
          setCompilerStatus('failed');
          setChallengePassed(false); // Strictly reset
          playSoundEffect('error');
          toast.error("Submission Failed: Wrong Answer");
        }

        // Save to Database Submission History
        await api.post('/progress/submit-code', {
          topicId: id,
          code: editorCode,
          language: selectedLang,
          status,
          passedCount,
          totalCount,
          runtime
        });

        // Pull latest updates from DB
        fetchSubmissions();
        await refreshUser();

      } catch (err) {
        setChallengePassed(false); // Strictly reset
        if (err.message.includes("Compilation Error")) {
          setCompilerStatus('compile_error');
        } else {
          setCompilerStatus('failed');
        }
        setConsoleLogs(prev => [...prev, `💥 Submission crashed: ${err.message}`]);
        playSoundEffect('error');
        toast.error("Submission crashed! Check your syntax.");
      }
    }, 1500);
  };

  // Submit topic complete manually
  const handleComplete = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/progress/complete-topic', { 
        topicId: id,
        studyTimeMinutes: Number(studyTime),
        notes,
        difficultyFeedback,
        confidenceLevel,
        revisionNeeded
      });
      await refreshUser();
      toast.success('Expedition Completed successfully! +50 XP 🚀');
      
      const { newlyEarnedBadges, newlyEarnedCertificate } = res.data.data;
      if ((newlyEarnedBadges && newlyEarnedBadges.length > 0) || newlyEarnedCertificate) {
        setCelebrationData({
          xpEarned: 50,
          streak: res.data.data.dailyStreak || 1,
          quote: "Fantastic work! You have unlocked new badges or certificates.",
          rank: { badge: "Mastered", title: "Topic Complete", style: "text-emerald-500" },
          leveledUp: false,
          newlyEarnedBadges,
          newlyEarnedCertificate,
          navigateOnClose: '/roadmap'
        });
      } else {
        navigate('/roadmap');
      }
    } catch (err) {
      toast.error('Failed to log quest completion progress');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
    </div>
  );

  if (!topic) return null;

  // ─── CHECKPOINT MODULE FULL RENDER (Start Coding Level 0) ──────────────────
  if (isCheckpointModule) {
    const cpContent = activeCheckpointContent;
    const cpVideoUrl = checkpointVideoEmbedUrl;
    // isLastCheckpoint comes from the content data itself — no hardcoding
    const isLastCp = cpContent?.isLastCheckpoint || false;
    const currentCpIndex = CHECKPOINTS.indexOf(activeCheckpoint);
    const allDone = completedCheckpoints.length === CHECKPOINTS.length;

    // Run code against checkpoint-specific test cases and function name
    const handleCheckpointRunCode = () => {
      if (!cpContent) return;
      setChallengePassed(false);
      setCompilerStatus('running');
      setActiveConsoleTab('result');
      setConsoleLogs([
        '⚡ Compiling your code...',
        `📋 Running ${cpContent.testCases.length} test case(s)...`
      ]);
      setTimeout(() => {
        try {
          const { results, logs } = executeSandbox(editorCode, selectedLang, cpContent.testCases, cpContent.functionName);
          setTestResults(results);
          setConsoleLogs(logs);
          const passedAll = results.every(r => r.status === 'passed');
          if (passedAll) {
            setCompilerStatus('passed');
            setChallengePassed(true);
            setCheckpointCodePassed(true);
            playSoundEffect('success');
            toast.success('🎉 All test cases passed! You can now complete this checkpoint!');
          } else {
            setCompilerStatus('failed');
            setChallengePassed(false);
            setCheckpointCodePassed(false);
            playSoundEffect('error');
            toast.error('❌ Some tests failed. Check the hints and try again! 💪');
          }
        } catch (err) {
          setCompilerStatus('compile_error');
          if (err.message.includes('Maximum call stack size exceeded')) {
            setConsoleLogs(prev => [...prev, `💥 CODE GURU: Stack Overflow Detected! You missed a base case or your recursive call isn't reducing the problem size.`]);
            toast.error('Code Guru: Stack Overflow! Check your base case.');
          } else {
            setConsoleLogs(prev => [...prev, `💥 Compilation Error: ${err.message}`]);
            toast.error('Compilation Error — check your syntax!');
          }
          playSoundEffect('error');
        }
      }, 1000);
    };

    return (
      <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[var(--bg-main)] relative">

        {/* Backdrop overlay for Checkpoint sidebar on mobile */}
        {isMobile && isCpSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300 cursor-pointer"
            onClick={() => setIsCpSidebarOpen(false)}
          />
        )}

        {/* ── CHECKPOINT SIDEBAR ────────────────────────────────────────────── */}
        <div className={`bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col h-full overflow-hidden transition-transform duration-300 ease-in-out shrink-0
          ${isMobile 
            ? 'absolute top-0 left-0 bottom-0 z-50 w-72 shadow-2xl' 
            : 'w-72'
          }
          ${isMobile && !isCpSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        `}>

          {/* Header: gradient brand block */}
          <div className="p-4 border-b border-[var(--border)] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 shrink-0">
            <Link to="/roadmap" className="flex items-center gap-1.5 text-white/60 hover:text-white text-[9px] font-black uppercase tracking-widest mb-3 transition-colors group">
              <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" /> Back to Roadmap
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl shadow-inner">🚀</div>
              <div>
                <div className="text-white font-black text-sm leading-tight">{topic?.title || 'Start Coding'}</div>
                <div className="text-white/50 text-[9px] font-bold uppercase tracking-widest mt-0.5">{topic?.difficulty ? `Level 1 · ${topic.difficulty}` : 'Level 0 · Foundations'}</div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-[9px] font-black uppercase tracking-wider">Your Progress</span>
                <span className="text-white text-[9px] font-black">{completedCheckpoints.length} / {CHECKPOINTS.length} done</span>
              </div>
              <div className="h-2 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${(completedCheckpoints.length / CHECKPOINTS.length) * 100}%` }}
                />
              </div>
              {allDone && (
                <div className="text-[9px] font-black text-emerald-400 text-center pt-0.5">🎓 Level 0 Mastered!</div>
              )}
            </div>
          </div>

          {/* Language selector */}
          <div className="px-4 pt-3 pb-3 border-b border-[var(--border)] shrink-0">
            <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-wider mb-2">Coding Language</div>
            <div className="flex gap-1">
              {[{ key: 'cpp', label: 'C++' }, { key: 'java', label: 'Java' }, { key: 'python', label: 'Python' }, { key: 'javascript', label: 'JS' }].map(l => (
                <button
                  key={l.key}
                  onClick={() => { setSelectedLang(l.key); setEditorCode(''); }}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${selectedLang === l.key ? 'bg-[var(--primary)] text-white shadow-sm' : 'bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checkpoint navigation list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-widest px-1 mb-1">Your Journey</div>
            {CHECKPOINTS.map((cpId, idx) => {
              const isActive = activeCheckpoint === cpId;
              const isDone = completedCheckpoints.includes(cpId);
              const isLocked = idx > 0 && !completedCheckpoints.includes(CHECKPOINTS[idx - 1]);
              const cpLabel = CHECKPOINT_LABELS[cpId];
              const cpIcon = CHECKPOINT_ICONS[cpId];

              return (
                <button
                  key={cpId}
                  disabled={isLocked}
                  onClick={() => {
                    if (isLocked) { toast.error('Complete the previous checkpoint first! 🔒'); return; }
                    setActiveCheckpoint(cpId);
                    localStorage.setItem(`dsa_checkpoint_${id}`, cpId);
                    setCheckpointVideoFinished(false);
                    setCheckpointCodePassed(false);
                    setEditorCode('');
                    setCompilerStatus('idle');
                    setTestResults([]);
                    setConsoleLogs([]);
                    setIsCpSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--primary-light)] border-[var(--primary)]/40 shadow-sm ring-1 ring-[var(--primary)]/20'
                      : isDone
                        ? 'bg-emerald-500/8 border-emerald-500/25 hover:bg-emerald-500/12 cursor-pointer'
                        : isLocked
                          ? 'bg-[var(--bg-sub)] border-dashed border-[var(--border)] opacity-35 cursor-not-allowed'
                          : 'bg-[var(--bg-sub)] border-[var(--border)] hover:bg-[var(--bg-card)] cursor-pointer'
                  }`}
                >
                  {/* Status indicator */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-black shadow-sm border ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isActive
                        ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                        : isLocked
                          ? 'bg-zinc-800 border-zinc-700 text-zinc-600'
                          : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)]'
                  }`}>
                    {isDone ? '✓' : isLocked ? '🔒' : cpIcon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-[11px] font-black leading-tight truncate ${
                      isActive ? 'text-[var(--primary)]' : isDone ? 'text-emerald-500' : 'text-[var(--text-main)]'
                    }`}>
                      {cpLabel}
                    </div>
                    <div className="text-[9px] text-[var(--text-muted)] font-semibold mt-0.5">
                      {isDone ? '✅ Completed' : isActive ? '▶ In progress' : isLocked ? '🔒 Locked' : `Watch · Code · Unlock`}
                    </div>
                  </div>

                  {/* Checkpoint number badge */}
                  <div className={`text-[8px] font-black rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ${
                    isDone ? 'bg-emerald-500/20 text-emerald-500' : isActive ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
                  }`}>
                    {idx + 1}
                  </div>
                </button>
              );
            })}
          </div>

          {/* All-done: Claim rewards button */}
          {allDone && (
            <div className="p-4 border-t border-[var(--border)] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 shrink-0">
              <div className="text-center space-y-3">
                <div className="text-3xl">🎓</div>
                <div>
                  <div className="text-sm font-black text-emerald-500">{topic?.title || 'Start Coding'} Complete!</div>
                  <div className="text-[9px] text-[var(--text-muted)] font-semibold mt-0.5">You've mastered all {CHECKPOINTS.length} checkpoints</div>
                </div>
                <button
                  onClick={async () => {
                    try {
                      setSubmitting(true);
                      await api.post('/progress/complete-topic', {
                        topicId: id, studyTimeMinutes: 90,
                        notes: `Completed all ${CHECKPOINTS.length} checkpoints for ${topic?.title || 'Start Coding'}!`,
                        difficultyFeedback: 'easy', confidenceLevel: 5, revisionNeeded: false
                      });
                      await refreshUser();
                      toast.success(`🚀 ${topic?.title || 'Start Coding'} Complete! +150 XP earned!`);
                      navigate('/roadmap');
                    } catch { toast.error('Failed to save. Try again.'); }
                    finally { setSubmitting(false); }
                  }}
                  disabled={submitting}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20"
                >
                  Claim Rewards 🏆
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── MAIN SPLIT WORKSPACE ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">

          {/* Mobile Tabs Header */}
          {isMobile && (
            <div className="flex bg-[var(--bg-sub)] border-b border-[var(--border)] shrink-0 items-center justify-between px-4 py-1.5">
              <div className="flex flex-1 gap-1">
                <button
                  onClick={() => setActiveWorkspaceTab('learn')}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    activeWorkspaceTab === 'learn'
                      ? 'bg-[var(--primary)] text-white shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  🎬 Learn
                </button>
                <button
                  onClick={() => setActiveWorkspaceTab('code')}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    activeWorkspaceTab === 'code'
                      ? 'bg-[var(--primary)] text-white shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  ⚡ Code
                </button>
              </div>
              <button
                onClick={() => setIsCpSidebarOpen(!isCpSidebarOpen)}
                className="ml-4 p-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] shrink-0 flex items-center justify-center shadow-xs"
                title="Toggle Journey"
              >
                <FiList className="text-base" />
              </button>
            </div>
          )}

          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">

            {/* LEFT: Video + Problem */}
            <div 
              style={{ width: isMobile ? '100%' : `${leftWidth}%` }} 
              className={`h-full flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)] overflow-hidden shrink-0
                ${isMobile && activeWorkspaceTab !== 'learn' ? 'hidden' : 'flex'}
              `}
            >

            {/* Checkpoint header bar */}
            <div className="bg-[var(--bg-sub)] border-b border-[var(--border)] px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="text-xl">{CHECKPOINT_ICONS[activeCheckpoint]}</div>
                <div>
                  <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-widest">
                    Checkpoint {currentCpIndex + 1} of {CHECKPOINTS.length}
                  </div>
                  <div className="text-sm font-black text-[var(--text-main)] leading-tight">{CHECKPOINT_LABELS[activeCheckpoint]}</div>
                  {cpContent?.subtitle && (
                    <div className="text-[9px] text-[var(--text-muted)] font-semibold mt-0.5">{cpContent.subtitle}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isLastCp ? (
                  <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-[9px] font-black shadow tracking-wider flex items-center gap-1.5">
                    <FiZap size={10} /> Final Challenge
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-[9px] font-black shadow tracking-wider flex items-center gap-1.5">
                    <FiYoutube size={10} /> Watch &amp; Code
                  </div>
                )}
                {completedCheckpoints.includes(activeCheckpoint) && (
                  <div className="px-2.5 py-1 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-lg text-[9px] font-black">
                    ✅ Done
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">

              {/* VIDEO SECTION — every checkpoint has its own unique video */}
              {cpVideoUrl && (
                <div className="p-5 space-y-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <FiYoutube className="text-red-500 text-base" />
                    <div>
                      <span className="text-xs font-black text-[var(--text-main)]">Tutorial Video</span>
                      <span className="ml-2 text-[9px] text-[var(--text-muted)] font-semibold">— Unique to this checkpoint</span>
                    </div>
                  </div>

                  <div className="aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-lg">
                    <iframe
                      key={`video-${activeCheckpoint}-${selectedLang}`}
                      id={`checkpoint-video-${activeCheckpoint}`}
                      className="w-full h-full"
                      src={cpVideoUrl}
                      title={`${CHECKPOINT_LABELS[activeCheckpoint]} Tutorial`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Post-video state indicator */}
                  {!checkpointVideoFinished ? (
                    <div className="flex items-center justify-between bg-[var(--bg-sub)] rounded-lg px-3 py-2 border border-[var(--border)]">
                      <span className="text-[10px] text-[var(--text-muted)] font-semibold italic">
                        👆 Watch the video, then try the challenge below →
                      </span>
                      <button
                        type="button"
                        onClick={() => { setCheckpointVideoFinished(true); toast.success('Video done! Now try it yourself 🚀'); }}
                        className="text-[9px] text-[var(--primary)] hover:text-[var(--primary-dark)] font-black uppercase tracking-wider cursor-pointer border-none bg-transparent ml-3 whitespace-nowrap"
                      >
                        ⚡ Mark Done
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2.5">
                      <span className="text-emerald-500 text-base">✅</span>
                      <div>
                        <div className="text-[10px] font-black text-emerald-500">Video Complete!</div>
                        <div className="text-[9px] text-[var(--text-muted)] font-semibold">Now try it yourself — solve the challenge on the right! 💪</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VISUALIZER SECTION */}
              {cpContent && cpContent.visualizationData && (
                <div className="p-5 border-b border-[var(--border)] h-[600px]">
                  <RecursionVisualizer visualizationData={cpContent.visualizationData} />
                </div>
              )}

              {/* CHALLENGE SECTION */}
              {cpContent && (
                <div className="p-5 space-y-4">

                  {/* "Now try this yourself" motivating header */}
                  {checkpointVideoFinished && (
                    <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl space-y-1">
                      <div className="text-sm font-black text-[var(--text-main)] flex items-center gap-2">
                        <span>💡</span> Now try this yourself!
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] font-semibold leading-relaxed">
                        You just watched the concept. Now it's your turn to write the code. Read the problem, think through the logic, and hit Run Code on the right.
                      </p>
                    </div>
                  )}

                  {/* Challenge title */}
                  {cpContent.challengeTitle && (
                    <div className="flex items-center gap-2">
                      <FiCode className="text-[var(--primary)] text-sm" />
                      <span className="text-sm font-black text-[var(--text-main)]">{cpContent.challengeTitle}</span>
                    </div>
                  )}

                  {/* Problem statement */}
                  <div className="p-4 bg-[var(--bg-sub)] rounded-xl border border-[var(--border)] space-y-2">
                    <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider">Problem</div>
                    <p className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed whitespace-pre-line">
                      {cpContent.challengeDescription}
                    </p>
                  </div>

                  {/* Constraints */}
                  {cpContent.constraints && cpContent.constraints !== 'None' && cpContent.constraints !== 'None — just return the exact string.' ? (
                    <div className="p-3 bg-[var(--bg-sub)] rounded-xl border border-[var(--border)]">
                      <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Constraints</div>
                      <div className="font-mono text-[10px] text-[var(--text-main)]">{cpContent.constraints}</div>
                    </div>
                  ) : null}

                  {/* Sample test cases */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-black text-[var(--text-main)] flex items-center gap-1.5">
                      📋 Sample Test Cases
                    </div>
                    {cpContent.testCases.slice(0, 2).map((tc, tidx) => (
                      <div key={tidx} className="p-3 bg-[var(--bg-sub)] rounded-lg border border-[var(--border)] font-mono text-[10px] flex items-center gap-3">
                        <div className="text-[var(--text-muted)]">
                          Input: <span className="text-[var(--text-main)] font-black">{tc.input || '(no input)'}</span>
                        </div>
                        <div className="text-zinc-600">→</div>
                        <div className="text-[var(--text-muted)]">
                          Expected: <span className="text-emerald-400 font-black">{tc.expected}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Hints */}
                  {cpContent.hints && cpContent.hints.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-black text-[var(--text-main)]">💡 Hints (open if stuck)</div>
                      {cpContent.hints.map((hint, hidx) => (
                        <details key={hidx} className="group border border-[var(--border)] bg-[var(--bg-sub)] rounded-lg px-3 py-2 cursor-pointer">
                          <summary className="text-[10px] font-bold text-[var(--text-main)] flex items-center justify-between select-none">
                            <span>Hint {hidx + 1}</span>
                            <span className="text-[var(--text-light)] group-open:rotate-180 transition-transform text-xs">▼</span>
                          </summary>
                          <p className="mt-2 text-[10px] text-[var(--text-muted)] font-semibold leading-relaxed">{hint}</p>
                        </details>
                      ))}
                    </div>
                  )}

                  {/* Complete checkpoint button */}
                  <button
                    onClick={() => {
                      if (!checkpointVideoFinished) {
                        toast.error('Watch the video first! Click "Mark Done" when finished. 🎬');
                        return;
                      }
                      if (!checkpointCodePassed) {
                        toast.error('Pass all test cases first! Write your code and click Run Code. ⚡');
                        return;
                      }
                      markCheckpointComplete(activeCheckpoint);
                      setCheckpointCodePassed(false);
                      setEditorCode('');
                      setCompilerStatus('idle');
                      setTestResults([]);
                      setConsoleLogs([]);
                    }}
                    disabled={!checkpointVideoFinished || !checkpointCodePassed}
                    className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 mt-2 ${
                      !checkpointVideoFinished || !checkpointCodePassed
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 cursor-pointer hover:scale-[1.01]'
                    }`}
                  >
                    {completedCheckpoints.includes(activeCheckpoint) ? (
                      <><FiCheckCircle /> Checkpoint Done!</>
                    ) : !checkpointVideoFinished ? (
                      <>🔒 Watch the Video First</>
                    ) : !checkpointCodePassed ? (
                      <>⚡ Pass All Tests to Unlock</>
                    ) : isLastCp ? (
                      <>🏆 Complete {topic?.title || 'Level 0'}!</>
                    ) : (
                      <>✅ Complete & Unlock Next →</>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to skip this checkpoint challenge and mark it as completed?")) {
                        markCheckpointComplete(activeCheckpoint);
                        setCheckpointVideoFinished(false);
                        setCheckpointCodePassed(false);
                        setEditorCode('');
                        setCompilerStatus('idle');
                        setTestResults([]);
                        setConsoleLogs([]);
                        toast.success('Checkpoint skipped and marked as complete! 🚀');
                      }
                    }}
                    className="w-full py-2 bg-transparent border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 mt-2 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    ⏭️ Skip &amp; Complete Checkpoint
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RESIZE HANDLE */}
          {!isMobile && (
            <div
              className="w-1 h-full bg-[var(--border)] hover:bg-[var(--primary)] transition-colors cursor-col-resize flex-shrink-0"
              onMouseDown={startResize}
            />
          )}

          {/* RIGHT: Monaco Editor + Console */}
          <div className={`flex-1 h-full flex flex-col overflow-hidden bg-[#1e1e1e] min-w-0
            ${isMobile && activeWorkspaceTab !== 'code' ? 'hidden' : 'flex'}
          `}>

            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#3e3e42] shrink-0">
              <div className="flex items-center gap-2">
                <FiCode className="text-[var(--primary)] text-sm" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Code Editor</span>
                <span className="text-[9px] font-bold text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                  {selectedLang.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Challenge title in editor bar */}
                {cpContent?.challengeTitle && (
                  <span className="text-[9px] text-zinc-600 font-semibold hidden sm:block">
                    {cpContent.challengeTitle}
                  </span>
                )}
                <button
                  onClick={() => { if (cpContent?.editorBoilerplate) setEditorCode(cpContent.editorBoilerplate); }}
                  className="text-[9px] font-black text-zinc-500 hover:text-zinc-200 uppercase tracking-wider transition-colors px-2.5 py-1 rounded hover:bg-zinc-700 border border-zinc-700"
                >
                  Reset ↺
                </button>
              </div>
            </div>

            {cpContent?.assessmentType === 'mcq' || cpContent?.assessmentType === 'tracing' ? (
              <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-xl font-black text-white mb-2">Interactive {cpContent.assessmentType === 'mcq' ? 'Knowledge Check' : 'Tracing Challenge'}</h3>
                <p className="text-zinc-400 mb-6 max-w-md">
                  This checkpoint focuses on conceptual understanding. Answer the questions on the left panel (or mark as done) to proceed.
                </p>
                <button
                  onClick={() => {
                    setChallengePassed(true);
                    setCheckpointCodePassed(true);
                    toast.success('Assessment completed! You can now mark this checkpoint as done.');
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-colors"
                >
                  Simulate Assessment Pass ✅
                </button>
              </div>
            ) : (
            <>
            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
              <Editor
                height="100%"
                language={selectedLang === 'cpp' ? 'cpp' : selectedLang === 'java' ? 'java' : selectedLang === 'python' ? 'python' : 'javascript'}
                value={editorCode || (cpContent?.editorBoilerplate || '')}
                theme={editorTheme}
                onChange={(val) => setEditorCode(val || '')}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  tabSize: 4,
                  wordWrap: 'on',
                  padding: { top: 16 },
                  fontLigatures: true
                }}
              />
            </div>

            {/* Run/Submit bar */}
            <div className="px-4 py-2.5 bg-[#252526] border-t border-[#3e3e42] flex items-center gap-3 shrink-0">
              <button
                onClick={handleCheckpointRunCode}
                disabled={compilerStatus === 'running'}
                className="flex items-center gap-2 px-5 py-2 bg-[#2d7d46] hover:bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-40 shadow"
              >
                <FiPlay size={11} />
                {compilerStatus === 'running' ? 'Running...' : 'Run Code'}
              </button>

              {/* Result badge */}
              {compilerStatus !== 'idle' && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black border ${
                  compilerStatus === 'passed' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                  compilerStatus === 'failed' ? 'bg-red-500/15 text-red-400 border-red-500/30' :
                  compilerStatus === 'compile_error' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' :
                  'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {compilerStatus === 'passed' ? '✅ All Passed!' :
                   compilerStatus === 'failed' ? '❌ Wrong Answer' :
                   compilerStatus === 'compile_error' ? '💥 Compile Error' : '⚡ Running...'}
                </div>
              )}

              {checkpointCodePassed && (
                <div className="ml-auto flex items-center gap-1.5 text-emerald-500 text-[10px] font-black">
                  <FiCheckCircle size={11} /> Ready to unlock!
                </div>
              )}
            </div>

            {/* Console / Test results */}
            <div className="h-44 bg-[#1a1a1a] border-t border-[#3e3e42] flex flex-col overflow-hidden shrink-0">
              <div className="flex items-center gap-4 px-4 py-1.5 bg-[#252526] border-b border-[#3e3e42]">
                <button
                  onClick={() => setActiveConsoleTab('testcase')}
                  className={`text-[10px] font-black uppercase tracking-wider pb-0.5 transition-colors ${activeConsoleTab === 'testcase' ? 'text-white border-b-2 border-[var(--primary)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setActiveConsoleTab('result')}
                  className={`text-[10px] font-black uppercase tracking-wider pb-0.5 transition-colors ${activeConsoleTab === 'result' ? 'text-white border-b-2 border-[var(--primary)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Output Log
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                {activeConsoleTab === 'testcase' ? (
                  <div className="space-y-2">
                    {testResults.length === 0 ? (
                      <p className="text-zinc-600 text-[10px] font-mono italic">Click "Run Code" to test your solution...</p>
                    ) : testResults.map((r, i) => (
                      <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg text-[10px] font-mono border ${
                        r.status === 'passed'
                          ? 'bg-emerald-500/8 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/8 text-red-400 border-red-500/20'
                      }`}>
                        <span className="text-sm">{r.status === 'passed' ? '✅' : '❌'}</span>
                        <span className="text-zinc-500">TC {i + 1}</span>
                        <span className="text-zinc-600">Expected:</span>
                        <span className="text-zinc-200 font-black">{r.expected}</span>
                        <span className="text-zinc-600">Got:</span>
                        <span className={r.status === 'passed' ? 'text-emerald-400 font-black' : 'text-red-400 font-black'}>{r.actual}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {consoleLogs.length === 0 ? (
                      <p className="text-zinc-600 text-[10px] font-mono italic">No output yet...</p>
                    ) : consoleLogs.map((log, i) => (
                      <div key={i} className="text-[10px] font-mono text-zinc-400 leading-relaxed">{log}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
    );
  }


  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full overflow-hidden bg-[var(--bg-main)] transition-colors duration-300 relative select-none">
      
      {/* Background Confetti Elements */}

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: '50%',
                transform: `rotate(${p.rotation}deg)`
              }}
              animate={{
                y: ['0vh', '100vh'],
                x: [`${p.x}%`, `${p.x + p.speedX * 4}%`],
                rotate: [p.rotation, p.rotation + 360]
              }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                ease: 'linear'
              }}
            />
          ))}
        </div>
      )}

      {/* LEFT SIDEBAR: Roadmap Navigator */}
      <div className="w-80 flex-shrink-0 bg-[var(--bg-card)] border-r border-[var(--border)] hidden lg:flex flex-col h-full overflow-y-auto custom-scrollbar transition-colors">
        <div className="p-5 flex-1">
          <Link to="/roadmap" className="flex items-center gap-2 text-[var(--text-light)] font-black text-[9px] uppercase tracking-widest mb-6 hover:text-[var(--primary)] transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" /> BACK TO MAP
          </Link>
          
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-[var(--primary-light)] text-[var(--primary)] rounded-lg flex items-center justify-center text-base shadow-inner">
              <FiZap />
            </div>
            <div>
              <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-widest leading-none mb-0.5">DSA Expedition</div>
              <div className="font-black text-[var(--text-main)] text-xs leading-tight">Level {topic.phaseId?.phaseNumber || 0}</div>
            </div>
          </div>
          
          <div className="space-y-1.5">
            {allTopics.map((t, index) => {
              const active = t._id === id;
              const done = user?.completedTopics?.some(ct => ct.topicId === t._id || ct.topicId?._id === t._id);
              return (
                <Link 
                  key={t._id} 
                  to={`/topic/${t._id}`}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all ${
                    active 
                      ? 'bg-[var(--primary-light)] border-[var(--primary)]/20 shadow-sm' 
                      : 'hover:bg-[var(--bg-sub)] border-transparent'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-all ${
                    done 
                      ? 'bg-emerald-500 text-white shadow' 
                      : active 
                        ? 'bg-[var(--primary)] text-white shadow' 
                        : 'bg-[var(--bg-sub)] text-[var(--text-light)]'
                  }`}>
                    {done ? <FiCheckCircle className="text-[10px]" /> : <span className="text-[8px] font-black">{index + 1}</span>}
                  </div>
                  <div>
                    <span className={`text-[11px] font-black leading-tight block mb-0.5 ${active ? 'text-[var(--primary)]' : done ? 'text-[var(--text-main)]' : 'text-[var(--text-light)]'}`}>
                      {t.title}
                    </span>
                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-[var(--text-light)] uppercase tracking-tighter">
                       <span>{t.difficulty}</span>
                       <span>•</span>
                       <span>{t.estimatedTime}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* DUAL-PANE Split Workspace Content */}
      <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        
        {/* LEFT PANE: Details, Approach, and Submissions */}
        <div 
          style={{ width: isDsaDomain ? `${leftWidth}%` : '100%' }} 
          className="w-full lg:w-auto h-full flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)] overflow-hidden shrink-0"
        >
          
          {/* Tabs / Stepper Bar Header */}
          <div className="bg-[var(--bg-sub)] border-b border-[var(--border)] px-4 py-2 flex flex-col shrink-0 gap-2">
            {/* Top Stepper Bar */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                {[
                  { step: 1, label: '1. Watch & Code' },
                  { step: 2, label: '2. Mini Assessment' }
                ].map(s => {
                  const isLocked = s.step === 2 && !isCompleted && !isVideoFinished;
                  return (
                    <button
                      key={s.step}
                      onClick={() => {
                        if (isLocked) {
                          toast.error("Please watch the video tutorial to unlock the assessment!");
                          return;
                        }
                        setLearningStep(s.step);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                        learningStep === s.step
                          ? 'bg-[var(--bg-card)] text-[var(--primary)] border border-[var(--border)] shadow-sm'
                          : !isLocked
                            ? 'bg-[var(--primary-light)] text-[var(--primary)] border border-transparent cursor-pointer hover:bg-[var(--primary)] hover:text-white'
                            : 'text-[var(--text-muted)] opacity-50 cursor-pointer'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${learningStep > s.step || (s.step === 2 && isCompleted) ? 'bg-[var(--primary)] text-white' : 'border border-current'}`}>
                        {learningStep > s.step || (s.step === 2 && isCompleted) ? <FiCheckCircle size={8} /> : s.step}
                      </div>
                      {s.label}
                    </button>
                  );
                })}
              </div>
              
              {learningStep === 1 ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-[9px] font-black shadow-inner tracking-widest shrink-0">
                  <FiBookOpen /> INTERACTIVE CLASSROOM
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg text-[9px] font-black shadow-inner tracking-widest shrink-0">
                  <FiZap /> +100 XP
                </div>
              )}
            </div>

            {/* Tabs (only shown on step 2) */}
            {learningStep >= 2 && (
              <div className="flex gap-1.5 mt-1.5 pt-1.5 border-t border-[var(--border)]">
                {[
                  { id: 'description', label: 'Description', icon: <FiBookOpen size={12} /> },
                  { id: 'approach', label: 'Solution Guide', icon: <FiBook size={12} /> },
                  { id: 'submissions', label: 'Submissions', icon: <FiClock size={12} />, badge: submissions.length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setLeftTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                      leftTab === tab.id
                        ? 'bg-[var(--bg-card)] text-[var(--primary)] border border-[var(--border)] shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span className="w-4 h-4 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-[8px] font-black flex items-center justify-center shadow-inner">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Left Pane Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-[var(--bg-card)]">
            
            {/* --- GUIDED LEARNING STEPS (1 to 4) --- */}
            {learningStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col items-center text-center space-y-2 mb-4 mt-2">
                  <div className="w-12 h-12 bg-indigo-500/10 text-[var(--primary)] rounded-full flex items-center justify-center mb-1">
                    <FiYoutube size={24} />
                  </div>
                  <h2 className="text-lg font-black text-[var(--text-main)]">Watch & Code Alongside</h2>
                  <p className="text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
                    Watch the video tutorial on the left and write code simultaneously on the right! Change languages in the editor panel to sync the tutorial and start code.
                  </p>
                </div>
                
                {activeVideoEmbedUrl ? (
                  <div className="space-y-2">
                    <div className="aspect-video bg-black shadow-lg rounded-xl overflow-hidden border border-zinc-800 relative group">
                      <iframe
                        id="tutorial-video-iframe"
                        className="w-full h-full"
                        src={`${activeVideoEmbedUrl}${activeVideoEmbedUrl.includes('?') ? '&' : '?'}enablejsapi=1`}
                        title={topic.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="flex justify-between items-center px-1 text-zinc-500">
                      <span className="text-[10px] italic font-semibold">Finish the video to unlock the assessment automatically.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsVideoFinished(true);
                          toast.success("Dev Bypass: Video marked as completed! 🔓");
                        }}
                        className="text-[10px] text-[var(--primary)] hover:text-[var(--primary-dark)] hover:underline font-black uppercase tracking-wider bg-transparent border-none cursor-pointer"
                      >
                        ⚡ Dev Bypass
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-[var(--border)] rounded-xl bg-[var(--bg-sub)]">
                    <p className="text-sm font-bold text-[var(--text-muted)]">No video tutorial available for this topic.</p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-xs space-y-2">
                  <div className="font-black text-indigo-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FiTerminal /> Guided Bootcamp Mode
                  </div>
                  <p className="text-[var(--text-muted)] font-semibold leading-relaxed">
                    Once you have finished watching and practicing alongside the tutorial, click below to unlock your mini-coding challenge. Pass the test cases to earn XP and unlock the next lesson!
                  </p>
                </div>
                
                <button
                  onClick={async () => {
                    if (isDsaDomain) {
                      if (!isCompleted && !isVideoFinished) {
                        toast.error("Please watch the video tutorial to unlock the assessment!");
                        return;
                      }
                      setLearningStep(2);
                      setLeftTab('description');
                      toast.success('Mini Assessment Unlocked! 🚀');
                    } else {
                      try {
                        setSubmitting(true);
                        const res = await api.post('/progress/complete-topic', { 
                          topicId: id,
                          studyTimeMinutes: Number(studyTime),
                          notes: notes || 'Completed guided learning.',
                          difficultyFeedback: difficultyFeedback || 'easy',
                          confidenceLevel: confidenceLevel || 5,
                          revisionNeeded: false
                        });
                        await refreshUser();
                        toast.success('Topic Completed successfully! +50 XP 🚀');
                        
                        const { newlyEarnedBadges, newlyEarnedCertificate } = res.data.data;
                        if ((newlyEarnedBadges && newlyEarnedBadges.length > 0) || newlyEarnedCertificate) {
                          setCelebrationData({
                            xpEarned: 50,
                            streak: res.data.data.dailyStreak || 1,
                            quote: "Congratulations on completing this lesson!",
                            rank: { badge: "Mastered", title: "Topic Complete", style: "text-emerald-500" },
                            leveledUp: false,
                            newlyEarnedBadges,
                            newlyEarnedCertificate,
                            navigateOnClose: '/roadmap'
                          });
                        } else {
                          navigate('/roadmap');
                        }
                      } catch (err) {
                        toast.error('Failed to log quest completion progress');
                      } finally {
                        setSubmitting(false);
                      }
                    }
                  }}
                  disabled={submitting || (isDsaDomain && !isCompleted && !isVideoFinished)}
                  className={`w-full py-3 text-white rounded-xl font-black uppercase tracking-wider transition-all shadow-md mt-4 flex items-center justify-center gap-2 ${
                    isDsaDomain && !isCompleted && !isVideoFinished
                      ? 'bg-zinc-700 hover:bg-zinc-700 cursor-not-allowed opacity-50'
                      : 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] cursor-pointer'
                  }`}
                >
                  {isDsaDomain ? (
                    (!isCompleted && !isVideoFinished) ? (
                      <>🔒 Assessment Locked (Watch Video)</>
                    ) : (
                      <>Start Mini Assessment <FiArrowRight /></>
                    )
                  ) : (
                    <>Complete Topic & Claim Rewards <FiArrowRight /></>
                  )}
                </button>
                {isDsaDomain && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to skip the assessment and mark this topic as completed?")) {
                        try {
                          setSubmitting(true);
                          const res = await api.post('/progress/complete-topic', { 
                            topicId: id,
                            studyTimeMinutes: 10,
                            notes: 'Skipped coding assessment.',
                            difficultyFeedback: 'easy',
                            confidenceLevel: 3,
                            revisionNeeded: false
                          });
                          await refreshUser();
                          toast.success('Topic completed (assessment skipped)! 🚀');
                          const { newlyEarnedBadges, newlyEarnedCertificate } = res.data.data || {};
                          if ((newlyEarnedBadges && newlyEarnedBadges.length > 0) || newlyEarnedCertificate) {
                            setCelebrationData({
                              xpEarned: 50,
                              streak: res.data.data.dailyStreak || 1,
                              quote: "Congratulations on completing this lesson!",
                              rank: { badge: "Mastered", title: "Topic Complete", style: "text-emerald-500" },
                              leveledUp: false,
                              newlyEarnedBadges,
                              newlyEarnedCertificate,
                              navigateOnClose: '/roadmap'
                            });
                          } else {
                            navigate('/roadmap');
                          }
                        } catch (err) {
                          toast.error('Failed to skip and complete topic');
                        } finally {
                          setSubmitting(false);
                        }
                      }
                    }}
                    disabled={submitting}
                    className="w-full py-2.5 bg-transparent border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300 rounded-xl font-bold uppercase tracking-wider text-[9px] transition-all cursor-pointer mt-2 text-center"
                  >
                    Skip Assessment & Mark Completed ⏭️
                  </button>
                )}
              </div>
            )}

            {/* --- ORIGINAL CODING CHALLENGE TABS (Shown only on Step 2) --- */}
            {learningStep >= 2 && (
              <>
                {/* TAB 1: PROBLEM DESCRIPTION */}
                {leftTab === 'description' && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Meta details header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                  <div>
                    <h2 className="text-lg font-black text-[var(--text-main)] tracking-tight">
                      {topic.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        (topic.difficulty || 'medium').toLowerCase() === 'easy'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : (topic.difficulty || 'medium').toLowerCase() === 'hard'
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {topic.difficulty || 'Medium'}
                      </span>
                      <span className="text-[9px] font-bold text-[var(--text-light)] uppercase tracking-wider">
                        Est. {topic.estimatedTime || '15 mins'}
                      </span>
                    </div>
                  </div>
                </div>

                    {/* Difficulty Progression Map */}
                    {isDsaDomain && (
                      <div className="bg-[var(--bg-sub)] p-4 rounded-xl border border-[var(--border)] space-y-3">
                        <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider flex items-center justify-between">
                          <span>Topic Progression Ladder</span>
                          <span className="text-[8px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            Rank: {activeDifficulty.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {['beginner', 'easy', 'medium', 'challenge'].map((diff, idx) => {
                            const isUnlocked = idx === 0 || localStorage.getItem(`dsa_completed_${id}_${['beginner', 'easy', 'medium', 'challenge'][idx - 1]}`) === 'true';
                            const isCompleted = localStorage.getItem(`dsa_completed_${id}_${diff}`) === 'true';
                            const isActive = activeDifficulty === diff;
                            
                            return (
                              <button
                                key={diff}
                                disabled={!isUnlocked}
                                onClick={() => setActiveDifficulty(diff)}
                                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all relative ${
                                  isActive 
                                    ? 'bg-[var(--bg-card)] border-[var(--primary)] shadow-sm ring-1 ring-[var(--primary)] text-[var(--primary)]' 
                                    : isUnlocked 
                                      ? 'hover:bg-[var(--bg-card)] border-[var(--border)] cursor-pointer text-[var(--text-main)]' 
                                      : 'opacity-40 cursor-not-allowed border-dashed bg-zinc-900/10 text-[var(--text-muted)]'
                                }`}
                              >
                                <div className={`text-[8px] font-black uppercase tracking-wider mb-1 ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
                                  {diff}
                                </div>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                                  isCompleted 
                                    ? 'bg-emerald-500 text-white shadow' 
                                    : isActive 
                                      ? 'bg-[var(--primary)] text-white shadow' 
                                      : 'bg-[var(--bg-sub)] text-[var(--text-light)] border border-[var(--border)]'
                                }`}>
                                  {isCompleted ? '✓' : idx + 1}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Challenge description Panel */}
                    <div className="prose dark:prose-invert max-w-none text-xs text-[var(--text-muted)] leading-relaxed font-semibold p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-sub)]">
                      <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider mb-2">Problem Statement</div>
                      <p className="whitespace-pre-line leading-relaxed">
                        {langContent?.challengeDescription || topic.description}
                      </p>
                    </div>

                    {/* Constraints Section */}
                    {langContent?.constraints && (
                      <div className="p-4 bg-[var(--bg-sub)] rounded-xl border border-[var(--border)] text-xs">
                        <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider mb-2">Constraints</div>
                        <div className="font-mono text-[10px] text-[var(--text-main)]">{langContent.constraints}</div>
                      </div>
                    )}

                    {/* Hints Section */}
                    {langContent?.hints && langContent.hints.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-black text-[var(--text-main)] flex items-center gap-1.5">
                          💡 Dynamic Clues & Hints
                        </h3>
                        <div className="space-y-1.5">
                          {langContent.hints.map((hint, hidx) => (
                            <details key={hidx} className="group border border-[var(--border)] bg-[var(--bg-sub)] rounded-lg p-2.5 transition-all text-xs">
                              <summary className="font-bold text-[10px] text-[var(--text-main)] cursor-pointer select-none flex items-center justify-between">
                                <span>Clue {hidx + 1}</span>
                                <span className="text-[var(--text-light)] group-open:rotate-180 transition-transform">▼</span>
                              </summary>
                              <p className="mt-2 text-[10px] text-[var(--text-muted)] font-medium leading-relaxed">
                                {hint}
                              </p>
                            </details>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Video tutorial embed card */}
                    {langContent?.youtubeVideoId && (
                      <div className="space-y-2">
                        <h3 className="text-xs font-black text-[var(--text-main)] flex items-center gap-1.5">
                          <FiYoutube className="text-red-500" /> Dynamic Lecture Video
                        </h3>
                        <div className="aspect-video bg-black shadow rounded-xl overflow-hidden border border-[var(--border)]">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${langContent.youtubeVideoId}?rel=0&modestbranding=1&showinfo=0`}
                            title={topic.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    )}

                    {/* Completion Banners */}
                    {isCompleted && nextTopic && (
                      <div className="p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-md shadow-emerald-500/5 animate-fade-in">
                        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
                          🎉
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest">Quest Accomplished!</h4>
                          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">
                            You have successfully unlocked the next topic in this expedition:
                          </p>
                          <div className="text-xs font-black text-emerald-500 mt-1.5 uppercase tracking-tight">
                            {nextTopic.title}
                          </div>
                        </div>
                         <Link
                          to={`/topic/${nextTopic._id}`}
                          className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 group cursor-pointer hover:scale-105 duration-300 animate-pulse"
                        >
                          Unlock Next Topic <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    )}

                    {isCompleted && !nextTopic && (
                      <div className="p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-md shadow-amber-500/5 animate-fade-in">
                        <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
                          🏆
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest">Phase Mastered!</h4>
                          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1">
                            Outstanding! You have conquered every single topic in this active phase.
                          </p>
                        </div>
                        <Link
                          to="/roadmap"
                          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 group cursor-pointer hover:scale-105 duration-300"
                        >
                          Go to Roadmap <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    )}

                {/* Study Quest Complete Form (so they can manual complete or log time spent) */}
                <div className="card p-5 border-emerald-500/20 border-t-2 space-y-4">
                  <h3 className="text-xs font-black text-[var(--text-main)] flex items-center gap-1.5">
                    <FiCheckCircle className="text-emerald-500" /> Log Revision & Notes
                  </h3>
                  <form onSubmit={handleComplete} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Study Duration (mins)</label>
                        <input
                          type="number"
                          value={studyTime}
                          onChange={(e) => setStudyTime(e.target.value)}
                          className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg font-bold focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Confidence standing</label>
                        <div className="flex gap-1 bg-[var(--bg-sub)] border border-[var(--border)] p-1 rounded-lg">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <button
                              type="button"
                              key={lvl}
                              onClick={() => setConfidenceLevel(lvl)}
                              className={`flex-1 h-7 rounded text-[10px] font-black flex items-center justify-center transition-all ${
                                confidenceLevel === lvl
                                  ? 'bg-emerald-500 text-white shadow-sm'
                                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] bg-[var(--bg-card)]'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Algorithmic findings / takeaways</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Key insights, runtime notes..."
                        className="w-full p-3 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg font-semibold focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="revision"
                        checked={revisionNeeded}
                        onChange={(e) => setRevisionNeeded(e.target.checked)}
                        className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] h-3.5 w-3.5 bg-[var(--bg-sub)] cursor-pointer"
                      />
                      <label htmlFor="revision" className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider cursor-pointer">
                        Flag this topic for scheduled revision
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? 'Submitting...' : 'Save Notes & Manual Complete'} <FiChevronRight />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: OPTIMAL SOLUTION */}
            {leftTab === 'approach' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex justify-between items-center border-b border-[var(--border)] pb-2.5">
                  <h3 className="text-xs font-black text-[var(--text-main)] flex items-center gap-1.5">
                    <FiBook className="text-amber-500" /> Concept Approach
                  </h3>
                  <span className="text-[8px] font-bold text-[var(--text-light)] uppercase tracking-wider">Hinglish Mentorship Guide</span>
                </div>
                
                <p className="text-[11px] text-[var(--text-muted)] font-semibold whitespace-pre-line leading-relaxed bg-[var(--bg-sub)] p-4 rounded-xl border border-[var(--border)]">
                  {langContent?.approach || topic.description || 'Optimal concept guide loading...'}
                </p>

                {langContent && (
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-black text-[var(--text-main)] flex items-center gap-1.5">
                      <FiCode className="text-emerald-500" /> Optimal Solution Reference
                    </h3>
                    
                    <pre className="p-3.5 rounded-xl border border-[var(--border)] bg-[#0f172a] text-emerald-400 font-mono text-[10px] overflow-x-auto shadow-inner leading-relaxed select-text">
                      <code>{langContent.code}</code>
                    </pre>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl text-center">
                        <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-wider mb-0.5">Time Complexity</div>
                        <span className="text-emerald-500 font-black text-xs font-mono">{langContent.timeComplexity}</span>
                      </div>
                      <div className="p-3 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl text-center">
                        <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-wider mb-0.5">Space Complexity</div>
                        <span className="text-emerald-500 font-black text-xs font-mono">{langContent.spaceComplexity}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SUBMISSIONS HISTORY */}
            {leftTab === 'submissions' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-[var(--border)] pb-2.5">
                  <h3 className="text-xs font-black text-[var(--text-main)] flex items-center gap-1.5">
                    <FiClock className="text-purple-500" /> Submission Logs
                  </h3>
                </div>

                {submissions.length === 0 ? (
                  <div className="text-center py-10 text-[var(--text-light)]">
                    <FiTerminal className="mx-auto text-3xl mb-3 text-zinc-500 animate-pulse" />
                    <p className="text-xs font-bold">No submissions yet.</p>
                    <p className="text-[9px] mt-1">Develop code and click "Submit Code" to save history!</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {submissions.map((sub, idx) => {
                      const isAccepted = sub.status === 'Accepted';
                      const isRuntimeErr = sub.status === 'Runtime Error';
                      return (
                        <div key={sub._id || idx} className="p-3 bg-[var(--bg-sub)] rounded-xl border border-[var(--border)] flex justify-between items-center hover:border-[var(--primary)] transition-all">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                isAccepted 
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                  : isRuntimeErr
                                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                    : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                              }`}>
                                {sub.status}
                              </span>
                              <span className="text-[9px] font-black text-zinc-500 uppercase">
                                {sub.language === 'cpp' ? 'C++' : sub.language === 'javascript' ? 'JS' : sub.language}
                              </span>
                            </div>
                            <div className="text-[9px] font-bold text-[var(--text-light)] mt-0.5">
                              {new Date(sub.submittedAt).toLocaleString()} • {sub.runtime} ms
                            </div>
                          </div>
                          
                          <button
                            onClick={() => setSelectedSubCode(sub)}
                            className="px-2.5 py-1.5 bg-[var(--bg-card)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] border border-[var(--border)] rounded-lg text-[9px] font-black uppercase transition-all shadow-sm shrink-0"
                          >
                            View Details
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            </>
          )}
          </div>
        </div>

        {/* Resizable Divider Bar */}
        {isDsaDomain && (
          <div 
            onMouseDown={startResize}
            className={`hidden lg:flex w-1 hover:w-1.5 bg-zinc-800 hover:bg-[#6366f1] cursor-col-resize transition-all shrink-0 items-center justify-center relative group ${isDragging ? 'bg-[#6366f1] w-1.5' : ''}`}
          >
            <div className="absolute h-10 w-0.5 bg-zinc-600 rounded-full group-hover:bg-white" />
          </div>
        )}

        {/* RIGHT PANE: Code Monaco Editor & Console Terminal */}
        {isDsaDomain && (
        <div 
          style={{ width: isFullscreen ? '100%' : `${100 - leftWidth}%` }} 
          className={`flex-1 h-full flex flex-col overflow-hidden bg-[#09090b] transition-all duration-150 shrink-0 ${
            isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen' : 'relative'
          }`}
        >
          
          {/* Editor Header Controller panel */}
          <div className="bg-[#141416] px-4 py-2 border-b border-zinc-800 flex justify-between items-center text-xs text-zinc-400 shrink-0">
            <div className="flex items-center gap-3">
              {/* Language selection selector */}
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                {['cpp', 'java', 'python', 'javascript'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase transition-all ${
                      selectedLang === lang 
                        ? 'bg-[var(--primary)] text-white shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleWorkspaceTheme}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[9px] font-black transition-all uppercase cursor-pointer"
              >
                Theme: {editorTheme === 'vs-dark' ? 'DARK 🌙' : 'LIGHT ☀️'}
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[9px] font-black transition-all uppercase flex items-center gap-1 cursor-pointer"
                title="Maximize code playground workspace"
              >
                {isFullscreen ? <FiMinimize2 size={10} /> : <FiMaximize2 size={10} />}
                <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
              </button>
              
              <button
                onClick={() => {
                  if (langContent?.editorBoilerplate) {
                    setEditorCode(langContent.editorBoilerplate);
                    toast.success("Editor code reset to default boilerplate!");
                  }
                }}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-rose-400 hover:text-rose-300 text-[9px] font-black transition-all uppercase cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[250px] relative overflow-hidden bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={selectedLang === 'cpp' ? 'cpp' : selectedLang === 'javascript' ? 'javascript' : selectedLang === 'python' ? 'python' : 'java'}
              value={editorCode}
              onChange={(val) => setEditorCode(val || '')}
              theme={editorTheme}
              options={{
                fontSize: 13,
                fontFamily: 'Fira Code, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                cursorBlinking: 'smooth',
                automaticLayout: true
              }}
            />
          </div>

          {/* BOTTOM PANEL: Console Terminal & Runner Results */}
          <div className="h-[38%] min-h-[200px] border-t border-zinc-800 bg-[#09090b] flex flex-col justify-between overflow-hidden shrink-0">
            
            {/* Console Tab header selectors */}
            <div className="bg-[#111113] px-4 py-2 border-b border-zinc-900 flex items-center justify-between shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveConsoleTab('testcase')}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${
                    activeConsoleTab === 'testcase'
                      ? 'bg-zinc-900 border border-zinc-800 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Test Cases
                </button>
                <button
                  onClick={() => setActiveConsoleTab('result')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${
                    activeConsoleTab === 'result'
                      ? 'bg-zinc-900 border border-zinc-800 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Run Result
                  {compilerStatus !== 'idle' && (
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      compilerStatus === 'running' ? 'bg-amber-400 animate-ping' : compilerStatus === 'passed' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`} />
                  )}
                </button>
              </div>
              
              <div className="text-[8px] font-mono text-zinc-600 uppercase">
                {compilerStatus === 'running' ? 'Sandbox Busy...' : 'Console Ready'}
              </div>
            </div>

            {/* Console Body Area */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] text-zinc-400 custom-scrollbar select-text">
              
              {/* Active Tab: Testcases list display (Masking hidden test cases) */}
              {activeConsoleTab === 'testcase' && langContent && langContent.testCases && (
                <div className="space-y-3">
                  <div className="text-zinc-600 uppercase text-[8px] font-black tracking-widest mb-2">Sample Test Cases (Vetted Inputs)</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {langContent.testCases.slice(0, 2).map((tc, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900 flex flex-col justify-between gap-1.5">
                        <div>
                          <div className="text-[7px] font-black text-zinc-500 uppercase">Input Case {idx + 1}</div>
                          <div className="text-[10px] font-bold text-zinc-300 select-all truncate">{tc.input}</div>
                        </div>
                        <div>
                          <div className="text-[7px] font-black text-zinc-500 uppercase">Expected Output</div>
                          <div className="text-[9px] font-black text-emerald-400 select-all truncate">{tc.expected}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[8.5px] text-zinc-500 italic mt-1 font-bold uppercase tracking-wider">
                    🔒 Hidden Test Cases are active and will run on "Submit Code" to verify optimality.
                  </div>
                </div>
              )}

              {/* Active Tab: Execution Logs Terminal */}
              {activeConsoleTab === 'result' && (
                <div className="space-y-3.5">
                  {compilerStatus === 'compile_error' ? (
                    <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-red-300 font-mono text-xs space-y-2">
                      <div className="flex items-center gap-2 text-red-400 font-black uppercase text-sm">
                        ⚠️ Compilation Error
                      </div>
                      <div className="bg-black/40 p-3 rounded-lg border border-red-950 text-[10px] leading-relaxed max-h-[120px] overflow-y-auto whitespace-pre-wrap select-text scrollbar-thin">
                        {consoleLogs[consoleLogs.length - 1]}
                      </div>
                      <div className="text-[10px] text-zinc-500 italic mt-2">
                        Tip: Check your brackets, semicolons, and variable types. Make sure your syntax matches standard implementations.
                      </div>
                    </div>
                  ) : consoleLogs.length === 0 ? (
                    <div className="text-zinc-600 italic py-5 text-center">
                      No compilation outputs logged yet. Click "Run Code" or "Submit Code" below!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="border-b border-zinc-900 pb-1 flex justify-between items-center text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                        <span>Compiler Console Logs</span>
                        <span className={compilerStatus === 'passed' ? 'text-emerald-500' : compilerStatus === 'failed' ? 'text-rose-500' : 'text-amber-500'}>
                          Status: {compilerStatus.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Detailed comparison metrics */}
                      {testResults.length > 0 && (
                        <div className="space-y-3">
                          {compilerStatus === 'passed' && (
                            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-emerald-300 font-mono text-xs space-y-2">
                              <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-sm">
                                🏆 Accepted! All test cases passed! +100 XP 🏆
                              </div>
                              <p className="text-[10px] font-bold text-emerald-200">
                                Congratulations! All sample and hidden test cases passed perfectly. Your solution is highly optimal! 🚀
                              </p>
                            </div>
                          )}

                          {compilerStatus === 'failed' && (
                            <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-300 font-mono text-xs space-y-2">
                              <div className="flex items-center gap-2 text-rose-400 font-black uppercase text-sm">
                                ❌ Solution Rejected (Wrong Answer)
                              </div>
                              <p className="text-[10px] font-bold text-rose-200">
                                Some test cases returned incorrect outputs. Review your loop bounds, base cases, and return types, and try again!
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {testResults.map((tr, idx) => (
                              <div key={idx} className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                                tr.status === 'passed'
                                  ? 'bg-emerald-950/15 border-emerald-900/40 text-emerald-300'
                                  : 'bg-rose-950/15 border-rose-900/40 text-rose-300'
                              }`}>
                                <div>
                                  <div className="text-[7px] font-black uppercase text-zinc-500 flex justify-between">
                                    <span>{tr.isHidden ? `Hidden Case ${idx + 1}` : `Sample Case ${idx + 1}`}</span>
                                    <span className={tr.status === 'passed' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                      {tr.status.toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="text-[9px] font-bold text-zinc-400 select-all truncate mt-0.5">
                                    Input: {tr.isHidden ? '[Hidden Test Case]' : tr.input}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 mt-1 pt-1.5 border-t border-zinc-900 font-mono text-[8px]">
                                  <div>
                                    <div className="text-[6px] font-black text-zinc-600 uppercase">Expected</div>
                                    <div className="text-[9px] font-bold truncate text-emerald-400">
                                      {tr.isHidden ? '[Hidden]' : tr.expected}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[6px] font-black text-zinc-600 uppercase">Actual</div>
                                    <div className={`text-[9px] font-bold truncate ${tr.status === 'passed' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      {tr.isHidden ? '[Hidden]' : tr.actual}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Log stream printing */}
                      <div className="bg-[#050505] p-3 rounded-lg border border-zinc-950 space-y-1 overflow-y-auto max-h-[100px] scrollbar-thin">
                        {consoleLogs.map((log, idx) => (
                          <div key={idx} className={`leading-relaxed ${
                            log.startsWith('🟢') 
                              ? 'text-emerald-400' 
                              : log.startsWith('❌') || log.startsWith('💥') 
                                ? 'text-rose-400' 
                                : 'text-zinc-400'
                          }`}>
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Terminal Actions Bottom sticky bar */}
            <div className="bg-[#0b0b0d] border-t border-zinc-900 px-4 py-3 flex justify-between items-center shrink-0">
              <Link to="/roadmap" className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-[9px] font-black uppercase tracking-wider transition-colors shrink-0">
                <FiArrowLeft size={10} /> Roadmap
              </Link>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Skip this challenge and mark it as passed?")) {
                      setCompilerStatus('passed');
                      setChallengePassed(true);
                      handleGamificationUpdate();
                      const isAlreadyCompleted = user?.completedTopics?.some(t => t.topicId === id || t.topicId?._id === id);
                      if (!isAlreadyCompleted) {
                        try {
                          const res = await api.post('/progress/complete-topic', { 
                            topicId: id,
                            studyTimeMinutes: 10,
                            notes: 'Skipped coding challenge.',
                            difficultyFeedback: 'easy',
                            confidenceLevel: 3,
                            revisionNeeded: false
                          });
                          await refreshUser();
                        } catch (autoErr) {
                          console.error('Failed to auto-complete topic:', autoErr);
                        }
                      }
                      toast.success('Challenge skipped and marked as complete! 🚀');
                    }
                  }}
                  className="px-3 py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-dashed border-zinc-800 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                >
                  ⏭️ Skip Challenge
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={compilerStatus === 'running'}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <FiTerminal size={10} /> Run Code
                </button>
                <button
                  onClick={handleSubmitCode}
                  disabled={compilerStatus === 'running'}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <FiCheckCircle size={10} /> Submit Code
                </button>
              </div>
            </div>

          </div>

        </div>
        )}

      </div>

      {/* Submissions historical details modal dialog */}
      {selectedSubCode && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-sub)]">
              <div>
                <h3 className="font-black text-xs text-[var(--text-main)] flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                    selectedSubCode.status === 'Accepted' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    {selectedSubCode.status}
                  </span>
                  Submission Details
                </h3>
                <p className="text-[9px] text-[var(--text-light)] font-black uppercase mt-0.5">
                  {selectedSubCode.language === 'cpp' ? 'C++' : selectedSubCode.language === 'javascript' ? 'JS' : selectedSubCode.language} • {new Date(selectedSubCode.submittedAt).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedSubCode(null)}
                className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-zinc-500 hover:text-[var(--text-main)] font-black text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex gap-4 text-center">
                <div className="flex-1 p-3 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl">
                  <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-wider mb-0.5">Test Cases Passed</div>
                  <span className="text-[var(--text-main)] font-black text-sm">{selectedSubCode.passedCount} / {selectedSubCode.totalCount}</span>
                </div>
                <div className="flex-1 p-3 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl">
                  <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-wider mb-0.5">Execution Speed</div>
                  <span className="text-[var(--text-main)] font-black text-sm">{selectedSubCode.runtime} ms</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider">
                  <span>Source Code</span>
                  <button 
                    onClick={() => {
                      handleLoadSubmission(selectedSubCode.code, selectedSubCode.language);
                      setSelectedSubCode(null);
                    }}
                    className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white rounded border border-[var(--primary)]/10 transition-all font-black text-[8px] uppercase tracking-wider cursor-pointer"
                  >
                    Load into Playground
                  </button>
                </div>
                <pre className="p-4 rounded-xl border border-[var(--border)] bg-[#0f172a] text-slate-100 font-mono text-[10px] overflow-x-auto shadow-inner leading-relaxed max-h-[300px] select-text">
                  <code>{selectedSubCode.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
        )}

      {/* Premium Gamified Celebration Overlay */}
      <AnimatePresence>
        {celebrationData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="bg-[var(--bg-card)] border-2 border-[var(--primary)]/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative p-8 text-center flex flex-col items-center gap-6"
            >
              {/* Leveled Up Banner */}
              {celebrationData.leveledUp && (
                <div className="absolute top-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[9px] uppercase tracking-widest px-4 py-1 rounded-full shadow-lg animate-pulse">
                  🏆 Rank Promoted!
                </div>
              )}

              {/* Success Badge Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-white shadow-xl relative animate-bounce">
                <FiTrophy className="text-3xl" />
                <div className="absolute -bottom-2 bg-emerald-500 text-white font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white">
                  Passed
                </div>
              </div>

              {/* Milestone Details */}
              <div className="space-y-1">
                <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight">Challenge Conquered!</h2>
                <p className="text-[10px] text-[var(--text-light)] font-black uppercase tracking-wider">
                  Quest completed in {activeDifficulty.toUpperCase()} difficulty
                </p>
              </div>

              {/* Newly Earned Badges Section */}
              {celebrationData.newlyEarnedBadges && celebrationData.newlyEarnedBadges.length > 0 && (
                <div className="w-full p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-center space-y-3 relative z-10">
                  <div className="text-[9px] text-amber-500 font-black uppercase tracking-widest">
                    🎉 New Badges Unlocked!
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {celebrationData.newlyEarnedBadges.map((badge, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-0.5 max-w-[85px] bg-[var(--bg-sub)] p-2 rounded-xl border border-[var(--border)]">
                        <div className="text-3xl filter drop-shadow animate-pulse">{badge.icon || '🏅'}</div>
                        <div className="text-[8px] font-black text-[var(--text-main)] truncate w-full mt-1">{badge.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Newly Earned Certificate Section */}
              {celebrationData.newlyEarnedCertificate && (
                <div className="w-full p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-center space-y-2 relative z-10">
                  <div className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">
                    🎓 Course Certified!
                  </div>
                  <div className="text-3xl filter drop-shadow animate-bounce">🏆</div>
                  <div className="text-xs font-black text-[var(--text-main)]">
                    You earned the {celebrationData.newlyEarnedCertificate.title}!
                  </div>
                  <p className="text-[8px] text-[var(--text-muted)] font-semibold leading-normal">
                    View and print your official certificate on the Dashboard.
                  </p>
                </div>
              )}

              {/* XP and Streak stats */}
              <div className="flex gap-4 w-full mt-2">
                <div className="flex-1 p-4 bg-[var(--bg-sub)] border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center gap-0.5 shadow-inner">
                  <FiZap className="text-amber-500 text-lg animate-pulse" />
                  <span className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-wider">Quest XP</span>
                  <span className="text-lg font-black text-emerald-500">+{celebrationData.xpEarned} XP</span>
                </div>
                
                <div className="flex-1 p-4 bg-[var(--bg-sub)] border border-[var(--border)] rounded-2xl flex flex-col items-center justify-center gap-0.5 shadow-inner">
                  <span className="text-lg animate-bounce">🔥</span>
                  <span className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-wider">Active Streak</span>
                  <span className="text-lg font-black text-amber-500">{celebrationData.streak} Days</span>
                </div>
              </div>

              {/* Curated Celebration Quote Box */}
              <div className="p-4 bg-[var(--bg-sub)] border border-[var(--border)] rounded-2xl relative w-full text-center">
                <div className="absolute -top-2 left-6 bg-[var(--primary)] text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                  Milestone Note
                </div>
                <p className="italic text-xs text-[var(--text-muted)] font-medium leading-relaxed mt-1 select-text">
                  "{celebrationData.quote}"
                </p>
              </div>

              {/* Badge Rank Unlocked */}
              <div className="w-full py-2 border-y border-[var(--border)] flex justify-between items-center text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider px-2">
                <span>Codex Badge:</span>
                <span className={`flex items-center gap-1.5 ${celebrationData.rank.style}`}>
                  <FiAward /> {celebrationData.rank.badge} ({celebrationData.rank.title})
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  const dest = celebrationData.navigateOnClose;
                  setCelebrationData(null);
                  if (dest) {
                    navigate(dest);
                  }
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:shadow-lg text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                Continue Quest
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicDetail;
