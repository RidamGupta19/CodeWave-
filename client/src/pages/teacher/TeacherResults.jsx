import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiAward, FiSearch, FiCheckCircle } from 'react-icons/fi';

export default function TeacherResults() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/results/teacher');
      setStudents(res.data.data);
    } catch (err) {
      toast.error('Failed to load student results');
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(s =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.rollNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg" />
        <div className="h-64 bg-[var(--bg-sub)]/30 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Student Assessment Results</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
          Review student HackerRank scores, certification attempts, and pass/fail logs
        </p>
      </div>

      {/* Control strip */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
        <div className="text-xs font-black uppercase text-[var(--text-light)] tracking-wider">
          Student Grades Directory ({filtered.length})
        </div>
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-light)]">
            <FiSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search student roll number or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Results Log Table */}
      <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-sub)]/10 text-[var(--text-light)] font-bold">
                <th className="p-4">Roll Number</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Batch</th>
                <th className="p-4">Assessments Taken</th>
                <th className="p-4">Latest Score</th>
                <th className="p-4">Passing Status</th>
                <th className="p-4">Attempts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)] font-semibold text-[var(--text-muted)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-xs font-bold text-[var(--text-light)]">No student records found.</td>
                </tr>
              ) : (
                filtered.map(s => {
                  const userRecord = s.userId || {};
                  const resultsList = userRecord.testResults || [];
                  const latestResult = resultsList[resultsList.length - 1];

                  return (
                    <tr key={s._id} className="hover:bg-[var(--bg-sub)]/10 transition-colors">
                      <td className="p-4 text-[var(--primary)] font-black">{s.rollNumber || 'N/A'}</td>
                      <td className="p-4 text-[var(--text-main)] font-black">
                        <div>{s.fullName}</div>
                        <span className="text-[9px] text-[var(--text-light)] font-bold block mt-0.5">{s.email}</span>
                      </td>
                      <td className="p-4">{s.batch?.batchName || 'General'}</td>
                      <td className="p-4 font-black">{resultsList.length} completed</td>
                      <td className="p-4 text-[var(--text-main)] font-black text-sm">
                        {latestResult ? `${latestResult.score}%` : 'N/A'}
                      </td>
                      <td className="p-4">
                        {latestResult ? (
                          <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded border ${
                            latestResult.passed
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10'
                              : 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-500/10'
                          }`}>
                            {latestResult.passed ? 'PASSED ✅' : 'FAILED ❌'}
                          </span>
                        ) : (
                          <span className="text-[9px] text-[var(--text-light)]">No attempts</span>
                        )}
                      </td>
                      <td className="p-4">
                        {latestResult ? `${latestResult.attemptNumber} attempt(s)` : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
