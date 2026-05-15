import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfileSetup = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    collegeName: user?.profile?.collegeName || '',
    branch: user?.profile?.branch || '',
    year: user?.profile?.year || 1,
    currentSkillLevel: user?.profile?.currentSkillLevel || 'beginner',
    goal: user?.profile?.goal || 'job',
    dailyStudyTime: user?.profile?.dailyStudyTime || 60
  });

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', { profile });
      await refreshUser();
      toast.success('Profile saved successfully!');
      navigate('/domains');
    } catch (err) {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
        <p className="text-slate-400">Help us personalize your learning roadmap</p>
      </div>

      <div className="glass p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">College/University Name</label>
              <input type="text" name="collegeName" required className="input-field" value={profile.collegeName} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Branch/Major</label>
              <input type="text" name="branch" required className="input-field" placeholder="e.g. Computer Science" value={profile.branch} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Current Year</label>
              <select name="year" required className="input-field" value={profile.year} onChange={handleChange}>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">Graduated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Current Skill Level</label>
              <select name="currentSkillLevel" required className="input-field" value={profile.currentSkillLevel} onChange={handleChange}>
                <option value="beginner">Beginner (Just starting out)</option>
                <option value="intermediate">Intermediate (Know basics, need practice)</option>
                <option value="advanced">Advanced (Looking for mastery)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Primary Goal</label>
              <select name="goal" required className="input-field" value={profile.goal} onChange={handleChange}>
                <option value="job">Full-time Job</option>
                <option value="internship">Internship</option>
                <option value="freelancing">Freelancing</option>
                <option value="startup">Startup/Founding</option>
                <option value="higher-studies">Higher Studies</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Daily Study Time (minutes)</label>
              <input type="number" name="dailyStudyTime" min="15" required className="input-field" value={profile.dailyStudyTime} onChange={handleChange} />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading} className="btn-primary px-8">
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
