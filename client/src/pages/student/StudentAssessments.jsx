import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiCheckSquare, FiExternalLink, FiAward, FiPlayCircle, FiShield, FiLock, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDomain, setActiveDomain] = useState(null);
  const [launchingId, setLaunchingId] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [submittingId, setSubmittingId] = useState(null);
  const [scoresInput, setScoresInput] = useState({});

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

  const handleScoreChange = (id, val) => {
    setScoresInput(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmitScore = async (assessmentId, customScore) => {
    if (submittingId) return;

    let scoreVal;
    if (customScore !== undefined) {
      scoreVal = customScore;
    } else {
      const inputVal = scoresInput[assessmentId];
      if (!inputVal || inputVal.trim() === '') {
        toast.error("Please enter a score.");
        return;
      }
      scoreVal = parseInt(inputVal);
    }

    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      toast.error("Please enter a valid score between 0 and 100.");
      return;
    }

    try {
      setSubmittingId(assessmentId);
      const res = await api.post('/roadmap-progress/submit-attempt', {
        assessmentId,
        score: scoreVal
      });

      if (res.data.passed) {
        toast.success(`Passed! Score: ${scoreVal}% 🎉 Next module unlocked!`);
      } else {
        toast.error(`Attempt logged. Score: ${scoreVal}%. CodeWave progression requires 70% to unlock next modules. Try again!`);
      }
      
      // Reset input value
      setScoresInput(prev => ({ ...prev, [assessmentId]: '' }));
      await fetchAssessmentsData();
    } catch (err) {
      console.error('Submission error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit result');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleSimulatePass = async (assessment) => {
    const minPassing = 70; // CodeWave passing threshold
    const randomPassedScore = Math.floor(Math.random() * (100 - minPassing + 1)) + minPassing;
    await handleSubmitScore(assessment._id, randomPassedScore);
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
            const isPassed = a.isPassed;
            const isUnlocked = a.isUnlocked !== false; // Default to true if not defined
            const hasAttempts = a.attemptsCount > 0;
            
            return (
              <div key={a._id} className={`card p-6 bg-[var(--bg-card)] border rounded-2xl shadow-sm transition-all flex flex-col justify-between gap-5 relative ${
                isPassed 
                  ? 'border-emerald-500/30 dark:border-emerald-950/40 ring-1 ring-emerald-500/10 bg-emerald-500/[0.01]' 
                  : !isUnlocked 
                    ? 'border-[var(--border-light)] opacity-65 bg-[var(--bg-sub)]/10' 
                    : 'border-[var(--border)]'
              }`}>
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase rounded-md tracking-wider border ${
                        isCertification 
                          ? 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30' 
                          : 'bg-indigo-100 text-indigo-600 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30'
                      }`}>
                        {a.type}
                      </span>
                      {a.subject && (
                        <span className="px-2.5 py-0.5 text-[8px] font-black uppercase rounded-md tracking-wider border bg-[var(--bg-sub)] text-[var(--text-muted)] border-[var(--border)]">
                          {a.subject}
                        </span>
                      )}
                    </div>
                    {isPassed ? (
                      <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded-md tracking-wider bg-emerald-100 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-900/30 flex items-center gap-0.5">
                        ✓ Passed
                      </span>
                    ) : !isUnlocked ? (
                      <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded-md tracking-wider bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-950/25 dark:text-rose-400 dark:border-rose-900/30 flex items-center gap-0.5">
                        <FiLock size={8} /> Locked
                      </span>
                    ) : hasAttempts ? (
                      <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded-md tracking-wider bg-orange-100 text-orange-600 border border-orange-200 dark:bg-orange-950/25 dark:text-orange-400 dark:border-orange-900/30">
                        Incomplete
                      </span>
                    ) : (
                      <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{a.platform}</span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-[var(--text-main)] text-base mt-4 line-clamp-1 leading-snug">{a.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] font-semibold mt-2 line-clamp-2 leading-relaxed">{a.description || 'Test validation checkpoint for concepts alignment.'}</p>

                  <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase text-[var(--text-light)] mt-4 pt-3 border-t border-[var(--border-light)]">
                    <div>Difficulty: <span className="text-orange-500 font-extrabold block mt-0.5">{a.difficultyRating}</span></div>
                    <div>Passing Score: <span className="text-[var(--text-main)] font-extrabold block mt-0.5">70%</span></div>
                  </div>
                  
                  {isUnlocked && hasAttempts && (
                    <div className="mt-3 text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-sub)] p-2 rounded-lg border border-[var(--border-light)] flex justify-between items-center">
                      <span>Total Attempts: {a.attemptsCount}</span>
                      <span>Best Score: <strong className="text-[var(--text-main)]">{a.bestScore}%</strong></span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--border-light)] space-y-3">
                  {!isUnlocked ? (
                    <div className="text-center p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex items-start gap-2 text-left">
                      <FiLock className="text-rose-500 mt-0.5 shrink-0" size={14} />
                      <div>
                        <p className="text-[10px] font-black uppercase text-rose-500 leading-none">Locked Module</p>
                        <p className="text-[9px] text-[var(--text-muted)] mt-1 font-medium leading-tight">
                          You must complete 100% of the video lectures for the <strong>"{a.subject || 'corresponding subject'}"</strong> module to unlock this assessment.
                        </p>
                      </div>
                    </div>
                  ) : isPassed ? (
                    <div className="flex gap-2">
                      <button
                        disabled
                        className="flex-1 py-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-default"
                      >
                        <FiCheckSquare /> Verified Passed ({a.bestScore}%)
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
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
                          className="px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          title="Simulate Passing Test"
                        >
                          {submittingId === a._id ? '...' : 'Dev: Pass'}
                        </button>
                      </div>

                      {/* Manual score submission input group */}
                      <div className="bg-[var(--bg-sub)]/35 p-3.5 rounded-xl border border-[var(--border-light)] space-y-2">
                        <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider block">
                          Submit Assessment Results
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Enter score (0-100)"
                            value={scoresInput[a._id] || ''}
                            onChange={(e) => handleScoreChange(a._id, e.target.value)}
                            disabled={submittingId !== null}
                            className="flex-1 px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                            min="0"
                            max="100"
                          />
                          <button
                            onClick={() => handleSubmitScore(a._id)}
                            disabled={submittingId !== null}
                            className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-black uppercase rounded-xl transition-all disabled:opacity-50 shrink-0"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {a.hackerRankCertificationLink && (
                    <a
                      href={a.hackerRankCertificationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-500 border border-amber-200 dark:bg-amber-950/25 dark:text-amber-400 dark:border-amber-900/30 rounded-xl transition-all flex justify-center items-center"
                      title="Certification Guide"
                    >
                      <FiAward size={16} className="mr-1" />
                      <span className="text-[10px] font-black uppercase tracking-wider">HackerRank Certification Prep</span>
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
