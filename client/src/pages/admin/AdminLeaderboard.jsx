import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FiSettings, FiRefreshCw, FiAlertTriangle, FiTrendingUp, 
  FiSliders, FiBarChart2, FiAward, FiDownload, FiCheck 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminLeaderboard() {
  const [settings, setSettings] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  // Form states for point configurations
  const [pointsConfig, setPointsConfig] = useState({
    dailyLogin: 5,
    completeVideo: 10,
    completeRoadmapModule: 25,
    passAssessment: 30,
    score90PlusBonus: 50,
    submitAssignment: 20,
    solveCodingProblem: 15,
    maintainDailyStreak: 10,
    perfectAttendance: 50
  });

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const fetchGamificationData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch settings
      const settingsRes = await api.get('/admin/leaderboard/settings');
      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data);
        setPointsConfig(settingsRes.data.data.pointsConfig);
      }

      // 2. Fetch analytics
      const analyticsRes = await api.get('/admin/leaderboard/analytics');
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
      }

    } catch (err) {
      console.error(err);
      toast.error('Failed to load gamification configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/admin/leaderboard/settings', { pointsConfig });
      if (res.data.success) {
        toast.success('Gamification points settings updated successfully');
        setSettings(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleRecalculateStandings = async () => {
    try {
      setRecalculating(true);
      const res = await api.post('/admin/leaderboard/recalculate');
      if (res.data.success) {
        toast.success('Leaderboard ranks successfully recalculated!');
        fetchGamificationData(); // Refresh analytics standing
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to recalculate ranks');
    } finally {
      setRecalculating(false);
    }
  };

  const handleResetLeaderboard = async (timeframe) => {
    const confirm = window.confirm(`WARNING: Are you sure you want to reset the ${timeframe} leaderboard standings? This will delete all point transactions recorded in the past ${timeframe === 'weekly' ? '7 days' : '30 days'}.`);
    if (!confirm) return;

    const loadingToast = toast.loading(`Resetting ${timeframe} standings...`);
    try {
      const res = await api.post('/admin/leaderboard/reset', { timeframe });
      if (res.data.success) {
        toast.success(`Successfully reset ${timeframe} leaderboard!`, { id: loadingToast });
        fetchGamificationData();
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to reset ${timeframe} leaderboard`, { id: loadingToast });
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/leaderboard/global');
      if (res.data.success) {
        const data = res.data.data;
        if (data.length === 0) {
          toast.error('No standings data available for export');
          return;
        }

        // Generate CSV string
        const headers = ['Rank', 'Name', 'Points', 'Level', 'Login Streak', 'Videos Completed', 'Assessments Passed', 'Assignments Submitted', 'Coding Solved', 'Study Time (Seconds)', 'Last Updated'];
        const rows = data.map(item => [
          item.rank,
          `"${item.name}"`,
          item.points,
          item.level,
          item.loginStreak,
          item.videosCompleted,
          item.assessmentsPassed,
          item.assignmentsSubmitted,
          item.codingProblemsSolved,
          item.totalStudyTime,
          item.lastUpdatedAt
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
          + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `codewave_leaderboard_standings_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Leaderboard report exported successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to export standings report');
    }
  };

  if (loading || !settings) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="h-96 bg-[var(--bg-sub)]/35 rounded-3xl col-span-2" />
          <div className="h-96 bg-[var(--bg-sub)]/35 rounded-3xl" />
        </div>
      </div>
    );
  }

  const { active, highScorers, improved, atRisk } = analytics || {};

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Overview Action Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 p-6 rounded-3xl border border-indigo-500/20 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <h3 className="text-md font-black">Gamification Controls & Management</h3>
          <p className="text-xs text-slate-350 mt-1">Recalculate global ranks, configure point values, reset timeframes, and check student engagement.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5"
          >
            <FiDownload /> Export CSV Standings
          </button>
          <button
            onClick={handleRecalculateStandings}
            disabled={recalculating}
            className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow"
          >
            <FiRefreshCw className={recalculating ? 'animate-spin' : ''} /> Recalculate Standings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. Point Values Form */}
        <div className="lg:col-span-2 card bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-50 dark:border-white/5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 rounded-xl">
              <FiSliders size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white">Configure Point Values</h3>
              <p className="text-[10px] text-slate-450">Tweak point values automatically awarded to students for learning actions.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Daily Login</label>
                <input
                  type="number"
                  value={pointsConfig.dailyLogin}
                  onChange={(e) => setPointsConfig({...pointsConfig, dailyLogin: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-semibold text-slate-850 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Complete Video Lecture</label>
                <input
                  type="number"
                  value={pointsConfig.completeVideo}
                  onChange={(e) => setPointsConfig({...pointsConfig, completeVideo: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-semibold text-slate-850 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Complete Roadmap Module</label>
                <input
                  type="number"
                  value={pointsConfig.completeRoadmapModule}
                  onChange={(e) => setPointsConfig({...pointsConfig, completeRoadmapModule: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-semibold text-slate-850 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Pass Assessment</label>
                <input
                  type="number"
                  value={pointsConfig.passAssessment}
                  onChange={(e) => setPointsConfig({...pointsConfig, passAssessment: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-semibold text-slate-850 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Score 90%+ Bonus</label>
                <input
                  type="number"
                  value={pointsConfig.score90PlusBonus}
                  onChange={(e) => setPointsConfig({...pointsConfig, score90PlusBonus: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-semibold text-slate-850 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Submit Assignment</label>
                <input
                  type="number"
                  value={pointsConfig.submitAssignment}
                  onChange={(e) => setPointsConfig({...pointsConfig, submitAssignment: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-semibold text-slate-850 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Solve Coding Challenge</label>
                <input
                  type="number"
                  value={pointsConfig.solveCodingProblem}
                  onChange={(e) => setPointsConfig({...pointsConfig, solveCodingProblem: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-semibold text-slate-850 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Maintain Daily Streak</label>
                <input
                  type="number"
                  value={pointsConfig.maintainDailyStreak}
                  onChange={(e) => setPointsConfig({...pointsConfig, maintainDailyStreak: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-semibold text-slate-850 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-slate-50 dark:border-white/5">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <FiCheck /> {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Reset time bound standings */}
        <div className="card bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-50 dark:border-white/5">
              <div className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-550 dark:text-rose-400 rounded-xl">
                <FiAlertTriangle size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white">Danger Zone Controls</h3>
                <p className="text-[10px] text-slate-450">Reset standings and transactions for weekly or monthly intervals.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl space-y-3">
                <span className="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider block">Weekly Ranks</span>
                <p className="text-[10px] text-slate-500 leading-relaxed">This deletes points transaction records from the past 7 days, recalculating all standing averages.</p>
                <button
                  onClick={() => handleResetLeaderboard('weekly')}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all"
                >
                  Reset Weekly Standing
                </button>
              </div>

              <div className="p-4 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl space-y-3">
                <span className="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider block">Monthly Ranks</span>
                <p className="text-[10px] text-slate-500 leading-relaxed">This deletes points transaction records from the past 30 days, recalculating all standing averages.</p>
                <button
                  onClick={() => handleResetLeaderboard('monthly')}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all"
                >
                  Reset Monthly Standing
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Analytics Section */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Highest Scorers */}
          <div className="card bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-1.5"><FiAward /> Top Scoring</h4>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {highScorers.length === 0 ? (
                <span className="text-xs text-slate-400 font-semibold block">No scorers logged yet.</span>
              ) : (
                highScorers.map((item, idx) => (
                  <div key={item._id} className="flex justify-between items-center text-xs pb-2 border-b border-slate-50 dark:border-white/5 last:border-b-0 last:pb-0">
                    <span className="font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{idx + 1}. {item.name}</span>
                    <span className="font-black text-indigo-650 dark:text-indigo-400">{item.points} pts</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Most Active */}
          <div className="card bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-1.5"><FiBarChart2 /> Most Study Time</h4>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {active.length === 0 ? (
                <span className="text-xs text-slate-400 font-semibold block">No study time recorded.</span>
              ) : (
                active.map((item, idx) => (
                  <div key={item._id} className="flex justify-between items-center text-xs pb-2 border-b border-slate-50 dark:border-white/5 last:border-b-0 last:pb-0">
                    <span className="font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{idx + 1}. {item.name}</span>
                    <span className="font-black text-slate-600 dark:text-slate-400">{Math.round(item.totalStudyTime / 3600)} hrs</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Most Improved */}
          <div className="card bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-1.5"><FiTrendingUp /> Most Improved (7d)</h4>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {improved.length === 0 ? (
                <span className="text-xs text-slate-400 font-semibold block">No improved stats available.</span>
              ) : (
                improved.map((item, idx) => (
                  <div key={item.user?._id} className="flex justify-between items-center text-xs pb-2 border-b border-slate-50 dark:border-white/5 last:border-b-0 last:pb-0">
                    <span className="font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{idx + 1}. {item.user?.fullName}</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-450">+{item.pointsEarned} pts</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* At Risk of Inactivity */}
          <div className="card bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase text-rose-600 tracking-wider flex items-center gap-1.5"><FiAlertTriangle /> At Risk (No act. 14d)</h4>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {atRisk.length === 0 ? (
                <span className="text-xs text-emerald-605 font-bold block">All students are actively studying!</span>
              ) : (
                atRisk.map((item, idx) => (
                  <div key={item._id} className="text-xs pb-2 border-b border-slate-50 dark:border-white/5 last:border-b-0 last:pb-0">
                    <div className="font-bold text-slate-850 dark:text-white truncate">{idx + 1}. {item.fullName}</div>
                    <div className="text-[9px] text-slate-400 font-bold">{item.email}</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
