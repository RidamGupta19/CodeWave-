import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  FiFolder, FiPlus, FiTrash2, FiSearch, FiX, 
  FiBookOpen, FiFileText, FiDownload, FiEdit2,
  FiBarChart2, FiUploadCloud, FiClock, FiLayers
} from 'react-icons/fi';

export default function TeacherNotes() {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modals & States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState(null);
  
  // File Upload State
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Add Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    materialType: 'Notes',
    fileUrl: '',
    course: '',
    batch: '',
    linkType: 'file' // 'file' or 'url'
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    _id: '',
    title: '',
    description: '',
    materialType: 'Notes',
    fileUrl: '',
    course: '',
    batch: '',
    linkType: 'file' // 'file' or 'url'
  });

  useEffect(() => {
    fetchMaterials();
    fetchMetadata();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/materials');
      // Filter out Videos
      const nonVideos = res.data.data.filter(m => m.materialType !== 'Video');
      setMaterials(nonVideos);
    } catch (err) {
      toast.error('Failed to load study materials');
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

  // Helper function to handle local file upload to backend
  const handleFileChangeAndUpload = async (e, mode = 'add') => {
    const file = e.target.files[0];
    if (!file) return;

    // Frontend File Validation
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.png', '.jpg', '.jpeg', '.zip'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(ext)) {
      toast.error(`Invalid file type. Allowed extensions: ${allowedExtensions.join(', ')}`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10MB limit');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadingFile(true);
    try {
      const res = await api.post('/institute/materials/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('File uploaded successfully! 📁');
      
      if (mode === 'add') {
        setForm(prev => ({ ...prev, fileUrl: res.data.fileUrl }));
      } else {
        setEditForm(prev => ({ ...prev, fileUrl: res.data.fileUrl }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'File upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fileUrl) {
      return toast.error('Please upload a file or specify a link URL');
    }

    try {
      await api.post('/institute/materials', {
        title: form.title,
        description: form.description,
        materialType: form.materialType,
        fileUrl: form.fileUrl,
        course: form.course || null,
        batch: form.batch || null
      });
      
      toast.success('Study material published successfully! 📁');
      setIsAddModalOpen(false);
      setForm({
        title: '',
        description: '',
        materialType: 'Notes',
        fileUrl: '',
        course: '',
        batch: '',
        linkType: 'file'
      });
      fetchMaterials();
    } catch (err) {
      toast.error('Failed to upload study material');
    }
  };

  const handleEditClick = (m) => {
    setEditForm({
      _id: m._id,
      title: m.title,
      description: m.description || '',
      materialType: m.materialType,
      fileUrl: m.fileUrl,
      course: m.course?._id || '',
      batch: m.batch?._id || '',
      linkType: m.fileUrl.startsWith('/uploads') ? 'file' : 'url'
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.fileUrl) {
      return toast.error('Please upload a file or specify a link URL');
    }

    try {
      await api.put(`/institute/materials/${editForm._id}`, {
        title: editForm.title,
        description: editForm.description,
        materialType: editForm.materialType,
        fileUrl: editForm.fileUrl,
        course: editForm.course || null,
        batch: editForm.batch || null
      });
      
      toast.success('Study material updated successfully! ✍️');
      setIsEditModalOpen(false);
      fetchMaterials();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update study material');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this study material permanently? This will remove all version history.')) return;
    try {
      await api.delete(`/institute/materials/${id}`);
      toast.success('Material deleted');
      fetchMaterials();
    } catch (err) {
      toast.error('Failed to delete material');
    }
  };

  const handleDownload = async (materialId, fileUrl) => {
    try {
      await api.post(`/institute/materials/${materialId}/download`);
      fetchMaterials(); // Refresh count
    } catch (err) {
      console.error('Download tracking failed:', err);
    }

    let fullUrl = fileUrl;
    if (fileUrl && fileUrl.startsWith('/uploads')) {
      const apiBase = api.defaults.baseURL || '';
      const serverBase = apiBase.replace(/\/api$/, '');
      fullUrl = `${serverBase}${fileUrl}`;
    }
    window.open(fullUrl, '_blank');
  };

  const getFullUrl = (fileUrl) => {
    if (!fileUrl) return '';
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) return fileUrl;
    const apiBase = api.defaults.baseURL || '';
    const serverBase = apiBase.replace(/\/api$/, '');
    return `${serverBase}${fileUrl}`;
  };

  const filtered = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || (m.course?._id === courseFilter);
    const matchesBatch = batchFilter === 'all' || (m.batch?._id === batchFilter);
    const matchesType = typeFilter === 'all' || m.materialType === typeFilter;
    
    return matchesSearch && matchesCourse && matchesBatch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Teacher Notes & Content Library</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
            Manage notes, PDFs, study sheets, version history, and batch assignments
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary py-2.5 px-5 bg-[var(--primary)] text-white text-xs font-black uppercase rounded-xl shadow-md shadow-[var(--primary)]/10 flex items-center gap-1.5 cursor-pointer"
        >
          <FiPlus /> Upload Note / PDF
        </button>
      </div>

      {/* Filter strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
        
        {/* Search */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[var(--text-light)]">
            <FiSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search notes/handouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all shadow-sm"
          />
        </div>

        {/* Course Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest shrink-0">Course:</span>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
          >
            <option value="all">All Courses</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>{c.courseName}</option>
            ))}
          </select>
        </div>

        {/* Batch Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest shrink-0">Batch:</span>
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
          >
            <option value="all">All Batches</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>{b.batchName}</option>
            ))}
          </select>
        </div>

        {/* Material Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest shrink-0">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
          >
            <option value="all">All Types</option>
            <option value="Notes">Notes / Cheatsheets</option>
            <option value="PDF">Syllabus PDFs</option>
            <option value="Practice Sheet">Practice Sheets</option>
            <option value="Assignment">Assignments</option>
          </select>
        </div>

      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">No Study Materials</h3>
            <p className="text-xs font-semibold">No materials fit the current search/filters. Create one to get started.</p>
          </div>
        ) : (
          filtered.map(m => (
            <div key={m._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 text-[8px] font-black uppercase rounded bg-indigo-50 border border-indigo-100 text-[var(--accent)] tracking-wider">
                      {m.materialType}
                    </span>
                    <span className="px-2 py-0.5 text-[8px] font-extrabold rounded bg-blue-50 border border-blue-100 text-blue-600">
                      v{m.version || 1}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-[var(--text-light)]">
                    🗓️ {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-extrabold text-[var(--text-main)] text-base mt-4 line-clamp-2 leading-snug">{m.title}</h3>
                <p className="text-xs text-[var(--text-muted)] font-semibold mt-2 line-clamp-2 leading-relaxed">{m.description || 'No summary description available.'}</p>
                
                <div className="space-y-1 text-[9px] text-[var(--text-light)] font-bold mt-4 pt-3 border-t border-[var(--border-light)]">
                  <div>Subject Course: <span className="text-[var(--text-main)]">{m.course?.courseName || 'General'}</span></div>
                  <div>Roster Batch: <span className="text-[var(--text-main)]">{m.batch?.batchName || 'General Roster'}</span></div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span>Uploaded By:</span>
                    <span className="text-[var(--text-main)] font-semibold">{m.uploadedBy?.fullName || 'Teacher'}</span>
                    <span className="px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded text-[7px]">{m.uploadedBy?.role || 'staff'}</span>
                  </div>
                </div>
              </div>

              {/* Version History and Download stats badges */}
              <div className="flex items-center justify-between text-[10px] text-[var(--text-light)] bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl p-2.5 font-bold">
                <button 
                  onClick={() => { setActiveMaterial(m); setIsHistoryModalOpen(true); }}
                  className="hover:text-[var(--primary)] flex items-center gap-1 transition-colors font-extrabold cursor-pointer"
                >
                  <FiClock /> Version Log ({m.versions?.length || 0})
                </button>
                <button 
                  onClick={() => { setActiveMaterial(m); setIsStatsModalOpen(true); }}
                  className="hover:text-[var(--primary)] flex items-center gap-1 transition-colors"
                >
                  <FiBarChart2 /> Downloads: <span className="text-[var(--text-main)] font-black">{m.downloadCount || 0}</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[var(--border-light)] flex gap-2">
                <button
                  onClick={() => handleDownload(m._id, m.fileUrl)}
                  className="flex-1 text-center py-2.5 bg-indigo-50 hover:bg-indigo-100 text-[var(--primary)] text-[10px] font-black uppercase rounded-lg border border-indigo-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FiDownload /> Get Document
                </button>
                <button
                  onClick={() => handleEditClick(m)}
                  className="p-2.5 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  title="Edit Material"
                >
                  <FiEdit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  title="Delete"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4 relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-[var(--text-light)] hover:text-[var(--text-main)]">
              <FiX size={18} />
            </button>
            
            <h2 className="text-sm font-black uppercase text-[var(--text-main)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
              <FiFolder /> Publish Study Handout
            </h2>

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

              {/* Link Type Select */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider block">Attachment Source</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, linkType: 'file' }))}
                    className={`py-2 px-3 text-xs font-black uppercase rounded-xl border text-center transition-all ${
                      form.linkType === 'file'
                        ? 'bg-[var(--primary-light)]/40 border-[var(--primary)] text-[var(--primary)]'
                        : 'bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, linkType: 'url' }))}
                    className={`py-2 px-3 text-xs font-black uppercase rounded-xl border text-center transition-all ${
                      form.linkType === 'url'
                        ? 'bg-[var(--primary-light)]/40 border-[var(--primary)] text-[var(--primary)]'
                        : 'bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    External URL
                  </button>
                </div>
              </div>

              {/* File Upload Selector */}
              {form.linkType === 'file' ? (
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Upload Handout (Max 10MB)</label>
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-4 text-center hover:border-[var(--primary)] transition-colors relative cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.zip"
                      onChange={(e) => handleFileChangeAndUpload(e, 'add')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingFile}
                    />
                    <div className="flex flex-col items-center gap-1.5 text-[var(--text-muted)]">
                      <FiUploadCloud size={24} className={uploadingFile ? "animate-bounce text-[var(--primary)]" : ""} />
                      {uploadingFile ? (
                        <span className="text-[10px] font-extrabold uppercase text-[var(--primary)]">Uploading document...</span>
                      ) : form.fileUrl ? (
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-emerald-600">✓ File Uploaded</span>
                          <p className="text-[9px] truncate max-w-[280px] font-semibold text-gray-500">{form.fileUrl}</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-[var(--text-main)]">Choose local file</span>
                          <p className="text-[8px]">PDF, Word, Powerpoint, TXT, Images, ZIP up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* External Link input */
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">File URL Link (Drive / Web Link)</label>
                  <input
                    type="url"
                    required
                    value={form.fileUrl}
                    onChange={(e) => setForm({...form, fileUrl: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                    placeholder="https://..."
                  />
                </div>
              )}

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
                  disabled={uploadingFile}
                  className="w-full py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-black uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FiFolder /> Publish Study Material
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Edit Material Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4 relative">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-[var(--text-light)] hover:text-[var(--text-main)]">
              <FiX size={18} />
            </button>
            
            <h2 className="text-sm font-black uppercase text-[var(--text-main)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
              <FiEdit2 /> Edit Note / Bump Version
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Document Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Syllabus Overview</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  rows="2"
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                />
              </div>

              {/* Material Type */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Document Category</label>
                <select
                  value={editForm.materialType}
                  onChange={(e) => setEditForm({...editForm, materialType: e.target.value})}
                  className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                >
                  <option value="Notes">Notes / Cheat Sheet</option>
                  <option value="PDF">Syllabus PDF</option>
                  <option value="Practice Sheet">Practice Sheet / Exercises</option>
                  <option value="Assignment">Homework Details</option>
                </select>
              </div>

              {/* Link Type Select */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider block">Attachment Source</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setEditForm(prev => ({ ...prev, linkType: 'file' }))}
                    className={`py-2 px-3 text-xs font-black uppercase rounded-xl border text-center transition-all ${
                      editForm.linkType === 'file'
                        ? 'bg-[var(--primary-light)]/40 border-[var(--primary)] text-[var(--primary)]'
                        : 'bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Upload New File
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm(prev => ({ ...prev, linkType: 'url' }))}
                    className={`py-2 px-3 text-xs font-black uppercase rounded-xl border text-center transition-all ${
                      editForm.linkType === 'url'
                        ? 'bg-[var(--primary-light)]/40 border-[var(--primary)] text-[var(--primary)]'
                        : 'bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    External URL
                  </button>
                </div>
              </div>

              {/* File Upload Selector */}
              {editForm.linkType === 'file' ? (
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Replace file (Max 10MB)</label>
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-4 text-center hover:border-[var(--primary)] transition-colors relative cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.zip"
                      onChange={(e) => handleFileChangeAndUpload(e, 'edit')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingFile}
                    />
                    <div className="flex flex-col items-center gap-1.5 text-[var(--text-muted)]">
                      <FiUploadCloud size={24} className={uploadingFile ? "animate-bounce text-[var(--primary)]" : ""} />
                      {uploadingFile ? (
                        <span className="text-[10px] font-extrabold uppercase text-[var(--primary)]">Uploading document...</span>
                      ) : editForm.fileUrl ? (
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-emerald-600">✓ File Hooked</span>
                          <p className="text-[9px] truncate max-w-[280px] font-semibold text-gray-500">{editForm.fileUrl}</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-[var(--text-main)]">Choose local file</span>
                          <p className="text-[8px]">PDF, Word, Powerpoint, images, ZIP up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* External Link input */
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">File URL Link</label>
                  <input
                    type="url"
                    required
                    value={editForm.fileUrl}
                    onChange={(e) => setEditForm({...editForm, fileUrl: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  />
                </div>
              )}

              {/* Course & Batch Select */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-[var(--text-light)] tracking-wider">Subject Course</label>
                  <select
                    required
                    value={editForm.course}
                    onChange={(e) => setEditForm({...editForm, course: e.target.value})}
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
                    value={editForm.batch}
                    onChange={(e) => setEditForm({...editForm, batch: e.target.value})}
                    className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold"
                  >
                    <option value="">Select Batch</option>
                    {batches.map(b => (
                      <option key={b._id} value={b._id}>{b.batchName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] font-semibold text-amber-700 leading-relaxed">
                ⚠️ **Note on Versioning**: Changing the title, summary description, or attaching a new file will automatically archive the current version and increment the active version counter (e.g. v1 → v2).
              </div>

              {/* Submit */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-1/3 py-2.5 btn-secondary text-xs font-black uppercase rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingFile}
                  className="w-2/3 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-black uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FiFolder /> Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {isHistoryModalOpen && activeMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-lg rounded-2xl p-6 shadow-xl space-y-4 relative">
            <button onClick={() => setIsHistoryModalOpen(false)} className="absolute top-4 right-4 text-[var(--text-light)] hover:text-[var(--text-main)]">
              <FiX size={18} />
            </button>
            
            <h2 className="text-sm font-black uppercase text-[var(--text-main)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
              <FiClock /> Version Archive Log
            </h2>

            <div className="space-y-1">
              <h3 className="font-extrabold text-[var(--text-main)] text-sm">{activeMaterial.title}</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Active version: <span className="font-extrabold text-blue-600">v{activeMaterial.version || 1}</span></p>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-sub)]/10">
              
              {/* Active Version details */}
              <div className="border border-blue-100 bg-blue-50/20 rounded-xl p-3 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[8px] font-black uppercase">v{activeMaterial.version} (Active)</span>
                    <span className="text-[9px] text-[var(--text-light)] font-bold">Uploaded {new Date(activeMaterial.updatedAt).toLocaleString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--text-main)]">{activeMaterial.title}</h4>
                  <p className="text-[10px] text-[var(--text-muted)]">{activeMaterial.description || 'No summary overview provided.'}</p>
                </div>
                <button
                  onClick={() => handleDownload(activeMaterial._id, activeMaterial.fileUrl)}
                  className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Download File"
                >
                  <FiDownload /> Get
                </button>
              </div>

              {/* History iterations */}
              {!activeMaterial.versions || activeMaterial.versions.length === 0 ? (
                <div className="text-center py-6 text-[10px] font-bold text-[var(--text-light)] uppercase tracking-wider">
                  No previous file versions archived.
                </div>
              ) : (
                activeMaterial.versions.slice().reverse().map((ver, idx) => (
                  <div key={idx} className="border border-[var(--border)] bg-white rounded-xl p-3 flex justify-between items-start gap-4 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-600 text-[8px] font-black uppercase">v{ver.versionNumber || (activeMaterial.versions.length - idx)}</span>
                        <span className="text-[9px] text-[var(--text-light)] font-bold">Archived {new Date(ver.updatedAt).toLocaleString()}</span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-700">{ver.title}</h4>
                      <p className="text-[10px] text-[var(--text-muted)] line-clamp-2">{ver.description || 'No description archived.'}</p>
                      {ver.updatedBy && (
                        <div className="text-[8px] text-[var(--text-light)] font-bold">
                          Edited by: <span className="text-gray-600">{ver.updatedBy.fullName || 'Staff'}</span>
                        </div>
                      )}
                    </div>
                    <a
                      href={getFullUrl(ver.fileUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 shrink-0 transition-colors"
                      title="Download Archived Version"
                    >
                      <FiDownload /> Get
                    </a>
                  </div>
                ))
              )}

            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="py-2.5 px-5 btn-secondary text-xs font-black uppercase rounded-xl cursor-pointer"
              >
                Close Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Tracking Stats Modal */}
      {isStatsModalOpen && activeMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] w-full max-w-lg rounded-2xl p-6 shadow-xl space-y-4 relative">
            <button onClick={() => setIsStatsModalOpen(false)} className="absolute top-4 right-4 text-[var(--text-light)] hover:text-[var(--text-main)]">
              <FiX size={18} />
            </button>
            
            <h2 className="text-sm font-black uppercase text-[var(--text-main)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
              <FiBarChart2 /> Study Handout Download Logs
            </h2>

            <div className="space-y-1">
              <h3 className="font-extrabold text-[var(--text-main)] text-sm">{activeMaterial.title}</h3>
              <p className="text-[11px] text-[var(--text-light)]">Total downloads tracked: <span className="font-extrabold text-[var(--primary)]">{activeMaterial.downloadCount || 0}</span></p>
            </div>

            <div className="border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
              <div className="max-h-60 overflow-y-auto no-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[var(--bg-sub)] border-b border-[var(--border)] text-[9px] font-black uppercase tracking-widest text-[var(--text-light)]">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Downloaded At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!activeMaterial.downloads || activeMaterial.downloads.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="p-6 text-center text-[10px] font-bold text-[var(--text-light)] uppercase tracking-wider">
                          No downloads tracked yet.
                        </td>
                      </tr>
                    ) : (
                      activeMaterial.downloads.slice().reverse().map((dl, idx) => (
                        <tr key={idx} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-sub)]/20 transition-all font-semibold">
                          <td className="p-3">
                            <div className="font-bold text-[var(--text-main)]">{dl.user?.fullName || 'Anonymous User'}</div>
                            <div className="text-[9px] text-[var(--text-light)] font-bold">{dl.user?.email || ''}</div>
                          </td>
                          <td className="p-3 uppercase text-[9px] font-extrabold">
                            <span className={`px-2 py-0.5 rounded text-[8px] ${
                              dl.user?.role === 'student'
                                ? 'bg-indigo-50 border border-indigo-100 text-indigo-700'
                                : 'bg-gray-100 border border-gray-200 text-gray-600'
                            }`}>
                              {dl.user?.role || 'User'}
                            </span>
                          </td>
                          <td className="p-3 text-[10px] font-bold text-[var(--text-muted)]">
                            {new Date(dl.downloadedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="py-2.5 px-5 btn-secondary text-xs font-black uppercase rounded-xl cursor-pointer"
              >
                Close Metrics
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
