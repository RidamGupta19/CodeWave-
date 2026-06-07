import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX, FiCalendar, FiClock, FiVideo, FiUser } from 'react-icons/fi';

export default function ClassScheduler() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    course: '',
    teacher: '',
    batch: '',
    date: '',
    time: '',
    meetingLink: '',
    topic: ''
  });

  useEffect(() => {
    fetchSchedules();
    if (user.role !== 'student') {
      fetchMetadata();
    }
  }, [user]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await api.get('/institute/schedules');
      setSchedules(res.data.data);
    } catch (err) {
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [crsRes, teaRes, batRes] = await Promise.all([
        api.get('/institute/courses'),
        api.get('/institute/teachers'),
        api.get('/institute/batches')
      ]);
      setCourses(crsRes.data.data);
      setTeachers(teaRes.data.data);
      setBatches(batRes.data.data);
    } catch (err) {
      console.log('Metadata load failed', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...form };
      // If teacher scheduling, assign their own teacher profile id
      if (user.role === 'teacher') {
        const matchingTeacher = teachers.find(t => t.userId === user._id);
        if (matchingTeacher) {
          dataToSend.teacher = matchingTeacher._id;
        }
      }
      await api.post('/institute/schedules', dataToSend);
      toast.success('Class scheduled successfully!');
      setIsAddModalOpen(false);
      setForm({
        course: '',
        teacher: '',
        batch: '',
        date: '',
        time: '',
        meetingLink: '',
        topic: ''
      });
      fetchSchedules();
    } catch (err) {
      toast.error('Scheduling failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this scheduled class?')) return;
    try {
      await api.delete(`/institute/schedules/${id}`);
      toast.success('Class cancelled');
      fetchSchedules();
    } catch (err) {
      toast.error('Failed to cancel class');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Class Schedule</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Check class timelines, live stream links and active lectures</p>
        </div>
        {user.role !== 'student' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-xs py-3 px-5"
          >
            <FiPlus strokeWidth={3} /> Schedule Class
          </button>
        )}
      </div>

      <div className="space-y-4 max-w-4xl">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="card p-10 text-center text-[var(--text-muted)] font-bold">
            No lectures scheduled.
          </div>
        ) : (
          schedules.map(item => (
            <div key={item._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex flex-col items-center justify-center text-xs font-black shadow-sm text-orange-600 shrink-0">
                  <FiClock size={16} />
                  <span className="text-[8px] tracking-wide mt-0.5">{item.time}</span>
                </div>
                
                <div>
                  <div className="flex flex-wrap gap-2 items-center mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {item.course?.courseName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-green-100 text-green-700 border border-green-200">
                      {item.batch?.batchName}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[var(--text-main)] leading-tight">{item.topic || 'Class Lecture'}</h3>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[var(--text-muted)] mt-2 font-bold">
                    <span className="flex items-center gap-1.5"><FiCalendar /> {new Date(item.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><FiUser /> Instructor: {item.teacher?.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                {item.meetingLink ? (
                  <a 
                    href={item.meetingLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 md:flex-none btn-primary py-2.5 px-5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <FiVideo /> Join Live Class
                  </a>
                ) : (
                  <span className="text-[10px] text-[var(--text-light)] font-bold uppercase tracking-wider pl-3">Link Pending</span>
                )}

                {user.role !== 'student' && (
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="p-2.5 hover:bg-red-500/10 text-rose-500 rounded-xl transition-colors border border-[var(--border)]"
                  >
                    <FiTrash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Class Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--bg-sub)]"
            >
              <FiX size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6">Schedule Class</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Lecture Topic / Syllabus Heading</label>
                <input 
                  type="text" 
                  required
                  value={form.topic}
                  onChange={(e) => setForm({...form, topic: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="e.g. React Component lifecycle & hooks"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Course</label>
                  <select 
                    required
                    value={form.course}
                    onChange={(e) => setForm({...form, course: e.target.value})}
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
                    value={form.batch}
                    onChange={(e) => setForm({...form, batch: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="">Select Batch</option>
                    {batches.map(b => <option key={b._id} value={b._id}>{b.batchName}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={form.date}
                    onChange={(e) => setForm({...form, date: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Timings (Time)</label>
                  <input 
                    type="text" 
                    required
                    value={form.time}
                    onChange={(e) => setForm({...form, time: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                    placeholder="e.g. 10:00 AM"
                  />
                </div>
              </div>

              {user.role === 'admin' && (
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Instructor</label>
                  <select 
                    required
                    value={form.teacher}
                    onChange={(e) => setForm({...form, teacher: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="">Select Instructor</option>
                    {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Meeting Link (Zoom / Meet)</label>
                <input 
                  type="url" 
                  value={form.meetingLink}
                  onChange={(e) => setForm({...form, meetingLink: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="https://meet.google.com/..."
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
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
