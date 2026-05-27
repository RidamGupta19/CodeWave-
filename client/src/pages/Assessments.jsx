import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiAward, FiExternalLink, FiLock, FiCheckCircle, FiXCircle, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Assessments = () => {
  const { user, refreshUser } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingScore, setSubmittingScore] = useState(null);

  const getProgressKey = (slug) => {
    if (!slug) return 'dsa';
    const lowercaseSlug = slug.toLowerCase();
    if (lowercaseSlug === 'web-development' || lowercaseSlug === 'webdev') return 'webdev';
    if (lowercaseSlug === 'open-source' || lowercaseSlug === 'opensource') return 'opensource';
    if (lowercaseSlug === 'devops') return 'devops';
    if (lowercaseSlug === 'dsa') return 'dsa';
    return 'dsa';
  };

  const activeDomainSlug = user?.activeDomain?.slug || user?.selectedDomain?.slug || 'dsa';
  const activeDomainKey = getProgressKey(activeDomainSlug);
  const activeDomainProgress = user?.domainsProgress?.[activeDomainKey] || {
    xp: 0,
    currentPhase: 1,
    overallProgress: 0,
    completedTopics: [],
    testResults: []
  };

  useEffect(() => {
    if (user?.selectedDomain) {
      fetchAssessments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAssessments = async () => {
    try {
      const res = await api.get(`/assessments/domain/${user.selectedDomain._id || user.selectedDomain}`);
      setAssessments(res.data.data);
    } catch (err) {
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePass = async (assessment) => {
    setSubmittingScore(assessment._id);
    try {
      const score = Math.floor(Math.random() * (100 - assessment.passingScore + 1)) + assessment.passingScore;
      
      await api.post('/progress/submit-assessment', {
        assessmentId: assessment._id,
        score,
        passed: true
      });
      
      await refreshUser();
      toast.success(`Passed! Score: ${score}% 🎉`);
    } catch (err) {
      toast.error('Failed to submit result');
    } finally {
      setSubmittingScore(null);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><div className="spinner"></div></div>;
  if (!user.selectedDomain) return <div className="text-center py-24 text-[#667085] font-medium">Please select a domain to view assessments.</div>;

  return (
    <div className="fade-in max-w-7xl mx-auto py-10 px-6 lg:px-8">
      <div className="mb-12">
        <div className="badge badge-blue mb-4 py-1.5 px-4 font-bold">Skill Validation</div>
        <h1 className="text-4xl font-extrabold text-[#101828] dark:text-slate-100 tracking-tight mb-4 flex items-center gap-4">
          Certifications & Tests
        </h1>
        <p className="text-[#667085] dark:text-slate-400 text-lg font-medium max-w-2xl">
          Validate your technical skills through platform-vetted assessments and earn badges to verify your mastery.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {assessments.map((assessment) => {
          const phaseNum = assessment.phaseId?.phaseNumber || assessment.order;
          // Unlocked if user has completed the level OR is on a higher level
          const isUnlocked = activeDomainProgress.currentPhase > phaseNum || assessment.isLevelCompleted;
          const result = activeDomainProgress.testResults?.find(t => t.assessmentId === assessment._id || t.assessmentId?._id === assessment._id);
          const isPassed = result?.passed;

          return (
            <div key={assessment._id} className={`card p-8 relative overflow-hidden transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col ${
              isPassed ? 'ring-1 ring-emerald-100 dark:ring-emerald-950 shadow-md' : 
              !isUnlocked ? 'opacity-70 grayscale bg-[#fcfcfd] dark:bg-slate-950' : 'hover:border-indigo-200 dark:hover:border-indigo-900'
            }`}>
              {isPassed && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5">
                  <FiCheckCircle className="text-sm" /> Passed: {result.score}%
                </div>
              )}
              
              {!isUnlocked && !isPassed && (
                <div className="absolute top-0 right-0 bg-[#f2f4f7] dark:bg-slate-800 text-[#98a2b3] dark:text-slate-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5">
                  <FiLock className="text-sm" /> Locked Phase {phaseNum}
                </div>
              )}

              <div className="flex items-start gap-5 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border ${
                  isPassed ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900 text-emerald-600' : 
                  'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900 text-[#4361ee]'
                }`}>
                  {assessment.platform === 'HackerRank' ? 'H' : <FiAward />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#101828] dark:text-slate-100 tracking-tight mb-2 line-clamp-1">{assessment.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="badge badge-gray bg-[#f2f4f7] dark:bg-slate-800 text-[#344054] dark:text-slate-300 py-0.5 px-2.5 font-bold text-[10px] uppercase tracking-wider">{assessment.platform}</div>
                    <div className="badge badge-blue py-0.5 px-2.5 font-bold text-[10px] uppercase tracking-wider">{assessment.difficultyRating}</div>
                    <div className="text-[10px] font-bold text-[#98a2b3] dark:text-slate-500 uppercase tracking-widest flex items-center ml-1">Req: {assessment.passingScore}%</div>
                  </div>
                </div>
              </div>
              
              <p className="text-[#667085] dark:text-slate-400 text-sm leading-relaxed mb-4 h-12 line-clamp-2">
                {assessment.description || `Complete this comprehensive assessment to validate your mastery of Phase ${phaseNum} concepts.`}
              </p>

              <div className="mb-6 flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span>Level Progress:</span>
                <span className="text-[#4361ee] dark:text-[#818cf8] font-black">
                  {assessment.completedTopicsCount || 0} / {assessment.totalTopics || 0} topics completed
                </span>
              </div>

              <div className="flex items-center gap-3 mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/80">
                {isPassed ? (
                  <button disabled className="w-full py-3 rounded-xl font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 cursor-default flex items-center justify-center gap-2">
                    Verified Mastery <FiCheckCircle />
                  </button>
                ) : isUnlocked ? (
                  <>
                    <a 
                      href={assessment.assessmentLink === 'ADMIN_WILL_ADD_HACKERRANK_ASSESSMENT_LINK' ? 'https://www.hackerrank.com/skills-verification' : assessment.assessmentLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary flex-1 py-3 text-sm font-bold shadow-sm"
                    >
                      Take Assessment <FiExternalLink className="ml-1" />
                    </a>
                    <button 
                      onClick={() => handleSimulatePass(assessment)}
                      disabled={submittingScore === assessment._id}
                      className="btn-secondary py-3 px-4 text-[10px] font-black uppercase tracking-widest border-[#eaecf0] dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all cursor-pointer"
                      title="For MVP demo: Simulate passing score"
                    >
                      {submittingScore === assessment._id ? '...' : 'Dev: Pass'}
                    </button>
                  </>
                ) : (
                  <button disabled className="w-full py-3 rounded-xl font-bold bg-[#f9fafb] dark:bg-slate-950 text-[#98a2b3] dark:text-slate-600 border border-[#f2f4f7] dark:border-slate-800 cursor-not-allowed flex items-center justify-center gap-2">
                    Unlock Phase {phaseNum} <FiLock className="text-sm" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Assessments;
