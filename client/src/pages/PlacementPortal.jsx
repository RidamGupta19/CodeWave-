import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiBriefcase, FiUsers, FiTrendingUp, FiExternalLink, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function PlacementPortal() {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Derive total XP dynamically
  const totalXP = user?.totalXP || 0;

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/placement/drives');
      setDrives(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load placement drives.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (company, eligibilityXP) => {
    if (totalXP < eligibilityXP) {
      return toast.error(`Ineligible! You need at least ${eligibilityXP} XP. Currently you have ${totalXP} XP.`);
    }
    toast.success(`Application sent successfully to ${company}!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-850 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center text-9xl pointer-events-none pr-8">
          💼
        </div>
        <div className="relative z-10 space-y-4 max-w-xl text-left">
          <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-3.5 py-1.5 rounded-full border border-white/10">Placement Hub</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1">Placement Portal</h1>
          <p className="text-sm text-blue-150 font-semibold leading-relaxed">
            Submit applications to top product companies directly. Elevate your portfolio, pass technical drills, and unlock placement pipelines based on your XP stats.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Placement Registry</span>
          <div className="text-xl font-black text-emerald-650 dark:text-emerald-450 mt-1">Registered & Active</div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">My Total XP</span>
          <div className="text-xl font-black text-[var(--primary)] mt-1">{totalXP} XP</div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Drives Available</span>
          <div className="text-xl font-black text-[var(--text-main)] mt-1">{drives.length} active</div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Mock Drills Passed</span>
          <div className="text-xl font-black text-[var(--text-main)] mt-1">4 of 5</div>
        </div>
      </div>

      {/* Drives list */}
      <div className="space-y-4 text-left">
        <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider">Active Campus Hiring Drives</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drives.map((d) => {
            const isEligible = totalXP >= d.eligibilityXP;
            return (
              <div 
                key={d.id} 
                className={`card p-6 bg-[var(--bg-card)] border-2 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  isEligible ? 'border-[var(--border-light)] hover:border-[var(--primary)]' : 'border-rose-100 dark:border-rose-950/20 bg-rose-50/10 dark:bg-rose-950/5'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-extrabold text-[var(--text-main)] text-sm">{d.company}</h4>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mt-0.5">{d.role}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                      isEligible 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-100 dark:border-emerald-900/10' 
                        : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border-rose-100 dark:border-rose-900/10'
                    }`}>
                      {isEligible ? 'Eligible' : 'Locked'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs font-bold text-[var(--text-muted)] pb-4 border-b border-[var(--border-light)] mb-4">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-light)]">Requires:</span>
                      <span className="text-[var(--text-main)]">{d.eligibilityXP} XP</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-rose-500 font-extrabold">
                      <span>Deadline:</span>
                      <span className="flex items-center gap-1"><FiClock /> {new Date(d.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleApply(d.company, d.eligibilityXP)}
                  className={`w-full py-2.5 rounded-xl text-xs font-black uppercase transition-all tracking-wider ${
                    isEligible 
                      ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 shadow-md shadow-[var(--primary)]/10 cursor-pointer' 
                      : 'bg-[var(--bg-sub)] text-[var(--text-light)] border border-[var(--border)] cursor-not-allowed'
                  }`}
                >
                  {isEligible ? 'Submit Application' : 'Earn More XP to Unlock'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
