import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  ArrowLeft, Play, RotateCcw, Check, Sparkles, HelpCircle, 
  Trophy, Terminal, Award, Zap, ChevronLeft, ChevronRight, RefreshCw, 
  Volume2, VolumeX, Sun, Moon, Maximize2, Minimize2, Save, FileCode,
  CheckCircle2, XCircle, AlertCircle, PlayCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { zeroToCodingMonacoLevels } from '../utils/zeroToCodingMonacoQuestions';

// Synthesizer Sound Engine for high-fidelity interactive feedback
const playSound = (type, isMuted) => {
  if (isMuted) return;
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
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now); 
      osc.frequency.linearRampToValueAtTime(90, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'levelup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(587.33, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
      osc.frequency.setValueAtTime(987.77, now + 0.3); // B5
      osc.frequency.setValueAtTime(1174.66, now + 0.45); // D6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
      osc.start(now);
      osc.stop(now + 0.7);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (err) {
    console.warn("Audio engine inactive or waiting for user interaction:", err);
  }
};

const ZeroToCoding = () => {
  const { user, refreshUser } = useAuth();
  
  // Custom States
  const [theme, setTheme] = useState(() => localStorage.getItem('editor_theme') || 'light');
  const [selectedLang, setSelectedLang] = useState(() => localStorage.getItem('editor_lang') || 'cpp');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('testcases'); // 'testcases' | 'console' | 'custominput' | 'results'
  const [leftTab, setLeftTab] = useState('description'); // 'description' | 'examples' | 'clues'
  
  // Game & User Progression States
  const [userState, setUserState] = useState({
    xp: 0,
    level: 1,
    streak: 5,
    completedQuestions: [],
    unlockedBadges: []
  });
  
  const [activeLevelIndex, setActiveLevelIndex] = useState(0);
  const activeLevel = zeroToCodingMonacoLevels[activeLevelIndex] || zeroToCodingMonacoLevels[0];
  
  // Editor code states & persistence cache
  const [editorCode, setEditorCode] = useState('');
  const [savedCodes, setSavedCodes] = useState({});
  
  // Console & Compilation States
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [compilerStatus, setCompilerStatus] = useState('idle'); // 'idle' | 'compiling' | 'success' | 'error'
  const [compilationError, setCompilationError] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [appreciationMsg, setAppreciationMsg] = useState('');
  
  // Custom execution input
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState('');

  // Layout Resizer States (LeetCode-style draggable dividers)
  const [leftWidth, setLeftWidth] = useState(40); // percent width of Left Column
  const [bottomHeight, setBottomHeight] = useState(38); // percent height of bottom terminal/tabs
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingBottom, setIsResizingBottom] = useState(false);

  // Animations & Confetti
  const [showConfetti, setShowConfetti] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [showHintIndex, setShowHintIndex] = useState(-1);

  // Load user profile
  useEffect(() => {
    if (user?.profile?.zeroToCoding) {
      setUserState(user.profile.zeroToCoding);
    } else {
      const local = localStorage.getItem('careerforge_zero_to_coding');
      if (local) {
        try {
          setUserState(JSON.parse(local));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [user]);

  // Preload code when Level or Language changes
  useEffect(() => {
    if (activeLevel) {
      const cached = savedCodes[`${activeLevel.id}_${selectedLang}`];
      if (cached) {
        setEditorCode(cached);
      } else {
        setEditorCode(activeLevel.starterCodes[selectedLang] || '');
      }
      
      // Reset execution states
      setTerminalLogs(["// Sandbox initialized.", `Ready for compiling in ${selectedLang.toUpperCase()}...`]);
      setCompilerStatus('idle');
      setCompilationError('');
      setTestResults(activeLevel.testCases.map(tc => ({ ...tc, status: 'pending', actual: '' })));
      setCustomOutput('');
      setAppreciationMsg('');
      setShowHintIndex(-1);
    }
  }, [activeLevelIndex, selectedLang]);

  // Sync to database and LocalStorage
  const saveUserState = async (updated) => {
    setUserState(updated);
    localStorage.setItem('careerforge_zero_to_coding', JSON.stringify(updated));
    
    try {
      await api.put('/auth/profile', {
        profile: {
          zeroToCoding: updated
        }
      });
      refreshUser();
    } catch (err) {
      console.warn("API Sync fallback to local storage:", err.message);
    }
  };

  // Draggable columns and rows events
  const startResizingLeft = (e) => {
    e.preventDefault();
    setIsResizingLeft(true);
  };

  const startResizingBottom = (e) => {
    e.preventDefault();
    setIsResizingBottom(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingLeft) {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
      }
      if (isResizingBottom) {
        const rightHeight = window.innerHeight - 64; // subtract header
        const newHeight = ((rightHeight - e.clientY + 64) / rightHeight) * 100;
        if (newHeight > 15 && newHeight < 80) setBottomHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingBottom(false);
    };

    if (isResizingLeft || isResizingBottom) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingBottom]);

  // Sounds
  const triggerSoundEffect = (type) => {
    playSound(type, isMuted);
  };

  // High performance confetti generator
  const triggerConfetti = () => {
    const freshParticles = [];
    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    for (let i = 0; i < 80; i++) {
      freshParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * -30 - 10,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 6 + 4
      });
    }
    setParticles(freshParticles);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setParticles([]);
    }, 4000);
  };

  // Cache editor changes
  const handleEditorChange = (value) => {
    const code = value || '';
    setEditorCode(code);
    setSavedCodes(prev => ({
      ...prev,
      [`${activeLevel.id}_${selectedLang}`]: code
    }));
  };

  // Reset starter template code
  const handleResetCode = () => {
    triggerSoundEffect('click');
    if (window.confirm(`Are you sure you want to reset your ${selectedLang.toUpperCase()} code back to the starter boilerplate?`)) {
      const defaultCode = activeLevel.starterCodes[selectedLang] || '';
      setEditorCode(defaultCode);
      setSavedCodes(prev => ({
        ...prev,
        [`${activeLevel.id}_${selectedLang}`]: defaultCode
      }));
      setTerminalLogs(["// Terminal reset.", "Ready for execution..."]);
      setCompilerStatus('idle');
      setCompilationError('');
      setTestResults(activeLevel.testCases.map(tc => ({ ...tc, status: 'pending', actual: '' })));
      toast.success("Code reset successfully!");
    }
  };

  // Load Fira Code dynamic Google Font on mount for premium coding ligatures
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Save code local persistence
  const handleSaveCode = () => {
    triggerSoundEffect('click');
    localStorage.setItem(`saved_code_${activeLevel.id}_${selectedLang}`, editorCode);
    toast.success("Code saved successfully to local cache! 💾");
  };

  // Interactive mock execution compiler
  const runCode = (isSubmit = false) => {
    if (!activeLevel) return;

    setCompilerStatus('compiling');
    setActiveTab('results');
    
    // Choose beautiful logs depending on selected language
    let compileLogs = [];
    if (selectedLang === 'cpp') {
      compileLogs = [
        "⚙️ g++ -O3 -std=c++20 main.cpp -o main...",
        "⚡ Linking binary elements with GCC compiler...",
        "🚀 Running executable main..."
      ];
    } else if (selectedLang === 'java') {
      compileLogs = [
        "⚙️ javac Main.java...",
        "⚡ Optimizing class bytecodes...",
        "🚀 Executing Main.class via JVM..."
      ];
    } else if (selectedLang === 'python') {
      compileLogs = [
        "⚙️ python3 -m py_compile solution.py...",
        "⚡ Validating indentations...",
        "🚀 Running script via CPython..."
      ];
    } else {
      compileLogs = [
        "⚙️ node solution.js...",
        "⚡ Parsing JavaScript AST in V8 engine...",
        "🚀 Running local runtime environment..."
      ];
    }

    setTerminalLogs(compileLogs);

    // Generic semicolon validation check for C++ and Java
    if (selectedLang === 'cpp' || selectedLang === 'java') {
      const lines = editorCode.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        if (line.startsWith('#') || line.startsWith('//') || line.startsWith('/*') || line.endsWith('*/')) continue;
        if (line.endsWith('{') || line.endsWith('}') || line.endsWith(';')) continue;
        if (line.startsWith('class ') || line.startsWith('public:') || line.startsWith('private:') || line.startsWith('protected:')) continue;
        if (line.startsWith('if') || line.startsWith('else') || line.startsWith('for') || line.startsWith('while') || line.startsWith('switch')) continue;
        if (line.startsWith('int main') || line.startsWith('void main') || line.startsWith('using namespace') || line.startsWith('public class')) continue;
        
        if (line.includes('cout') || line.includes('return') || line.includes('print') || line.includes('=') || line.includes('System.out') || line.includes('cin')) {
          const err = `expected ';' at end of statement on line ${i + 1}`;
          setTimeout(() => {
            setCompilerStatus('error');
            setCompilationError(err);
            setTerminalLogs([
              ...compileLogs,
              "❌ Compilation Failed.",
              `🛑 Error: ${err}`
            ]);
            triggerSoundEffect('error');
          }, 800);
          return;
        }
      }
    }

    setTimeout(() => {
      // Validate code inputs
      let currentResults = [];
      let overallSuccess = true;
      let compilationFailure = false;
      let compilerErrorText = "";

      // Process test cases
      if (useCustomInput) {
        // Custom input mode
        const res = activeLevel.validationFn(editorCode, selectedLang, customInput);
        if (res.success) {
          setCustomOutput(res.output);
          setTerminalLogs(prev => [
            ...prev,
            "🟢 Program executed cleanly on custom input.",
            `📥 Input: ${customInput || "None"}`,
            `📤 Output: ${res.output}`
          ]);
          setCompilerStatus('success');
        } else {
          setCompilerStatus('error');
          setCompilationError(res.error);
          setTerminalLogs(prev => [
            ...prev,
            "❌ Compilation / Execution Failed.",
            `🛑 Error: ${res.error}`
          ]);
          triggerSoundEffect('error');
        }
        return;
      }

      // Standard test cases mode
      activeLevel.testCases.forEach((tc) => {
        const res = activeLevel.validationFn(editorCode, selectedLang, tc.input);
        
        if (res.success) {
          currentResults.push({
            ...tc,
            actual: res.output,
            status: 'passed'
          });
        } else {
          overallSuccess = false;
          compilationFailure = true;
          compilerErrorText = res.error;
          currentResults.push({
            ...tc,
            actual: '',
            status: 'failed',
            error: res.error
          });
        }
      });

      setTestResults(currentResults);

      if (overallSuccess) {
        setCompilerStatus('success');
        setTerminalLogs(prev => [
          ...prev,
          "🟢 All test cases completed successfully.",
          `🎉 Status: Success! ${currentResults.length}/${currentResults.length} cases passed.`
        ]);
        
        // Pick appreciation phrases
        const compliments = [
          "Great job! All test cases passed 🎉",
          "Clean solution! Keep going 🚀",
          "Excellent work, warrior ⚡",
          "You’re improving fast 🔥"
        ];
        const selectedCompliment = compliments[Math.floor(Math.random() * compliments.length)];
        setAppreciationMsg(selectedCompliment);

        triggerSoundEffect('success');
        triggerConfetti();

        if (isSubmit) {
          // Process XP rewards
          let earnedXP = activeLevel.xpReward;
          let newXP = userState.xp + earnedXP;
          
          let currentLevel = userState.level;
          let didLevelUp = false;
          
          // XP Milestones
          if (newXP >= 200 && currentLevel < 5) {
            currentLevel = 5;
            didLevelUp = true;
          } else if (newXP >= 120 && currentLevel < 4) {
            currentLevel = 4;
            didLevelUp = true;
          } else if (newXP >= 60 && currentLevel < 3) {
            currentLevel = 3;
            didLevelUp = true;
          } else if (newXP >= 25 && currentLevel < 2) {
            currentLevel = 2;
            didLevelUp = true;
          }

          const freshCompleted = [...userState.completedQuestions];
          if (!freshCompleted.includes(activeLevel.id.toString())) {
            freshCompleted.push(activeLevel.id.toString());
          }

          const updated = {
            ...userState,
            xp: newXP,
            level: currentLevel,
            completedQuestions: freshCompleted
          };

          saveUserState(updated);

          if (didLevelUp) {
            setTimeout(() => {
              triggerSoundEffect('levelup');
              toast.success(`🎉 LEVEL UP! You are now a Level ${currentLevel} coder!`, { duration: 6000 });
            }, 800);
          }

          setShowCelebrationModal(true);
        }
      } else {
        setCompilerStatus('error');
        setCompilationError(compilerErrorText);
        setTerminalLogs(prev => [
          ...prev,
          "❌ Code failed or encountered compiler warnings.",
          `🛑 Error Details: ${compilerErrorText}`
        ]);
        setAppreciationMsg("Nice progress! A few test cases still need work.");
        triggerSoundEffect('error');
      }
    }, 1000);
  };

  const handleBackToDashboard = () => {
    triggerSoundEffect('click');
    window.location.href = '/dashboard';
  };

  const getRankName = (xp) => {
    if (xp >= 200) return "Architect 🏆";
    if (xp >= 120) return "Coder ⚡";
    if (xp >= 60) return "Builder 🧠";
    if (xp >= 25) return "Explorer 🧭";
    return "Rookie 👾";
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Rookie': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Explorer': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Builder': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    }
  };

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('editor_theme', newTheme);
    triggerSoundEffect('click');
  };

  // Fullscreen Mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    triggerSoundEffect('click');
  };

  return (
    <div className={`h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-hidden select-none ${
      theme === 'dark' ? 'bg-[#1a1a1a] text-[#f4f4f5] dark-mode' : 'bg-[#f0f0f0] text-[#0f172a] light-mode'
    }`}>
      
      {/* Background Orbs in Dark Mode */}
      {theme === 'dark' && (
        <>
          <div className="absolute top-[-25%] left-[-10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none"></div>
        </>
      )}

      {/* Confetti Animation */}
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
                borderRadius: p.size % 2 === 0 ? '50%' : '2px',
                transform: `rotate(${p.rotation}deg)`
              }}
              animate={{
                y: ['0vh', '110vh'],
                x: [`${p.x}%`, `${p.x + p.speedX * 5}%`],
                rotate: [p.rotation, p.rotation + 360]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                ease: 'linear'
              }}
            />
          ))}
        </div>
      )}

      {/* HEADER / NAVIGATION BAR (Sleek LeetCode h-11 toolbar style) */}
      <header className={`h-11 flex items-center justify-between px-4 border-b shrink-0 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#282828] border-[#3e3e3e]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBackToDashboard}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all ${
              theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          
          <div className="h-4 w-px bg-slate-300 dark:bg-zinc-700"></div>

          {/* Level Switcher */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getDifficultyColor(activeLevel.difficulty)}`}>
              Lvl {activeLevel.id}
            </span>
            <span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {activeLevel.title}
            </span>
          </div>
        </div>

        {/* CONTROLS: Sound, Mode, Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-1.5 rounded transition-all ${
              theme === 'dark' 
                ? 'hover:bg-zinc-800 text-zinc-400' 
                : 'hover:bg-slate-100 text-slate-500'
            }`}
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded transition-all ${
              theme === 'dark' 
                ? 'hover:bg-zinc-800 text-zinc-400' 
                : 'hover:bg-slate-100 text-slate-500'
            }`}
            title="Toggle color theme"
          >
            {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-600" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className={`p-1.5 rounded transition-all ${
              theme === 'dark' 
                ? 'hover:bg-zinc-800 text-zinc-400' 
                : 'hover:bg-slate-100 text-slate-500'
            }`}
            title="Toggle fullscreen mode"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE PANELS */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* ========================================================
            LEFT COLUMN: Problem Statement, Constraints, Examples
           ======================================================== */}
        <section 
          style={{ width: `${leftWidth}%` }}
          className={`h-full flex flex-col border-r transition-colors duration-300 select-text overflow-hidden shrink-0 ${
            theme === 'dark' ? 'bg-[#1e1e1e] border-[#2e2e2e]' : 'bg-white border-slate-200'
          }`}
        >
          {/* Header tabs */}
          <div className={`flex items-center px-4 border-b shrink-0 ${
            theme === 'dark' ? 'bg-[#282828] border-[#3e3e3e]' : 'bg-slate-50 border-slate-200'
          }`}>
            {[
              { id: 'description', label: 'Problem Description', icon: FileCode },
              { id: 'examples', label: 'Constraints & Examples', icon: Trophy },
              { id: 'clues', label: 'Hints & Accordion', icon: HelpCircle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setLeftTab(tab.id);
                  triggerSoundEffect('click');
                }}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 -mb-px ${
                  leftTab === tab.id
                    ? 'border-[#ffa116] text-[#ffa116] dark:text-[#ffa116]'
                    : 'border-transparent text-slate-500 hover:text-[#262626] dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <tab.icon size={13} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Details Scrollable Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {leftTab === 'description' && (
              <div className="space-y-6 animate-fade-in">
                {/* Level Title, Difficulty & Stats */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                      {activeLevel.title}
                    </h2>
                    <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                      Foundations of Beginner Programming
                    </p>
                  </div>
                  
                  <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 shrink-0 ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <Zap size={14} className="text-violet-500 fill-violet-500 animate-pulse" />
                    <span className="text-xs font-black">+{activeLevel.xpReward} XP</span>
                  </div>
                </div>

                {/* Level Mascot Briefing */}
                <div className={`p-4 rounded-xl border flex items-start gap-3 bg-gradient-to-r ${
                  theme === 'dark'
                    ? 'from-violet-950/20 via-zinc-900/40 to-cyan-950/20 border-violet-500/20'
                    : 'from-violet-50 via-slate-50/50 to-cyan-50 border-violet-100'
                }`}>
                  <div className="text-2xl pt-1">🤖</div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                      Mascot Briefing
                    </div>
                    <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'}`}>
                      "{activeLevel.learningObjective}"
                    </p>
                  </div>
                </div>

                {/* Problem Statement text */}
                <div className="space-y-3">
                  <h3 className={`text-sm font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    Problem Statement
                  </h3>
                  <div className={`text-sm font-medium leading-relaxed whitespace-pre-line p-5 rounded-xl border ${
                    theme === 'dark' ? 'bg-zinc-900/30 border-zinc-800 text-zinc-300' : 'bg-slate-50/50 border-slate-200 text-slate-600'
                  }`}>
                    {activeLevel.problemStatement}
                  </div>
                </div>
              </div>
            )}

            {leftTab === 'examples' && (
              <div className="space-y-6 animate-fade-in">
                {/* Constraints */}
                <div className="space-y-3">
                  <h3 className={`text-sm font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    Constraints
                  </h3>
                  <div className={`p-4 rounded-xl border text-xs font-mono ${
                    theme === 'dark' ? 'bg-zinc-900/30 border-zinc-800 text-zinc-300' : 'bg-slate-50/50 border-slate-200 text-slate-600'
                  }`}>
                    {activeLevel.constraints}
                  </div>
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h3 className={`text-sm font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    Example Cases
                  </h3>
                  {activeLevel.examples.map((ex, idx) => (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-xl border space-y-3 font-mono text-xs ${
                        theme === 'dark' ? 'bg-zinc-900/30 border-zinc-800' : 'bg-slate-50/50 border-slate-200'
                      }`}
                    >
                      <div className="font-bold text-indigo-500 uppercase tracking-widest text-[10px]">
                        Example {idx + 1}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className={`text-[10px] uppercase font-bold mb-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                            Input
                          </div>
                          <pre className={`p-2.5 rounded-lg font-mono text-xs ${
                            theme === 'dark' ? 'bg-zinc-950 text-zinc-300' : 'bg-slate-100 text-slate-700'
                          }`}>{ex.input}</pre>
                        </div>
                        <div>
                          <div className={`text-[10px] uppercase font-bold mb-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                            Output
                          </div>
                          <pre className={`p-2.5 rounded-lg font-mono text-xs ${
                            theme === 'dark' ? 'bg-zinc-950 text-zinc-300' : 'bg-slate-100 text-slate-700'
                          }`}>{ex.output}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {leftTab === 'clues' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className={`text-sm font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  Compiler Clues & Hints
                </h3>
                <div className="space-y-3">
                  {activeLevel.hints.map((hint, idx) => (
                    <div 
                      key={idx} 
                      className={`border rounded-xl overflow-hidden transition-all ${
                        theme === 'dark' ? 'border-zinc-800 bg-zinc-900/20' : 'border-slate-200 bg-slate-50/20'
                      }`}
                    >
                      <button
                        onClick={() => {
                          setShowHintIndex(showHintIndex === idx ? -1 : idx);
                          triggerSoundEffect('click');
                        }}
                        className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors ${
                          theme === 'dark' ? 'hover:bg-zinc-900' : 'hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-black">Hint #{idx + 1}</span>
                        <HelpCircle size={16} className="text-slate-400 dark:text-zinc-500" />
                      </button>
                      <AnimatePresence>
                        {showHintIndex === idx && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t dark:border-zinc-800 border-slate-100"
                          >
                            <p className={`p-5 text-xs font-medium leading-relaxed whitespace-pre-wrap ${
                              theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'
                            }`}>
                              {hint}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Level Rank */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              theme === 'dark' ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50/40 border-slate-200'
            }`}>
              <div className="flex justify-between items-center text-xs font-extrabold">
                <span className="text-slate-400 uppercase tracking-widest text-[9px]">Developer Ranking</span>
                <span className="text-indigo-600">{getRankName(userState.xp)}</span>
              </div>
              <div className="progress-container h-1.5 bg-slate-200 dark:bg-zinc-800">
                <div 
                  className="progress-bar-fill bg-gradient-to-r from-indigo-500 to-cyan-500" 
                  style={{ width: `${Math.min(100, (userState.xp % 200) / 2)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>{userState.xp} Total XP</span>
                <span>{Math.max(0, 200 - (userState.xp % 200))} XP to Next Rank</span>
              </div>
            </div>

          </div>

          {/* Left panel footer navigator */}
          <div className={`p-4 border-t flex items-center justify-between shrink-0 ${
            theme === 'dark' ? 'bg-[#09090b] border-zinc-800' : 'bg-white border-slate-200'
          }`}>
            <button
              disabled={activeLevelIndex === 0}
              onClick={() => {
                setActiveLevelIndex(p => p - 1);
                triggerSoundEffect('click');
              }}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg transition-all disabled:opacity-30 ${
                theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft size={16} /> Prev Lvl
            </button>
            
            <div className="flex gap-1.5">
              {zeroToCodingMonacoLevels.map((lvl, idx) => {
                const isCompleted = userState.completedQuestions.includes(lvl.id.toString());
                const isActive = idx === activeLevelIndex;
                
                return (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      setActiveLevelIndex(idx);
                      triggerSoundEffect('click');
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-black transition-all flex items-center justify-center border ${
                      isActive 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                        : isCompleted 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:text-emerald-400' 
                          : theme === 'dark' 
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              disabled={activeLevelIndex === zeroToCodingMonacoLevels.length - 1}
              onClick={() => {
                setActiveLevelIndex(p => p + 1);
                triggerSoundEffect('click');
              }}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg transition-all disabled:opacity-30 ${
                theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              Next Lvl <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {/* LEFT COLUMN DRAG SPLITTER */}
        <div 
          onMouseDown={startResizingLeft}
          className={`w-1 cursor-col-resize shrink-0 transition-colors z-20 flex items-center justify-center hover:bg-indigo-500 ${
            theme === 'dark' ? 'bg-zinc-900' : 'bg-slate-200'
          }`}
          title="Drag to resize panels"
        >
          <div className="w-[2px] h-8 rounded bg-slate-300 dark:bg-zinc-700 pointer-events-none"></div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: Coding Editor & Test Cases Terminal
           ======================================================== */}
        <section className="flex-1 flex flex-col overflow-hidden relative h-full">
          
          {/* Coding Editor Container */}
          <div 
            style={{ height: `${100 - bottomHeight}%` }}
            className={`flex flex-col overflow-hidden transition-all relative ${
              theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
            }`}
          >
            {/* Editor Sub-header */}
            <div className={`h-11 px-4 border-b flex items-center justify-between shrink-0 ${
              theme === 'dark' ? 'bg-[#282828] border-[#3e3e3e]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-4">
                {/* LeetCode style language select dropdown */}
                <select
                  value={selectedLang}
                  onChange={(e) => {
                    setSelectedLang(e.target.value);
                    localStorage.setItem('editor_lang', e.target.value);
                    triggerSoundEffect('click');
                  }}
                  className={`text-[11px] font-bold py-1 px-2.5 rounded border outline-none cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python 3</option>
                  <option value="javascript">JavaScript</option>
                </select>

                <div className="h-4 w-px bg-slate-300 dark:bg-zinc-700"></div>

                <div className="flex items-center gap-1.5">
                  <FileCode size={13} className="text-[#ffa116]" />
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400">
                    {selectedLang === 'cpp' ? 'main.cpp' : selectedLang === 'java' ? 'Main.java' : selectedLang === 'python' ? 'solution.py' : 'index.js'}
                  </span>
                </div>
              </div>

              {/* Reset, Save Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetCode}
                  className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-all`}
                  title="Reset starter template code"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={handleSaveCode}
                  className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-all`}
                  title="Save current code draft"
                >
                  <Save size={14} />
                </button>
              </div>
            </div>

            {/* Monaco Component */}
            <div className="flex-1 relative overflow-hidden">
              <Editor
                height="100%"
                language={selectedLang}
                theme={theme === 'light' ? 'vs' : 'vs-dark'}
                value={editorCode}
                onChange={handleEditorChange}
                options={{
                  fontSize: 13,
                  fontFamily: "'Fira Code', 'JetBrains Mono', 'Source Code Pro', Menlo, Monaco, Consolas, 'Courier New', monospace",
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 },
                  renderLineHighlight: 'all',
                  lineHeight: 21,
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible'
                  },
                  cursorBlinking: 'smooth',
                  tabSize: 4,
                  autoIndent: 'full',
                  bracketPairColorization: { enabled: true }
                }}
              />
            </div>
          </div>

          {/* VERTICAL ROW SPLITTER */}
          <div 
            onMouseDown={startResizingBottom}
            className={`h-1 cursor-row-resize shrink-0 transition-colors z-20 flex items-center justify-center hover:bg-indigo-500 ${
              theme === 'dark' ? 'bg-zinc-900' : 'bg-slate-200'
            }`}
            title="Drag to resize terminal panel"
          >
            <div className="w-8 h-[2px] rounded bg-slate-300 dark:bg-zinc-700 pointer-events-none"></div>
          </div>

          {/* ========================================================
              BOTTOM TERMINAL: Tabs, Test Cases & Execution Details
             ======================================================== */}
          <div 
            style={{ height: `${bottomHeight}%` }}
            className={`flex flex-col border-t shrink-0 overflow-hidden relative ${
              theme === 'dark' ? 'bg-[#1e1e1e] border-[#2e2e2e]' : 'bg-white border-slate-200'
            }`}
          >
            {/* Terminal Tab Bar */}
            <div className={`flex items-center px-4 border-b shrink-0 justify-between ${
              theme === 'dark' ? 'bg-[#282828] border-[#3e3e3e]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex gap-2">
                {[
                  { id: 'testcases', label: 'Test Cases', icon: Trophy },
                  { id: 'custominput', label: 'Custom Input', icon: HelpCircle },
                  { id: 'console', label: 'Console Logs', icon: Terminal },
                  { id: 'results', label: 'Run Results', icon: CheckCircle2 }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      triggerSoundEffect('click');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold transition-all border-b-2 -mb-px ${
                      activeTab === tab.id
                        ? 'border-[#ffa116] text-[#ffa116] dark:text-[#ffa116]'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                  >
                    <tab.icon size={13} /> {tab.label}
                  </button>
                ))}
              </div>

              {/* Action buttons: Run Code, Submit */}
              <div className="flex items-center gap-2 py-1.5">
                <button
                  onClick={() => runCode(false)}
                  disabled={compilerStatus === 'compiling'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    compilerStatus === 'compiling'
                      ? 'opacity-50 cursor-not-allowed'
                      : theme === 'dark'
                        ? 'bg-zinc-800 hover:bg-zinc-700 border-transparent text-zinc-200'
                        : 'bg-slate-100 hover:bg-slate-200 border-transparent text-slate-700'
                  }`}
                >
                  <Play size={12} fill="currentColor" /> Run Code
                </button>
                
                <button
                  onClick={() => runCode(true)}
                  disabled={compilerStatus === 'compiling'}
                  className="px-4 py-1.5 bg-[#2cbb5d] hover:bg-[#229c4c] text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
                >
                  <Sparkles size={12} /> Submit Solution
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 overflow-y-auto p-5 font-sans">
              
              {/* Tab 1: Visible Sample Test Cases */}
              {activeTab === 'testcases' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-500 dark:text-zinc-400">Sample Test Cases</span>
                    <span className="text-slate-400">Run code to see actual outputs.</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {activeLevel.testCases.map((tc, idx) => (
                      <div 
                        key={tc.id} 
                        className={`p-4 rounded-xl border space-y-2.5 font-mono text-xs ${
                          theme === 'dark' ? 'bg-zinc-900/30 border-zinc-800' : 'bg-slate-50/50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-indigo-500">Case #{idx + 1}</span>
                          <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase">
                            Sample
                          </span>
                        </div>
                        
                        <div className="space-y-1.5">
                          {tc.input && (
                            <div>
                              <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-bold">Input</span>
                              <pre className={`p-1.5 rounded text-[11px] mt-0.5 ${theme === 'dark' ? 'bg-zinc-950 text-zinc-300' : 'bg-slate-100 text-slate-700'}`}>{tc.input}</pre>
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-bold">Expected Output</span>
                            <pre className={`p-1.5 rounded text-[11px] mt-0.5 ${theme === 'dark' ? 'bg-zinc-950 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>{tc.expected}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Custom Input Support */}
              {activeTab === 'custominput' && (
                <div className="space-y-4 animate-fade-in max-w-xl">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={useCustomInput}
                      onChange={(e) => {
                        setUseCustomInput(e.target.checked);
                        triggerSoundEffect('click');
                      }}
                      className="rounded border-slate-300 dark:border-zinc-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-700 dark:text-zinc-300">Enable Custom Input</span>
                      <span className="text-[10px] text-slate-400">Read custom parameters during mock run code.</span>
                    </div>
                  </label>

                  {useCustomInput && (
                    <div className="space-y-3">
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Type standard console input arguments here..."
                        rows={3}
                        className={`w-full p-3 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                      
                      {customOutput && (
                        <div className="space-y-1.5 font-mono text-xs">
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Custom Run Output</div>
                          <pre className={`p-3 rounded-xl font-mono ${
                            theme === 'dark' ? 'bg-zinc-950 text-emerald-400' : 'bg-slate-100 text-slate-700'
                          }`}>{customOutput}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Terminal Console Output */}
              {activeTab === 'console' && (
                <div className="space-y-1.5 font-mono text-xs animate-fade-in">
                  {terminalLogs.map((log, idx) => {
                    let colorClass = theme === 'dark' ? 'text-zinc-400' : 'text-slate-600';
                    if (log.startsWith("❌") || log.startsWith("🛑")) colorClass = "text-rose-500 font-bold";
                    if (log.startsWith("🟢") || log.startsWith("🎉")) colorClass = "text-emerald-500 font-black";
                    if (log.startsWith("⚙️") || log.startsWith("⚡")) colorClass = "text-violet-500";
                    
                    return (
                      <div key={idx} className={`${colorClass} whitespace-pre-wrap`}>
                        {log}
                      </div>
                    );
                  })}

                  {/* Show AI Hints for errors */}
                  {compilerStatus === 'error' && compilationError && (
                    <div className="mt-4 p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl flex items-start gap-3 text-rose-600 dark:text-rose-400">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="text-[9px] font-black uppercase tracking-widest leading-none">Diagnostic AI Hint</div>
                        <p className="text-xs font-semibold leading-relaxed">{compilationError}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Results & Status Colors */}
              {activeTab === 'results' && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Appreciation Messages & Status */}
                  {appreciationMsg && (
                    <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm ${
                      compilerStatus === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                    }`}>
                      <div className="flex items-center gap-3">
                        {compilerStatus === 'success' ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                            <CheckCircle2 size={18} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-600 shrink-0">
                            <XCircle size={18} />
                          </div>
                        )}
                        <span className="text-sm font-extrabold">{appreciationMsg}</span>
                      </div>
                    </div>
                  )}

                  {/* Test Cases Results cards */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {testResults.map((tr, idx) => (
                      <div 
                        key={tr.id} 
                        className={`p-5 rounded-xl border font-mono text-xs transition-all relative ${
                          tr.status === 'passed'
                            ? 'bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5'
                            : tr.status === 'failed'
                              ? 'bg-rose-500/5 border-rose-500/20 shadow-rose-500/5 animate-shake'
                              : theme === 'dark' ? 'bg-zinc-900/30 border-zinc-800' : 'bg-slate-50/50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3 border-b pb-2 dark:border-zinc-800 border-slate-100">
                          <span className="font-extrabold text-indigo-500">Test Case #{idx + 1}</span>
                          
                          <div className="flex items-center gap-1.5">
                            {tr.status === 'passed' && (
                              <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                <Check size={12} /> Pass
                              </span>
                            )}
                            {tr.status === 'failed' && (
                              <span className="flex items-center gap-1 bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                <XCircle size={12} /> Fail
                              </span>
                            )}
                            {tr.status === 'pending' && (
                              <span className="bg-slate-100 dark:bg-zinc-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Test Case Inputs & Outputs Diff details */}
                        <div className="space-y-2 font-mono">
                          {tr.input && (
                            <div>
                              <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Input</span>
                              <pre className={`p-1.5 rounded mt-0.5 text-[11px] ${theme === 'dark' ? 'bg-zinc-950 text-zinc-300' : 'bg-slate-100 text-slate-700'}`}>{tr.input}</pre>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Expected Output</span>
                              <pre className={`p-1.5 rounded mt-0.5 text-[11px] ${theme === 'dark' ? 'bg-zinc-950 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>{tr.expected}</pre>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Your Output</span>
                              <pre className={`p-1.5 rounded mt-0.5 text-[11px] ${
                                tr.status === 'passed' 
                                  ? theme === 'dark' ? 'bg-zinc-950 text-emerald-400' : 'bg-emerald-50 text-emerald-700' 
                                  : theme === 'dark' ? 'bg-zinc-950 text-rose-400' : 'bg-rose-50 text-rose-700'
                              }`}>{tr.status === 'pending' ? 'None' : tr.actual}</pre>
                            </div>
                          </div>

                          {tr.status === 'failed' && tr.error && (
                            <div className="pt-2 text-[10px] text-rose-500 font-bold">
                              Mismatch details: {tr.error}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          </div>

        </section>

      </main>

      {/* CELEBRATION MODAL COMPONENT */}
      <AnimatePresence>
        {showCelebrationModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6 select-text">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`max-w-lg w-full rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden text-center border ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'
              }`}
            >
              {/* Sparkle neon orb background */}
              <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 mx-auto flex items-center justify-center text-4xl shadow-inner animate-bounce">
                🏆
              </div>
              
              <div className="space-y-2">
                <div className="text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1">
                  <Sparkles size={12} fill="currentColor" /> Level Mission Cleared! <Sparkles size={12} fill="currentColor" />
                </div>
                <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  "MISSION COMPLETED"
                </h3>
                <p className={`text-xs font-semibold leading-relaxed px-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Outstanding solution! Your program compiled, executed, and validated successfully against all expected test cases. You've earned <span className="text-indigo-600 font-extrabold">+{activeLevel.xpReward} XP</span> and strengthened your algorithms muscle memory!
                </p>
              </div>

              {/* Console log execution preview */}
              <div className={`p-4 rounded-xl text-left font-mono text-xs border ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-900' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5">Standard Output Stream</div>
                <div className="text-emerald-500 font-black whitespace-pre-line">{testResults[0]?.actual || "Output Ok!"}</div>
              </div>

              {/* Next step buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowCelebrationModal(false);
                    triggerSoundEffect('click');
                  }}
                  className={`flex-1 py-3 border rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                    theme === 'dark' 
                      ? 'border-zinc-800 hover:bg-zinc-800 text-white' 
                      : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Keep Reviewing
                </button>
                
                <button
                  onClick={() => {
                    setShowCelebrationModal(false);
                    triggerSoundEffect('click');
                    if (activeLevelIndex < zeroToCodingMonacoLevels.length - 1) {
                      setActiveLevelIndex(p => p + 1);
                    } else {
                      handleBackToDashboard();
                      toast.success("🎮 SPECTACULAR! You completed the Zero to Coding arcade!");
                    }
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Next Level <ChevronRight size={14} />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ZeroToCoding;
