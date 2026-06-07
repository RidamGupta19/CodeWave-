import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiClock, FiCheck, FiX, FiActivity, FiUserCheck, FiCalendar } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

export default function AttendanceManagement() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]); // Selected markings: { studentId: 'Present'/'Absent'/'Leave' }
  
  // Student specific stats
  const [studentStats, setStudentStats] = useState(null);
  
  // Admin specific stats
  const [adminStats, setAdminStats] = useState(null);
  const [adminLogs, setAdminLogs] = useState([]);

  useEffect(() => {
    if (user.role === 'student') {
      fetchStudentStats();
    } else {
      fetchBatches();
      if (user.role === 'admin') {
        fetchAdminStats();
      }
    }
  }, [user]);

  const fetchBatches = async () => {
    try {
      const res = await api.get('/institute/batches');
      setBatches(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedBatch(res.data.data[0]._id);
      }
    } catch (err) {
      toast.error('Failed to load batches');
    }
  };

  const fetchStudentStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/institute/attendance/my');
      setStudentStats(res.data.data);
    } catch (err) {
      toast.error('Failed to load attendance stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const statsRes = await api.get('/institute/stats/admin');
      setAdminStats(statsRes.data.data);
      
      const logsRes = await api.get('/institute/attendance');
      setAdminLogs(logsRes.data.data);
    } catch (err) {
      console.log('Failed to fetch admin stats', err.message);
    }
  };

  const loadBatchRoster = async () => {
    if (!selectedBatch) return;
    setLoading(true);
    try {
      const batchObj = batches.find(b => b._id === selectedBatch);
      if (!batchObj) return;
      
      // Load current attendance for this batch on this date if marked
      const attRes = await api.get('/institute/attendance', {
        params: { batchId: selectedBatch, date }
      });

      const marked = {};
      attRes.data.data.forEach(log => {
        marked[log.studentId?._id] = log.status;
      });

      const rosterList = batchObj.students || [];
      setRoster(rosterList);
      
      const initialRecords = {};
      rosterList.forEach(s => {
        initialRecords[s._id] = marked[s._id] || 'Present';
      });
      setRecords(initialRecords);
    } catch (err) {
      toast.error('Failed to load batch roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBatch && date && user.role !== 'student') {
      loadBatchRoster();
    }
  }, [selectedBatch, date, batches]);

  const handleStatusChange = (studentId, status) => {
    setRecords({
      ...records,
      [studentId]: status
    });
  };

  const handleSaveAttendance = async () => {
    setLoading(true);
    try {
      const formattedRecords = Object.keys(records).map(id => ({
        studentId: id,
        status: records[id]
      }));

      await api.post('/institute/attendance', {
        batchId: selectedBatch,
        date,
        records: formattedRecords
      });

      toast.success('Attendance saved successfully!');
      if (user.role === 'admin') {
        fetchAdminStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  // Recharts color palettes
  const COLORS = ['#308D46', '#EF4444', '#F5A623'];

  // ==========================================
  // VIEW RENDER: STUDENT
  // ==========================================
  if (user.role === 'student') {
    if (loading || !studentStats) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
        </div>
      );
    }

    const { percentage, total, present, absent, leave, records: stuLogs } = studentStats;
    
    const pieData = [
      { name: 'Present', value: present },
      { name: 'Absent', value: absent },
      { name: 'Leave', value: leave }
    ].filter(d => d.value > 0);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">My Attendance</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Track your presence and compliance metrics</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] text-center shadow-sm">
            <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Presence Rating</div>
            <div className="text-4xl font-black text-[var(--primary)] mt-3">{percentage}%</div>
            <div className="text-[10px] font-bold text-[var(--text-muted)] mt-1">Total marked classes: {total}</div>
          </div>
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] text-center shadow-sm">
            <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Classes Present</div>
            <div className="text-4xl font-black text-[var(--text-main)] mt-3">{present}</div>
            <div className="text-[10px] font-bold text-[var(--text-muted)] mt-1">Status: OK</div>
          </div>
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] text-center shadow-sm">
            <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Classes Absent</div>
            <div className="text-4xl font-black text-rose-500 mt-3">{absent}</div>
            <div className="text-[10px] font-bold text-[var(--text-muted)] mt-1">Needs attention if &gt; 2</div>
          </div>
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] text-center shadow-sm">
            <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Approved Leaves</div>
            <div className="text-4xl font-black text-amber-500 mt-3">{leave}</div>
            <div className="text-[10px] font-bold text-[var(--text-muted)] mt-1">Authorized absence</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Charts card */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
            <h3 className="text-sm font-black uppercase text-[var(--text-light)] tracking-widest mb-6">Attendance Division</h3>
            {pieData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-20 text-xs font-bold text-[var(--text-light)]">No logs seeded yet.</div>
            )}
          </div>

          {/* Table Logs */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
            <h3 className="text-sm font-black uppercase text-[var(--text-light)] tracking-widest mb-6">Recent Logs</h3>
            <div className="max-h-64 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
              {stuLogs.length === 0 ? (
                <p className="text-center py-12 text-xs font-bold text-[var(--text-light)]">No attendance marks logged.</p>
              ) : (
                stuLogs.map((log, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[var(--bg-sub)]/30 border border-[var(--border)] p-3.5 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <FiCalendar className="text-[var(--primary)] text-lg" />
                      <span className="font-extrabold text-[var(--text-main)]">{new Date(log.date).toLocaleDateString()}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      log.status === 'Present' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : log.status === 'Absent' 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}>
                      {log.status}
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

  // ==========================================
  // VIEW RENDER: TEACHER & ADMIN
  // ==========================================
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Attendance Portal</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Mark daily attendance logs, view analytics and reports</p>
      </div>

      {/* Admin Analytics Panel */}
      {user.role === 'admin' && adminStats && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 border border-green-100 text-[var(--primary)] flex items-center justify-center text-xl rounded-xl">
              <FiUserCheck />
            </div>
            <div>
              <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Active Student Count</div>
              <div className="text-2xl font-black text-[var(--text-main)] mt-1">{adminStats.totalStudents}</div>
            </div>
          </div>
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-500 flex items-center justify-center text-xl rounded-xl">
              <FiClock />
            </div>
            <div>
              <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">General Attendance Rate</div>
              <div className="text-2xl font-black text-[var(--text-main)] mt-1">{adminStats.overallAttendanceRate}%</div>
            </div>
          </div>
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center text-xl rounded-xl">
              <FiActivity />
            </div>
            <div>
              <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Active Learning Batches</div>
              <div className="text-2xl font-black text-[var(--text-main)] mt-1">{adminStats.totalBatches}</div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Marker Board */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="card lg:col-span-2 p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-sm font-black uppercase text-[var(--text-light)] tracking-widest">Mark Attendance Sheet</h3>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <select 
                value={selectedBatch} 
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl px-4 py-2.5 outline-none font-bold text-[var(--text-main)] flex-1 sm:flex-none"
              >
                <option value="">Select Batch</option>
                {batches.map(b => <option key={b._id} value={b._id}>{b.batchName}</option>)}
              </select>

              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl px-4 py-2.5 outline-none font-bold text-[var(--text-main)]"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
            </div>
          ) : roster.length === 0 ? (
            <div className="text-center py-20 text-xs font-bold text-[var(--text-light)]">
              No students enrolled in this batch.
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="max-h-[380px] overflow-y-auto pr-2 space-y-2.5 custom-scrollbar">
                {roster.map(s => {
                  const currentStatus = records[s._id] || 'Present';
                  return (
                    <div key={s._id} className="flex justify-between items-center bg-[var(--bg-sub)]/30 border border-[var(--border)] p-4 rounded-xl text-xs font-bold">
                      <div>
                        <div className="text-sm text-[var(--text-main)] font-black">{s.fullName}</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">{s.rollNumber}</div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--border)] p-1 rounded-xl shadow-sm shrink-0">
                        <button
                          onClick={() => handleStatusChange(s._id, 'Present')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                            currentStatus === 'Present' 
                              ? 'bg-[var(--primary)] text-white shadow-sm' 
                              : 'text-[var(--text-muted)] hover:bg-[var(--bg-sub)]'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(s._id, 'Absent')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                            currentStatus === 'Absent' 
                              ? 'bg-rose-500 text-white shadow-sm' 
                              : 'text-[var(--text-muted)] hover:bg-[var(--bg-sub)]'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleStatusChange(s._id, 'Leave')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                            currentStatus === 'Leave' 
                              ? 'bg-amber-500 text-white shadow-sm' 
                              : 'text-[var(--text-muted)] hover:bg-[var(--bg-sub)]'
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleSaveAttendance} 
                  disabled={loading}
                  className="btn-primary py-3 px-8 text-xs font-black uppercase flex items-center gap-2 shadow-lg"
                >
                  <FiCheck strokeWidth={3} /> Save Marks
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History / Logs Panel */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
          <h3 className="text-sm font-black uppercase text-[var(--text-light)] tracking-widest mb-6">Recent Marks Feed</h3>
          <div className="max-h-[460px] overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
            {adminLogs.length === 0 ? (
              <p className="text-center py-16 text-xs font-bold text-[var(--text-light)]">No historical logs parsed.</p>
            ) : (
              adminLogs.slice(0, 30).map((log, idx) => (
                <div key={idx} className="bg-[var(--bg-sub)]/30 border border-[var(--border)] p-3.5 rounded-xl text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-[var(--text-main)] truncate max-w-[120px]">{log.studentId?.fullName || 'N/A'}</h4>
                      <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">{log.batchId?.batchName || 'N/A'}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                      log.status === 'Present' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : log.status === 'Absent' 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-[var(--text-light)] mt-2 font-semibold border-t border-[var(--border)]/50 pt-2">
                    <span>Date: {new Date(log.date).toLocaleDateString()}</span>
                    <span>By: {log.teacherId?.name || 'Admin'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
