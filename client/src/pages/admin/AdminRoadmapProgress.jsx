import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FiUsers, FiMap, FiSettings, FiRotateCcw, FiPercent, 
  FiCheckCircle, FiLock, FiBookOpen, FiUser, FiInfo, FiChevronRight 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminRoadmapProgress() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [passingPercentage, setPassingPercentage] = useState(70);
  const [updatingPassing, setUpdatingPassing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStudents();
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

  const fetchStudentProgress = async (student) => {
    try {
      setLoadingProgress(true);
      setSelectedStudent(student);
      const res = await api.get(`/roadmap-progress/student/${student._id}`);
      setProgressData(res.data.data);
      setPassingPercentage(res.data.data?.passingPercentage || 70);
    } catch (err) {
      console.error('Error fetching progress metrics:', err);
      toast.error('Failed to load roadmap metrics for student');
      setProgressData(null);
    } finally {
      setLoadingProgress(false);
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

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.rollNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Roadmap Progression Hub</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
          Inspect student syllabus progression, configure pass thresholds, and manage locks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Student Selection Sidebar (1 Col) */}
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

        {/* Progression Monitor and Overrides (2 Cols) */}
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

                <div className="flex gap-2">
                  <button
                    onClick={handleResetProgress}
                    disabled={resetting}
                    className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 border border-rose-500/25 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <FiRotateCcw size={12} />
                    {resetting ? 'Resetting...' : 'Reset Progress'}
                  </button>
                </div>
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

        </div>

      </div>

    </div>
  );
}
