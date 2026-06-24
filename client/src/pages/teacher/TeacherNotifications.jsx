import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiBell, FiPlus, FiTrash2, FiSearch, FiX, FiCheckCircle } from 'react-icons/fi';

export default function TeacherNotifications() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    targetRoles: 'all' // 'all' or 'student'
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
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
      const payload = {
        title: form.title,
        content: form.content,
        targetRoles: form.targetRoles === 'all' ? ['all'] : ['student']
      };

      await api.post('/institute/notices', payload);
      toast.success('Notice bulletin published successfully! 📢');
      setIsAddModalOpen(false);
      setForm({ title: '', content: '', targetRoles: 'all' });
      fetchNotices();
    } catch (err) {
      toast.error('Failed to post announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice announcement?')) return;
    try {
      await api.delete(`/institute/notices/${id}`);
      toast.success('Notice deleted');
      fetchNotices();
    } catch (err) {
      toast.error('Failed to delete notice');
    }
  };

  const filtered = notices.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && notices.length === 0) {
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
          <h1 className="text-2xl font-black text-[var(--text-main)]">Notice Board Announcements</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
            Publish general updates, course alerts, or guidelines to students and faculty
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-black uppercase rounded-xl shadow-md shadow-[var(--primary)]/10 flex items-center gap-1.5"
        >
          <FiPlus /> Broadcast Notice
        </button>
      </div>

      {/* Filter strip */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
        <div className="text-xs font-black uppercase text-[var(--text-light)] tracking-wider">
          Notice logs index ({filtered.length})
        </div>
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-light)]">
            <FiSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search notice body..."
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
            <div className="text-4xl mb-4">📢</div>
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">No Announcements Posted</h3>
            <p className="text-xs font-semibold">You have not published any news bulletings or alerts at this time.</p>
          </div>
        ) : (
          filtered.map(notice => (
            <div key={notice._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5">
              <div>
                <div className="flex justify-between items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[8px] font-black uppercase rounded bg-indigo-50 border border-indigo-100 text-[var(--accent)] tracking-wider">
                    Target: {notice.targetRoles?.join(', ')}
                  </span>
                  <span className="text-[9px] font-bold text-[var(--text-light)]">
                    🗓️ {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-extrabold text-[var(--text-main)] text-base mt-4 line-clamp-2 leading-snug">{notice.title}</h3>
                <p className="text-xs text-[var(--text-muted)] font-semibold mt-2 leading-relaxed whitespace-pre-line">{notice.content}</p>
              </div>

              <div className="pt-3 border-t border-[var(--border-light)] flex justify-end">
                <button
                  onClick={() => handleDelete(notice._id)}
                  className="px-3.5 py-2 bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <FiTrash2 /> Remove Notice
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Notice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <h2 className="text-sm font-black uppercase text-[var(--text-main)]">Broadcast Announcement</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-light)] hover:text-[var(--text-main)]">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Bulletin Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="e.g. Schedule Change for Batch Alpha"
                />
              </div>

              {/* Target Roles */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Target Audience</label>
                <select
                  value={form.targetRoles}
                  onChange={(e) => setForm({...form, targetRoles: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                >
                  <option value="all">Everyone (All Students & Faculty)</option>
                  <option value="student">Students Only</option>
                </select>
              </div>

              {/* Content */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Notice content description</label>
                <textarea
                  required
                  value={form.content}
                  onChange={(e) => setForm({...form, content: e.target.value})}
                  rows="4"
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="Write announcement body details here..."
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-black uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <FiBell /> Broadcast Announcement
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
