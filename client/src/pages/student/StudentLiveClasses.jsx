import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FiVideo, FiSearch, FiClock, FiCalendar, FiBookOpen, 
  FiExternalLink, FiTv, FiAlertCircle, FiBell 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentLiveClasses() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

  useEffect(() => {
    fetchLiveClasses();
    // Auto-refresh schedules every 60 seconds to update countdowns and live beacons!
    const interval = setInterval(fetchLiveClasses, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveClasses = async () => {
    try {
      const res = await api.get('/institute/schedules');
      setSchedules(res.data.data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      toast.error('Failed to update live class list');
    } finally {
      setLoading(false);
    }
  };

  // Get active live session if any exists
  const liveSession = schedules.find(s => s.status === 'LIVE');

  // Get near start alert session if any starts in <= 30 minutes
  const alertSession = schedules.find(s => s.status === 'UPCOMING' && s.minutesToStart > 0 && s.minutesToStart <= 30);

  // Platform detector helper
  const getPlatformDetails = (url) => {
    const cleanUrl = (url || '').toLowerCase();
    if (cleanUrl.includes('zoom.us')) {
      return { name: 'Zoom Video', color: 'bg-blue-50 text-blue-500 border-blue-100', icon: '📹' };
    }
    if (cleanUrl.includes('meet.google.com')) {
      return { name: 'Google Meet', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: '📡' };
    }
    return { name: 'Virtual Room', color: 'bg-indigo-50 text-indigo-500 border-indigo-100', icon: '🔗' };
  };

  const getFilteredSchedules = () => {
    const matchesSearch = schedules.filter(s =>
      s.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.course?.courseName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.teacher?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeTab === 'upcoming') {
      // Show both UPCOMING and LIVE sessions in upcoming tab
      return matchesSearch.filter(s => s.status === 'LIVE' || s.status === 'UPCOMING');
    } else {
      return matchesSearch.filter(s => s.status === 'COMPLETED');
    }
  };

  const filtered = getFilteredSchedules();

  if (loading && schedules.length === 0) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-28 bg-[var(--bg-sub)]/30 rounded-3xl" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-48 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-48 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-48 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Virtual Classroom schedules</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
          Launch live classes, track daily timetables, and review session playbacks
        </p>
      </div>

      {/* 1. CRITICAL COUNTDOWN ALERT NOTIFICATION */}
      {alertSession && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between gap-4 animate-bounce shadow-sm dark:bg-zinc-900 dark:border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <FiBell className="animate-swing" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black text-orange-800 dark:text-orange-400">Classroom Commencing Soon</h4>
              <p className="text-xs text-orange-600 dark:text-orange-500/90 font-bold">
                "{alertSession.topic}" starts in <span className="font-black text-rose-500">{alertSession.minutesToStart} minutes</span>. Get your notebooks ready!
              </p>
            </div>
          </div>
          <a
            href={alertSession.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black uppercase shadow-sm"
          >
            Launch Room
          </a>
        </div>
      )}

      {/* 2. ACTIVE LIVE SESSION HERO BANNER */}
      {liveSession && (
        <div className="bg-gradient-to-r from-rose-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden ring-4 ring-rose-500/20">
          <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center text-9xl pointer-events-none pr-8">
            📡
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                  Live Classroom Active Now
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">{liveSession.topic}</h2>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-rose-100">
                <span>Instructor: {liveSession.teacher?.name || 'Class Mentor'}</span>
                <span>|</span>
                <span>Batch: {liveSession.batch?.batchName}</span>
              </div>
            </div>
            <a
              href={liveSession.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto btn-primary py-3 px-8 bg-white text-[var(--primary)] hover:bg-zinc-100 text-sm font-black uppercase rounded-2xl shadow-lg shadow-black/10 flex items-center justify-center gap-2"
            >
              <FiTv /> Join Room Now <FiExternalLink />
            </a>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
        
        {/* Toggle Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 md:flex-initial px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all rounded-xl ${
              activeTab === 'upcoming' 
                ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/10' 
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-sub)] hover:text-[var(--text-main)]'
            }`}
          >
            Timetable Schedules
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 md:flex-initial px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all rounded-xl ${
              activeTab === 'past' 
                ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/10' 
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-sub)] hover:text-[var(--text-main)]'
            }`}
          >
            History playbacks
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-light)]">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search class topic or mentor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-sub)]/50 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
          />
        </div>

      </div>

      {/* Class Schedules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
            <div className="text-4xl mb-4">📡</div>
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">No sessions listed</h3>
            <p className="text-xs font-semibold">There are no virtual classes listed under this category at this time.</p>
          </div>
        ) : (
          filtered.map(schedule => {
            const platform = getPlatformDetails(schedule.meetingLink);
            const schedDate = new Date(schedule.date);
            const isLive = schedule.status === 'LIVE';

            return (
              <div 
                key={schedule._id} 
                className={`card p-6 bg-[var(--bg-card)] border rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 ${
                  isLive ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-[var(--border)]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase rounded-md tracking-wider border ${
                      isLive 
                        ? 'bg-red-100 text-rose-600 border-red-200 animate-pulse' 
                        : 'bg-[var(--bg-sub)] text-[var(--text-muted)] border-[var(--border)]'
                    }`}>
                      {isLive ? 'LIVE' : schedDate.toLocaleDateString()}
                    </span>
                    
                    <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase rounded-md tracking-wider border ${platform.color}`}>
                      {platform.icon} {platform.name}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[var(--text-main)] text-base mt-4 line-clamp-2 leading-snug">{schedule.topic}</h3>
                  
                  <div className="space-y-1.5 text-[10px] text-[var(--text-muted)] font-bold mt-4 pt-3 border-t border-[var(--border-light)]">
                    <div className="flex justify-between"><span className="text-[var(--text-light)]">Time details:</span> <span className="text-[var(--text-main)]">⏰ {schedule.time}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-light)]">Course syllabus:</span> <span className="text-[var(--text-main)] truncate max-w-[140px]">{schedule.course?.courseName || 'General'}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--text-light)]">Instructor:</span> <span className="text-[var(--primary)]">{schedule.teacher?.name || 'Class Mentor'}</span></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-light)]">
                  {schedule.status === 'COMPLETED' ? (
                    <button
                      disabled
                      className="w-full py-2.5 bg-[var(--bg-sub)]/60 text-[var(--text-light)] rounded-xl text-xs font-black uppercase text-center cursor-not-allowed border border-[var(--border)]"
                    >
                      Class Completed
                    </button>
                  ) : (
                    <a
                      href={schedule.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-full text-center py-2.5 text-xs font-black uppercase flex items-center justify-center gap-1.5 rounded-xl transition-all ${
                        isLive
                          ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10'
                          : 'btn-primary'
                      }`}
                    >
                      <FiVideo /> {isLive ? 'Launch Live Class' : 'Join Virtual Room'}
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
