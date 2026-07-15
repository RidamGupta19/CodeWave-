import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  FiUser, FiPhone, FiMail, FiMapPin, FiAward, FiShield, 
  FiBriefcase, FiUploadCloud, FiBookOpen, FiClock, FiCheck, FiSave 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentProfile() {
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
    address: '',
    avatar: ''
  });

  const [parentForm, setParentForm] = useState({
    parentName: '',
    parentPhone: '',
    parentEmail: ''
  });

  const [securityForm, setSecurityForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingParent, setSavingParent] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  const [allocatedCourse, setAllocatedCourse] = useState(null);
  const [allocatedBatch, setAllocatedBatch] = useState(null);
  const [allocatedSchedule, setAllocatedSchedule] = useState(null);
  const [loadingAllocation, setLoadingAllocation] = useState(false);

  // Attendance tab states
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchProfileAttendance = async (dateObj) => {
    try {
      setLoadingAttendance(true);
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      const res = await api.get(`/institute/attendance/report?month=${month}&year=${year}`);
      setAttendanceReport(res.data.data);
    } catch (err) {
      console.error('Failed to load profile attendance', err);
      toast.error('Failed to load attendance report');
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchProfileAttendance(currentDate);
    }
  }, [activeTab, currentDate]);

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchAllocations = async () => {
    try {
      setLoadingAllocation(true);
      const [courseRes, batchRes, scheduleRes] = await Promise.allSettled([
        api.get('/profile/course'),
        api.get('/profile/batch'),
        api.get('/profile/schedule')
      ]);

      if (courseRes.status === 'fulfilled') setAllocatedCourse(courseRes.value.data.data);
      if (batchRes.status === 'fulfilled') setAllocatedBatch(batchRes.value.data.data);
      if (scheduleRes.status === 'fulfilled') setAllocatedSchedule(scheduleRes.value.data.data);
    } catch (err) {
      console.error('Error loading allocations:', err);
    } finally {
      setLoadingAllocation(false);
    }
  };

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/student-profile');
      setProfileData(res.data.data);
      
      const { user, student } = res.data.data;
      setPersonalForm({
        fullName: user.fullName || '',
        phone: student.phone || '',
        address: student.address || '',
        avatar: user.avatar || ''
      });

      setParentForm({
        parentName: student.parentName || '',
        parentPhone: student.parentPhone || '',
        parentEmail: student.parentEmail || ''
      });

      // Load course & batch allocation details
      await fetchAllocations();
    } catch (err) {
      console.error('Error loading student profile:', err);
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
      const res = await api.put('/auth/student-profile', personalForm);
      setProfileData(prev => ({
        ...prev,
        user: res.data.data.user,
        student: res.data.data.student
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

  const handleParentSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingParent(true);
      const res = await api.put('/auth/student-profile', {
        ...personalForm,
        ...parentForm
      });
      setProfileData(prev => ({
        ...prev,
        user: res.data.data.user,
        student: res.data.data.student
      }));
      toast.success('Parent details updated successfully');
    } catch (err) {
      console.error('Failed saving parent details:', err);
      toast.error(err.response?.data?.message || 'Failed to update parent details');
    } finally {
      setSavingParent(false);
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

  const { user, student } = profileData || {};
  const tabs = [
    { id: 'personal', name: 'Personal Details', icon: <FiUser /> },
    { id: 'parent', name: 'Parent Details', icon: <FiUser /> },
    { id: 'academic', name: 'Batch & Course', icon: <FiBriefcase /> },
    { id: 'attendance', name: 'Attendance Summary', icon: <FiClock /> },
    { id: 'security', name: 'Security & Password', icon: <FiShield /> }
  ];

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Title */}
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Student Profile Center</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Configure contact profiles, parent details, security logs, and review batch classes</p>
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
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/60 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-light)] font-semibold cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Phone Number</label>
                    <input
                      type="tel"
                      value={personalForm.phone}
                      onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Residential Address</label>
                    <input
                      type="text"
                      value={personalForm.address}
                      onChange={(e) => setPersonalForm({ ...personalForm, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingPersonal}
                    className="btn-primary py-3 px-6 text-xs font-black uppercase flex items-center gap-1.5 shadow-md"
                  >
                    <FiSave /> {savingPersonal ? 'Saving changes...' : 'Save details'}
                  </button>
                </div>
              </form>
            )}

            {/* 2. PARENT INFORMATION TAB */}
            {activeTab === 'parent' && (
              <form onSubmit={handleParentSubmit} className="space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider mb-2">Emergency Contact details</h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-bold">Please update your guardian or parent details for academic correspondence logs.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Parent / Guardian Name</label>
                    <input
                      type="text"
                      value={parentForm.parentName}
                      onChange={(e) => setParentForm({ ...parentForm, parentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Parent Phone Number</label>
                    <input
                      type="tel"
                      value={parentForm.parentPhone}
                      onChange={(e) => setParentForm({ ...parentForm, parentPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                    />
                  </div>
                  <div className="space-y-1 col-span-full">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider block">Parent Email Address</label>
                    <input
                      type="email"
                      value={parentForm.parentEmail}
                      onChange={(e) => setParentForm({ ...parentForm, parentEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingParent}
                    className="btn-primary py-3 px-6 text-xs font-black uppercase flex items-center gap-1.5 shadow-md"
                  >
                    <FiSave /> {savingParent ? 'Saving guardian details...' : 'Save parent profile'}
                  </button>
                </div>
              </form>
            )}

             {/* 3. BATCH & COURSE TAB */}
            {activeTab === 'academic' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider mb-1">My Course & Batch Information</h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-bold">Review your allocated syllabus track, mentor assignments, timings, and class schedule pipelines.</p>
                </div>

                {loadingAllocation ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-20 bg-[var(--bg-sub)]/35 rounded-xl" />
                    <div className="h-20 bg-[var(--bg-sub)]/35 rounded-xl" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Course Information Card */}
                    <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl space-y-4">
                      <h4 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-1.5 pb-2 border-b border-[var(--border-light)]">
                        <FiBookOpen className="text-[var(--primary)]" /> Course Details
                      </h4>
                      {allocatedCourse ? (
                        <div className="space-y-3 text-left">
                          <div>
                            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Course Name</span>
                            <p className="text-xs font-extrabold text-[var(--text-main)] mt-0.5">{allocatedCourse.courseName}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Description</span>
                            <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-relaxed font-semibold">{allocatedCourse.description || 'Course outline details'}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-light)]">
                            <div>
                              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">Duration</span>
                              <p className="text-[10px] font-extrabold text-[var(--text-main)] mt-0.5">{allocatedCourse.duration}</p>
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">Status</span>
                              <span className="inline-block mt-0.5 px-2 py-0.5 text-[8px] font-black uppercase rounded bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                                {allocatedCourse.courseStatus}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">Start Date</span>
                              <p className="text-[10px] font-extrabold text-[var(--text-main)] mt-0.5">{new Date(allocatedCourse.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">End Date</span>
                              <p className="text-[10px] font-extrabold text-[var(--text-main)] mt-0.5">{new Date(allocatedCourse.endDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--text-muted)] font-semibold">No course allocated yet.</p>
                      )}
                    </div>

                    {/* Batch Information Card */}
                    <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl space-y-4">
                      <h4 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-1.5 pb-2 border-b border-[var(--border-light)]">
                        <FiClock className="text-[var(--primary)]" /> Batch & Mentor
                      </h4>
                      {allocatedBatch ? (
                        <div className="space-y-3 text-left">
                          <div>
                            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Batch Name</span>
                            <p className="text-xs font-extrabold text-[var(--text-main)] mt-0.5">{allocatedBatch.batchName}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Assigned Mentor/Teacher</span>
                            <p className="text-xs font-extrabold text-[var(--primary)] mt-0.5">{allocatedBatch.assignedTeacher}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-light)]">
                            <div>
                              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">Batch Strength</span>
                              <p className="text-[10px] font-extrabold text-[var(--text-main)] mt-0.5">{allocatedBatch.studentsCount} students</p>
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">Timings</span>
                              <p className="text-[10px] font-extrabold text-[var(--text-main)] mt-0.5">{allocatedBatch.timing}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--text-muted)] font-semibold">No batch allocated yet.</p>
                      )}
                    </div>

                    {/* Schedule Information Card */}
                    <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl space-y-4 md:col-span-2">
                      <h4 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-1.5 pb-2 border-b border-[var(--border-light)]">
                        <FiClock className="text-[var(--primary)]" /> Class Day Schedules & Timetable
                      </h4>
                      {allocatedSchedule ? (
                        <div className="grid md:grid-cols-2 gap-6 text-left">
                          <div className="space-y-3">
                            <span className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-widest">Weekly Class Days</span>
                            <div className="space-y-1.5">
                              {allocatedSchedule.classDays && allocatedSchedule.classDays.length > 0 ? (
                                allocatedSchedule.classDays.map(day => (
                                  <div key={day} className="flex justify-between items-center text-xs font-extrabold text-[var(--text-main)] bg-[var(--bg-sub)]/35 p-2.5 rounded-xl border border-[var(--border-light)]">
                                    <span>{day}</span>
                                    <span className="text-[var(--text-muted)] font-bold">{allocatedSchedule.startTime} - {allocatedSchedule.endTime} ({allocatedSchedule.timezone})</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-[var(--text-muted)] font-bold">No standard schedule found.</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* Upcoming Class */}
                            <div className="p-4 bg-[var(--primary-light)]/30 border border-[var(--primary)]/20 rounded-2xl space-y-1.5">
                              <span className="text-[9px] font-black uppercase text-[var(--primary)] tracking-widest">Next Upcoming Class</span>
                              {allocatedSchedule.upcomingClass ? (
                                <div>
                                  <p className="text-xs font-extrabold text-[var(--text-main)]">
                                    Date: {new Date(allocatedSchedule.upcomingClass.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                  </p>
                                  <p className="text-xs font-black text-[var(--primary)] mt-0.5">
                                    Time: {allocatedSchedule.upcomingClass.time}
                                  </p>
                                  {allocatedSchedule.upcomingClass.isExtra && (
                                    <span className="inline-block mt-1 px-1.5 py-0.5 text-[7px] font-black uppercase bg-cyan-100 text-cyan-600 rounded">
                                      ★ Extra Class: {allocatedSchedule.upcomingClass.topic}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <p className="text-xs text-[var(--text-muted)] font-semibold">No upcoming classes scheduled.</p>
                              )}
                            </div>

                            {/* Holidays */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">Holiday Schedule</span>
                              {allocatedSchedule.holidayDates && allocatedSchedule.holidayDates.length > 0 ? (
                                <div className="space-y-1">
                                  {allocatedSchedule.holidayDates.map((h, hIdx) => (
                                    <div key={hIdx} className="text-xs font-semibold text-[var(--text-muted)] flex justify-between p-2.5 bg-rose-500/[0.02] border border-rose-500/10 rounded-xl">
                                      <span>{h.name}</span>
                                      <span className="text-rose-500 font-extrabold">{new Date(h.date).toLocaleDateString()}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[10px] text-[var(--text-muted)] font-semibold">No holidays listed.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--text-muted)] font-semibold">No schedule loaded.</p>
                      )}
                    </div>

                    {/* Roadmap Information Card */}
                    <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl space-y-4 md:col-span-2">
                      <h4 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-1.5 pb-2 border-b border-[var(--border-light)]">
                        <FiAward className="text-[var(--primary)]" /> Custom Level Roadmap Tracker
                      </h4>
                      {allocatedSchedule && allocatedSchedule.roadmap ? (
                        <div className="grid md:grid-cols-2 gap-6 items-center text-left">
                          <div className="space-y-2">
                            <div>
                              <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Current Level Target</span>
                              <p className="text-sm font-extrabold text-[var(--text-main)] mt-0.5">{allocatedSchedule.roadmap.currentLevel === 0 ? 'Baseline' : `Level ${allocatedSchedule.roadmap.currentLevel}`}: {allocatedSchedule.roadmap.currentModule}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Progress Percentage</span>
                              <p className="text-xs font-black text-[var(--primary)] mt-0.5">{allocatedSchedule.roadmap.progress}% Completed</p>
                            </div>
                          </div>

                          <div>
                            <div className="w-full h-3.5 bg-[var(--bg-sub)] rounded-full overflow-hidden border border-[var(--border-light)] p-0.5">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${allocatedSchedule.roadmap.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--text-muted)] font-semibold">No level roadmap progress logged yet.</p>
                      )}
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* Attendance tab contents */}
            {activeTab === 'attendance' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider mb-1">My Classroom Attendance Hub</h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-bold">Review subject-wise performance, monthly attendance grids, and detailed presence logs.</p>
                </div>

                {loadingAttendance || !attendanceReport ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
                  </div>
                ) : (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="card p-4 bg-[var(--bg-sub)]/35 border border-[var(--border)] rounded-2xl text-center">
                        <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Attendance Rate</div>
                        <div className="text-3xl font-black text-[var(--primary)] mt-2">{attendanceReport.statistics?.percentage || 0}%</div>
                      </div>
                      <div className="card p-4 bg-[var(--bg-sub)]/35 border border-[var(--border)] rounded-2xl text-center">
                        <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Present Days</div>
                        <div className="text-3xl font-black text-[var(--text-main)] mt-2">{attendanceReport.statistics?.present || 0}</div>
                      </div>
                      <div className="card p-4 bg-[var(--bg-sub)]/35 border border-[var(--border)] rounded-2xl text-center">
                        <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Absent Days</div>
                        <div className="text-3xl font-black text-rose-500 mt-2">{attendanceReport.statistics?.absent || 0}</div>
                      </div>
                      <div className="card p-4 bg-[var(--bg-sub)]/35 border border-[var(--border)] rounded-2xl text-center">
                        <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Leaves Approved</div>
                        <div className="text-3xl font-black text-amber-500 mt-2">{attendanceReport.statistics?.leave || 0}</div>
                      </div>
                    </div>

                    {/* Calendar Grid View */}
                    <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-1.5">
                          <FiClock /> Monthly Attendance Calendar
                        </h4>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                            className="p-1.5 hover:bg-[var(--bg-sub)] rounded-lg text-slate-500 hover:text-[var(--text-main)] transition-colors border border-[var(--border-light)] cursor-pointer"
                          >
                            &larr;
                          </button>
                          <span className="text-xs font-black uppercase tracking-wider text-[var(--text-main)]">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                            className="p-1.5 hover:bg-[var(--bg-sub)] rounded-lg text-slate-500 hover:text-[var(--text-main)] transition-colors border border-[var(--border-light)] cursor-pointer"
                          >
                            &rarr;
                          </button>
                        </div>
                      </div>

                      {/* Day headers */}
                      <div className="grid grid-cols-7 gap-1 text-center font-black uppercase text-[9px] text-[var(--text-light)] tracking-widest mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-1">{d}</div>)}
                      </div>

                      {/* Days grid */}
                      <div className="grid grid-cols-7 gap-1.5">
                        {(() => {
                          const year = currentDate.getFullYear();
                          const month = currentDate.getMonth();
                          const firstDayIndex = new Date(year, month, 1).getDay();
                          const totalDays = new Date(year, month + 1, 0).getDate();
                          const calendarDays = [];
                          for (let i = 0; i < firstDayIndex; i++) {
                            calendarDays.push(<div key={`empty-${i}`} className="aspect-square bg-transparent rounded-lg" />);
                          }
                          for (let d = 1; d <= totalDays; d++) {
                            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                            const log = attendanceReport.calendarData?.find(c => c.date === dayStr);
                            let bgClass = 'bg-[var(--bg-sub)]/30 text-[var(--text-light)] border border-[var(--border-light)]';
                            if (log) {
                              if (log.status === 'Present') bgClass = 'bg-green-50 text-green-700 border border-green-200';
                              else if (log.status === 'Absent') bgClass = 'bg-red-50 text-red-700 border border-red-200';
                              else if (log.status === 'Leave') bgClass = 'bg-yellow-50 text-yellow-700 border border-yellow-200';
                              else if (log.status === 'Holiday') bgClass = 'bg-blue-50 text-blue-700 border border-blue-200';
                            }
                            calendarDays.push(
                              <div
                                key={`day-${d}`}
                                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-black relative transition-all hover:scale-105 ${bgClass}`}
                                title={log ? `${log.status}: ${log.topic || 'Classroom session'}` : 'No records'}
                              >
                                <span>{d}</span>
                              </div>
                            );
                          }
                          return calendarDays;
                        })()}
                      </div>
                    </div>

                    {/* Detailed History Table */}
                    <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl space-y-4">
                      <h4 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-1.5 pb-2 border-b border-[var(--border-light)]">
                        <FiClock /> Detailed History Records
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-[var(--border)] font-black uppercase text-[10px] text-[var(--text-light)] tracking-wider">
                              <th className="pb-3">Date</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3">Course</th>
                              <th className="pb-3">Batch</th>
                              <th className="pb-3 text-right">Instructor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendanceReport.history?.records && attendanceReport.history.records.length > 0 ? (
                              attendanceReport.history.records.map((log, idx) => (
                                <tr key={idx} className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-sub)]/10 font-semibold text-[var(--text-main)]">
                                  <td className="py-3">{new Date(log.date).toLocaleDateString()}</td>
                                  <td className="py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                      log.status === 'Present' 
                                        ? 'bg-green-50 text-green-700 border border-green-200' 
                                        : log.status === 'Absent' 
                                          ? 'bg-red-50 text-red-700 border border-red-200' 
                                          : log.status === 'Leave'
                                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                                    }`}>
                                      {log.status}
                                    </span>
                                  </td>
                                  <td className="py-3">{log.courseId?.courseName || 'N/A'}</td>
                                  <td className="py-3">{log.batchId?.batchName || 'N/A'}</td>
                                  <td className="py-3 text-right">{log.teacherId?.name || 'Admin'}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center py-6 text-[var(--text-muted)] font-bold">No historical attendance marks logged.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 4. SECURITY & PASSWORD TAB */}
            {activeTab === 'security' && (
              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider mb-2">Change Password</h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-bold">Please update your password regularly to prevent unauthorized student dashboard logins.</p>
                </div>

                <div className="space-y-4 max-w-md">
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

                <div className="pt-4 flex justify-start">
                  <button
                    type="submit"
                    disabled={savingSecurity}
                    className="btn-primary py-3 px-6 text-xs font-black uppercase flex items-center gap-1.5 shadow-md"
                  >
                    <FiShield /> {savingSecurity ? 'Securing password...' : 'Update Password'}
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
