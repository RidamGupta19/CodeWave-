import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiCheckCircle, FiPlay, FiBook, FiYoutube, FiCode, FiArrowLeft, FiMessageSquare, FiZap, FiAward, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [topic, setTopic] = useState(null);
  const [allTopics, setAllTopics] = useState([]);
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
      
      // Fetch other topics in the same phase for the sidebar
      if (res.data.data.phaseId) {
        const phaseRes = await api.get(`/topics/phase/${res.data.data.phaseId._id || res.data.data.phaseId}`);
        setAllTopics(phaseRes.data.data);
      }

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
      toast.success('Level Mastery +50 XP! 🚀');
      navigate('/roadmap');
    } catch (err) {
      toast.error('Failed to mark as completed');
    } finally {
      setSubmitting(false);
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) return <div className="flex justify-center py-24"><div className="spinner"></div></div>;
  if (!topic) return null;

  const isCompleted = user.completedTopics?.some(t => t.topicId === id || t.topicId?._id === id);
  const videoId = getYouTubeId(topic.youtubeLink);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-100px)] bg-[#fdfcfb]">
      
      {/* LEFT SIDEBAR: Roadmap Progression (Locked/Unlocked) */}
      <div className="w-full lg:w-72 flex-shrink-0 bg-white border-r border-gray-100 hidden lg:block overflow-y-auto">
        <div className="p-6">
          <Link to="/roadmap" className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-8 hover:text-primary transition-colors">
            <FiArrowLeft /> Back to Roadmap
          </Link>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Mission Progression</div>
          <div className="space-y-2">
            {allTopics.map((t, index) => {
              const active = t._id === id;
              const done = user.completedTopics?.some(ct => ct.topicId === t._id || ct.topicId?._id === t._id);
              return (
                <Link 
                  key={t._id} 
                  to={`/topic/${t._id}`}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all ${active ? 'bg-primary/5 border border-primary/10 shadow-sm' : 'hover:bg-gray-50'}`}
                >
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${done ? 'bg-emerald-500 text-white shadow-sm' : active ? 'border-2 border-primary text-primary' : 'border-2 border-gray-100 text-gray-300'}`}>
                    {done ? <FiCheckCircle className="text-xs" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                  </div>
                  <span className={`text-xs font-bold leading-tight ${active ? 'text-primary' : done ? 'text-gray-700' : 'text-gray-400'}`}>
                    {t.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* CENTER: Lesson Content & Video */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-100 p-6 md:px-12 flex justify-between items-center sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-black text-[#1a1a1a] flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm">{topic.order || 1}</span>
              {topic.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-black">
              <FiZap /> +50 XP
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black">
              <FiClock /> {topic.estimatedTime || '30m'}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-10">
          {/* Instructor Info */}
          {topic.instructor && (
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-black">
                {topic.instructor.charAt(0)}
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Instructor</div>
                <div className="font-bold text-[#1a1a1a]">{topic.instructor}</div>
              </div>
            </div>
          )}

          {/* Video Player */}
          <div className="card-glass overflow-hidden aspect-video relative group bg-black shadow-2xl rounded-3xl">
            {videoId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
                title={topic.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-10 text-center">
                <FiYoutube className="text-6xl mb-4 opacity-20" />
                <p className="font-black text-white">No video tutorial available for this mission.</p>
              </div>
            )}
          </div>

          {/* Lesson Content Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-lg font-black text-[#1a1a1a] mb-4 flex items-center gap-2">
                  <FiBook className="text-primary" /> Lesson Description
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {topic.description || "In this module, you will learn the fundamental concepts and practical applications related to this topic. Follow along with the video and try the mini-challenge below."}
                </p>
              </section>

              {topic.theoryNotes && (
                <section className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-black text-[#1a1a1a] mb-4">📖 Theory & Notes</h3>
                  <div className="prose prose-sm text-gray-600 font-medium">
                    {topic.theoryNotes}
                  </div>
                </section>
              )}

              <section className="p-8 bg-amber-50 rounded-3xl border border-amber-100">
                <h3 className="text-lg font-black text-amber-900 mb-4 flex items-center gap-2">
                  <FiCode className="text-amber-500" /> Coding Mission
                </h3>
                <p className="text-amber-800 font-bold mb-6">
                  {topic.challenge || "Build a small prototype using the concepts learned in this video. Ensure your code is clean and follow the best practices."}
                </p>
                <div className="flex gap-3">
                  <a href={topic.practiceLink || "#"} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-amber-200 text-amber-900 rounded-xl text-xs font-black hover:bg-amber-300 transition-colors">
                    Start Coding Challenge
                  </a>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              {/* Completion Action */}
              <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 sticky top-28">
                <h3 className="text-lg font-black text-[#1a1a1a] mb-6">Mastery Check</h3>
                {isCompleted ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-200">
                      <FiCheckCircle />
                    </div>
                    <div className="font-black text-emerald-600">Module Mastered!</div>
                    <Link to="/roadmap" className="btn-primary w-full block py-3 text-sm">Next Mission</Link>
                  </div>
                ) : (
                  <form onSubmit={handleComplete} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Study Minutes</label>
                      <input 
                        type="number" 
                        className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none font-bold" 
                        value={studyTime}
                        onChange={(e) => setStudyTime(e.target.value)}
                      />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full py-4 font-black">
                      {submitting ? 'Recording...' : 'Mark as Complete'}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center font-bold">This will update your XP and Streak.</p>
                  </form>
                )}
              </div>

              {/* Resources */}
              <div className="space-y-3">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Quick Resources</div>
                {topic.theoryLink && (
                  <a href={topic.theoryLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary transition-all group">
                    <FiBook className="text-gray-400 group-hover:text-primary" />
                    <span className="text-xs font-bold text-gray-600">Theory Guide</span>
                  </a>
                )}
                {topic.documentationLink && (
                  <a href={topic.documentationLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary transition-all group">
                    <FiCheckCircle className="text-gray-400 group-hover:text-primary" />
                    <span className="text-xs font-bold text-gray-600">Official Docs</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Live Progress Stats */}
      <div className="w-80 flex-shrink-0 bg-white border-l border-gray-100 hidden xl:block p-8">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Personal Journey</div>
        
        <div className="space-y-8">
          {/* User Profile Card */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-black">
              {user.fullName?.charAt(0)}
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Level {user.currentPhase || 0}</div>
              <div className="font-black text-xl text-[#1a1a1a]">{user.fullName?.split(' ')[0]}</div>
            </div>
          </div>

          {/* XP Bar */}
          <div>
            <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
              <span>Overall Progress</span>
              <span>{user.overallProgress || 0}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${user.overallProgress || 0}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>

          {/* Streak & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-amber-50 border border-amber-100">
              <FiZap className="text-amber-500 mb-2" />
              <div className="text-[10px] font-black text-amber-700 uppercase">Streak</div>
              <div className="text-lg font-black text-amber-900">{user.dailyStreak || 0}</div>
            </div>
            <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-100">
              <FiClock className="text-indigo-500 mb-2" />
              <div className="text-[10px] font-black text-indigo-700 uppercase">XP</div>
              <div className="text-lg font-black text-indigo-900">{user.xp || 0}</div>
            </div>
          </div>

          {/* AI Mentor Suggestion */}
          <div className="p-6 bg-[#1a1a1a] rounded-3xl text-white relative overflow-hidden group mt-10">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <FiMessageSquare size={40} />
            </div>
            <h4 className="text-sm font-black mb-2">Need Help?</h4>
            <p className="text-xs text-gray-400 font-medium mb-4">Ask our AI mentor about any concept in this lesson.</p>
            <Link to="/ai-chat" className="block text-center py-2.5 bg-white text-black rounded-xl text-[10px] font-black hover:bg-gray-100 transition-colors">
              Chat with AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
