import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiCheckSquare, FiExternalLink, FiAward, FiPlayCircle, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDomain, setActiveDomain] = useState(null);

  useEffect(() => {
    fetchAssessmentsData();
  }, []);

  const fetchAssessmentsData = async () => {
    try {
      setLoading(true);
      // Get student dashboard first to get active domain
      const dashRes = await api.get('/institute/dashboard/student');
      const domain = dashRes.data.data.student?.activeDomain;
      setActiveDomain(domain);

      if (domain && domain._id) {
        const assRes = await api.get(`/assessments/domain/${domain._id}`);
        setAssessments(assRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching assessments:', err);
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-44 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-44 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-44 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Domain Assessments</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Submit technical tests, programming quizzes and HackerRank certifications</p>
      </div>

      {!activeDomain ? (
        <div className="card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-lg font-black text-[var(--text-main)] mb-1">No Active Career Path Selected</h3>
          <p className="text-xs font-semibold max-w-md mx-auto mb-6">
            Please head to the Career forge section to choose a domain (DSA, Web Dev, DevOps, etc.) to load specialized assessments.
          </p>
        </div>
      ) : assessments.length === 0 ? (
        <div className="card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">No Assessments Active</h3>
          <p className="text-xs font-semibold">We haven't launched tests for the {activeDomain.name} path yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map(a => {
            const isCertification = a.type === 'certification';
            
            return (
              <div key={a._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5">
                <div>
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase rounded-md tracking-wider border ${
                      isCertification 
                        ? 'bg-amber-100 text-amber-600 border-amber-200' 
                        : 'bg-indigo-100 text-indigo-600 border-indigo-200'
                    }`}>
                      {a.type}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{a.platform}</span>
                  </div>

                  <h3 className="font-extrabold text-[var(--text-main)] text-base mt-4 line-clamp-1 leading-snug">{a.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] font-semibold mt-2 line-clamp-2 leading-relaxed">{a.description || 'Test validation checkpoint for concepts alignment.'}</p>

                  <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase text-[var(--text-light)] mt-4 pt-3 border-t border-[var(--border-light)]">
                    <div>Difficulty: <span className="text-orange-500 font-extrabold block mt-0.5">{a.difficultyRating}</span></div>
                    <div>Passing Score: <span className="text-[var(--text-main)] font-extrabold block mt-0.5">{a.passingScore}%</span></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-light)] flex gap-2">
                  <a
                    href={a.assessmentLink || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 btn-primary text-center py-2.5 text-xs font-black uppercase flex items-center justify-center gap-1.5"
                  >
                    <FiPlayCircle /> Launch Test
                  </a>
                  {a.hackerRankCertificationLink && (
                    <a
                      href={a.hackerRankCertificationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-500 border border-amber-200 rounded-xl transition-all"
                      title="Certification Guide"
                    >
                      <FiAward size={16} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
