import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiUnlock, FiCheckCircle, FiPlayCircle, FiZap, FiStar, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Levels will be derived dynamically from the phases data
const getLevelIcon = (index) => {
  const icons = ["🌐", "🧱", "🎨", "🧟", "🐙", "⚛️", "⚙️", "🗄️", "🏗️"];
  return icons[index] || "⭐️";
};

const getLevelThreshold = (index) => {
  return index * 300;
};

const Roadmap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [domainData, setDomainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState(null);

  useEffect(() => {
    if (!user?.selectedDomain) {
      navigate('/domains');
      return;
    }
    fetchRoadmap();
  }, [user]);

  const fetchRoadmap = async () => {
    try {
      const res = await api.get(`/domains/${user.selectedDomain._id || user.selectedDomain}`);
      setDomainData(res.data.data);
      // Set active level based on current phase
      setActiveLevel(user.currentPhase || 0);
    } catch (err) {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const isTopicCompleted = (topicId) => {
    return user.completedTopics?.some(t => t.topicId === topicId || t.topicId?._id === topicId);
  };

  if (loading) return <div className="flex justify-center py-24"><div className="spinner"></div></div>;
  if (!domainData) return null;

  const { domain, phases } = domainData;
  const currentXP = user.xp || 0;
  const currentStreak = user.dailyStreak || 0;

  return (
    <div className="pb-20 max-w-6xl mx-auto px-6 pt-10">
      {/* Premium Gamification Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-6 bg-white flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl text-amber-500 shadow-inner">
            <FiZap />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Experience Points</div>
            <div className="text-2xl font-black text-[#1a1a1a]">{currentXP} XP</div>
          </div>
        </div>
        <div className="card p-6 bg-white flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl text-emerald-500 shadow-inner">
            <FiTrendingUp />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Current Streak</div>
            <div className="text-2xl font-black text-[#1a1a1a]">{currentStreak} Days</div>
          </div>
        </div>
        <div className="card p-6 bg-white flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl text-indigo-500 shadow-inner">
            <FiStar />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Current Rank</div>
            <div className="text-2xl font-black text-[#1a1a1a]">{phases[activeLevel]?.name || 'Explorer'}</div>
          </div>
        </div>
      </div>

      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
          <FiTrendingUp /> {user.profile?.roadmapType || 'Steady Pace'} Path • {user.profile?.estimatedTimeline || '6 Months'}
        </div>
        <h1 className="text-5xl font-black mb-6 text-gradient tracking-tight">Your {user.profile?.roadmapType || 'Developer'} Adventure</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          {user.profile?.aiSummary || "Master each level to unlock the next chapter of your coding journey. Every lesson brings you closer to becoming an Architect."}
        </p>
      </div>

      {/* Gamified Level Path */}
      <div className="relative py-10 overflow-x-auto">
        <div className="flex items-start gap-12 min-w-max px-10">
          {phases.map((phase, index) => {
            const isUnlocked = index <= (user.currentPhase || 0);
            const isCompleted = index < (user.currentPhase || 0);
            const isCurrent = index === (user.currentPhase || 0);

            return (
              <div key={phase._id} className="flex flex-col items-center relative">
                {/* Level Node */}
                <motion.div
                  whileHover={isUnlocked ? { scale: 1.05 } : {}}
                  onClick={() => isUnlocked && setActiveLevel(index)}
                  className={`level-node ${isUnlocked ? 'unlocked' : ''} ${isCompleted ? 'completed' : ''} ${isCurrent ? 'ring-8 ring-primary/10' : ''}`}
                >
                  <span className="text-4xl mb-1">{getLevelIcon(index)}</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter">LVL {index}</span>
                  {isCurrent && <div className="absolute -top-3 -right-3 bg-primary text-white text-[10px] px-2 py-1 rounded-full font-black animate-bounce shadow-lg">YOU</div>}
                  {!isUnlocked && <FiLock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300 text-xl" />}
                </motion.div>

                {/* Level Title */}
                <div className="mt-4 text-center">
                  <div className={`text-sm font-black ${isUnlocked ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>{phase.name}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">{getLevelThreshold(index)} XP Required</div>
                </div>

                {index < phases.length - 1 && (
                  <div className={`absolute top-[60px] left-[120px] w-12 h-1 ${isUnlocked && (index + 1 <= user.currentPhase) ? 'bg-primary' : 'bg-gray-200'}`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Details Area */}
      {activeLevel !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 card p-10 bg-white shadow-2xl border-primary/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10 pb-10 border-b border-gray-100">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{getLevelIcon(activeLevel)}</span>
                <div>
                  <h2 className="text-3xl font-black text-[#1a1a1a]">{phases[activeLevel].name}</h2>
                  <div className="text-primary font-bold text-sm tracking-widest uppercase mt-1">Level {activeLevel} Mission</div>
                </div>
              </div>
              <p className="text-gray-500 leading-relaxed max-w-2xl">
                {phases.find(p => p.phaseNumber === activeLevel)?.description || "Complete these challenges to master this level and earn massive XP rewards."}
              </p>
            </div>
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
              <div className="text-sm font-black text-primary uppercase tracking-widest mb-3">Rewards for Completion</div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#1a1a1a] font-bold">
                  <FiZap className="text-amber-500" /> +500 XP
                </div>
                <div className="flex items-center gap-2 text-[#1a1a1a] font-bold">
                  <FiStar className="text-indigo-500" /> {phases[activeLevel].name} Badge
                </div>
              </div>
            </div>
          </div>

          <TopicsList 
            phaseId={phases.find(p => p.phaseNumber === activeLevel)?._id} 
            isTopicCompleted={isTopicCompleted}
            activeLevel={activeLevel}
          />
        </motion.div>
      )}
    </div>
  );
};

const TopicsList = ({ phaseId, isTopicCompleted, activeLevel }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (phaseId) {
      api.get(`/topics/phase/${phaseId}`).then(res => {
        setTopics(res.data.data);
        setLoading(false);
      });
    }
  }, [phaseId]);

  if (!phaseId) return <div className="text-center py-10 text-gray-400 italic">No missions defined for this level yet.</div>;
  if (loading) return <div className="text-center py-10"><div className="spinner w-8 h-8 border-2 mx-auto"></div></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {topics.map((topic, i) => {
        const completed = isTopicCompleted(topic._id);
        
        return (
          <Link 
            key={topic._id} 
            to={`/topic/${topic._id}`}
            className={`group p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${
              completed ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-[#f3f0ec] hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'
              }`}>
                {completed ? <FiCheckCircle /> : <FiPlayCircle />}
              </div>
              <div>
                <h4 className={`font-black ${completed ? 'text-emerald-900' : 'text-[#1a1a1a]'}`}>{topic.title}</h4>
                <div className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest flex items-center gap-2">
                  <span>{topic.estimatedTime}</span>
                  <span>•</span>
                  <span className="text-amber-500">+50 XP</span>
                </div>
              </div>
            </div>
            <FiZap className={`text-xl transition-all ${completed ? 'text-emerald-500' : 'text-gray-200 group-hover:text-primary group-hover:translate-x-1'}`} />
          </Link>
        );
      })}
    </div>
  );
};

export default Roadmap;
