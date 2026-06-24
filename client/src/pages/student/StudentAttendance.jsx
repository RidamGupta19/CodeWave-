import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FiClock, FiCheck, FiX, FiInfo, FiSearch, 
  FiChevronLeft, FiChevronRight, FiGrid, FiList, FiTrendingUp 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

export default function StudentAttendance() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calendar Controls
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filters & Pagination
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchAttendanceReport();
  }, [currentDate, selectedCourse]);

  const fetchAttendanceReport = async () => {
    try {
      setLoading(true);
      const month = currentDate.getMonth() + 1; // 1-indexed
      const year = currentDate.getFullYear();
      
      let url = `/institute/attendance/report?month=${month}&year=${year}`;
      if (selectedCourse) {
        url += `&courseId=${selectedCourse}`;
      }

      const res = await api.get(url);
      setReportData(res.data.data);
    } catch (err) {
      console.error('Error fetching attendance report:', err);
      toast.error('Failed to load attendance analytics');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setCurrentPage(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setCurrentPage(1);
  };

  if (loading && !reportData) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-80 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-80 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { statistics = {}, subjectWise = [], calendarData = [], history = {} } = reportData || {};
  const { total = 0, present = 0, absent = 0, leave = 0, percentage = 100 } = statistics;

  // Chart data
  const pieData = [
    { name: 'Present', value: present, color: '#308D46' }, // GFG Green
    { name: 'Absent', value: absent, color: '#EF4444' },  // Red
    { name: 'Leave', value: leave, color: '#F48225' }     // GFG Orange
  ].filter(d => d.value > 0);

  // Generate calendar days array
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // Fill empty slots for previous month padding
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  // Fill active days of current month
  for (let d = 1; d <= totalDays; d++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const log = calendarData.find(c => c.date === dayStr);
    calendarDays.push({ day: d, dateStr: dayStr, log });
  }

  // Filter history records on client-side search (or page queries)
  const filteredHistory = (history.records || []).filter(r => {
    const searchStr = searchQuery.toLowerCase();
    return (
      new Date(r.date).toLocaleDateString().includes(searchStr) ||
      r.status.toLowerCase().includes(searchStr) ||
      (r.courseId?.courseName || '').toLowerCase().includes(searchStr) ||
      (r.teacherId?.name || '').toLowerCase().includes(searchStr)
    );
  });

  const getStatusBadge = (status) => {
    if (status === 'Present') {
      return (
        <span className="px-2 py-0.5 bg-green-50 text-[var(--success)] border border-green-100 text-[10px] font-black uppercase rounded-md tracking-wider">
          Present
        </span>
      );
    }
    if (status === 'Leave') {
      return (
        <span className="px-2 py-0.5 bg-orange-50 text-orange-500 border border-orange-100 text-[10px] font-black uppercase rounded-md tracking-wider">
          Leave
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-red-50 text-rose-500 border border-red-100 text-[10px] font-black uppercase rounded-md tracking-wider">
        Absent
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Classroom Attendance Center</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
          Review subject-wise performance, monthly attendance grids and detailed presence logs
        </p>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Total Logs</span>
          <div className="text-2xl font-black text-[var(--text-main)] mt-2">{total}</div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Presents</span>
          <div className="text-2xl font-black text-[var(--success)] mt-2">{present}</div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Absents</span>
          <div className="text-2xl font-black text-rose-500 mt-2">{absent}</div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Leaves</span>
          <div className="text-2xl font-black text-orange-500 mt-2">{leave}</div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center col-span-2 md:col-span-1">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Presence Rate</span>
          <div className="text-2xl font-black text-[var(--primary)] mt-2">{percentage}%</div>
        </div>
      </div>

      {/* Main Section: Calendar & Charts */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Monthly Calendar View */}
        <div className="lg:col-span-2 card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[var(--border-light)]">
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
              <FiGrid /> Attendance Calendar View
            </h3>
            
            {/* Calendar Month Selector */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrevMonth}
                className="p-2 hover:bg-[var(--bg-sub)]/80 text-[var(--text-muted)] border border-[var(--border)] rounded-xl transition-all"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="text-xs font-black uppercase tracking-wider text-[var(--text-main)] min-w-[100px] text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button 
                onClick={handleNextMonth}
                className="p-2 hover:bg-[var(--bg-sub)]/80 text-[var(--text-muted)] border border-[var(--border)] rounded-xl transition-all"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-3 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span key={day} className="text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">{day}</span>
            ))}

            {calendarDays.map((d, index) => {
              if (!d) return <div key={`empty-${index}`} className="aspect-square bg-transparent" />;
              
              const isWeekend = index % 7 === 0 || index % 7 === 6;
              const hasLog = !!d.log;
              const isPresent = d.log?.status === 'Present';
              const isLeave = d.log?.status === 'Leave';

              let bgClass = 'bg-[var(--bg-sub)]/20 text-[var(--text-light)]';
              if (hasLog) {
                if (isPresent) bgClass = 'bg-[var(--success)] text-white font-black shadow-sm shadow-emerald-500/10';
                else if (isLeave) bgClass = 'bg-orange-500 text-white font-black shadow-sm shadow-orange-500/10';
                else bgClass = 'bg-red-500 text-white font-black shadow-sm shadow-rose-500/10';
              } else if (isWeekend) {
                bgClass = 'bg-[var(--bg-sub)]/40 text-[var(--text-light)]/75';
              }

              return (
                <div 
                  key={d.day}
                  className={`aspect-square flex items-center justify-center text-xs rounded-xl transition-all hover:scale-105 select-none ${bgClass}`}
                  title={d.log ? `${d.dateStr}: ${d.log.status}` : isWeekend ? 'Weekend' : 'No record logged'}
                >
                  {d.day}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] pt-4 border-t border-[var(--border-light)]">
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-[var(--success)]" /> Present</div>
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-red-500" /> Absent</div>
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-orange-500" /> Leave</div>
            <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-[var(--bg-sub)]/30 border border-[var(--border)]" /> No Record</div>
          </div>
        </div>

        {/* Present/Absent Statistics Charts */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm flex flex-col justify-between space-y-6">
          <h3 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-2">
            <FiTrendingUp /> Present vs Absent Ratio
          </h3>
          
          {pieData.length > 0 ? (
            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v} sessions`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-3xl font-black text-[var(--text-main)]">{percentage}%</span>
                <p className="text-[8px] uppercase font-black text-[var(--text-light)] tracking-widest mt-0.5">Average</p>
              </div>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-xs font-semibold text-[var(--text-muted)]">
              No chart data loaded for this month.
            </div>
          )}

          {/* Subject wise stats */}
          <div className="pt-4 border-t border-[var(--border-light)] space-y-3">
            <h4 className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-wider">Subject Attendance</h4>
            <div className="space-y-2 max-h-[160px] overflow-y-auto no-scrollbar">
              {subjectWise.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] font-semibold py-2">No subject metrics found.</p>
              ) : (
                subjectWise.map((sub, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-[var(--text-main)] truncate max-w-[150px]">{sub.courseName}</span>
                      <span className={sub.percentage >= 85 ? 'text-[var(--success)]' : 'text-rose-500'}>{sub.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-sub)] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${sub.percentage}%`,
                          backgroundColor: sub.percentage >= 85 ? 'var(--success)' : '#EF4444'
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Paginated Daily logs table */}
      <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[var(--border-light)] flex flex-wrap justify-between items-center gap-4">
          <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
            <FiList /> Daily Presence Log logs
          </h3>
          
          {/* Optional course filter */}
          <select
            value={selectedCourse}
            onChange={(e) => { setSelectedCourse(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl text-xs text-[var(--text-main)] outline-none font-bold"
          >
            <option value="">All Subjects</option>
            {subjectWise.map((sub, idx) => (
              <option key={idx} value={sub.courseId}>{sub.courseName}</option>
            ))}
          </select>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)] font-semibold">
            No attendance records found matching filters for this calendar month.
          </div>
        ) : (
          <div className="overflow-x-auto text-xs font-semibold">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg-sub)]/50 border-b border-[var(--border-light)] text-[var(--text-muted)] font-black uppercase tracking-wider">
                  <th className="p-4">Reference Date</th>
                  <th className="p-4">Subject Course</th>
                  <th className="p-4">Allocated Batch</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Instructor</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-main)]">
                {filteredHistory
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((log) => (
                    <tr key={log._id} className="border-b border-[var(--border-light)] last:border-b-0 hover:bg-[var(--bg-sub)]/10">
                      <td className="p-4">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="p-4 font-black">{log.courseId?.courseName || 'General Course'}</td>
                      <td className="p-4">{log.batchId?.batchName || 'Allocated Batch'}</td>
                      <td className="p-4">{getStatusBadge(log.status)}</td>
                      <td className="p-4 text-right">{log.teacherId?.name || 'Class Mentor'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {filteredHistory.length > itemsPerPage && (
          <div className="p-4 border-t border-[var(--border-light)] flex justify-between items-center bg-[var(--bg-sub)]/10">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-[var(--border)] rounded-xl text-xs font-black uppercase text-[var(--text-main)] hover:bg-[var(--bg-sub)]/50 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-[var(--text-muted)]">
              Page {currentPage} of {Math.ceil(filteredHistory.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredHistory.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(filteredHistory.length / itemsPerPage)}
              className="px-4 py-2 bg-white border border-[var(--border)] rounded-xl text-xs font-black uppercase text-[var(--text-main)] hover:bg-[var(--bg-sub)]/50 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
