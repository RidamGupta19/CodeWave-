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
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-100px)] gap-6 p-4 md:p-8 max-w-[1600px] mx-auto">
      
      {/* LEFT SIDEBAR: Roadmap Progression */}
      <div className="w-full lg:w-72 flex-shrink-0">
        <div className="card p-6 bg-white sticky top-24">
          <Link to="/roadmap" className="flex items-center gap-2 text-primary font-bold text-sm mb-8 hover:translate-x-[-4px] transition-transform">
            <FiArrowLeft /> Back to Mission Map
          </Link>
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Level Progression</div>
          <div className="space-y-4">
            {allTopics.map((t, index) => {
              const active = t._id === id;
              const done = user.completedTopics?.some(ct => ct.topicId === t._id || ct.topicId?._id === t._id);
              return (
                <Link 
                  key={t._id} 
                  to={`/topic/${t._id}`}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-all ${active ? 'bg-primary/5 border border-primary/10' : 'hover:bg-gray-50'}`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${done ? 'bg-emerald-500 text-white' : active ? 'border-2 border-primary' : 'border-2 border-gray-200'}`}>
                    {done ? <FiCheckCircle className="text-[10px]" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                  </div>
                  <span className={`text-sm font-bold leading-tight ${active ? 'text-primary' : done ? 'text-gray-600' : 'text-gray-400'}`}>
                    {t.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* CENTER: Lesson Content */}
      <div className="flex-1 space-y-6">
        {/* Mission Objective */}
        <div className="card p-8 bg-white">
          <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest mb-2">
            <FiAward /> Mission Objective
          </div>
          <h1 className="text-3xl font-black text-[#1a1a1a] mb-4">{topic.title}</h1>
          <p className="text-gray-500 text-lg leading-relaxed">{topic.description}</p>
        </div>

        {/* Video Player */}
        <div className="card overflow-hidden bg-[#1a1a1a] aspect-video relative group">
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
              <p className="font-bold">No video tutorial available for this mission yet.</p>
            </div>
          )}
        </div>

        {/* Lesson Notes & Challenge */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-8 bg-white">
            <h3 className="text-xl font-black text-[#1a1a1a] mb-6 flex items-center gap-2">
              <FiBook className="text-primary" /> Key Takeaways
            </h3>
            <div className="prose prose-sm text-gray-600">
              <p>During this lesson, focus on understanding the core principles of {topic.title}. Pay attention to how it interacts with the broader ecosystem.</p>
              <ul className="mt-4 space-y-2">
                <li>Master the syntax and common patterns.</li>
                <li>Understand the performance implications.</li>
                <li>Learn the best practices for scalable code.</li>
              </ul>
            </div>
          </div>
          <div className="card p-8 bg-amber-50 border-amber-100">
            <h3 className="text-xl font-black text-amber-900 mb-6 flex items-center gap-2">
              <FiCode className="text-amber-500" /> Mini Challenge
            </h3>
            <p className="text-amber-800 text-sm leading-relaxed mb-6">
              "Build a small prototype using the concepts learned in this video. Ensure your code is clean and follow the modular pattern we discussed."
            </p>
            <div className="bg-white/50 p-4 rounded-xl border border-amber-200 text-xs font-bold text-amber-700 italic">
              Goal: Submit a link to your GitHub repo or CodePen to earn bonus XP.
            </div>
          </div>
        </div>

        {/* Completion Form */}
        <div className="card p-10 bg-white">
          <h3 className="text-2xl font-black text-[#1a1a1a] mb-8">Ready to move forward?</h3>
          {isCompleted ? (
            <div className="flex items-center gap-6 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl shadow-lg shadow-emerald-200">
                <FiCheckCircle />
              </div>
              <div>
                <h4 className="text-xl font-black text-emerald-900">Mission Accomplished!</h4>
                <p className="text-emerald-700 font-medium">You've mastered this module. Check your next objective in the roadmap.</p>
              </div>
              <Link to="/roadmap" className="ml-auto btn-primary bg-emerald-600 hover:bg-emerald-700">Continue Journey</Link>
            </div>
          ) : (
            <form onSubmit={handleComplete} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-gray-600 uppercase tracking-widest mb-2">Time Spent (Mins)</label>
                  <input 
                    type="number" 
                    min="1" 
                    required 
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-bold" 
                    value={studyTime}
                    onChange={(e) => setStudyTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-600 uppercase tracking-widest mb-2">Daily Goal Status</label>
                  <div className="h-[58px] flex items-center px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold italic">
                    This session will contribute to your streak! ⚡
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-black text-gray-600 uppercase tracking-widest mb-2">Your Mission Notes</label>
                <textarea 
                  rows="4" 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary focus:bg-white outline-none transition-all font-medium" 
                  placeholder="What did you discover in this lesson?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full py-5 text-xl">
                {submitting ? 'Recording Progress...' : 'Mark Module as Mastered'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: Stats & Progress */}
      <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
        {/* User Stats */}
        <div className="card p-8 bg-white border-2 border-primary/10 shadow-xl shadow-primary/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl text-primary font-black">
              {user.fullName?.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Level {user.currentPhase || 0}</div>
              <div className="font-black text-xl text-[#1a1a1a]">{user.fullName}</div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                <span>XP Progress</span>
                <span>{user.xp || 0} / 5000</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar-fill" style={{ width: `${(user.xp || 0) / 50}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 p-4 rounded-2xl text-center">
                <FiZap className="text-amber-500 text-xl mx-auto mb-1" />
                <div className="text-[10px] font-black text-amber-700 uppercase">Streak</div>
                <div className="text-lg font-black text-amber-900">{user.dailyStreak || 0} Days</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl text-center">
                <FiClock className="text-emerald-500 text-xl mx-auto mb-1" />
                <div className="text-[10px] font-black text-emerald-700 uppercase">Studied</div>
                <div className="text-lg font-black text-emerald-900">{Math.round((user.totalStudyMinutes || 0) / 60)}h</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Mentor CTA */}
        <div className="card p-8 bg-indigo-600 text-white relative overflow-hidden group">
          <FiMessageSquare className="absolute -bottom-4 -right-4 text-8xl opacity-10 group-hover:rotate-12 transition-transform" />
          <h4 className="text-xl font-black mb-4 relative z-10">Confused?</h4>
          <p className="text-indigo-100 text-sm mb-6 relative z-10 font-medium">Our AI mentor is available 24/7 to explain complex concepts in simple terms.</p>
          <Link to="/ai-mentor" className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors relative z-10">
            Chat with Mentor
          </Link>
        </div>

        {/* Badge Sneak Peek */}
        <div className="card p-6 bg-white">
          <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Mastery Badges</div>
          <div className="flex flex-wrap gap-3">
            {['HTML Rookie', 'CSS Samurai', 'JS Warrior'].map((badge, i) => (
              <div key={badge} className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-gray-50 text-gray-200'}`}>
                <FiAward />
              </div>
            ))}
            <div className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-200">
              +
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
