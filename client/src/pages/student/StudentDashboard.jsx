import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  FiClock, FiBook, FiCalendar, FiBell, FiFolder, FiCheckSquare, 
  FiArrowRight, FiUser, FiActivity, FiBriefcase, FiExternalLink 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [launchingId, setLaunchingId] = useState(null);
  const [creditStats, setCreditStats] = useState({ totalCredits: 0, approvedCount: 0 });
  const [activityData, setActivityData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [res, creditRes, activityRes] = await Promise.all([
        api.get('/institute/dashboard/student'),
        api.get('/cloud-credits/my-claims').catch(err => {
          console.warn('Failed to load credit stats in dashboard:', err);
          return { data: { stats: { totalCredits: 0, approvedCount: 0 } } };
        }),
        api.get('/activity/summary').catch(err => {
          console.warn('Failed to load activity summary:', err);
          return { data: { success: true, data: null } };
        })
      ]);
      setData(res.data.data);
      setCreditStats(creditRes.data.stats || { totalCredits: 0, approvedCount: 0 });
      setActivityData(activityRes.data?.data);
    } catch (err) {
      console.error('Error loading student dashboard:', err);
      setError(err.response?.data?.message || 'Failed to retrieve dashboard details.');
      toast.error('Dashboard load failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async (assessmentId) => {
    if (launchingId) return;
    try {
      setLaunchingId(assessmentId);
      const res = await api.get(`/assessments/${assessmentId}/launch`);
      if (res.data?.success && res.data?.data?.assessmentLink) {
        window.open(res.data.data.assessmentLink, '_blank', 'noopener,noreferrer');
      } else {
        toast.error('Failed to get launch link.');
      }
    } catch (err) {
      console.error('Launch error:', err);
      const errMsg = err.response?.data?.message || 'Failed to launch assessment. Please try again.';
      toast.error(errMsg);
    } finally {
      setLaunchingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-32 bg-[var(--bg-sub)]/30 rounded-3xl" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-40 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-40 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-40 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-64 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-64 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6 max-w-lg mx-auto">
        <div className="text-5xl mb-6">⚠️</div>
        <h2 className="text-2xl font-black text-[var(--text-main)] mb-2">Failed to Load Dashboard</h2>
        <p className="text-[var(--text-muted)] mb-8">{error || 'Please make sure your profile is registered by an administrator.'}</p>
        <button onClick={fetchDashboardData} className="btn-primary px-8 py-3">Retry Load</button>
      </div>
    );
  }

  const { student, attPercentage, fees, upcomingClasses, pendingAssignments, recentNotes, notices, upcomingAssessments } = data;
  const greeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-emerald-800 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center text-9xl pointer-events-none pr-8">
          🎓
        </div>
        <div className="relative z-10 space-y-2">
          <span className="text-xs uppercase font-black tracking-widest bg-white/20 px-3 py-1 rounded-full">{new Date().toDateString()}</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1">{greeting()}, {student.fullName}!</h1>
          <p className="text-sm md:text-base text-emerald-100 font-semibold max-w-xl">
            "Your learning curve is your greatest asset. Build things, break them, and rise as a developer."
          </p>
        </div>
      </div>

      {/* My Activity Section */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl shadow-sm space-y-4 transition-all duration-300 hover:shadow-md">
        <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-white/5">
          <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
            <FiActivity className="text-[var(--primary)] animate-pulse" /> My Activity Metrics
          </h3>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-950/60 px-3 py-1 rounded-full border border-slate-100 dark:border-white/5">
            Real-time Tracker
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100/60 dark:border-white/5 text-center transition-all hover:scale-[1.02]">
            <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Time Spent</span>
            <div className="text-xl font-black text-slate-800 dark:text-white mt-1">
              {activityData?.totalHours || 0} <span className="text-xs font-bold text-slate-500">hrs</span>
            </div>
          </div>
          <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100/60 dark:border-white/5 text-center transition-all hover:scale-[1.02]">
            <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Total Logins</span>
            <div className="text-xl font-black text-slate-800 dark:text-white mt-1">
              {activityData?.totalLogins || 0}
            </div>
          </div>
          <div className="bg-emerald-50/20 dark:bg-emerald-950/10 p-4 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/10 text-center transition-all hover:scale-[1.02]">
            <span className="text-[9px] uppercase font-black text-emerald-600 dark:text-emerald-500 tracking-wider block mb-1">Learning Streak</span>
            <div className="text-xl font-black text-emerald-650 dark:text-emerald-450 mt-1 flex items-center justify-center gap-1">
              🔥 {activityData?.learningStreak || 0} <span className="text-[10px] font-bold">days</span>
            </div>
          </div>
          <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100/60 dark:border-white/5 text-center transition-all hover:scale-[1.02]">
            <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Videos Watched</span>
            <div className="text-xl font-black text-slate-800 dark:text-white mt-1">
              {activityData?.videosWatched || 0}
            </div>
          </div>
          <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100/60 dark:border-white/5 text-center transition-all hover:scale-[1.02]">
            <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Assessments</span>
            <div className="text-xl font-black text-slate-800 dark:text-white mt-1">
              {activityData?.assessmentsAttempted || 0}
            </div>
          </div>
          <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100/60 dark:border-white/5 text-center transition-all hover:scale-[1.02]">
            <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Spent This Week</span>
            <div className="text-xl font-black text-slate-800 dark:text-white mt-1">
              {activityData?.timeSpentThisWeek || 0} <span className="text-xs font-bold text-slate-500">mins</span>
            </div>
          </div>
          <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100/60 dark:border-white/5 text-center transition-all hover:scale-[1.02]">
            <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Spent This Month</span>
            <div className="text-xl font-black text-slate-800 dark:text-white mt-1">
              {activityData?.timeSpentThisMonth || 0} <span className="text-xs font-bold text-slate-500">mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid containing Profile Summary, Attendance Ring, Billing, and Cloud Credits */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Profile Card */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-2xl font-black border border-[var(--border)]">
                {student.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-black text-[var(--text-main)] truncate">{student.fullName}</h3>
                <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-wide">ID: {student.rollNumber}</p>
              </div>
            </div>
            <div className="space-y-2.5 text-xs text-[var(--text-muted)] font-bold pt-2 border-t border-[var(--border-light)]">
              <div className="flex justify-between"><span className="text-[var(--text-light)]">Enrolled Course:</span> <span className="text-[var(--text-main)]">{student.course?.courseName || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-light)]">Allocated Batch:</span> <span className="text-[var(--text-main)]">{student.batch?.batchName || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-light)]">Active Path:</span> <span className="text-[var(--primary)]">{student.activeDomain?.name || 'Not Started'}</span></div>
            </div>
          </div>
          <Link to="/student/profile" className="mt-6 flex items-center justify-center gap-2 py-2 bg-[var(--bg-sub)] hover:bg-[var(--border)] text-[var(--text-main)] rounded-xl text-xs font-black transition-colors border border-[var(--border)]">
            <FiUser size={14} /> View Profile
          </Link>
        </div>

        {/* Attendance Card */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-full text-left flex items-center gap-2 text-xs font-black uppercase text-[var(--text-light)] tracking-widest">
            <FiClock /> Attendance Rate
          </div>
          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" r="46" stroke="var(--border-light)" strokeWidth="8" fill="transparent" className="dark:stroke-zinc-800" />
              <circle cx="56" cy="56" r="46" stroke="var(--primary)" strokeWidth="8" fill="transparent" 
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * Math.min(attPercentage, 100)) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-2xl font-black text-[var(--text-main)]">
              {attPercentage}%
            </div>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] font-semibold px-2 mb-2 leading-relaxed">
            Aim for above 85% to retain placement assistance.
          </p>
          <Link to="/student/attendance" className="w-full btn-secondary py-2 text-xs font-black uppercase">
            Logs
          </Link>
        </div>

        {/* Course Billing Ledger Card */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[var(--text-light)] tracking-widest mb-4">
              <FiBriefcase /> Fee Ledger
            </div>
            {fees ? (
              <div className="space-y-3 pt-2">
                <div className="bg-[var(--bg-sub)]/40 border border-[var(--border)] p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-light)]">Remaining Dues</span>
                  <div className="text-xl font-black text-rose-500 mt-1">₹{fees.remainingAmount}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold pt-2 text-[var(--text-muted)]">
                  <div>
                    <span className="text-[9px] uppercase tracking-wide text-[var(--text-light)]">Total</span>
                    <p className="text-[var(--text-main)] mt-0.5">₹{fees.totalFees}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wide text-[var(--text-light)]">Paid</span>
                    <p className="text-[var(--success)] mt-0.5">₹{fees.paidAmount || 0}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-xs text-[var(--text-muted)] font-bold">No ledger entries.</p>
              </div>
            )}
          </div>
          <Link to="/student/courses" className="mt-6 flex items-center justify-center gap-2 py-2 bg-[var(--bg-sub)] hover:bg-[var(--border)] text-[var(--text-main)] rounded-xl text-xs font-black transition-colors border border-[var(--border)]">
            Ledger Details
          </Link>
        </div>

        {/* Cloud Credits Card */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[var(--text-light)] tracking-widest mb-4">
              <FiBriefcase /> Cloud Credits
            </div>
            <div className="space-y-3 pt-2">
              <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl dark:bg-indigo-950/20 dark:border-indigo-900/40">
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-500">Approved Credits</span>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">${creditStats.totalCredits || 0}</div>
              </div>
              <div className="text-xs text-[var(--text-muted)] font-bold">
                Approved Perks: <span className="text-[var(--text-main)] font-black">{creditStats.approvedCount || 0} claimed</span>
              </div>
            </div>
          </div>
          <Link to="/resources" className="mt-6 flex items-center justify-center gap-2 py-2 bg-[var(--bg-sub)] hover:bg-[var(--border)] text-[var(--text-main)] rounded-xl text-xs font-black transition-colors border border-[var(--border)]">
            Explore Perks <FiArrowRight size={14} />
          </Link>
        </div>

      </div>

      {/* Main content split grid */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* Upcoming Live Classes */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border-light)]">
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
              <FiCalendar /> Live Lectures Today
            </h3>
            <Link to="/student/live-classes" className="text-xs font-black text-[var(--primary)] hover:underline flex items-center gap-1">
              Full Schedule <FiArrowRight />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-3xl mb-2">📡</span>
                <p className="text-xs text-[var(--text-muted)] font-bold">No live classes scheduled for today.</p>
              </div>
            ) : (
              upcomingClasses.map(c => (
                <div key={c._id} className="bg-[var(--bg-sub)]/30 border border-[var(--border)] p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:border-[var(--primary)]">
                  <div>
                    <h4 className="font-extrabold text-[var(--text-main)] text-sm">{c.topic}</h4>
                    <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1 uppercase tracking-wide">
                      ⏰ {c.time} | Course: {c.course?.courseName} | Instructor: {c.teacher?.name || 'Faculty'}
                    </p>
                  </div>
                  <a href={c.meetingLink} target="_blank" rel="noreferrer" className="btn-primary py-2 px-4 text-xs font-black uppercase text-center">
                    Join Session
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border-light)]">
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
              <FiBook /> Homework & Assignments
            </h3>
            <Link to="/student/assignments" className="text-xs font-black text-[var(--primary)] hover:underline flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingAssignments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="text-3xl mb-2">🎉</span>
                <p className="text-xs text-[var(--text-muted)] font-bold">All caught up! No pending assignments.</p>
              </div>
            ) : (
              pendingAssignments.slice(0, 3).map(a => (
                <div key={a._id} className="bg-[var(--bg-sub)]/30 border border-[var(--border)] p-4 rounded-xl flex justify-between items-center gap-4 transition-all hover:border-[var(--primary)]">
                  <div>
                    <h4 className="font-extrabold text-[var(--text-main)] text-sm">{a.title}</h4>
                    <p className="text-[10px] text-rose-500 font-bold mt-1 uppercase tracking-wide">
                      🚨 Due: {new Date(a.dueDate).toLocaleDateString()} | Course: {a.course?.courseName || 'General'}
                    </p>
                  </div>
                  <Link to="/student/assignments" className="btn-secondary py-2 px-3 text-[10px] font-black uppercase whitespace-nowrap">
                    Submit Task
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Bottom widgets row */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Recent Notes & Materials */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4 md:col-span-1">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border-light)]">
            <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-widest flex items-center gap-2">
              <FiFolder /> Recent Notes
            </h3>
            <Link to="/student/notes" className="text-[10px] font-black text-[var(--primary)] hover:underline">
              Browse
            </Link>
          </div>
          <div className="space-y-2">
            {recentNotes.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] font-bold py-6 text-center">No recent materials found.</p>
            ) : (
              recentNotes.map(n => (
                <a key={n._id} href={n.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2.5 bg-[var(--bg-sub)]/20 hover:bg-[var(--bg-sub)]/50 border border-[var(--border-light)] rounded-xl transition-all">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm text-indigo-500 shrink-0">
                    📄
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-extrabold text-[var(--text-main)] truncate">{n.title}</h4>
                    <p className="text-[9px] text-[var(--text-muted)] font-bold">{n.materialType}</p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Assessments */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4 md:col-span-1">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border-light)]">
            <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-widest flex items-center gap-2">
              <FiCheckSquare /> Skill Assessments
            </h3>
            <Link to="/student/assessments" className="text-[10px] font-black text-[var(--primary)] hover:underline">
              All Tests
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingAssessments.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] font-bold py-6 text-center">No assessments assigned.</p>
            ) : (
              upcomingAssessments.map(a => (
                <div key={a._id} className="flex justify-between items-center p-2.5 bg-[var(--bg-sub)]/20 border border-[var(--border-light)] rounded-xl">
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-extrabold text-[var(--text-main)] truncate">{a.title}</h4>
                    <p className="text-[9px] text-orange-500 font-bold uppercase tracking-wide">{a.difficultyRating}</p>
                  </div>
                  <button
                    onClick={() => handleLaunch(a._id)}
                    disabled={launchingId !== null}
                    className="p-1.5 bg-white border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-lg transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {launchingId === a._id ? (
                      <span className="animate-spin rounded-full h-3 w-3 border-2 border-[var(--primary)] border-t-transparent"></span>
                    ) : (
                      <FiExternalLink size={12} />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4 md:col-span-1">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border-light)]">
            <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-widest flex items-center gap-2">
              <FiBell /> Noticeboard
            </h3>
            <Link to="/student/notifications" className="text-[10px] font-black text-[var(--primary)] hover:underline">
              Read all
            </Link>
          </div>
          <div className="space-y-3">
            {notices.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] font-bold py-6 text-center">No recent announcements.</p>
            ) : (
              notices.map(n => (
                <div key={n._id} className="text-xs border-b border-[var(--border-light)] pb-2 last:border-b-0 last:pb-0">
                  <h4 className="font-extrabold text-[var(--text-main)] truncate">{n.title}</h4>
                  <p className="text-[10px] text-[var(--text-muted)] line-clamp-1 mt-0.5 leading-relaxed">{n.content}</p>
                  <span className="text-[8px] text-[var(--text-light)] font-bold uppercase tracking-wide block mt-1">
                    Posted: {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
