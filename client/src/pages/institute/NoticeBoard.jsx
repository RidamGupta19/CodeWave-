import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX, FiBell, FiCalendar } from 'react-icons/fi';

export default function NoticeBoard() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    targetRoles: ['all']
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/institute/notices');
      setNotices(res.data.data);
    } catch (err) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/institute/notices', form);
      toast.success('Notice published successfully!');
      setIsAddModalOpen(false);
      setForm({ title: '', content: '', targetRoles: ['all'] });
      fetchNotices();
    } catch (err) {
      toast.error('Publish failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await api.delete(`/institute/notices/${id}`);
      toast.success('Notice deleted');
      fetchNotices();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const handleTargetChange = (role) => {
    let updated;
    if (form.targetRoles.includes(role)) {
      updated = form.targetRoles.filter(r => r !== role);
      if (updated.length === 0) updated = ['all'];
    } else {
      updated = form.targetRoles.filter(r => r !== 'all');
      updated.push(role);
    }
    setForm({ ...form, targetRoles: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Notice Board</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Check daily announcements, events and updates</p>
        </div>
        {user.role === 'admin' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-xs py-3 px-5"
          >
            <FiPlus strokeWidth={3} /> Post Notice
          </button>
        )}
      </div>

      <div className="space-y-4 max-w-4xl">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : notices.length === 0 ? (
          <div className="card p-10 text-center text-[var(--text-muted)] font-bold">
            No active notices on the board.
          </div>
        ) : (
          notices.map(notice => (
            <div key={notice._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all relative flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-lg shadow-sm text-orange-500">
                    <FiBell />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[var(--text-main)]">{notice.title}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-light)] font-bold mt-0.5">
                      <FiCalendar />
                      <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {notice.targetRoles?.map(r => (
                      <span key={r} className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-muted)]">
                        {r}
                      </span>
                    ))}
                  </div>
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => handleDelete(notice._id)} 
                      className="p-1.5 hover:bg-red-500/10 text-rose-500 rounded-lg shrink-0"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-[var(--text-main)] leading-relaxed mt-2 whitespace-pre-line font-medium bg-[var(--bg-sub)]/10 p-3 rounded-xl border border-[var(--border)]/50">
                {notice.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Post Notice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--bg-sub)]"
            >
              <FiX size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6">Post Notice</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Notice Title</label>
                <input 
                  type="text" 
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="e.g. Scheduled Maintenance or Holiday Notice"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-2">Target Audience</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={form.targetRoles.includes('all')} 
                      onChange={() => setForm({ ...form, targetRoles: ['all'] })}
                      className="accent-[var(--primary)]"
                    />
                    <span>All Users</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={form.targetRoles.includes('student')} 
                      onChange={() => handleTargetChange('student')}
                      className="accent-[var(--primary)]"
                    />
                    <span>Students</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)] cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={form.targetRoles.includes('teacher')} 
                      onChange={() => handleTargetChange('teacher')}
                      className="accent-[var(--primary)]"
                    />
                    <span>Teachers</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Announcement Body</label>
                <textarea 
                  rows="4"
                  required
                  value={form.content}
                  onChange={(e) => setForm({...form, content: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="Draft the message content..."
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
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
