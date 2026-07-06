import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiLock, FiUnlock, FiCheckCircle, FiChevronRight, FiPlay, 
  FiAward, FiBookOpen, FiStar, FiActivity, FiTrendingUp, FiCheck, FiInfo,
  FiPlayCircle, FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentRoadmap() {
  const [progress, setProgress] = useState(null);
  const [levelRoadmap, setLevelRoadmap] = useState(null);

  const [activeTab, setActiveTab] = useState('syllabus'); // 'syllabus' or 'levels'

  const [loading, setLoading] = useState(true);
  const [expandedLevels, setExpandedLevels] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmapData();
  }, []);

  const fetchRoadmapData = async () => {
    try {
      setLoading(true);
      const [resProgress, resRoadmap] = await Promise.allSettled([
        api.get('/roadmap-progress/my'),
        api.get('/roadmap/me')
      ]);

      if (resProgress.status === 'fulfilled') {
        setProgress(resProgress.value.data.data);
      }
      if (resRoadmap.status === 'fulfilled') {
        setLevelRoadmap(resRoadmap.value.data.data);
        
        // Auto-expand unlocked levels
        const roadmapData = resRoadmap.value.data.data;
        if (roadmapData && roadmapData.customRoadmapConfig) {
          const initialExpanded = {};
          roadmapData.customRoadmapConfig.forEach(lvl => {
            initialExpanded[lvl.levelNumber] = !lvl.isLocked;
          });
          setExpandedLevels(initialExpanded);
        }
      }
    } catch (err) {
      console.error('Error fetching roadmap:', err);
      toast.error('Failed to load roadmap progression');
    } finally {
      setLoading(false);
    }
  };

  const toggleLevelExpand = (levelNumber) => {
    setExpandedLevels(prev => ({
      ...prev,
      [levelNumber]: !prev[levelNumber]
    }));
  };

  const handleContinueLearning = () => {
    if (!levelRoadmap || !levelRoadmap.customRoadmapConfig) return;

    // Find first unlocked level that has incomplete items
    const watchedSet = new Set((levelRoadmap.watchedVideos || []).map(id => id.toString()));
    const completedSet = new Set((levelRoadmap.completedAssessments || []).map(id => id.toString()));

    const activeLevel = levelRoadmap.customRoadmapConfig.find(lvl => {
      if (lvl.isLocked) return false;
      const incompleteVideo = lvl.videos.some(v => !watchedSet.has((v._id || v).toString()));
      const incompleteAss = lvl.assessments.some(a => !completedSet.has((a._id || a).toString()));
      return incompleteVideo || incompleteAss;
    });

    if (!activeLevel) {
      toast.success('Congratulations! You completed all unlocked roadmap targets.');
      return;
    }

    // Go to video lectures or assessments
    const hasIncompleteVideo = activeLevel.videos.some(v => !watchedSet.has((v._id || v).toString()));
    if (hasIncompleteVideo) {
      navigate('/student/video-lectures');
    } else {
      navigate('/student/assessments');
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
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Milestones Data Definitions
  // ----------------------------------------------------
  const subjectProgress = progress?.subjectProgress || [];
  const assessmentStatus = progress?.assessmentStatus || [];
  const completedSubjectsCount = subjectProgress.filter(s => s.isCompleted && s.isUnlocked).length;
  const totalSubjects = subjectProgress.length;
  const overallPercentage = totalSubjects > 0 
    ? Math.round((completedSubjectsCount / totalSubjects) * 100) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header with Switch Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)] font-display">Your Journey Roadmap</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
            Track milestones, unlock new levels, and customize your path
          </p>
        </div>

        <div className="flex border border-[var(--border)] rounded-xl p-1 bg-[var(--bg-card)] shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
              activeTab === 'syllabus'
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Syllabus Milestones
          </button>
          <button
            onClick={() => setActiveTab('levels')}
            className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
              activeTab === 'levels'
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Level Progress
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: SYLLABUS MILESTONES (ORIGINAL VIEW) */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'syllabus' && (
        <div className="space-y-8">
          {!progress ? (
            <div className="max-w-7xl mx-auto py-12 px-4 text-center card bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-lg font-black text-[var(--text-main)] font-display">No Syllabus Assigned</h2>
              <p className="text-xs text-[var(--text-muted)] font-semibold mt-1">
                Make sure your profile is complete and an instructor has assigned you to a course.
              </p>
            </div>
          ) : (
            <>
              {/* Overview Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/20 rounded-3xl p-6 shadow-xl text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-cyan-300 tracking-wider bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/25">
                      Syllabus Tracker
                    </span>
                    <h2 className="text-xl font-black tracking-tight mt-1 font-display">
                      Overall Milestones cleared: {overallPercentage}%
                    </h2>
                    <p className="text-xs text-indigo-200 font-medium font-sans">
                      You have mastered <strong>{completedSubjectsCount} of {totalSubjects}</strong> syllabus modules.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 bg-slate-900/40 p-4 rounded-2xl border border-indigo-500/10">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                      <FiTrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-indigo-300">Passing Score</p>
                      <p className="text-lg font-black text-white">{progress.passingPercentage}%</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="w-full h-3 bg-slate-950/60 border border-indigo-500/15 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-500 rounded-full transition-all duration-500" 
                      style={{ width: `${overallPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline List */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-widest">Syllabus Milestones</h3>
                <div className="relative border-l-2 border-[var(--border)] ml-4 pl-8 space-y-8">
                  {subjectProgress.map((sub, idx) => {
                    const isUnlocked = sub.isUnlocked;
                    const isCompleted = sub.isCompleted;
                    const isCurrent = isUnlocked && !isCompleted;
                    const percent = sub.completionPercentage || 0;
                    const assessments = assessmentStatus.filter(a => a.subjectName === sub.subjectName);

                    return (
                      <div key={idx} className="relative group">
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
                                            <span className="text-xs font-extrabold text-[var(--text-main)]">{assessmentName}</span>
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
                                                <span>• Best Score: {a.bestScore}%</span>
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
                                            <button
                                              onClick={() => navigate('/student/assessments')}
                                              className="btn-primary text-center px-4 py-2 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm"
                                            >
                                              <FiPlayCircle size={12} /> Start Test
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {!isUnlocked && (
                              <p className="mt-3 text-[10px] text-rose-500 font-extrabold flex items-center gap-1 pl-4">
                                🔒 Locked: Clear the previous subject's assessment first to unlock this module.
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: LEVEL PROGRESS TIMELINE (NEW VIEW) */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'levels' && (
        <div className="space-y-8">
          {!levelRoadmap ? (
            <div className="max-w-7xl mx-auto py-12 px-4 text-center card bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-lg font-black text-[var(--text-main)] font-display">No Custom Roadmap Assigned</h2>
              <p className="text-xs text-[var(--text-muted)] font-semibold mt-1">
                Your instructor has not configured a level-based customizable roadmap for you yet.
              </p>
            </div>
          ) : (
            <>
              {/* Level Progress Banner */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/20 rounded-3xl p-6 shadow-xl text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-cyan-300 tracking-wider bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/25">
                      Level Roadmap Track
                    </span>
                    <h2 className="text-xl font-black tracking-tight mt-1 font-display">
                      Roadmap Completion: {levelRoadmap.roadmapProgress}%
                    </h2>
                    <p className="text-xs text-indigo-200 font-medium">
                      You are currently learning on <strong>Level {levelRoadmap.currentLevel}</strong>. Maintain consistency to unlock remaining targets!
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleContinueLearning}
                      className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg"
                    >
                      <FiPlayCircle size={14} className="stroke-[3]" /> Continue Learning
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="w-full h-3 bg-slate-950/60 border border-indigo-500/15 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-500 rounded-full transition-all duration-500" 
                      style={{ width: `${levelRoadmap.roadmapProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Levels Timeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-widest">Roadmap Levels</h3>
                
                <div className="relative border-l-2 border-[var(--border)] ml-4 pl-8 space-y-6">
                  {levelRoadmap.customRoadmapConfig.map((lvl, index) => {
                    const isLvlUnlocked = !lvl.isLocked;
                    const isLvlCompleted = levelRoadmap.completedLevels.includes(lvl.levelNumber);
                    const isLvlActive = isLvlUnlocked && !isLvlCompleted;
                    const isExpanded = !!expandedLevels[lvl.levelNumber];

                    const watchedSet = new Set((levelRoadmap.watchedVideos || []).map(id => id.toString()));
                    const completedSet = new Set((levelRoadmap.completedAssessments || []).map(id => id.toString()));

                    return (
                      <div key={index} className="relative group">
                        
                        {/* Level timeline node */}
                        <div 
                          onClick={() => toggleLevelExpand(lvl.levelNumber)}
                          className={`absolute -left-[45px] top-0.5 w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                            isLvlCompleted
                              ? 'bg-emerald-500 border-emerald-400 text-white'
                              : isLvlActive
                                ? 'bg-[var(--primary)] border-[var(--primary-dark)] text-white shadow-md shadow-[var(--primary)]/20'
                                : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-light)]'
                          }`}
                        >
                          {!isLvlUnlocked ? (
                            <FiLock size={12} />
                          ) : isLvlCompleted ? (
                            <FiCheck size={14} className="stroke-[3]" />
                          ) : (
                            <FiUnlock size={12} />
                          )}
                        </div>

                        <div className={`card p-5 bg-[var(--bg-card)] border rounded-2xl transition-all ${
                          isLvlActive
                            ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]/10 shadow-md'
                            : !isLvlUnlocked
                              ? 'border-[var(--border-light)] opacity-60'
                              : 'border-[var(--border)] shadow-sm'
                        }`}>
                          
                          <div 
                            onClick={() => toggleLevelExpand(lvl.levelNumber)}
                            className="flex justify-between items-center cursor-pointer select-none"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-sm text-[var(--text-main)]">{lvl.name}</h4>
                                {isLvlCompleted && (
                                  <span className="px-2 py-0.2 text-[8px] font-black uppercase tracking-wider rounded bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                                    Level Completed
                                  </span>
                                )}
                                {isLvlActive && (
                                  <span className="px-2 py-0.2 text-[8px] font-black uppercase tracking-wider rounded bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 animate-pulse">
                                    In Progress
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-[var(--text-muted)] font-semibold">{lvl.description}</p>
                            </div>
                            <FiChevronRight 
                              size={16} 
                              className={`text-[var(--text-muted)] transition-all ${isExpanded ? 'rotate-90 text-[var(--primary)]' : ''}`} 
                            />
                          </div>

                          {/* Level Details (Expanded) */}
                          {isExpanded && isLvlUnlocked && (
                            <div className="mt-4 pt-4 border-t border-[var(--border-light)] space-y-4 animate-fadeIn">
                              
                              {/* Videos Section */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">Video Lecture Milestones</span>
                                {lvl.videos.length === 0 ? (
                                  <p className="text-xs text-[var(--text-muted)] font-semibold">No video lectures mapped to this level.</p>
                                ) : (
                                  <div className="space-y-2">
                                    {lvl.videos.map((vid, vIdx) => {
                                      const isWatched = watchedSet.has((vid._id || vid).toString());
                                      return (
                                        <div key={vIdx} className="flex items-center justify-between p-3 bg-[var(--bg-sub)]/35 border border-[var(--border-light)] rounded-xl text-xs">
                                          <div className="flex items-center gap-2.5">
                                            <span className={`p-1.5 rounded-lg border ${
                                              isWatched
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-light)]'
                                            }`}>
                                              <FiCheckCircle size={14} className={isWatched ? 'fill-emerald-500/5' : ''} />
                                            </span>
                                            <span className="font-extrabold text-[var(--text-main)] truncate max-w-[200px] sm:max-w-md">
                                              {vid.title || 'Video Lecture'}
                                            </span>
                                          </div>
                                          <button
                                            onClick={() => navigate('/student/video-lectures')}
                                            className="px-3 py-1.5 bg-[var(--primary-light)]/45 hover:bg-[var(--primary-light)]/60 text-[var(--primary)] rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                                          >
                                            <FiPlay size={10} /> Watch
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              {/* Assessments Section */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">Verification Assessments</span>
                                {lvl.assessments.length === 0 ? (
                                  <p className="text-xs text-[var(--text-muted)] font-semibold">No assessments mapped to this level.</p>
                                ) : (
                                  <div className="space-y-2">
                                    {lvl.assessments.map((ass, aIdx) => {
                                      const isPassed = completedSet.has((ass._id || ass).toString());
                                      return (
                                        <div key={aIdx} className="flex items-center justify-between p-3 bg-[var(--bg-sub)]/35 border border-[var(--border-light)] rounded-xl text-xs">
                                          <div className="flex items-center gap-2.5">
                                            <span className={`p-1.5 rounded-lg border ${
                                              isPassed
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-light)]'
                                            }`}>
                                              <FiAward size={14} />
                                            </span>
                                            <span className="font-extrabold text-[var(--text-main)] truncate max-w-[200px] sm:max-w-md">
                                              {ass.title || 'Phase Assessment'}
                                            </span>
                                          </div>
                                          
                                          {isPassed ? (
                                            <span className="px-2.5 py-1 text-[8px] font-black uppercase rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                                              Passed
                                            </span>
                                          ) : (
                                            <button
                                              onClick={() => navigate('/student/assessments')}
                                              className="px-3 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all shadow-sm"
                                            >
                                              <FiPlayCircle size={10} /> Attempt
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                            </div>
                          )}

                          {/* Locked Message */}
                          {!isLvlUnlocked && (
                            <p className="mt-3 text-[10px] text-rose-500 font-extrabold flex items-center gap-1 leading-none">
                              <FiAlertCircle size={11} /> Locked: Clear all lectures & assessments in the previous level to unlock this path.
                            </p>
                          )}

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}
