import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX, FiFile, FiDownload, FiFolderPlus } from 'react-icons/fi';

export default function StudyMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  
  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    materialType: 'Notes',
    fileUrl: '',
    course: '',
    batch: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/institute/materials', form);
      toast.success('Study material uploaded successfully!');
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
      toast.error('Upload failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this material item?')) return;
    try {
      await api.delete(`/institute/materials/${id}`);
      toast.success('Material deleted');
      fetchMaterials();
    } catch (err) {
      toast.error('Failed to delete material');
    }
  };

  const tabs = ['All', 'Notes', 'PDF', 'Assignment', 'Practice Sheet'];
  const filteredMaterials = activeTab === 'All' 
    ? materials 
    : materials.filter(m => m.materialType === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Study Materials</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Download reference guides, notes and classroom worksheets</p>
        </div>
        {user.role !== 'student' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-xs py-3 px-5"
          >
            <FiPlus strokeWidth={3} /> Upload Handout
          </button>
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
          <div className="col-span-full card p-12 text-center text-[var(--text-muted)] font-bold">
            No study materials in this category yet.
          </div>
        ) : (
          filteredMaterials.map(m => (
            <div key={m._id} className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg text-indigo-500 shrink-0">
                    <FiFile />
                  </div>
                  {user.role !== 'student' && (
                    <button 
                      onClick={() => handleDelete(m._id)} 
                      className="p-1.5 hover:bg-red-500/10 text-rose-500 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-black text-[var(--text-main)] mt-3 truncate">{m.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">{m.description || 'No description provided.'}</p>
                
                <div className="mt-3.5 flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-orange-100 text-[var(--brand-orange)] border border-orange-200">
                    {m.materialType}
                  </span>
                  {m.course && (
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {m.course.courseName}
                    </span>
                  )}
                </div>
              </div>

              <a 
                href={m.fileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full btn-secondary text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
              >
                <FiDownload /> Download Material
              </a>
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
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6 flex items-center gap-2">
              <FiFolderPlus /> Upload Handout
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
              </div>

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
                  className="btn-secondary py-3 px-5 text-xs font-black uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary py-3 px-6 text-xs font-black uppercase"
                >
                  Publish Handout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
