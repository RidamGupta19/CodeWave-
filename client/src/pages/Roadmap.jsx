import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiUnlock, FiCheckCircle, FiPlayCircle, FiBookOpen, FiChevronRight, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Roadmap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [domainData, setDomainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState(null);

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
      setExpandedPhase(user.currentPhase);
    } catch (err) {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const isTopicCompleted = (topicId) => {
    return user.completedTopics?.some(t => t.topicId === topicId || t.topicId?._id === topicId);
  };

  const isTopicStarted = (topicId) => {
    return user.startedTopics?.some(t => t.topicId === topicId || t.topicId?._id === topicId);
  };

  if (loading) return <div className="flex justify-center py-24"><div className="spinner"></div></div>;
  if (!domainData) return null;

  const { domain, phases } = domainData;

  return (
    <div className="fade-in pb-20 max-w-5xl mx-auto px-6 pt-10">
      {/* Roadmap Header Card */}
      <div className="card p-10 mb-12 rounded-3xl relative overflow-hidden bg-white border-soft">
        <div className="absolute top-0 right-0 w-80 h-80 opacity-5 rounded-full blur-[100px] -mr-32 -mt-32" style={{ backgroundColor: domain.color }}></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[#f9fafb] border border-[#eaecf0] rounded-2xl flex items-center justify-center text-5xl shadow-sm">
              {domain.icon}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#101828] tracking-tight">{domain.name} Roadmap</h1>
              <div className="flex items-center gap-4 mt-3">
                <div className="badge badge-blue py-1.5 px-4 font-bold">{user.overallProgress}% Complete</div>
                <div className="text-sm font-bold text-[#667085] uppercase tracking-widest">Phase {user.currentPhase} of {phases.length}</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64">
            <div className="flex justify-between text-xs font-bold text-[#98a2b3] uppercase tracking-widest mb-2.5">
              <span>Path Progress</span>
              <span>Target: 100%</span>
            </div>
            <div className="progress-bar h-2.5">
              <div className="progress-fill" style={{ width: `${user.overallProgress}%`, backgroundColor: domain.color }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="relative">
        {/* Continuous Timeline Line */}
        <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#eaecf0] md:-translate-x-0.5"></div>

        <div className="space-y-16 relative">
          {phases.map((phase, index) => {
            const isUnlocked = user.currentPhase >= phase.phaseNumber;
            const isCompleted = user.currentPhase > phase.phaseNumber;
            const isCurrent = user.currentPhase === phase.phaseNumber;
            const isExpanded = expandedPhase === phase.phaseNumber;

            return (
              <div key={phase._id} className="relative">
                {/* Timeline Node */}
                <div className={`absolute left-5 md:left-1/2 w-10 h-10 -translate-x-1/2 rounded-full border-4 border-[#fcfcfd] z-10 flex items-center justify-center shadow-sm transition-all duration-300 ${
                  isCompleted ? 'bg-emerald-500 text-white' : 
                  isCurrent ? 'bg-[#4361ee] text-white ring-4 ring-indigo-50' : 
                  'bg-white border-[#eaecf0] text-[#98a2b3]'
                }`}>
                  {isCompleted ? <FiCheckCircle /> : isUnlocked ? phase.phaseNumber : <FiLock className="text-sm" />}
                </div>

                <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Phase Card Content */}
                  <div className={`w-full md:w-[calc(50%-2.5rem)] ml-14 md:ml-0`}>
                    <div 
                      onClick={() => isUnlocked && setExpandedPhase(isExpanded ? null : phase.phaseNumber)}
                      className={`card p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${
                        isCurrent ? 'border-[#4361ee] bg-white ring-1 ring-indigo-50 shadow-lg shadow-indigo-100/50' : 
                        isCompleted ? 'border-[#eaecf0] bg-[#f9fafb]' : 
                        'border-[#f2f4f7] bg-white opacity-60 grayscale'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="badge badge-gray bg-[#f2f4f7] text-[#344054] font-bold py-1 px-3">PHASE {phase.phaseNumber}</div>
                        {isCurrent && <span className="text-[10px] font-black text-[#4361ee] uppercase tracking-[0.2em] animate-pulse">Active Now</span>}
                      </div>
                      <h3 className={`text-xl font-bold mb-2 tracking-tight ${isUnlocked ? 'text-[#101828]' : 'text-[#98a2b3]'}`}>
                        {phase.name}
                      </h3>
                      <p className="text-[#667085] text-sm leading-relaxed mb-4">{phase.description}</p>
                      <div className="flex items-center gap-4 text-[11px] font-bold text-[#98a2b3] uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><FiClock /> {phase.estimatedDuration}</span>
                        {isUnlocked && <span className="text-[#4361ee] flex items-center gap-1">Click to {isExpanded ? 'close' : 'expand'} <FiChevronRight className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} /></span>}
                      </div>
                    </div>
                  </div>
                  
                  {/* Spacer for MD screens */}
                  <div className="hidden md:block w-10"></div>
                  <div className="hidden md:block w-[calc(50%-2.5rem)]"></div>
                </div>

                {/* Expanded Topics Area */}
                {isExpanded && isUnlocked && (
                  <div className="mt-8 ml-14 md:ml-0 md:w-full animate-in fade-in slide-in-from-top-2 duration-300 relative z-20">
                    <div className="card p-8 bg-white border-soft shadow-xl md:max-w-3xl md:mx-auto">
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#f2f4f7]">
                        <h4 className="text-lg font-bold text-[#101828]">Curriculum Details</h4>
                        <div className="text-xs font-bold text-[#98a2b3] uppercase tracking-widest">Mastery Required</div>
                      </div>
                      
                      <TopicsList phaseId={phase._id} isTopicCompleted={isTopicCompleted} isTopicStarted={isTopicStarted} />
                      
                      <div className="mt-10 p-6 rounded-2xl bg-[#f9fafb] border border-[#eaecf0] flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                          <div className="text-sm font-bold text-[#101828] mb-1">Phase Mastery Assessment</div>
                          <p className="text-xs text-[#667085]">Complete all topics above to unlock this validation test.</p>
                        </div>
                        <Link to="/assessments" className="btn-secondary py-2.5 px-6 font-bold shadow-sm">
                          Go to Assessments
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TopicsList = ({ phaseId, isTopicCompleted, isTopicStarted }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/topics/phase/${phaseId}`).then(res => {
      setTopics(res.data.data);
      setLoading(false);
    });
  }, [phaseId]);

  if (loading) return <div className="text-center py-10"><div className="spinner w-8 h-8 border-2 mx-auto"></div></div>;
  if (topics.length === 0) return <div className="text-sm text-[#667085] py-4 text-center font-medium italic">Learning modules coming soon...</div>;

  return (
    <div className="space-y-4">
      {topics.map((topic, i) => {
        const completed = isTopicCompleted(topic._id);
        const started = isTopicStarted(topic._id);
        const isAccessible = i === 0 || isTopicCompleted(topics[i-1]._id);

        return (
          <div key={topic._id} className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
            completed ? 'bg-emerald-50/30 border-emerald-100' : 
            started ? 'bg-indigo-50/30 border-indigo-100' : 
            isAccessible ? 'bg-[#fcfcfd] border-[#eaecf0] hover:border-indigo-200' : 
            'bg-[#f9fafb] border-[#f2f4f7] opacity-60'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                completed ? 'bg-emerald-500 text-white' : 
                started ? 'bg-[#4361ee] text-white' : 
                'bg-white border border-[#eaecf0] text-[#98a2b3]'
              }`}>
                {completed ? <FiCheckCircle /> : started ? <FiPlayCircle /> : <FiBookOpen className="text-sm" />}
              </div>
              <div>
                <div className={`font-bold text-sm ${isAccessible ? 'text-[#101828]' : 'text-[#98a2b3]'}`}>{topic.title}</div>
                <div className="text-[10px] text-[#98a2b3] font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                  <FiClock className="text-xs" /> {topic.estimatedTime}
                </div>
              </div>
            </div>
            {isAccessible ? (
              <Link to={`/topic/${topic._id}`} className={`text-xs font-bold px-5 py-2 rounded-lg border transition-all ${
                completed ? 'text-emerald-700 border-emerald-200 bg-white hover:bg-emerald-50' : 
                'text-[#4361ee] border-indigo-200 bg-white hover:bg-indigo-50 shadow-sm'
              }`}>
                {completed ? 'Review' : started ? 'Continue' : 'Start Lesson'}
              </Link>
            ) : (
              <div className="text-[#98a2b3] text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-widest pr-2">
                <FiLock className="text-xs" /> Locked
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Roadmap;
