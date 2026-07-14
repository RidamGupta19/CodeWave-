import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiBriefcase, FiMapPin, FiDollarSign, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/job-board/jobs');
      setJobs(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load job listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (title, company) => {
    toast.success(`Successfully applied for ${title} at ${company}!`);
  };

  // Filter listings based on search text
  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.company.toLowerCase().includes(search.toLowerCase()) || 
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center text-9xl pointer-events-none pr-8">
          💼
        </div>
        <div className="relative z-10 space-y-4 max-w-xl text-left">
          <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-3.5 py-1.5 rounded-full border border-white/10">Opportunities</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1">CodeWave Job Board</h1>
          <p className="text-sm text-cyan-100 font-semibold leading-relaxed">
            Discover curated job postings from partnered startups and tech leaders. Apply directly with your authenticated CodeWave developer credentials.
          </p>
        </div>
      </div>

      {/* Search Header */}
      <div className="flex bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm items-center gap-3 max-w-md text-left">
        <FiSearch className="text-[var(--text-light)] text-lg" />
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs by title, company, or keywords..."
          className="w-full bg-transparent outline-none border-none text-xs font-semibold text-[var(--text-main)] placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4 text-left">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)]">No jobs matching your search criteria.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((j) => (
              <div key={j.id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--primary)] rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-extrabold text-[var(--text-main)] text-sm group-hover:text-[var(--primary)] transition-colors">{j.title}</h4>
                    <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-wider mt-0.5">{j.company}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-[var(--text-muted)]">
                    <div className="flex items-center gap-1 text-[var(--text-light)]">
                      <FiMapPin /> {j.location}
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-450 font-black">
                      <FiDollarSign /> {j.salary}
                    </div>
                    <div className="flex items-center gap-1 text-indigo-500 font-extrabold">
                      <FiBriefcase /> {j.type}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border-light)] flex gap-3">
                  <button 
                    onClick={() => handleApply(j.title, j.company)}
                    className="flex-1 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md shadow-[var(--primary)]/10 hover:-translate-y-0.5 transition-all cursor-pointer text-center"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
