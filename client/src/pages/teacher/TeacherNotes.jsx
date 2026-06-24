import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FiFolder, FiPlus, FiTrash2, FiSearch, FiX, 
  FiBookOpen, FiFileText, FiDownload, FiExternalLink 
} from 'react-icons/fi';

export default function TeacherNotes() {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    materialType: 'Notes', // default
    fileUrl: '',
    course: '',
    batch: ''
  });

  useEffect(() => {
    fetchMaterials();
    fetchMetadata();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/materials');
      // Filter out 'Video' study materials since video is handled in the Video library!
      const nonVideos = res.data.data.filter(m => m.materialType !== 'Video');
      setMaterials(nonVideos);
    } catch (err) {
      toast.error('Failed to load notes library');
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
      await api.post('/institute/materials', form);
      toast.success('Study material published successfully! 📁');
      setIsAddModalOpen(false);
      setForm({
        title: '',
        description: '',
        materialType: 'Notes',
        fileUrl: '',
        course: '',
        batch: ''
      });
      fetchMaterials();
    } catch (err) {
      toast.error('Failed to upload study material');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this study material permanently?')) return;
    try {
      await api.delete(`/institute/materials/${id}`);
      toast.success('Material deleted');
      fetchMaterials();
    } catch (err) {
      toast.error('Failed to delete material');
    }
  };

  const filtered = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || (m.course?._id === courseFilter);
    return matchesSearch && matchesCourse;
  });

  if (loading && materials.length === 0) {
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
          <h1 className="text-2xl font-black text-[var(--text-main)]">Notes & Study Materials</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
            Publish syllabus cheat-sheets, theory notes, and practice sheets for students
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-black uppercase rounded-xl shadow-md shadow-[var(--primary)]/10 flex items-center gap-1.5"
        >
          <FiPlus /> Upload Material
        </button>
      </div>

      {/* Filter strip */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
        
        {/* Subject Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest shrink-0">Subject Course:</span>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
          >
            <option value="all">All Subjects</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>{c.courseName}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-light)]">
            <FiSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search material topic..."
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
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">No Study Materials</h3>
            <p className="text-xs font-semibold">You have not uploaded any PDF cheat sheets or notes yet. Click the button above to publish one.</p>
          </div>
        ) : (
          filtered.map(m => (
            <div key={m._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="px-2.5 py-0.5 text-[8px] font-black uppercase rounded bg-indigo-50 border border-indigo-100 text-[var(--accent)] tracking-wider">
                    {m.materialType}
                  </span>
                  <span className="text-[9px] font-bold text-[var(--text-light)]">
                    🗓️ {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-extrabold text-[var(--text-main)] text-base mt-4 line-clamp-2 leading-snug">{m.title}</h3>
                <p className="text-xs text-[var(--text-muted)] font-semibold mt-2 line-clamp-2 leading-relaxed">{m.description || 'No summary notes available.'}</p>
                
                <div className="space-y-1 text-[9px] text-[var(--text-light)] font-bold mt-4 pt-3 border-t border-[var(--border-light)]">
                  <div>Subject Course: <span className="text-[var(--text-main)]">{m.course?.courseName || 'General'}</span></div>
                  <div>Roster Batch: <span className="text-[var(--text-main)]">{m.batch?.batchName || 'General Roster'}</span></div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-light)] flex gap-2">
                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center py-2 bg-indigo-50 hover:bg-indigo-100 text-[var(--primary)] text-[10px] font-black uppercase rounded-lg border border-indigo-100 flex items-center justify-center gap-1.5"
                >
                  <FiDownload /> Get Document
                </a>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 rounded-lg flex items-center justify-center transition-colors"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Material Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <h2 className="text-sm font-black uppercase text-[var(--text-main)]">Publish Study Material</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-light)] hover:text-[var(--text-main)]">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Document Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="e.g. React Hook cheatsheet PDF"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Syllabus Overview</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  rows="2"
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="Brief summary of document notes..."
                />
              </div>

              {/* Material Type */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Document Category</label>
                <select
                  value={form.materialType}
                  onChange={(e) => setForm({...form, materialType: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                >
                  <option value="Notes">Notes / Cheat Sheet</option>
                  <option value="PDF">Syllabus PDF</option>
                  <option value="Practice Sheet">Practice Sheet / Exercises</option>
                  <option value="Assignment">Homework Details</option>
                </select>
              </div>

              {/* File URL */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">File Attachment Link (PDF/Doc)</label>
                <input
                  type="url"
                  required
                  value={form.fileUrl}
                  onChange={(e) => setForm({...form, fileUrl: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  placeholder="https://..."
                />
              </div>

              {/* Course & Batch select */}
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
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-black uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <FiFolder /> Publish Study Material
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
