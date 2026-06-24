import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FiFilm, FiPlus, FiTrash2, FiSearch, FiX, 
  FiClock, FiUser, FiBarChart2, FiCheckCircle, FiPlayCircle 
} from 'react-icons/fi';

export default function TeacherVideoLectures() {
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  
  // Active selected video for checking student progress stats
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [studentProgress, setStudentProgress] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    videoType: 'embedded',
    url: '',
    thumbnailUrl: '',
    duration: '',
    course: '',
    batch: '',
    instructor: ''
  });

  useEffect(() => {
    fetchVideos();
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      fetchStudentProgress(selectedVideo._id);
    } else {
      setStudentProgress([]);
    }
  }, [selectedVideo]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/videos');
      setVideos(res.data.data);
      if (res.data.data.length > 0 && !selectedVideo) {
        setSelectedVideo(res.data.data[0]);
      }
    } catch (err) {
      toast.error('Failed to load video library');
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

  const fetchStudentProgress = async (videoId) => {
    try {
      setLoadingProgress(true);
      const res = await api.get(`/institute/videos/progress?videoId=${videoId}`);
      setStudentProgress(res.data.data);
    } catch (err) {
      console.error('Failed to fetch student progress logs', err);
    } finally {
      setLoadingProgress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        duration: Number(form.duration) || 0
      };
      await api.post('/institute/videos', payload);
      toast.success('Video lecture uploaded successfully! 🎥');
      setIsAddModalOpen(false);
      setForm({
        title: '',
        description: '',
        videoType: 'embedded',
        url: '',
        thumbnailUrl: '',
        duration: '',
        course: '',
        batch: '',
        instructor: ''
      });
      fetchVideos();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload video');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this video lecture permanently?')) return;
    try {
      await api.delete(`/institute/videos/${id}`);
      toast.success('Video deleted successfully');
      if (selectedVideo?._id === id) {
        setSelectedVideo(null);
      }
      fetchVideos();
    } catch (err) {
      toast.error('Failed to delete video');
    }
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

  const filtered = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (v.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || (v.course?._id === courseFilter);
    return matchesSearch && matchesCourse;
  });

  if (loading && videos.length === 0) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="h-96 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="lg:col-span-2 h-96 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Recorded Video Library</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
            Upload recorded session playbacks and review student watch progress metrics
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-black uppercase rounded-xl shadow-md shadow-[var(--primary)]/10 flex items-center gap-1.5"
        >
          <FiPlus /> Upload Video Lecture
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
          <div className="text-5xl mb-4">🎥</div>
          <h3 className="text-lg font-black text-[var(--text-main)] mb-1">No Video Lectures</h3>
          <p className="text-xs font-semibold max-w-md mx-auto">You have not uploaded any recorded video lectures yet. Click the button above to upload your first video.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left: Playlist Selection */}
          <div className="space-y-4">
            
            {/* Filters */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-light)]">
                  <FiSearch size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Search video topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
                />
              </div>

              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
              >
                <option value="all">All Subjects</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.courseName}</option>
                ))}
              </select>
            </div>

            {/* List */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm space-y-2 h-[350px] overflow-y-auto no-scrollbar">
              <h3 className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-wider px-1 mb-2">Lectures Directory</h3>
              {filtered.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] font-bold text-center py-6">No matching lectures.</p>
              ) : (
                filtered.map(v => {
                  const isSelected = selectedVideo?._id === v._id;
                  return (
                    <div
                      key={v._id}
                      onClick={() => setSelectedVideo(v)}
                      className={`w-full p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-start gap-2 ${
                        isSelected 
                          ? 'bg-[var(--primary-light)]/45 border-[var(--primary)] text-[var(--primary)]' 
                          : 'bg-[var(--bg-sub)]/10 border-[var(--border-light)] text-[var(--text-main)] hover:bg-[var(--bg-sub)]/30'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-black truncate max-w-[150px]">{v.title}</h4>
                        <span className="text-[9px] font-bold text-[var(--text-light)] block mt-1">⏰ {formatDuration(v.duration)} &bull; {v.videoType}</span>
                      </div>
                      <button
                        onClick={(e) => handleDelete(v._id, e)}
                        className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg hover:border-rose-200 border border-transparent transition-all"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right: Student Watch Stats (Col-span 2) */}
          <div className="lg:col-span-2">
            {selectedVideo ? (
              <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-6">
                
                {/* Header details */}
                <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-[var(--border-light)]">
                  <div>
                    <h2 className="text-lg font-black text-[var(--text-main)]">{selectedVideo.title}</h2>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold">
                      Subject: {selectedVideo.course?.courseName} &bull; Type: <span className="uppercase">{selectedVideo.videoType}</span> &bull; Instructor: {selectedVideo.instructor || 'Mentor'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-[var(--accent)] text-[10px] font-black uppercase rounded-full">
                    Syllabus stats
                  </span>
                </div>

                {/* Progress roster list */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-1.5">
                    <FiBarChart2 /> Student Watch Statistics
                  </h3>
                  
                  {loadingProgress ? (
                    <p className="text-xs text-[var(--text-muted)] font-semibold text-center py-10 animate-pulse">Loading logs...</p>
                  ) : studentProgress.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] font-semibold text-center py-10">No watch progress logs registered for this video yet.</p>
                  ) : (
                    <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-2 no-scrollbar">
                      {studentProgress.map(p => (
                        <div key={p._id} className="p-4 bg-[var(--bg-sub)]/35 border border-[var(--border-light)] rounded-xl flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-xs font-black text-[var(--text-main)]">{p.user?.fullName}</h4>
                              <span className="text-[9px] text-[var(--text-light)] block mt-0.5">{p.user?.email}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase rounded border ${
                              p.isCompleted 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                                : 'bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20'
                            }`}>
                              {p.isCompleted ? 'Completed ✅' : `Watching (${p.progressPercentage}%)`}
                            </span>
                          </div>

                          {/* Progress Line and Time watched */}
                          <div className="space-y-1 mt-1">
                            <div className="flex justify-between text-[8px] font-bold text-[var(--text-light)]">
                              <span>Watched: {formatDuration(p.watchTime)} / {formatDuration(p.duration)}</span>
                              <span>{p.progressPercentage}%</span>
                            </div>
                            <div className="w-full h-1 bg-[var(--bg-sub)] rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${p.isCompleted ? 'bg-emerald-500' : 'bg-[var(--primary)]'}`}
                                style={{ width: `${p.progressPercentage}%` }}
                              />
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl py-20 text-center">
                <p className="text-xs text-[var(--text-muted)] font-bold">Select a video to review student progress logs.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Add Video Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <h2 className="text-sm font-black uppercase text-[var(--text-main)]">Upload Video Lecture</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-light)] hover:text-[var(--text-main)]">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Video Lecture Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="e.g. State Propagation Patterns"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Lecture Overview & Summary</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  rows="2"
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="Provide syllabus instructions or topics covered..."
                />
              </div>

              {/* Video Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Storage Type</label>
                  <select
                    value={form.videoType}
                    onChange={(e) => setForm({...form, videoType: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  >
                    <option value="embedded">YouTube Embed</option>
                    <option value="uploaded">Uploaded MP4 link</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Duration (Seconds)</label>
                  <input
                    type="number"
                    required
                    value={form.duration}
                    onChange={(e) => setForm({...form, duration: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                    placeholder="e.g. 1800"
                  />
                </div>
              </div>

              {/* URL */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Video Resource Link</label>
                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={(e) => setForm({...form, url: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="https://youtube.com/... or MP4 link"
                />
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Thumbnail Image Link (Optional)</label>
                <input
                  type="url"
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm({...form, thumbnailUrl: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="https://..."
                />
              </div>

              {/* Instructor */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Lecture Instructor Name</label>
                <input
                  type="text"
                  required
                  value={form.instructor}
                  onChange={(e) => setForm({...form, instructor: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="Instructor Name"
                />
              </div>

              {/* Course & Batch Select */}
              <div className="grid grid-cols-2 gap-3">
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

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Roster Batch</label>
                  <select
                    value={form.batch}
                    onChange={(e) => setForm({...form, batch: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  >
                    <option value="">All Batches</option>
                    {batches.map(b => (
                      <option key={b._id} value={b._id}>{b.batchName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-black uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <FiFilm /> Publish Video Lecture
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
