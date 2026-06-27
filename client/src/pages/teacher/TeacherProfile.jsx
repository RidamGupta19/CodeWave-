import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUser, FiPhone, FiMail, FiAward, FiShield, 
  FiBriefcase, FiUploadCloud, FiClock, FiCheck, FiSave, FiLock 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function TeacherProfile() {
  const { refreshUser } = useAuth();
  
  // Tab control state
  const [activeTab, setActiveTab] = useState('personal');

  // Loaded profiles
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form States
  const [personalForm, setPersonalForm] = useState({
    fullName: '',
    phone: '',
    avatar: ''
  });

  const [professionalForm, setProfessionalForm] = useState({
    subject: '',
    qualification: '',
    experience: ''
  });

  const [securityForm, setSecurityForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingProfessional, setSavingProfessional] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/teacher-profile');
      setProfileData(res.data.data);
      
      const { user, teacher } = res.data.data;
      setPersonalForm({
        fullName: user.fullName || '',
        phone: teacher.phone || '',
        avatar: user.avatar || ''
      });

      setProfessionalForm({
        subject: teacher.subject || '',
        qualification: teacher.qualification || '',
        experience: teacher.experience || ''
      });
    } catch (err) {
      console.error('Error loading teacher profile:', err);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  // Canvas-based image compressor and uploader
  const compressAndUploadImage = async (file) => {
    // 1. Validate size and type
    const validExtensions = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validExtensions.includes(file.type)) {
      toast.error('Invalid format. Allowed formats: JPG, JPEG, PNG, WEBP');
      return null;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image size must be less than 3 MB');
      return null;
    }

    // 2. Compress image using Canvas
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_size = 800; // max width or height
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to WebP with 0.85 quality
          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                toast.error('Image compression failed');
                resolve(null);
                return;
              }

              // Create FormData and upload
              const formData = new FormData();
              formData.append('avatar', blob, 'avatar.webp');

              const loadingToast = toast.loading('Uploading avatar...');
              try {
                const uploadRes = await api.post('/auth/upload-avatar', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Avatar uploaded successfully!', { id: loadingToast });
                resolve(uploadRes.data.avatarUrl);
              } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to upload avatar', { id: loadingToast });
                resolve(null);
              }
            },
            'image/webp',
            0.85
          );
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadedUrl = await compressAndUploadImage(file);
    if (uploadedUrl) {
      setPersonalForm(prev => ({ ...prev, avatar: uploadedUrl }));
      await refreshUser();
    }
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingPersonal(true);
      const res = await api.put('/auth/teacher-profile', {
        ...personalForm,
        ...professionalForm
      });
      setProfileData(prev => ({
        ...prev,
        user: res.data.data.user,
        teacher: res.data.data.teacher
      }));
      await refreshUser();
      toast.success('Personal details saved successfully');
    } catch (err) {
      console.error('Failed saving personal details:', err);
      toast.error(err.response?.data?.message || 'Failed to update personal details');
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleProfessionalSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfessional(true);
      const res = await api.put('/auth/teacher-profile', {
        ...personalForm,
        ...professionalForm
      });
      setProfileData(prev => ({
        ...prev,
        user: res.data.data.user,
        teacher: res.data.data.teacher
      }));
      toast.success('Professional details updated successfully');
    } catch (err) {
      console.error('Failed saving professional details:', err);
      toast.error(err.response?.data?.message || 'Failed to update professional details');
    } finally {
      setSavingProfessional(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (securityForm.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters long');
    }

    try {
      setSavingSecurity(true);
      await api.put('/auth/change-password', {
        oldPassword: securityForm.oldPassword,
        newPassword: securityForm.newPassword
      });
      toast.success('Password changed successfully!');
      setSecurityForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Failed to change password:', err);
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingSecurity(false);
    }
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '';
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://') || avatarPath.startsWith('data:')) {
      return avatarPath;
    }
    const serverUrl = api.defaults.baseURL.replace('/api', '');
    return `${serverUrl}${avatarPath}`;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg mb-6" />
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="h-64 bg-[var(--bg-sub)]/30 rounded-2xl lg:col-span-1" />
          <div className="h-96 bg-[var(--bg-sub)]/30 rounded-2xl lg:col-span-3" />
        </div>
      </div>
    );
  }

  const { user, teacher } = profileData || {};
  const tabs = [
    { id: 'personal', name: 'Personal Details', icon: <FiUser /> },
    { id: 'professional', name: 'Professional Details', icon: <FiBriefcase /> },
    { id: 'security', name: 'Security & Password', icon: <FiShield /> }
  ];

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Title */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Teacher Profile Center</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Configure contact profiles, subject expertise, security credentials, and view joining details</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Left Side: Tabs Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm flex flex-row lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/10'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-sub)]/50 hover:text-[var(--text-main)]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Quick Profile Summary Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm text-center space-y-4">
            <div className="relative w-24 h-24 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--border)] flex items-center justify-center text-4xl font-black overflow-hidden mx-auto">
              {personalForm.avatar ? (
                <img src={getAvatarUrl(personalForm.avatar)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.fullName?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-sm font-black text-[var(--text-main)]">{user.fullName}</h3>
              <p className="text-[10px] text-[var(--text-light)] uppercase font-bold tracking-wider mt-1">{teacher.subject} Teacher</p>
            </div>
            <div className="pt-4 border-t border-[var(--border-light)] text-left space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)] font-bold">Experience:</span>
                <span className="text-[var(--text-main)] font-semibold">{teacher.experience || 'Not Specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)] font-bold">Joining Date:</span>
                <span className="text-[var(--text-main)] font-semibold">
                  {teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Contents Panel */}
        <div className="lg:col-span-3">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-sm">
            
            {/* 1. PERSONAL DETAILS TAB */}
            {activeTab === 'personal' && (
              <form onSubmit={handlePersonalSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[var(--border-light)]">
                  <div className="relative w-20 h-20 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--border)] flex items-center justify-center text-3xl font-black overflow-hidden shrink-0">
                    {personalForm.avatar ? (
                      <img src={getAvatarUrl(personalForm.avatar)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user.fullName?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="btn-secondary py-2 px-4 text-xs font-black uppercase cursor-pointer flex items-center gap-2">
                      <FiUploadCloud /> Upload Avatar
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <p className="text-[10px] text-[var(--text-light)] font-bold">Supported formats: JPG, JPEG, PNG, WEBP. Max file size: 3MB.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      value={personalForm.fullName}
                      onChange={(e) => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Email Address (Read-only)</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-muted)] font-semibold cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Phone Number</label>
                    <input
                      type="text"
                      value={personalForm.phone}
                      onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--border-light)]">
                  <button
                    type="submit"
                    disabled={savingPersonal}
                    className="btn-primary py-2.5 px-6 rounded-xl text-xs font-black uppercase flex items-center gap-2 shadow-lg shadow-[var(--primary)]/20"
                  >
                    {savingPersonal ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <FiSave /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* 2. PROFESSIONAL DETAILS TAB */}
            {activeTab === 'professional' && (
              <form onSubmit={handleProfessionalSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Subject Expertise</label>
                    <input
                      type="text"
                      value={professionalForm.subject}
                      onChange={(e) => setProfessionalForm({ ...professionalForm, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Highest Qualification</label>
                    <input
                      type="text"
                      value={professionalForm.qualification}
                      onChange={(e) => setProfessionalForm({ ...professionalForm, qualification: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                      placeholder="e.g. M.Tech in Computer Science"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Teaching Experience</label>
                    <input
                      type="text"
                      value={professionalForm.experience}
                      onChange={(e) => setProfessionalForm({ ...professionalForm, experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                      placeholder="e.g. 5+ Years"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Monthly Salary (Read-only)</label>
                    <input
                      type="text"
                      value={teacher.salary ? `₹${teacher.salary.toLocaleString()}` : '₹0'}
                      disabled
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-muted)] font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--border-light)]">
                  <button
                    type="submit"
                    disabled={savingProfessional}
                    className="btn-primary py-2.5 px-6 rounded-xl text-xs font-black uppercase flex items-center gap-2 shadow-lg shadow-[var(--primary)]/20"
                  >
                    {savingProfessional ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <FiSave /> Save Details
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* 3. SECURITY TAB */}
            {activeTab === 'security' && (
              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Current Password</label>
                    <input
                      type="password"
                      value={securityForm.oldPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, oldPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">New Password</label>
                    <input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Confirm New Password</label>
                    <input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--border-light)]">
                  <button
                    type="submit"
                    disabled={savingSecurity}
                    className="btn-primary py-2.5 px-6 rounded-xl text-xs font-black uppercase flex items-center gap-2 shadow-lg shadow-[var(--primary)]/20"
                  >
                    {savingSecurity ? (
                      <>Updating...</>
                    ) : (
                      <>
                        <FiLock /> Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
