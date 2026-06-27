import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiExternalLink, FiGift, FiAward, FiInfo, FiSearch, FiFilter, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [stats, setStats] = useState({ totalCredits: 0, approvedCount: 0, pendingCount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [claimingId, setClaimingId] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const [res, claimsRes] = await Promise.all([
        api.get('/cloud-credits'),
        api.get('/cloud-credits/my-claims')
      ]);
      setResources(res.data.data);
      setMyClaims(claimsRes.data.data);
      setStats(claimsRes.data.stats);
    } catch (err) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (resourceId) => {
    setClaimingId(resourceId);
    try {
      const res = await api.post(`/cloud-credits/claim/${resourceId}`);
      toast.success('Benefit claimed successfully!');
      
      // Refetch claims to update status
      const claimsRes = await api.get('/cloud-credits/my-claims');
      setMyClaims(claimsRes.data.data);
      setStats(claimsRes.data.stats);
      
      const newClaim = claimsRes.data.data.find(c => c.cloudCredit?._id === resourceId || c.cloudCredit === resourceId);
      if (newClaim && newClaim.status === 'approved') {
        setSelectedClaim(newClaim);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to claim benefit');
    } finally {
      setClaimingId(null);
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         res.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || res.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['all', 'cloud', 'education', 'hosting', 'database'];

  if (loading) return <div className="flex justify-center py-24"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-7xl mx-auto py-10 px-6 lg:px-8 select-text">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="badge badge-blue mb-4 py-1.5 px-4 font-bold">Student Benefits</div>
          <h1 className="text-4xl font-extrabold text-[#101828] tracking-tight mb-4 flex items-center gap-4">
            Free Perks & Tools
          </h1>
          <p className="text-[#667085] text-lg font-medium max-w-2xl">
            Exclusive credits, premium software, and developer tools curated for the CodeWave Solution engineering community.
          </p>
        </div>
        
        {/* Credits stats */}
        <div className="flex gap-4 p-4 rounded-3xl bg-indigo-50/50 border border-indigo-100/40 shadow-sm shrink-0">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Balance</div>
            <div className="text-2xl font-black text-indigo-600">${stats.totalCredits || 0}</div>
          </div>
          <div className="w-px bg-indigo-200/50"></div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Claimed Perks</div>
            <div className="text-2xl font-black text-[#101828]">{stats.approvedCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3] group-focus-within:text-[#4361ee] transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, platform or tool..." 
            className="input-field pl-12 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all border whitespace-nowrap ${filter === cat ? 'bg-[#4361ee] text-white border-[#4361ee] shadow-lg shadow-indigo-100' : 'bg-white text-[#667085] border-[#eaecf0] hover:border-indigo-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredResources.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((res) => (
            <div key={res._id} className="card p-7 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 flex flex-col group bg-white border-soft">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#fcfcfd] border border-[#eaecf0] flex items-center justify-center text-3xl shadow-sm group-hover:bg-indigo-50 group-hover:text-[#4361ee] transition-colors">
                  {res.icon || '🎁'}
                </div>
                <div className="badge badge-gray bg-[#f9fafb] text-[#344054] font-bold py-1 px-3 text-[10px] uppercase tracking-widest border border-[#eaecf0]">
                  {res.category}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-[#101828] mb-3 group-hover:text-[#4361ee] transition-colors tracking-tight">{res.title}</h3>
              <p className="text-[#667085] text-sm mb-8 flex-1 leading-relaxed">{res.description}</p>
              
              {res.eligibility && (
                <div className="mb-8 p-4 rounded-xl bg-[#fcfcfd] border border-[#eaecf0] flex items-start gap-3">
                  <FiInfo className="text-[#4361ee] shrink-0 mt-0.5" />
                  <span className="text-[11px] font-bold text-[#475467] leading-relaxed uppercase tracking-wide">Eligible for {res.eligibility}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-[#f2f4f7]">
                <div className="text-[10px] font-black text-[#98a2b3] uppercase tracking-[0.15em]">{res.platform}</div>
                {/* Claim status check */}
                {(() => {
                  const claim = myClaims.find(c => (c.cloudCredit?._id === res._id || c.cloudCredit === res._id));
                  if (claim) {
                    if (claim.status === 'approved') {
                      return (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedClaim(claim)}
                            className="text-xs font-extrabold text-indigo-600 hover:underline"
                          >
                            View Code 🔑
                          </button>
                          <span className="text-emerald-500 font-extrabold text-xs flex items-center gap-1">
                            <FiCheckCircle /> Claimed
                          </span>
                        </div>
                      );
                    }
                    if (claim.status === 'rejected') {
                      return <span className="text-rose-500 font-extrabold text-xs">Rejected</span>;
                    }
                    return <span className="text-amber-500 font-extrabold text-xs">Pending Approval ⏳</span>;
                  }
                  return (
                    <button 
                      onClick={() => handleClaim(res._id)} 
                      disabled={claimingId === res._id}
                      className="flex items-center gap-1.5 text-[#4361ee] hover:text-[#3730a3] font-extrabold text-sm transition-colors disabled:opacity-50"
                    >
                      {claimingId === res._id ? 'Claiming...' : 'Claim Perk 🎁'}
                    </button>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 card bg-white border-soft">
          <div className="text-6xl mb-6 opacity-20">🔍</div>
          <h3 className="text-2xl font-bold text-[#101828] mb-2 tracking-tight">No resources found</h3>
          <p className="text-[#667085] font-medium text-lg">Try adjusting your filters or search keywords.</p>
        </div>
      )}

      {/* Voucher Code Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="card p-8 bg-white max-w-md w-full text-center space-y-6 border border-[#eaecf0] shadow-2xl relative rounded-3xl">
            <button 
              onClick={() => setSelectedClaim(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-extrabold"
            >
              ✕
            </button>
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-3xl">
              🎉
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#101828]">Perk Unlocked!</h3>
              <p className="text-xs text-[#667085]">
                Here is your student voucher code for <strong>{selectedClaim.cloudCredit?.title || 'this perk'}</strong>:
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-[#d0d5dd] font-mono text-lg font-black text-indigo-600 tracking-wider flex justify-between items-center">
              <span>{selectedClaim.voucherCode}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(selectedClaim.voucherCode);
                  toast.success('Voucher code copied to clipboard!');
                }}
                className="text-xs font-bold text-indigo-500 hover:text-indigo-700 bg-white border border-[#d0d5dd] py-1 px-3.5 rounded-xl transition-all"
              >
                Copy
              </button>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Copy this code and apply it during checkout or portal signup. Ensure you use your student credentials.
            </p>
            <button 
              onClick={() => setSelectedClaim(null)} 
              className="w-full py-3 bg-[#4361ee] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Advisory Note */}
      <div className="mt-16 card p-8 bg-[#101828] border-none flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4361ee]/10 rounded-full blur-[100px]"></div>
        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 border border-white/10">💡</div>
        <div>
          <h4 className="text-xl font-bold text-white mb-2 tracking-tight">Strategic Tip for Engineers</h4>
          <p className="text-indigo-100/70 leading-relaxed font-medium">
            Use these cloud credits to build and host your portfolio projects. Having a live, accessible project is 10x more valuable than a local one during interviews. 
            <span className="text-white font-bold ml-1">Remember to use your student email for maximum eligibility.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resources;
