import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  ArrowLeft, Play, RotateCcw, Check, Sparkles, HelpCircle, 
  Trophy, Terminal, Award, Zap, ChevronLeft, ChevronRight, RefreshCw, Volume2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { zeroToCodingMonacoLevels } from '../utils/zeroToCodingMonacoQuestions';

// Built-in Synthesizer Sound Engine for high-fidelity retro game sounds
const playSound = (type) => {
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
    }
  } catch (err) {
    console.warn("Audio engine inactive or waiting for user interaction:", err);
  }
};

const ZeroToCoding = () => {
  const { user, refreshUser } = useAuth();
  
  // Game & User Progression States
  const [userState, setUserState] = useState({
    xp: 0,
    level: 1,
    streak: 5, // starting streak
    completedQuestions: [],
    unlockedBadges: []
  });
  
  const [activeLevelIndex, setActiveLevelIndex] = useState(0); // Active Level Index (0-6)
  const activeLevel = zeroToCodingMonacoLevels[activeLevelIndex];
  
  // Editor state
  const [editorCode, setEditorCode] = useState('');
  
  // Console / Terminal state
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [compilerStatus, setCompilerStatus] = useState('idle'); // 'idle' | 'compiling' | 'success' | 'error'
  const [compilationError, setCompilationError] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('');

  // Interactive UI indicators
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [showHintIndex, setShowHintIndex] = useState(-1);
  
  // Confetti particles generator helper
  const [particles, setParticles] = useState([]);

  // Load state from backend or LocalStorage
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

  // Sync state helper
  const saveUserState = async (updated) => {
    setUserState(updated);
    localStorage.setItem('careerforge_zero_to_coding', JSON.stringify(updated));
    
    try {
      // Sync seamlessly to backend
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

  // Preload boilerplate for active level
  useEffect(() => {
    if (activeLevel) {
      setEditorCode(activeLevel.starterCode);
      setTerminalLogs(["// Terminal ready for compilation...", "Press 'Run Compiler' to execute."]);
      setCompilerStatus('idle');
      setCompilationError('');
      setTerminalOutput('');
      setShowHintIndex(-1);
    }
  }, [activeLevelIndex]);

  const triggerSoundEffect = (type) => {
    playSound(type);
  };

  // Pure CSS high-performance Confetti generator
  const triggerConfetti = () => {
    const freshParticles = [];
    const colors = ['#a78bfa', '#f472b6', '#38bdf8', '#34d399', '#fbbf24', '#f87171'];
    for (let i = 0; i < 80; i++) {
      freshParticles.push({
        id: i,
        x: Math.random() * 100, // percentage x-axis
        y: Math.random() * -30 - 10, // vertical starting point above viewport
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

  // Compile and evaluate
  const runCode = () => {
    if (!activeLevel) return;

    setCompilerStatus('compiling');
    setTerminalLogs([
      "⚙️ g++ -O3 -std=c++20 main.cpp -o main...",
      "⚡ Linking binary components...",
      "🚀 Executing binary main..."
    ]);

    setTimeout(() => {
      const res = activeLevel.validationFn(editorCode);
      
      if (res.success) {
        setCompilerStatus('success');
        setTerminalOutput(res.output);
        setTerminalLogs(prev => [
          ...prev,
          "🟢 Program executed cleanly.",
          `📥 Output: ${res.output}`,
          "🎉 STATUS: MISSION COMPLETED"
        ]);
        
        triggerSoundEffect('success');
        triggerConfetti();

        // Save XP
        let earnedXP = activeLevel.xpReward;
        let newXP = userState.xp + earnedXP;
        
        // Ranks Calculation
        let currentLevel = userState.level;
        let didLevelUp = false;
        if (newXP >= 200 && currentLevel < 8) {
          currentLevel = 8;
          didLevelUp = true;
        } else if (newXP >= 100 && currentLevel < 5) {
          currentLevel = 5;
          didLevelUp = true;
        } else if (newXP >= 50 && currentLevel < 3) {
          currentLevel = 3;
          didLevelUp = true;
        } else if (newXP >= 20 && currentLevel < 2) {
          currentLevel = 2;
          didLevelUp = true;
        }

        // Add to completed list
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
            toast.success(`🎉 LEVEL UP! You are now a Level ${currentLevel} Coder!`, { duration: 5000 });
          }, 800);
        }

        setShowCelebrationModal(true);
      } else {
        setCompilerStatus('error');
        setCompilationError(res.error);
        setTerminalLogs(prev => [
          ...prev,
          "❌ Compilation failed.",
          `🛑 Error: ${res.error}`
        ]);
        triggerSoundEffect('error');
      }
    }, 1200);
  };

  const handleResetCode = () => {
    if (window.confirm("Are you sure you want to reset your editor code back to the starter boilerplate?")) {
      setEditorCode(activeLevel.starterCode);
      setTerminalLogs(["// Terminal reset.", "Ready for compiler execution..."]);
      setCompilerStatus('idle');
      setCompilationError('');
      setTerminalOutput('');
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Ranks helper
  const getRankName = (xp) => {
    if (xp >= 200) return "Architect 🏆";
    if (xp >= 100) return "Coder ⚡";
    if (xp >= 50) return "Builder 🧠";
    if (xp >= 20) return "Explorer 🧭";
    return "Rookie 👾";
  };

  return (
    <div className="h-screen bg-[#09090b] text-[#f4f4f5] relative overflow-hidden flex flex-col font-sans">
      
      {/* Background Neon Orbs */}
      <div className="absolute top-[-25%] left-[-10%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Floating Confetti particles */}
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

      {/* FULL-SCREEN SPLIT WORKSPACE PANELS */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* ========================================================
            LEFT PANEL: Learning section & mascot briefings
           ======================================================== */}
        <div className="w-full lg:w-[45%] border-r border-[#1c1c1f] bg-[#0c0a09]/60 flex flex-col overflow-y-auto">
          
          {/* Header Panel Navigator */}
          <div className="p-6 border-b border-[#1c1c1f] bg-[#0c0a09] flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
            <button 
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Back to CF
            </button>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-lg text-[9px] font-black uppercase tracking-wider">
                Level {activeLevel.id} / 7
              </span>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                {activeLevel.difficulty}
              </span>
            </div>
          </div>

          <div className="p-8 space-y-8 flex-1">
            
            {/* Topic & Rewards Block */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">
                  {activeLevel.title}
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-1">C++ Programming Foundations</p>
              </div>

              {/* Status metrics pill */}
              <div className="bg-[#18181b] border border-[#27272a] px-4 py-2 rounded-2xl flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1.5 border-r border-[#27272a] pr-3">
                  <Zap size={14} className="text-violet-400 fill-violet-400" />
                  <span className="text-xs font-black text-white">{activeLevel.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-orange-500">🔥 {userState.streak} Days</span>
                </div>
              </div>
            </div>

            {/* Forgey Mascot Mission Card */}
            <div className="bg-gradient-to-r from-violet-950/40 via-[#121214] to-cyan-950/40 border border-violet-500/20 p-6 rounded-[2rem] shadow-xl relative overflow-hidden flex items-start gap-4">
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl"></div>
              <div className="w-12 h-12 bg-[#1c1c1f] border border-violet-500/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner animate-bounce">
                🤖
              </div>
              <div className="space-y-1 relative z-10">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Mission Objective</div>
                <p className="text-xs text-gray-300 font-semibold leading-relaxed">
                  "{activeLevel.learningObjective}"
                </p>
              </div>
            </div>

            {/* Challenge Task Card */}
            <div className="bg-[#121214] border border-[#1c1c1f] rounded-[2rem] p-8 space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                📋 Challenge Statement
              </h3>
              <p className="text-sm font-semibold text-gray-400 leading-relaxed whitespace-pre-line">
                {activeLevel.problemStatement}
              </p>
              
              <div className="border-t border-[#1c1c1f] pt-6 grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Input Context</div>
                  <div className="text-white font-bold">No Input Needed</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Expected Output</div>
                  <div className="text-emerald-400 font-bold whitespace-pre-line">{activeLevel.id === 2 ? "Hello\nWorld" : activeLevel.id === 7 ? "*\n**" : activeLevel.id === 6 ? "1 2 3 " : activeLevel.id === 4 ? "Code is: 42" : activeLevel.id === 3 ? "20" : activeLevel.id === 5 ? "Can Vote" : "Hello World!"}</div>
                </div>
              </div>
            </div>

            {/* Clues accordion */}
            <div className="space-y-3">
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Compiler Clues & Hints</div>
              <div className="space-y-2">
                {activeLevel.hints.map((hint, idx) => (
                  <div key={idx} className="border border-[#1c1c1f] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setShowHintIndex(showHintIndex === idx ? -1 : idx)}
                      className="w-full px-5 py-3.5 bg-[#121214] hover:bg-[#18181b] flex items-center justify-between text-left transition-colors"
                    >
                      <span className="text-xs font-black text-white">Hint #{idx + 1}</span>
                      <HelpCircle size={14} className="text-gray-400" />
                    </button>
                    <AnimatePresence>
                      {showHintIndex === idx && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden bg-[#18181b]/30"
                        >
                          <p className="p-5 text-xs font-medium text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {hint}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Progression & Rank Indicators */}
            <div className="bg-[#121214] border border-[#1c1c1f] rounded-[2rem] p-6 space-y-4">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-gray-500 uppercase tracking-widest">Rookie Rank</span>
                <span className="text-violet-400">{getRankName(userState.xp)}</span>
              </div>
              <div className="progress-container h-2 bg-[#1c1c1f]">
                <div className="progress-bar-fill bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${(userState.xp % 200) / 2}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-black">
                <span>{userState.xp} Total XP</span>
                <span>{200 - (userState.xp % 200)} XP to Next Rank</span>
              </div>
            </div>

          </div>

          {/* Bottom Module Navigator list */}
          <div className="p-6 bg-[#0c0a09] border-t border-[#1c1c1f] flex items-center justify-between sticky bottom-0 z-10">
            <button
              disabled={activeLevelIndex === 0}
              onClick={() => setActiveLevelIndex(p => p - 1)}
              className="flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronLeft size={16} /> Prev Level
            </button>
            <div className="flex gap-1.5">
              {zeroToCodingMonacoLevels.map((lvl, idx) => {
                const isCompleted = userState.completedQuestions.includes(lvl.id.toString());
                const isActive = idx === activeLevelIndex;
                
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setActiveLevelIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-black transition-all flex items-center justify-center ${
                      isActive 
                        ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20' 
                        : isCompleted 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-[#18181b] text-gray-500 border border-transparent hover:border-[#27272a]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <button
              disabled={activeLevelIndex === zeroToCodingMonacoLevels.length - 1}
              onClick={() => setActiveLevelIndex(p => p + 1)}
              className="flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-white disabled:opacity-20 transition-all"
            >
              Next Level <ChevronRight size={16} />
            </button>
          </div>

        </div>

        {/* ========================================================
            RIGHT PANEL: VS Code style Monaco Editor Sandbox
           ======================================================== */}
        <div className="flex-1 bg-[#09090b] flex flex-col overflow-hidden relative">
          
          {/* Top Panel header */}
          <div className="px-6 py-4 bg-[#09090b] border-b border-[#1c1c1f] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              </div>
              <span className="text-xs font-mono font-bold text-gray-400 bg-[#18181b] px-3 py-1 rounded-lg border border-[#27272a]">
                main.cpp (C++)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleResetCode}
                className="w-10 h-10 rounded-xl bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-gray-400 hover:text-white transition-all flex items-center justify-center text-xs font-bold"
                title="Reset starter template code"
              >
                <RotateCcw size={14} />
              </button>
              <button 
                onClick={runCode}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-violet-500/10 flex items-center gap-2 hover:-translate-y-0.5 transition-all"
              >
                <Play size={14} fill="white" /> Run Compiler
              </button>
            </div>
          </div>

          {/* Real Monaco Editor workspace box */}
          <div className="flex-1 min-h-[300px] bg-[#0c0a09] relative flex flex-col justify-between">
            <div className="flex-1 relative overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="cpp"
                defaultValue={activeLevel.starterCode}
                value={editorCode}
                onChange={(val) => setEditorCode(val || '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: 'Fira Code, Monaco, Courier New, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  renderLineHighlight: 'all',
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible'
                  }
                }}
              />
            </div>
          </div>

          {/* INTERACTIVE TERMINAL / OUTPUT PANEL */}
          <div className="h-[220px] bg-[#09090b] border-t border-[#1c1c1f] flex flex-col">
            
            {/* Header tab */}
            <div className="px-6 py-2 bg-[#09090b] border-b border-[#1c1c1f] flex items-center gap-3 text-xs font-bold text-gray-400">
              <Terminal size={14} />
              <span className="uppercase tracking-wider">Terminal output</span>
              <span className={`w-2.5 h-2.5 rounded-full ml-auto ${
                compilerStatus === 'compiling' ? 'bg-amber-500 animate-pulse' :
                compilerStatus === 'success' ? 'bg-emerald-500' :
                compilerStatus === 'error' ? 'bg-red-500' :
                'bg-gray-500'
              }`}></span>
            </div>

            {/* Terminal logs list */}
            <div className="flex-1 p-6 font-mono text-xs overflow-y-auto space-y-1.5 selection:bg-violet-500/30 selection:text-white">
              {terminalLogs.map((log, idx) => {
                let colorClass = "text-gray-400";
                if (log.startsWith("❌") || log.startsWith("🛑")) colorClass = "text-red-400 font-bold";
                if (log.startsWith("🟢") || log.startsWith("🎉") || log.startsWith("📥")) colorClass = "text-emerald-400 font-black";
                if (log.startsWith("⚙️") || log.startsWith("⚡")) colorClass = "text-indigo-400";
                
                return (
                  <div key={idx} className={`${colorClass} whitespace-pre-wrap`}>
                    {log}
                  </div>
                );
              })}

              {/* Show errors in friendly format */}
              {compilerStatus === 'error' && compilationError && (
                <div className="mt-4 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-3 text-red-300">
                  <div className="w-5 h-5 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">⚠️</div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest">Friendly AI Hint</div>
                    <p className="text-xs font-semibold leading-relaxed">{compilationError}</p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* MISSION COMPLETED CELEBRATION POPUP DIALOG */}
      <AnimatePresence>
        {showCelebrationModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0c0a09] border-2 border-violet-500/30 max-w-lg w-full rounded-[2.5rem] p-8 md:p-10 space-y-6 shadow-2xl relative overflow-hidden text-center"
            >
              {/* Gold trophy icon */}
              <div className="w-20 h-20 rounded-full bg-violet-500/10 border border-violet-500/20 mx-auto flex items-center justify-center text-4xl shadow-inner animate-bounce">
                🏆
              </div>
              
              <div className="space-y-2">
                <div className="text-violet-400 text-xs font-black uppercase tracking-widest">Level Up Completed!</div>
                <h3 className="text-2xl font-black text-white tracking-tight">"MISSION COMPLETED"</h3>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed px-4">
                  Outstanding job, Cadet! Your C++ program compiled and matched output cases exactly! You've earned **+{activeLevel.xpReward} XP** and strengthened your developer muscle memory!
                </p>
              </div>

              {/* Console log preview */}
              <div className="bg-[#121214] border border-[#1c1c1f] p-4 rounded-xl text-left font-mono text-xs">
                <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Standard Console Output</div>
                <div className="text-emerald-400 font-bold">{terminalOutput}</div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowCelebrationModal(false)}
                  className="flex-1 py-4 bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] rounded-2xl text-xs font-black text-white uppercase tracking-wider transition-colors"
                >
                  Keep Reviewing
                </button>
                
                <button
                  onClick={() => {
                    setShowCelebrationModal(false);
                    // Next question sequence
                    if (activeLevelIndex < zeroToCodingMonacoLevels.length - 1) {
                      setActiveLevelIndex(p => p + 1);
                    } else {
                      handleBackToDashboard();
                      toast.success("🎮 SPECTACULAR! You completed the Zero to Coding arcade!");
                    }
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-violet-500/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
                >
                  Continue Learning <ChevronRight size={14} />
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
