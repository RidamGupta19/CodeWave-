import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FiUsers, FiMap, FiSettings, FiRotateCcw, FiPercent, 
  FiCheckCircle, FiLock, FiBookOpen, FiUser, FiInfo, FiChevronRight,
  FiPlus, FiTrash2, FiArrowUp, FiArrowDown, FiUnlock, FiPlay, FiAward, FiSave
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminRoadmapProgress() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [allAssessments, setAllAssessments] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [userRoadmap, setUserRoadmap] = useState(null);

  const [activeTab, setActiveTab] = useState('syllabus'); // 'syllabus' or 'levelRoadmap'

  const [loadingList, setLoadingList] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  const [passingPercentage, setPassingPercentage] = useState(70);
  const [updatingPassing, setUpdatingPassing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Course Assignment Form State
  const [assigningCourse, setAssigningCourse] = useState('');
  const [assigningTemplate, setAssigningTemplate] = useState('default');
  const [submittingAssign, setSubmittingAssign] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchMetadata();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoadingList(true);
      const res = await api.get('/institute/students');
      setStudents(res.data.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error('Failed to load students list');
    } finally {
      setLoadingList(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [coursesRes, videosRes, assessmentsRes] = await Promise.all([
        api.get('/institute/courses'),
        api.get('/institute/videos'),
        api.get('/assessments')
      ]);
      setCourses(coursesRes.data.data || []);
      setAllVideos(videosRes.data.data || []);
      setAllAssessments(assessmentsRes.data.data || []);
    } catch (err) {
      console.error('Error loading courses/videos/assessments metadata:', err);
    }
  };

  const fetchStudentProgress = async (student) => {
    try {
      setLoadingProgress(true);
      setSelectedStudent(student);
      
      // Load standard milestones
      const res = await api.get(`/roadmap-progress/student/${student._id}`);
      setProgressData(res.data.data);
      setPassingPercentage(res.data.data?.passingPercentage || 70);

      // Load level roadmap
      await fetchUserRoadmap(student.userId);
    } catch (err) {
      console.error('Error fetching progress metrics:', err);
      toast.error('Failed to load roadmap metrics for student');
      setProgressData(null);
    } finally {
      setLoadingProgress(false);
    }
  };

  const fetchUserRoadmap = async (userId) => {
    try {
      setLoadingRoadmap(true);
      const res = await api.get(`/admin/roadmap/${userId}`);
      setUserRoadmap(res.data.data);
    } catch (err) {
      setUserRoadmap(null);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const handleUpdatePassing = async () => {
    if (!selectedStudent || updatingPassing) return;
    const pct = parseInt(passingPercentage);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      toast.error('Please enter a valid percentage between 0 and 100.');
      return;
    }

    try {
      setUpdatingPassing(true);
      const res = await api.put('/roadmap-progress/configure-passing', {
        studentId: selectedStudent._id,
        passingPercentage: pct
      });
      setProgressData(res.data.data);
      toast.success(`Passing threshold configured to ${pct}%`);
    } catch (err) {
      console.error('Error updating passing score:', err);
      toast.error(err.response?.data?.message || 'Failed to update configuration');
    } finally {
      setUpdatingPassing(false);
    }
  };

  const handleResetProgress = async () => {
    if (!selectedStudent || resetting) return;
    const confirmReset = window.confirm(
      `⚠️ WARNING: This will permanently reset all video watching and assessment history for ${selectedStudent.fullName}. This action CANNOT be undone. Are you sure you want to proceed?`
    );
    if (!confirmReset) return;

    try {
      setResetting(true);
      const res = await api.post('/roadmap-progress/reset', {
        studentId: selectedStudent._id
      });
      setProgressData(res.data.data);
      setPassingPercentage(res.data.data?.passingPercentage || 70);
      toast.success(`Syllabus and assessment progress successfully reset for ${selectedStudent.fullName}`);
    } catch (err) {
      console.error('Error resetting progress:', err);
      toast.error(err.response?.data?.message || 'Failed to reset student progress');
    } finally {
      setResetting(false);
    }
  };

  // ----------------------------------------------------
  // Level Roadmap Actions
  // ----------------------------------------------------
  const handleAssignRoadmap = async () => {
    if (!assigningCourse) {
      toast.error('Please select a course to assign.');
      return;
    }
    try {
      setSubmittingAssign(true);
      await api.post('/admin/roadmap/assign', {
        userId: selectedStudent.userId,
        courseId: assigningCourse,
        templateType: assigningTemplate
      });
      toast.success('Course and dynamic roadmap assigned successfully!');
      await fetchUserRoadmap(selectedStudent.userId);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign course roadmap.');
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleSaveRoadmapConfig = async () => {
    if (!userRoadmap) return;
    try {
      setSavingConfig(true);
      const cleanedConfig = userRoadmap.customRoadmapConfig.map(lvl => ({
        levelNumber: lvl.levelNumber,
        name: lvl.name,
        description: lvl.description,
        isLocked: lvl.isLocked,
        videos: lvl.videos.map(v => v._id || v),
        assessments: lvl.assessments.map(a => a._id || a)
      }));

      await api.put(`/admin/roadmap/${selectedStudent.userId}`, {
        customRoadmapConfig: cleanedConfig,
        passingPercentage: userRoadmap.passingPercentage,
        templateType: userRoadmap.templateType
      });
      toast.success('Dynamic roadmap saved and progress recalculated!');
      await fetchUserRoadmap(selectedStudent.userId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save configuration');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleResetLevelRoadmap = async () => {
    if (!selectedStudent || resetting) return;
    const confirmReset = window.confirm(
      `⚠️ WARNING: This will reset ${selectedStudent.fullName}'s custom roadmap watched videos, assessment completions, and locks back to Level 0. Proceed?`
    );
    if (!confirmReset) return;

    try {
      setResetting(true);
      await api.post(`/admin/roadmap/reset/${selectedStudent.userId}`);
      toast.success('Roadmap progress reset back to Level 0.');
      await fetchUserRoadmap(selectedStudent.userId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset roadmap.');
    } finally {
      setResetting(false);
    }
  };

  const addLevel = () => {
    if (!userRoadmap) return;
    const config = [...userRoadmap.customRoadmapConfig];
    const newLvlNum = config.length;
    config.push({
      levelNumber: newLvlNum,
      name: `Custom Level ${newLvlNum}`,
      description: 'Add description here.',
      videos: [],
      assessments: [],
      isLocked: true
    });
    setUserRoadmap({ ...userRoadmap, customRoadmapConfig: config });
  };

  const removeLevel = (index) => {
    if (!userRoadmap) return;
    if (userRoadmap.customRoadmapConfig[index].levelNumber === 0) {
      toast.error('Level 0 cannot be deleted.');
      return;
    }
    const config = userRoadmap.customRoadmapConfig.filter((_, idx) => idx !== index);
    config.forEach((lvl, idx) => {
      lvl.levelNumber = idx;
    });
    setUserRoadmap({ ...userRoadmap, customRoadmapConfig: config });
  };

  const moveLevel = (index, direction) => {
    if (!userRoadmap) return;
    const config = [...userRoadmap.customRoadmapConfig];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= config.length) return;

    const temp = config[index];
    config[index] = config[targetIdx];
    config[targetIdx] = temp;

    config.forEach((lvl, idx) => {
      lvl.levelNumber = idx;
    });

    setUserRoadmap({ ...userRoadmap, customRoadmapConfig: config });
  };

  const addVideoToLevel = (levelIndex, videoId) => {
    if (!videoId) return;
    const config = [...userRoadmap.customRoadmapConfig];
    const level = config[levelIndex];
    if (level.videos.some(v => (v._id || v).toString() === videoId.toString())) {
      toast.error('Video already in this level.');
      return;
    }
    const fullVideo = allVideos.find(v => v._id === videoId);
    level.videos.push(fullVideo || videoId);
    setUserRoadmap({ ...userRoadmap, customRoadmapConfig: config });
  };

  const removeVideoFromLevel = (levelIndex, videoId) => {
    const config = [...userRoadmap.customRoadmapConfig];
    const level = config[levelIndex];
    level.videos = level.videos.filter(v => (v._id || v).toString() !== videoId.toString());
    setUserRoadmap({ ...userRoadmap, customRoadmapConfig: config });
  };

  const addAssessmentToLevel = (levelIndex, assessmentId) => {
    if (!assessmentId) return;
    const config = [...userRoadmap.customRoadmapConfig];
    const level = config[levelIndex];
    if (level.assessments.some(a => (a._id || a).toString() === assessmentId.toString())) {
      toast.error('Assessment already in this level.');
      return;
    }
    const fullAss = allAssessments.find(a => a._id === assessmentId);
    level.assessments.push(fullAss || assessmentId);
    setUserRoadmap({ ...userRoadmap, customRoadmapConfig: config });
  };

  const removeAssessmentFromLevel = (levelIndex, assessmentId) => {
    const config = [...userRoadmap.customRoadmapConfig];
    const level = config[levelIndex];
    level.assessments = level.assessments.filter(a => (a._id || a).toString() !== assessmentId.toString());
    setUserRoadmap({ ...userRoadmap, customRoadmapConfig: config });
  };

  const toggleLevelLock = (levelIndex) => {
    const config = [...userRoadmap.customRoadmapConfig];
    config[levelIndex].isLocked = !config[levelIndex].isLocked;
    setUserRoadmap({ ...userRoadmap, customRoadmapConfig: config });
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.rollNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)] font-display">Roadmap Progression Hub</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
          Inspect student syllabus progression, configure pass thresholds, and manage locks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Student Selection Sidebar */}
        <div className="space-y-4">
          <div className="card p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-1.5">
              <FiUsers className="text-[var(--primary)]" /> Select Student
            </h3>
            
            <input
              type="text"
              placeholder="Search by name, email, roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
            />
          </div>

          <div className="card p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl shadow-sm h-[500px] overflow-y-auto no-scrollbar space-y-2">
            {loadingList ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-10 bg-[var(--bg-sub)]/30 rounded-xl" />
                <div className="h-10 bg-[var(--bg-sub)]/30 rounded-xl" />
                <div className="h-10 bg-[var(--bg-sub)]/30 rounded-xl" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] text-center py-12 font-bold">No students found.</p>
            ) : (
              filteredStudents.map(s => {
                const isSelected = selectedStudent?._id === s._id;
                return (
                  <button
                    key={s._id}
                    onClick={() => fetchStudentProgress(s)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isSelected 
                        ? 'bg-[var(--primary-light)]/45 border-[var(--primary)] text-[var(--primary)] font-black' 
                        : 'bg-[var(--bg-sub)]/15 border-[var(--border-light)] text-[var(--text-main)] hover:bg-[var(--bg-sub)]/35'
                    }`}
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate leading-tight">{s.fullName}</h4>
                      <p className="text-[9px] text-[var(--text-muted)] mt-1 font-semibold truncate">{s.email}</p>
                    </div>
                    <FiChevronRight size={14} className={isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-light)]'} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Progression Monitor and Overrides */}
        <div className="lg:col-span-2 space-y-4">
          
          {!selectedStudent ? (
            <div className="h-[550px] flex items-center justify-center card bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl text-center">
              <div className="space-y-2">
                <div className="text-5xl">📡</div>
                <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-wider">Select a student to monitor roadmap progression pipelines</p>
              </div>
            </div>
          ) : loadingProgress ? (
            <div className="space-y-6 animate-pulse bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 h-[550px]">
              <div className="h-6 w-48 bg-[var(--border)] rounded-lg" />
              <div className="h-10 bg-[var(--bg-sub)]/35 rounded-2xl" />
              <div className="space-y-3">
                <div className="h-16 bg-[var(--bg-sub)]/35 rounded-xl" />
                <div className="h-16 bg-[var(--bg-sub)]/35 rounded-xl" />
              </div>
            </div>
          ) : (
            <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl shadow-sm space-y-6">
              
              {/* Student Overview Header */}
              <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-[var(--border-light)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-[var(--primary-light)]/45 text-[var(--primary)] rounded-xl">
                      <FiUser size={18} />
                    </span>
                    <div>
                      <h2 className="text-base font-black text-[var(--text-main)] leading-snug">
                        {selectedStudent.fullName}
                      </h2>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase mt-0.5">
                        Roll: {selectedStudent.rollNumber || 'N/A'} • Course: {selectedStudent.course?.courseName || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex border border-[var(--border)] rounded-xl p-1 bg-[var(--bg-sub)]/25">
                  <button
                    onClick={() => setActiveTab('syllabus')}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                      activeTab === 'syllabus'
                        ? 'bg-[var(--primary)] text-white shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Milestone Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('levelRoadmap')}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                      activeTab === 'levelRoadmap'
                        ? 'bg-[var(--primary)] text-white shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Level Roadmap Editor
                  </button>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* TAB 1: SYLLABUS MILESTONE ANALYTICS (ORIGINAL) */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'syllabus' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-[var(--bg-sub)]/10 p-3 rounded-2xl border border-[var(--border-light)]">
                    <span className="text-xs font-bold text-[var(--text-main)]">Syllabus Actions</span>
                    <button
                      onClick={handleResetProgress}
                      disabled={resetting}
                      className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 border border-rose-500/25 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <FiRotateCcw size={12} />
                      {resetting ? 'Resetting...' : 'Reset Progress'}
                    </button>
                  </div>

                  {/* Adjust passing threshold */}
                  <div className="p-4 bg-[var(--bg-sub)]/35 rounded-2xl border border-[var(--border-light)] grid md:grid-cols-2 gap-4 items-center">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-1">
                        <FiPercent /> Configure Passing threshold
                      </span>
                      <p className="text-[9px] text-[var(--text-muted)] mt-1 font-semibold">
                        Set the test score required to unlock downstream modules.
                      </p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={passingPercentage}
                        onChange={(e) => setPassingPercentage(e.target.value)}
                        className="w-24 px-3 py-2 bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-black text-center"
                      />
                      <button
                        onClick={handleUpdatePassing}
                        disabled={updatingPassing}
                        className="btn-primary text-center px-4 py-2 text-xs font-black uppercase tracking-wider disabled:opacity-50"
                      >
                        {updatingPassing ? 'Saving...' : 'Apply'}
                      </button>
                    </div>
                  </div>

                  {/* Subject timeline lists */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">Module Status Overview</h3>
                    
                    {(!progressData || !progressData.subjectProgress || progressData.subjectProgress.length === 0) ? (
                      <p className="text-xs text-[var(--text-muted)] font-semibold flex items-center gap-1">
                        <FiInfo size={12} /> No roadmap has been initialized. Have they watched any video or attempted any assessments?
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {progressData.subjectProgress.map((sub, idx) => {
                          const isUnlocked = sub.isUnlocked;
                          const isCompleted = sub.isCompleted;
                          const assessments = (progressData.assessmentStatus || []).filter(a => a.subjectName === sub.subjectName);

                          return (
                            <div key={idx} className={`p-4 rounded-2xl border ${
                              isCompleted
                                ? 'bg-emerald-500/[0.01] border-emerald-500/25'
                                : !isUnlocked
                                  ? 'bg-[var(--bg-sub)]/10 border-[var(--border-light)] opacity-60'
                                  : 'bg-[var(--bg-card)] border-[var(--border)]'
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-extrabold text-sm text-[var(--text-main)]">{sub.subjectName}</h4>
                                    {isCompleted ? (
                                      <span className="px-2 py-0.2 text-[8px] font-black uppercase rounded bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30 flex items-center gap-0.5">
                                        ✓ Mastered
                                      </span>
                                    ) : isUnlocked ? (
                                      <span className="px-2 py-0.2 text-[8px] font-black uppercase rounded bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.2 text-[8px] font-black uppercase rounded bg-rose-50 text-rose-500 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30 flex items-center gap-0.5">
                                        <FiLock size={8} /> Locked
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider">
                                    Module {idx + 1} • Lecture Watching Progress: {sub.completionPercentage}%
                                  </p>
                                </div>
                              </div>

                              {/* Assessments detail lists */}
                              {isUnlocked && assessments.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-[var(--border-light)] space-y-2">
                                  {assessments.map((a, aIdx) => (
                                    <div key={aIdx} className="flex justify-between items-center text-xs p-2.5 bg-[var(--bg-sub)]/35 rounded-xl border border-[var(--border-light)]">
                                      <div>
                                        <span className="font-bold text-[var(--text-main)]">{a.assessmentId?.title || 'Phase Test'}</span>
                                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5 flex gap-2 font-semibold">
                                          <span>Attempts: {a.attemptsCount}</span>
                                          <span>Best Score: {a.bestScore}%</span>
                                        </div>
                                      </div>
                                      <div>
                                        {a.isPassed ? (
                                          <span className="px-2.5 py-0.5 text-[8px] font-black uppercase rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                                            Passed
                                          </span>
                                        ) : a.isUnlocked ? (
                                          <span className="px-2.5 py-0.5 text-[8px] font-black uppercase rounded-full bg-blue-100 text-blue-600 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30">
                                            Unlocked
                                          </span>
                                        ) : (
                                          <span className="px-2.5 py-0.5 text-[8px] font-black uppercase rounded-full bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30 flex items-center gap-0.5">
                                            <FiLock size={8} /> Locked
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 2: LEVEL-BASED ROADMAP EDITOR (NEW) */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'levelRoadmap' && (
                <div className="space-y-6">
                  
                  {loadingRoadmap ? (
                    <div className="space-y-3 animate-pulse py-8">
                      <div className="h-10 bg-[var(--bg-sub)]/35 rounded-xl" />
                      <div className="h-24 bg-[var(--bg-sub)]/35 rounded-xl" />
                    </div>
                  ) : !userRoadmap ? (
                    /* Assign Course & Roadmap Panel */
                    <div className="p-6 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-indigo-900/40 border border-indigo-500/20 rounded-3xl space-y-5 text-white">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/25">
                          No Active Dynamic Roadmap
                        </span>
                        <h3 className="text-base font-black tracking-tight mt-3">Assign Dynamic Learning Path</h3>
                        <p className="text-xs text-indigo-200 mt-1">
                          This student currently does not have a level-based customizable roadmap. Assign a course to create one automatically.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-wider text-indigo-300">Select Syllabus Course</label>
                          <select
                            value={assigningCourse}
                            onChange={(e) => setAssigningCourse(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-900 border border-indigo-500/25 text-xs text-white rounded-xl outline-none font-bold"
                          >
                            <option value="">-- Choose Course --</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-wider text-indigo-300">Choose Roadmap Template</label>
                          <select
                            value={assigningTemplate}
                            onChange={(e) => setAssigningTemplate(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-900 border border-indigo-500/25 text-xs text-white rounded-xl outline-none font-bold"
                          >
                            <option value="default">Default Course Layout</option>
                            <option value="beginner">Beginner roadmap (60% pass threshold)</option>
                            <option value="intermediate">Intermediate roadmap (70% pass threshold)</option>
                            <option value="advanced">Advanced roadmap (85% pass threshold)</option>
                            <option value="custom">Custom empty roadmap</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleAssignRoadmap}
                          disabled={submittingAssign}
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 text-xs font-black uppercase rounded-xl tracking-wider shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <FiPlus size={14} className="stroke-[3]" />
                          {submittingAssign ? 'Assigning...' : 'Provision Roadmap'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Level Roadmap Editor Panel */
                    <div className="space-y-6">
                      
                      {/* Configuration Controls Bar */}
                      <div className="p-4 bg-[var(--bg-sub)]/35 border border-[var(--border-light)] rounded-2xl grid md:grid-cols-3 gap-4 items-center">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest">Roadmap Template</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-[var(--primary-light)]/45 text-[var(--primary)] border border-[var(--primary)]/20 rounded-md">
                              {userRoadmap.templateType}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest">Passing Score Required</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={userRoadmap.passingPercentage}
                              onChange={(e) => setUserRoadmap({ ...userRoadmap, passingPercentage: Number(e.target.value) })}
                              className="w-16 px-2 py-1 bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-main)] rounded-lg outline-none font-black text-center"
                            />
                            <span className="text-xs text-[var(--text-muted)] font-bold">%</span>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleResetLevelRoadmap}
                            className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 text-rose-500 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                          >
                            <FiRotateCcw size={12} /> Reset
                          </button>
                          
                          <button
                            onClick={handleSaveRoadmapConfig}
                            disabled={savingConfig}
                            className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] border border-[var(--primary-dark)] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all shadow-md disabled:opacity-50"
                          >
                            <FiSave size={12} /> {savingConfig ? 'Saving...' : 'Save Configuration'}
                          </button>
                        </div>
                      </div>

                      {/* Levels List */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider">Configure Roadmap Levels</h3>
                          <button
                            onClick={addLevel}
                            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                          >
                            <FiPlus size={12} /> Add Level
                          </button>
                        </div>

                        <div className="space-y-4">
                          {userRoadmap.customRoadmapConfig.map((lvl, index) => {
                            // Filter videos and assessments belonging to the course
                            const courseVideos = allVideos.filter(v => v.course?._id === userRoadmap.courseId?._id || v.course === userRoadmap.courseId?._id);
                            const courseAssessments = allAssessments.filter(a => a.course === userRoadmap.courseId?._id);

                            return (
                              <div key={index} className="p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl shadow-sm space-y-4 relative">
                                
                                {/* Level Header */}
                                <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[var(--border-light)] pb-3">
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-8 h-8 rounded-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs font-black text-[var(--text-main)] flex items-center justify-center">
                                      {lvl.levelNumber}
                                    </span>
                                    <div className="space-y-1">
                                      <input
                                        type="text"
                                        value={lvl.name}
                                        onChange={(e) => {
                                          const config = [...userRoadmap.customRoadmapConfig];
                                          config[index].name = e.target.value;
                                          setUserRoadmap({ ...userRoadmap, customRoadmapConfig: config });
                                        }}
                                        className="bg-transparent border-b border-transparent hover:border-[var(--border)] focus:border-[var(--primary)] text-xs font-extrabold text-[var(--text-main)] outline-none py-0.5 px-1 rounded transition-all"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {/* Locked Toggle */}
                                    <button
                                      onClick={() => toggleLevelLock(index)}
                                      className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 font-bold transition-all ${
                                        lvl.isLocked
                                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                                      }`}
                                      title={lvl.isLocked ? "Unlock level" : "Lock level"}
                                    >
                                      {lvl.isLocked ? <FiLock size={12} /> : <FiUnlock size={12} />}
                                      {lvl.isLocked ? 'Locked' : 'Unlocked'}
                                    </button>

                                    {/* Order Buttons */}
                                    <button
                                      onClick={() => moveLevel(index, -1)}
                                      disabled={index === 0}
                                      className="p-1.5 bg-[var(--bg-sub)] hover:bg-[var(--bg-sub)]/70 border border-[var(--border)] text-[var(--text-main)] rounded-lg disabled:opacity-30"
                                    >
                                      <FiArrowUp size={12} />
                                    </button>
                                    <button
                                      onClick={() => moveLevel(index, 1)}
                                      disabled={index === userRoadmap.customRoadmapConfig.length - 1}
                                      className="p-1.5 bg-[var(--bg-sub)] hover:bg-[var(--bg-sub)]/70 border border-[var(--border)] text-[var(--text-main)] rounded-lg disabled:opacity-30"
                                    >
                                      <FiArrowDown size={12} />
                                    </button>

                                    {/* Delete Level */}
                                    <button
                                      onClick={() => removeLevel(index)}
                                      disabled={lvl.levelNumber === 0}
                                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/25 text-rose-500 rounded-lg disabled:opacity-30"
                                    >
                                      <FiTrash2 size={12} />
                                    </button>
                                  </div>
                                </div>

                                {/* Description Field */}
                                <div className="space-y-1">
                                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-widest">Level Description</label>
                                  <textarea
                                    value={lvl.description || ''}
                                    onChange={(e) => {
                                      const config = [...userRoadmap.customRoadmapConfig];
                                      config[index].description = e.target.value;
                                      setUserRoadmap({ ...userRoadmap, customRoadmapConfig: config });
                                    }}
                                    className="w-full p-2 bg-[var(--bg-sub)]/30 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all h-12 resize-none"
                                  />
                                </div>

                                {/* Video Mapping Editor */}
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-1">
                                      <FiPlay size={12} /> Video Lectures ({lvl.videos.length})
                                    </span>
                                  </div>

                                  {lvl.videos.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {lvl.videos.map((vid, vIdx) => {
                                        const videoTitle = vid?.title || vid;
                                        return (
                                          <div key={vIdx} className="flex items-center gap-1.5 pl-3 pr-1 py-1 bg-[var(--bg-sub)]/40 border border-[var(--border-light)] rounded-full text-xs font-semibold text-[var(--text-main)]">
                                            <span className="max-w-[150px] truncate">{videoTitle}</span>
                                            <button
                                              onClick={() => removeVideoFromLevel(index, vid._id || vid)}
                                              className="p-0.5 hover:bg-rose-500/10 text-rose-500 rounded-full"
                                            >
                                              <FiTrash2 size={10} />
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Add Video Dropdown */}
                                  <div className="flex items-center gap-2">
                                    <select
                                      onChange={(e) => {
                                        addVideoToLevel(index, e.target.value);
                                        e.target.value = '';
                                      }}
                                      className="flex-1 max-w-xs px-2.5 py-1.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-lg outline-none font-semibold"
                                    >
                                      <option value="">-- Add Video Lecture --</option>
                                      {courseVideos
                                        .filter(v => !lvl.videos.some(mv => (mv._id || mv).toString() === v._id.toString()))
                                        .map(v => <option key={v._id} value={v._id}>{v.title}</option>)}
                                    </select>
                                  </div>
                                </div>

                                {/* Assessment Mapping Editor */}
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-1">
                                      <FiAward size={12} /> Verification Assessments ({lvl.assessments.length})
                                    </span>
                                  </div>

                                  {lvl.assessments.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {lvl.assessments.map((ass, aIdx) => {
                                        const assTitle = ass?.title || ass;
                                        return (
                                          <div key={aIdx} className="flex items-center gap-1.5 pl-3 pr-1 py-1 bg-[var(--bg-sub)]/40 border border-[var(--border-light)] rounded-full text-xs font-semibold text-[var(--text-main)]">
                                            <span className="max-w-[150px] truncate">{assTitle}</span>
                                            <button
                                              onClick={() => removeAssessmentFromLevel(index, ass._id || ass)}
                                              className="p-0.5 hover:bg-rose-500/10 text-rose-500 rounded-full"
                                            >
                                              <FiTrash2 size={10} />
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Add Assessment Dropdown */}
                                  <div className="flex items-center gap-2">
                                    <select
                                      onChange={(e) => {
                                        addAssessmentToLevel(index, e.target.value);
                                        e.target.value = '';
                                      }}
                                      className="flex-1 max-w-xs px-2.5 py-1.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-lg outline-none font-semibold"
                                    >
                                      <option value="">-- Add Assessment --</option>
                                      {courseAssessments
                                        .filter(a => !lvl.assessments.some(ma => (ma._id || ma).toString() === a._id.toString()))
                                        .map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
                                    </select>
                                  </div>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
