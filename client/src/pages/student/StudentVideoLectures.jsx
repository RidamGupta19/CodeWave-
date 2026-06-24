import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiPlayCircle, FiSearch, FiMonitor, FiUser, FiCalendar, FiFilm } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentVideoLectures() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchVideoLectures();
  }, []);

  const fetchVideoLectures = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/materials');
      // Filter study materials by type 'Video'
      const videos = res.data.data.filter(m => m.materialType === 'Video');
      setMaterials(videos);
      if (videos.length > 0) {
        setSelectedVideo(videos[0]);
      }
    } catch (err) {
      console.error('Error fetching video lectures:', err);
      toast.error('Failed to load video lectures');
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    // Check if it's already an embed link
    if (url.includes('youtube.com/embed/')) return url;
    
    // Regular YouTube URL parsing
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?rel=0&modestbranding=1`;
    }
    
    return url; // fallback to raw link
  };

  const filteredVideos = materials.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg mb-6" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[450px] bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-[450px] bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Recorded Video Library</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Access lecture playback archives, revision modules and concepts explainers</p>
      </div>

      {materials.length === 0 ? (
        <div className="card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
          <div className="text-5xl mb-4">🎥</div>
          <h3 className="text-lg font-black text-[var(--text-main)] mb-1">No Video Lectures Uploaded</h3>
          <p className="text-xs font-semibold max-w-md mx-auto">Recorded session replays will be posted here by your classroom mentors after each live class ends.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Active Video Player Widget */}
          <div className="lg:col-span-2 space-y-4">
            {selectedVideo ? (
              <div className="space-y-4">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[var(--border)] shadow-md">
                  {selectedVideo.fileUrl && (selectedVideo.fileUrl.includes('youtube') || selectedVideo.fileUrl.includes('youtu.be')) ? (
                    <iframe
                      src={getYoutubeEmbedUrl(selectedVideo.fileUrl)}
                      title={selectedVideo.title}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      src={selectedVideo.fileUrl}
                      controls
                      className="absolute inset-0 w-full h-full"
                    />
                  )}
                </div>

                <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4">
                  <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-[var(--border-light)]">
                    <div>
                      <h2 className="text-lg font-black text-[var(--text-main)]">{selectedVideo.title}</h2>
                      <div className="flex flex-wrap gap-4 text-[10px] text-[var(--text-muted)] mt-1.5 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><FiCalendar /> Uploaded: {new Date(selectedVideo.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><FiMonitor /> Course: {selectedVideo.course?.courseName || 'General'}</span>
                      </div>
                    </div>
                    <span className="px-3.5 py-1 bg-indigo-50 border border-indigo-100 text-[var(--accent)] text-[10px] font-black uppercase rounded-full tracking-wide">
                      Playing Replay
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest mb-1.5">Lecture Summary & Notes</h4>
                    <p className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed">
                      {selectedVideo.description || 'No detailed instructions provided for this topic. Follow along with the notes and check homework submissions.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl py-20 text-center">
                <p className="text-xs text-[var(--text-muted)] font-bold">Select a lecture video from the playlist to launch playback.</p>
              </div>
            )}
          </div>

          {/* Playlist Side Panel */}
          <div className="space-y-4">
            
            {/* Search filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-light)]">
                <FiSearch size={14} />
              </span>
              <input
                type="text"
                placeholder="Search lectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all shadow-sm"
              />
            </div>

            {/* Video List */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm space-y-3 h-[460px] overflow-y-auto no-scrollbar">
              <h3 className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-wider px-1">Playlist Index ({filteredVideos.length})</h3>
              <div className="space-y-2">
                {filteredVideos.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] font-bold text-center py-10">No lecture files found.</p>
                ) : (
                  filteredVideos.map(v => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVideo(v)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all border text-left ${
                        selectedVideo?._id === v._id
                          ? 'bg-[var(--primary-light)]/40 border-[var(--primary)] text-[var(--primary)]'
                          : 'bg-[var(--bg-sub)]/10 border-[var(--border-light)] text-[var(--text-main)] hover:bg-[var(--bg-sub)]/30'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0">
                        <FiPlayCircle size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-black truncate leading-snug">{v.title}</h4>
                        <p className="text-[9px] text-[var(--text-muted)] font-bold mt-1 uppercase tracking-wider">{v.course?.courseName || 'General'}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
