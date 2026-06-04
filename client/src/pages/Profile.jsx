import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FiEdit2, FiMapPin, FiLink, FiGithub, FiTwitter, FiStar, FiAward, FiActivity, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // Reusing dashboard progress API as it contains user stats, activity log, and badges
      const res = await api.get('/progress/dashboard');
      setData(res.data.data);
      setEditForm({ 
        fullName: res.data.data.user.fullName || '', 
        phone: res.data.data.user.phone || '' 
      });
    } catch (err) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const res = await api.put('/auth/profile', editForm);
      setData(prev => ({
        ...prev,
        user: { ...prev.user, fullName: res.data.user.fullName, phone: res.data.user.phone }
      }));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
    </div>
  );

  if (!data || !data.user) return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <h2 className="text-2xl font-black text-[var(--text-main)] mb-2">Profile Not Found</h2>
    </div>
  );

  const { user, activityLog, testsPassed, totalBadges } = data;
  
  // Simulated difficulty breakdown for the ring chart based on total solved
  const totalSolved = user.dsaStats?.totalProblemsSolved || user.xp || 0;
  const easySolved = Math.floor(totalSolved * 0.5);
  const medSolved = Math.floor(totalSolved * 0.35);
  const hardSolved = totalSolved - easySolved - medSolved;

  const totalEasy = 200;
  const totalMed = 150;
  const totalHard = 100;

  // Generate heatmap grid (last 12 weeks roughly 84 days)
  const generateHeatmap = () => {
    const days = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const log = activityLog?.find(l => l.date === dateStr);
      days.push({ date: dateStr, intensity: log ? Math.min(log.minutes / 60, 1) : 0, minutes: log?.minutes || 0 });
    }
    return days;
  };

  const heatmapDays = generateHeatmap();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: User Card */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-3xl font-black shrink-0 border border-[var(--border)]">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2 mt-2">
                    <input 
                      type="text" 
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                      className="w-full bg-[var(--bg-sub)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary)]"
                      placeholder="Full Name"
                    />
                    <input 
                      type="tel" 
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full bg-[var(--bg-sub)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary)]"
                      placeholder="Phone Number"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl font-black text-[var(--text-main)]">{user.fullName}</h1>
                    <p className="text-sm text-[var(--text-muted)] font-semibold mb-2">@{user.fullName.split(' ')[0].toLowerCase()}</p>
                    {user.phone && <p className="text-xs text-[var(--text-muted)] font-semibold mb-2">📞 {user.phone}</p>}
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="flex gap-2 mb-6">
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 py-2 bg-[var(--brand-green)] hover:bg-green-600 text-white rounded-xl text-xs font-black transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ fullName: user.fullName, phone: user.phone || '' });
                  }}
                  className="px-4 py-2 bg-[var(--bg-sub)] hover:bg-[var(--border)] text-[var(--text-main)] rounded-xl text-xs font-black transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-center gap-2 py-2 bg-[var(--bg-sub)] hover:bg-[var(--border)] text-[var(--text-main)] rounded-xl text-xs font-black transition-colors mb-6 border border-[var(--border)]">
                <FiEdit2 size={12} /> Edit Profile
              </button>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] font-semibold">
                <FiMapPin className="text-[var(--text-light)]" /> Remote / Earth
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] font-semibold">
                <FiLink className="text-[var(--text-light)]" /> <a href="#" className="hover:text-[var(--primary)] hover:underline">portfolio.dev</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] font-semibold">
                <FiGithub className="text-[var(--text-light)]" /> <a href="#" className="hover:text-[var(--primary)] hover:underline">github</a>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-4">
              <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest mb-3">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-[var(--text-muted)] font-semibold"><FiEye /> Views</div>
                  <div className="font-black text-[var(--text-main)]">{user.xp ? Math.floor(user.xp * 1.5) : 0}</div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-[var(--text-muted)] font-semibold"><FiStar /> Reputation</div>
                  <div className="font-black text-[var(--text-main)]">{user.xp || 0}</div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-[var(--text-muted)] font-semibold"><FiActivity /> Streak</div>
                  <div className="font-black text-[var(--text-main)]">{user.dailyStreak || 0} Days</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Stats & Progress */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Domain Completion Ring */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-black text-[var(--text-main)] mb-6">Domain Completion</h2>
              <div className="flex items-center justify-between">
                
                {/* Progress Ring */}
                <div className="relative w-28 h-28 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" fill="none" stroke="var(--bg-sub)" strokeWidth="6" />
                    <circle cx="56" cy="56" r="48" fill="none" stroke="var(--primary)" strokeWidth="6" strokeDasharray="301.59" strokeDashoffset={301.59 - ((user.overallProgress || 0) / 100 * 301.59)} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-[var(--text-main)] leading-none">{user.overallProgress || 0}%</span>
                    <span className="text-[9px] text-[var(--text-light)] font-bold uppercase mt-1">Completed</span>
                  </div>
                </div>

                <div className="flex-1 ml-6 space-y-4">
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-bold text-[var(--primary)]">Learned</span>
                      <span className="text-xs font-black text-[var(--text-main)]">{user.overallProgress || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-sub)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--primary)]" style={{ width: `${user.overallProgress || 0}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-bold text-[var(--text-muted)]">Remaining</span>
                      <span className="text-xs font-black text-[var(--text-main)]">{100 - (user.overallProgress || 0)}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-sub)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--text-muted)] opacity-50" style={{ width: `${100 - (user.overallProgress || 0)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Box */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-black text-[var(--text-main)]">Badges</h2>
                <span className="text-xs font-bold text-[var(--text-light)]">{totalBadges}</span>
              </div>
              {totalBadges > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {user.earnedBadges?.slice(0, 3).map((b, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[var(--bg-sub)] border border-[var(--border)] flex items-center justify-center text-3xl shadow-sm mb-2 medal-badge relative z-10">
                        <span className="relative z-10">{b.badgeId?.icon || '🏅'}</span>
                      </div>
                      <span className="text-[9px] font-bold text-[var(--text-muted)] text-center w-16 truncate">{b.badgeId?.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[var(--text-light)] opacity-60 mt-4">
                  <div className="text-3xl mb-2 grayscale">🏆</div>
                  <span className="text-xs font-bold">No badges yet</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-black text-[var(--text-main)]">Learning Activity Heatmap</h2>
            </div>
            
            <div className="flex flex-col gap-2">
              {/* Responsive Grid container for the heatmap */}
              <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-2">
                {/* Group days into weeks (7 rows) */}
                {Array.from({ length: 12 }).map((_, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1 shrink-0">
                    {Array.from({ length: 7 }).map((_, dayIdx) => {
                      const day = heatmapDays[weekIdx * 7 + dayIdx];
                      if (!day) return <div key={dayIdx} className="w-3 h-3 md:w-4 md:h-4"></div>;
                      
                      let bgClass = "bg-[var(--bg-sub)]";
                      if (day.intensity > 0 && day.intensity <= 0.25) bgClass = "bg-green-200 dark:bg-green-900";
                      else if (day.intensity > 0.25 && day.intensity <= 0.5) bgClass = "bg-green-400 dark:bg-green-700";
                      else if (day.intensity > 0.5 && day.intensity <= 0.75) bgClass = "bg-green-500 dark:bg-green-600";
                      else if (day.intensity > 0.75) bgClass = "bg-green-600 dark:bg-green-500";

                      return (
                        <div 
                          key={day.date} 
                          className={`w-3 h-3 md:w-4 md:h-4 rounded-[2px] md:rounded-sm ${bgClass} transition-colors hover:ring-2 hover:ring-[var(--border)]`}
                          title={`${day.date}: ${day.minutes} active minutes`}
                        ></div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center gap-2 text-[10px] text-[var(--text-light)] font-bold mt-2">
                Less
                <div className="w-3 h-3 rounded-[2px] bg-[var(--bg-sub)]"></div>
                <div className="w-3 h-3 rounded-[2px] bg-green-200 dark:bg-green-900"></div>
                <div className="w-3 h-3 rounded-[2px] bg-green-400 dark:bg-green-700"></div>
                <div className="w-3 h-3 rounded-[2px] bg-green-500 dark:bg-green-600"></div>
                <div className="w-3 h-3 rounded-[2px] bg-green-600 dark:bg-green-500"></div>
                More
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
