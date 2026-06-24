import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiUsers, FiSearch, FiBookOpen } from 'react-icons/fi';

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stuRes, batRes] = await Promise.all([
        api.get('/institute/students'),
        api.get('/institute/batches')
      ]);
      setStudents(stuRes.data.data);
      setBatches(batRes.data.data);
    } catch (err) {
      toast.error('Failed to load student profiles');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.rollNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = selectedBatchFilter === 'all' || (s.batch?._id === selectedBatchFilter);
    return matchesSearch && matchesBatch;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg" />
        <div className="h-12 bg-[var(--bg-sub)]/30 rounded-xl" />
        <div className="h-64 bg-[var(--bg-sub)]/30 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Student Directory</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
          Monitor enrolled student credentials, batch alignments, and active statuses
        </p>
      </div>

      {/* Filters strip */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
        
        {/* Batch Filter Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest shrink-0">Filter Batch:</span>
          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className="px-3 py-2 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
          >
            <option value="all">All Assigned Batches</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>{b.batchName}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-light)]">
            <FiSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search roll number, name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
          />
        </div>

      </div>

      {/* Directory Table */}
      <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-sub)]/10 text-[var(--text-light)] font-bold">
                <th className="p-4">Roll Number</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Assigned Batch</th>
                <th className="p-4">Course</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)] font-semibold text-[var(--text-muted)]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-xs font-bold text-[var(--text-light)]">No student profiles found.</td>
                </tr>
              ) : (
                filteredStudents.map(s => (
                  <tr key={s._id} className="hover:bg-[var(--bg-sub)]/10 transition-colors">
                    <td className="p-4 text-[var(--primary)] font-black">{s.rollNumber || 'N/A'}</td>
                    <td className="p-4 text-[var(--text-main)] font-black">{s.fullName}</td>
                    <td className="p-4">{s.email}</td>
                    <td className="p-4">{s.phone || 'N/A'}</td>
                    <td className="p-4 text-[var(--text-main)]">{s.batch?.batchName || 'General Roster'}</td>
                    <td className="p-4">{s.course?.courseName || 'Unassigned'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase rounded border ${
                        s.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' 
                          : 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
