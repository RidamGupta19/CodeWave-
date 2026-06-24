import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FiUsers, FiBookOpen, FiClock, FiFileText, FiBell, FiVideo, 
  FiArrowRight, FiCheckCircle, FiAlertCircle, FiTrendingUp 
} from 'react-icons/fi';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, Legend 
} from 'recharts';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/dashboard/teacher');
      setStats(res.data.data);
    } catch (err) {
      console.error('Error fetching teacher stats:', err);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-64 bg-[var(--border)] rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-28 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-28 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-28 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-28 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[350px] bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-[350px] bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Attendance summary chart data
  const chartData = stats?.batches?.map(b => ({
    name: b.batchName,
    'Students Enrolled': b.studentCount,
    'Attendance %': stats.attendanceSummary?.percentage || 90
  })) || [];

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">
            Welcome back, {stats?.teacher?.name || 'Instructor'}! 👋
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
            Faculty Dashboard &bull; Track class schedules, review coursework, and monitor batch attendance
          </p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 px-3.5 py-1.5 rounded-full">
          Role: Certified Mentor
        </span>
      </div>

      {/* 1. KEY STATISTICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Students */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block">Total Students</span>
            <span className="text-3xl font-black text-[var(--text-main)] block">{stats?.studentCount || 0}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <FiUsers size={22} />
          </div>
        </div>

        {/* Total Batches */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block">Active Batches</span>
            <span className="text-3xl font-black text-[var(--primary)] block">{stats?.totalBatches || 0}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center shrink-0">
            <FiBookOpen size={22} />
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block">Pending Submissions</span>
            <span className="text-3xl font-black text-amber-500 block">{stats?.pendingAssignmentsCount || 0}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <FiFileText size={22} />
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block">Attendance Rate</span>
            <span className="text-3xl font-black text-rose-500 block">{stats?.attendanceSummary?.percentage || 0}%</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <FiTrendingUp size={22} />
          </div>
        </div>

      </div>

      {/* 2. ANALYTICS & TIMETABLE LAYOUT */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column (Batches & Chart) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Batches Overview Chart */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider">Batch Enrollment & Presence Rate</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} fontWeight="600" />
                  <YAxis stroke="var(--text-muted)" fontSize={11} fontWeight="600" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: '#fff' }} />
                  <Legend />
                  <Bar dataKey="Students Enrolled" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Attendance %" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Batches Summary Grid */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider">Assigned Batches</h3>
              <Link to="/teacher/batches" className="text-xs font-black uppercase text-[var(--primary)] hover:underline flex items-center gap-1">
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {stats?.batches?.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] font-bold text-center col-span-full py-8">No assigned batches.</p>
              ) : (
                stats.batches.map(b => (
                  <div key={b._id} className="p-4 bg-[var(--bg-sub)]/35 rounded-xl border border-[var(--border-light)] flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-black text-[var(--text-main)]">{b.batchName}</h4>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold">⏰ {b.timing}</p>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-white border border-[var(--border)] text-[var(--text-main)] rounded-lg">
                      {b.studentCount} Students
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column (Upcoming Classes & Announcements) */}
        <div className="space-y-6">
          
          {/* Upcoming Live Classroom timetables */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider">Upcoming Lectures</h3>
              <Link to="/teacher/live-classes" className="text-xs font-black uppercase text-[var(--primary)] hover:underline flex items-center gap-1">
                Schedule <FiArrowRight />
              </Link>
            </div>

            <div className="space-y-3">
              {stats?.upcomingClasses?.length === 0 ? (
                <div className="text-center py-10 text-[var(--text-muted)]">
                  <FiVideo className="mx-auto text-2xl opacity-40 mb-2" />
                  <p className="text-xs font-semibold">No upcoming classes scheduled.</p>
                </div>
              ) : (
                stats.upcomingClasses.slice(0, 3).map(c => {
                  const isLive = c.status === 'LIVE';
                  return (
                    <div 
                      key={c._id} 
                      className={`p-4 bg-[var(--bg-sub)]/35 rounded-xl border flex flex-col gap-3 transition-all ${
                        isLive ? 'border-rose-500 ring-1 ring-rose-500/15' : 'border-[var(--border-light)]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase rounded border ${
                          isLive 
                            ? 'bg-rose-50 border-rose-100 text-rose-500 animate-pulse' 
                            : 'bg-white border-[var(--border)] text-[var(--text-muted)]'
                        }`}>
                          {isLive ? 'LIVE NOW 📡' : new Date(c.date).toLocaleDateString()}
                        </span>
                        <span className="text-[9px] font-bold text-[var(--text-light)]">⏰ {c.time}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[var(--text-main)] line-clamp-1">{c.topic}</h4>
                        <p className="text-[9px] text-[var(--text-muted)] mt-1 font-bold">{c.batch?.batchName} &bull; {c.course?.courseName}</p>
                      </div>
                      <a
                        href={c.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className={`w-full text-center py-2 text-[10px] font-black uppercase rounded-lg tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                          isLive 
                            ? 'bg-rose-500 text-white hover:bg-rose-600' 
                            : 'bg-white border border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-sub)]'
                        }`}
                      >
                        <FiVideo /> {isLive ? 'Launch Live Class' : 'Prepare Link'}
                      </a>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Notice Bulletins */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider">Announcements</h3>
              <Link to="/teacher/notifications" className="text-xs font-black uppercase text-[var(--primary)] hover:underline flex items-center gap-1">
                Post Notice <FiArrowRight />
              </Link>
            </div>

            <div className="space-y-3">
              {stats?.recentAnnouncements?.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] font-bold text-center py-8">No notices posted.</p>
              ) : (
                stats.recentAnnouncements.map(n => (
                  <div key={n._id} className="p-3 bg-[var(--bg-sub)]/35 rounded-xl border border-[var(--border-light)] space-y-1.5">
                    <h4 className="text-xs font-black text-[var(--text-main)] leading-tight">{n.title}</h4>
                    <p className="text-[10px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">{n.content}</p>
                    <span className="text-[8px] font-bold text-[var(--text-light)] block mt-1">🗓️ {new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
