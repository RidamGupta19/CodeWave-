import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FiClock, FiCheck, FiX, FiCalendar, FiUserCheck, 
  FiSearch, FiCheckSquare, FiAlertCircle 
} from 'react-icons/fi';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell 
} from 'recharts';

export default function TeacherAttendance() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState({}); // { studentId: 'Present'/'Absent'/'Leave' }
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      loadBatchRoster();
      loadAttendanceHistory();
    }
  }, [selectedBatch, date]);

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

  const loadBatchRoster = async () => {
    if (!selectedBatch) return;
    setLoading(true);
    try {
      const batchObj = batches.find(b => b._id === selectedBatch);
      if (!batchObj) return;

      const attRes = await api.get('/institute/attendance', {
        params: { batchId: selectedBatch, date }
      });

      const marked = {};
      attRes.data.data.forEach(log => {
        const studentId = log.studentId?._id || log.studentId;
        marked[studentId] = log.status;
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

  const loadAttendanceHistory = async () => {
    if (!selectedBatch) return;
    try {
      const res = await api.get('/institute/attendance', {
        params: { batchId: selectedBatch }
      });
      // Group history by date
      const grouped = {};
      res.data.data.forEach(log => {
        const dStr = new Date(log.date).toISOString().substring(0, 10);
        if (!grouped[dStr]) {
          grouped[dStr] = { date: dStr, present: 0, absent: 0, leave: 0, total: 0 };
        }
        grouped[dStr].total += 1;
        if (log.status === 'Present') grouped[dStr].present += 1;
        if (log.status === 'Absent') grouped[dStr].absent += 1;
        if (log.status === 'Leave') grouped[dStr].leave += 1;
      });
      setHistory(Object.values(grouped).sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error('Failed to load attendance logs', err);
    }
  };

  const handleMark = (studentId, status) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    roster.forEach(s => {
      updated[s._id] = status;
    });
    setRecords(updated);
    toast.success(`Marked all as ${status}`);
  };

  const saveAttendance = async () => {
    try {
      const recordsArray = Object.keys(records).map(sId => ({
        studentId: sId,
        status: records[sId]
      }));

      await api.post('/institute/mark-attendance', {
        batchId: selectedBatch,
        date,
        records: recordsArray
      });

      toast.success('Attendance records saved successfully! 📝');
      loadAttendanceHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit attendance');
    }
  };

  // Stats computation
  const totalStudents = roster.length;
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
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Daily Attendance Portal</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
          Select batches, record student presence logs, and review historical metrics
        </p>
      </div>

      {/* Control Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
        
        {/* Batch Select */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-wider">Select Classroom Batch</label>
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

        {/* Date Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-wider">Target Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
          />
        </div>

        {/* Attendance Shortcuts */}
        <div className="space-y-1 flex flex-col justify-end">
          <span className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider block mb-1.5">Roster Shortcuts</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleMarkAll('Present')}
              className="flex-1 py-2 text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 hover:bg-emerald-100 rounded-xl transition-all"
            >
              All Present
            </button>
            <button
              onClick={() => handleMarkAll('Absent')}
              className="flex-1 py-2 text-[10px] font-black uppercase bg-rose-50 text-rose-500 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 hover:bg-rose-100 rounded-xl transition-all"
            >
              All Absent
            </button>
          </div>
        </div>

      </div>

      {roster.length === 0 ? (
        <div className="card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
          <div className="text-4xl mb-4">⏰</div>
          <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">Roster Empty</h3>
          <p className="text-xs font-semibold">No students are currently registered in this batch to mark attendance.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Student marking list (Col-span 2) */}
          <div className="lg:col-span-2 space-y-4">
            
            <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest">Mark Attendance Roster</h3>
              
              <div className="divide-y divide-[var(--border-light)] max-h-[480px] overflow-y-auto pr-2 no-scrollbar">
                {roster.map(s => {
                  const currentStatus = records[s._id] || 'Present';
                  return (
                    <div key={s._id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-black text-[var(--text-main)]">{s.fullName}</h4>
                        <span className="text-[9px] font-bold text-[var(--text-light)] block mt-0.5">{s.rollNumber || 'N/A'}</span>
                      </div>
                      
                      {/* Attendance Buttons */}
                      <div className="flex gap-2 bg-[var(--bg-sub)]/35 p-1 rounded-xl border border-[var(--border-light)]">
                        {['Present', 'Absent', 'Leave'].map(status => {
                          const isSelected = currentStatus === status;
                          const activeStyles = 
                            status === 'Present' ? 'bg-emerald-500 text-white shadow-sm' :
                            status === 'Absent' ? 'bg-rose-500 text-white shadow-sm' :
                            'bg-amber-500 text-white shadow-sm';

                          return (
                            <button
                              key={status}
                              onClick={() => handleMark(s._id, status)}
                              className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${
                                isSelected 
                                  ? activeStyles 
                                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
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

              {/* Submit button */}
              <div className="pt-4 border-t border-[var(--border-light)] flex justify-end">
                <button
                  onClick={saveAttendance}
                  className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-black uppercase rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <FiUserCheck /> Save Attendance Records
                </button>
              </div>

            </div>

          </div>

          {/* Stats & History sidebar */}
          <div className="space-y-6">
            
            {/* Visual breakdown ratio */}
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
                  {/* Legend labels */}
                  <div className="flex gap-4 text-[9px] font-black uppercase tracking-wider mt-2">
                    <span className="text-emerald-500">🟢 P: {presentCount}</span>
                    <span className="text-rose-500">🔴 A: {absentCount}</span>
                    <span className="text-amber-500">🟡 L: {leaveCount}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Attendance logs history */}
            <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest">Log Archives</h3>
              
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                {history.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] font-bold text-center py-6">No historical entries.</p>
                ) : (
                  history.map(h => {
                    const presenceRate = Math.round((h.present / h.total) * 100);
                    return (
                      <div key={h.date} className="p-3 bg-[var(--bg-sub)]/35 border border-[var(--border-light)] rounded-xl flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-black text-[var(--text-main)]">{h.date}</span>
                          <span className="text-[8px] text-[var(--text-light)] font-bold block mt-0.5">
                            P: {h.present} &bull; A: {h.absent} &bull; L: {h.leave}
                          </span>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          presenceRate >= 80 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'
                        }`}>
                          {presenceRate}% Rate
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
