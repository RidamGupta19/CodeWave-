import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  FiTarget, FiAward, FiClock, FiActivity, FiArrowRight, FiCalendar, 
  FiBook, FiChevronRight, FiZap, FiStar, FiX, FiUsers, FiDollarSign, FiBell, FiFolder
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeDsaProfile, getDsaBadgeForLevel, getStreakRank } from '../utils/dsaPersonalization';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  
  // Institute dynamic states
  const [instData, setInstData] = useState(null);
  const [instLoading, setInstLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchInstituteDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    if (!user) return;
    try {
      // Fetch career forge progress context only for students/admins
      if (user.role === 'student' || user.role === 'admin') {
        const res = await api.get('/progress/dashboard');
        setData(res.data.data);
        
        const certRes = await api.get('/certificates/my');
        setCertificates(certRes.data.data);
      }
    } catch (err) {
      console.log('Career dashboard load bypassed or empty.', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstituteDashboard = async () => {
    if (!user) return;
    try {
      if (user.role === 'student') {
        const res = await api.get('/institute/dashboard/student');
        setInstData(res.data.data);
      } else if (user.role === 'teacher') {
        const res = await api.get('/institute/dashboard/teacher');
        setInstData(res.data.data);
      } else if (user.role === 'admin') {
        const res = await api.get('/institute/stats/admin');
        setInstData(res.data.data);
      }
    } catch (err) {
      console.log('Institute dashboard load failed:', err.message);
    } finally {
      setInstLoading(false);
    }
  };

  if (loading || instLoading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
    </div>
  );

  // ==========================================
  // VIEW RENDER: ADMIN DASHBOARD
  // ==========================================
  if (user.role === 'admin') {
    const stats = instData || {
      totalStudents: 0,
      totalTeachers: 0,
      totalCourses: 0,
      totalBatches: 0,
      activeCareerLearners: 0,
      financials: { expected: 0, collected: 0, pending: 0 },
      overallAttendanceRate: 100
    };

    const financialData = [
      { name: 'Collected', amount: stats.financials.collected, color: '#308D46' },
      { name: 'Dues Pending', amount: stats.financials.pending, color: '#EF4444' }
    ];

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">CodeWave Solution Control Center</p>
        </div>

        {/* Numeric stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Total Students</span>
            <div className="text-2xl font-black text-[var(--text-main)] mt-2">{stats.totalStudents}</div>
          </div>
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Instructors</span>
            <div className="text-2xl font-black text-[var(--text-main)] mt-2">{stats.totalTeachers}</div>
          </div>
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Batches</span>
            <div className="text-2xl font-black text-[var(--text-main)] mt-2">{stats.totalBatches}</div>
          </div>
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Courses</span>
            <div className="text-2xl font-black text-[var(--text-main)] mt-2">{stats.totalCourses}</div>
          </div>
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm col-span-2 md:col-span-1">
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Active Learners</span>
            <div className="text-2xl font-black text-[var(--primary)] mt-2">{stats.activeCareerLearners}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Fee Collection Chart */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
            <h3 className="text-sm font-black uppercase text-[var(--text-light)] tracking-widest mb-6 flex items-center gap-2">
              <FiDollarSign /> Fee Collection Analysis
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-light)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-light)" fontSize={11} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="amount" fill="var(--primary)" radius={[8, 8, 0, 0]}>
                    {financialData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance and General Metrics */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black uppercase text-[var(--text-light)] tracking-widest mb-6 flex items-center gap-2">
                <FiClock /> Attendance Analytics
              </h3>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-28 h-28 rounded-full border-8 border-[var(--primary-light)] flex items-center justify-center text-3xl font-black text-[var(--primary)] shadow-inner">
                  {stats.overallAttendanceRate}%
                </div>
                <h4 className="font-extrabold text-[var(--text-main)] mt-4">Overall Presence Rate</h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xs font-semibold leading-relaxed">Aggregated attendance rate across all active batches for the past 30 days.</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[var(--border)] flex justify-between gap-4">
              <Link to="/institute/attendance" className="btn-secondary flex-1 py-3 text-xs font-black uppercase">Attendance Logs</Link>
              <Link to="/institute/fees" className="btn-primary flex-1 py-3 text-xs font-black uppercase shadow-md">Billing Ledger</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW RENDER: TEACHER DASHBOARD
  // ==========================================
  if (user.role === 'teacher') {
    const tData = instData || {
      teacher: {},
      batches: [],
      studentCount: 0,
      todayClasses: [],
      assignmentsCount: 0
    };

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-main)] tracking-tight">Instructor Hub</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Welcome back, {user.fullName.split(' ')[0]} 💻</p>
        </div>

        {/* Quick metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-[var(--primary)] flex items-center justify-center text-xl rounded-xl shrink-0">
              <FiUsers />
            </div>
            <div>
              <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Students Instructing</span>
              <div className="text-2xl font-black text-[var(--text-main)] mt-1">{tData.studentCount}</div>
            </div>
          </div>
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-[var(--secondary)] flex items-center justify-center text-xl rounded-xl shrink-0">
              <FiClock />
            </div>
            <div>
              <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Assigned Batches</span>
              <div className="text-2xl font-black text-[var(--text-main)] mt-1">{tData.batches?.length || 0}</div>
            </div>
          </div>
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 flex items-center justify-center text-xl rounded-xl shrink-0">
              <FiAward />
            </div>
            <div>
              <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Homework Guidelines</span>
              <div className="text-2xl font-black text-[var(--text-main)] mt-1">{tData.assignmentsCount} Tasks</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Timetable schedule for today */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black uppercase text-[var(--text-light)] tracking-widest mb-6 flex items-center gap-2">
                <FiCalendar /> Today's Live Sessions
              </h3>
              <div className="space-y-3">
                {tData.todayClasses?.length === 0 ? (
                  <p className="text-center py-12 text-xs font-bold text-[var(--text-light)]">No sessions scheduled for today.</p>
                ) : (
                  tData.todayClasses.map(c => (
                    <div key={c._id} className="bg-[var(--bg-sub)]/35 border border-[var(--border)] p-4 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-extrabold text-[var(--text-main)]">{c.topic}</h4>
                        <div className="flex gap-2 items-center text-[10px] text-[var(--text-muted)] mt-1 font-semibold">
                          <span>Time: {c.time}</span>
                          <span>|</span>
                          <span>Batch: {c.batch?.batchName}</span>
                        </div>
                      </div>
                      <a href={c.meetingLink} target="_blank" rel="noreferrer" className="btn-primary py-2 px-3 text-[10px] font-black uppercase shadow-sm">Launch</a>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="pt-6 border-t border-[var(--border)] mt-6">
              <Link to="/institute/schedule" className="w-full btn-secondary text-xs py-3 rounded-xl flex justify-center font-black uppercase tracking-wider">Configure Scheduler</Link>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm space-y-6">
            <h3 className="text-sm font-black uppercase text-[var(--text-light)] tracking-widest">Instructor Tools</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/institute/attendance" className="p-4 bg-[var(--bg-sub)]/40 hover:bg-[var(--bg-sub)] border border-[var(--border)] hover:border-[var(--primary)] rounded-2xl transition-all text-center">
                <div className="text-2xl mb-2">📅</div>
                <h4 className="text-xs font-black text-[var(--text-main)]">Mark Attendance</h4>
              </Link>
              <Link to="/institute/materials" className="p-4 bg-[var(--bg-sub)]/40 hover:bg-[var(--bg-sub)] border border-[var(--border)] hover:border-[var(--primary)] rounded-2xl transition-all text-center">
                <div className="text-2xl mb-2">📁</div>
                <h4 className="text-xs font-black text-[var(--text-main)]">Upload Notes</h4>
              </Link>
              <Link to="/institute/assignments" className="p-4 bg-[var(--bg-sub)]/40 hover:bg-[var(--bg-sub)] border border-[var(--border)] hover:border-[var(--primary)] rounded-2xl transition-all text-center">
                <div className="text-2xl mb-2">📝</div>
                <h4 className="text-xs font-black text-[var(--text-main)]">Grade Homework</h4>
              </Link>
              <Link to="/code-guru" className="p-4 bg-[var(--bg-sub)]/40 hover:bg-[var(--bg-sub)] border border-[var(--border)] hover:border-[var(--primary)] rounded-2xl transition-all text-center">
                <div className="text-2xl mb-2">🤖</div>
                <h4 className="text-xs font-black text-[var(--text-main)]">CodeWave AI</h4>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW RENDER: STUDENT DASHBOARD
  // ==========================================
  if (!data || !data.user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="text-5xl mb-6">⚠️</div>
        <h2 className="text-2xl font-black text-[var(--text-main)] mb-2">Something went wrong</h2>
        <p className="text-[var(--text-muted)] mb-8">We couldn't load your journey data. Try refreshing the page.</p>
        <button onClick={() => window.location.reload()} className="btn-primary px-8 py-3">Refresh Page</button>
      </div>
    );
  }

  const { user: careerUser, currentPhaseData, upcomingAssessment, testsPassed, totalBadges, activityLog } = data;
  const isDsa = careerUser.selectedDomain?.slug === 'dsa';
  const dsaAnalysis = isDsa ? (careerUser.profile?.onboardingAnswers?.dsaAnalysis || analyzeDsaProfile(careerUser.profile?.onboardingAnswers || {})) : null;
  const streakRank = getStreakRank(careerUser.dailyStreak || 0);
  const dsaBadge = getDsaBadgeForLevel(careerUser.currentPhase || 0);

  if (!careerUser.selectedDomain) {
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
  const sData = instData || { attPercentage: 100, fees: null, upcomingClasses: [], assignments: [], notices: [], materialsCount: 0 };

  return (
    <div className="max-w-7xl mx-auto py-4 transition-colors duration-300">
      
      {/* Dynamic Welcome Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="px-3 py-1 bg-green-100 text-[var(--brand-green)] rounded-full text-[9px] font-black uppercase tracking-wider border border-green-200">
              Level {careerUser.currentPhase || 0} Geek
            </div>
            <div className="px-3 py-1 bg-orange-100 text-[var(--brand-orange)] rounded-full text-[9px] font-black uppercase tracking-wider border border-orange-200">
              {careerUser.profile?.roadmapType || 'Steady Pace'}
            </div>
            <div className="px-3 py-1 bg-purple-100 text-[var(--brand-purple)] rounded-full text-[9px] font-black uppercase tracking-wider border border-purple-200">
              {careerUser.profile?.estimatedTimeline || '6 Months'}
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-main)] mb-2 tracking-tight">
            Your <span className="text-[var(--brand-green)]">Tech Career</span> Journey
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest">Welcome back, {careerUser.fullName.split(' ')[0]}. ⚡</p>
        </div>
        
        {/* User Stats Card */}
        <div className="flex items-center gap-6 bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
          <div className="text-center border-r border-[var(--border)] pr-5">
            <div className="text-[8px] text-[var(--text-light)] uppercase font-black tracking-widest mb-1">XP Earned</div>
            <div className="text-xl font-black text-[var(--text-main)]">
              {careerUser.totalXP || careerUser.xp || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[8px] text-[var(--text-light)] uppercase font-black tracking-widest mb-1">Streak</div>
            <div className="text-xl font-black text-amber-500 flex items-center gap-1">
              <FiZap fill="currentColor" /> {parseInt(localStorage.getItem('dsa_streak') || '0', 10) > 0 
                ? parseInt(localStorage.getItem('dsa_streak') || '0', 10) 
                : (careerUser.dailyStreak || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Institute Roster & Summary Info Card */}
      {sData.student && (
        <div className="mb-8 grid md:grid-cols-4 gap-6">
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] flex items-center gap-4">
            <div className="text-2xl">🎓</div>
            <div>
              <span className="text-[9px] uppercase font-black text-[var(--text-light)]">Enrolled Course</span>
              <p className="text-xs font-black text-[var(--text-main)] mt-0.5">{sData.student.course?.courseName}</p>
            </div>
          </div>
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] flex items-center gap-4">
            <div className="text-2xl">👥</div>
            <div>
              <span className="text-[9px] uppercase font-black text-[var(--text-light)]">Assigned Batch</span>
              <p className="text-xs font-black text-[var(--text-main)] mt-0.5">{sData.student.batch?.batchName}</p>
            </div>
          </div>
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] flex items-center gap-4">
            <div className="text-2xl">📅</div>
            <div>
              <span className="text-[9px] uppercase font-black text-[var(--text-light)]">Attendance Rate</span>
              <p className="text-xs font-black text-[var(--primary)] mt-0.5">{sData.attPercentage}% Present</p>
            </div>
          </div>
          <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] flex items-center gap-4">
            <div className="text-2xl">💵</div>
            <div>
              <span className="text-[9px] uppercase font-black text-[var(--text-light)]">Remaining Dues</span>
              <p className="text-xs font-black text-rose-500 mt-0.5">₹{sData.fees?.remainingAmount || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Zero to Coding Invitation Card */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-100 shadow-[var(--shadow-soft)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-200 rounded-full blur-3xl opacity-50"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 relative z-10 text-center md:text-left">
          <div className="w-12 h-12 bg-[var(--bg-card)] border border-purple-200 rounded-2xl flex items-center justify-center text-2xl shadow-sm animate-pulse shrink-0">
            👾
          </div>
          <div>
            <div className="inline-block px-2 py-0.5 bg-purple-100 text-[var(--brand-purple)] text-[8px] font-black uppercase tracking-wider rounded-lg mb-1 border border-purple-200">
              New to Programming?
            </div>
            <h2 className="text-lg font-black text-[var(--land-text)] tracking-tight">Zero to Coding Arcade</h2>
            <p className="text-xs text-[var(--text-muted)] font-bold mt-0.5">
              Start with our Duolingo-style interactives! Print statements, simple math, variables, and logic games.
            </p>
          </div>
        </div>

        <Link 
          to="/zero-to-coding" 
          className="relative z-10 px-5 py-3 bg-[var(--brand-purple)] hover:bg-purple-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 shrink-0"
        >
          Enter Arcade <FiArrowRight strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Certifications Banner (if earned) */}
      {certificates.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-green-50 via-teal-50 to-emerald-50 p-6 rounded-3xl border border-green-200 shadow-[var(--shadow-soft)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-green-200 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-teal-200 rounded-full blur-3xl opacity-50"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 relative z-10 text-center md:text-left">
            <div className="w-12 h-12 bg-[var(--bg-card)] border border-green-200 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0">
              🏆
            </div>
            <div>
              <div className="inline-block px-2 py-0.5 bg-green-100 text-[var(--brand-green)] text-[8px] font-black uppercase tracking-wider rounded-lg mb-1 border border-green-200">
                Official Certification
              </div>
              <h2 className="text-lg font-black text-[var(--land-text)] tracking-tight">Course Certified!</h2>
              <p className="text-xs text-[var(--text-muted)] font-bold mt-0.5">
                You have successfully completed all lectures and requirements for {certificates[0].domainId?.name || 'DSA'}.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setSelectedCertificate(certificates[0])}
            className="relative z-10 px-5 py-3 bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            View Certificate <FiAward strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Continue Learning System */}
      {(() => {
        const continueLearningDomains = [];
        if (careerUser.domainsProgress) {
          const domainKeys = {
            dsa: { name: 'Data Structures & Algorithms', slug: 'dsa', icon: '🌳', color: '#6366f1' },
            webdev: { name: 'Web Development Explorer', slug: 'web-development', icon: '🌐', color: '#4361ee' },
            devops: { name: 'DevOps Expedition', slug: 'devops', icon: '🐳', color: '#10b981' },
            opensource: { name: 'Open Source Expedition', slug: 'open-source', icon: '🔓', color: '#f59e0b' }
          };

          for (const key of Object.keys(domainKeys)) {
            const prog = careerUser.domainsProgress[key];
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
          <div className="mb-8 card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-[var(--text-main)] tracking-tight">Continue Learning</h2>
              <span className="text-[9px] text-[var(--text-light)] uppercase font-black tracking-widest bg-[var(--bg-sub)] px-3 py-1 rounded-full border border-[var(--border)]">Multi-Domain Ecosystem</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
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
                  className="p-4 bg-[var(--bg-sub)] hover:bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--primary)] rounded-2xl shadow-sm cursor-pointer transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm border border-[var(--border)]"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[var(--text-main)] text-xs group-hover:text-[var(--primary)] transition-colors">{item.name}</h4>
                      <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-0.5">
                        {item.prog.currentCheckpoint 
                          ? `📍 Checkpoint: ${item.prog.currentCheckpoint.replace('_', ' ').replace('cp', 'Lecture ').toUpperCase()}`
                          : 'Started Recently'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <div className="text-xs font-black text-[var(--text-main)]">{item.prog.overallProgress || 0}%</div>
                      <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-wider">{item.prog.xp || 0} XP</div>
                    </div>
                    <FiChevronRight className="text-[var(--text-light)] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Active Quest Card */}
        <div className="card lg:col-span-2 p-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--primary)]/5 rounded-full blur-3xl transition-all group-hover:scale-150"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 relative z-10">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-[var(--bg-sub)] rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-[var(--border)] shrink-0">
                {careerUser.selectedDomain.icon}
              </div>
              <div>
                <div className="text-[var(--primary)] font-black text-[8px] uppercase tracking-widest mb-1">Current Mission Map</div>
                <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight mb-1">
                  {careerUser.selectedDomain.name?.toLowerCase().includes('web development') ? 'Full Stack Web Development' : careerUser.selectedDomain.name}
                </h2>
                <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-bold text-xs">
                  <FiClock className="text-[var(--primary)]" /> {careerUser.overallProgress}% Complete
                </div>
              </div>
            </div>
            <Link to="/roadmap" className="btn-secondary py-2.5 px-4 rounded-xl font-black text-[10px] hover:bg-[var(--bg-sub)] shrink-0 uppercase tracking-wider">
              View Map <FiChevronRight size={12} className="ml-1" />
            </Link>
          </div>
          
          <div className="mb-6 relative z-10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[8px] text-[var(--text-light)] font-black uppercase tracking-widest">Mastery Level Progress</span>
              <span className="text-xs font-black text-[var(--primary)]">Level {careerUser.currentPhase || 0} to {careerUser.currentPhase + 1}</span>
            </div>
            <div className="progress-container h-2 shadow-inner">
              <div className="progress-bar-fill" style={{ width: `${careerUser.overallProgress}%` }}></div>
            </div>
          </div>

          {currentPhaseData ? (
            <div className="bg-[var(--land-bg-alt)] rounded-2xl p-5 border border-[var(--border-light)] flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center justify-center text-[var(--brand-green)] text-lg font-black shadow-[var(--shadow-soft)] shrink-0">
                  {careerUser.currentPhase}
                </div>
                <div>
                  <div className="text-[8px] text-[var(--brand-green)] font-black uppercase tracking-widest mb-0.5">Active Quest</div>
                  <div className="font-black text-[var(--land-text)] text-lg leading-tight">{currentPhaseData.name}</div>
                </div>
              </div>
              <Link to="/roadmap" className="btn-primary py-2.5 px-6 rounded-xl text-[10px] uppercase font-black tracking-wider shrink-0 shadow-[var(--shadow-bubbly)] hover:-translate-y-0.5">
                Continue Quest <FiArrowRight strokeWidth={3} className="ml-1" />
              </Link>
            </div>
          ) : (
            <div className="bg-green-50 rounded-2xl p-5 border border-green-200 text-green-700 font-black flex items-center gap-4 shadow-[var(--shadow-soft)]">
              <FiStar className="text-2xl text-green-500 animate-pulse shrink-0" />
              <div>
                <div className="text-lg">Mission Accomplished!</div>
                <div className="text-xs font-bold opacity-80">You've mastered all architectural phases.</div>
              </div>
            </div>
          )}

          {/* DSA Specific Stats - Placement Readiness */}
          {careerUser.selectedDomain?.slug === 'dsa' && (
            <div className="mt-6 p-5 bg-gradient-to-br from-indigo-500/5 to-amber-500/5 rounded-2xl border border-[var(--border)] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                <FiZap className="text-8xl text-[var(--primary)]" />
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                <div>
                   <h3 className="text-lg font-black text-[var(--text-main)] flex items-center gap-2">
                     <FiAward className="text-amber-500" /> Placement Readiness Rank
                   </h3>
                   <p className="text-[8px] font-black text-[var(--text-light)] mt-0.5 uppercase tracking-widest">
                     Current Standing: <span className="text-[var(--primary)] font-black">Level {careerUser.currentPhase} {careerUser.currentPhase >= 8 ? 'Beast' : careerUser.currentPhase >= 4 ? 'Warrior' : 'Rookie'}</span>
                   </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-[8px] font-black text-[var(--text-light)] uppercase">Global percentile</div>
                    <div className="text-sm font-black text-[var(--primary)]">Top 12%</div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex flex-col items-center justify-center shadow-md">
                    <div className="text-base font-black text-[var(--text-main)]">{Math.min(Math.round((careerUser.dsaStats?.totalProblemsSolved || 0) / 450 * 100), 100)}%</div>
                    <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-tighter">Ready</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm group">
                  <div className="text-[8px] text-[var(--text-light)] font-black uppercase tracking-widest mb-1 group-hover:text-[var(--primary)] transition-colors">Solved</div>
                  <div className="text-xl font-black text-[var(--text-main)]">{careerUser.dsaStats?.totalProblemsSolved || 0}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] mt-0.5 uppercase">A2Z Problems</div>
                </div>
                <div className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm group">
                  <div className="text-[8px] text-[var(--text-light)] font-black uppercase tracking-widest mb-1 group-hover:text-emerald-500 transition-colors">Mastered</div>
                  <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 truncate">{careerUser.dsaStats?.strongestTopic || 'Foundations'}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] mt-0.5 uppercase">High Precision</div>
                </div>
                <div className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm group">
                  <div className="text-[8px] text-[var(--text-light)] font-black uppercase tracking-widest mb-1 group-hover:text-rose-500 transition-colors">Vulnerable</div>
                  <div className="text-[10px] font-black text-rose-500 truncate">{careerUser.dsaStats?.weakestTopic || 'Recursion'}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] mt-0.5 uppercase">Needs Review</div>
                </div>
                <div className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm group">
                  <div className="text-[8px] text-[var(--text-light)] font-black uppercase tracking-widest mb-1 group-hover:text-amber-500 transition-colors">Next Badge</div>
                  <div className="text-[10px] font-black text-amber-500 truncate">{dsaBadge.name}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] mt-0.5 uppercase">Lvl {careerUser.currentPhase + 1}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-[var(--brand-purple)] text-white rounded-xl shadow-[var(--shadow-soft)]">
                  <div className="text-[8px] font-black text-purple-200 uppercase tracking-widest mb-1">AI Recommendation</div>
                  <div className="text-[10px] font-bold leading-relaxed text-purple-50">
                    Practice {dsaAnalysis?.weakTopics?.[0] || careerUser.dsaStats?.weakestTopic || 'Recursion'} next with one accepted submission.
                  </div>
                </div>
                <div className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
                  <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-widest mb-1">Streak League</div>
                  <div className={`text-xs font-black ${streakRank.color}`}>{streakRank.name}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] mt-0.5 uppercase">{streakRank.next}</div>
                </div>
                <div className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border)]">
                  <div className="text-[8px] font-black text-[var(--text-light)] uppercase tracking-widest mb-1">Roadmap Mode</div>
                  <div className="text-xs font-black text-[var(--text-main)]">{dsaAnalysis?.roadmapType || careerUser.profile?.roadmapType}</div>
                  <div className="text-[8px] font-bold text-[var(--text-light)] mt-0.5 uppercase">{dsaAnalysis?.estimatedTimeline || careerUser.profile?.estimatedTimeline}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-end text-xs">
                  <div className="flex items-center gap-1">
                    <FiStar className="text-amber-500" />
                    <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-wider">STRIKE MISSION PROGRESS</span>
                  </div>
                  <span className="font-extrabold text-[var(--primary)]">{careerUser.dsaStats?.totalProblemsSolved || 0} / 450 PROBLEMS</span>
                </div>
                <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((careerUser.dsaStats?.totalProblemsSolved || 0) / 450 * 100, 100)}%` }}
                    className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full shadow-lg"
                  ></motion.div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Level Stats Area */}
        <div className="flex flex-col gap-4">
          <motion.div whileHover={{ y: -4 }} className="card p-5 flex items-center gap-4 border-emerald-500/10 hover:shadow-lg transition-all bg-[var(--bg-card)]">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl shadow-inner shrink-0">
              <FiTarget />
            </div>
            <div>
              <div className="text-xl font-black text-[var(--text-main)]">{data.completedTopicsCount}</div>
              <div className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest">Skills Mastered</div>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ y: -4 }} className="card p-5 flex items-center gap-4 border-amber-500/10 hover:shadow-lg transition-all bg-[var(--bg-card)]">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl shadow-inner shrink-0">
              <FiAward />
            </div>
            <div>
              <div className="text-xl font-black text-[var(--text-main)]">{testsPassed}</div>
              <div className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest">Badges Earned</div>
            </div>
          </motion.div>
          
          <motion.div whileHover={{ y: -4 }} className="card p-5 flex items-center gap-4 border-indigo-500/10 hover:shadow-lg transition-all bg-[var(--bg-card)]">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-[var(--primary)] flex items-center justify-center text-xl shadow-inner shrink-0">
              <FiStar />
            </div>
            <div>
              <div className="text-xl font-black text-[var(--text-main)]">
                {careerUser.totalXP || careerUser.xp || 0}
              </div>
              <div className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest">Current XP</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left Column: AI Journeys & Activity heatmap */}
        <div className="space-y-8">
          {/* AI Journey Analysis (Bright Theme) */}
          <div className="card p-6 bg-[var(--brand-purple)] text-white relative overflow-hidden group shadow-lg">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[var(--bg-card)]/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)]/20 flex items-center justify-center text-lg shadow-sm shrink-0 border border-white/20">🤖</div>
              <h3 className="text-lg font-black tracking-tight">AI Journey Analysis</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-[var(--bg-card)]/10 border border-white/20 rounded-2xl p-5 backdrop-blur-md">
                <p className="text-purple-50 leading-relaxed font-bold italic text-sm">
                  "{careerUser.profile?.aiSummary || "I'm analyzing your progress to give you personalized insights. Keep learning to unlock my analysis!"}"
                </p>
              </div>

              {careerUser.profile?.recommendedProjects?.length > 0 && (
                <div className="bg-[var(--bg-card)]/10 border border-white/20 rounded-2xl p-5">
                  <div className="text-[8px] text-purple-200 font-black uppercase tracking-widest mb-2">Recommended Projects</div>
                  <ul className="space-y-2">
                    {careerUser.profile.recommendedProjects.map((project, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-bold text-white">
                        <div className="w-1.5 h-1.5 bg-[var(--bg-card)] rounded-full shrink-0"></div> {project}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link to="/code-guru" className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--bg-card)] text-[var(--brand-purple)] hover:bg-purple-50 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg hover:-translate-y-0.5">
                Discuss Strategy with AI <FiArrowRight strokeWidth={3} size={12} />
              </Link>
            </div>
          </div>

          {/* Deep Work Heatmap */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[var(--text-main)] flex items-center gap-2">
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
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer border border-[var(--border)] bg-[var(--bg-card)]"
                    style={{ 
                      backgroundColor: intensity > 0 ? `rgba(48, 141, 70, ${0.05 + intensity * 0.4})` : 'transparent'
                    }}
                    title={`${date}: ${dayLog?.minutes || 0} mins`}
                  >
                    {intensity > 0 && <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-green)] shadow-[var(--shadow-bubbly)]"></div>}
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
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[var(--text-main)]">Quest Trophies</h3>
              <div className="bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest border border-[var(--border)]">{totalBadges} Badges</div>
            </div>
            
            {totalBadges > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                {careerUser.earnedBadges?.map((b, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="text-center p-3 rounded-xl bg-[var(--bg-sub)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--bg-card)] transition-all group shadow-sm medal-badge"
                  >
                    <div className="text-3xl mb-1.5 group-hover:scale-110 transition-transform filter drop-shadow-sm">
                      {b.badgeId?.icon || '🏅'}
                    </div>
                    <div className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-tight line-clamp-2 leading-tight relative z-10">{b.badgeId?.name}</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10 opacity-80">
                <div className="text-5xl mb-4 grayscale">🏆</div>
                <h4 className="text-sm font-black text-[var(--text-main)] mb-1">No Trophies Yet</h4>
                <p className="text-[var(--text-muted)] max-w-[200px] text-[10px] font-semibold leading-relaxed">Master the final assessment of each phase to earn official badges.</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
             <Link to="/roadmap" className="w-full btn-primary py-3.5 text-xs rounded-xl shadow-[var(--shadow-bubbly)] uppercase tracking-widest font-black flex justify-center hover:-translate-y-0.5 transition-all">
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

              <div 
                id="printable-certificate"
                className="w-full aspect-[1.414/1] bg-stone-900 border-[16px] border-double border-[#c5a880] p-10 flex flex-col justify-between items-center text-center text-stone-200 relative overflow-hidden select-text"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#c5a880]/40"></div>
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#c5a880]/40"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#c5a880]/40"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#c5a880]/40"></div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                  <span className="text-[250px]">🏆</span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a880]">CodeWave Solution Verification</div>
                  <h1 className="text-3xl font-bold tracking-wide text-white" style={{ fontFamily: 'Georgia, serif' }}>CERTIFICATE OF COMPLETION</h1>
                </div>

                <div className="space-y-4">
                  <p className="text-xs italic text-stone-400">This specialized credential certifies that</p>
                  <h2 className="text-4xl font-extrabold text-[#c5a880] tracking-wide my-2 uppercase">{careerUser.fullName}</h2>
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
                    <div className="w-14 h-14 border border-stone-800 rounded bg-[var(--bg-card)] p-1 flex items-center justify-center opacity-85 select-none pointer-events-none">
                      <div className="text-[7px] text-stone-900 font-bold leading-none select-none text-center">
                        CW VERIFY<br />🔒<br />{selectedCertificate.certificateId.substring(selectedCertificate.certificateId.length - 6)}
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
                    background: #1c1917 !important;
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
}
