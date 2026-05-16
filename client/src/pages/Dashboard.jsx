import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FiTarget, FiAward, FiClock, FiActivity, FiArrowRight, FiCalendar, FiBook, FiChevronRight, FiZap, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/progress/dashboard');
      setData(res.data.data);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[80vh]"><div className="spinner"></div></div>;
  if (!data || !data.user) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-6">⚠️</div>
      <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Something went wrong</h2>
      <p className="text-gray-500 mb-8">We couldn't load your journey data. Try refreshing the page.</p>
      <button onClick={() => window.location.reload()} className="btn-primary px-8 py-3">Refresh Page</button>
    </div>
  );

  const { user, currentPhaseData, upcomingAssessment, testsPassed, totalBadges, activityLog } = data;

  if (!user.selectedDomain) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6 min-h-[80vh]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center text-5xl mb-10 shadow-xl shadow-primary/5"
        >
          🚀
        </motion.div>
        <h2 className="text-4xl font-black text-[#1a1a1a] mb-6 tracking-tight">Ready to start your adventure?</h2>
        <p className="text-gray-500 max-w-lg mx-auto mb-12 text-xl leading-relaxed font-medium">
          Your developer journey begins with a single choice. Pick a domain and let our AI guide you from rookie to architect.
        </p>
        <Link to="/domains" className="btn-primary text-xl px-12 py-5 shadow-2xl shadow-primary/20">Forge My Path</Link>
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
    <div className="max-w-7xl mx-auto py-10 px-6 lg:px-10">
      {/* Dynamic Welcome Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              Level {user.currentPhase || 0} Architect
            </div>
            <div className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              {user.profile?.roadmapType || 'Steady Pace'}
            </div>
            <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              {user.profile?.estimatedTimeline || '6 Months'}
            </div>
          </div>
          <h1 className="text-5xl font-black text-[#1a1a1a] tracking-tight mb-4">
            Your <span className="text-gradient">Personalized Journey</span>
          </h1>
          <p className="text-gray-500 font-bold text-xl">"Welcome back, {user.fullName.split(' ')[0]}. You're on the {user.profile?.roadmapType} path. ⚡"</p>
        </div>
        <div className="flex items-center gap-6 bg-white border-2 border-gray-100 p-6 rounded-3xl shadow-xl shadow-gray-200/50">
          <div className="text-center border-r border-gray-100 pr-6">
            <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">XP Earned</div>
            <div className="text-2xl font-black text-[#1a1a1a]">{user.xp || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Streak</div>
            <div className="text-2xl font-black text-amber-500 flex items-center gap-2">
              <FiZap /> {user.dailyStreak || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Active Quest Card */}
        <div className="card lg:col-span-2 p-10 relative overflow-hidden bg-white border-primary/5 shadow-2xl shadow-primary/5 group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl transition-all group-hover:scale-150"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 relative z-10">
            <div className="flex gap-6">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-5xl shadow-inner border border-gray-100">
                {user.selectedDomain.icon}
              </div>
              <div>
                <div className="text-primary font-black text-[10px] uppercase tracking-widest mb-2">Current Mission Map</div>
                <h2 className="text-3xl font-black text-[#1a1a1a] tracking-tight mb-2">{user.selectedDomain.name}</h2>
                <div className="flex items-center gap-2 text-gray-400 font-bold">
                  <FiClock className="text-primary" /> {user.overallProgress}% Complete
                </div>
              </div>
            </div>
            <Link to="/roadmap" className="btn-secondary py-4 px-8 rounded-2xl font-black hover:bg-gray-50">
              View Map <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          <div className="mb-12 relative z-10">
            <div className="flex justify-between items-end mb-4">
              <span className="text-xs text-gray-400 font-black uppercase tracking-widest">Mastery Level Progress</span>
              <span className="text-xs font-black text-primary">Level {user.currentPhase || 0} to {user.currentPhase + 1}</span>
            </div>
            <div className="progress-container h-3 shadow-inner">
              <div className="progress-bar-fill" style={{ width: `${user.overallProgress}%` }}></div>
            </div>
          </div>

          {currentPhaseData ? (
            <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-8 group-hover:bg-primary/10 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary text-2xl font-black shadow-sm">
                  {user.currentPhase}
                </div>
                <div>
                  <div className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Active Quest</div>
                  <div className="font-black text-[#1a1a1a] text-2xl">{currentPhaseData.name}</div>
                </div>
              </div>
              <Link to="/roadmap" className="btn-primary py-4 px-10 rounded-2xl shadow-xl shadow-primary/20">
                Continue Quest <FiArrowRight className="ml-2" />
              </Link>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 text-emerald-800 font-black flex items-center gap-4">
              <FiStar className="text-3xl text-emerald-500 animate-pulse" />
              <div>
                <div className="text-2xl">Mission Accomplished!</div>
                <div className="text-sm font-bold opacity-70">You've mastered all architectural phases.</div>
              </div>
            </div>
          )}

          {/* DSA Specific Stats - Placement Readiness */}
          {user.selectedDomain?.slug === 'dsa' && (
            <div className="mt-10 p-8 bg-gradient-to-br from-indigo-50 to-amber-50 rounded-[2.5rem] border-2 border-primary/5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <FiZap className="text-8xl text-primary" />
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                <div>
                   <h3 className="text-2xl font-black text-[#1a1a1a] flex items-center gap-3">
                     <FiAward className="text-amber-500" /> Placement Readiness Rank
                   </h3>
                   <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                     Current Standing: <span className="text-primary font-black">Level {user.currentPhase} {user.currentPhase >= 8 ? 'Beast' : user.currentPhase >= 4 ? 'Warrior' : 'Rookie'}</span>
                   </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-black text-gray-400 uppercase">Global percentile</div>
                    <div className="text-lg font-black text-primary">Top 12%</div>
                  </div>
                  <div className="w-20 h-20 rounded-[2rem] bg-white border-4 border-primary/10 flex flex-col items-center justify-center shadow-xl">
                    <div className="text-2xl font-black text-[#1a1a1a]">{Math.min(Math.round((user.dsaStats?.totalProblemsSolved || 0) / 450 * 100), 100)}%</div>
                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Ready</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-all group">
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Solved</div>
                  <div className="text-3xl font-black text-[#1a1a1a]">{user.dsaStats?.totalProblemsSolved || 0}</div>
                  <div className="text-[8px] font-bold text-gray-400 mt-1 uppercase">A2Z Problems</div>
                </div>
                <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-all group">
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 group-hover:text-emerald-500 transition-colors">Mastered</div>
                  <div className="text-sm font-black text-emerald-600 truncate">{user.dsaStats?.strongestTopic || 'Foundations'}</div>
                  <div className="text-[8px] font-bold text-gray-400 mt-1 uppercase">High Precision</div>
                </div>
                <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-all group">
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 group-hover:text-rose-500 transition-colors">Vulnerable</div>
                  <div className="text-sm font-black text-rose-600 truncate">{user.dsaStats?.weakestTopic || 'Recursion'}</div>
                  <div className="text-[8px] font-bold text-gray-400 mt-1 uppercase">Needs Review</div>
                </div>
                <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-all group">
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 group-hover:text-amber-500 transition-colors">Next Badge</div>
                  <div className="text-sm font-black text-amber-600 truncate">{user.currentPhase >= 4 ? 'Graph Hero' : 'Recursion Surivor'}</div>
                  <div className="text-[8px] font-bold text-gray-400 mt-1 uppercase">Earned at Lvl {user.currentPhase + 1}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <FiStar className="text-amber-500" />
                    <span className="text-xs font-black text-gray-700">STRIKE MISSION PROGRESS</span>
                  </div>
                  <span className="text-xs font-black text-primary">{user.dsaStats?.totalProblemsSolved || 0} / 450 PROBLEMS</span>
                </div>
                <div className="h-4 bg-white/50 rounded-full overflow-hidden p-1 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((user.dsaStats?.totalProblemsSolved || 0) / 450 * 100, 100)}%` }}
                    className="h-full bg-gradient-to-r from-primary to-indigo-400 rounded-full shadow-lg"
                  ></motion.div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Level Stats Area */}
        <div className="flex flex-col gap-6">
          <motion.div whileHover={{ y: -5 }} className="card p-8 flex items-center gap-6 border-emerald-100 bg-white hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl shadow-inner">
              <FiTarget />
            </div>
            <div>
              <div className="text-3xl font-black text-[#1a1a1a]">{data.completedTopicsCount}</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Skills Mastered</div>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="card p-8 flex items-center gap-6 border-amber-100 bg-white hover:shadow-2xl hover:shadow-amber-500/10 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl shadow-inner">
              <FiAward />
            </div>
            <div>
              <div className="text-3xl font-black text-[#1a1a1a]">{testsPassed}</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Badges Earned</div>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="card p-8 flex items-center gap-6 border-indigo-100 bg-white hover:shadow-2xl hover:shadow-indigo-500/10 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl shadow-inner">
              <FiStar />
            </div>
            <div>
              <div className="text-3xl font-black text-[#1a1a1a]">{user.xp || 0}</div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Current XP</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Mentor & Activity */}
        <div className="space-y-10">
          {/* AI Journey Analysis */}
          <div className="card p-10 bg-[#1a1a1a] text-white relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-2xl shadow-lg">🤖</div>
              <h3 className="text-2xl font-black tracking-tight">AI Journey Analysis</h3>
            </div>
            
            <div className="space-y-8 relative z-10">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                <p className="text-gray-300 leading-relaxed font-medium italic text-lg">
                  "{user.profile?.aiSummary || "I'm analyzing your progress to give you personalized insights. Keep learning to unlock my analysis!"}"
                </p>
              </div>

              {user.profile?.recommendedProjects?.length > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8">
                  <div className="text-[10px] text-primary font-black uppercase tracking-widest mb-4">Recommended Projects</div>
                  <ul className="space-y-3">
                    {user.profile.recommendedProjects.map((project, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-200">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> {project}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link to="/ai-mentor" className="flex items-center justify-center gap-3 w-full py-5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black transition-all shadow-xl shadow-primary/20">
                Discuss Strategy with AI <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Deep Work Heatmap */}
          <div className="card p-10 bg-white border-gray-100">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-[#1a1a1a] flex items-center gap-3">
                <FiCalendar className="text-emerald-500" /> Activity Log
              </h3>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Last 14 Days</div>
            </div>
            <div className="flex gap-3 flex-wrap justify-start">
              {recentDays.map(date => {
                const dayLog = activityLog?.find(l => l.date === date);
                const intensity = dayLog ? Math.min(dayLog.minutes / 60, 1) : 0;
                return (
                  <motion.div 
                    key={date} 
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer border-2"
                    style={{ 
                      backgroundColor: intensity > 0 ? `rgba(88, 86, 214, ${0.05 + intensity * 0.4})` : '#ffffff',
                      borderColor: intensity > 0 ? 'rgba(88, 86, 214, 0.2)' : '#f3f0ec'
                    }}
                    title={`${date}: ${dayLog?.minutes || 0} mins`}
                  >
                    {intensity > 0 && <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50"></div>}
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-between mt-6 text-[10px] text-gray-400 uppercase font-black tracking-widest">
              <span>{recentDays[0]}</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Achievements Hall */}
        <div className="card p-10 bg-white flex flex-col border-primary/5 shadow-2xl shadow-primary/5">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-black text-[#1a1a1a]">Quest Trophies</h3>
            <div className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest">{totalBadges} Badges</div>
          </div>
          
          {totalBadges > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 overflow-y-auto max-h-[450px] pr-4 custom-scrollbar">
              {data.user.earnedBadges?.map((b, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6 rounded-3xl bg-gray-50 border-2 border-transparent hover:border-primary/20 hover:bg-white transition-all group shadow-sm"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform filter drop-shadow-md">
                    {b.badgeId?.icon || '🏅'}
                  </div>
                  <div className="text-xs font-black text-[#1a1a1a] uppercase tracking-tight line-clamp-2 leading-tight">{b.badgeId?.name}</div>
                  <div className="text-[8px] font-bold text-gray-400 uppercase mt-2 tracking-[0.2em]">Verified</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 opacity-80">
              <div className="text-8xl mb-8 grayscale">🏆</div>
              <h4 className="text-2xl font-black text-[#1a1a1a] mb-4">No Trophies Yet</h4>
              <p className="text-gray-500 max-w-[280px] text-lg font-medium leading-relaxed">Master the final assessment of each phase to earn official badges.</p>
            </div>
          )}
          
          <div className="mt-12 pt-10 border-t border-gray-100">
             <Link to="/roadmap" className="w-full btn-primary py-5 text-xl rounded-2xl shadow-2xl shadow-primary/20">
                Resume Adventure
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
