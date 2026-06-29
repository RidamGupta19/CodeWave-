import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FiAward, FiTrendingUp, FiZap, FiTarget, FiFilter, FiUser, 
  FiClock, FiBook, FiTv, FiCalendar, FiChevronRight, FiCheckCircle 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Leaderboard() {
  const [profile, setProfile] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boardType, setBoardType] = useState('global'); // 'global', 'course', 'batch'
  const [timeframe, setTimeframe] = useState('all-time'); // 'all-time', 'weekly', 'monthly'
  const [userCourses, setUserCourses] = useState({ courseId: null, batchId: null });

  useEffect(() => {
    fetchProfileAndLeaderboard();
  }, [boardType, timeframe]);

  const fetchProfileAndLeaderboard = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch personal standing
      const profileRes = await api.get('/leaderboard/me');
      if (profileRes.data.success) {
        setProfile(profileRes.data.data);
        const { courseId, batchId } = profileRes.data.data.entry;
        setUserCourses({ courseId, batchId });
      }

      // 2. Fetch selected leaderboard list
      let listUrl = '/leaderboard/global';
      if (timeframe === 'weekly') {
        listUrl = '/leaderboard/weekly';
      } else if (timeframe === 'monthly') {
        listUrl = '/leaderboard/monthly';
      } else if (boardType === 'course') {
        const cId = profileRes.data.data.entry.courseId;
        if (cId) listUrl = `/leaderboard/course/${cId}`;
      } else if (boardType === 'batch') {
        const bId = profileRes.data.data.entry.batchId;
        if (bId) listUrl = `/leaderboard/batch/${bId}`;
      }

      const listRes = await api.get(listUrl);
      if (listRes.data.success) {
        setStandings(listRes.data.data);
      }

    } catch (err) {
      console.error(err);
      toast.error('Failed to load leaderboard standings');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-44 bg-[var(--bg-sub)]/35 rounded-3xl col-span-2" />
          <div className="h-44 bg-[var(--bg-sub)]/35 rounded-3xl" />
        </div>
        <div className="h-96 bg-[var(--bg-sub)]/35 rounded-3xl" />
      </div>
    );
  }

  const { entry, levelInfo, rankProgress, badges } = profile || {};

  // Separate top 3 podium standers from the rest of the list
  const top3 = standings.slice(0, 3);
  const restList = standings.slice(3, 10);

  // Check if current user is in the top 10
  const isUserInTop10 = standings.some(s => s.userId?._id === entry?.userId || s.userId === entry?.userId);
  const userRankEntry = standings.find(s => s.userId?._id === entry?.userId || s.userId === entry?.userId);

  // Define static list of default badges for visual locked state representation
  const defaultBadgesList = [
    { name: 'First Login', icon: '🚀', unlock: 'Log in for the first time', color: 'from-indigo-500 to-blue-500' },
    { name: '7 Day Streak', icon: '🔥', unlock: 'Maintain a 7-day study streak', color: 'from-emerald-500 to-teal-500' },
    { name: '30 Day Streak', icon: '👑', unlock: 'Maintain a 30-day study streak', color: 'from-amber-500 to-yellow-500' },
    { name: '100 Hours Studied', icon: '⏳', unlock: 'Study for 100 hours on CodeWave', color: 'from-violet-500 to-purple-500' },
    { name: 'Top Performer', icon: '🥇', unlock: 'Reach Rank #1 on any leaderboard', color: 'from-rose-500 to-red-500' },
    { name: 'Coding Champion', icon: '🏆', unlock: 'Solve 10 coding challenges', color: 'from-pink-500 to-fuchsia-500' },
    { name: 'Assessment Master', icon: '🎓', unlock: 'Pass 5 knowledge assessments', color: 'from-cyan-500 to-sky-500' },
    { name: 'Perfect Attendance', icon: '📅', unlock: 'Attend 10 virtual classes', color: 'from-blue-500 to-indigo-500' },
    { name: 'Video Completion Master', icon: '🎬', unlock: 'Complete 10 video lectures', color: 'from-teal-500 to-emerald-500' },
    { name: 'Roadmap Finisher', icon: '🏁', unlock: 'Complete overall roadmap progress', color: 'from-orange-500 to-amber-500' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* 1. Level & Streak Profile Section */}
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Level Progress Card */}
          <div className="lg:col-span-2 card p-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/20 text-white rounded-3xl shadow-xl space-y-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">Gamification Standing</span>
                <h2 className="text-xl font-black mt-2.5 flex items-center gap-2">
                  Welcome back, {entry.name}! <span className="text-md">👋</span>
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Total Points</span>
                <span className="text-3xl font-black text-indigo-400 flex items-center justify-end gap-1.5"><FiZap size={22} className="text-amber-400 fill-amber-400 animate-pulse" /> {entry.points}</span>
              </div>
            </div>

            {/* Progress to Level Standings */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black">
                <span className="text-indigo-305 flex items-center gap-1.5"><FiTarget /> Level {levelInfo.currentLevel}</span>
                {levelInfo.nextLevelTarget ? (
                  <span className="text-slate-400">Level {levelInfo.currentLevel + 1} Target: {levelInfo.nextLevelTarget} pts</span>
                ) : (
                  <span className="text-amber-400">🏆 Maximum Level Reached</span>
                )}
              </div>
              <div className="w-full bg-indigo-950/60 rounded-full h-3 border border-white/5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-indigo-350 h-full rounded-full transition-all duration-700" 
                  style={{ width: `${levelInfo.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>{levelInfo.pointsEarnedInLevel} points in current tier</span>
                {levelInfo.nextLevelTarget && (
                  <span>{levelInfo.pointsNeededForNextLevel} points needed to Level Up</span>
                )}
              </div>
            </div>

            {/* Rank Progress Alerts */}
            {rankProgress.currentRank > 1 && rankProgress.nextRankUser ? (
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center justify-between text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="text-emerald-450 text-md" />
                  <span>You are <strong>{rankProgress.pointsNeededForNextRank} pts</strong> away from overtaking <strong>{rankProgress.nextRankUser}</strong> (Rank #{rankProgress.currentRank - 1})!</span>
                </div>
              </div>
            ) : (
              rankProgress.currentRank === 1 && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <span>👑 You hold the global Crown! Keep learning to protect your status as Rank #1!</span>
                </div>
              )
            )}
          </div>

          {/* Quick Metrics & Streak Card */}
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-white/5">
              <h3 className="text-sm font-black text-slate-800 dark:text-white">Personal Standings</h3>
              {entry.loginStreak > 0 && (
                <span className="bg-emerald-50 text-emerald-650 dark:bg-emerald-950/30 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/25">
                  🔥 {entry.loginStreak} Day Streak
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-white/5 rounded-2xl">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Global Rank</span>
                <span className="text-2xl font-black text-indigo-650 dark:text-indigo-400">#{entry.rank || '-'}</span>
              </div>
              <div className="text-center p-3.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-white/5 rounded-2xl">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Badges Unlocked</span>
                <span className="text-2xl font-black text-slate-800 dark:text-white">{badges.length} 🏅</span>
              </div>
              <div className="text-center p-3.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-white/5 rounded-2xl">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Study Hours</span>
                <span className="text-md font-black text-slate-850 dark:text-white">{Math.round(entry.totalStudyTime / 3600)} hrs</span>
              </div>
              <div className="text-center p-3.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-white/5 rounded-2xl">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Passed Quizzes</span>
                <span className="text-md font-black text-slate-850 dark:text-white">{entry.assessmentsPassed}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. Leaderboard Navigation and filters */}
      <div className="card bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-3xl shadow-sm p-6 space-y-8">
        
        {/* Navigation Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-50 dark:border-white/5">
          <div>
            <h3 className="text-md font-black text-slate-800 dark:text-white">Active Leaderboards</h3>
            <p className="text-xs text-slate-450 mt-0.5">Filter by cohort specializations or time-bound points transactions.</p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            {/* Standing type */}
            <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl flex gap-1 border border-slate-150 dark:border-white/5">
              <button
                onClick={() => { setBoardType('global'); setTimeframe('all-time'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${boardType === 'global' && timeframe === 'all-time' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white'}`}
              >
                🌍 Global
              </button>
              <button
                disabled={!userCourses.courseId}
                onClick={() => { setBoardType('course'); setTimeframe('all-time'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all disabled:opacity-50 ${boardType === 'course' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white'}`}
              >
                📚 Course
              </button>
              <button
                disabled={!userCourses.batchId}
                onClick={() => { setBoardType('batch'); setTimeframe('all-time'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all disabled:opacity-50 ${boardType === 'batch' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white'}`}
              >
                👥 Batch
              </button>
            </div>

            {/* Time filters */}
            <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl flex gap-1 border border-slate-150 dark:border-white/5">
              <button
                onClick={() => { setTimeframe('all-time'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${timeframe === 'all-time' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white'}`}
              >
                All-Time
              </button>
              <button
                onClick={() => { setTimeframe('weekly'); setBoardType('global'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${timeframe === 'weekly' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => { setTimeframe('monthly'); setBoardType('global'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${timeframe === 'monthly' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white'}`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* 3D Visual Podium for Top 3 */}
        {top3.length > 0 && (
          <div className="flex flex-col md:flex-row items-end justify-center gap-6 pt-10 pb-6 border-b border-slate-100/50 dark:border-white/5 max-w-2xl mx-auto">
            
            {/* Rank 2 - Silver Podium */}
            {top3[1] && (
              <div className="flex flex-col items-center flex-1 order-2 md:order-1 mt-6">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-300 dark:border-slate-600 overflow-hidden bg-slate-50 flex items-center justify-center font-black text-slate-400 shadow-md">
                    {top3[1].profileImage ? (
                      <img src={top3[1].profileImage} alt={top3[1].name} className="w-full h-full object-cover" />
                    ) : (
                      top3[1].name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-405 text-white font-extrabold text-[10px] w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center shadow">2</span>
                </div>
                <div className="text-center mt-3.5 space-y-0.5">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-white truncate max-w-[120px]">{top3[1].name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold">{top3[1].points} pts</span>
                </div>
                <div className="w-28 bg-slate-200/60 dark:bg-slate-800 h-16 rounded-t-xl mt-3 flex items-center justify-center border-t border-slate-300 dark:border-white/5">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Silver</span>
                </div>
              </div>
            )}

            {/* Rank 1 - Gold Podium */}
            {top3[0] && (
              <div className="flex flex-col items-center flex-1 order-1 md:order-2">
                <div className="relative group">
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-2xl animate-bounce">👑</span>
                  <div className="w-20 h-20 rounded-full border-4 border-amber-400 overflow-hidden bg-slate-50 flex items-center justify-center font-black text-amber-500 shadow-lg">
                    {top3[0].profileImage ? (
                      <img src={top3[0].profileImage} alt={top3[0].name} className="w-full h-full object-cover" />
                    ) : (
                      top3[0].name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-white font-extrabold text-[10px] w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center shadow">1</span>
                </div>
                <div className="text-center mt-3.5 space-y-0.5">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[140px]">{top3[0].name}</h4>
                  <span className="text-xs text-amber-500 font-extrabold">{top3[0].points} pts</span>
                </div>
                <div className="w-32 bg-amber-100/50 dark:bg-amber-950/20 h-24 rounded-t-xl mt-3 flex items-center justify-center border-t border-amber-300 dark:border-amber-900/30">
                  <span className="text-[11px] font-black text-amber-600 dark:text-amber-550 uppercase tracking-widest">Gold</span>
                </div>
              </div>
            )}

            {/* Rank 3 - Bronze Podium */}
            {top3[2] && (
              <div className="flex flex-col items-center flex-1 order-3 mt-10">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-600/60 dark:border-amber-700/55 overflow-hidden bg-slate-50 flex items-center justify-center font-black text-amber-700 shadow-md">
                    {top3[2].profileImage ? (
                      <img src={top3[2].profileImage} alt={top3[2].name} className="w-full h-full object-cover" />
                    ) : (
                      top3[2].name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-600/80 text-white font-extrabold text-[10px] w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center shadow">3</span>
                </div>
                <div className="text-center mt-3.5 space-y-0.5">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-white truncate max-w-[120px]">{top3[2].name}</h4>
                  <span className="text-[10px] text-slate-400 font-bold">{top3[2].points} pts</span>
                </div>
                <div className="w-28 bg-amber-800/10 dark:bg-amber-950/10 h-12 rounded-t-xl mt-3 flex items-center justify-center border-t border-amber-700/30 dark:border-white/5">
                  <span className="text-[10px] font-black text-amber-700 dark:text-amber-655 uppercase tracking-widest">Bronze</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Top 10 standers list table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/40 dark:bg-slate-950/20">
                <th className="py-3.5 px-4 text-center w-16">Rank</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4 text-center">Level</th>
                <th className="py-3.5 px-4 text-center">Streak</th>
                <th className="py-3.5 px-4">Study Time</th>
                <th className="py-3.5 px-4 text-center">Solve Rate</th>
                <th className="py-3.5 px-4 text-right">Score Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-55/40 dark:divide-white/5 text-xs font-semibold">
              {standings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-405 font-bold">No data found for this standing parameters.</td>
                </tr>
              ) : (
                <>
                  {/* Top 10 Users */}
                  {standings.slice(0, 10).map((s, idx) => {
                    const currentRank = timeframe === 'all-time' ? (s.rank || s.localRank || idx + 1) : (s.localRank || idx + 1);
                    const isSelf = s.userId?._id === entry?.userId || s.userId === entry?.userId;

                    return (
                      <tr 
                        key={s.userId?._id || s.userId} 
                        className={`hover:bg-slate-50/40 dark:hover:bg-slate-950/10 transition-colors ${isSelf ? 'bg-indigo-50/40 dark:bg-indigo-950/10 font-bold border-l-4 border-l-indigo-650 dark:border-l-indigo-400' : ''}`}
                      >
                        <td className="py-4 px-4 text-center font-black text-slate-700 dark:text-slate-350">
                          {currentRank === 1 ? '🥇' : currentRank === 2 ? '🥈' : currentRank === 3 ? '🥉' : `#${currentRank}`}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 overflow-hidden flex items-center justify-center font-black shrink-0 text-slate-500">
                              {s.profileImage ? (
                                <img src={s.profileImage} alt={s.name} className="w-full h-full object-cover" />
                              ) : (
                                s.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                                {s.name}
                                {isSelf && <span className="text-[9px] bg-indigo-100 text-indigo-705 dark:bg-indigo-900/30 dark:text-indigo-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">You</span>}
                              </div>
                              <div className="text-[10px] text-slate-400 font-semibold">{s.courseId?.courseName || s.batchId?.batchName || 'Student'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-black text-indigo-650 dark:text-indigo-400">
                          {s.level || 1}
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-amber-500">
                          {s.loginStreak > 0 ? `🔥 ${s.loginStreak}` : '-'}
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-bold">
                          {s.totalStudyTime ? `${Math.round(s.totalStudyTime / 3600)} hrs` : '-'}
                        </td>
                        <td className="py-4 px-4 text-center text-slate-500 font-bold">
                          {s.codingProblemsSolved || 0} Solved
                        </td>
                        <td className="py-4 px-4 text-right font-black text-slate-800 dark:text-white">
                          {s.points} <span className="text-[9px] text-slate-400 uppercase">pts</span>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Render User Row at bottom if outside top 10 */}
                  {!isUserInTop10 && userRankEntry && (
                    <tr className="bg-indigo-50/60 dark:bg-indigo-950/20 font-bold border-l-4 border-l-indigo-650 dark:border-l-indigo-400 divide-y divide-slate-100 dark:divide-white/5">
                      <td className="py-4 px-4 text-center font-black text-slate-700 dark:text-slate-350">
                        #{userRankEntry.localRank || entry.rank}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 overflow-hidden flex items-center justify-center font-black shrink-0 text-indigo-500">
                            {userRankEntry.profileImage ? (
                              <img src={userRankEntry.profileImage} alt={userRankEntry.name} className="w-full h-full object-cover" />
                            ) : (
                              userRankEntry.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                              {userRankEntry.name}
                              <span className="text-[9px] bg-indigo-100 text-indigo-705 dark:bg-indigo-900/30 dark:text-indigo-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">You</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold">Standings standee</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-black text-indigo-650 dark:text-indigo-400">
                        {userRankEntry.level || 1}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-amber-500">
                        {userRankEntry.loginStreak > 0 ? `🔥 ${userRankEntry.loginStreak}` : '-'}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-bold">
                        {userRankEntry.totalStudyTime ? `${Math.round(userRankEntry.totalStudyTime / 3600)} hrs` : '-'}
                      </td>
                      <td className="py-4 px-4 text-center text-slate-500 font-bold">
                        {userRankEntry.codingProblemsSolved || 0} Solved
                      </td>
                      <td className="py-4 px-4 text-right font-black text-slate-800 dark:text-white">
                        {userRankEntry.points} <span className="text-[9px] text-slate-400 uppercase">pts</span>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 4. Badges Collection Section */}
      <div className="card bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-3xl shadow-sm p-6 space-y-6">
        <div>
          <h3 className="text-md font-black text-slate-800 dark:text-white">Achievements & Badges</h3>
          <p className="text-xs text-slate-450 mt-0.5">Collect points, maintain streaks, and complete learning milestones to unlock badges.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {defaultBadgesList.map((badgeItem) => {
            // Check if user has unlocked this badge
            const unlockedBadge = badges?.find(b => b.badgeId?.name === badgeItem.name);
            const isUnlocked = !!unlockedBadge;

            return (
              <div 
                key={badgeItem.name} 
                className={`p-5 border rounded-2xl flex flex-col items-center justify-between text-center space-y-3 transition-all relative ${
                  isUnlocked 
                    ? 'bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/20 border-amber-400/50 shadow-md scale-100 hover:scale-[1.02]' 
                    : 'bg-slate-50/30 dark:bg-slate-950/10 border-slate-200 dark:border-white/5 opacity-55'
                }`}
              >
                {isUnlocked && (
                  <span className="absolute right-2 top-2 text-emerald-600 text-xs" title="Unlocked Achievement">
                    <FiCheckCircle fill="currentColor" className="text-white dark:text-slate-900" />
                  </span>
                )}
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                  isUnlocked ? badgeItem.color : 'from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-850'
                } flex items-center justify-center text-3xl shadow-sm`}>
                  {badgeItem.icon}
                </div>

                <div className="space-y-1">
                  <h4 className={`text-xs font-black ${isUnlocked ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                    {badgeItem.name}
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold leading-relaxed">{badgeItem.unlock}</p>
                </div>

                {isUnlocked && unlockedBadge.earnedAt && (
                  <span className="text-[8px] text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-150 dark:border-white/5">
                    Earned {new Date(unlockedBadge.earnedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
