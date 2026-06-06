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
        <span className="text-xs font-black text-[var(--brand-orange)] uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100">specializations</span>
        <h1 className="text-4xl font-black text-[var(--land-text)] tracking-tight mt-4 mb-4">Choose your pathway</h1>
        <p className="text-lg text-[var(--land-nav)] font-bold leading-relaxed">
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
              onClick={() => handleSelectDomain(domain._id)}
              className={`card flex flex-col relative overflow-hidden transition-all duration-300 bg-[var(--bg-card)] border-2 border-[var(--border-light)] group cursor-pointer ${
                isSelected ? 'ring-2 ring-[var(--brand-green)] shadow-[var(--shadow-bubbly)] border-transparent' : 'hover:border-[var(--brand-green-light)] hover:shadow-lg'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 z-50 bg-[var(--brand-green)] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5 shadow-md">
                  <FiCheck className="text-sm" /> Active Path
                </div>
              )}
              
              {/* TOP HEADER SECTION */}
              <div className="w-full h-48 relative overflow-hidden flex bg-slate-900 shrink-0 border-b border-[var(--border-light)]">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
                
                <div className="absolute top-6 left-6 z-20 max-w-[60%] pointer-events-none">
                  <h3 className="text-white font-black text-xl leading-tight mb-2 drop-shadow-md">
                    {domain.name.toLowerCase().includes('web development') ? 'Mern Full Stack Development' : domain.name.toUpperCase()}
                  </h3>
                  <div className="inline-block bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded tracking-wider uppercase border border-red-500 shadow-sm">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white mr-1 animate-pulse"></span>
                    Live Course
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 z-20 bg-black/40 backdrop-blur-sm border border-white/10 rounded px-2 py-0.5 flex items-center gap-1 text-white text-[10px] font-bold">
                  <span className="text-yellow-400">★</span> 4.7
                </div>

                {/* Isometric Image */}
                <div className="absolute right-0 top-0 bottom-0 w-2/3 z-0 flex items-center justify-center p-2">
                  <img 
                    src={`/images/domain_${key || 'dsa'}.png`} 
                    alt={domain.name} 
                    className="w-[140%] h-[140%] object-contain object-right group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl" 
                    onError={(e) => { e.target.src = '/images/domain_guide.png'; }}
                  />
                </div>
              </div>

              {/* CARD BODY */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-black text-[var(--land-text)] tracking-tight mb-2 line-clamp-2">
                  {domain.name.toLowerCase().includes('web development') 
                    ? 'MERN Full Stack Development Course (with Placement Assistance)' 
                    : `${domain.name} Training Program - Live`}
                </h3>
                
                <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider mb-4">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M4 22V2h2v20H4zm6 0V10h2v12h-2zm6 0V6h2v16h-2zm6 0v-8h2v8h-2z"></path></svg>
                  {domain.difficultyLevel} to Advanced
                </div>
                
                <p className="text-[var(--text-muted)] font-semibold text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
                  {domain.shortDescription}
                </p>

                {prog && (prog.overallProgress > 0 || prog.xp > 0) && (
                  <div className="mb-6 space-y-2 bg-[var(--land-bg-alt)] p-3.5 rounded-xl border border-[var(--border-light)]">
                    <div className="flex justify-between text-[10px] font-black text-[var(--text-light)] uppercase tracking-widest">
                      <span>Lvl {prog.currentPhase || 1}</span>
                      <span>{prog.overallProgress || 0}%</span>
                    </div>
                    <div className="w-full bg-[var(--border-light)] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${prog.overallProgress || 0}%`, backgroundColor: domain.color || 'var(--brand-green)' }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* FOOTER */}
                <div className="mt-auto pt-4 border-t border-[var(--border-light)] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-light)]">
                    <svg className="w-3.5 h-3.5 text-[var(--brand-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    Join the pioneer batch!
                  </div>
                  <button 
                    onClick={() => handleSelectDomain(domain._id)}
                    disabled={selecting}
                    className="text-[var(--brand-green)] font-black text-xs hover:text-[var(--brand-green-hover)] transition-colors cursor-pointer"
                  >
                    {isSelected ? 'Resume Path' : 'Explore now'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Global Career Guide Card (Light Theme) */}
        <div className="card p-8 flex flex-col relative overflow-hidden bg-[var(--brand-purple)] border-none shadow-lg hover:shadow-2xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--bg-card)]/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-900/40 rounded-full blur-2xl -ml-10 -mb-10"></div>
          
          <div className="flex items-start gap-5 mb-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl text-white border border-white/20 group-hover:scale-110 transition-transform overflow-hidden">
               <img src="/images/domain_guide.png" alt="Guide" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight mb-2">Universal Guide</h3>
              <div className="badge bg-white/20 text-white border-none py-0.5 px-2.5 font-black text-[10px] uppercase tracking-wider inline-block">
                Must Read
              </div>
            </div>
          </div>
          
          <p className="text-purple-100 text-sm font-bold leading-relaxed mb-8 flex-1 relative z-10">
            Not sure which path to choose? Read our comprehensive guide on Web Dev, DSA, Competitive Programming, and DevOps to build a "T-Shaped" profile.
          </p>
          
          <div className="mt-auto pt-6 border-t border-white/20 relative z-10">
            <Link 
              to="/career-guide"
              className="w-full py-3 rounded-xl font-black bg-[var(--bg-card)] text-[var(--brand-purple)] hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-1"
            >
              Master Your Path <FiChevronRight strokeWidth={4} />
            </Link>
          </div>
        </div>
      </div>

      {/* Coming Soon Domains Section */}
      {comingSoonDomains.length > 0 && (
        <div className="mt-24 border-t border-[var(--border)] pt-16">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-widest bg-[var(--bg-sub)] px-3 py-1 rounded-full">
              Coming Soon
            </span>
            <h2 className="text-3xl font-black text-[var(--land-text)] tracking-tight mt-3 mb-2">
              Future Specializations
            </h2>
            <p className="text-sm text-[var(--land-nav)] font-bold">
              We are actively developing highly structured curriculums for these emerging domains. Stay tuned!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comingSoonDomains.map((domain) => (
              <div 
                key={domain._id} 
                className="card p-6 bg-[var(--bg-sub)] border-dashed border-2 border-[var(--border)] relative overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-[var(--border)]"
              >
                <div className="absolute top-3 right-3 bg-[var(--border-light)] text-[var(--text-muted)] text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
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
                    <h4 className="text-sm font-black text-[var(--text-main)] tracking-tight">{domain.name}</h4>
                  </div>
                  <p className="text-[var(--text-light)] text-xs font-bold leading-relaxed mb-4">
                    {domain.shortDescription}
                  </p>
                </div>
                <div className="text-[9px] font-black text-[var(--brand-orange)] uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-2">
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
