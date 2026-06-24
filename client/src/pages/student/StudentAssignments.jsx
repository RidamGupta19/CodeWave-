import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FiBook, FiUploadCloud, FiCheckCircle, FiClock, FiFileText, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Submit modal states
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const [assignRes, dashRes] = await Promise.all([
        api.get('/institute/assignments'),
        api.get('/institute/dashboard/student')
      ]);
      setAssignments(assignRes.data.data);
      setStudentProfile(dashRes.data.data.student);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionStatus = (assignment) => {
    if (!studentProfile) return { status: 'Pending', data: null };
    const sub = assignment.submissions?.find(s => s.student?.toString() === studentProfile._id?.toString() || s.student?._id?.toString() === studentProfile._id?.toString());
    if (sub) {
      return { status: sub.status, data: sub };
    }
    return { status: 'Pending', data: null };
  };

  const handleOpenSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    const { data } = getSubmissionStatus(assignment);
    setSubmitUrl(data ? data.fileUrl : '');
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!submitUrl.trim()) return toast.error('Please input a valid URL or link');
    
    try {
      setSubmitting(true);
      await api.post(`/institute/assignments/${selectedAssignment._id}/submit`, { fileUrl: submitUrl });
      toast.success('Assignment submitted successfully!');
      setSelectedAssignment(null);
      setSubmitUrl('');
      fetchAssignments();
    } catch (err) {
      console.error('Submission failed:', err);
      toast.error('Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Assignments & Grades</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Submit your classroom tasks and inspect graded reports from course mentors</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
        </div>
      ) : assignments.length === 0 ? (
        <div className="card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">No Assignments Active</h3>
          <p className="text-xs font-semibold">Your mentors haven't uploaded any homework for this batch yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map(a => {
            const { status, data: submission } = getSubmissionStatus(a);
            const isOverdue = new Date(a.dueDate) < new Date() && status === 'Pending';

            return (
              <div key={a._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase text-[var(--text-light)]">Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                    
                    {status === 'Graded' && (
                      <span className="px-2.5 py-0.5 bg-green-100 text-[var(--success)] border border-green-200 text-[9px] font-black uppercase rounded-md tracking-wider flex items-center gap-1">
                        <FiCheck size={10} /> Graded
                      </span>
                    )}
                    {status === 'Pending' && (
                      <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase rounded-md tracking-wider flex items-center gap-1 border ${
                        isOverdue 
                          ? 'bg-red-100 text-rose-500 border-red-200' 
                          : 'bg-orange-100 text-orange-500 border-orange-200'
                      }`}>
                        <FiClock size={10} /> {isOverdue ? 'Overdue' : 'Pending'}
                      </span>
                    )}
                    {status === 'Submitted' && (
                      <span className="px-2.5 py-0.5 bg-blue-100 text-[var(--accent)] border border-blue-200 text-[9px] font-black uppercase rounded-md tracking-wider flex items-center gap-1">
                        <FiCheckCircle size={10} /> Submitted
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-[var(--text-main)] text-base mt-4 line-clamp-1 leading-snug">{a.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] font-semibold mt-2 line-clamp-3 leading-relaxed">{a.description}</p>

                  {/* Grading Feedback Block */}
                  {status === 'Graded' && submission && (
                    <div className="mt-4 p-3 bg-[var(--bg-sub)]/35 border border-[var(--border)] rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-[var(--text-light)]">
                        <span>Teacher Grade:</span>
                        <span className="text-[var(--success)]">{submission.grade || 'A+'}</span>
                      </div>
                      {submission.feedback && (
                        <p className="text-[10px] text-[var(--text-muted)] font-semibold leading-relaxed italic mt-1">
                          "{submission.feedback}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Submission link if completed */}
                  {submission && (
                    <div className="text-[10px] font-bold text-[var(--text-muted)] mt-4">
                      Submitted File: <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="text-[var(--primary)] hover:underline truncate block">{submission.fileUrl}</a>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[var(--border-light)]">
                  <button
                    onClick={() => handleOpenSubmit(a)}
                    className="w-full btn-secondary text-center py-2.5 text-xs font-black uppercase flex items-center justify-center gap-2"
                  >
                    <FiUploadCloud /> {status === 'Pending' ? 'Upload Submission' : 'Resubmit Homework'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAssignment(null)}></div>
          <div className="relative bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-black uppercase text-[var(--text-light)] tracking-widest">Submission Portal</h3>
                <h2 className="text-base font-black text-[var(--text-main)] mt-1">{selectedAssignment.title}</h2>
              </div>
              <button onClick={() => setSelectedAssignment(null)} className="p-1 hover:bg-[var(--bg-sub)] rounded-lg text-[var(--text-muted)]">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider block">Submission URL / Link</label>
                <input
                  type="url"
                  placeholder="https://github.com/yourproject or cloud drive link..."
                  value={submitUrl}
                  onChange={(e) => setSubmitUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/50 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 text-xs font-black uppercase shadow-md flex justify-center items-center gap-2"
              >
                {submitting ? 'Uploading Submission...' : 'Send Homework Link'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
