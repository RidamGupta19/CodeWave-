import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiUnlock, FiCheckCircle, FiPlayCircle, FiZap, FiStar, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Levels will be derived dynamically from the phases data
const getLevelIcon = (index, domainSlug) => {
  if (domainSlug === 'dsa') {
    const dsaIcons = ["🌱", "🧱", "🗺️", "🥷", "⚔️", "🛡️", "🌳", "⛰️", "👹", "🏹", "🏆"];
    return dsaIcons[index] || "🔥";
  }
  const icons = ["🌐", "🧱", "🎨", "🧟", "🐙", "⚛️", "⚙️", "🗄️", "🏗️"];
  return icons[index] || "⭐️";
};

const getLevelThreshold = (index) => {
  return index * 300;
};

const Roadmap = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [domainData, setDomainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState(null);

  const domainId = user?.selectedDomain?._id || user?.selectedDomain;

  useEffect(() => {
    const initRoadmap = async () => {
      try {
        const freshUser = await refreshUser();
        if (!freshUser?.selectedDomain) {
          navigate('/domains');
          return;
        }
      } catch (err) {
        console.error(err);
      }
    };
    initRoadmap();
  }, []);

  useEffect(() => {
    if (domainId) {
      fetchRoadmap(domainId);
    }
  }, [domainId]);

  const fetchRoadmap = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/domains/${id}`);
      setDomainData(res.data.data);
      if (activeLevel === null) {
        setActiveLevel(user?.currentPhase || 0);
      }
    } catch (err) {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const isTopicCompleted = (topicId) => {
    return user?.completedTopics?.some(t => t.topicId === topicId || t.topicId?._id === topicId);
  };

  if (loading) return <div className="flex justify-center py-24"><div className="spinner"></div></div>;
  if (!domainData) return null;

  const { domain, phases } = domainData;
  const currentXP = user.xp || 0;
  const currentStreak = user.dailyStreak || 0;
  const isDSA = domain.slug === 'dsa';

  return (
    <div className={`pb-20 max-w-6xl mx-auto px-6 pt-10 ${isDSA ? 'dsa-theme' : ''}`}>
      {/* Premium Gamification Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-6 bg-white flex items-center gap-5 border-b-4 border-amber-400">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl text-amber-500 shadow-inner">
            <FiZap />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Experience Points</div>
            <div className="text-2xl font-black text-[#1a1a1a]">{currentXP} XP</div>
          </div>
        </div>
        <div className="card p-6 bg-white flex items-center gap-5 border-b-4 border-emerald-400">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl text-emerald-500 shadow-inner">
            <FiTrendingUp />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Daily Streak</div>
            <div className="text-2xl font-black text-[#1a1a1a]">{currentStreak} 🔥</div>
          </div>
        </div>
        <div className="card p-6 bg-white flex items-center gap-5 border-b-4 border-indigo-400">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl text-indigo-500 shadow-inner">
            <FiStar />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Current Rank</div>
            <div className="text-2xl font-black text-[#1a1a1a]">{phases[user.currentPhase]?.name || 'Apprentice'}</div>
          </div>
        </div>
      </div>

      <div className="text-center mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-2 ${isDSA ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'} rounded-full text-[10px] font-black uppercase tracking-widest mb-6`}>
          <FiZap /> {isDSA ? 'Striver\'s A2Z Roadmap' : (user.profile?.roadmapType || 'Steady Pace')} • {isDSA ? 'Placement Focused' : (user.profile?.estimatedTimeline || '6 Months')}
        </div>
        <h1 className="text-5xl font-black mb-6 text-gradient tracking-tight">
          {isDSA ? 'The Ultimate DSA Journey' : `Your ${domain.name} Adventure`}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          {isDSA ? "Master the art of problem solving with our gamified roadmap based on Striver's A2Z sheet. Level up your skills and crush your placement goals." : (user.profile?.aiSummary || "Master each level to unlock the next chapter of your coding journey.")}
        </p>
      </div>

      {/* Gamified Level Path */}
      <div className="relative py-10 overflow-x-auto no-scrollbar">
        <div className="flex items-start gap-12 min-w-max px-10 pb-10">
          {phases.map((phase, index) => {
            const isUnlocked = index <= (user.currentPhase || 0);
            const isCompleted = index < (user.currentPhase || 0);
            const isCurrent = index === (user.currentPhase || 0);

            return (
              <div key={phase._id} className="flex flex-col items-center relative">
                {/* Level Node */}
                <motion.div
                  whileHover={isUnlocked ? { scale: 1.1, rotate: isCurrent ? [0, -5, 5, 0] : 0 } : {}}
                  onClick={() => isUnlocked && setActiveLevel(index)}
                  className={`level-node cursor-pointer w-24 h-24 rounded-3xl flex flex-col items-center justify-center relative transition-all duration-500 ${
                    isUnlocked 
                      ? isDSA ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xl shadow-amber-200' : 'bg-primary text-white shadow-xl shadow-primary/30' 
                      : 'bg-gray-100 text-gray-300 grayscale'
                  } ${isCompleted ? 'ring-4 ring-emerald-400' : ''} ${isCurrent ? 'ring-8 ring-amber-400/20 scale-110' : ''}`}
                >
                  <span className="text-4xl mb-1">{getLevelIcon(index, domain.slug)}</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter">LVL {index}</span>
                  {isCurrent && <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-black animate-bounce shadow-lg">YOU</div>}
                  {!isUnlocked && <FiLock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-xl" />}
                  {isCompleted && <FiCheckCircle className="absolute -bottom-2 -right-2 text-emerald-500 bg-white rounded-full text-xl shadow-md" />}
                </motion.div>

                {/* Level Title */}
                <div className="mt-4 text-center max-w-[120px]">
                  <div className={`text-xs font-black leading-tight ${isUnlocked ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>{phase.name}</div>
                  <div className="text-[8px] font-bold text-gray-400 uppercase mt-1 tracking-widest">{getLevelThreshold(index)} XP</div>
                </div>

                {index < phases.length - 1 && (
                  <div className={`absolute top-[48px] left-[105px] w-12 h-1.5 rounded-full transition-colors duration-1000 ${isUnlocked && (index + 1 <= user.currentPhase) ? isDSA ? 'bg-amber-400' : 'bg-primary' : 'bg-gray-100'}`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Details Area */}
      {activeLevel !== null && (
        <motion.div 
          key={activeLevel}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-16 card p-10 bg-white shadow-2xl border-2 ${isDSA ? 'border-amber-100' : 'border-primary/10'}`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10 pb-10 border-b border-gray-100">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-6xl bg-gray-50 w-20 h-20 flex items-center justify-center rounded-3xl shadow-inner">{getLevelIcon(activeLevel, domain.slug)}</span>
                <div>
                  <h2 className="text-4xl font-black text-[#1a1a1a] tracking-tight">{phases[activeLevel].name}</h2>
                  <div className={`${isDSA ? 'text-amber-500' : 'text-primary'} font-black text-xs tracking-widest uppercase mt-1`}>Level {activeLevel} Expedition</div>
                </div>
              </div>
              <p className="text-gray-500 leading-relaxed max-w-2xl font-medium text-lg">
                {phases.find(p => p.phaseNumber === activeLevel)?.description || "Complete these challenges to master this level and earn massive XP rewards."}
              </p>
            </div>
            <div className={`${isDSA ? 'bg-amber-50 border-amber-100' : 'bg-primary/5 border-primary/10'} p-6 rounded-3xl border-2 shadow-sm`}>
              <div className={`text-[10px] font-black ${isDSA ? 'text-amber-700' : 'text-primary'} uppercase tracking-widest mb-4`}>Completion Rewards</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[#1a1a1a] font-black">
                  <div className="w-8 h-8 bg-amber-200 text-amber-700 rounded-lg flex items-center justify-center"><FiZap /></div>
                  +500 XP
                </div>
                <div className="flex items-center gap-3 text-[#1a1a1a] font-black">
                  <div className="w-8 h-8 bg-indigo-200 text-indigo-700 rounded-lg flex items-center justify-center"><FiAward /></div>
                  {phases[activeLevel].name} Badge
                </div>
              </div>
            </div>
          </div>

          <TopicsList 
            phaseId={phases.find(p => p.phaseNumber === activeLevel)?._id} 
            isTopicCompleted={isTopicCompleted}
            activeLevel={activeLevel}
            isDSA={isDSA}
          />
        </motion.div>
      )}
    </div>
  );
};

const TopicsList = ({ phaseId, isTopicCompleted, activeLevel, isDSA }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (phaseId) {
      setLoading(true);
      api.get(`/topics/phase/${phaseId}`).then(res => {
        setTopics(res.data.data);
        setLoading(false);
      });
    }
  }, [phaseId]);

  if (!phaseId) return <div className="text-center py-10 text-gray-400 italic">No missions defined for this level yet.</div>;
  if (loading) return <div className="text-center py-20"><div className="spinner w-10 h-10 border-4 mx-auto border-t-amber-400"></div></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {topics.map((topic, i) => {
        const completed = isTopicCompleted(topic._id);
        
        return (
          <Link 
            key={topic._id} 
            to={`/topic/${topic._id}`}
            className={`group p-6 rounded-3xl border-2 transition-all flex items-center justify-between ${
              completed 
                ? 'bg-emerald-50 border-emerald-100 shadow-sm' 
                : 'bg-white border-[#f3f0ec] hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-100 hover:-translate-y-1'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 ${
                completed 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                  : 'bg-gray-50 text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-500 group-hover:rotate-12'
              }`}>
                {completed ? <FiCheckCircle /> : <FiPlayCircle />}
              </div>
              <div>
                <h4 className={`font-black text-lg ${completed ? 'text-emerald-900' : 'text-[#1a1a1a]'}`}>{topic.title}</h4>
                <div className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-widest flex items-center gap-3">
                  <span className="flex items-center gap-1"><FiClock /> {topic.estimatedTime}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-amber-500 font-black">+50 XP</span>
                </div>
              </div>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${completed ? 'bg-emerald-100 text-emerald-500' : 'bg-gray-50 text-gray-200 group-hover:bg-amber-50 group-hover:text-amber-500 group-hover:translate-x-1'}`}>
              <FiZap className="text-xl" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Roadmap;
