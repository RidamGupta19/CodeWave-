import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiClock, FiCheck, FiX, FiInfo, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Search & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/attendance/my');
      setAttendance(res.data.data);
    } catch (err) {
      console.error('Error loading student attendance:', err);
      toast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
        <div className="h-80 bg-[var(--bg-sub)]/30 rounded-2xl" />
      </div>
    );
  }

  const { total = 0, present = 0, absent = 0, leave = 0, percentage = 100, records = [] } = attendance || {};

  // Filter logs by date or status search
  const filteredRecords = records.filter(r => {
    const formattedDate = new Date(r.date).toLocaleDateString();
    return formattedDate.includes(searchQuery) || r.status.toLowerCase().includes(searchQuery.toLowerCase());
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort latest first

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusBadge = (status) => {
    if (status === 'Present') {
      return (
        <span className="px-2.5 py-1 bg-green-50 text-[var(--success)] border border-green-100 text-[10px] font-black uppercase rounded-md tracking-wider flex items-center gap-1 w-max">
          <FiCheck /> Present
        </span>
      );
    }
    if (status === 'Leave') {
      return (
        <span className="px-2.5 py-1 bg-orange-50 text-orange-500 border border-orange-100 text-[10px] font-black uppercase rounded-md tracking-wider flex items-center gap-1 w-max">
          <FiInfo /> Leave
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-red-50 text-rose-500 border border-red-100 text-[10px] font-black uppercase rounded-md tracking-wider flex items-center gap-1 w-max">
        <FiX /> Absent
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Attendance Ledger</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Review lecture presence rates, leave summaries and compliance status</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-light)]">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by date (MM/DD/YYYY) or status..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Lectures Logged</span>
          <div className="text-2xl font-black text-[var(--text-main)] mt-2">{total}</div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Presents Count</span>
          <div className="text-2xl font-black text-[var(--success)] mt-2">{present}</div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Absents Count</span>
          <div className="text-2xl font-black text-rose-500 mt-2">{absent}</div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Leaves Sanctioned</span>
          <div className="text-2xl font-black text-orange-500 mt-2">{leave}</div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center col-span-2 md:col-span-1">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)] font-bold">Attendance Rate</span>
          <div className="text-2xl font-black text-[var(--primary)] mt-2">{percentage}%</div>
        </div>
      </div>

      {/* Attendance History log Table */}
      <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[var(--border-light)]">
          <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider">Classroom Presence Logs</h3>
        </div>
        
        {records.length === 0 ? (
          <div className="p-16 text-center text-[var(--text-muted)] font-semibold">
            No classroom attendance has been marked for your batch yet.
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-16 text-center text-[var(--text-muted)] font-semibold">
            No records match your search filter.
          </div>
        ) : (
          <div className="overflow-x-auto text-xs font-semibold">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg-sub)]/50 border-b border-[var(--border-light)] text-[var(--text-muted)] font-black uppercase tracking-wider">
                  <th className="p-4">Reference Date</th>
                  <th className="p-4">Timetable Batch</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Marked By Mentor</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-main)]">
                {currentItems.map((log) => (
                  <tr key={log._id} className="border-b border-[var(--border-light)] last:border-b-0 hover:bg-[var(--bg-sub)]/10">
                    <td className="p-4">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="p-4">{log.batchId?.batchName || 'Allocated Batch'}</td>
                    <td className="p-4">{getStatusBadge(log.status)}</td>
                    <td className="p-4">{log.teacherId?.name || 'Class Mentor'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border-light)] flex justify-between items-center bg-[var(--bg-sub)]/10">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-[var(--border)] rounded-xl text-xs font-black uppercase text-[var(--text-main)] hover:bg-[var(--bg-sub)]/50 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-[var(--text-muted)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
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
