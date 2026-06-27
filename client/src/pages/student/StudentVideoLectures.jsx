import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { 
  FiPlayCircle, FiSearch, FiMonitor, FiUser, FiCalendar, 
  FiFilm, FiCheckCircle, FiClock, FiSettings, FiVolume2,
  FiMaximize, FiRotateCcw, FiPercent, FiChevronRight, FiPlay, FiLock
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentVideoLectures() {
  const [videos, setVideos] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [courses, setCourses] = useState([]);
  const [roadmapProgress, setRoadmapProgress] = useState(null);
  const [expandedPlaylists, setExpandedPlaylists] = useState({ 'General': true });

  // Refs for tracking
  const html5PlayerRef = useRef(null);
  const ytPlayer = useRef(null);
  const ytTrackingInterval = useRef(null);
  const lastSavedTime = useRef(0);
  const isAutoSeeking = useRef(false);

  useEffect(() => {
    loadLibraryData();
    // Load YouTube Iframe API if not loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    return () => {
      stopYtTracking();
      if (ytPlayer.current) {
        try { ytPlayer.current.destroy(); } catch (e) {}
      }
    };
  }, []);

  // Initialize YT player when selected video changes (and is embedded)
  useEffect(() => {
    if (!selectedVideo || selectedVideo.videoType !== 'embedded') {
      stopYtTracking();
      return;
    }

    const videoId = getYoutubeId(selectedVideo.url);
    const startSeconds = selectedVideo.progress?.watchTime || 0;

    // Helper to instantiate YT player
    const setupPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      
      try {
        ytPlayer.current = new window.YT.Player('yt-player-iframe', {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            enablejsapi: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              if (startSeconds > 0 && startSeconds < (selectedVideo.progress?.duration - 5 || 10000)) {
                event.target.seekTo(startSeconds, true);
              }
              event.target.setPlaybackRate(playbackSpeed);
            },
            onStateChange: (event) => {
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              if (event.data === 1) {
                startYtTracking();
              } else {
                stopYtTracking();
                const currentTime = event.target.getCurrentTime();
                const duration = event.target.getDuration();
                saveProgressToServer(selectedVideo._id, currentTime, duration, event.data === 0);
                if (event.data === 0) {
                  handleAutoPlayNext();
                }
              }
            }
          }
        });
      } catch (err) {
        console.error('Error instantiating YouTube player:', err);
      }
    };

    // If YT API is loaded, construct player immediately
    if (window.YT && window.YT.Player) {
      // Delay slightly to ensure the iframe element is rendered in DOM
      const timer = setTimeout(setupPlayer, 300);
      return () => clearTimeout(timer);
    } else {
      // API is loading, wait for standard callback
      window.onYouTubeIframeAPIReady = setupPlayer;
    }

    return () => {
      stopYtTracking();
    };
  }, [selectedVideo]);

  // Adjust playback speed for active player
  useEffect(() => {
    if (selectedVideo) {
      if (selectedVideo.videoType === 'uploaded' && html5PlayerRef.current) {
        html5PlayerRef.current.playbackRate = playbackSpeed;
      } else if (selectedVideo.videoType === 'embedded' && ytPlayer.current && ytPlayer.current.setPlaybackRate) {
        try {
          ytPlayer.current.setPlaybackRate(playbackSpeed);
        } catch (e) {}
      }
    }
  }, [playbackSpeed, selectedVideo]);

  const loadLibraryData = async () => {
    try {
      setLoading(true);

      let roadmapProgressData = null;
      try {
        const roadmapRes = await api.get('/roadmap-progress/my');
        roadmapProgressData = roadmapRes.data.data;
        setRoadmapProgress(roadmapProgressData);
      } catch (err) {
        console.error('Error fetching roadmap progress:', err);
      }

      const [videoRes, progressRes] = await Promise.all([
        api.get('/institute/videos'),
        api.get('/institute/videos/progress')
      ]);

      const videoList = videoRes.data.data;
      const progressList = progressRes.data.data;

      setProgress(progressList);

      // Extract unique courses from video list
      const uniqueCourses = [];
      const courseMap = {};
      videoList.forEach(v => {
        if (v.course && !courseMap[v.course._id]) {
          courseMap[v.course._id] = true;
          uniqueCourses.push(v.course);
        }
      });
      setCourses(uniqueCourses);

      // Map progress data onto video metadata
      const enriched = videoList.map(v => {
        const prog = progressList.find(p => p.video?._id === v._id || p.video === v._id);
        return {
          ...v,
          progress: prog ? {
            watchTime: prog.watchTime,
            duration: prog.duration,
            progressPercentage: prog.progressPercentage,
            isCompleted: prog.isCompleted,
            lastWatched: prog.lastWatched
          } : {
            watchTime: 0,
            duration: v.duration || 0,
            progressPercentage: 0,
            isCompleted: false,
            lastWatched: null
          }
        };
      });

      setVideos(enriched);
      
      // Auto-select first unlocked video if none is active
      if (enriched.length > 0 && !selectedVideo) {
        const firstUnlocked = enriched.find(v => {
          if (!roadmapProgressData) return true;
          if (!v.subject) return true;
          const sp = roadmapProgressData.subjectProgress.find(
            p => p.subjectName.toLowerCase() === v.subject.toLowerCase()
          );
          return sp ? sp.isUnlocked : true;
        });
        setSelectedVideo(firstUnlocked || enriched[0]);
      } else if (selectedVideo) {
        // Sync active selected video with new progress details
        const currentActive = enriched.find(ev => ev._id === selectedVideo._id);
        if (currentActive) setSelectedVideo(currentActive);
      }
    } catch (err) {
      console.error('Error loading video lectures:', err);
      toast.error('Failed to load video library');
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeId = (url) => {
    if (!url) return '';
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  // YouTube Progress Tracking Loops
  const startYtTracking = () => {
    stopYtTracking();
    ytTrackingInterval.current = setInterval(() => {
      if (ytPlayer.current && ytPlayer.current.getCurrentTime) {
        const currentTime = ytPlayer.current.getCurrentTime();
        const duration = ytPlayer.current.getDuration();
        
        // Save progress every 8 seconds, or when change is substantial
        if (Math.abs(currentTime - lastSavedTime.current) >= 8) {
          saveProgressToServer(selectedVideo._id, currentTime, duration, false);
          lastSavedTime.current = currentTime;
        }
      }
    }, 1000);
  };

  const stopYtTracking = () => {
    if (ytTrackingInterval.current) {
      clearInterval(ytTrackingInterval.current);
      ytTrackingInterval.current = null;
    }
  };

  // Save progress handler for HTML5 player
  const handleHtml5TimeUpdate = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    
    // Auto seek on metadata load (only once)
    if (!isAutoSeeking.current && selectedVideo?.progress?.watchTime > 0) {
      const savedTime = selectedVideo.progress.watchTime;
      // Don't auto-seek to start at the absolute end
      if (savedTime < (duration - 5)) {
        isAutoSeeking.current = true;
        e.target.currentTime = savedTime;
        toast.success(`Resumed from ${formatDuration(savedTime)}`, { id: 'resume-toast' });
      }
    }

    if (Math.abs(currentTime - lastSavedTime.current) >= 8 || Math.abs(currentTime - duration) < 0.5) {
      saveProgressToServer(selectedVideo._id, currentTime, duration, currentTime >= (duration - 2));
      lastSavedTime.current = currentTime;
    }
  };

  const handleHtml5Ended = (e) => {
    const duration = e.target.duration;
    saveProgressToServer(selectedVideo._id, duration, duration, true);
    handleAutoPlayNext();
  };

  const saveProgressToServer = async (videoId, watchTime, duration, isFinished) => {
    try {
      await api.post(`/institute/videos/${videoId}/progress`, {
        watchTime: Math.round(watchTime),
        duration: Math.round(duration),
        isCompleted: isFinished
      });
      // Silent load updates progress shelf quietly
      syncProgressState(videoId, watchTime, duration, isFinished);
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  // Sync state locally to update shelves instantly without full loading spinner
  const syncProgressState = (videoId, watchTime, duration, isCompleted) => {
    const pct = Math.min(100, Math.max(0, Math.round((watchTime / (duration || 1)) * 100)));
    const updatedIsCompleted = isCompleted || pct >= 95;

    setVideos(prev => prev.map(v => {
      if (v._id === videoId) {
        return {
          ...v,
          progress: {
            ...v.progress,
            watchTime: Math.round(watchTime),
            duration: Math.round(duration),
            progressPercentage: pct,
            isCompleted: updatedIsCompleted,
            lastWatched: new Date().toISOString()
          }
        };
      }
      return v;
    }));
  };

  const handleManualComplete = async (videoId) => {
    try {
      const res = await api.post(`/institute/videos/${videoId}/complete`);
      toast.success(res.data.data.isCompleted ? 'Video marked completed! 🎉' : 'Video marked incomplete');
      loadLibraryData();
    } catch (err) {
      console.error('Error toggling complete status:', err);
      toast.error('Failed to update completion status');
    }
  };

  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    const rawApiUrl = import.meta.env.VITE_API_URL || 'https://codewave-solution.onrender.com/api';
    const serverHost = rawApiUrl.replace(/\/api$/, '').replace(/\/$/, '');
    return `${serverHost}${path}`;
  };

  const resumeVideo = (video) => {
    isAutoSeeking.current = false;
    setSelectedVideo(video);
    setPlaybackSpeed(1);
    lastSavedTime.current = video.progress?.watchTime || 0;
  };

  const formatDuration = (sec) => {
    if (isNaN(sec) || sec === null || sec === undefined) return '0:00';
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = Math.floor(sec % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isLectureUnlocked = (v) => {
    if (!v) return false;
    if (!roadmapProgress) return true;
    if (!v.subject) return true;
    const sp = roadmapProgress.subjectProgress.find(
      p => p.subjectName.toLowerCase() === v.subject.toLowerCase()
    );
    return sp ? sp.isUnlocked : true;
  };

  const getPrevNextLectures = () => {
    if (!selectedVideo || filtered.length === 0) return { prev: null, next: null };
    
    // Sort filtered videos by playlistName and order
    const sortedVideos = [...filtered].sort((a, b) => {
      const playlistA = a.playlistName || 'General';
      const playlistB = b.playlistName || 'General';
      if (playlistA !== playlistB) {
        return playlistA.localeCompare(playlistB);
      }
      return (a.order || 0) - (b.order || 0);
    });

    const index = sortedVideos.findIndex(v => v._id === selectedVideo._id);
    if (index === -1) return { prev: null, next: null };

    return {
      prev: index > 0 ? sortedVideos[index - 1] : null,
      next: index < sortedVideos.length - 1 ? sortedVideos[index + 1] : null
    };
  };

  const handleAutoPlayNext = () => {
    const { next } = getPrevNextLectures();
    if (next) {
      if (isLectureUnlocked(next)) {
        toast.success(`Auto-playing next lecture: ${next.title} 🚀`);
        resumeVideo(next);
      } else {
        toast.error(`Next lecture "${next.title}" is locked by roadmap progression limits.`);
      }
    } else {
      toast.success('You have completed all lectures in this playlist! 🎉');
    }
  };

  const togglePlaylist = (name) => {
    setExpandedPlaylists(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Filter and Search Logic
  const getFilteredVideos = () => {
    return videos.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (v.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse = courseFilter === 'all' || (v.course?._id === courseFilter);
      return matchesSearch && matchesCourse;
    });
  };

  const filtered = getFilteredVideos();

  // Group videos by playlist Name
  const getGroupedPlaylists = () => {
    const groups = {};
    filtered.forEach(v => {
      const playlist = v.playlistName || 'General';
      if (!groups[playlist]) {
        groups[playlist] = [];
      }
      groups[playlist].push(v);
    });
    // Sort each playlist group by order ascending
    Object.keys(groups).forEach(playlist => {
      groups[playlist].sort((a, b) => (a.order || 0) - (b.order || 0));
    });
    return groups;
  };
  const groupedPlaylists = getGroupedPlaylists();

  // shelves computation
  const continueWatchingList = videos
    .filter(v => v.progress?.progressPercentage > 0 && !v.progress?.isCompleted)
    .sort((a, b) => new Date(b.progress?.lastWatched) - new Date(a.progress?.lastWatched));

  const recentlyWatchedList = videos
    .filter(v => v.progress?.lastWatched)
    .sort((a, b) => new Date(b.progress?.lastWatched) - new Date(a.progress?.lastWatched))
    .slice(0, 3);

  // Overall Statistics
  const completedCount = videos.filter(v => v.progress?.isCompleted).length;
  const totalCount = videos.length;
  const totalDurationSec = videos.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalWatchedSec = videos.reduce((acc, curr) => acc + (curr.progress?.watchTime || 0), 0);
  const overallPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const { prev: prevLecture, next: nextLecture } = getPrevNextLectures();

  if (loading && videos.length === 0) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg" />
        <div className="grid md:grid-cols-4 gap-6">
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-24 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[450px] bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-[450px] bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Interactive Video Lectures</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
          Review core concepts, track playback progression, and resume learning pipelines
        </p>
      </div>

      {/* 1. OVERALL PROGRESS & ANALYTICS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-3xl shadow-sm">
        <div className="p-3 text-center md:text-left">
          <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block">Completed Lectures</span>
          <span className="text-xl font-black text-[var(--text-main)] mt-1 block">🏆 {completedCount} / {totalCount}</span>
        </div>
        <div className="p-3 text-center md:text-left border-l border-[var(--border-light)]">
          <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block">Watch Progress Rate</span>
          <span className="text-xl font-black text-[var(--primary)] mt-1 block">📈 {overallPercentage}%</span>
        </div>
        <div className="p-3 text-center md:text-left border-l border-[var(--border-light)]">
          <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block">Total Course Duration</span>
          <span className="text-xl font-black text-rose-500 mt-1 block">⏰ {formatDuration(totalDurationSec)}</span>
        </div>
        <div className="p-3 text-center md:text-left border-l border-[var(--border-light)]">
          <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider block">Total Spent Watching</span>
          <span className="text-xl font-black text-indigo-500 mt-1 block">⚡ {formatDuration(totalWatchedSec)}</span>
        </div>
      </div>

      {/* 2. CONTINUE WATCHING SHELF */}
      {continueWatchingList.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase text-[var(--text-main)] tracking-widest flex items-center gap-1.5">
            <FiPlayCircle className="text-[var(--primary)] animate-pulse" /> Continue Watching
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {continueWatchingList.slice(0, 3).map(v => (
              <div 
                key={v._id} 
                className="group relative flex items-center gap-4 bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--primary)] rounded-2xl p-3 shadow-sm hover:shadow transition-all overflow-hidden"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0">
                  <img 
                    src={getFullUrl(v.thumbnailUrl) || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=150'} 
                    alt={v.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all">
                    <button 
                      onClick={() => resumeVideo(v)}
                      className="w-8 h-8 rounded-full bg-white/90 text-[var(--primary)] flex items-center justify-center shadow hover:scale-105 transition-all"
                    >
                      <FiPlay size={12} className="ml-0.5" />
                    </button>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-[var(--text-main)] truncate leading-tight">{v.title}</h4>
                  <p className="text-[9px] text-[var(--text-muted)] mt-1 font-extrabold uppercase truncate">{v.course?.courseName || 'General'}</p>
                  
                  {/* Progress Line */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex justify-between text-[8px] font-black text-[var(--text-light)]">
                      <span>{formatDuration(v.progress.watchTime)} left</span>
                      <span>{v.progress.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-1 bg-[var(--bg-sub)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[var(--primary)] to-indigo-500 rounded-full" 
                        style={{ width: `${v.progress.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MAIN AREA: Split Player & Playlist */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Active Player (Col-span 2) */}
        <div className="lg:col-span-2 space-y-4">
          {selectedVideo ? (
            <div className="space-y-4">
              
              {/* Custom Video Wrapper Box */}
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-[var(--border)] shadow-md">
                
                {selectedVideo.videoType === 'embedded' ? (
                  // YouTube Video Embed with Player API Target
                  <div className="w-full h-full">
                    <div id="yt-player-iframe" className="w-full h-full"></div>
                  </div>
                ) : (
                  // Direct HTML5 Video Stream Player
                  <video
                    key={selectedVideo._id}
                    ref={html5PlayerRef}
                    src={getFullUrl('/api/institute/videos/' + selectedVideo._id + '/stream?token=' + localStorage.getItem('cw_token'))}
                    controls
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleHtml5TimeUpdate}
                    onEnded={handleHtml5Ended}
                  />
                )}

              </div>

              {/* Video Player Info and Controls Card */}
              <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl shadow-sm space-y-5">
                
                {/* Header row details */}
                <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-[var(--border-light)]">
                  <div>
                    <h2 className="text-lg font-black text-[var(--text-main)] leading-snug">{selectedVideo.title}</h2>
                    <div className="flex flex-wrap gap-4 text-[10px] text-[var(--text-muted)] mt-1.5 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><FiUser /> Instructor: {selectedVideo.instructor || 'Class Mentor'}</span>
                      <span className="flex items-center gap-1"><FiMonitor /> Course: {selectedVideo.course?.courseName || 'General'}</span>
                      <span className="flex items-center gap-1"><FiClock /> Duration: {formatDuration(selectedVideo.duration)}</span>
                    </div>
                  </div>
                  
                  {/* Status Indicator pill */}
                  <span className={`px-3.5 py-1 text-[10px] font-black uppercase rounded-full tracking-wide border ${
                    selectedVideo.progress?.isCompleted
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                      : selectedVideo.progress?.progressPercentage > 0
                        ? 'bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20'
                        : 'bg-[var(--bg-sub)] text-[var(--text-muted)] border-[var(--border)]'
                  }`}>
                    {selectedVideo.progress?.isCompleted 
                      ? 'Completed ✅' 
                      : selectedVideo.progress?.progressPercentage > 0 
                        ? `Watching (${selectedVideo.progress.progressPercentage}%)`
                        : 'Not Started'}
                  </span>
                </div>

                {/* Customizable Playback Player Tools */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-sub)]/35 p-3 rounded-2xl border border-[var(--border-light)]">
                  {/* Previous / Next Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => resumeVideo(prevLecture)}
                      disabled={!prevLecture}
                      className="px-3.5 py-1.5 bg-[var(--bg-card)] border border-[var(--border)] text-[10px] font-black uppercase rounded-lg shadow-sm hover:bg-[var(--bg-sub)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      ⏮️ Prev
                    </button>
                    <button
                      onClick={() => handleAutoPlayNext()}
                      disabled={!nextLecture}
                      className="px-3.5 py-1.5 bg-[var(--bg-card)] border border-[var(--border)] text-[10px] font-black uppercase rounded-lg shadow-sm hover:bg-[var(--bg-sub)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      Next ⏭️
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-1">
                      <FiSettings /> Playback Speed
                    </span>
                    <div className="flex bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden p-0.5 shadow-sm">
                      {[0.5, 1, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-3 py-1.5 text-[10px] font-extrabold uppercase rounded-lg transition-all ${
                            playbackSpeed === speed
                              ? 'bg-[var(--primary)] text-white shadow-sm'
                              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleManualComplete(selectedVideo._id)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      selectedVideo.progress?.isCompleted
                        ? 'bg-[var(--bg-sub)] text-[var(--text-muted)] border border-[var(--border)] hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200'
                        : 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white shadow-md shadow-[var(--primary)]/10'
                    }`}
                  >
                    <FiCheckCircle />
                    {selectedVideo.progress?.isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                  </button>
                </div>

                {/* Description details */}
                <div>
                  <h4 className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest mb-1.5">Lecture Syllabus & Overview</h4>
                  <p className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
                    {selectedVideo.description || 'No detailed instructions provided for this topic. Follow along with the notes and check homework submissions.'}
                  </p>
                </div>

              </div>

              {/* Active Subject Progress Card */}
              {selectedVideo?.subject && roadmapProgress && (
                (() => {
                  const sp = roadmapProgress.subjectProgress.find(
                    p => p.subjectName.toLowerCase() === selectedVideo.subject.toLowerCase()
                  );
                  if (!sp) return null;
                  return (
                    <div className="card p-5 bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/25 rounded-3xl shadow-md text-white space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-black uppercase text-indigo-300 tracking-wider">Active Roadmap Module</span>
                          <h3 className="text-sm font-black text-white">{sp.subjectName}</h3>
                        </div>
                        <span className="text-xs font-black text-indigo-200 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                          {sp.completionPercentage}% Complete
                        </span>
                      </div>
                      <div className="w-full h-2 bg-indigo-950/50 rounded-full overflow-hidden border border-indigo-500/20">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full" 
                          style={{ width: `${sp.completionPercentage}%` }}
                        />
                      </div>
                      {sp.completionPercentage === 100 ? (
                        <p className="text-[10px] text-emerald-300 font-extrabold flex items-center gap-1">
                          ✨ Module complete! You are ready to take the {sp.subjectName} assessment.
                        </p>
                      ) : (
                        <p className="text-[10px] text-indigo-300 font-medium">
                          Complete all lectures in this module to unlock the assessment.
                        </p>
                      )}
                    </div>
                  );
                })()
              )}

            </div>
          ) : (
            <div className="h-full flex items-center justify-center card bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl py-24 text-center">
              <div className="space-y-2">
                <div className="text-5xl">📡</div>
                <p className="text-xs text-[var(--text-muted)] font-bold">Select a video lecture from the playlist to launch learning playback.</p>
              </div>
            </div>
          )}
        </div>

        {/* Playlist & Filters (Col-span 1) */}
        <div className="space-y-4">
          
          {/* Filters card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-4 shadow-sm space-y-3">
            
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-light)]">
                <FiSearch size={14} />
              </span>
              <input
                type="text"
                placeholder="Search lecture topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
              />
            </div>

            {/* Course Filter Dropdown */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Filter by Subject</label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
              >
                <option value="all">All Subjects / Courses</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.courseName}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Playlist Panel */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-4 shadow-sm space-y-3 h-[450px] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-wider">Playlist Lectures ({filtered.length})</h3>
              <span className="text-[9px] font-bold text-[var(--text-muted)] bg-[var(--bg-sub)] px-2 py-0.5 rounded-full border border-[var(--border-light)]">
                {completedCount} Completed
              </span>
            </div>

            <div className="space-y-4">
              {Object.keys(groupedPlaylists).length === 0 ? (
                <div className="text-center py-12 text-[var(--text-muted)]">
                  <FiFilm className="mx-auto text-2xl opacity-40 mb-2" />
                  <p className="text-xs font-bold">No lecture videos match filters.</p>
                </div>
              ) : (
                Object.keys(groupedPlaylists).map(playlistName => {
                  const isExpanded = expandedPlaylists[playlistName] !== false; // default true
                  const playlistVideos = groupedPlaylists[playlistName];
                  
                  return (
                    <div key={playlistName} className="space-y-1.5 border-b border-[var(--border-light)] pb-3 last:border-0 last:pb-0">
                      {/* Playlist Header (Toggle button) */}
                      <button
                        onClick={() => togglePlaylist(playlistName)}
                        className="w-full flex items-center justify-between py-2 px-1 text-left font-black uppercase text-[10px] text-[var(--text-light)] hover:text-[var(--text-main)] transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          📂 {playlistName} ({playlistVideos.length})
                        </span>
                        <span>{isExpanded ? '▼' : '▶'}</span>
                      </button>

                      {/* Playlist Videos List */}
                      {isExpanded && (
                        <div className="space-y-2 mt-1 pl-1">
                          {playlistVideos.map(v => {
                            const isSelected = selectedVideo?._id === v._id;
                            const isCompleted = v.progress?.isCompleted;
                            const hasProgress = v.progress?.progressPercentage > 0;

                            const isSubjectUnlocked = (() => {
                              if (!roadmapProgress) return true;
                              if (!v.subject) return true;
                              const sp = roadmapProgress.subjectProgress.find(
                                p => p.subjectName.toLowerCase() === v.subject.toLowerCase()
                              );
                              return sp ? sp.isUnlocked : true;
                            })();

                            const handleSelect = () => {
                              if (!isSubjectUnlocked) {
                                toast.error(`"${v.subject}" is locked. Complete the previous module's assessment first.`);
                                return;
                              }
                              resumeVideo(v);
                            };

                            return (
                              <button
                                key={v._id}
                                onClick={handleSelect}
                                className={`w-full flex gap-3 p-3.5 rounded-2xl transition-all border text-left items-start ${
                                  isSelected
                                    ? 'bg-[var(--primary-light)]/45 border-[var(--primary)] text-[var(--primary)]'
                                    : !isSubjectUnlocked
                                      ? 'bg-[var(--bg-sub)]/5 border-[var(--border-light)] text-[var(--text-muted)] opacity-55 cursor-not-allowed'
                                      : 'bg-[var(--bg-sub)]/15 border-[var(--border-light)] text-[var(--text-main)] hover:bg-[var(--bg-sub)]/35'
                                }`}
                              >
                                {/* Video Thumbnail/Icon Box */}
                                <div className="relative w-12 h-12 rounded-xl bg-black border border-[var(--border-light)] shrink-0 overflow-hidden">
                                  <img 
                                    src={getFullUrl(v.thumbnailUrl) || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=150'} 
                                    alt=""
                                    className="w-full h-full object-cover opacity-75"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center text-white/90">
                                    {!isSubjectUnlocked ? (
                                      <div className="bg-black/60 inset-0 absolute flex items-center justify-center text-rose-400">
                                        <FiLock size={16} />
                                      </div>
                                    ) : isCompleted ? (
                                      <FiCheckCircle className="text-emerald-400 bg-black/60 rounded-full" size={16} />
                                    ) : (
                                      <FiPlayCircle size={16} />
                                    )}
                                  </div>
                                </div>

                                {/* Video Details */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex justify-between items-start gap-1">
                                    <h4 className="text-xs font-black truncate leading-tight pr-1">
                                      {v.order !== undefined && <span className="text-[var(--text-light)] mr-1">#{v.order}</span>}
                                      {v.title}
                                    </h4>
                                  </div>
                                  <p className="text-[9px] text-[var(--text-muted)] font-extrabold uppercase mt-1 tracking-wider truncate">
                                    {v.course?.courseName || 'General'}
                                  </p>
                                  
                                  {/* Custom video type badge */}
                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <span className="text-[8px] font-bold text-[var(--text-light)]">⏰ {formatDuration(v.duration)}</span>
                                    <span className="text-[8px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)]">
                                      {v.videoType === 'embedded' ? 'YouTube' : 'Uploaded'}
                                    </span>
                                  </div>

                                  {/* Progress track */}
                                  {hasProgress && !isCompleted && (
                                    <div className="mt-2.5 w-full h-1 bg-[var(--bg-sub)] rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-[var(--primary)] rounded-full" 
                                        style={{ width: `${v.progress.progressPercentage}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
