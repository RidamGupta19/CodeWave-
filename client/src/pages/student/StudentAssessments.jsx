import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiCheckSquare, FiExternalLink, FiAward, FiPlayCircle, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDomain, setActiveDomain] = useState(null);
  const [launchingId, setLaunchingId] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [submittingId, setSubmittingId] = useState(null);

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
        const [assRes, progRes] = await Promise.all([
          api.get(`/assessments/domain/${domain._id}`),
          api.get('/progress/dashboard')
        ]);
        setAssessments(assRes.data.data);
        
        const progressKey = domain.slug === 'web-development' || domain.slug === 'webdev' ? 'webdev' : (domain.slug === 'opensource' || domain.slug === 'open-source' ? 'opensource' : (domain.slug === 'devops' ? 'devops' : 'dsa'));
        const userProgress = progRes.data.data?.user?.domainsProgress?.[progressKey] || {};
        setTestResults(userProgress.testResults || []);
      }
    } catch (err) {
      console.error('Error fetching assessments:', err);
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async (assessmentId) => {
    if (launchingId) return;
    try {
      setLaunchingId(assessmentId);
      const res = await api.get(`/assessments/${assessmentId}/launch`);
      if (res.data?.success && res.data?.data?.assessmentLink) {
        window.open(res.data.data.assessmentLink, '_blank', 'noopener,noreferrer');
      } else {
        toast.error('Failed to get launch link.');
      }
    } catch (err) {
      console.error('Launch error:', err);
      const errMsg = err.response?.data?.message || 'Failed to launch assessment. Please try again.';
      toast.error(errMsg);
    } finally {
      setLaunchingId(null);
    }
  };

  const handleSimulatePass = async (assessment) => {
    if (submittingId) return;
    try {
      setSubmittingId(assessment._id);
      const score = Math.floor(Math.random() * (100 - assessment.passingScore + 1)) + assessment.passingScore;
      
      await api.post('/progress/submit-assessment', {
        assessmentId: assessment._id,
        score,
        passed: true
      });
      
      toast.success(`Passed! Score: ${score}% 🎉`);
      await fetchAssessmentsData();
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Failed to submit result');
    } finally {
      setSubmittingId(null);
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
            const result = testResults.find(t => t.assessmentId === a._id || t.assessmentId?._id === a._id);
            const isPassed = result?.passed;
            
            return (
              <div key={a._id} className={`card p-6 bg-[var(--bg-card)] border rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 ${
                isPassed ? 'border-emerald-200 dark:border-emerald-950/40 ring-1 ring-emerald-500/10' : 'border-[var(--border)]'
              }`}>
                <div>
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase rounded-md tracking-wider border ${
                      isCertification 
                        ? 'bg-amber-100 text-amber-600 border-amber-200' 
                        : 'bg-indigo-100 text-indigo-600 border-indigo-200'
                    }`}>
                      {a.type}
                    </span>
                    {isPassed ? (
                      <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded-md tracking-wider bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center gap-0.5">
                        ✓ Passed
                      </span>
                    ) : (
                      <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{a.platform}</span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-[var(--text-main)] text-base mt-4 line-clamp-1 leading-snug">{a.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] font-semibold mt-2 line-clamp-2 leading-relaxed">{a.description || 'Test validation checkpoint for concepts alignment.'}</p>

                  <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase text-[var(--text-light)] mt-4 pt-3 border-t border-[var(--border-light)]">
                    <div>Difficulty: <span className="text-orange-500 font-extrabold block mt-0.5">{a.difficultyRating}</span></div>
                    <div>Passing Score: <span className="text-[var(--text-main)] font-extrabold block mt-0.5">{a.passingScore}%</span></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-light)] flex gap-2">
                  {isPassed ? (
                    <button
                      disabled
                      className="flex-1 py-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-default"
                    >
                      <FiCheckSquare /> Verified Passed ({result.score}%)
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleLaunch(a._id)}
                        disabled={launchingId !== null || submittingId !== null}
                        className="flex-1 btn-primary text-center py-2.5 text-xs font-black uppercase flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {launchingId === a._id ? (
                          <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-1"></span>
                        ) : (
                          <FiPlayCircle />
                        )}
                        {launchingId === a._id ? 'Launching...' : 'Start Assessment'}
                      </button>
                      <button
                        onClick={() => handleSimulatePass(a)}
                        disabled={launchingId !== null || submittingId !== null}
                        className="px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        title="Simulate Passing Test"
                      >
                        {submittingId === a._id ? '...' : 'Dev: Pass'}
                      </button>
                    </>
                  )}
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
