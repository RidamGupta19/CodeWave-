import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FiEdit2, FiMapPin, FiAward, FiActivity, FiUser, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const { refreshUser } = useAuth();
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
      setLoading(true);
      const res = await api.get('/progress/dashboard');
      setData(res.data.data);
      setEditForm({ 
        fullName: res.data.data.user.fullName || '', 
        phone: res.data.data.user.phone || '' 
      });
    } catch (err) {
      console.error('Failed to load profile details:', err);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editForm.fullName.trim()) return toast.error('Full Name is required');
    try {
      setIsSaving(true);
      const res = await api.put('/auth/profile', editForm);
      setData(prev => ({
        ...prev,
        user: { ...prev.user, fullName: res.data.user.fullName, phone: res.data.user.phone }
      }));
      await refreshUser(); // Sync Global Context
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-40 bg-[var(--bg-sub)]/30 rounded-2xl" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-64 bg-[var(--bg-sub)]/30 rounded-2xl md:col-span-1" />
          <div className="h-64 bg-[var(--bg-sub)]/30 rounded-2xl md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <h2 className="text-2xl font-black text-[var(--text-main)] mb-2">Profile Not Found</h2>
      </div>
    );
  }

  const { user, activityLog = [], totalBadges = 0 } = data;

  // Generate heatmap grid for the last 12 weeks (84 days)
  const generateHeatmap = () => {
    const days = [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const log = activityLog.find(l => l.date === dateStr);
      days.push({ 
        date: dateStr, 
        intensity: log ? Math.min(log.minutes / 60, 1) : 0, 
        minutes: log?.minutes || 0 
      });
    }
    return days;
  };

  const heatmapDays = generateHeatmap();

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="card p-6 md:p-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-3xl font-black shrink-0 border border-[var(--border)]">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            {isEditing ? (
              <div className="space-y-2 max-w-xs">
                <input 
                  type="text" 
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-main)] font-semibold outline-none focus:border-[var(--primary)]"
                  placeholder="Full Name"
                />
                <input 
                  type="tel" 
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs text-[var(--text-main)] font-semibold outline-none focus:border-[var(--primary)]"
                  placeholder="Phone Number"
                />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-black text-[var(--text-main)] leading-snug">{user.fullName}</h1>
                <p className="text-xs text-[var(--text-muted)] font-bold">@{user.fullName.split(' ')[0].toLowerCase()}</p>
                {user.phone && <p className="text-[10px] text-[var(--text-light)] font-bold mt-1">📞 {user.phone}</p>}
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex-1 md:flex-initial btn-primary py-2.5 px-5 text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-sm"
            >
              <FiSave /> Save Changes
            </button>
            <button 
              onClick={() => {
                setIsEditing(false);
                setEditForm({ fullName: user.fullName, phone: user.phone || '' });
              }}
              className="px-4 py-2.5 bg-[var(--bg-sub)] hover:bg-[var(--border)] text-[var(--text-main)] rounded-xl text-xs font-black transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)} 
            className="w-full md:w-auto btn-secondary py-2.5 px-5 text-xs font-black uppercase flex items-center justify-center gap-1.5"
          >
            <FiEdit2 /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Academic summary details */}
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-5">
          <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2 pb-3 border-b border-[var(--border-light)]">
            <FiUser /> Academic & Placement profile
          </h3>
          <div className="space-y-3.5 text-xs text-[var(--text-muted)] font-bold">
            <div className="flex justify-between"><span className="text-[var(--text-light)]">Institute College:</span> <span className="text-[var(--text-main)] text-right">{user.profile?.collegeName || 'Not Set'}</span></div>
            <div className="flex justify-between"><span className="text(--text-light)">Academic Branch:</span> <span className="text-[var(--text-main)] text-right">{user.profile?.branch || 'Not Set'}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-light)]">Syllabus Term:</span> <span className="text-[var(--text-main)]">Year {user.profile?.year || 'N/A'}, Sem {user.profile?.semester || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-light)]">Roadmap Pace:</span> <span className="text-[var(--text-main)]">{user.profile?.roadmapType || 'Default Pace'}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-light)]">Target Completion:</span> <span className="text-[var(--text-main)]">{user.profile?.estimatedTimeline || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-light)]">Goal:</span> <span className="text-[var(--primary)] uppercase font-black">{user.profile?.goal || 'General Learn'}</span></div>
          </div>
        </div>

        {/* Right Column: Heatmap and Badges */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Heatmap Widget */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
              <FiActivity /> 12-Week Study Contribution logs
            </h3>
            <div className="flex flex-wrap gap-1 items-center py-2">
              {heatmapDays.map((d, index) => (
                <div
                  key={index}
                  className="w-3.5 h-3.5 rounded-sm transition-all hover:scale-110"
                  style={{
                    backgroundColor: d.intensity === 0 
                      ? 'var(--bg-sub)' 
                      : `rgba(48, 141, 70, ${0.15 + d.intensity * 0.85})`
                  }}
                  title={`${d.date}: ${d.minutes} study minutes logged`}
                />
              ))}
            </div>
            <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] font-bold">
              <span>Less</span>
              <div className="flex gap-1 items-center">
                <div className="w-2.5 h-2.5 rounded-sm bg-[var(--bg-sub)]" />
                <div className="w-2.5 h-2.5 rounded-sm bg-[var(--primary)] opacity-40" />
                <div className="w-2.5 h-2.5 rounded-sm bg-[var(--primary)]" />
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2 pb-3 border-b border-[var(--border-light)]">
              <FiAward /> Achievement Badges Unlocked ({totalBadges})
            </h3>
            {user.earnedBadges && user.earnedBadges.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {user.earnedBadges.map((badge, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center p-2 border border-[var(--border-light)] hover:border-[var(--primary)] rounded-xl transition-all">
                    <span className="text-3xl mb-1">🏅</span>
                    <span className="text-[9px] font-black text-[var(--text-main)] line-clamp-1">{badge.badgeId?.name || 'Milestone'}</span>
                    <span className="text-[7px] text-[var(--text-light)] font-bold">{new Date(badge.earnedAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)] font-semibold py-4 text-center">
                Complete career domain checkpoints and pass tests to unlock achievement badges!
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
