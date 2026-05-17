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

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
    </div>
  );

  if (!topic) return null;

  const isCompleted = user?.completedTopics?.some(t => t.topicId === id || t.topicId?._id === id);
  const videoId = getYouTubeId(topic.youtubeLink);
  const isDsaDomain = topic.domainId?.slug === 'dsa' || topic.domainId === 'dsa' || (typeof topic.domainId === 'object' && topic.domainId?.slug === 'dsa') || (typeof topic.domainId === 'string' && topic.domainId === 'dsa');
  const langContent = isDsaDomain ? getDsaLanguageContent(topic.title, selectedLang) : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-100px)] transition-colors duration-300">
      
      {/* LEFT SIDEBAR: Roadmap Progression (Locked/Unlocked) */}
      <div className="w-full lg:w-80 flex-shrink-0 bg-[var(--bg-card)] border-r border-[var(--border)] hidden lg:block overflow-y-auto custom-scrollbar transition-colors">
        <div className="p-6">
          <Link to="/roadmap" className="flex items-center gap-2 text-[var(--text-light)] font-black text-[9px] uppercase tracking-widest mb-8 hover:text-[var(--primary)] transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" /> Back to Universe
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-[var(--primary-light)] text-[var(--primary)] rounded-xl flex items-center justify-center text-lg shadow-inner">
              <FiZap />
            </div>
            <div>
              <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-widest leading-none mb-1">Current Mission</div>
              <div className="font-black text-[var(--text-main)] text-sm leading-tight">Phase {topic.phaseId?.phaseNumber || 0}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            {allTopics.map((t, index) => {
              const active = t._id === id;
              const done = user?.completedTopics?.some(ct => ct.topicId === t._id || ct.topicId?._id === t._id);
              return (
                <Link 
                  key={t._id} 
                  to={`/topic/${t._id}`}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all ${
                    active 
                      ? 'bg-[var(--primary-light)] border-[var(--primary)]/20 shadow-sm' 
                      : 'hover:bg-[var(--bg-sub)] border-transparent'
                  }`}
                >
                  <div className={`mt-0.5 w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${
                    done 
                      ? 'bg-emerald-500 text-white shadow' 
                      : active 
                        ? 'bg-[var(--primary)] text-white shadow' 
                        : 'bg-[var(--bg-sub)] text-[var(--text-light)]'
                  }`}>
                    {done ? <FiCheckCircle className="text-xs" /> : <span className="text-[9px] font-black">{index + 1}</span>}
                  </div>
                  <div>
                    <span className={`text-xs font-black leading-tight block mb-0.5 ${active ? 'text-[var(--primary)]' : done ? 'text-[var(--text-main)]' : 'text-[var(--text-light)]'}`}>
                      {t.title}
                    </span>
                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-[var(--text-light)] uppercase tracking-tighter">
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
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar transition-colors">
        
        {/* Sticky Header */}
        <div className="bg-[var(--bg-card)]/80 backdrop-blur-xl border-b border-[var(--border)] p-6 md:px-10 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
             <div className="px-2.5 py-1 bg-[var(--primary-light)] text-[var(--primary)] rounded-lg text-[9px] font-black uppercase tracking-widest border border-[var(--border)]">
               {topic.domainId?.name || 'DSA'}
             </div>
             <h1 className="text-xl md:text-2xl font-black text-[var(--text-main)] tracking-tight">
               {topic.title}
             </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
               <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-widest">Time Est.</div>
               <div className="font-black text-[var(--text-main)] text-sm">{topic.estimatedTime || '45m'}</div>
            </div>
            <div className="w-px h-6 bg-[var(--border)] hidden md:block"></div>
            <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl text-xs font-black shadow-md">
              <FiZap /> +50 XP
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-10">
          {/* Video Player Section */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[var(--text-main)] flex items-center gap-2">
                  <FiYoutube className="text-red-500" /> Video Instruction
                </h2>
                <div className="text-[9px] text-[var(--text-light)] uppercase font-black tracking-widest">Powered by Striver A2Z</div>
             </div>
             
             <div className="aspect-video relative group bg-black shadow-lg rounded-2xl overflow-hidden border border-[var(--border)]">
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
                <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-light)] p-8 text-center bg-[var(--bg-sub)]">
                  <FiPlay className="text-5xl mb-4 text-gray-300 animate-pulse" />
                  <p className="text-sm font-bold">No lecture video associated with this topic.</p>
                </div>
              )}
             </div>
          </div>

          {/* Interactive Language Selector for DSA Code Boilerplates */}
          {isDsaDomain && (
            <div className="card p-6 border-amber-500/10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-[var(--border)] pb-4">
                <div>
                  <h3 className="text-base font-black text-[var(--text-main)] flex items-center gap-2">
                    <FiCode className="text-amber-500" /> Code Implementation Guides
                  </h3>
                  <p className="text-[9px] text-[var(--text-light)] font-bold uppercase mt-1 tracking-wider">Language Specific Cheat Sheet</p>
                </div>
                
                <div className="flex items-center gap-1 bg-[var(--bg-sub)] p-1 rounded-lg border border-[var(--border)] shrink-0">
                  {['cpp', 'java', 'python', 'javascript'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${
                        selectedLang === lang 
                          ? 'bg-amber-500 text-white shadow-sm' 
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JS' : lang}
                    </button>
                  ))}
                </div>
              </div>

              {langContent ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider mb-2">Algorithm Approach</h4>
                    <p className="text-sm text-[var(--text-muted)] bg-[var(--bg-sub)] p-4 rounded-xl border border-[var(--border)] font-semibold leading-relaxed">
                      {langContent.approach}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider">Optimal Boilerplate Code</h4>
                      <span className="text-[8px] font-bold text-[var(--text-light)] uppercase tracking-wider">Read-only guide</span>
                    </div>
                    <pre className="p-4 rounded-xl border border-[var(--border)] bg-[#0f172a] text-emerald-400 font-mono text-xs overflow-x-auto">
                      <code>{langContent.code}</code>
                    </pre>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-4 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl">
                      <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Time Complexity</div>
                      <span className="text-amber-500 font-black text-sm">{langContent.timeComplexity}</span>
                    </div>
                    <div className="p-4 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl">
                      <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-wider mb-1">Space Complexity</div>
                      <span className="text-amber-500 font-black text-sm">{langContent.spaceComplexity}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-[var(--text-light)] italic text-sm">Loading dynamic boilerplate content...</div>
              )}
            </div>
          )}

          {/* Theory Instruction */}
          <div className="card p-6 md:p-8 space-y-4">
            <h2 className="text-lg font-black text-[var(--text-main)] flex items-center gap-2">
              <FiBook className="text-[var(--primary)]" /> Architectural Concept Sheet
            </h2>
            <div className="prose dark:prose-invert max-w-none text-sm text-[var(--text-muted)] leading-relaxed font-semibold whitespace-pre-line bg-[var(--bg-sub)] p-6 rounded-2xl border border-[var(--border)]">
              {topic.description || "Conceptual text details and system architecture explanations will be added dynamically by the roadmapping engine."}
            </div>
          </div>

          {/* Complete Mission form */}
          <div className="card p-6 md:p-8 border-t-4 border-emerald-500">
             <div className="mb-6">
                <h3 className="text-lg font-black text-[var(--text-main)] flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-500" /> Log Expedition Mastery
                </h3>
                <p className="text-xs text-[var(--text-light)] font-bold uppercase mt-1 tracking-wider">Earn XP points and complete quest phases</p>
             </div>

             <form onSubmit={handleComplete} className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-black text-[var(--text-muted)] uppercase tracking-wider mb-2">Time spent studying (Minutes)</label>
                   <input
                     type="number"
                     min="1"
                     value={studyTime}
                     onChange={(e) => setStudyTime(e.target.value)}
                     className="w-full px-4 py-3 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                     required
                   />
                 </div>
                 
                 <div>
                   <label className="block text-xs font-black text-[var(--text-muted)] uppercase tracking-wider mb-2">Self Confidence Standing</label>
                   <div className="flex items-center gap-2 bg-[var(--bg-sub)] border border-[var(--border)] p-2 rounded-xl">
                     {[1, 2, 3, 4, 5].map((lvl) => (
                       <button
                         type="button"
                         key={lvl}
                         onClick={() => setConfidenceLevel(lvl)}
                         className={`w-9 h-9 rounded-lg text-xs font-black transition-all flex items-center justify-center border ${
                           confidenceLevel === lvl 
                             ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                             : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)]'
                         }`}
                       >
                         {lvl}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-black text-[var(--text-muted)] uppercase tracking-wider mb-2">Difficulty Standing</label>
                   <div className="flex gap-2 bg-[var(--bg-sub)] p-1 rounded-xl border border-[var(--border)]">
                     {['easy', 'medium', 'hard'].map((diff) => (
                       <button
                         type="button"
                         key={diff}
                         onClick={() => setDifficultyFeedback(diff)}
                         className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
                           difficultyFeedback === diff 
                             ? 'bg-emerald-500 text-white shadow-sm' 
                             : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)]'
                         }`}
                       >
                         {diff}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="flex items-center gap-3">
                   <input
                     type="checkbox"
                     id="revision"
                     checked={revisionNeeded}
                     onChange={(e) => setRevisionNeeded(e.target.checked)}
                     className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] h-4 w-4 bg-[var(--bg-sub)]"
                   />
                   <label htmlFor="revision" className="text-xs font-black text-[var(--text-muted)] uppercase tracking-wider cursor-pointer">
                     Request revision session flag
                   </label>
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-black text-[var(--text-muted)] uppercase tracking-wider mb-2">Personal Expedition Notes</label>
                 <textarea
                   rows={4}
                   value={notes}
                   onChange={(e) => setNotes(e.target.value)}
                   placeholder="Type core takeaways, algorithmic proofs, or setup findings..."
                   className="w-full p-4 bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                 />
               </div>

               <div className="flex gap-4">
                 <button
                   type="submit"
                   disabled={submitting}
                   className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                   {submitting ? 'Archiving...' : 'Complete Expedition Mission'} <FiArrowRight size={14} />
                 </button>
               </div>
             </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default TopicDetail;
