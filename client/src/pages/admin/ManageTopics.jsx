import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiExternalLink, FiBook, FiYoutube } from 'react-icons/fi';

const ManageTopics = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [phases, setPhases] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [formData, setFormData] = useState({
    theoryLink: '',
    gfgLink: '',
    youtubeLink: '',
    documentationLink: '',
    practiceLink: '',
    notesLink: ''
  });

  useEffect(() => {
    fetchDomains();
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      fetchPhases();
    }
  }, [selectedDomain]);

  useEffect(() => {
    if (selectedPhase) {
      fetchTopics();
    }
  }, [selectedPhase]);

  const fetchDomains = async () => {
    try {
      const res = await api.get('/domains');
      setDomains(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load domains');
    }
  };

  const fetchPhases = async () => {
    try {
      const res = await api.get(`/phases/domain/${selectedDomain}`);
      setPhases(res.data.data || []);
      setSelectedPhase('');
      setTopics([]);
    } catch (err) {
      toast.error('Failed to load phases');
    }
  };

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/topics/phase/${selectedPhase}`);
      setTopics(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (topic) => {
    setEditingTopic(topic._id);
    setFormData({
      theoryLink: topic.theoryLink || '',
      gfgLink: topic.gfgLink || '',
      youtubeLink: topic.youtubeLink || '',
      documentationLink: topic.documentationLink || '',
      practiceLink: topic.practiceLink || '',
      notesLink: topic.notesLink || ''
    });
  };

  const handleCancel = () => {
    setEditingTopic(null);
    setFormData({
      theoryLink: '',
      gfgLink: '',
      youtubeLink: '',
      documentationLink: '',
      practiceLink: '',
      notesLink: ''
    });
  };

  const handleSave = async (topicId) => {
    try {
      await api.put(`/topics/${topicId}`, formData);
      toast.success('Topic resources updated successfully!');
      setEditingTopic(null);
      fetchTopics();
    } catch (err) {
      toast.error('Failed to update topic resources');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin" className="text-sm text-[var(--text-light)] hover:text-[var(--primary)] mb-4 inline-block">
            ← Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-black text-[var(--text-main)] mb-2">Manage Topic Resources</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Add and manage learning resource links for each topic across all domains and phases
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                Select Domain
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="">-- Choose Domain --</option>
                {domains.map((domain) => (
                  <option key={domain._id} value={domain._id}>
                    {domain.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                Select Phase
              </label>
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                disabled={!selectedDomain}
                className="w-full px-4 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
              >
                <option value="">-- Choose Phase --</option>
                {phases.map((phase) => (
                  <option key={phase._id} value={phase._id}>
                    Phase {phase.phaseNumber}: {phase.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Topics List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : topics.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-12 text-center">
            <FiBook className="mx-auto text-5xl text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-muted)]">
              {selectedPhase ? 'No topics found in this phase' : 'Select a domain and phase to view topics'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <div
                key={topic._id}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-main)] mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">{topic.description}</p>
                  </div>
                  {editingTopic !== topic._id && (
                    <button
                      onClick={() => handleEdit(topic)}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg text-sm font-bold transition-all"
                    >
                      <FiEdit2 size={16} /> Edit Resources
                    </button>
                  )}
                </div>

                {editingTopic === topic._id ? (
                  <div className="space-y-4 border-t border-[var(--border)] pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-light)] uppercase mb-2">
                          <FiBook className="inline mr-1" /> GeeksforGeeks Link
                        </label>
                        <input
                          type="url"
                          value={formData.gfgLink}
                          onChange={(e) => setFormData({ ...formData, gfgLink: e.target.value })}
                          placeholder="https://www.geeksforgeeks.org/..."
                          className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[var(--text-light)] uppercase mb-2">
                          <FiYoutube className="inline mr-1" /> YouTube Video Link
                        </label>
                        <input
                          type="url"
                          value={formData.youtubeLink}
                          onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[var(--text-light)] uppercase mb-2">
                          📖 Official Documentation
                        </label>
                        <input
                          type="url"
                          value={formData.documentationLink}
                          onChange={(e) => setFormData({ ...formData, documentationLink: e.target.value })}
                          placeholder="https://developer.mozilla.org/..."
                          className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[var(--text-light)] uppercase mb-2">
                          🎓 Theory & Concepts
                        </label>
                        <input
                          type="url"
                          value={formData.theoryLink}
                          onChange={(e) => setFormData({ ...formData, theoryLink: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[var(--text-light)] uppercase mb-2">
                          💪 Practice Problems
                        </label>
                        <input
                          type="url"
                          value={formData.practiceLink}
                          onChange={(e) => setFormData({ ...formData, practiceLink: e.target.value })}
                          placeholder="https://www.hackerrank.com/..."
                          className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[var(--text-light)] uppercase mb-2">
                          📝 Study Notes
                        </label>
                        <input
                          type="url"
                          value={formData.notesLink}
                          onChange={(e) => setFormData({ ...formData, notesLink: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-sub)] hover:bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-main)] rounded-lg text-sm font-bold transition-all"
                      >
                        <FiX size={16} /> Cancel
                      </button>
                      <button
                        onClick={() => handleSave(topic._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition-all"
                      >
                        <FiSave size={16} /> Save Resources
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-[var(--border)] pt-4">
                    {topic.gfgLink && (
                      <a
                        href={topic.gfgLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 hover:bg-emerald-500/20 transition-all text-xs"
                      >
                        <span>📚 GeeksforGeeks</span>
                        <FiExternalLink size={12} />
                      </a>
                    )}
                    {topic.youtubeLink && (
                      <a
                        href={topic.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500/20 transition-all text-xs"
                      >
                        <span>🎥 YouTube</span>
                        <FiExternalLink size={12} />
                      </a>
                    )}
                    {topic.documentationLink && (
                      <a
                        href={topic.documentationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-500 hover:bg-blue-500/20 transition-all text-xs"
                      >
                        <span>📖 Documentation</span>
                        <FiExternalLink size={12} />
                      </a>
                    )}
                    {topic.theoryLink && (
                      <a
                        href={topic.theoryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-500 hover:bg-purple-500/20 transition-all text-xs"
                      >
                        <span>🎓 Theory</span>
                        <FiExternalLink size={12} />
                      </a>
                    )}
                    {topic.practiceLink && (
                      <a
                        href={topic.practiceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 hover:bg-amber-500/20 transition-all text-xs"
                      >
                        <span>💪 Practice</span>
                        <FiExternalLink size={12} />
                      </a>
                    )}
                    {topic.notesLink && (
                      <a
                        href={topic.notesLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-500 hover:bg-pink-500/20 transition-all text-xs"
                      >
                        <span>📝 Notes</span>
                        <FiExternalLink size={12} />
                      </a>
                    )}
                    {!topic.gfgLink && !topic.youtubeLink && !topic.documentationLink && !topic.theoryLink && !topic.practiceLink && !topic.notesLink && (
                      <div className="col-span-full text-center text-sm text-[var(--text-muted)] italic py-2">
                        No resources added yet
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTopics;
