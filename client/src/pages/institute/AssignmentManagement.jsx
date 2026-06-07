import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX, FiFileText, FiCheck, FiSend, FiAward, FiEdit } from 'react-icons/fi';

export default function AssignmentManagement() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  // Form States
  const [addForm, setAddForm] = useState({
    title: '',
    description: '',
    course: '',
    batch: '',
    dueDate: '',
    fileUrl: ''
  });
  const [submitUrl, setSubmitUrl] = useState('');
  const [gradeForm, setGradeForm] = useState({
    grade: 'A',
    feedback: ''
  });

  useEffect(() => {
    fetchAssignments();
    if (user.role !== 'student') {
      fetchMetadata();
    }
  }, [user]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/institute/assignments');
      setAssignments(res.data.data);
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/institute/assignments', addForm);
      toast.success('Assignment published successfully!');
      setIsAddModalOpen(false);
      setAddForm({ title: '', description: '', course: '', batch: '', dueDate: '', fileUrl: '' });
      fetchAssignments();
    } catch (err) {
      toast.error('Publish failed');
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!submitUrl) return toast.error('Please provide a file URL');
    try {
      await api.post(`/institute/assignments/${selectedAssignment._id}/submit`, { fileUrl: submitUrl });
      toast.success('Assignment submitted successfully!');
      setIsSubmitModalOpen(false);
      setSubmitUrl('');
      fetchAssignments();
    } catch (err) {
      toast.error('Submission failed');
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/institute/assignments/${selectedAssignment._id}/grade`, {
        submissionId: selectedSubmission._id,
        ...gradeForm
      });
      toast.success('Grade saved successfully!');
      setIsGradeModalOpen(false);
      
      // Reload assignment to update current view
      const updatedList = assignments.map(a => {
        if (a._id === selectedAssignment._id) {
          const updatedSub = a.submissions.map(s => {
            if (s._id === selectedSubmission._id) {
              return { ...s, grade: gradeForm.grade, feedback: gradeForm.feedback, status: 'Graded' };
            }
            return s;
          });
          return { ...a, submissions: updatedSub };
        }
        return a;
      });
      setAssignments(updatedList);
      
      // Keep submissions panel updated
      const freshAssignment = updatedList.find(a => a._id === selectedAssignment._id);
      setSelectedAssignment(freshAssignment);
      
      setGradeForm({ grade: 'A', feedback: '' });
    } catch (err) {
      toast.error('Grading failed');
    }
  };

  const checkMySubmission = (assignment) => {
    if (user.role !== 'student') return null;
    return assignment.submissions?.find(s => s.student?.userId === user._id || s.student?._id === user._id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Assignments Hub</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Review guidelines, upload submissions and download results</p>
        </div>
        {user.role !== 'student' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-xs py-3 px-5"
          >
            <FiPlus strokeWidth={3} /> Post Task
          </button>
        )}
      </div>

      <div className="space-y-4 max-w-4xl">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : assignments.length === 0 ? (
          <div className="card p-10 text-center text-[var(--text-muted)] font-bold">
            No active assignments listed.
          </div>
        ) : (
          assignments.map(item => {
            const sub = checkMySubmission(item);
            return (
              <div key={item._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg text-orange-500 shrink-0">
                      <FiFileText />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[var(--text-main)] leading-tight">{item.title}</h3>
                      <div className="flex flex-wrap gap-2 text-[10px] text-[var(--text-light)] mt-1.5 font-bold uppercase tracking-wider">
                        <span className="text-[var(--primary)]">Course: {item.course?.courseName}</span>
                        <span>Batch: {item.batch?.batchName}</span>
                        <span className="text-rose-500">Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons based on role */}
                  <div className="flex gap-2">
                    {user.role === 'student' ? (
                      sub ? (
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            sub.status === 'Graded' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {sub.status === 'Graded' ? `Graded: ${sub.grade}` : 'Pending Grade'}
                          </span>
                          <button 
                            onClick={() => { setSelectedAssignment(item); setIsSubmitModalOpen(true); }}
                            className="btn-secondary text-[10px] py-1.5 px-3 uppercase font-black tracking-wider flex items-center gap-1.5"
                          >
                            <FiEdit size={12} /> Resubmit
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setSelectedAssignment(item); setIsSubmitModalOpen(true); }}
                          className="btn-primary text-[10px] py-1.5 px-4 uppercase font-black tracking-wider flex items-center gap-1.5"
                        >
                          <FiSend size={12} /> Submit
                        </button>
                      )
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setSelectedAssignment(item); setIsSubmissionsOpen(true); }}
                          className="btn-secondary text-[10px] py-1.5 px-4 uppercase font-black tracking-wider shadow-sm"
                        >
                          Submissions ({item.submissions?.length || 0})
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[var(--text-main)] leading-relaxed font-semibold bg-[var(--bg-sub)]/35 border border-[var(--border)] p-3.5 rounded-xl">
                  {item.description || 'Review guidelines and submit completed files.'}
                </p>

                {/* Submit links download */}
                {item.fileUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-light)]">Attachment:</span>
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[var(--primary)] hover:underline">Download Guidelines Sheet</a>
                  </div>
                )}

                {/* Submissions grades display for Student */}
                {user.role === 'student' && sub && sub.status === 'Graded' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3.5 mt-2 flex items-start gap-3 text-xs">
                    <FiAward className="text-green-600 text-lg shrink-0 mt-0.5" />
                    <div>
                      <div className="font-extrabold text-green-800">Grade Evaluation: {sub.grade}</div>
                      {sub.feedback && <p className="text-green-700 mt-1 font-semibold italic">"{sub.feedback}"</p>}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Post assignment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--bg-sub)]"
            >
              <FiX size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6">Publish Task Assignment</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Assignment Title</label>
                <input 
                  type="text" 
                  required
                  value={addForm.title}
                  onChange={(e) => setAddForm({...addForm, title: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="e.g. Build landing page with Flexbox"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Course</label>
                  <select 
                    required
                    value={addForm.course}
                    onChange={(e) => setAddForm({...addForm, course: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Batch</label>
                  <select 
                    required
                    value={addForm.batch}
                    onChange={(e) => setForm({...addForm, batch: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                    value={addForm.batch}
                    onChange={(e) => setAddForm({...addForm, batch: e.target.value})}
                  >
                    <option value="">Select Batch</option>
                    {batches.map(b => <option key={b._id} value={b._id}>{b.batchName}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Due Date</label>
                  <input 
                    type="date" 
                    required
                    value={addForm.dueDate}
                    onChange={(e) => setAddForm({...addForm, dueDate: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Guidelines URL (Link)</label>
                  <input 
                    type="url" 
                    value={addForm.fileUrl}
                    onChange={(e) => setAddForm({...addForm, fileUrl: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Task Guidelines & Requirements</label>
                <textarea 
                  rows="3"
                  required
                  value={addForm.description}
                  onChange={(e) => setAddForm({...addForm, description: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="Outline key expectations, constraints and instructions..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary py-3 px-5 text-xs font-black uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary py-3 px-6 text-xs font-black uppercase"
                >
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit assignment Modal */}
      {isSubmitModalOpen && selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-sm shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--bg-sub)]"
            >
              <FiX size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6">Submit Assignment</h3>

            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              <div>
                <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Assignment</span>
                <p className="text-sm font-extrabold text-[var(--text-main)] mt-0.5">{selectedAssignment.title}</p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">GitHub / Code Sandbox URL</label>
                <input 
                  type="url" 
                  required
                  value={submitUrl}
                  onChange={(e) => setSubmitUrl(e.target.value)}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="btn-secondary py-3 px-5 text-xs font-black uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary py-3 px-6 text-xs font-black uppercase"
                >
                  Submit Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions drawer list */}
      {isSubmissionsOpen && selectedAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setIsSubmissionsOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--bg-sub)]"
            >
              <FiX size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6">
              Submissions Feed for "{selectedAssignment.title}"
            </h3>

            <div className="space-y-3">
              {selectedAssignment.submissions?.length === 0 ? (
                <p className="text-center py-12 text-xs font-bold text-[var(--text-light)]">No student submissions yet.</p>
              ) : (
                selectedAssignment.submissions.map((sub) => (
                  <div key={sub._id} className="bg-[var(--bg-sub)]/35 border border-[var(--border)] p-4 rounded-xl flex justify-between items-center text-xs font-bold gap-3 flex-wrap">
                    <div>
                      <h4 className="font-extrabold text-[var(--text-main)]">{sub.student?.fullName || 'Student'}</h4>
                      <p className="text-[10px] text-[var(--text-light)] font-semibold mt-0.5">
                        Submitted: {new Date(sub.submittedAt).toLocaleString()}
                      </p>
                      <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-[var(--primary)] hover:underline mt-2 block font-extrabold">View submission file</a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        sub.status === 'Graded' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {sub.status === 'Graded' ? `Graded: ${sub.grade}` : 'Pending Grade'}
                      </span>
                      <button 
                        onClick={() => { setSelectedSubmission(sub); setIsGradeModalOpen(true); }}
                        className="btn-primary text-[9px] py-1.5 px-3 uppercase font-black tracking-wider"
                      >
                        Evaluate
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grade submission Modal */}
      {isGradeModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-sm shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsGradeModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--bg-sub)]"
            >
              <FiX size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6">Evaluate & Grade</h3>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Student</span>
                <p className="text-sm font-extrabold text-[var(--text-main)] mt-0.5">{selectedSubmission.student?.fullName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Assign Grade</label>
                  <select 
                    value={gradeForm.grade}
                    onChange={(e) => setGradeForm({...gradeForm, grade: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Feedback</label>
                <textarea 
                  rows="2"
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({...gradeForm, feedback: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="Outline key comments..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsGradeModalOpen(false)}
                  className="btn-secondary py-3 px-5 text-xs font-black uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary py-3 px-6 text-xs font-black uppercase"
                >
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
