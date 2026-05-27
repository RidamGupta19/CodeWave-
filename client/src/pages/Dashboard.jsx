import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FiTarget, FiAward, FiClock, FiActivity, FiArrowRight, FiCalendar, FiBook, FiChevronRight, FiZap, FiStar, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeDsaProfile, getDsaBadgeForLevel, getStreakRank } from '../utils/dsaPersonalization';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/progress/dashboard');
      setData(res.data.data);
      
      const certRes = await api.get('/certificates/my');
      setCertificates(certRes.data.data);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
    </div>
  );

  if (!data || !data.user) return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="text-5xl mb-6">⚠️</div>
      <h2 className="text-2xl font-black text-[var(--text-main)] mb-2">Something went wrong</h2>
      <p className="text-[var(--text-muted)] mb-8">We couldn't load your journey data. Try refreshing the page.</p>
      <button onClick={() => window.location.reload()} className="btn-primary px-8 py-3">Refresh Page</button>
    </div>
  );

  const { user, currentPhaseData, upcomingAssessment, testsPassed, totalBadges, activityLog } = data;
  const isDsa = user.selectedDomain?.slug === 'dsa';
  const dsaAnalysis = isDsa ? (user.profile?.onboardingAnswers?.dsaAnalysis || analyzeDsaProfile(user.profile?.onboardingAnswers || {})) : null;
  const streakRank = getStreakRank(user.dailyStreak || 0);
  const dsaBadge = getDsaBadgeForLevel(user.currentPhase || 0);

  if (!user.selectedDomain) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6 min-h-[80vh]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-[var(--primary-light)] text-[var(--primary)] rounded-3xl flex items-center justify-center text-5xl mb-10 shadow-xl"
        >
          🚀
        </motion.div>
        <h2 className="text-4xl font-black text-[var(--text-main)] mb-6 tracking-tight">Ready to start your adventure?</h2>
        <p className="text-[var(--text-muted)] max-w-lg mx-auto mb-12 text-lg leading-relaxed font-semibold">
          Your developer journey begins with a single choice. Pick a domain and let our AI guide you from rookie to architect.
        </p>
        <Link to="/domains" className="btn-primary text-lg px-12 py-4 shadow-xl shadow-indigo-500/20">Forge My Path</Link>
      </div>
    );
  }

  const getLastNDays = (n) => {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const recentDays = getLastNDays(14);

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 lg:px-10 transition-colors duration-300">
      
      {/* Dynamic Welcome Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-[9px] font-black uppercase tracking-wider border border-amber-500/20">
              Level {user.currentPhase || 0} Architect
            </div>
            <div className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-wider border border-indigo-500/20">
              {user.profile?.roadmapType || 'Steady Pace'}
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-wider border border-emerald-500/20">
              {user.profile?.estimatedTimeline || '6 Months'}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--text-main)] tracking-tight mb-2">
            Your <span className="text-gradient">Personalized Journey</span>
          </h1>
          <p className="text-[var(--text-muted)] font-extrabold text-lg">"Welcome back, {user.fullName.split(' ')[0]}. You're on the {user.profile?.roadmapType} path. ⚡"</p>
        </div>
        
        {/* User Stats Card */}
        <div className="flex items-center gap-6 bg-[var(--bg-card)] border border-[var(--border)] p-5 rounded-2xl shadow-sm">
          <div className="text-center border-r border-[var(--border)] pr-6">
            <div className="text-[9px] text-[var(--text-light)] uppercase font-black tracking-widest mb-1">XP Earned</div>
            <div className="text-2xl font-black text-[var(--text-main)]">
              {user.totalXP || user.xp || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-[var(--text-light)] uppercase font-black tracking-widest mb-1">Streak</div>
            <div className="text-2xl font-black text-amber-500 flex items-center gap-1.5">
              <FiZap fill="currentColor" /> {parseInt(localStorage.getItem('dsa_streak') || '0', 10) > 0 
                ? parseInt(localStorage.getItem('dsa_streak') || '0', 10) 
                : (user.dailyStreak || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Zero to Coding Arcade Invitation Card */}
      <div className="mb-10 bg-gradient-to-r from-[#1e152a] via-[#101012] to-[#0f1d24] p-8 rounded-3xl border border-violet-500/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-5 relative z-10 text-center md:text-left">
          <div className="w-14 h-14 bg-zinc-900 border border-violet-500/30 rounded-2xl flex items-center justify-center text-3xl shadow-inner animate-pulse shrink-0">
            👾
          </div>
          <div>
            <div className="inline-block px-2.5 py-0.5 bg-violet-500/20 text-violet-300 text-[9px] font-black uppercase tracking-wider rounded-lg mb-1.5 border border-violet-500/30">
              New to Programming?
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Zero to Coding Arcade</h2>
            <p className="text-xs text-zinc-400 font-semibold mt-1">
              Start with our Duolingo-style interactives! Print statements, simple math, variables, and logic games.
            </p>
          </div>
        </div>

        <Link 
          to="/zero-to-coding" 
          className="relative z-10 px-6 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 shrink-0"
        >
          Enter Arcade <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Certifications Banner (if earned) */}
      {certificates.length > 0 && (
        <div className="mb-10 bg-gradient-to-r from-emerald-950 via-[#101012] to-[#0f1d24] p-8 rounded-3xl border border-emerald-500/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-teal-600/10 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-5 relative z-10 text-center md:text-left">
            <div className="w-14 h-14 bg-zinc-900 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0">
              🏆
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-wider rounded-lg mb-1.5 border border-emerald-500/30">
                Official Certification
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Course Certified!</h2>
              <p className="text-xs text-zinc-400 font-semibold mt-1">
                You have successfully completed all lectures and requirements for {certificates[0].domainId?.name || 'DSA'}.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setSelectedCertificate(certificates[0])}
            className="relative z-10 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            View Certificate <FiAward />
          </button>
        </div>
      )}

      {/* Continue Learning System */}
      {(() => {
        const continueLearningDomains = [];
        if (user.domainsProgress) {
          const domainKeys = {
            dsa: { name: 'Data Structures & Algorithms', slug: 'dsa', icon: '🌳', color: '#6366f1' },
            webdev: { name: 'Web Development Explorer', slug: 'web-development', icon: '🌐', color: '#4361ee' },
            devops: { name: 'DevOps Expedition', slug: 'devops', icon: '🐳', color: '#10b981' },
            opensource: { name: 'Open Source Expedition', slug: 'open-source', icon: '🔓', color: '#f59e0b' }
          };

          for (const key of Object.keys(domainKeys)) {
            const prog = user.domainsProgress[key];
            if (prog && (prog.overallProgress > 0 || prog.xp > 0)) {
              continueLearningDomains.push({
                ...domainKeys[key],
                prog
              });
            }
          }
        }

        if (continueLearningDomains.length === 0) return null;

        return (
          <div className="mb-10 card p-8 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight">Continue Learning</h2>
              <span className="text-[10px] text-[var(--text-light)] uppercase font-black tracking-widest bg-[var(--bg-sub)] px-3 py-1 rounded-full border border-[var(--border)]">Multi-Domain Ecosystem</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {continueLearningDomains.map((item) => (
                <div 
                  key={item.slug} 
                  onClick={async () => {
                    try {
                      const domainsRes = await api.get('/domains');
                      const domainObj = domainsRes.data.data.find(d => d.slug.toLowerCase() === item.slug.toLowerCase());
                      if (domainObj) {
                        await api.post('/progress/select-domain', { domainId: domainObj._id });
                        window.location.href = '/roadmap';
                      }
                    } catch (e) {
                      toast.error('Failed to switch domain context');
                    }
                  }}
                  className="p-5 bg-[var(--bg-sub)] hover:bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--primary)] rounded-2xl shadow-sm cursor-pointer transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-[var(--border)]"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[var(--text-main)] text-sm group-hover:text-[var(--primary)] transition-colors">{item.name}</h4>
                      <p className="text-xs font-semibold text-[var(--text-muted)] mt-0.5">
                        {item.prog.currentCheckpoint 
                          ? `📍 Checkpoint: ${item.prog.currentCheckpoint.replace('_', ' ').replace('cp', 'Lecture ').toUpperCase()}`
                          : 'Started Recently'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className="text-xs font-black text-[var(--text-main)]">{item.prog.overallProgress || 0}%</div>
                      <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider">{item.prog.xp || 0} XP</div>
                    </div>
                    <FiChevronRight className="text-[var(--text-light)] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        {/* Active Quest Card */}
        <div className="card lg:col-span-2 p-8 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--primary)]/5 rounded-full blur-3xl transition-all group-hover:scale-150"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6 relative z-10">
            <div className="flex gap-5">
              <div className="w-16 h-16 bg-[var(--bg-sub)] rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-[var(--border)] shrink-0">
                {user.selectedDomain.icon}
              </div>
              <div>
                <div className="text-[var(--primary)] font-black text-[9px] uppercase tracking-widest mb-1.5">Current Mission Map</div>
                <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight mb-1.5">{user.selectedDomain.name}</h2>
                <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-bold text-sm">
                  <FiClock className="text-[var(--primary)]" /> {user.overallProgress}% Complete
                </div>
              </div>
            </div>
            <Link to="/roadmap" className="btn-secondary py-3 px-5 rounded-xl font-black text-xs hover:bg-[var(--bg-sub)] shrink-0">
              View Map <FiChevronRight size={14} className="ml-1" />
            </Link>
          </div>
          
          <div className="mb-8 relative z-10">
            <div className="flex justify-between items-end mb-2.5">
              <span className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest">Mastery Level Progress</span>
              <span className="text-xs font-black text-[var(--primary)]">Level {user.currentPhase || 0} to {user.currentPhase + 1}</span>
            </div>
            <div className="progress-container h-2.5 shadow-inner">
              <div className="progress-bar-fill" style={{ width: `${user.overallProgress}%` }}></div>
            </div>
          </div>

          {currentPhaseData ? (
            <div className="bg-[var(--bg-sub)] rounded-2xl p-6 border border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-6 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] text-xl font-black shadow-sm shrink-0">
                  {user.currentPhase}
                </div>
                <div>
                  <div className="text-[9px] text-[var(--primary)] font-black uppercase tracking-widest mb-0.5">Active Quest</div>
                  <div className="font-black text-[var(--text-main)] text-xl leading-tight">{currentPhaseData.name}</div>
                </div>
              </div>
              <Link to="/roadmap" className="btn-primary py-3 px-8 rounded-xl text-xs shrink-0 shadow-lg shadow-indigo-500/20">
                Continue Quest <FiArrowRight className="ml-2" />
              </Link>
            </div>
          ) : (
            <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-4">
              <FiStar className="text-3xl text-emerald-500 animate-pulse shrink-0" />
              <div>
                <div className="text-xl">Mission Accomplished!</div>
                <div className="text-xs font-bold opacity-80">You've mastered all architectural phases.</div>
              </div>
            </div>
          )}

          {/* DSA Specific Stats - Placement Readiness */}
          {user.selectedDomain?.slug === 'dsa' && (
            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-500/5 to-amber-500/5 rounded-2xl border border-[var(--border)] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                <FiZap className="text-8xl text-[var(--primary)]" />
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-6">
                <div>
                   <h3 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
                     <FiAward className="text-amber-500" /> Placement Readiness Rank
                   </h3>
                   <p className="text-[9px] font-black text-[var(--text-light)] mt-1 uppercase tracking-widest">
                     Current Standing: <span className="text-[var(--primary)] font-black">Level {user.currentPhase} {user.currentPhase >= 8 ? 'Beast' : user.currentPhase >= 4 ? 'Warrior' : 'Rookie'}</span>
                   </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-[9px] font-black text-[var(--text-light)] uppercase">Global percentile</div>
                    <div className="text-base font-black text-[var(--primary)]">Top 12%</div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col items-center justify-center shadow-md">
                    <div className="text-lg font-black text-[var(--text-main)]">{Math.min(Math.round((user.dsaStats?.totalProblemsSolved || 0) / 450 * 100), 100)}%</div>
                    <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-tighter">Ready</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm group">
                  <div className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest mb-1 group-hover:text-[var(--primary)] transition-colors">Solved</div>
                  <div className="text-2xl font-black text-[var(--text-main)]">{user.dsaStats?.totalProblemsSolved || 0}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] mt-0.5 uppercase">A2Z Problems</div>
                </div>
                <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm group">
                  <div className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest mb-1 group-hover:text-emerald-500 transition-colors">Mastered</div>
                  <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 truncate">{user.dsaStats?.strongestTopic || 'Foundations'}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] mt-0.5 uppercase">High Precision</div>
                </div>
                <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm group">
                  <div className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest mb-1 group-hover:text-rose-500 transition-colors">Vulnerable</div>
                  <div className="text-xs font-black text-rose-500 truncate">{user.dsaStats?.weakestTopic || 'Recursion'}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] mt-0.5 uppercase">Needs Review</div>
                </div>
                <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm group">
                  <div className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest mb-1 group-hover:text-amber-500 transition-colors">Next Badge</div>
                  <div className="text-xs font-black text-amber-500 truncate">{dsaBadge.name}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] mt-0.5 uppercase">Lvl {user.currentPhase + 1}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mb-6">
                <div className="p-4 bg-zinc-950 text-white rounded-xl border border-indigo-500/20">
                  <div className="text-[8px] font-black text-indigo-300 uppercase tracking-widest mb-1">AI Recommendation</div>
                  <div className="text-[11px] font-semibold leading-relaxed text-zinc-300">
                    Practice {dsaAnalysis?.weakTopics?.[0] || user.dsaStats?.weakestTopic || 'Recursion'} next with one tutorial, one dry run, and one accepted submission.
                  </div>
                </div>
                <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
                  <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-widest mb-1">Streak League</div>
                  <div className={`text-sm font-black ${streakRank.color}`}>{streakRank.name}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] mt-0.5 uppercase">{streakRank.next}</div>
                </div>
                <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
                  <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-widest mb-1">Roadmap Mode</div>
                  <div className="text-sm font-black text-[var(--text-main)]">{dsaAnalysis?.roadmapType || user.profile?.roadmapType}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] mt-0.5 uppercase">{dsaAnalysis?.estimatedTimeline || user.profile?.estimatedTimeline}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end text-xs">
                  <div className="flex items-center gap-1">
                    <FiStar className="text-amber-500" />
                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">STRIKE MISSION PROGRESS</span>
                  </div>
                  <span className="font-extrabold text-[var(--primary)]">{user.dsaStats?.totalProblemsSolved || 0} / 450 PROBLEMS</span>
                </div>
                <div className="h-2.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((user.dsaStats?.totalProblemsSolved || 0) / 450 * 100, 100)}%` }}
                    className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full shadow-lg"
                  ></motion.div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Level Stats Area */}
        <div className="flex flex-col gap-5">
          <motion.div whileHover={{ y: -4 }} className="card p-6 flex items-center gap-5 border-emerald-500/10 hover:shadow-lg transition-all">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl shadow-inner shrink-0">
              <FiTarget />
            </div>
            <div>
              <div className="text-2xl font-black text-[var(--text-main)]">{data.completedTopicsCount}</div>
              <div className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest">Skills Mastered</div>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ y: -4 }} className="card p-6 flex items-center gap-5 border-amber-500/10 hover:shadow-lg transition-all">
            <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl shadow-inner shrink-0">
              <FiAward />
            </div>
            <div>
              <div className="text-2xl font-black text-[var(--text-main)]">{testsPassed}</div>
              <div className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest">Badges Earned</div>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ y: -4 }} className="card p-6 flex items-center gap-5 border-indigo-500/10 hover:shadow-lg transition-all">
            <div className="w-14 h-14 rounded-xl bg-indigo-500/10 text-[var(--primary)] flex items-center justify-center text-2xl shadow-inner shrink-0">
              <FiStar />
            </div>
            <div>
              <div className="text-2xl font-black text-[var(--text-main)]">
                {user.totalXP || user.xp || 0}
              </div>
              <div className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest">Current XP</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left Column: AI Journeys & Activity heatmap */}
        <div className="space-y-8">
          {/* AI Journey Analysis */}
          <div className="card p-8 bg-zinc-950 text-white relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[var(--primary)]/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-[var(--primary)] flex items-center justify-center text-xl shadow-lg shrink-0">🤖</div>
              <h3 className="text-xl font-black tracking-tight">AI Journey Analysis</h3>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <p className="text-zinc-300 leading-relaxed font-semibold italic text-base">
                  "{user.profile?.aiSummary || "I'm analyzing your progress to give you personalized insights. Keep learning to unlock my analysis!"}"
                </p>
              </div>

              {user.profile?.recommendedProjects?.length > 0 && (
                <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/25 rounded-2xl p-6">
                  <div className="text-[9px] text-[var(--primary)] font-black uppercase tracking-widest mb-3">Recommended Projects</div>
                  <ul className="space-y-2.5">
                    {user.profile.recommendedProjects.map((project, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs font-bold text-zinc-200">
                        <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full shrink-0"></div> {project}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link to="/code-guru" className="flex items-center justify-center gap-2 w-full py-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-indigo-500/25">
                Discuss Strategy with Code Guru <FiArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Deep Work Heatmap */}
          <div className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[var(--text-main)] flex items-center gap-2">
                <FiCalendar className="text-emerald-500" /> Activity Log
              </h3>
              <div className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest">Last 14 Days</div>
            </div>
            <div className="flex gap-2 flex-wrap justify-start">
              {recentDays.map(date => {
                const dayLog = activityLog?.find(l => l.date === date);
                const intensity = dayLog ? Math.min(dayLog.minutes / 60, 1) : 0;
                return (
                  <motion.div 
                    key={date} 
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border border-[var(--border)] bg-[var(--bg-card)]"
                    style={{ 
                      backgroundColor: intensity > 0 ? `rgba(99, 102, 241, ${0.05 + intensity * 0.4})` : 'transparent'
                    }}
                    title={`${date}: ${dayLog?.minutes || 0} mins`}
                  >
                    {intensity > 0 && <div className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-lg shadow-indigo-500/50"></div>}
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-[9px] text-[var(--text-light)] uppercase font-black tracking-widest">
              <span>{recentDays[0]}</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Quest Trophies card */}
        <div className="card p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-[var(--text-main)]">Quest Trophies</h3>
            <div className="bg-[var(--primary-light)] text-[var(--primary)] px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest border border-[var(--border)]">{totalBadges} Badges</div>
          </div>
          
          {totalBadges > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {data.user.earnedBadges?.map((b, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-4 rounded-2xl bg-[var(--bg-sub)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--bg-card)] transition-all group shadow-sm"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 group-hover:rotate-6 transition-transform filter drop-shadow-sm">
                    {b.badgeId?.icon || '🏅'}
                  </div>
                  <div className="text-xs font-black text-[var(--text-main)] uppercase tracking-tight line-clamp-2 leading-tight">{b.badgeId?.name}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] uppercase mt-1 tracking-wider">Verified</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 opacity-80">
              <div className="text-6xl mb-6 grayscale">🏆</div>
              <h4 className="text-lg font-black text-[var(--text-main)] mb-2">No Trophies Yet</h4>
              <p className="text-[var(--text-muted)] max-w-[240px] text-xs font-semibold leading-relaxed">Master the final assessment of each phase to earn official badges.</p>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
             <Link to="/roadmap" className="w-full btn-primary py-4 text-xs rounded-xl shadow-lg shadow-indigo-500/20 uppercase tracking-widest font-black">
                Resume Adventure
             </Link>
          </div>
        </div>

      </div>

      {/* Certificate Viewer Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 no-print"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="bg-[var(--bg-card)] border-2 border-[var(--primary)]/30 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative p-8 flex flex-col items-center gap-6"
            >
              {/* Header actions */}
              <div className="w-full flex justify-between items-center border-b border-[var(--border)] pb-4">
                <h3 className="text-lg font-black text-[var(--text-main)] flex items-center gap-2 uppercase tracking-wide">
                  <FiAward className="text-emerald-500" /> Digital Certificate
                </h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Print / Download PDF
                  </button>
                  <button 
                    onClick={() => setSelectedCertificate(null)}
                    className="w-8 h-8 rounded-full bg-[var(--bg-sub)] hover:bg-[var(--border)] text-[var(--text-light)] hover:text-[var(--text-main)] flex items-center justify-center transition-all cursor-pointer"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </div>

              {/* Printable Certificate Frame */}
              <div 
                id="printable-certificate"
                className="w-full aspect-[1.414/1] bg-stone-900 border-[16px] border-double border-[#c5a880] p-10 flex flex-col justify-between items-center text-center text-stone-200 relative overflow-hidden select-text"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {/* Vintage corner decorations */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#c5a880]/40"></div>
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#c5a880]/40"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#c5a880]/40"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#c5a880]/40"></div>
                
                {/* Background emblem watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                  <span className="text-[250px]">🏆</span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a880]">CareerForge Verification</div>
                  <h1 className="text-3xl font-bold tracking-wide text-white" style={{ fontFamily: 'Georgia, serif' }}>CERTIFICATE OF COMPLETION</h1>
                </div>

                <div className="space-y-4">
                  <p className="text-xs italic text-stone-400">This specialized credential certifies that</p>
                  <h2 className="text-4xl font-extrabold text-[#c5a880] tracking-wide my-2 uppercase">{user.fullName}</h2>
                  <p className="text-xs text-stone-300 max-w-lg mx-auto leading-relaxed">
                    has successfully completed the full, rigorous curriculum of learning, coding challenges, and assessments for the course
                  </p>
                  <h3 className="text-xl font-bold text-white tracking-wide uppercase my-1">{selectedCertificate.title || 'Data Structures & Algorithms'}</h3>
                </div>

                <div className="w-full flex justify-between items-end border-t border-stone-800 pt-6 px-4">
                  <div className="text-left space-y-1">
                    <div className="text-[8px] font-bold text-stone-500 uppercase tracking-widest">ISSUED ON</div>
                    <div className="text-xs font-semibold text-stone-300">{new Date(selectedCertificate.issuedAt).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 border border-stone-800 rounded bg-white p-1 flex items-center justify-center opacity-85 select-none pointer-events-none">
                      <div className="text-[7px] text-stone-900 font-bold leading-none select-none text-center">
                        CF VERIFY<br />🔒<br />{selectedCertificate.certificateId.substring(selectedCertificate.certificateId.length - 6)}
                      </div>
                    </div>
                    <div className="text-[6px] font-black text-stone-500 uppercase tracking-wider mt-1.5">SCAN TO VERIFY</div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-[8px] font-bold text-stone-500 uppercase tracking-widest">CREDENTIAL ID</div>
                    <div className="text-xs font-semibold text-[#c5a880] tracking-wider select-all">{selectedCertificate.certificateId}</div>
                  </div>
                </div>
              </div>

              {/* Dynamic Print CSS */}
              <style>{`
                @media print {
                  body {
                    background: white !important;
                    color: black !important;
                  }
                  #root {
                    display: none !important;
                  }
                  body > * {
                    display: none !important;
                  }
                  #printable-certificate {
                    display: flex !important;
                    position: fixed !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    z-index: 9999999 !important;
                    background: #1c1917 !important; /* dark stone background for printing */
                    color: #e7e5e4 !important;
                    box-sizing: border-box !important;
                    margin: 0 !important;
                    border: 24px double #c5a880 !important;
                  }
                }
              `}</style>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
