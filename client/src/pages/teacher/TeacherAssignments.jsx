import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FiFileText, FiPlus, FiTrash2, FiSearch, FiX, 
  FiCheckCircle, FiEdit2, FiExternalLink, FiClock, FiUser 
} from 'react-icons/fi';

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState(null);

  // Form States
  const [form, setForm] = useState({
    title: '',
    description: '',
    course: '',
    batch: '',
    dueDate: '',
    fileUrl: ''
  });

  const [gradeForm, setGradeForm] = useState({
    grade: '',
    feedback: ''
  });

  useEffect(() => {
    fetchAssignments();
    fetchMetadata();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/assignments');
      setAssignments(res.data.data);
      if (res.data.data.length > 0 && !selectedAssignment) {
        setSelectedAssignment(res.data.data[0]);
      } else if (selectedAssignment) {
        const updated = res.data.data.find(a => a._id === selectedAssignment._id);
        if (updated) setSelectedAssignment(updated);
      }
    } catch (err) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [crsRes, batRes] = await Promise.all([
        api.get('/institute/courses'),
        api.get('/institute/batches')
      ]);
      setCourses(crsRes.data.data);
      setBatches(batRes.data.data);
    } catch (err) {
      console.log('Metadata load failed', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/institute/assignments', form);
      toast.success('Assignment created successfully! 📝');
      setIsAddModalOpen(false);
      setForm({
        title: '',
        description: '',
        course: '',
        batch: '',
        dueDate: '',
        fileUrl: ''
      });
      fetchAssignments();
    } catch (err) {
      toast.error('Failed to create assignment');
    }
  };

  const openGradeModal = (sub) => {
    setActiveSubmission(sub);
    setGradeForm({
      grade: sub.grade || '',
      feedback: sub.feedback || ''
    });
    setIsGradeModalOpen(true);
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/institute/assignments/${selectedAssignment._id}/grade`, {
        submissionId: activeSubmission._id,
        grade: gradeForm.grade,
        feedback: gradeForm.feedback
      });
      toast.success('Submission graded successfully! 🎓');
      setIsGradeModalOpen(false);
      setActiveSubmission(null);
      fetchAssignments();
    } catch (err) {
      toast.error('Failed to submit grade');
    }
  };

  const filtered = assignments.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && assignments.length === 0) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="h-96 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="lg:col-span-2 h-96 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Course Assignments</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
            Issue homework assignments and review student files and grade submissions
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-black uppercase rounded-xl shadow-md shadow-[var(--primary)]/10 flex items-center gap-1.5"
        >
          <FiPlus /> Issue Assignment
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className="card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-black text-[var(--text-main)] mb-1">No Active Assignments</h3>
          <p className="text-xs font-semibold max-w-md mx-auto">You have not issued any course assignments yet. Click the button above to issue one.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left: Assignments Playlist */}
          <div className="space-y-4">
            
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-light)]">
                <FiSearch size={14} />
              </span>
              <input
                type="text"
                placeholder="Search assignment title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all shadow-sm"
              />
            </div>

            {/* List */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm space-y-2 h-[450px] overflow-y-auto no-scrollbar">
              <h3 className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-wider px-1 mb-2">Homework List</h3>
              {filtered.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] font-bold text-center py-6">No matching homework.</p>
              ) : (
                filtered.map(a => {
                  const isSelected = selectedAssignment?._id === a._id;
                  const pendingCount = a.submissions?.filter(s => s.status === 'Pending').length || 0;
                  return (
                    <button
                      key={a._id}
                      onClick={() => setSelectedAssignment(a)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex justify-between items-center ${
                        isSelected 
                          ? 'bg-[var(--primary-light)]/45 border-[var(--primary)] text-[var(--primary)]' 
                          : 'bg-[var(--bg-sub)]/10 border-[var(--border-light)] text-[var(--text-main)] hover:bg-[var(--bg-sub)]/30'
                      }`}
                    >
                      <div className="space-y-1 overflow-hidden">
                        <h4 className="text-xs font-black truncate max-w-[150px]">{a.title}</h4>
                        <span className="text-[9px] font-bold text-[var(--text-light)] block">🗓️ Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                      </div>
                      {pendingCount > 0 && (
                        <span className="px-2 py-0.5 bg-amber-100 border border-amber-200 text-amber-600 text-[8px] font-black uppercase rounded">
                          {pendingCount} New
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

          </div>

          {/* Right: Submissions List (Col-span 2) */}
          <div className="lg:col-span-2">
            {selectedAssignment ? (
              <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-6">
                
                {/* Details Header */}
                <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-[var(--border-light)]">
                  <div>
                    <h2 className="text-lg font-black text-[var(--text-main)] leading-snug">{selectedAssignment.title}</h2>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1.5 font-bold">
                      Subject: {selectedAssignment.course?.courseName} &bull; Batch: {selectedAssignment.batch?.batchName} &bull; Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-muted)] text-[10px] font-black uppercase rounded-full">
                    {selectedAssignment.submissions?.length || 0} Submissions
                  </span>
                </div>

                {/* Submissions Roster */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest">Student Submissions Log</h3>
                  
                  <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                    {selectedAssignment.submissions?.length === 0 ? (
                      <p className="text-xs text-[var(--text-muted)] font-semibold text-center py-12">No submissions uploaded for this assignment yet.</p>
                    ) : (
                      selectedAssignment.submissions.map(sub => (
                        <div key={sub._id} className="p-4 bg-[var(--bg-sub)]/35 border border-[var(--border-light)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black text-[var(--text-main)]">{sub.student?.fullName}</h4>
                              <span className="text-[8px] font-bold text-[var(--text-light)]">🗓️ {new Date(sub.submittedAt).toLocaleDateString()}</span>
                            </div>
                            {sub.grade && (
                              <p className="text-[10px] font-bold text-[var(--primary)] mt-1.5">
                                Score/Grade: <span className="font-black text-rose-500">{sub.grade}</span> &bull; Feedback: <span className="text-[var(--text-muted)]">"{sub.feedback}"</span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <a
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 bg-indigo-50 border border-indigo-100 text-[var(--primary)] text-[10px] font-black uppercase rounded-lg flex items-center gap-1 hover:bg-indigo-100 transition-all"
                            >
                              <FiExternalLink /> Check File
                            </a>
                            <button
                              onClick={() => openGradeModal(sub)}
                              className={`px-3 py-2 text-[10px] font-black uppercase rounded-lg border transition-all ${
                                sub.status === 'Graded'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10'
                                  : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10'
                              }`}
                            >
                              {sub.status === 'Graded' ? 'Re-Grade 🎓' : 'Grade 🖋️'}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl py-20 text-center">
                <p className="text-xs text-[var(--text-muted)] font-bold">Select an assignment to view student submissions.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Grade Submission Modal */}
      {isGradeModalOpen && activeSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <h2 className="text-sm font-black uppercase text-[var(--text-main)]">Grade Student Submission</h2>
              <button onClick={() => setIsGradeModalOpen(false)} className="text-[var(--text-light)] hover:text-[var(--text-main)]">
                <FiX size={18} />
              </button>
            </div>

            <div className="bg-[var(--bg-sub)]/35 p-3.5 rounded-xl border border-[var(--border-light)] text-xs space-y-1">
              <div className="font-black text-[var(--text-main)]">Student: {activeSubmission.student?.fullName}</div>
              <div className="text-[var(--text-light)] font-bold">File: <a href={activeSubmission.fileUrl} target="_blank" rel="noreferrer" className="text-[var(--primary)] underline">{activeSubmission.fileUrl}</a></div>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              
              {/* Grade */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Score / Grade Letter</label>
                <input
                  type="text"
                  required
                  value={gradeForm.grade}
                  onChange={(e) => setGradeForm({...gradeForm, grade: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="e.g. A+, 95/100, Excellent"
                />
              </div>

              {/* Feedback */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Feedback / Critique Comments</label>
                <textarea
                  required
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({...gradeForm, feedback: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="Enter comments about code cleanlines, state structure, etc..."
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-black uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <FiCheckCircle /> Publish Grade & Review
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <h2 className="text-sm font-black uppercase text-[var(--text-main)]">Issue Course Homework</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-light)] hover:text-[var(--text-main)]">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Homework Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="e.g. Build dynamic Todo in React"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Instructions & Guidelines</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="Detail clean code requirements or design specifications..."
                />
              </div>

              {/* Due Date */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Deadline Due Date</label>
                <input
                  type="date"
                  required
                  value={form.dueDate}
                  onChange={(e) => setForm({...form, dueDate: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                />
              </div>

              {/* File URL */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Instruction PDF Link (Optional)</label>
                <input
                  type="url"
                  value={form.fileUrl}
                  onChange={(e) => setForm({...form, fileUrl: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="https://..."
                />
              </div>

              {/* Course & Batch Select */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Subject Course</label>
                  <select
                    required
                    value={form.course}
                    onChange={(e) => setForm({...form, course: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.courseName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Roster Batch</label>
                  <select
                    required
                    value={form.batch}
                    onChange={(e) => setForm({...form, batch: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  >
                    <option value="">Select Batch</option>
                    {batches.map(b => (
                      <option key={b._id} value={b._id}>{b.batchName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-black uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <FiFileText /> Issue Homework
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
