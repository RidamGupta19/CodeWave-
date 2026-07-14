import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  FiLock, FiUnlock, FiCheckCircle, FiPlayCircle, FiZap, FiStar, 
  FiTrendingUp, FiAward, FiClock, FiCode, FiInfo 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useFeatureFlags } from '../context/FeatureFlagContext';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeDsaProfile, DSA_LEVELS, DSA_LANGUAGE_LABELS, getDsaBadgeForLevel, getStreakRank, normalizeDsaLanguage } from '../utils/dsaPersonalization';

// Beautiful gamified icons for DSA and Generic roadmaps
const getLevelIcon = (index, domainSlug) => {
  if (domainSlug === 'dsa') {
    const dsaIcons = ["🌱", "🧱", "🗺️", "🥷", "⚔️", "🛡️", "🌳", "⛰️", "👹", "🏹", "🏆"];
    return dsaIcons[index] || "🔥";
  }
  const icons = ["🌐", "🧱", "🎨", "🧟", "🐙", "⚛️", "⚙️", "🗄️", "🏗️"];
  return icons[index] || "⭐️";
};

const getLevelThreshold = (index) => {
  return index * 300;
};

// DSA specific gamified level titles
const dsaLevelNames = DSA_LEVELS;

const Roadmap = () => {
  const { user, refreshUser } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const navigate = useNavigate();
  const [domainData, setDomainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState(null);

  // Dynamic language selection state synced with local cache
  const [selectedLang, setSelectedLang] = useState(() => normalizeDsaLanguage(localStorage.getItem('dsa_lang') || 'cpp'));
  const [useStriverAdvanced, setUseStriverAdvanced] = useState(() => localStorage.getItem('striver_advanced') === 'true');

  const getProgressKey = (slug) => {
    if (!slug) return 'dsa';
    const lowercaseSlug = slug.toLowerCase();
    if (lowercaseSlug === 'web-development' || lowercaseSlug === 'webdev') return 'webdev';
    if (lowercaseSlug === 'open-source' || lowercaseSlug === 'opensource') return 'opensource';
    if (lowercaseSlug === 'devops') return 'devops';
    if (lowercaseSlug === 'dsa') return 'dsa';
    return 'dsa';
  };

  const activeDomainSlug = user?.activeDomain?.slug || user?.selectedDomain?.slug || 'dsa';
  const activeDomainKey = getProgressKey(activeDomainSlug);
  const activeDomainProgress = user?.domainsProgress?.[activeDomainKey] || {
    xp: 0,
    currentPhase: 1,
    overallProgress: 0,
    completedTopics: []
  };

  const domainId = user?.selectedDomain?._id || user?.selectedDomain;

  // Track initial state
  useEffect(() => {
    const initRoadmap = async () => {
      try {
        const freshUser = await refreshUser();
        if (!freshUser?.selectedDomain) {
          navigate('/domains');
          return;
        }
        if (freshUser?.selectedDomain?.slug === 'devops' && !isFeatureEnabled('devops_terminal')) {
          navigate('/domains');
          return;
        }
        if (freshUser?.profile?.onboardingAnswers?.dsa_language) {
          setSelectedLang(normalizeDsaLanguage(localStorage.getItem('dsa_lang') || freshUser.profile.onboardingAnswers.dsa_language));
        }
      } catch (err) {
        console.error(err);
      }
    };
    initRoadmap();
  }, []);

  // Fetch roadmap data
  useEffect(() => {
    if (domainId) {
      if (activeDomainSlug === 'devops' && !isFeatureEnabled('devops_terminal')) {
        navigate('/domains');
        return;
      }
      fetchRoadmap(domainId);
    }
  }, [domainId]);

  // Sync state modifications with local persistence
  useEffect(() => {
    localStorage.setItem('dsa_lang', selectedLang);
  }, [selectedLang]);

  useEffect(() => {
    localStorage.setItem('striver_advanced', useStriverAdvanced.toString());
  }, [useStriverAdvanced]);

  const fetchRoadmap = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/domains/${id}`);
      setDomainData(res.data.data);
      if (activeLevel === null) {
        setActiveLevel(activeDomainProgress.currentPhase || 1);
      }
    } catch (err) {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const isTopicCompleted = (topicId) => {
    return activeDomainProgress.completedTopics?.some(t => t.topicId === topicId || t.topicId?._id === topicId);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
    </div>
  );
  
  if (!domainData) return null;

  const { domain, phases } = domainData;
  const currentXP = activeDomainProgress.xp || 0;
  const currentStreak = user.dailyStreak || 0;
  const isDSA = domain.slug === 'dsa';
  const dsaAnswers = user.profile?.onboardingAnswers || {};
  const dsaAnalysis = isDSA ? (dsaAnswers.dsaAnalysis || analyzeDsaProfile(dsaAnswers)) : null;
  const streakRank = getStreakRank(currentStreak);
  const activeBadge = getDsaBadgeForLevel(activeDomainProgress.currentPhase || 1);

  const langNames = DSA_LANGUAGE_LABELS;

  const handleSkipLevel = async () => {
    const levelName = isDSA ? (dsaLevelNames[activeLevel] || phases[activeLevel].name) : phases[activeLevel].name;
    if (window.confirm(`Are you sure you want to skip the entire "${levelName}" (Level ${activeLevel}) and mark all its topics as completed?`)) {
      try {
        const activePhase = phases.find(p => p.phaseNumber === activeLevel);
        if (!activePhase) return;
        
        toast.loading('Processing skip...', { id: 'skip-level' });
        const res = await api.post('/progress/skip-phase', { phaseId: activePhase._id });
        
        if (res.data.success) {
          toast.success('Level skipped successfully! 🚀', { id: 'skip-level' });
          await refreshUser();
          fetchRoadmap(domainId);
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to skip level', { id: 'skip-level' });
      }
    }
  };

  return (
    <div className="pb-20 max-w-6xl mx-auto px-6 pt-10 transition-colors duration-300">
      
      {/* Premium Gamification Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in">
        <div className="card p-6 bg-[var(--bg-card)] flex items-center gap-5 border-b-4 border-amber-400">
          <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-2xl text-amber-500 shadow-inner">
            <FiZap fill="currentColor" />
          </div>
          <div>
            <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider">Experience Points</div>
            <div className="text-2xl font-black text-[var(--text-main)]">{currentXP} XP</div>
          </div>
        </div>
        
        <div className="card p-6 bg-[var(--bg-card)] flex items-center gap-5 border-b-4 border-emerald-400">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl text-emerald-500 shadow-inner">
            <FiTrendingUp />
          </div>
          <div>
            <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider">Daily Streak</div>
            <div className="text-2xl font-black text-[var(--text-main)]">{currentStreak} 🔥</div>
          </div>
        </div>
        
        <div className="card p-6 bg-[var(--bg-card)] flex items-center gap-5 border-b-4 border-indigo-400">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl text-[var(--primary)] shadow-inner">
            <FiStar />
          </div>
          <div>
            <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider">Current Rank</div>
            <div className="text-2xl font-black text-[var(--text-main)]">
              {isDSA ? (dsaLevelNames[activeDomainProgress.currentPhase || 1] || 'Apprentice') : (phases[activeDomainProgress.currentPhase || 1]?.name || 'Apprentice')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Roadmap Description */}
      <div className="text-center mb-12">
        <div className={`inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-[var(--border)]`}>
          <FiZap /> {isDSA ? `${dsaAnalysis.roadmapType} • ${dsaAnalysis.recommendedPace}` : (user.profile?.roadmapType || 'Steady Pace')} • {isDSA ? dsaAnalysis.estimatedTimeline : (user.profile?.estimatedTimeline || '6 Months')}
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-gradient tracking-tight">
          {isDSA ? 'The Ultimate DSA Journey' : `Your ${domain.name} Adventure`}
        </h1>
        <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-sm font-bold leading-relaxed">
          {isDSA 
            ? dsaAnalysis.aiSummary
            : (user.profile?.aiSummary || "Master each level to unlock the next chapter of your coding journey.")}
        </p>
      </div>

      {isDSA && (
        <div className="grid lg:grid-cols-4 gap-4 mb-12">
          {[
            ['AI Start Point', `Level ${dsaAnalysis.startingLevel}: ${dsaAnalysis.startLevelName}`],
            ['Detected Skill', dsaAnalysis.skillLevel],
            ['Current Badge', activeBadge.name],
            ['Streak Rank', `${streakRank.name} • ${streakRank.next}`]
          ].map(([label, value]) => (
            <div key={label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
              <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-light)] mb-2">{label}</div>
              <div className="text-sm font-black text-[var(--text-main)] leading-snug">{value}</div>
            </div>
          ))}
          <div className="lg:col-span-4 bg-[var(--brand-purple)] text-white rounded-2xl p-6 shadow-[var(--shadow-soft)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-purple-200 mb-2">AI Recommendations</div>
                <p className="text-sm text-white font-bold leading-relaxed">
                  {dsaAnalysis.startReason} Focus next on {dsaAnalysis.weakTopics[0] || 'Arrays'}, keep lessons in {langNames[selectedLang]}, and complete the Watch, Notes, Dry Run, Practice, Challenge loop before unlocking the next topic.
                </p>
              </div>
              <div className="shrink-0 grid grid-cols-2 gap-2 text-center">
                <div className="bg-[var(--bg-card)]/20 border border-white/20 rounded-xl p-3">
                  <div className="text-[8px] font-black text-purple-100 uppercase">Strongest</div>
                  <div className="text-xs font-black text-white">{dsaAnalysis.strongestTopic}</div>
                </div>
                <div className="bg-[var(--bg-card)]/20 border border-white/20 rounded-xl p-3">
                  <div className="text-[8px] font-black text-purple-100 uppercase">Weak Topic</div>
                  <div className="text-xs font-black text-white">{dsaAnalysis.weakTopics[0] || 'Recursion'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Language Selector for DSA ROADMAP */}
      {isDSA && (
        <div className="card p-6 mb-12 border-amber-500/20 max-w-2xl mx-auto relative overflow-hidden bg-gradient-to-r from-[var(--bg-card)] via-[var(--bg-sub)] to-[var(--bg-card)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div>
              <h3 className="text-sm font-black text-[var(--text-main)] flex items-center gap-2">
                <FiCode className="text-amber-500 text-lg" /> Selected Language Option
              </h3>
              <p className="text-[10px] text-[var(--text-light)] font-bold uppercase mt-1 tracking-wider">
                Current: <span className="text-amber-500">{langNames[selectedLang] || 'C++'}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-1 bg-[var(--bg-sub)] p-1 rounded-xl border border-[var(--border)] shadow-inner">
              {['cpp', 'java', 'python', 'javascript'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(normalizeDsaLanguage(lang))}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                    selectedLang === lang 
                      ? 'bg-amber-500 text-white shadow-sm' 
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : lang}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Striver Advanced Track Toggle */}
          {(selectedLang === 'cpp' || selectedLang === 'java') && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-5 border-t border-[var(--border)] pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">🇬🇧</div>
                <div>
                  <div className="text-xs font-black text-[var(--text-main)]">
                    Comfortable learning in English?
                  </div>
                  <div className="text-[9px] font-semibold text-[var(--text-light)]">
                    Unlock Striver's Advanced DSA Track as an optional learning overlay.
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setUseStriverAdvanced(!useStriverAdvanced)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow border ${
                  useStriverAdvanced 
                    ? 'bg-amber-500 border-amber-500 text-white' 
                    : 'bg-[var(--bg-sub)] border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-card)]'
                }`}
              >
                {useStriverAdvanced ? 'Striver Mode Active 🏆' : 'Try Striver Track'}
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Connected Progression Level Path */}
      <div className="relative py-6 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-start gap-12 min-w-max px-10 pb-10 relative">
          
          {phases.map((phase, index) => {
            const isUnlocked = index <= (activeDomainProgress.currentPhase || 1);
            const isCompleted = index < (activeDomainProgress.currentPhase || 1);
            const isCurrent = index === (activeDomainProgress.currentPhase || 1);
            
            // Override title if domain is DSA
            const levelName = isDSA ? (dsaLevelNames[index] || phase.name) : phase.name;

            let nodeClass = "locked";
            if (isCompleted) nodeClass = "completed";
            else if (isCurrent) nodeClass = "active";

            return (
              <div key={phase._id} className="flex flex-col items-center relative z-10">
                {/* Level Node with custom states */}
                <motion.div
                  whileHover={isUnlocked ? { scale: 1.08, y: -4 } : {}}
                  onClick={() => isUnlocked && setActiveLevel(index)}
                  className={`level-node w-24 h-24 cursor-pointer relative ${nodeClass}`}
                >
                  <span className="text-4xl mb-1 filter drop-shadow-sm">{getLevelIcon(index, domain.slug)}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest mt-0.5">LVL {index}</span>
                  {isDSA && index < dsaAnalysis.startingLevel && (
                    <div className="absolute -bottom-3 bg-sky-500 text-white text-[7px] px-2 py-0.5 rounded-full font-black shadow-sm">
                      AI SKIP
                    </div>
                  )}
                  
                  {isCurrent && (
                    <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black animate-bounce shadow-md">
                      ACTIVE
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/30 dark:bg-black/50 rounded-full flex items-center justify-center backdrop-blur-[1px]">
                      <FiLock className="text-white text-lg" />
                    </div>
                  )}
                  {isCompleted && (
                    <FiCheckCircle className="absolute -bottom-1 -right-1 text-emerald-500 bg-[var(--bg-card)] dark:bg-zinc-900 rounded-full text-xl shadow" />
                  )}
                </motion.div>

                {/* Level Title */}
                <div className="mt-4 text-center max-w-[130px]">
                  <div className={`text-xs font-black leading-tight ${isUnlocked ? 'text-[var(--text-main)]' : 'text-[var(--text-light)]'}`}>{levelName}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] uppercase mt-1 tracking-widest">{getLevelThreshold(index)} XP</div>
                </div>

                {/* Connection Line */}
                {index < phases.length - 1 && (
                  <div 
                    className={`absolute top-[48px] left-[106px] w-[50px] h-1 rounded-full transition-colors duration-1000 ${
                      isUnlocked && (index + 1 <= (activeDomainProgress.currentPhase || 1)) 
                        ? 'bg-gradient-to-r from-emerald-500 to-[var(--primary)]' 
                        : 'bg-[var(--border)]'
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Details Expedition Panel */}
      {activeLevel !== null && (
        <motion.div 
          key={activeLevel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 card p-8 md:p-10 relative overflow-hidden border-2 border-[var(--border)]"
        >
          <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8 pb-8 border-b border-[var(--border)] relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl bg-[var(--bg-sub)] border border-[var(--border)] w-16 h-16 flex items-center justify-center rounded-2xl shadow-inner shrink-0">
                  {getLevelIcon(activeLevel, domain.slug)}
                </span>
                <div>
                  <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight">
                    {isDSA ? (dsaLevelNames[activeLevel] || phases[activeLevel].name) : phases[activeLevel].name}
                  </h2>
                  <div className="text-[var(--primary)] font-black text-xs tracking-widest uppercase mt-0.5">Level {activeLevel} Expedition</div>
                </div>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed max-w-2xl font-semibold text-sm">
                {phases.find(p => p.phaseNumber === activeLevel)?.description || "Complete these challenges to master this level and earn massive XP rewards."}
              </p>
            </div>
            
            {/* Rewards Pill & Skip Level Actions */}
            <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
              <div className="bg-[var(--bg-sub)] border border-[var(--border)] p-5 rounded-2xl shadow-sm w-full">
                <div className="text-[9px] font-black text-[var(--primary)] uppercase tracking-widest mb-3">Completion Rewards</div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-[var(--text-main)] font-black text-sm">
                    <div className="w-7 h-7 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center"><FiZap /></div>
                    +500 XP
                  </div>
                  <div className="flex items-center gap-3 text-[var(--text-main)] font-black text-sm">
                    <div className="w-7 h-7 bg-indigo-500/10 text-[var(--primary)] rounded-lg flex items-center justify-center"><FiAward /></div>
                    Master Badge
                  </div>
                </div>
              </div>

              {activeLevel === (activeDomainProgress.currentPhase || 1) && (
                <button
                  onClick={handleSkipLevel}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-sub)] border-2 border-[var(--border)] text-[var(--text-main)] font-black text-xs tracking-wider uppercase transition duration-300 shadow-sm w-full"
                >
                  ⏭️ Skip Whole Level
                </button>
              )}
            </div>
          </div>

          <TopicsList 
            phaseId={phases.find(p => p.phaseNumber === activeLevel)?._id} 
            isTopicCompleted={isTopicCompleted}
            activeLevel={activeLevel}
            isDSA={isDSA}
          />
        </motion.div>
      )}
    </div>
  );
};

const TopicsList = ({ phaseId, isTopicCompleted, activeLevel, isDSA }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (phaseId) {
      setLoading(true);
      api.get(`/topics/phase/${phaseId}`).then(res => {
        setTopics(res.data.data);
        setLoading(false);
      });
    }
  }, [phaseId]);

  if (!phaseId) return <div className="text-center py-10 text-[var(--text-light)] italic">No missions defined for this level yet.</div>;
  
  if (loading) return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary)] border-t-transparent mx-auto"></div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
      {topics.map((topic, i) => {
        const completed = isTopicCompleted(topic._id);
        
        return (
          <Link 
            key={topic._id} 
            to={`/topic/${topic._id}`}
            className={`group p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
              completed 
                ? 'bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5' 
                : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-500 shrink-0 ${
                completed 
                  ? 'bg-green-100 text-[var(--brand-green)] shadow-[var(--shadow-soft)]' 
                  : 'bg-[var(--bg-sub)] text-[var(--text-light)] group-hover:bg-[var(--brand-green-light)] group-hover:text-[var(--brand-green)] group-hover:rotate-6'
              }`}>
                {completed ? <FiCheckCircle /> : <FiPlayCircle />}
              </div>
              <div>
                <h4 className={`font-black text-sm transition-colors leading-snug ${completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-main)] group-hover:text-[var(--primary)]'}`}>{topic.title}</h4>
                <div className="text-[9px] font-black text-[var(--text-light)] uppercase mt-1 tracking-widest flex items-center gap-2.5">
                  <span className="flex items-center gap-1"><FiClock /> {topic.estimatedTime}</span>
                  <span className="w-1 h-1 bg-[var(--border)] rounded-full"></span>
                  <span className="text-amber-500 font-black">+50 XP</span>
                  {isDSA && <span className="text-[var(--primary)] font-black">Watch • Quiz • Code</span>}
                </div>
              </div>
            </div>
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[var(--bg-sub)] text-[var(--text-light)] group-hover:bg-[var(--primary-light)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5'}`}>
              <FiZap className="text-base" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Roadmap;
