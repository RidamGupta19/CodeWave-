import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiFolder, FiDownload, FiSearch, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentNotes() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/materials');
      // Exclude Videos here since they have their own dedicated menu option
      const notesAndHandouts = res.data.data.filter(m => m.materialType !== 'Video');
      setMaterials(notesAndHandouts);
    } catch (err) {
      console.error('Error fetching materials:', err);
      toast.error('Failed to load study handouts');
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['All', 'Notes', 'PDF', 'Practice Sheet', 'Assignment'];
  const filtered = materials.filter(m => {
    const matchesTab = activeTab === 'All' || m.materialType === activeTab;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (m.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.course?.courseName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Notes & Materials</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Download official worksheets, revision slides and syllabus guides</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-light)]">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search documents by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-main)] rounded-xl outline-none focus:border-[var(--primary)] font-semibold transition-all shadow-sm"
          />
        </div>
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

      {/* Grid of files */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full card p-16 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-muted)]">
            <div className="text-4xl mb-4">📂</div>
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] mb-1">No Study Materials Found</h3>
            <p className="text-xs font-semibold">There are no study handouts matching your search filters in this category.</p>
          </div>
        ) : (
          filtered.map(material => (
            <div key={material._id} className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5">
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg text-indigo-500 shrink-0">
                    📄
                  </div>
                  <span className="px-2.5 py-0.5 bg-[var(--bg-sub)] border border-[var(--border-light)] text-[var(--text-muted)] text-[8px] font-black uppercase rounded-md tracking-wider">
                    {material.materialType}
                  </span>
                </div>

                <h3 className="font-extrabold text-[var(--text-main)] text-sm mt-4 line-clamp-2 leading-snug">{material.title}</h3>
                <p className="text-xs text-[var(--text-muted)] font-semibold mt-2 line-clamp-2 leading-relaxed">{material.description || 'Reference document shared by course mentor.'}</p>
              </div>

              <div className="pt-4 border-t border-[var(--border-light)] flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">
                <span>Course: {material.course?.courseName || 'General'}</span>
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 py-2 px-3.5 bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] rounded-xl transition-colors"
                >
                  <FiDownload /> Get Document
                </a>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
