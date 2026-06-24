import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiTrendingUp, FiVideo, FiSearch, FiClock, FiPlayCircle, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentLiveClasses() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('upcoming'); // 'upcoming' or 'past'

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/schedules');
      setSchedules(res.data.data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      toast.error('Failed to load class schedules');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSchedules = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matchesSearch = schedules.filter(s => 
      s.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.course?.courseName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.teacher?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeFilter === 'upcoming') {
      return matchesSearch.filter(s => new Date(s.date) >= today);
    } else {
      return matchesSearch.filter(s => new Date(s.date) < today);
    }
  };

  const filtered = getFilteredSchedules();

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Live Lectures & Schedule</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Join active virtual classrooms and track upcoming batch curriculum timings</p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
        
        {/* Toggle Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`flex-1 md:flex-initial px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all rounded-xl ${
              activeFilter === 'upcoming' 
                ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/10' 
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-sub)] hover:text-[var(--text-main)]'
            }`}
          >
            Upcoming Sessions
          </button>
          <button
            onClick={() => setActiveFilter('past')}
            className={`flex-1 md:flex-initial px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all rounded-xl ${
              activeFilter === 'past' 
                ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/10' 
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-sub)] hover:text-[var(--text-main)]'
            }`}
          >
            Past Sessions
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-light)]">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by topic or mentor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-sub)]/50 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
          />
        </div>

      </div>

      {/* Class Schedule Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">No Lectures Listed</h3>
            <p className="text-xs font-semibold">We couldn't find any schedules matching your criteria.</p>
          </div>
        ) : (
          filtered.map(schedule => {
            const isToday = new Date(schedule.date).toDateString() === new Date().toDateString();
            const schedDate = new Date(schedule.date);

            return (
              <div key={schedule._id} className={`card p-6 bg-[var(--bg-card)] border rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 ${
                isToday ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]/20' : 'border-[var(--border)]'
              }`}>
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <span className={`px-2.5 py-1 text-[9px] uppercase font-black tracking-wider rounded-lg border ${
                      isToday 
                        ? 'bg-green-100 text-[var(--brand-green)] border-green-200' 
                        : 'bg-[var(--bg-sub)] text-[var(--text-muted)] border-[var(--border)]'
                    }`}>
                      {isToday ? 'Today' : schedDate.toLocaleDateString()}
                    </span>
                    <span className="text-[10px] text-[var(--text-light)] font-bold">⏰ {schedule.time}</span>
                  </div>

                  <h3 className="font-extrabold text-[var(--text-main)] text-base mt-4 line-clamp-2 leading-snug">{schedule.topic}</h3>
                  <div className="space-y-1.5 text-[11px] text-[var(--text-muted)] font-bold mt-4 pt-3 border-t border-[var(--border-light)]">
                    <div className="flex justify-between"><span className="text-[var(--text-light)]">Batch:</span> <span className="text-[var(--text-main)] truncate max-w-[140px]">{schedule.batch?.batchName || 'General'}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-light)]">Course:</span> <span className="text-[var(--text-main)] truncate max-w-[140px]">{schedule.course?.courseName || 'General'}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-light)]">Mentor:</span> <span className="text-[var(--primary)]">{schedule.teacher?.name || 'Class Instructor'}</span></div>
                  </div>
                </div>

                {activeFilter === 'upcoming' ? (
                  <a
                    href={schedule.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full btn-primary text-center py-2.5 text-xs font-black uppercase flex items-center justify-center gap-2"
                  >
                    <FiVideo /> Join Virtual Room
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 bg-[var(--bg-sub)]/60 text-[var(--text-light)] rounded-xl text-xs font-black uppercase text-center cursor-not-allowed border border-[var(--border)]"
                  >
                    Lecture Completed
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
