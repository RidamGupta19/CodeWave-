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
    if (user.selectedDomain?._id === domainId) {
      navigate('/roadmap');
      return;
    }

    if (user.selectedDomain && !window.confirm('Changing domains will reset your phase progress. Are you sure?')) {
      return;
    }

    setSelecting(true);
    try {
      await api.post('/progress/select-domain', { domainId });
      await refreshUser();
      toast.success('Domain selected successfully!');
      navigate('/roadmap');
    } catch (err) {
      toast.error('Failed to select domain');
    } finally {
      setSelecting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-7xl mx-auto py-12 px-6 lg:px-8">
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#101828] tracking-tight mb-4">Choose your specialization</h1>
        <p className="text-lg text-[#667085] font-medium leading-relaxed">
          Select a career domain to start your journey. Each path is expert-curated with structured roadmaps, vetted resources, and validation milestones.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {domains.map((domain) => {
          const isSelected = user?.selectedDomain?._id === domain._id;
          
          return (
            <div 
              key={domain._id} 
              className={`card p-8 flex flex-col relative overflow-hidden transition-all duration-300 bg-white border-soft ${
                isSelected ? 'ring-2 ring-[#4361ee] shadow-xl shadow-indigo-100/50' : 'hover:border-indigo-200 hover:shadow-md'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-[#4361ee] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5">
                  <FiCheck className="text-sm" /> Active Path
                </div>
              )}
              
              <div className="flex items-start gap-5 mb-6">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-[#eaecf0]"
                  style={{ backgroundColor: `${domain.color}10`, color: domain.color }}
                >
                  {domain.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#101828] tracking-tight mb-2">{domain.name}</h3>
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
              
              <p className="text-[#667085] text-sm leading-relaxed mb-8 flex-1">
                {domain.shortDescription}
              </p>
              
              <div className="mt-auto pt-6 border-t border-[#f2f4f7]">
                <button 
                  onClick={() => handleSelectDomain(domain._id)}
                  disabled={selecting}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
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
    </div>
  );
};

export default Domains;
