import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiCheckCircle, FiPlay, FiBook, FiYoutube, FiCode, FiArrowLeft, FiMessageSquare, FiZap, FiAward, FiClock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { getDsaLanguageContent } from '../utils/dsaContent';

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
  const [selectedLang, setSelectedLang] = useState('cpp');
  
  // DSA feedback state
  const [difficultyFeedback, setDifficultyFeedback] = useState('easy');
  const [confidenceLevel, setConfidenceLevel] = useState(3);
  const [revisionNeeded, setRevisionNeeded] = useState(false);

  useEffect(() => {
    if (user?.profile?.onboardingAnswers?.dsa_language) {
      setSelectedLang(user.profile.onboardingAnswers.dsa_language);
    }
  }, [user]);

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
        notes,
        difficultyFeedback,
        confidenceLevel,
        revisionNeeded
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

  const isCompleted = user?.completedTopics?.some(t => t.topicId === id || t.topicId?._id === id);
  const videoId = getYouTubeId(topic.youtubeLink);
  const isDsaDomain = topic.domainId?.slug === 'dsa' || topic.domainId === 'dsa' || (typeof topic.domainId === 'object' && topic.domainId?.slug === 'dsa') || (typeof topic.domainId === 'string' && topic.domainId === 'dsa');
  const langContent = isDsaDomain ? getDsaLanguageContent(topic.title, selectedLang) : null;

  return (
    <div className={`flex flex-col lg:flex-row min-h-[calc(100vh-100px)] bg-[#fdfcfb] ${isDsaDomain ? 'dsa-workspace' : ''}`}>
      
      {/* LEFT SIDEBAR: Roadmap Progression (Locked/Unlocked) */}
      <div className="w-full lg:w-80 flex-shrink-0 bg-white border-r border-gray-100 hidden lg:block overflow-y-auto custom-scrollbar">
        <div className="p-8">
          <Link to="/roadmap" className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest mb-10 hover:text-primary transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Universe
          </Link>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-xl shadow-inner">
              <FiZap />
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Current Mission</div>
              <div className="font-black text-[#1a1a1a] text-sm leading-tight">Phase {topic.phaseId?.phaseNumber || 0}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {allTopics.map((t, index) => {
              const active = t._id === id;
              const done = user?.completedTopics?.some(ct => ct.topicId === t._id || ct.topicId?._id === t._id);
              return (
                <Link 
                  key={t._id} 
                  to={`/topic/${t._id}`}
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-primary/5 border-2 border-primary/10 shadow-sm' : 'hover:bg-gray-50 border-2 border-transparent'}`}
                >
                  <div className={`mt-0.5 w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center transition-all ${done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-400'}`}>
                    {done ? <FiCheckCircle className="text-sm" /> : <span className="text-[10px] font-black">{index + 1}</span>}
                  </div>
                  <div>
                    <span className={`text-xs font-black leading-tight block mb-1 ${active ? 'text-primary' : done ? 'text-gray-700' : 'text-gray-400'}`}>
                      {t.title}
                    </span>
                    <div className="flex items-center gap-2 text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                       <span>{t.difficulty}</span>
                       <span>•</span>
                       <span>{t.estimatedTime}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* CENTER: Lesson Content & Video */}
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {/* Top Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 p-6 md:px-12 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
               {topic.domainId?.name || 'DSA'}
             </div>
             <h1 className="text-2xl font-black text-[#1a1a1a] tracking-tight">
               {topic.title}
             </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Est.</div>
               <div className="font-black text-[#1a1a1a]">{topic.estimatedTime || '45m'}</div>
            </div>
            <div className="w-px h-8 bg-gray-100 hidden md:block"></div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-amber-200">
              <FiZap /> +50 XP
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-12">
          {/* Video Player Section - Immersive */}
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-[#1a1a1a] flex items-center gap-3">
                  <FiYoutube className="text-red-500" /> Video Instruction
                </h2>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Powered by Striver A2Z</div>
             </div>
             <div className="aspect-video relative group bg-black shadow-2xl rounded-[2.5rem] overflow-hidden border-8 border-white ring-1 ring-gray-100">
              {videoId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&autoplay=0`}
                  title={topic.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-10 text-center">
                  <FiYoutube className="text-6xl mb-4 opacity-20" />
                  <p className="font-black text-white">Video transmission offline. Reference the theory notes below.</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center text-lg">
                      <FiBook />
                   </div>
                   <h3 className="text-2xl font-black text-[#1a1a1a] tracking-tight">Intel Briefing</h3>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm leading-relaxed text-gray-600 font-medium text-lg">
                  {topic.description || "Master the concepts of this mission to progress your journey. Every bit of knowledge is a step towards placement mastery."}
                </div>
              </section>

              {isDsaDomain && langContent && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-lg shadow-sm border border-amber-100">
                           <FiCode />
                        </div>
                        <h3 className="text-2xl font-black text-[#1a1a1a] tracking-tight">DSA Language Engine</h3>
                     </div>
                     <div className="flex flex-wrap gap-1.5 bg-gray-50 p-1 rounded-2xl border border-gray-200">
                       {['cpp', 'java', 'python', 'js'].map((langKey) => (
                         <button
                           key={langKey}
                           type="button"
                           onClick={() => setSelectedLang(langKey)}
                           className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                             selectedLang === langKey 
                               ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' 
                               : 'text-gray-400 hover:text-gray-700'
                           }`}
                         >
                           {langKey === 'cpp' ? 'C++' : langKey === 'java' ? 'Java' : langKey === 'python' ? 'Python' : 'JS'}
                         </button>
                       ))}
                     </div>
                  </div>
                  
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                    <div>
                      <div className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-3">Optimal {langContent.langName} Implementation</div>
                      <pre className="bg-[#1e1e1e] text-emerald-400 p-6 rounded-2xl overflow-x-auto text-sm font-mono shadow-inner border border-gray-800 leading-relaxed max-w-full">
                        <code>{langContent.code}</code>
                      </pre>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50">
                        <div className="text-[10px] text-amber-700 font-black uppercase tracking-widest mb-2">Practice Guidelines</div>
                        <p className="text-xs font-semibold text-gray-600 leading-relaxed">{langContent.recommendations}</p>
                      </div>
                      
                      <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50">
                        <div className="text-[10px] text-indigo-700 font-black uppercase tracking-widest mb-2">Expedition Warnings</div>
                        <p className="text-xs font-semibold text-gray-600 leading-relaxed">{langContent.notes}</p>
                      </div>
                    </div>

                    {langContent.resources && langContent.resources.length > 0 && (
                      <div>
                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Language-Specific Artifacts</div>
                        <div className="flex flex-wrap gap-4">
                          {langContent.resources.map((res, idx) => (
                            <a
                              key={idx}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-500 hover:text-primary hover:border-primary/20 transition-all flex items-center gap-1.5 uppercase"
                            >
                              <FiBook /> {res.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <section>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center text-lg">
                      <FiCode />
                   </div>
                   <h3 className="text-2xl font-black text-[#1a1a1a] tracking-tight">The Challenge</h3>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
                   <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                   <div className="relative z-10">
                      <p className="text-xl font-bold mb-8 leading-snug">
                        {topic.challenge || "Solve the related problem on LeetCode/GFG to prove your mastery of this concept."}
                      </p>
                      <a 
                        href={topic.practiceLink || "https://leetcode.com"} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                      >
                        <FiPlay /> Launch Practice Environment
                      </a>
                   </div>
                </div>
              </section>

              {topic.theoryNotes && (
                <section>
                  <h3 className="text-xl font-black text-[#1a1a1a] mb-6 flex items-center gap-3">
                    <FiAward className="text-amber-500" /> Mission Notes
                  </h3>
                  <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm prose prose-indigo max-w-none">
                    {topic.theoryNotes}
                  </div>
                </section>
              )}

              {/* NEXT LESSON CTA */}
              <div className="flex flex-col sm:flex-row gap-6 pt-10">
                <button 
                  onClick={handleComplete}
                  disabled={submitting || isCompleted}
                  className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black text-lg transition-all ${
                    isCompleted 
                    ? 'bg-emerald-100 text-emerald-600 cursor-default' 
                    : 'bg-primary text-white shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {isCompleted ? <FiCheckCircle className="text-2xl" /> : <FiZap className="text-2xl" />}
                  {isCompleted ? 'MISSION MASTERED' : 'MARK AS COMPLETE'}
                </button>
                
                {allTopics.length > 0 && (
                  <Link 
                    to={`/topic/${allTopics[allTopics.findIndex(t => t._id === id) + 1]?._id || allTopics[0]._id}`}
                    className="flex-1 flex items-center justify-center gap-3 py-6 bg-white border-4 border-gray-100 rounded-[2rem] font-black text-lg text-[#1a1a1a] hover:border-primary/20 transition-all"
                  >
                    NEXT MISSION <FiArrowRight className="text-2xl text-primary" />
                  </Link>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {/* Completion Action - STICKY */}
              <div className="sticky top-28 space-y-8">
                <div className="p-8 bg-white rounded-[2.5rem] border-2 border-primary/5 shadow-2xl shadow-primary/5">
                  <h3 className="text-xl font-black text-[#1a1a1a] mb-8 flex items-center gap-3">
                    <FiCheckCircle className="text-emerald-500" /> Mastery Report
                  </h3>
                  {isCompleted ? (
                    <div className="text-center space-y-6 py-6">
                      <div className="w-20 h-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-emerald-200 animate-pulse">
                        <FiCheckCircle />
                      </div>
                      <div>
                        <div className="font-black text-2xl text-emerald-600">MISSION MASTERED</div>
                        <p className="text-gray-400 font-bold text-xs mt-2 uppercase tracking-widest">+50 XP RECORDED</p>
                      </div>
                      <Link to="/roadmap" className="btn-primary w-full block py-4 font-black shadow-lg shadow-primary/20">Return to Universe</Link>
                    </div>
                  ) : (
                    <form onSubmit={handleComplete} className="space-y-8">
                      <div className="space-y-8">
                        <div>
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-4">Problem Difficulty</label>
                          <div className="grid grid-cols-2 gap-3">
                            {['easy', 'medium', 'hard', 'unsolved'].map((level) => (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setDifficultyFeedback(level)}
                                className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${
                                  difficultyFeedback === level 
                                    ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white shadow-xl' 
                                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-4">Confidence Level</label>
                          <div className="flex justify-between gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setConfidenceLevel(num)}
                                className={`w-11 h-11 rounded-2xl text-xs font-black transition-all border-2 ${
                                  confidenceLevel === num 
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                    : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>

                        <label className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.5rem] border-2 border-gray-100 cursor-pointer hover:border-gray-200 transition-all">
                          <input 
                            type="checkbox" 
                            className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-300"
                            checked={revisionNeeded}
                            onChange={(e) => setRevisionNeeded(e.target.checked)}
                          />
                          <div className="flex flex-col">
                             <span className="text-xs font-black text-gray-700">Mark for Revision</span>
                             <span className="text-[10px] font-bold text-gray-400">Add to your weekly review list</span>
                          </div>
                        </label>
                      </div>

                      <button type="submit" disabled={submitting} className="btn-primary w-full py-5 font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                        {submitting ? 'SUBMITTING LOG...' : 'COMPLETE MISSION'}
                      </button>
                    </form>
                  )}
                </div>

                {/* AI Assistant Callout */}
                <div className="p-8 bg-indigo-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                   <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>
                   <div className="relative z-10">
                      <FiMessageSquare className="text-indigo-400 mb-4 text-2xl" />
                      <h4 className="text-lg font-black mb-2">Stuck on logic?</h4>
                      <p className="text-xs text-indigo-200 font-bold mb-6">Our AI Mentor is trained on this specific problem.</p>
                      <Link to="/ai-chat" className="block text-center py-3 bg-white text-indigo-900 rounded-2xl text-[10px] font-black hover:bg-indigo-50 transition-colors uppercase tracking-widest">
                        Initialize AI Help
                      </Link>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
