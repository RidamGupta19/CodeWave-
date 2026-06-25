import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  FiPlus, FiTrash2, FiX, FiFile, FiDownload, 
  FiFolderPlus, FiEdit2, FiBarChart2, 
  FiUploadCloud, FiClock, FiSearch
} from 'react-icons/fi';

export default function StudyMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('All');

  // Modals & States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState(null);

  // File Upload State
  const [uploadingFile, setUploadingFile] = useState(false);

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
    if (user.role !== 'student') {
      fetchSchedulesAndMetadata();
    }
  }, [user]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await api.get('/institute/materials');
      setMaterials(res.data.data);
    } catch (err) {
      toast.error('Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedulesAndMetadata = async () => {
    try {
      const [crsRes, batRes] = await Promise.all([
        api.get('/institute/courses'),
        api.get('/institute/batches')
      ]);
      setCourses(crsRes.data.data);
      setBatches(batRes.data.data);
    } catch (err) {
      console.log('Metadata fetch failed', err.message);
    }
  };

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
      
      toast.success('Study material uploaded successfully!');
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
      toast.error('Upload failed');
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
      
      toast.success('Study material updated successfully!');
      setIsEditModalOpen(false);
      fetchMaterials();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this material item permanently? This will remove all version history.')) return;
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

  const tabs = ['All', 'Notes', 'PDF', 'Assignment', 'Practice Sheet'];
  
  const filteredMaterials = materials.filter(m => {
    const matchesTab = activeTab === 'All' || m.materialType === activeTab;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (m.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'all' || (m.course?._id === courseFilter);
    const matchesBatch = batchFilter === 'all' || (m.batch?._id === batchFilter);

    return matchesTab && matchesSearch && matchesCourse && matchesBatch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Study Materials Center</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">
            Publish reference guides, theory sheets, PDFs, and manage version history
          </p>
        </div>
        {user.role !== 'student' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-xs py-3 px-5 cursor-pointer"
          >
            <FiPlus strokeWidth={3} /> Upload Handout
          </button>
        )}
      </div>

      {/* Filter strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
        
        {/* Search */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-light)]">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all shadow-sm"
          />
        </div>

        {/* Course Filter */}
        {user.role !== 'student' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest shrink-0">Course:</span>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
            >
              <option value="all">All Courses</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
            </select>
          </div>
        )}

        {/* Batch Filter */}
        {user.role !== 'student' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-[var(--text-light)] tracking-widest shrink-0">Batch:</span>
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--bg-sub)]/40 border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all"
            >
              <option value="all">All Batches</option>
              {batches.map(b => <option key={b._id} value={b._id}>{b.batchName}</option>)}
            </select>
          </div>
        )}

      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] gap-2 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap rounded-t-xl ${
              activeTab === tab 
                ? 'border-b-2 border-[var(--primary)] text-[var(--primary)] bg-[var(--primary-light)]/40' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)]/50'
            }`}
          >
            {tab}s
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="col-span-full card p-12 text-center text-[var(--text-muted)] font-bold bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
            No study materials in this category yet.
          </div>
        ) : (
          filteredMaterials.map(m => (
            <div key={m._id} className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 rounded-2xl">
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg text-indigo-500 shrink-0">
                    <FiFile />
                  </div>
                  {user.role !== 'student' && (
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEditClick(m)}
                        className="p-1.5 hover:bg-amber-500/10 text-amber-600 rounded-lg transition-colors cursor-pointer"
                        title="Edit Material"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button 
                        onClick={() => handleDelete(m._id)} 
                        className="p-1.5 hover:bg-red-500/10 text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3.5">
                  <span className="text-xs font-black text-[var(--text-main)] truncate">{m.title}</span>
                  <span className="px-1.5 py-0.2 bg-blue-50 border border-blue-100 text-blue-600 text-[8px] font-black rounded">
                    v{m.version || 1}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1.5 line-clamp-2 leading-relaxed">{m.description || 'No description provided.'}</p>
                
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-orange-100 text-[var(--brand-orange)] border border-orange-200">
                    {m.materialType}
                  </span>
                  {m.course && (
                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {m.course.courseName}
                    </span>
                  )}
                  {m.batch && (
                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                      {m.batch.batchName}
                    </span>
                  )}
                </div>
              </div>

              {/* Version History and Download stats for admins/teachers */}
              {user.role !== 'student' && (
                <div className="flex items-center justify-between text-[9px] text-[var(--text-light)] bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl p-2 font-bold mt-1">
                  <button 
                    onClick={() => { setActiveMaterial(m); setIsHistoryModalOpen(true); }}
                    className="hover:text-[var(--primary)] flex items-center gap-1 transition-colors font-extrabold cursor-pointer"
                  >
                    <FiClock /> Version Archive ({m.versions?.length || 0})
                  </button>
                  <button 
                    onClick={() => { setActiveMaterial(m); setIsStatsModalOpen(true); }}
                    className="hover:text-[var(--primary)] flex items-center gap-1 transition-colors"
                  >
                    <FiBarChart2 /> Downloads: <span className="text-[var(--text-main)] font-black">{m.downloadCount || 0}</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => handleDownload(m._id, m.fileUrl)}
                className="w-full btn-secondary text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <FiDownload /> Download Material
              </button>
            </div>
          ))
        )}
      </div>

      {/* Upload Material Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--bg-sub)]"
            >
              <FiX size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <FiFolderPlus /> Upload Study Handout
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Handout Title</label>
                <input 
                  type="text" 
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="e.g. Recursion Call Stack PDF"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Material Type</label>
                  <select 
                    value={form.materialType}
                    onChange={(e) => setForm({...form, materialType: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="Notes">Notes</option>
                    <option value="PDF">PDF</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Practice Sheet">Practice Sheet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Attachment Source</label>
                  <select 
                    value={form.linkType}
                    onChange={(e) => setForm({...form, linkType: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="file">Upload Local File</option>
                    <option value="url">External Link URL</option>
                  </select>
                </div>
              </div>

              {form.linkType === 'file' ? (
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Choose local file (Max 10MB)</label>
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
                          <span className="text-[10px] font-black text-[var(--text-main)] uppercase">Click to select file</span>
                          <p className="text-[8px]">PDF, Word, Powerpoint, Text, Images, ZIP up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">File URL / Download Link</label>
                  <input 
                    type="url" 
                    required
                    value={form.fileUrl}
                    onChange={(e) => setForm({...form, fileUrl: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Associate Course</label>
                  <select 
                    value={form.course}
                    onChange={(e) => setForm({...form, course: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Associate Batch</label>
                  <select 
                    value={form.batch}
                    onChange={(e) => setForm({...form, batch: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="">Select Batch</option>
                    {batches.map(b => <option key={b._id} value={b._id}>{b.batchName}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Handout Description</label>
                <textarea 
                  rows="2"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="Draft instructions or summary..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary py-3 px-5 text-xs font-black uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploadingFile}
                  className="btn-primary py-3 px-6 text-xs font-black uppercase cursor-pointer disabled:opacity-50"
                >
                  Publish Handout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Material Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--bg-sub)]"
            >
              <FiX size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <FiEdit2 /> Edit Note / Bump Version
            </h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Handout Title</label>
                <input 
                  type="text" 
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Material Type</label>
                  <select 
                    value={editForm.materialType}
                    onChange={(e) => setEditForm({...editForm, materialType: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="Notes">Notes</option>
                    <option value="PDF">PDF</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Practice Sheet">Practice Sheet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Attachment Source</label>
                  <select 
                    value={editForm.linkType}
                    onChange={(e) => setEditForm({...editForm, linkType: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="file">Upload Local File</option>
                    <option value="url">External Link URL</option>
                  </select>
                </div>
              </div>

              {editForm.linkType === 'file' ? (
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Replace file (Max 10MB)</label>
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
                          <span className="text-[10px] font-black text-[var(--text-main)] uppercase">Click to select file</span>
                          <p className="text-[8px]">PDF, Word, Powerpoint, images, ZIP up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">File URL / Download Link</label>
                  <input 
                    type="url" 
                    required
                    value={editForm.fileUrl}
                    onChange={(e) => setEditForm({...editForm, fileUrl: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Associate Course</label>
                  <select 
                    value={editForm.course}
                    onChange={(e) => setEditForm({...editForm, course: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Associate Batch</label>
                  <select 
                    value={editForm.batch}
                    onChange={(e) => setEditForm({...editForm, batch: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="">Select Batch</option>
                    {batches.map(b => <option key={b._id} value={b._id}>{b.batchName}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Handout Description</label>
                <textarea 
                  rows="2"
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                />
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] font-semibold text-amber-700 leading-relaxed">
                ⚠️ **Note on Versioning**: Changing details or uploading a new file automatically archives the current version and increments the active version (e.g. v1 → v2).
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary py-3 px-5 text-xs font-black uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploadingFile}
                  className="btn-primary py-3 px-6 text-xs font-black uppercase cursor-pointer disabled:opacity-50"
                >
                  Save Changes
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
                  <p className="text-[10px] text-[var(--text-muted)]">{activeMaterial.description || 'No description overview provided.'}</p>
                </div>
                <button
                  onClick={() => handleDownload(activeMaterial._id, activeMaterial.fileUrl)}
                  className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 shrink-0 cursor-pointer"
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
                      <th className="p-3">User Name</th>
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
