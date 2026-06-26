import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiLock, FiUnlock, FiCheckCircle, FiChevronRight, FiPlay, 
  FiAward, FiBookOpen, FiStar, FiActivity, FiTrendingUp, FiCheck, FiInfo 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentRoadmap() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmapData();
  }, []);

  const fetchRoadmapData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/roadmap-progress/my');
      setProgress(res.data.data);
    } catch (err) {
      console.error('Error fetching roadmap:', err);
      toast.error('Failed to load roadmap progression');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg" />
        <div className="h-44 bg-[var(--bg-sub)]/30 rounded-3xl" />
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 text-center">
        <div className="text-5xl mb-4">🚀</div>
        <h2 className="text-xl font-black text-[var(--text-main)]">No Roadmap Initialized</h2>
        <p className="text-xs text-[var(--text-muted)] font-semibold mt-1">
          Make sure your profile is complete and a course has been assigned.
        </p>
      </div>
    );
  }

  const subjectProgress = progress.subjectProgress || [];
  const assessmentStatus = progress.assessmentStatus || [];

  // Calculate overall completion percentage
  const completedSubjectsCount = subjectProgress.filter(s => s.isCompleted && s.isUnlocked).length;
  const totalSubjects = subjectProgress.length;
  const overallPercentage = totalSubjects > 0 
    ? Math.round((completedSubjectsCount / totalSubjects) * 100) 
    : 0;

  // Find next locked or active subject
  const currentActiveSubject = subjectProgress.find(s => s.isUnlocked && !s.isCompleted) || 
                               subjectProgress[subjectProgress.length - 1];

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Your Journey Roadmap</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
          Complete video lecture tracks, clear verification assessments, and unlock subjects
        </p>
      </div>

      {/* Overview Progression Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/20 rounded-3xl p-6 shadow-xl text-white">
        
        {/* Dynamic decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-cyan-300 tracking-wider bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/25">
              CodeWave Learning Journey
            </span>
            <h2 className="text-xl font-black tracking-tight mt-1">
              Overall Roadmap Progress: {overallPercentage}%
            </h2>
            <p className="text-xs text-indigo-200 font-medium">
              You have mastered <strong>{completedSubjectsCount} of {totalSubjects}</strong> syllabus modules. Keep crushing it!
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-slate-900/40 p-4 rounded-2xl border border-indigo-500/10">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <FiTrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-indigo-300">Passing Score Required</p>
              <p className="text-lg font-black text-white">{progress.passingPercentage}% or above</p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="w-full h-3 bg-slate-950/60 border border-indigo-500/15 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-500 rounded-full transition-all duration-500" 
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

      </div>

      {/* Timeline Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-widest">Syllabus Milestones</h3>

        <div className="relative border-l-2 border-[var(--border)] ml-4 pl-8 space-y-8">
          
          {subjectProgress.map((sub, idx) => {
            const isUnlocked = sub.isUnlocked;
            const isCompleted = sub.isCompleted;
            const isCurrent = isUnlocked && !isCompleted;
            const percent = sub.completionPercentage || 0;
            
            // Find assessments for this subject
            const assessments = assessmentStatus.filter(a => a.subjectName === sub.subjectName);

            return (
              <div key={idx} className="relative group">
                
                {/* Timeline node icon */}
                <div className={`absolute -left-[45px] top-0.5 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/15'
                    : isCurrent
                      ? 'bg-[var(--primary)] border-[var(--primary-dark)] text-white animate-pulse shadow-md shadow-[var(--primary)]/20'
                      : !isUnlocked
                        ? 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-light)]'
                        : 'bg-[var(--bg-card)] border-[var(--primary)] text-[var(--primary)]'
                }`}>
                  {!isUnlocked ? (
                    <FiLock size={12} />
                  ) : isCompleted ? (
                    <FiCheck size={14} className="stroke-[3]" />
                  ) : (
                    <FiPlay size={12} className="ml-0.5" />
                  )}
                </div>

                {/* Subject Block Details */}
                <div className={`card p-5 bg-[var(--bg-card)] border rounded-2xl transition-all ${
                  isCurrent 
                    ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]/10 shadow-md' 
                    : !isUnlocked 
                      ? 'border-[var(--border-light)] opacity-60' 
                      : 'border-[var(--border)] shadow-sm'
                }`}>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-[var(--text-main)] text-base">{sub.subjectName}</h4>
                        {isCompleted && (
                          <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                            Completed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] font-extrabold uppercase tracking-wider mt-1">
                        Syllabus Module {idx + 1}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Watch percentage */}
                      <div className="text-right">
                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Lectures Watch Time</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-24 h-1.5 bg-[var(--bg-sub)] rounded-full overflow-hidden border border-[var(--border-light)]">
                            <div 
                              className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-[var(--primary)]'}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-[var(--text-main)]">{percent}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assessments and Unlocking Rules */}
                  {isUnlocked && (
                    <div className="mt-4 pt-4 border-t border-[var(--border-light)] space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-wider">Module Assessments</h5>
                      
                      {assessments.length === 0 ? (
                        <p className="text-xs text-[var(--text-muted)] font-semibold flex items-center gap-1">
                          <FiInfo size={12} /> No assessments assigned to this module. Unlock next module by completing all lectures!
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {assessments.map((a, aIdx) => {
                            const isAssPassed = a.isPassed;
                            const isAssUnlocked = a.isUnlocked;
                            const assessmentName = a.assessmentId?.title || 'Phase Test';
                            const hasAttempts = a.attemptsCount > 0;

                            return (
                              <div key={aIdx} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                isAssPassed 
                                  ? 'bg-emerald-500/[0.02] border-emerald-500/20' 
                                  : !isAssUnlocked 
                                    ? 'bg-[var(--bg-sub)]/20 border-[var(--border-light)]' 
                                    : 'bg-[var(--bg-sub)]/35 border-[var(--border)]'
                              }`}>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-extrabold text-[var(--text-main)]">
                                      {assessmentName}
                                    </span>
                                    {isAssPassed ? (
                                      <span className="px-1.5 py-0.2 text-[7px] font-black uppercase rounded bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                                        Passed
                                      </span>
                                    ) : !isAssUnlocked ? (
                                      <span className="px-1.5 py-0.2 text-[7px] font-black uppercase rounded bg-rose-50 text-rose-500 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30">
                                        Locked
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.2 text-[7px] font-black uppercase rounded bg-blue-50 text-blue-500 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30">
                                        Ready
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] font-bold">
                                    <span>Platform: {a.assessmentId?.platform || 'HackerRank'}</span>
                                    {hasAttempts && (
                                      <>
                                        <span>• Attempts: {a.attemptsCount}</span>
                                        <span>• Best: {a.bestScore}%</span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  {!isAssUnlocked ? (
                                    <div className="text-[10px] text-[var(--text-muted)] font-extrabold uppercase tracking-wide bg-[var(--bg-card)] border border-[var(--border)] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                      <FiLock size={12} /> Watch lectures to 100%
                                    </div>
                                  ) : isAssPassed ? (
                                    <div className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wide bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                      <FiCheckCircle size={12} /> Passed ({a.bestScore}%)
                                    </div>
                                  ) : (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => navigate('/student/assessments')}
                                        className="btn-primary text-center px-4 py-2 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm"
                                      >
                                        <FiPlayCircle size={12} /> Start Assessment
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {!isUnlocked && (
                    <p className="mt-3 text-[10px] text-rose-500 font-extrabold flex items-center gap-1">
                      🔒 Locked: Clear the previous subject's assessment first to unlock this module.
                    </p>
                  )}

                </div>
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}
