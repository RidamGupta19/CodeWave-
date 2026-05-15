import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiExternalLink, FiCheck, FiPlay, FiBook, FiYoutube, FiCode, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studyTime, setStudyTime] = useState(30);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTopic();
  }, [id]);

  const fetchTopic = async () => {
    try {
      const res = await api.get(`/topics/${id}`);
      setTopic(res.data.data);
      
      // Mark as started if not already
      const isStarted = user.startedTopics?.some(t => t.topicId === id || t.topicId?._id === id);
      const isCompleted = user.completedTopics?.some(t => t.topicId === id || t.topicId?._id === id);
      
      if (!isStarted && !isCompleted) {
        await api.post('/progress/start-topic', { topicId: id });
        refreshUser();
      }

      if (isCompleted) {
        const completedData = user.completedTopics.find(t => t.topicId === id || t.topicId?._id === id);
        if (completedData) setNotes(completedData.notes || '');
      }

    } catch (err) {
      toast.error('Failed to load topic details');
      navigate('/roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/progress/complete-topic', { 
        topicId: id,
        studyTimeMinutes: Number(studyTime),
        notes 
      });
      await refreshUser();
      toast.success('Topic completed successfully! 🎉');
      navigate('/roadmap');
    } catch (err) {
      toast.error('Failed to mark as completed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"></div></div>;
  if (!topic) return null;

  const isCompleted = user.completedTopics?.some(t => t.topicId === id || t.topicId?._id === id);

  return (
    <div className="fade-in pb-10 max-w-5xl mx-auto">
      <Link to="/roadmap" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
        <FiArrowLeft /> Back to Roadmap
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="glass p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`badge ${topic.difficulty === 'beginner' ? 'badge-green' : topic.difficulty === 'intermediate' ? 'badge-yellow' : 'badge-red'}`}>
                {topic.difficulty}
              </span>
              <span className="badge badge-purple">{topic.estimatedTime}</span>
              {isCompleted && <span className="badge badge-green"><FiCheck /> Completed</span>}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{topic.title}</h1>
            <p className="text-slate-400 text-lg">{topic.description}</p>
          </div>

          {/* Resources */}
          <div className="glass p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FiBook /> Learning Resources
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {topic.gfgLink && (
                <a href={topic.gfgLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[#16161f] rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50 hover:border-emerald-500/50 group">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <FiBook />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200 group-hover:text-white">GeeksforGeeks</div>
                    <div className="text-xs text-slate-500">Read article</div>
                  </div>
                  <FiExternalLink className="text-slate-600 group-hover:text-emerald-500" />
                </a>
              )}
              {topic.youtubeLink && (
                <a href={topic.youtubeLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[#16161f] rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50 hover:border-red-500/50 group">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <FiYoutube />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200 group-hover:text-white">YouTube</div>
                    <div className="text-xs text-slate-500">Watch tutorial</div>
                  </div>
                  <FiExternalLink className="text-slate-600 group-hover:text-red-500" />
                </a>
              )}
              {topic.practiceLink && (
                <a href={topic.practiceLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[#16161f] rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50 hover:border-indigo-500/50 group">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <FiCode />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200 group-hover:text-white">Practice</div>
                    <div className="text-xs text-slate-500">HackerRank / Coding</div>
                  </div>
                  <FiExternalLink className="text-slate-600 group-hover:text-indigo-500" />
                </a>
              )}
              {topic.documentationLink && (
                <a href={topic.documentationLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[#16161f] rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50 hover:border-blue-500/50 group">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <FiBook />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200 group-hover:text-white">Documentation</div>
                    <div className="text-xs text-slate-500">Official Docs</div>
                  </div>
                  <FiExternalLink className="text-slate-600 group-hover:text-blue-500" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div>
          <div className="glass p-6 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-4">Complete Topic</h3>
            
            {isCompleted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  <FiCheck />
                </div>
                <h4 className="font-bold text-white mb-2">Topic Completed</h4>
                <p className="text-sm text-slate-400 mb-6">Great job! You've already mastered this topic.</p>
                <Link to="/roadmap" className="btn-secondary w-full justify-center">Continue Roadmap</Link>
              </div>
            ) : (
              <form onSubmit={handleComplete} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Time spent (minutes)</label>
                  <input 
                    type="number" 
                    min="5" 
                    required 
                    className="input-field bg-[#16161f]" 
                    value={studyTime}
                    onChange={(e) => setStudyTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Personal Notes (Optional)</label>
                  <textarea 
                    rows="4" 
                    className="input-field bg-[#16161f] resize-none" 
                    placeholder="Jot down key takeaways..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center mt-2">
                  {submitting ? 'Submitting...' : 'Mark as Completed'}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="text-sm font-bold text-slate-300 mb-3">Stuck?</h4>
              <Link to="/ai-mentor" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors font-medium text-sm">
                <FiMessageSquare /> Ask AI Mentor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
