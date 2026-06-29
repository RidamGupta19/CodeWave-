import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FiClock, FiActivity, FiUsers, FiSearch, FiTv, FiAward, 
  FiArrowRight, FiX, FiCalendar, FiChevronRight, FiBriefcase 
} from 'react-icons/fi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function AdminUserActivity() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Detail Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/activity/users');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load activity metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      setSelectedUser(userId);
      setLoadingDetails(true);
      const res = await api.get(`/admin/activity/${userId}`);
      if (res.data.success) {
        setUserDetails(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to retrieve user activity details');
      setSelectedUser(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-[var(--bg-sub)]/35 rounded-2xl" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-80 bg-[var(--bg-sub)]/35 rounded-3xl" />
          <div className="h-80 bg-[var(--bg-sub)]/35 rounded-3xl" />
        </div>
        <div className="h-96 bg-[var(--bg-sub)]/35 rounded-3xl" />
      </div>
    );
  }

  const { users, cards, charts } = data;

  // Filtered users list
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* 1. Dashboard Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Daily Active</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <FiUsers className="text-indigo-650 dark:text-indigo-400 text-lg" /> {cards.dau}
          </div>
          <span className="text-[9px] text-slate-400 font-bold block mt-1">Users active past 24h</span>
        </div>

        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Weekly Active</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <FiUsers className="text-emerald-600 dark:text-emerald-450 text-lg" /> {cards.wau}
          </div>
          <span className="text-[9px] text-slate-400 font-bold block mt-1">Users active past 7 days</span>
        </div>

        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Monthly Active</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <FiUsers className="text-amber-500 dark:text-amber-450 text-lg" /> {cards.mau}
          </div>
          <span className="text-[9px] text-slate-400 font-bold block mt-1">Users active past 30 days</span>
        </div>

        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Avg Session</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <FiClock className="text-rose-500 dark:text-rose-450 text-lg" /> {cards.avgSessionTime} <span className="text-xs font-bold text-slate-500">mins</span>
          </div>
          <span className="text-[9px] text-slate-400 font-bold block mt-1">Average connection time</span>
        </div>

        <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm col-span-2 lg:col-span-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Sessions Today</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <FiActivity className="text-violet-500 dark:text-violet-400 text-lg" /> {cards.totalSessionsToday}
          </div>
          <span className="text-[9px] text-slate-400 font-bold block mt-1">Logins completed today</span>
        </div>

      </div>

      {/* 2. Interactive Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User Activity & Login Trends */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-800 dark:text-white">Active Users & Logins Trends</h4>
            <p className="text-[10px] text-slate-450">Daily registration rates and logged-in users across the past 7 days.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.loginTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fontWeight: 700 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 9, fontWeight: 700 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }} />
                <Area type="monotone" dataKey="count" name="Logins Count" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Time Spent Trends */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-800 dark:text-white">Active Engagement Time (Minutes)</h4>
            <p className="text-[10px] text-slate-455">Total minutes recorded daily across the platform.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.userActivityTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fontWeight: 700 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 9, fontWeight: 700 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }} />
                <Bar dataKey="minutes" name="Active Minutes" fill="#10b981" radius={[8, 8, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Page visits time allocation */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-800 dark:text-white">Page-Wise Time Spent Breakdown</h4>
            <p className="text-[10px] text-slate-455">Accumulated user active time across key application sections.</p>
          </div>
          <div className="h-72 flex items-center justify-center">
            {charts.timeSpentTrends.length === 0 ? (
              <span className="text-xs text-slate-400 font-bold">No active page data logged yet</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.timeSpentTrends}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {charts.timeSpentTrends.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} minutes`} contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value, entry, index) => <span className="text-[10px] font-black text-slate-655 dark:text-slate-400 uppercase tracking-wide">{entry.payload.name}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Course Engagement Breakdown */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl shadow-sm space-y-4">
          <div>
            <h4 className="text-sm font-black text-slate-800 dark:text-white">Active Time by Course / Domain</h4>
            <p className="text-[10px] text-slate-455">Active minutes grouped by enrolled students specialization path.</p>
          </div>
          <div className="h-72">
            {charts.courseEngagement.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-slate-400 font-bold">No course logs found</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.courseEngagement} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                  <XAxis type="number" tick={{ fontSize: 9, fontWeight: 700 }} stroke="#94a3b8" />
                  <YAxis dataKey="course" type="category" tick={{ fontSize: 8, fontWeight: 800 }} stroke="#94a3b8" width={90} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }} />
                  <Bar dataKey="minutes" name="Minutes Spent" fill="#f59e0b" radius={[0, 8, 8, 0]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Peak Hours activity */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl shadow-sm space-y-4 col-span-1 lg:col-span-2">
          <div>
            <h4 className="text-sm font-black text-slate-800 dark:text-white">Peak Activity Hours Density</h4>
            <p className="text-[10px] text-slate-455">Heartbeat log counts across the 24-hour daily cycle.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.peakHours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fontWeight: 700 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 9, fontWeight: 700 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }} />
                <Area type="monotone" dataKey="density" name="Activity Hits" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPeak)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. Detailed Users Table */}
      <div className="card bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden space-y-4 p-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-50 dark:border-white/5">
          <div>
            <h3 className="text-md font-black text-slate-800 dark:text-white">Platform User Engagement</h3>
            <p className="text-xs text-slate-500 mt-0.5">Filter, search, and view detailed sessions of students, teachers, and admins.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:flex-none">
              <FiSearch className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-60 pl-10 pr-4 py-2 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-[10px] font-black text-slate-450 uppercase tracking-widest bg-slate-50/40 dark:bg-slate-950/20">
                <th className="py-4 px-4">User</th>
                <th className="py-4 px-4">Role / Course</th>
                <th className="py-4 px-4 text-center">Logins</th>
                <th className="py-4 px-4">Streak</th>
                <th className="py-4 px-4">Active Time</th>
                <th className="py-4 px-4">Last Login</th>
                <th className="py-4 px-4">Last Active</th>
                <th className="py-4 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-white/5 text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-400 font-bold">No active users found matching filters.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.userId} className="hover:bg-slate-50/30 dark:hover:bg-slate-950/10 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-slate-800 dark:text-white">{u.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-semibold truncate max-w-xs">{u.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider mb-1 ${
                        u.role === 'admin' ? 'bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400' :
                        u.role === 'teacher' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' :
                        'bg-emerald-50 text-emerald-650 dark:bg-emerald-950/40 dark:text-emerald-400'
                      }`}>
                        {u.role}
                      </span>
                      <div className="text-[10px] text-slate-500 font-bold">{u.courseName}</div>
                    </td>
                    <td className="py-4 px-4 text-center font-extrabold text-slate-800 dark:text-white">
                      {u.totalLogins}
                    </td>
                    <td className="py-4 px-4">
                      {u.loginStreak > 0 ? (
                        <span className="font-black text-emerald-600 dark:text-emerald-450">🔥 {u.loginStreak} days</span>
                      ) : (
                        <span className="text-slate-400 font-bold">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-700 dark:text-slate-350">
                      {formatDuration(u.totalTimeSpent)}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-semibold">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-semibold">
                      {u.lastActive ? new Date(u.lastActive).toLocaleString() : 'Never'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleViewDetails(u.userId)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 rounded-xl transition-colors inline-flex items-center justify-center border border-slate-200 dark:border-white/5"
                        title="View Detailed Engagement"
                      >
                        <FiChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Engagement Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-white/5 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl animate-in scale-in duration-200">
            
            <button
              onClick={() => { setSelectedUser(null); setUserDetails(null); }}
              className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl border border-slate-150 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
            >
              <FiX size={16} />
            </button>

            {loadingDetails || !userDetails ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-400 font-bold">Compiling user analytics profile...</span>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="w-14 h-14 bg-indigo-50/50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/50 rounded-2xl flex items-center justify-center text-indigo-605 dark:text-indigo-400 text-2xl font-black shrink-0">
                    {userDetails.userId?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">{userDetails.userId?.fullName}</h3>
                    <p className="text-xs text-slate-500 font-bold">{userDetails.userId?.email} | Role: <span className="uppercase text-[10px] text-indigo-505 dark:text-indigo-400">{userDetails.role}</span></p>
                  </div>
                </div>

                {/* Stat Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-white/5 text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Streak</span>
                    <span className="text-md font-black text-emerald-600">🔥 {userDetails.currentLoginStreak} days</span>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-white/5 text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Time Spent</span>
                    <span className="text-md font-black text-slate-800 dark:text-white">{formatDuration(userDetails.totalTimeSpentInSeconds)}</span>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-white/5 text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Total Logins</span>
                    <span className="text-md font-black text-slate-800 dark:text-white">{userDetails.totalLoginCount} times</span>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-white/5 text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Device / Browser</span>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-350">{userDetails.deviceInfo} ({userDetails.browserInfo})</span>
                  </div>
                </div>

                {/* Subsections: Page breakdowns and Videos/Assessments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  
                  {/* Page Visits breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-1.5"><FiActivity /> Section Breakdown</h4>
                    <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-white/5 rounded-2xl p-4 overflow-hidden">
                      {userDetails.pages.length === 0 ? (
                        <div className="text-center py-6 text-xs text-slate-400 font-bold">No sections visited yet.</div>
                      ) : (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          {userDetails.pages.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <div>
                                <span className="font-extrabold text-slate-800 dark:text-white capitalize">{p.pageName}</span>
                                <span className="text-[10px] text-slate-400 font-semibold ml-2">({p.visitCount} visits)</span>
                              </div>
                              <span className="font-bold text-slate-705 dark:text-slate-350">{formatDuration(p.timeSpentOnPage)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video watched breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-1.5"><FiTv /> Video Engagement</h4>
                    <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-white/5 rounded-2xl p-4 overflow-hidden">
                      {(!userDetails.videoAnalytics || userDetails.videoAnalytics.videosWatched.length === 0) ? (
                        <div className="text-center py-6 text-xs text-slate-400 font-bold">No video lectures watched yet.</div>
                      ) : (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Total Watch Time: {formatDuration(userDetails.videoAnalytics.totalWatchTime)}</div>
                          {userDetails.videoAnalytics.videosWatched.map((v, idx) => (
                            <div key={idx} className="text-xs space-y-1 pb-2 border-b border-slate-100/50 dark:border-white/5 last:border-b-0">
                              <div className="flex justify-between font-extrabold">
                                <span className="text-slate-800 dark:text-white truncate max-w-[200px]">{v.videoId?.title || 'Unknown Video'}</span>
                                <span className="text-indigo-605 dark:text-indigo-400">{v.completionPercentage}% watched</span>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                                <span>Subject: {v.videoId?.subject || 'N/A'}</span>
                                <span>Watched: {formatDuration(v.watchTime)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assessment Attempts */}
                  <div className="space-y-3 md:col-span-2">
                    <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-1.5"><FiAward /> Assessments Attempted</h4>
                    <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-white/5 rounded-2xl p-4">
                      {(!userDetails.assessmentAnalytics || userDetails.assessmentAnalytics.assessmentsAttempted.length === 0) ? (
                        <div className="text-center py-6 text-xs text-slate-400 font-bold">No assessments attempted yet.</div>
                      ) : (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                          <div className="grid grid-cols-3 gap-2 text-[10px] font-black text-indigo-550 uppercase tracking-wider pb-2 border-b border-slate-150 dark:border-white/5">
                            <span>Assessment</span>
                            <span className="text-center">Outcome / Score</span>
                            <span className="text-right">Duration & Attempt Date</span>
                          </div>
                          {userDetails.assessmentAnalytics.assessmentsAttempted.map((a, idx) => (
                            <div key={idx} className="grid grid-cols-3 gap-2 text-xs py-1 border-b border-slate-100/40 dark:border-white/5 last:border-b-0 items-center">
                              <span className="font-extrabold text-slate-850 dark:text-white truncate">{a.assessmentId?.title || 'Launch Attempt'}</span>
                              <span className="text-center font-bold">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider mr-2 ${
                                  a.passed ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-450' : 'bg-rose-50 text-rose-500 dark:bg-rose-950/30 dark:text-rose-450'
                                }`}>
                                  {a.passed ? 'Passed' : 'Failed'}
                                </span>
                                {a.score}%
                              </span>
                              <span className="text-right text-[10px] text-slate-400 font-semibold">
                                ⏱️ {a.timeSpent ? `${Math.round(a.timeSpent / 60)}m` : '0m'} | {new Date(a.attemptedAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
