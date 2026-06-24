import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  FiPlus, FiTrash2, FiX, FiCalendar, FiClock, FiVideo, 
  FiUser, FiExternalLink, FiSearch 
} from 'react-icons/fi';

export default function TeacherLiveClasses() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [form, setForm] = useState({
    course: '',
    batch: '',
    date: '',
    time: '',
    meetingLink: '',
    topic: ''
  });

  useEffect(() => {
    fetchSchedules();
    fetchMetadata();
  }, []);

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
      // Find the teacher's profile first
      const teacherRes = await api.get('/institute/dashboard/teacher');
      const teacherId = teacherRes.data.data?.teacher?._id;

      if (!teacherId) {
        toast.error('Teacher profile not found. Cannot schedule class.');
        return;
      }

      const payload = {
        ...form,
        teacher: teacherId
      };

      await api.post('/institute/schedules', payload);
      toast.success('Class scheduled successfully! 📡');
      setIsAddModalOpen(false);
      setForm({
        course: '',
        batch: '',
        date: '',
        time: '',
        meetingLink: '',
        topic: ''
      });
      fetchSchedules();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Scheduling failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this scheduled class?')) return;
    try {
      await api.delete(`/institute/schedules/${id}`);
      toast.success('Class cancelled successfully');
      fetchSchedules();
    } catch (err) {
      toast.error('Failed to cancel class');
    }
  };

  const filtered = schedules.filter(s =>
    s.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.batch?.batchName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && schedules.length === 0) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg" />
        <div className="h-48 bg-[var(--bg-sub)]/30 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Virtual Classroom Timetable</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
            Schedule live lectures, provide meet links, and manage your online class schedules
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-black uppercase rounded-xl shadow-md shadow-[var(--primary)]/10 flex items-center gap-1.5"
        >
          <FiPlus /> Schedule New Class
        </button>
      </div>

      {/* Filter strip */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
        <div className="text-xs font-black uppercase text-[var(--text-light)] tracking-wider">
          Class Logs Index ({filtered.length})
        </div>
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-light)]">
            <FiSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search class topic or batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
            <div className="text-4xl mb-4">📡</div>
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">No Lectures Scheduled</h3>
            <p className="text-xs font-semibold">You have no upcoming or past live classes scheduled at this time.</p>
          </div>
        ) : (
          filtered.map(schedule => {
            const isLive = schedule.status === 'LIVE';
            const isCompleted = schedule.status === 'COMPLETED';

            return (
              <div 
                key={schedule._id} 
                className={`card p-6 bg-[var(--bg-card)] border rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 ${
                  isLive ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-[var(--border)]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center gap-2">
                    <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase rounded border ${
                      isLive 
                        ? 'bg-rose-50 text-rose-500 border-rose-100 animate-pulse' 
                        : isCompleted
                          ? 'bg-[var(--bg-sub)] text-[var(--text-light)] border-[var(--border)]'
                          : 'bg-[var(--primary-light)]/40 text-[var(--primary)] border-[var(--primary-light)]'
                    }`}>
                      {schedule.status}
                    </span>
                    <span className="text-[9px] font-bold text-[var(--text-light)] flex items-center gap-1">
                      <FiCalendar /> {new Date(schedule.date).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[var(--text-main)] text-base mt-4 line-clamp-2 leading-snug">{schedule.topic}</h3>
                  
                  <div className="space-y-1.5 text-[10px] text-[var(--text-muted)] font-bold mt-4 pt-3 border-t border-[var(--border-light)]">
                    <div className="flex justify-between"><span className="text-[var(--text-light)]">Class Time:</span> <span className="text-[var(--text-main)]">⏰ {schedule.time}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-light)]">Batch target:</span> <span className="text-[var(--text-main)]">{schedule.batch?.batchName || 'General'}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-light)]">Subject:</span> <span className="text-[var(--text-main)] truncate max-w-[140px]">{schedule.course?.courseName || 'General'}</span></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-light)] flex gap-2">
                  <a
                    href={schedule.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2.5 text-xs font-black uppercase flex items-center justify-center gap-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm"
                  >
                    <FiVideo /> Launch
                  </a>
                  <button
                    onClick={() => handleDelete(schedule._id)}
                    className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl border border-rose-100 flex items-center justify-center transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <h2 className="text-sm font-black uppercase text-[var(--text-main)]">Schedule Live Lecture</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-light)] hover:text-[var(--text-main)]">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Topic */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Lecture Topic / Syllabus Title</label>
                <input
                  type="text"
                  required
                  value={form.topic}
                  onChange={(e) => setForm({...form, topic: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="e.g. Redux Toolkit Middleware Architecture"
                />
              </div>

              {/* Course */}
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

              {/* Batch */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Target Batch</label>
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

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({...form, date: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Time</label>
                  <input
                    type="text"
                    required
                    value={form.time}
                    onChange={(e) => setForm({...form, time: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                    placeholder="e.g. 10:00 AM"
                  />
                </div>
              </div>

              {/* Meeting Link */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Meeting Room URL (Meet/Zoom)</label>
                <input
                  type="url"
                  required
                  value={form.meetingLink}
                  onChange={(e) => setForm({...form, meetingLink: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-black uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <FiVideo /> Broadcast Schedule
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
