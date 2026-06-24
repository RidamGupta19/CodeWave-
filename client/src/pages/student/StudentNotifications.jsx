import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiBell, FiSearch, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentNotifications() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/notices');
      setNotices(res.data.data);
    } catch (err) {
      console.error('Error fetching notices:', err);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.content || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Noticeboard announcements</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Stay updated with classroom shifts, holiday schedules, and event updates</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-light)]">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4 max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">No Announcements Found</h3>
            <p className="text-xs font-semibold">There are no notices posted for your profile role at this time.</p>
          </div>
        ) : (
          filteredNotices.map(notice => (
            <div key={notice._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm hover:border-[var(--primary)] transition-all space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[var(--secondary)] flex items-center justify-center text-lg shrink-0 border border-orange-100">
                    <FiBell />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[var(--text-main)] leading-snug">{notice.title}</h3>
                    <p className="text-[10px] text-[var(--text-light)] font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                      <FiCalendar /> Published: {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed pl-1 whitespace-pre-wrap">
                {notice.content}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
