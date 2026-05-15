import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FiTarget, FiAward, FiClock, FiActivity, FiArrowRight, FiCalendar, FiBook, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

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

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"></div></div>;
  if (!data) return <div className="text-center py-20 text-[#667085]">Failed to load dashboard data. Please refresh.</div>;

  const { user, currentPhaseData, upcomingAssessment, testsPassed, totalBadges, activityLog } = data;

  if (!user.selectedDomain) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center fade-in px-6">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-4xl mb-8 border border-indigo-100 shadow-sm">🎯</div>
        <h2 className="text-3xl font-bold text-[#101828] mb-4 tracking-tight">Ready to start forging?</h2>
        <p className="text-[#667085] max-w-md mx-auto mb-10 text-lg leading-relaxed">
          You haven't selected a career domain yet. Choose a path to begin your personalized engineering journey.
        </p>
        <Link to="/domains" className="btn-primary text-lg px-8 py-3.5 shadow-lg shadow-indigo-100">Browse Domains</Link>
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
    <div className="fade-in max-w-7xl mx-auto py-8 px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#101828] tracking-tight mb-2">My Learning Dashboard</h1>
          <p className="text-[#667085] font-medium">Welcome back, {user.name}. Here's what's happening with your progress.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-[#eaecf0] px-5 py-3 rounded-2xl shadow-sm">
          <span className="text-2xl">🔥</span>
          <div>
            <div className="text-[10px] text-[#98a2b3] uppercase font-bold tracking-widest">Active Streak</div>
            <div className="font-bold text-[#101828]">{user.dailyStreak} Days</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        {/* Main Domain Progress Card */}
        <div className="card lg:col-span-2 p-8 relative overflow-hidden bg-white border-soft">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
            <div className="flex gap-5">
              <div className="w-16 h-16 bg-[#f9fafb] border border-[#eaecf0] rounded-2xl flex items-center justify-center text-4xl shadow-sm">
                {user.selectedDomain.icon}
              </div>
              <div>
                <div className="badge badge-blue mb-2">Primary Domain</div>
                <h2 className="text-2xl font-bold text-[#101828] tracking-tight mb-1">{user.selectedDomain.name}</h2>
                <p className="text-[#667085] font-medium">{user.selectedDomain.shortDescription}</p>
              </div>
            </div>
            <Link to="/roadmap" className="btn-secondary whitespace-nowrap">
              Manage Roadmap <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          <div className="mb-10">
            <div className="flex justify-between items-end mb-3">
              <div>
                <span className="text-sm text-[#667085] font-bold uppercase tracking-wider">Overall Mastery</span>
                <div className="text-2xl font-bold text-[#101828]">{user.overallProgress}%</div>
              </div>
              <div className="text-sm font-bold text-indigo-600">Completion Target: 100%</div>
            </div>
            <div className="progress-bar h-2.5">
              <div className="progress-fill bg-[#4361ee]" style={{ width: `${user.overallProgress}%` }}></div>
            </div>
          </div>

          {currentPhaseData ? (
            <div className="bg-[#f9fafb] rounded-2xl p-6 border border-[#eaecf0] flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-[#eaecf0] flex items-center justify-center text-indigo-600 font-bold">
                  {user.currentPhase}
                </div>
                <div>
                  <div className="text-[10px] text-[#98a2b3] font-bold uppercase tracking-widest mb-0.5">Active Phase</div>
                  <div className="font-bold text-[#101828] text-lg">{currentPhaseData.name}</div>
                </div>
              </div>
              <Link to="/roadmap" className="btn-primary py-2.5 px-6 text-sm">
                Resume Work <FiArrowRight className="ml-2" />
              </Link>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-emerald-700 font-bold flex items-center gap-3">
              <span>🏆</span> You've completed all phases in this domain. Excellent work!
            </div>
          )}
        </div>

        {/* Vertical Stats Widgets */}
        <div className="flex flex-col gap-5">
          <div className="card p-6 flex items-center gap-5 border-soft bg-white hover:border-indigo-200 transition-colors cursor-default">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
              <FiTarget />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#101828]">{data.completedTopicsCount}</div>
              <div className="text-xs text-[#667085] font-bold uppercase tracking-wider">Topics Mastered</div>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-5 border-soft bg-white hover:border-amber-200 transition-colors cursor-default">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
              <FiAward />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#101828]">{testsPassed}</div>
              <div className="text-xs text-[#667085] font-bold uppercase tracking-wider">Assessments Cleared</div>
            </div>
          </div>
          <div className="card p-6 flex items-center gap-5 border-soft bg-white hover:border-blue-200 transition-colors cursor-default">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
              <FiClock />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#101828]">{Math.floor(user.totalStudyMinutes / 60)}h {user.totalStudyMinutes % 60}m</div>
              <div className="text-xs text-[#667085] font-bold uppercase tracking-wider">Learning Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Guide Call-to-Action */}
      <div className="card mb-10 p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.2rem] overflow-hidden">
        <div className="bg-white rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-4xl border border-indigo-100 shadow-sm shrink-0">
              <FiBook />
            </div>
            <div>
              <div className="badge badge-blue mb-3 py-1.5 px-4 font-bold">New Resource</div>
              <h2 className="text-2xl font-bold text-[#101828] tracking-tight mb-2">Master Your Career Path</h2>
              <p className="text-[#667085] font-medium text-lg leading-relaxed max-w-xl">
                Explore our comprehensive guide on Web Dev, DSA, Competitive Programming, and DevOps to build a "T-Shaped" engineering profile.
              </p>
            </div>
          </div>
          <Link to="/career-guide" className="btn-primary py-4 px-10 text-lg shadow-xl shadow-indigo-100 whitespace-nowrap">
            Read the Guide <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Activity & Suggestions */}
        <div className="flex flex-col gap-8">
          {/* AI Mentorship Widget */}
          <div className="card p-7 border-soft bg-white">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-[#101828] flex items-center gap-2.5">
                <FiActivity className="text-indigo-600" /> Mentorship Notes
              </h3>
              <Link to="/ai-mentor" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Open Mentor</Link>
            </div>
            
            <div className="space-y-5">
              <div className="bg-[#fcfcfd] border border-[#eaecf0] rounded-2xl p-6">
                <p className="text-[#475467] leading-relaxed italic">
                  "You're currently focusing on <span className="text-[#101828] font-bold">Phase {user.currentPhase}</span>. I suggest completing the next module today to maintain your momentum and keep that {user.dailyStreak}-day streak alive."
                </p>
              </div>
              {upcomingAssessment && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex justify-between items-center gap-6">
                  <div>
                    <h4 className="font-bold text-amber-800 mb-1">Target Assessment</h4>
                    <p className="text-sm text-amber-700/80 font-medium">{upcomingAssessment.title}</p>
                  </div>
                  <Link to="/assessments" className="btn-secondary bg-white text-amber-700 border-amber-200 py-2 px-5 text-xs font-bold uppercase tracking-widest">Prepare</Link>
                </div>
              )}
            </div>
          </div>

          {/* Productivity Heatmap */}
          <div className="card p-7 border-soft bg-white">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-[#101828] flex items-center gap-2.5">
                <FiCalendar className="text-emerald-600" /> Deep Work Log
              </h3>
              <span className="text-[10px] text-[#98a2b3] uppercase font-bold tracking-widest">Last 14 Days</span>
            </div>
            <div className="flex gap-2.5 flex-wrap justify-start">
              {recentDays.map(date => {
                const dayLog = activityLog?.find(l => l.date === date);
                const intensity = dayLog ? Math.min(dayLog.minutes / 60, 1) : 0;
                return (
                  <div 
                    key={date} 
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-default"
                    style={{ 
                      backgroundColor: intensity > 0 ? `rgba(67, 97, 238, ${0.1 + intensity * 0.4})` : '#f9fafb',
                      border: intensity > 0 ? '1px solid rgba(67, 97, 238, 0.2)' : '1px solid #f2f4f7'
                    }}
                    title={`${date}: ${dayLog?.minutes || 0} mins`}
                  >
                    {intensity > 0 && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-5 text-[10px] text-[#98a2b3] uppercase font-bold tracking-widest">
              <span>{recentDays[0]}</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="card p-7 border-soft bg-white flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-[#101828]">Verified Credentials</h3>
            <span className="badge badge-blue px-5 py-2 text-sm">{totalBadges} Earned</span>
          </div>
          
          {totalBadges > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 overflow-y-auto max-h-[360px] pr-3 custom-scrollbar">
              {data.user.earnedBadges?.map((b, i) => (
                <div key={i} className="text-center p-5 rounded-2xl bg-[#fcfcfd] border border-[#f2f4f7] hover:border-indigo-100 hover:bg-white transition-all group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform filter drop-shadow-sm">{b.badgeId?.icon || '🏅'}</div>
                  <div className="text-[10px] font-bold text-[#667085] uppercase tracking-tight line-clamp-2 leading-tight">{b.badgeId?.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 opacity-80">
              <div className="text-7xl mb-6">🏆</div>
              <h4 className="text-xl font-bold text-[#101828] mb-3">No Credentials Yet</h4>
              <p className="text-[#667085] max-w-[240px] text-lg">Clear assessments at the end of each phase to earn official platform badges.</p>
            </div>
          )}
          
          <div className="mt-auto pt-10">
             <Link to="/roadmap" className="w-full btn-primary py-3.5 text-lg shadow-sm">
                Continue Learning Journey
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
