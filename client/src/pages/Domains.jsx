import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiChevronRight, FiCheck, FiBook } from 'react-icons/fi';

const Domains = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await api.get('/domains');
      setDomains(res.data.data);
    } catch (err) {
      toast.error('Failed to load domains');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDomain = async (domainId) => {
    const currentDomainId = user.selectedDomain?._id || user.selectedDomain;
    
    if (currentDomainId === domainId) {
      navigate('/roadmap');
      return;
    }

    setSelecting(true);
    try {
      await api.post('/progress/select-domain', { domainId });
      await refreshUser();
      toast.success('Domain selected! Let\'s personalize your journey.');
      navigate('/setup-profile');
    } catch (err) {
      toast.error('Failed to select domain');
    } finally {
      setSelecting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><div className="spinner"></div></div>;

  const activeKeys = ['dsa', 'web-development', 'web development', 'devops', 'open-source', 'open source'];

  const activeDomains = domains.filter(d => {
    const name = d.name.toLowerCase();
    const slug = (d.slug || '').toLowerCase();
    return activeKeys.includes(slug) || name.includes('dsa') || name.includes('web development') || name.includes('devops') || name.includes('open source');
  });

  const comingSoonDomains = domains.filter(d => {
    const name = d.name.toLowerCase();
    const slug = (d.slug || '').toLowerCase();
    return !(activeKeys.includes(slug) || name.includes('dsa') || name.includes('web development') || name.includes('devops') || name.includes('open source'));
  });

  return (
    <div className="fade-in max-w-7xl mx-auto py-12 px-6 lg:px-8">
      <div className="mb-16 text-center max-w-2xl mx-auto animate-fade-in">
        <span className="text-xs font-black text-[#6366f1] uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/30">specializations</span>
        <h1 className="text-4xl font-extrabold text-[#101828] dark:text-slate-100 tracking-tight mt-4 mb-4">Choose your specialization</h1>
        <p className="text-lg text-[#667085] dark:text-slate-400 font-medium leading-relaxed">
          Select a career domain to start your journey. Each path is expert-curated with structured roadmaps, vetted resources, and validation milestones.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeDomains.map((domain) => {
          const isSelected = user?.selectedDomain?._id === domain._id;
          
          const getProgressKey = (slug) => {
            if (!slug) return '';
            const lowercaseSlug = slug.toLowerCase();
            if (lowercaseSlug === 'web-development' || lowercaseSlug === 'webdev') return 'webdev';
            if (lowercaseSlug === 'open-source' || lowercaseSlug === 'opensource') return 'opensource';
            if (lowercaseSlug === 'devops') return 'devops';
            if (lowercaseSlug === 'dsa') return 'dsa';
            return '';
          };

          const key = getProgressKey(domain.slug);
          const prog = user?.domainsProgress?.[key];
          
          return (
            <div 
              key={domain._id} 
              className={`card p-8 flex flex-col relative overflow-hidden transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${
                isSelected ? 'ring-2 ring-[#4361ee] shadow-xl shadow-indigo-100/50' : 'hover:border-indigo-200 dark:hover:border-indigo-900 hover:shadow-md'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-[#4361ee] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5">
                  <FiCheck className="text-sm" /> Active Path
                </div>
              )}
              
              <div className="flex items-start gap-5 mb-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 dark:border-slate-800"
                  style={{ backgroundColor: `${domain.color}10`, color: domain.color }}
                >
                  {domain.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#101828] dark:text-slate-100 tracking-tight mb-2">{domain.name}</h3>
                  <div className="flex gap-2">
                    <div className={`badge ${
                      domain.difficultyLevel === 'beginner' ? 'badge-green' : 
                      domain.difficultyLevel === 'intermediate' ? 'badge-blue' : 
                      'badge-gray bg-red-50 text-red-600'
                    } py-0.5 px-2.5 font-bold text-[10px] uppercase tracking-wider`}>
                      {domain.difficultyLevel}
                    </div>
                    <div className="badge badge-gray py-0.5 px-2.5 font-bold text-[10px] uppercase tracking-wider">
                      {domain.estimatedDuration}
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-[#667085] dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                {domain.shortDescription}
              </p>

              {prog && (prog.overallProgress > 0 || prog.xp > 0) ? (
                <div className="mb-6 space-y-2 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Level {prog.currentPhase || 1}</span>
                    <span>{prog.overallProgress || 0}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${prog.overallProgress || 0}%`, backgroundColor: domain.color }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-medium text-slate-400 dark:text-slate-500 pt-1">
                    {prog.currentCheckpoint ? (
                      <span className="truncate max-w-[150px]">📍 {prog.currentCheckpoint.replace('_', ' ').toUpperCase()}</span>
                    ) : (
                      <span>Started Recently</span>
                    )}
                    <span className="font-extrabold text-[#4361ee] dark:text-[#818cf8]">{prog.xp || 0} XP</span>
                  </div>
                </div>
              ) : (
                <div className="mb-6 text-xs font-semibold text-slate-400 dark:text-slate-500 italic p-3 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800/40 text-center">
                  Not started yet
                </div>
              )}
              
              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/80">
                <button 
                  onClick={() => handleSelectDomain(domain._id)}
                  disabled={selecting}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected 
                      ? 'btn-primary' 
                      : 'btn-secondary'
                  }`}
                >
                  {isSelected ? (
                    <>Resume Learning <FiChevronRight /></>
                  ) : (
                    <>Start This Path <FiChevronRight /></>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Global Career Guide Card */}
        <div className="card p-8 flex flex-col relative overflow-hidden bg-[#101828] border-none hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4361ee]/20 rounded-full blur-[60px] -mr-10 -mt-10"></div>
          
          <div className="flex items-start gap-5 mb-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl text-white border border-white/10 group-hover:scale-110 transition-transform">
              <FiBook />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">Universal Guide</h3>
              <div className="badge badge-blue bg-indigo-500/20 text-indigo-300 border-indigo-500/30 py-0.5 px-2.5 font-bold text-[10px] uppercase tracking-wider">
                Must Read
              </div>
            </div>
          </div>
          
          <p className="text-indigo-100/60 text-sm leading-relaxed mb-8 flex-1 relative z-10">
            Not sure which path to choose? Read our comprehensive guide on Web Dev, DSA, Competitive Programming, and DevOps to build a "T-Shaped" profile.
          </p>
          
          <div className="mt-auto pt-6 border-t border-white/10 relative z-10">
            <Link 
              to="/career-guide"
              className="w-full py-3 rounded-xl font-bold bg-white text-[#101828] hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
            >
              Master Your Path <FiChevronRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Coming Soon Domains Section */}
      {comingSoonDomains.length > 0 && (
        <div className="mt-24 border-t border-slate-200 dark:border-slate-800 pt-16">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              Coming Soon
            </span>
            <h2 className="text-3xl font-extrabold text-[#101828] dark:text-slate-100 tracking-tight mt-3 mb-2">
              Future Specializations
            </h2>
            <p className="text-sm text-[#667085] dark:text-slate-400">
              We are actively developing highly structured curriculums for these emerging domains. Stay tuned!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoonDomains.map((domain) => (
              <div 
                key={domain._id} 
                className="card p-6 bg-slate-50/50 dark:bg-slate-900/30 border-dashed border-2 border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="absolute top-3 right-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                  Soon
                </div>
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
                      style={{ backgroundColor: `${domain.color}15`, color: domain.color }}
                    >
                      {domain.icon}
                    </div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-tight">{domain.name}</h4>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4">
                    {domain.shortDescription}
                  </p>
                </div>
                <div className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-2">
                  Development Mode
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Domains;
