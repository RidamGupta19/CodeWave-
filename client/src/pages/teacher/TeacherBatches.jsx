import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiUsers, FiClock, FiCalendar, FiSearch, FiLayers } from 'react-icons/fi';

export default function TeacherBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/batches');
      setBatches(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedBatch(res.data.data[0]);
      }
    } catch (err) {
      toast.error('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter(b => 
    b.batchName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="h-96 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="lg:col-span-2 h-96 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">My Batches</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
          Review batch schedules, classroom rosters, and student enrollment summaries
        </p>
      </div>

      {batches.length === 0 ? (
        <div className="card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-lg font-black text-[var(--text-main)] mb-1">No Assigned Batches</h3>
          <p className="text-xs font-semibold max-w-md mx-auto">You have not been assigned to any classroom batches by the administration yet.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Batches Selection Sidebar */}
          <div className="space-y-4">
            
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-light)]">
                <FiSearch size={14} />
              </span>
              <input
                type="text"
                placeholder="Search batches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all shadow-sm"
              />
            </div>

            {/* List */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm space-y-2 h-[460px] overflow-y-auto no-scrollbar">
              <h3 className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-wider px-1 mb-2">Classroom Timetables</h3>
              
              {filteredBatches.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] font-bold text-center py-8">No matching batches.</p>
              ) : (
                filteredBatches.map(b => {
                  const isSelected = selectedBatch?._id === b._id;
                  return (
                    <button
                      key={b._id}
                      onClick={() => setSelectedBatch(b)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex justify-between items-center ${
                        isSelected 
                          ? 'bg-[var(--primary-light)]/45 border-[var(--primary)] text-[var(--primary)]' 
                          : 'bg-[var(--bg-sub)]/10 border-[var(--border-light)] text-[var(--text-main)] hover:bg-[var(--bg-sub)]/30'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-black truncate max-w-[150px]">{b.batchName}</h4>
                        <span className="text-[9px] font-bold text-[var(--text-muted)] block">⏱️ {b.timing}</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-white border border-[var(--border-light)] rounded-md">
                        {b.students?.length || 0} Students
                      </span>
                    </button>
                  );
                })
              )}
            </div>

          </div>

          {/* Active Batch Student Roster (Col-span 2) */}
          <div className="lg:col-span-2">
            {selectedBatch ? (
              <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-6">
                
                {/* Details Header */}
                <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-[var(--border-light)]">
                  <div>
                    <h2 className="text-lg font-black text-[var(--text-main)]">{selectedBatch.batchName}</h2>
                    <div className="flex flex-wrap gap-4 text-[10px] text-[var(--text-muted)] mt-1 font-bold">
                      <span className="flex items-center gap-1"><FiClock /> Daily timing: {selectedBatch.timing}</span>
                      <span className="flex items-center gap-1"><FiCalendar /> Started: {new Date(selectedBatch.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="px-3.5 py-1 bg-[var(--primary-light)]/40 border border-[var(--primary-light)] text-[var(--primary)] text-[10px] font-black uppercase rounded-full tracking-wide">
                    Active Classroom
                  </span>
                </div>

                {/* Students Roster table */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest">Enrolled Students ({selectedBatch.students?.length || 0})</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--border)] text-[var(--text-light)] font-bold">
                          <th className="py-2.5">Roll Number</th>
                          <th className="py-2.5">Student Name</th>
                          <th className="py-2.5">Email address</th>
                          <th className="py-2.5">Phone Number</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-light)] font-semibold text-[var(--text-muted)]">
                        {selectedBatch.students?.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-xs font-bold text-[var(--text-light)]">No students enrolled in this batch.</td>
                          </tr>
                        ) : (
                          selectedBatch.students.map(s => (
                            <tr key={s._id} className="hover:bg-[var(--bg-sub)]/10 transition-colors">
                              <td className="py-3 text-[var(--primary)] font-black">{s.rollNumber || 'N/A'}</td>
                              <td className="py-3 text-[var(--text-main)] font-black">{s.fullName}</td>
                              <td className="py-3">{s.email}</td>
                              <td className="py-3">{s.phone || 'N/A'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl py-20 text-center">
                <p className="text-xs text-[var(--text-muted)] font-bold">Select a batch from the list to view its student roster.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
