import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiCheckSquare, FiSearch, FiLayers, FiAlertCircle, FiAward } from 'react-icons/fi';

export default function TeacherAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const [assRes, domRes] = await Promise.all([
        api.get('/assessments'), // Get generic assessments
        api.get('/domains')
      ]);
      setAssessments(assRes.data.data);
      setDomains(domRes.data.data);
    } catch (err) {
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const filtered = assessments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (a.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = domainFilter === 'all' || (a.domainId?._id === domainFilter || a.domainId === domainFilter);
    return matchesSearch && matchesDomain;
  });

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
        <h1 className="text-2xl font-black text-[var(--text-main)]">Phase Assessments</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
          Review checkpoint assessments, HackerRank validation links, and minimum passing criteria
        </p>
      </div>

      {/* Filter strip */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
        
        {/* Domain Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest shrink-0">Filter Domain:</span>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3 py-2 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
          >
            <option value="all">All Domains</option>
            {domains.map(d => (
              <option key={d._id} value={d._id}>{d.name}</option>
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
            placeholder="Search assessment name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all shadow-sm"
          />
        </div>

      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">No Assessments Found</h3>
            <p className="text-xs font-semibold">No certification checkpoints match your query.</p>
          </div>
        ) : (
          filtered.map(a => (
            <div key={a._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5">
              <div>
                <div className="flex justify-between items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase rounded border ${
                    a.difficultyRating === 'beginner' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    a.difficultyRating === 'intermediate' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                    'bg-rose-50 text-rose-500 border-rose-100'
                  }`}>
                    {a.difficultyRating}
                  </span>
                  <span className="text-[9px] font-bold text-[var(--text-light)]">
                    Pass criteria: {a.passingScore}%
                  </span>
                </div>

                <h3 className="font-extrabold text-[var(--text-main)] text-base mt-4 line-clamp-2 leading-snug">{a.title}</h3>
                <p className="text-xs text-[var(--text-muted)] font-semibold mt-2 line-clamp-2 leading-relaxed">{a.description || 'Phase validation challenge.'}</p>
                
                <div className="space-y-1.5 text-[10px] text-[var(--text-muted)] font-bold mt-4 pt-3 border-t border-[var(--border-light)]">
                  <div className="flex justify-between"><span className="text-[var(--text-light)]">Platform:</span> <span className="text-[var(--text-main)]">💻 {a.platform}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-light)]">Max attempts:</span> <span className="text-[var(--text-main)]">{a.maxAttempts} times</span></div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-light)]">
                <a
                  href={a.assessmentLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-center py-2 bg-indigo-50 border border-indigo-100 text-[var(--primary)] text-[10px] font-black uppercase rounded-lg hover:bg-indigo-100 transition-all flex items-center justify-center gap-1"
                >
                  <FiAward /> Check HackerRank Link
                </a>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
