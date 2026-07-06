import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FiClock, FiCheck, FiX, FiCalendar, FiUserCheck, 
  FiSearch, FiCheckSquare, FiAlertCircle, FiDownload, 
  FiFilter, FiChevronLeft, FiChevronRight, FiGrid, FiList 
} from 'react-icons/fi';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip 
} from 'recharts';

export default function TeacherAttendance() {
  const [activeTab, setActiveTab] = useState('mark'); // 'mark' | 'history'
  
  // Data States
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [roster, setRoster] = useState([]);
  const [records, setRecords] = useState({}); // { studentId: 'Present'/'Absent'/'Leave' }
  const [selectedStudents, setSelectedStudents] = useState([]); // [studentId]
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // History tab states
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (selectedBatch && selectedCourse) {
      loadBatchRoster();
    }
  }, [selectedBatch, selectedCourse, date]);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistoryLogs();
    }
  }, [activeTab, filterBatch, filterCourse, filterStatus, filterStartDate, filterEndDate]);

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const [batchesRes, coursesRes] = await Promise.all([
        api.get('/institute/batches'),
        api.get('/institute/courses')
      ]);
      
      setBatches(batchesRes.data.data);
      setCourses(coursesRes.data.data);
      
      if (batchesRes.data.data.length > 0) {
        setSelectedBatch(batchesRes.data.data[0]._id);
      }
      if (coursesRes.data.data.length > 0) {
        setSelectedCourse(coursesRes.data.data[0]._id);
      }
    } catch (err) {
      toast.error('Failed to load system metadata');
    } finally {
      setLoading(false);
    }
  };

  const loadBatchRoster = async () => {
    setLoading(true);
    try {
      const batchObj = batches.find(b => b._id === selectedBatch);
      if (!batchObj) return;

      const rosterList = batchObj.students || [];
      setRoster(rosterList);
      setSelectedStudents([]);

      // Fetch already saved logs for this specific batch, course, and date
      const attRes = await api.get('/institute/attendance', {
        params: { batchId: selectedBatch, courseId: selectedCourse, date }
      });

      const marked = {};
      attRes.data.data.forEach(log => {
        const studentId = log.studentId?._id || log.studentId;
        marked[studentId] = log.status;
      });

      const initialRecords = {};
      rosterList.forEach(s => {
        initialRecords[s._id] = marked[s._id] || 'Present';
      });
      setRecords(initialRecords);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load batch roster');
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryLogs = async () => {
    setHistoryLoading(true);
    try {
      const params = {};
      if (filterBatch) params.batchId = filterBatch;
      if (filterCourse) params.courseId = filterCourse;
      if (filterStatus) params.status = filterStatus;
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;

      const res = await api.get('/institute/attendance', { params });
      setHistory(res.data.data);
      setCurrentPage(1);
    } catch (err) {
      toast.error('Failed to fetch attendance history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleMark = (studentId, status) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Bulk selectors
  const toggleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === roster.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(roster.map(s => s._id));
    }
  };

  const handleBulkMark = (status) => {
    if (selectedStudents.length === 0) {
      return toast.error('No students selected');
    }
    const updated = { ...records };
    selectedStudents.forEach(id => {
      updated[id] = status;
    });
    setRecords(updated);
    setSelectedStudents([]);
    toast.success(`Marked ${selectedStudents.length} students as ${status}`);
  };

  const handleMarkAllRoster = (status) => {
    const updated = {};
    roster.forEach(s => {
      updated[s._id] = status;
    });
    setRecords(updated);
    toast.success(`Marked all roster students as ${status}`);
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      const recordsArray = Object.keys(records).map(sId => ({
        studentId: sId,
        status: records[sId]
      }));

      await api.post('/institute/attendance', {
        batchId: selectedBatch,
        courseId: selectedCourse,
        date,
        records: recordsArray
      });

      toast.success('Attendance records saved successfully! 📝');
      // Automatically refresh roster and status indicators
      await loadBatchRoster();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit attendance');
    } finally {
      setSaving(false);
    }
  };

  // Export filtered history as CSV
  const exportToCSV = () => {
    if (history.length === 0) {
      return toast.error('No history records to export');
    }

    const headers = ['Date', 'Student Name', 'Roll Number', 'Batch', 'Subject/Course', 'Status', 'Marked By'];
    const rows = history.map(log => [
      new Date(log.date).toISOString().substring(0, 10),
      log.studentId?.fullName || 'N/A',
      log.studentId?.rollNumber || 'N/A',
      log.batchId?.batchName || 'N/A',
      log.courseId?.courseName || 'N/A',
      log.status,
      log.teacherId?.name || 'N/A'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_Report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendance report exported successfully! 📊');
  };

  // Filter history client side by search query
  const filteredHistory = history.filter(log => {
    const term = searchQuery.toLowerCase();
    const name = log.studentId?.fullName?.toLowerCase() || '';
    const roll = log.studentId?.rollNumber?.toLowerCase() || '';
    return name.includes(term) || roll.includes(term);
  });

  // Pagination computations
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  // Daily stats computations
  const rosterCount = roster.length;
  const presentCount = Object.values(records).filter(status => status === 'Present').length;
  const absentCount = Object.values(records).filter(status => status === 'Absent').length;
  const leaveCount = Object.values(records).filter(status => status === 'Leave').length;

  const pieData = [
    { name: 'Present', value: presentCount, color: '#10b981' },
    { name: 'Absent', value: absentCount, color: '#f43f5e' },
    { name: 'Leave', value: leaveCount, color: '#f59e0b' }
  ].filter(d => d.value > 0);

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Attendance Manager</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
            Bulk logging, subject-wise marking, edit histories, and visual analytics reports
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-[var(--bg-sub)] border border-[var(--border)] p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('mark')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'mark'
                ? 'bg-white text-[var(--text-main)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <FiCheckSquare /> Mark Attendance
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'history'
                ? 'bg-white text-[var(--text-main)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <FiClock /> Archives & Reports
          </button>
        </div>
      </div>

      {/* ==================== 1. MARK ATTENDANCE TAB ==================== */}
      {activeTab === 'mark' && (
        <div className="space-y-6">
          
          {/* Controls bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
            {/* Batch Select */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">Classroom Batch</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
              >
                {batches.map(b => (
                  <option key={b._id} value={b._id}>{b.batchName}</option>
                ))}
              </select>
            </div>

            {/* Subject Select */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">Subject / Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
              >
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.courseName}</option>
                ))}
              </select>
            </div>

            {/* Target Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">Target Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
              />
            </div>

            {/* General Shortcuts */}
            <div className="space-y-1 flex flex-col justify-end">
              <span className="text-[9px] font-black uppercase text-[var(--text-muted)] tracking-wider block mb-1.5">Mark Roster Shortcut</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMarkAllRoster('Present')}
                  className="flex-1 py-2 text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 hover:bg-emerald-100 rounded-xl transition-all"
                >
                  All Present
                </button>
                <button
                  onClick={() => handleMarkAllRoster('Absent')}
                  className="flex-1 py-2 text-[10px] font-black uppercase bg-rose-50 text-rose-500 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 hover:bg-rose-100 rounded-xl transition-all"
                >
                  All Absent
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primary)] border-t-transparent mx-auto" />
              <p className="text-xs text-[var(--text-muted)] mt-4 font-bold">Synchronizing roster data...</p>
            </div>
          ) : roster.length === 0 ? (
            <div className="card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">Roster Empty</h3>
              <p className="text-xs font-semibold">No students are currently registered in this batch to log attendance.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Roster markings */}
              <div className="lg:col-span-2 space-y-4">
                <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-4">
                  
                  {/* Bulk Action Strip */}
                  <div className="flex justify-between items-center bg-[var(--bg-sub)]/35 p-3 rounded-xl border border-[var(--border-light)] gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={roster.length > 0 && selectedStudents.length === roster.length}
                        onChange={toggleSelectAll}
                        className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] w-4 h-4 cursor-pointer"
                      />
                      <span className="text-[10px] font-black uppercase text-[var(--text-main)] tracking-wider">
                        {selectedStudents.length} Selected
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">Bulk Mark Selected:</span>
                      <button
                        onClick={() => handleBulkMark('Present')}
                        className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 text-[9px] font-black uppercase rounded-lg hover:bg-emerald-100 transition-all"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleBulkMark('Absent')}
                        className="px-3 py-1 bg-rose-50 text-rose-500 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 text-[9px] font-black uppercase rounded-lg hover:bg-rose-100 transition-all"
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => handleBulkMark('Leave')}
                        className="px-3 py-1 bg-amber-50 text-amber-500 border border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 text-[9px] font-black uppercase rounded-lg hover:bg-amber-100 transition-all"
                      >
                        Leave
                      </button>
                    </div>
                  </div>

                  {/* Student Rows */}
                  <div className="divide-y divide-[var(--border-light)] max-h-[480px] overflow-y-auto pr-2 no-scrollbar">
                    {roster.map(s => {
                      const currentStatus = records[s._id] || 'Present';
                      const isChecked = selectedStudents.includes(s._id);
                      return (
                        <div key={s._id} className="py-3.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelectStudent(s._id)}
                              className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] w-4 h-4 cursor-pointer"
                            />
                            <div>
                              <h4 className="text-xs font-black text-[var(--text-main)]">{s.fullName}</h4>
                              <span className="text-[9px] font-bold text-[var(--text-light)] block mt-0.5">{s.rollNumber || 'N/A'}</span>
                            </div>
                          </div>
                          
                          {/* Marker options */}
                          <div className="flex gap-1.5 bg-[var(--bg-sub)]/35 p-1 rounded-xl border border-[var(--border-light)]">
                            {['Present', 'Absent', 'Leave'].map(status => {
                              const isSelected = currentStatus === status;
                              const activeStyles = 
                                status === 'Present' ? 'bg-emerald-500 text-white shadow-sm font-bold' :
                                status === 'Absent' ? 'bg-rose-500 text-white shadow-sm font-bold' :
                                'bg-amber-500 text-white shadow-sm font-bold';

                              return (
                                <button
                                  key={status}
                                  onClick={() => handleMark(s._id, status)}
                                  className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${
                                    isSelected 
                                      ? activeStyles 
                                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/40'
                                  }`}
                                >
                                  {status}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Save button */}
                  <div className="pt-4 border-t border-[var(--border-light)] flex justify-end">
                    <button
                      onClick={saveAttendance}
                      disabled={saving}
                      className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-black uppercase rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      {saving ? (
                        <>Saving Records...</>
                      ) : (
                        <>
                          <FiUserCheck /> Save Attendance Records
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Ratio Breakdown */}
              <div className="space-y-6">
                <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest">Roster Breakdown</h3>
                  
                  {pieData.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] font-bold text-center py-8">Select status to view breakdown.</p>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={65}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex gap-4 text-[9px] font-black uppercase tracking-wider mt-2">
                        <span className="text-emerald-500">🟢 P: {presentCount}</span>
                        <span className="text-rose-500">🔴 A: {absentCount}</span>
                        <span className="text-amber-500">🟡 L: {leaveCount}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ==================== 2. HISTORY & ARCHIVES TAB ==================== */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          
          {/* Search and Filters grid */}
          <div className="card bg-[var(--bg-card)] border border-[var(--border)] p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-1">
              <FiFilter /> Query Filter Options
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              
              {/* Search bar */}
              <div className="space-y-1 lg:col-span-2">
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">Search Student</label>
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-3.5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or roll number..."
                    className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  />
                </div>
              </div>

              {/* Batch Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">Batch</label>
                <select
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                >
                  <option value="">All Batches</option>
                  {batches.map(b => (
                    <option key={b._id} value={b._id}>{b.batchName}</option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">Subject</label>
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                >
                  <option value="">All Subjects</option>
                  {courses.map(c => (
                    <option key={c._id} value={c._id}>{c.courseName}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                >
                  <option value="">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">Start Date</label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* End Date */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">End Date</label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                />
              </div>

              {/* Reset Filters / Export Button */}
              <div className="lg:col-span-5 flex justify-end items-end gap-3 pb-0.5">
                <button
                  onClick={() => {
                    setFilterBatch('');
                    setFilterCourse('');
                    setFilterStatus('');
                    setFilterStartDate('');
                    setFilterEndDate('');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2.5 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-black uppercase rounded-xl transition-all"
                >
                  Clear Filters
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <FiDownload /> Export CSV Report
                </button>
              </div>
            </div>

          </div>

          {/* Records Table */}
          <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h3 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest">Attendance Log Archives</h3>
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase bg-[var(--bg-sub)] px-3 py-1 rounded-lg border border-[var(--border)]">
                Total Logs matched: {filteredHistory.length}
              </span>
            </div>

            {historyLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primary)] border-t-transparent mx-auto" />
                <p className="text-xs text-[var(--text-muted)] mt-4 font-bold">Querying archive logs...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-16 text-[var(--text-muted)] space-y-2">
                <FiAlertCircle size={28} className="mx-auto opacity-40" />
                <h4 className="text-xs font-black uppercase text-[var(--text-main)]">No Records Found</h4>
                <p className="text-[11px] font-semibold">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-xl border border-[var(--border-light)]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--bg-sub)]/35 text-[9px] font-black uppercase text-[var(--text-muted)] tracking-wider border-b border-[var(--border-light)]">
                        <th className="p-4">Date</th>
                        <th className="p-4">Student</th>
                        <th className="p-4">Roll Number</th>
                        <th className="p-4">Batch Name</th>
                        <th className="p-4">Subject</th>
                        <th className="p-4">Presence Status</th>
                        <th className="p-4">Logged By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)] text-xs font-semibold text-[var(--text-main)]">
                      {currentItems.map(log => {
                        const statusColors = 
                          log.status === 'Present' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                          log.status === 'Absent' ? 'bg-rose-50 text-rose-50 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' :
                          'bg-amber-50 text-amber-500 border border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20';

                        return (
                          <tr key={log._id} className="hover:bg-[var(--bg-sub)]/10 transition-colors">
                            <td className="p-4 font-black whitespace-nowrap">{new Date(log.date).toISOString().substring(0, 10)}</td>
                            <td className="p-4 whitespace-nowrap">{log.studentId?.fullName || 'N/A'}</td>
                            <td className="p-4 whitespace-nowrap font-mono">{log.studentId?.rollNumber || 'N/A'}</td>
                            <td className="p-4 whitespace-nowrap">{log.batchId?.batchName || 'N/A'}</td>
                            <td className="p-4 whitespace-nowrap">{log.courseId?.courseName || 'N/A'}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase ${statusColors}`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="p-4 whitespace-nowrap text-[var(--text-muted)] font-medium">
                              {log.teacherId?.name || 'Admin'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination strip */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center pt-2 select-none">
                    <span className="text-[10px] font-extrabold uppercase text-[var(--text-muted)]">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-[var(--border)] hover:bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                      >
                        <FiChevronLeft />
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-[var(--border)] hover:bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                      >
                        <FiChevronRight />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
