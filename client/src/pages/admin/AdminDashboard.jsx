import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FiUsers, 
  FiMap, 
  FiCheckSquare, 
  FiAward, 
  FiSearch, 
  FiTrash2, 
  FiEye, 
  FiPlus, 
  FiActivity, 
  FiUserCheck, 
  FiX, 
  FiClock, 
  FiBookOpen, 
  FiSettings, 
  FiTrendingUp,
  FiEdit,
  FiVideo,
  FiFileText,
  FiLayers,
  FiTv,
  FiShield,
  FiLock,
  FiDownload,
  FiUpload
} from 'react-icons/fi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Legend, PieChart, Pie, Cell, ComposedChart
} from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import AdminUserActivity from './AdminUserActivity';
import AdminLeaderboard from './AdminLeaderboard';
import AdminAllocationHub from './AdminAllocationHub';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [topics, setTopics] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [claims, setClaims] = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'domains' | 'topics' | 'assessments' | 'claims'
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedDomainForTopics, setSelectedDomainForTopics] = useState('');
  
  // Selected User for Detail Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [customXp, setCustomXp] = useState(0);
  const [customProgress, setCustomProgress] = useState(0);
  const [customPhase, setCustomPhase] = useState(0);

  // New Domain Creation Modal State
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [newDomain, setNewDomain] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    estimatedDuration: '4-6 months',
    difficultyLevel: 'beginner',
    certificationLink: ''
  });

  // Edit Domain Modal State
  const [editingDomain, setEditingDomain] = useState(null);

  // Topic Edit Modal State
  const [editingTopic, setEditingTopic] = useState(null);

  // Assessment Modals State
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    domainId: '',
    platform: 'HackerRank',
    assessmentLink: '',
    passingScore: 60
  });
  const [editingAssessment, setEditingAssessment] = useState(null);

  // User Management System State
  const [userSubTab, setUserSubTab] = useState('students'); // 'students' | 'teachers' | 'subadmins'

  // Paginated Student state
  const [studentsList, setStudentsList] = useState([]);
  const [studentPagination, setStudentPagination] = useState({ page: 1, limit: 10, pages: 1, total: 0 });
  const [studentFilters, setStudentFilters] = useState({ search: '', course: '', batch: '', status: '' });
  const [studentPage, setStudentPage] = useState(1);

  // Paginated Teacher state
  const [teachersList, setTeachersList] = useState([]);
  const [teacherPagination, setTeacherPagination] = useState({ page: 1, limit: 10, pages: 1, total: 0 });
  const [teacherFilters, setTeacherFilters] = useState({ search: '', subject: '', status: '' });
  const [teacherPage, setTeacherPage] = useState(1);

  // Sub-Admin state
  const [subAdminsList, setSubAdminsList] = useState([]);

  // Selections for Bulk Actions
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState([]);
  const [selectedSubAdminIds, setSelectedSubAdminIds] = useState([]);

  // Modals state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    rollNumber: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    course: '',
    batch: '',
    status: 'active'
  });

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    subjects: '',
    qualification: '',
    experience: '',
    salary: 0,
    status: 'active'
  });

  const [showSubAdminModal, setShowSubAdminModal] = useState(false);
  const [editingSubAdmin, setEditingSubAdmin] = useState(null);
  const [subAdminForm, setSubAdminForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    permissions: []
  });

  // Assign Batches/Subjects for teacher modal
  const [showAssignTeacherModal, setShowAssignTeacherModal] = useState(false);
  const [assigningTeacherId, setAssigningTeacherId] = useState('');
  const [assignTeacherForm, setAssignTeacherForm] = useState({
    subjects: '',
    batches: []
  });

  // CSV Import Modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [importErrors, setImportErrors] = useState([]);

  const [coursesList, setCoursesList] = useState([]);
  const [batchesList, setBatchesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);

  // Course, Subject, Batch tabs
  const [courseSubTab, setCourseSubTab] = useState('courses'); // 'courses' | 'subjects' | 'batches'

  // Modals for Courses/Subjects/Batches
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    courseName: '',
    description: '',
    duration: '',
    fees: 0,
    subjects: []
  });

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    subjectName: '',
    subjectCode: '',
    description: ''
  });

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [batchForm, setBatchForm] = useState({
    batchName: '',
    startDate: '',
    endDate: '',
    timing: '',
    capacity: 30,
    academicSession: '2026-2027',
    status: 'active',
    course: '',
    teachers: [],
    subjects: []
  });

  // Allocation Modals
  const [showAllocateStudentsModal, setShowAllocateStudentsModal] = useState(false);
  const [showAllocateSubjectsModal, setShowAllocateSubjectsModal] = useState(false);
  const [allocatingBatch, setAllocatingBatch] = useState(null);
  const [allocateStudentsSearch, setAllocateStudentsSearch] = useState('');
  const [tempSelectedStudentIds, setTempSelectedStudentIds] = useState([]);
  const [tempSelectedSubjectIds, setTempSelectedSubjectIds] = useState([]);
  const [allStudentsForAllocation, setAllStudentsForAllocation] = useState([]);

  // Settings Tab State
  const [settingsSubTab, setSettingsSubTab] = useState('profile'); // 'profile' | 'academic' | 'security' | 'storage' | 'notifications'
  const [settingsForm, setSettingsForm] = useState({
    name: 'CodeWave Coaching Institute',
    logo: '',
    address: '123 Technology Park, Silicon Valley',
    contactDetails: { phone: '9876543210', email: 'contact@codewave.com', website: 'https://codewave.com' },
    sessions: ['2025-2026', '2026-2027'],
    holidays: [],
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timetable: { startHour: '09:00 AM', endHour: '06:00 PM' },
    passwordPolicies: { minLength: 6, requireSpecialChar: false, requireUppercase: false },
    sessionTimeout: 60,
    loginSecurity: { maxLoginAttempts: 5, lockoutTime: 15 },
    uploadLimits: 50,
    allowedFileTypes: ['.pdf', '.csv', '.xlsx', '.png', '.jpg', '.mp4'],
    videoLimits: 500,
    smtp: { host: 'smtp.mailtrap.io', port: 2525, user: '', pass: '', fromEmail: 'noreply@codewave.com' },
    pushNotifications: { enabled: false, provider: 'OneSignal' },
    announcementSettings: { defaultChannel: 'general', allowStudentReply: false }
  });
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });
  const [newSession, setNewSession] = useState('');

  // Custom MERN Architect settings states
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditAction, setAuditAction] = useState('');
  const [activeSessions, setActiveSessions] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [storageAnalytics, setStorageAnalytics] = useState({
    totalUsageMB: 0,
    videoUsageMB: 0,
    avatarUsageMB: 0,
    notesUsageMB: 0,
    assignmentsUsageMB: 0,
    otherUsageMB: 0
  });
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [isCleaningStorage, setIsCleaningStorage] = useState(false);

  // Feature Flag States & Actions
  const [featureFlags, setFeatureFlags] = useState([]);
  const [featureSearch, setFeatureSearch] = useState('');
  const [featureCategoryFilter, setFeatureCategoryFilter] = useState('All');
  const [featureEnabledFilter, setFeatureEnabledFilter] = useState('all');
  const [bulkSelectedKeys, setBulkSelectedKeys] = useState([]);
  const [featureLogs, setFeatureLogs] = useState([]);
  const [loadingFeatures, setLoadingFeatures] = useState(false);

  const fetchFeatureFlags = async () => {
    try {
      setLoadingFeatures(true);
      const { data } = await api.get('/feature-flags');
      setFeatureFlags(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load feature flags.');
    } finally {
      setLoadingFeatures(false);
    }
  };

  const fetchFeatureLogs = async () => {
    try {
      const { data } = await api.get('/admin/feature-flags/logs');
      setFeatureLogs(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeature = async (featureKey, enabled) => {
    const loadToast = toast.loading(`${enabled ? 'Enabling' : 'Disabling'} feature...`);
    try {
      await api.put(`/admin/feature-flags/${featureKey}`, { enabled });
      toast.success('Feature flag updated!', { id: loadToast });
      fetchFeatureFlags();
      fetchFeatureLogs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update feature', { id: loadToast });
    }
  };

  const handleBulkToggleFeatures = async (enabled) => {
    if (bulkSelectedKeys.length === 0) return toast.error('No features selected.');
    const loadToast = toast.loading(`Bulk updating ${bulkSelectedKeys.length} features...`);
    try {
      await api.put('/admin/feature-flags/bulk', { featureKeys: bulkSelectedKeys, enabled });
      toast.success('Features updated!', { id: loadToast });
      setBulkSelectedKeys([]);
      fetchFeatureFlags();
      fetchFeatureLogs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed bulk update', { id: loadToast });
    }
  };

  const isUserSuperAdmin = user?.isSuperAdmin || user?.email === 'admin@codewavesolution.com' || user?.email === 'omshivhare666@gmail.com';

  const filteredFeatureFlags = featureFlags.filter(f => {
    const matchesSearch = f.featureName.toLowerCase().includes(featureSearch.toLowerCase()) || 
                          f.featureKey.toLowerCase().includes(featureSearch.toLowerCase()) ||
                          (f.description || '').toLowerCase().includes(featureSearch.toLowerCase());
    
    const matchesCategory = featureCategoryFilter === 'All' || f.category === featureCategoryFilter;
    
    const matchesEnabled = featureEnabledFilter === 'all' || 
                           (featureEnabledFilter === 'enabled' && f.enabled) || 
                           (featureEnabledFilter === 'disabled' && !f.enabled);
                           
    return matchesSearch && matchesCategory && matchesEnabled;
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, domainsRes, coursesRes, batchesRes, subjectsRes, teachersAllRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/domains'),
        api.get('/admin/courses'),
        api.get('/admin/batches'),
        api.get('/admin/subjects'),
        api.get('/admin/users/teachers', { params: { limit: 100 } })
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
      setDomains(domainsRes.data.data || []);
      setCoursesList(coursesRes.data.data || []);
      setBatchesList(batchesRes.data.data || []);
      setSubjectsList(subjectsRes.data.data || []);
      setAllTeachers(teachersAllRes.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load administration workspace data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (page = 1) => {
    try {
      const params = {
        page,
        limit: 10,
        search: studentFilters.search,
        course: studentFilters.course,
        batch: studentFilters.batch,
        status: studentFilters.status
      };
      const res = await api.get('/admin/users/students', { params });
      if (res.data.success) {
        setStudentsList(res.data.data);
        setStudentPagination(res.data.pagination);
        setStudentPage(page);
        setSelectedStudentIds([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load students list');
    }
  };

  const fetchTeachers = async (page = 1) => {
    try {
      const params = {
        page,
        limit: 10,
        search: teacherFilters.search,
        subject: teacherFilters.subject,
        status: teacherFilters.status
      };
      const res = await api.get('/admin/users/teachers', { params });
      if (res.data.success) {
        setTeachersList(res.data.data);
        setTeacherPagination(res.data.pagination);
        setTeacherPage(page);
        setSelectedTeacherIds([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load teachers list');
    }
  };

  const fetchSubAdmins = async () => {
    try {
      const res = await api.get('/admin/users/sub-admins');
      if (res.data.success) {
        setSubAdminsList(res.data.data);
        setSelectedSubAdminIds([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load sub-admins list');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      if (res.data.success) {
        setCoursesList(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load courses');
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/admin/subjects');
      if (res.data.success) {
        setSubjectsList(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load subjects');
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await api.get('/admin/batches');
      if (res.data.success) {
        setBatchesList(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load batches');
    }
  };

  const fetchAllStudentsForAllocation = async () => {
    try {
      const res = await api.get('/admin/users/students', { params: { limit: 1000 } });
      if (res.data.success) {
        setAllStudentsForAllocation(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load students for allocation');
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingCourse ? "Updating course..." : "Creating course...");
    try {
      if (editingCourse) {
        await api.put(`/admin/courses/${editingCourse._id}`, courseForm);
        toast.success("Course updated successfully!", { id: loadingToast });
      } else {
        await api.post('/admin/courses', courseForm);
        toast.success("Course created successfully!", { id: loadingToast });
      }
      setShowCourseModal(false);
      setEditingCourse(null);
      setCourseForm({ courseName: '', description: '', duration: '', fees: 0, subjects: [] });
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed", { id: loadingToast });
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course? This will unlink it from batches and students.")) return;
    const loadingToast = toast.loading("Deleting course...");
    try {
      await api.delete(`/admin/courses/${id}`);
      toast.success("Course deleted successfully!", { id: loadingToast });
      fetchCourses();
      fetchBatches();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete course", { id: loadingToast });
    }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingSubject ? "Updating subject..." : "Creating subject...");
    try {
      if (editingSubject) {
        await api.put(`/admin/subjects/${editingSubject._id}`, subjectForm);
        toast.success("Subject updated successfully!", { id: loadingToast });
      } else {
        await api.post('/admin/subjects', subjectForm);
        toast.success("Subject created successfully!", { id: loadingToast });
      }
      setShowSubjectModal(false);
      setEditingSubject(null);
      setSubjectForm({ subjectName: '', subjectCode: '', description: '' });
      fetchSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed", { id: loadingToast });
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject? This will remove it from courses and batches.")) return;
    const loadingToast = toast.loading("Deleting subject...");
    try {
      await api.delete(`/admin/subjects/${id}`);
      toast.success("Subject deleted successfully!", { id: loadingToast });
      fetchSubjects();
      fetchCourses();
      fetchBatches();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete subject", { id: loadingToast });
    }
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingBatch ? "Updating batch..." : "Creating batch...");
    try {
      if (editingBatch) {
        await api.put(`/admin/batches/${editingBatch._id}`, batchForm);
        toast.success("Batch updated successfully!", { id: loadingToast });
      } else {
        await api.post('/admin/batches', batchForm);
        toast.success("Batch created successfully!", { id: loadingToast });
      }
      setShowBatchModal(false);
      setEditingBatch(null);
      setBatchForm({
        batchName: '',
        startDate: '',
        endDate: '',
        timing: '',
        capacity: 30,
        academicSession: '2026-2027',
        status: 'active',
        course: '',
        teachers: [],
        subjects: []
      });
      fetchBatches();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed", { id: loadingToast });
    }
  };

  const handleDeleteBatch = async (id) => {
    if (!window.confirm("Are you sure you want to delete this batch? This will unlink teachers and students.")) return;
    const loadingToast = toast.loading("Deleting batch...");
    try {
      await api.delete(`/admin/batches/${id}`);
      toast.success("Batch deleted successfully!", { id: loadingToast });
      fetchBatches();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete batch", { id: loadingToast });
    }
  };

  const handleAllocateStudentsSubmit = async (e) => {
    e.preventDefault();
    if (tempSelectedStudentIds.length > allocatingBatch.capacity) {
      toast.error(`Cannot allocate students. Count (${tempSelectedStudentIds.length}) exceeds capacity (${allocatingBatch.capacity}).`);
      return;
    }
    const loadingToast = toast.loading("Allocating students to batch...");
    try {
      const res = await api.put(`/admin/batches/${allocatingBatch._id}/assign`, {
        studentIds: tempSelectedStudentIds
      });
      if (res.data.success) {
        toast.success("Students allocated successfully!", { id: loadingToast });
        setShowAllocateStudentsModal(false);
        setAllocatingBatch(null);
        fetchBatches();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to allocate students", { id: loadingToast });
    }
  };

  const handleAllocateSubjectsSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Allocating subjects to batch...");
    try {
      const res = await api.put(`/admin/batches/${allocatingBatch._id}/assign`, {
        subjectIds: tempSelectedSubjectIds
      });
      if (res.data.success) {
        toast.success("Subjects allocated successfully!", { id: loadingToast });
        setShowAllocateSubjectsModal(false);
        setAllocatingBatch(null);
        fetchBatches();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to allocate subjects", { id: loadingToast });
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data.success) {
        const d = res.data.data;
        setSettingsForm({
          // profile details
          name: d.profile?.instituteName || '',
          logo: d.profile?.logo || '',
          address: d.profile?.address || '',
          contactDetails: {
            phone: d.profile?.contactNumber || '',
            email: d.profile?.supportEmail || '',
            website: d.profile?.websiteUrl || ''
          },
          socialMediaLinks: d.profile?.socialMediaLinks || { facebook: '', twitter: '', linkedin: '', instagram: '' },
          timezone: d.profile?.timezone || 'Asia/Kolkata',
          language: d.profile?.language || 'en',
          themeSettings: d.profile?.themeSettings || { primaryColor: '#0284c7', secondaryColor: '#0f172a', darkMode: true },

          // academic config
          sessions: d.academic?.sessions || d.profile?.sessions || ['2026-2027'],
          holidays: d.academic?.holidays || [],
          workingDays: d.academic?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          timetable: {
            startHour: d.academic?.batchTimings?.startTime || '09:00 AM',
            endHour: d.academic?.batchTimings?.endTime || '06:00 PM'
          },
          attendanceRules: d.academic?.attendanceRules || { minAttendancePercentage: 75, enableAttendancePenalty: false },
          passingPercentage: d.academic?.passingPercentage || 40,
          assignmentSubmissionRules: d.academic?.assignmentSubmissionRules || { allowLateSubmission: true, latePenaltyPercentage: 10 },
          assessmentConfiguration: d.academic?.assessmentConfiguration || { durationMinutes: 60, maxAttempts: 3 },
          courseDuration: d.academic?.courseDuration || 6,
          batchTimings: d.academic?.batchTimings || { startTime: '09:00 AM', endTime: '06:00 PM' },
          academicYear: d.academic?.academicYear || '2026-2027',
          sessionStartDate: d.academic?.sessionStartDate ? d.academic.sessionStartDate.split('T')[0] : '',
          sessionEndDate: d.academic?.sessionEndDate ? d.academic.sessionEndDate.split('T')[0] : '',

          // auth & security
          passwordPolicies: {
            minLength: d.auth?.passwordPolicy?.minLength || 6,
            requireSpecialChar: d.auth?.passwordPolicy?.requireSpecialChar || false,
            requireUppercase: d.auth?.passwordPolicy?.requireUppercase || false,
            passwordExpiry: d.auth?.passwordPolicy?.passwordExpiry || 90
          },
          sessionTimeout: d.auth?.sessionTimeout || 60,
          loginSecurity: d.auth?.loginSecurity || { maxLoginAttempts: 5, lockoutTime: 15, enableTwoFactor: false, forceEmailVerification: false, jwtExpiration: '30d' },

          // storage allocation
          uploadLimits: d.storage?.maxFileUploadSize || 50,
          allowedFileTypes: d.storage?.allowedFileTypes || ['.pdf', '.csv', '.xlsx', '.png', '.jpg', '.jpeg', '.webp', '.mp4'],
          videoLimits: d.storage?.videoStorageLimit || 500,
          totalPlatformStorage: d.storage?.totalPlatformStorage || 100,
          notesUploadLimit: d.storage?.notesUploadLimit || 50,
          assignmentUploadLimit: d.storage?.assignmentUploadLimit || 20,
          userProfileImageLimit: d.storage?.userProfileImageLimit || 3,
          storageUsageStats: d.storage?.storageUsageStats || { videoUsage: 0, notesUsage: 0, assignmentUsage: 0, avatarUsage: 0 },

          // smtp config
          smtp: d.smtp || { host: '', port: 2525, username: '', password: '', senderEmail: '', senderName: '', sslTls: false },

          // alerts config
          alerts: d.alerts || {
            emailAlerts: { registration: true, login: false, assignmentDue: true, assessmentResults: true },
            pushNotifications: { newVideos: true, newNotes: true, announcements: true, roadmapUnlocks: true },
            systemAlerts: { serverErrors: true, lowStorage: true, failedJobs: false, failedEmails: true },
            alertFrequency: 'instant'
          },

          // system preferences
          system: d.system || {
            maintenanceMode: false,
            landingPageConfig: { showTestimonials: true, showStats: true, heroTitle: '', heroSubtitle: '' },
            featureFlags: { enableAiChat: true, enableGamification: true, enableCloudCredits: true },
            defaultTheme: 'dark',
            defaultUserSettings: { onboardingRequired: true, defaultRole: 'student' },
            platformBranding: { primaryColor: '#0284c7', accentColor: '#10b981', companyName: 'CodeWave' }
          }
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch settings");
    }
  };

  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!hasPermission('manage_settings')) {
      toast.error("You do not have permission to manage settings.");
      return;
    }
    const loadingToast = toast.loading("Saving settings...");
    try {
      let endpoint = '';
      let payload = {};

      if (settingsSubTab === 'profile') {
        endpoint = '/admin/settings/profile';
        payload = {
          instituteName: settingsForm.name,
          logo: settingsForm.logo,
          address: settingsForm.address,
          contactNumber: settingsForm.contactDetails?.phone,
          supportEmail: settingsForm.contactDetails?.email,
          websiteUrl: settingsForm.contactDetails?.website,
          socialMediaLinks: settingsForm.socialMediaLinks,
          timezone: settingsForm.timezone,
          language: settingsForm.language,
          themeSettings: settingsForm.themeSettings
        };
      } else if (settingsSubTab === 'academic') {
        endpoint = '/admin/settings/academic';
        payload = {
          academicYear: settingsForm.academicYear,
          sessionStartDate: settingsForm.sessionStartDate,
          sessionEndDate: settingsForm.sessionEndDate,
          workingDays: settingsForm.workingDays,
          holidays: settingsForm.holidays,
          attendanceRules: settingsForm.attendanceRules,
          passingPercentage: settingsForm.passingPercentage,
          assignmentSubmissionRules: settingsForm.assignmentSubmissionRules,
          assessmentConfiguration: settingsForm.assessmentConfiguration,
          courseDuration: settingsForm.courseDuration,
          batchTimings: {
            startTime: settingsForm.timetable?.startHour || settingsForm.batchTimings?.startTime,
            endTime: settingsForm.timetable?.endHour || settingsForm.batchTimings?.endTime
          }
        };
      } else if (settingsSubTab === 'security' || settingsSubTab === 'auth') {
        endpoint = '/admin/settings/auth';
        payload = {
          passwordPolicy: {
            minLength: settingsForm.passwordPolicies?.minLength,
            requireSpecialChar: settingsForm.passwordPolicies?.requireSpecialChar,
            requireUppercase: settingsForm.passwordPolicies?.requireUppercase,
            passwordExpiry: settingsForm.passwordPolicies?.passwordExpiry
          },
          sessionTimeout: settingsForm.sessionTimeout,
          loginSecurity: settingsForm.loginSecurity
        };
      } else if (settingsSubTab === 'storage') {
        endpoint = '/admin/settings/storage';
        payload = {
          totalPlatformStorage: settingsForm.totalPlatformStorage,
          videoStorageLimit: settingsForm.videoLimits,
          notesUploadLimit: settingsForm.notesUploadLimit,
          assignmentUploadLimit: settingsForm.assignmentUploadLimit,
          userProfileImageLimit: settingsForm.userProfileImageLimit,
          maxFileUploadSize: settingsForm.uploadLimits,
          allowedFileTypes: settingsForm.allowedFileTypes
        };
      } else if (settingsSubTab === 'smtp') {
        endpoint = '/admin/settings/smtp';
        payload = settingsForm.smtp;
      } else if (settingsSubTab === 'alerts') {
        endpoint = '/admin/settings/alerts';
        payload = settingsForm.alerts;
      } else if (settingsSubTab === 'system') {
        endpoint = '/admin/settings/system';
        payload = settingsForm.system;
      } else {
        toast.error("Invalid settings action");
        toast.dismiss(loadingToast);
        return;
      }

      const res = await api.put(endpoint, payload);
      if (res.data.success) {
        toast.success("Settings updated successfully!", { id: loadingToast });
        fetchSettings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update settings", { id: loadingToast });
    }
  };

  // Custom MERN Architect settings API callers
  const fetchAuditLogs = async () => {
    try {
      const res = await api.get(`/admin/settings/audit-logs?page=${auditPage}&search=${auditSearch}&action=${auditAction}`);
      if (res.data.success) {
        setAuditLogs(res.data.data);
        setAuditTotalPages(res.data.pagination.pages || 1);
      }
    } catch (err) {
      toast.error("Failed to load audit logs");
    }
  };

  const fetchActiveSessions = async () => {
    try {
      const res = await api.get('/admin/settings/sessions');
      if (res.data.success) {
        setActiveSessions(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load active user sessions");
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await api.get('/admin/settings/permissions');
      if (res.data.success) {
        setRolesList(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load permissions config");
    }
  };

  const fetchStorageAnalytics = async () => {
    try {
      const res = await api.get('/admin/settings/storage/analytics');
      if (res.data.success) {
        setStorageAnalytics(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load storage usage analytics");
    }
  };

  const handleTerminateSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to terminate this login session?")) return;
    try {
      const res = await api.post('/admin/settings/sessions/terminate', { sessionId });
      if (res.data.success) {
        toast.success("Session terminated");
        fetchActiveSessions();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to terminate session");
    }
  };

  const handleForceLogoutAll = async (userId = null) => {
    const msg = userId
      ? "Force logout all active sessions for this user?"
      : "Force logout all users globally (except your current session)?";
    if (!window.confirm(msg)) return;
    try {
      const res = await api.post('/admin/settings/sessions/terminate-all', { userId });
      if (res.data.success) {
        toast.success("Users logged out successfully");
        fetchActiveSessions();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to force logout");
    }
  };

  const handleSaveRolePermissions = async (roleName, permissions, deleteRole = false) => {
    try {
      const res = await api.put('/admin/settings/permissions', {
        role: roleName,
        permissions,
        deleteRole
      });
      if (res.data.success) {
        toast.success(deleteRole ? "Role deleted" : "Role permissions updated");
        setEditingRole(null);
        fetchPermissions();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role permissions");
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      toast.error("Enter a role name");
      return;
    }
    await handleSaveRolePermissions(newRoleName.trim(), []);
    setNewRoleName('');
  };

  const handleTogglePermission = (roleObj, perm) => {
    let updatedPerms = [...(roleObj.permissions || [])];
    if (updatedPerms.includes(perm)) {
      updatedPerms = updatedPerms.filter(p => p !== perm);
    } else {
      updatedPerms.push(perm);
    }
    handleSaveRolePermissions(roleObj.role, updatedPerms);
  };

  const handleRunCleanup = async () => {
    if (!window.confirm("Scan and permanently delete orphaned uploads? This cannot be undone.")) return;
    setIsCleaningStorage(true);
    try {
      const res = await api.post('/admin/settings/storage/cleanup');
      if (res.data.success) {
        toast.success(res.data.message);
        fetchStorageAnalytics();
        fetchSettings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Storage cleanup failed");
    } finally {
      setIsCleaningStorage(false);
    }
  };

  const handleTestSmtp = async (e) => {
    e.preventDefault();
    if (!testEmailRecipient.trim()) {
      toast.error("Enter recipient email address");
      return;
    }
    setIsTestingSmtp(true);
    try {
      const res = await api.post('/admin/settings/smtp/test', {
        ...settingsForm.smtp,
        recipientEmail: testEmailRecipient.trim()
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "SMTP test failed");
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const handleExportAuditLogs = () => {
    try {
      const headers = ['Timestamp', 'User Email', 'Action', 'Details', 'IP Address', 'Device'];
      const rows = auditLogs.map(log => [
        new Date(log.timestamp || log.createdAt).toLocaleString(),
        log.userEmail,
        log.action,
        log.details || '',
        log.ipAddress || '',
        log.deviceInfo || ''
      ]);
      const csvContent = "data:text/csv;charset=utf-8,"
        + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `codewave_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      toast.error("Failed to export logs");
    }
  };

  const addHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) {
      toast.error("Please enter holiday name and date");
      return;
    }
    setSettingsForm({
      ...settingsForm,
      holidays: [...(settingsForm.holidays || []), { name: newHoliday.name, date: newHoliday.date }]
    });
    setNewHoliday({ name: '', date: '' });
  };

  const removeHoliday = (index) => {
    const updated = (settingsForm.holidays || []).filter((_, i) => i !== index);
    setSettingsForm({ ...settingsForm, holidays: updated });
  };

  const addSession = () => {
    if (!newSession.trim()) {
      toast.error("Please enter academic session");
      return;
    }
    if ((settingsForm.sessions || []).includes(newSession.trim())) {
      toast.error("Session already exists");
      return;
    }
    setSettingsForm({
      ...settingsForm,
      sessions: [...(settingsForm.sessions || []), newSession.trim()]
    });
    setNewSession('');
  };

  const removeSession = (session) => {
    const updated = (settingsForm.sessions || []).filter(s => s !== session);
    setSettingsForm({ ...settingsForm, sessions: updated });
  };

  const toggleWorkingDay = (day) => {
    let updated = [...(settingsForm.workingDays || [])];
    if (updated.includes(day)) {
      updated = updated.filter(d => d !== day);
    } else {
      updated.push(day);
    }
    setSettingsForm({ ...settingsForm, workingDays: updated });
  };

  const toggleAllowedFileType = (ext) => {
    let updated = [...(settingsForm.allowedFileTypes || [])];
    if (updated.includes(ext)) {
      updated = updated.filter(e => e !== ext);
    } else {
      updated.push(ext);
    }
    setSettingsForm({ ...settingsForm, allowedFileTypes: updated });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.isSuperAdmin || user.email === 'omshivhare666@gmail.com') return true;
    return user.permissions && user.permissions.includes(permission);
  };

  const openAllocateStudentsModal = (batch) => {
    setAllocatingBatch(batch);
    setTempSelectedStudentIds(batch.students ? batch.students.map(s => s._id || s) : []);
    setAllocateStudentsSearch('');
    fetchAllStudentsForAllocation();
    setShowAllocateStudentsModal(true);
  };

  const openAllocateSubjectsModal = (batch) => {
    setAllocatingBatch(batch);
    setTempSelectedSubjectIds(batch.subjects ? batch.subjects.map(s => s._id || s) : []);
    setShowAllocateSubjectsModal(true);
  };

  const fetchClaims = async () => {
    setClaimsLoading(true);
    try {
      const res = await api.get('/cloud-credits/admin/claims');
      setClaims(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load cloud credits claims');
    } finally {
      setClaimsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      if (userSubTab === 'students') {
        fetchStudents(1);
      } else if (userSubTab === 'teachers') {
        fetchTeachers(1);
      } else if (userSubTab === 'subadmins') {
        fetchSubAdmins();
      }
    } else if (activeTab === 'settings') {
      fetchSettings();
      if (settingsSubTab === 'audit') fetchAuditLogs();
      if (settingsSubTab === 'sessions') fetchActiveSessions();
      if (settingsSubTab === 'permissions') fetchPermissions();
      if (settingsSubTab === 'storage') fetchStorageAnalytics();
      if (settingsSubTab === 'features') {
        fetchFeatureFlags();
        fetchFeatureLogs();
      }
    } else if (activeTab === 'claims') {
      fetchClaims();
    }
  }, [activeTab, userSubTab, settingsSubTab]);

  useEffect(() => {
    if (activeTab === 'settings' && settingsSubTab === 'audit') {
      const delayDebounce = setTimeout(() => {
        fetchAuditLogs();
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [auditPage, auditSearch, auditAction, settingsSubTab, activeTab]);

  useEffect(() => {
    if (activeTab === 'users' && userSubTab === 'students') {
      const delayDebounce = setTimeout(() => {
        fetchStudents(1);
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [studentFilters]);

  useEffect(() => {
    if (activeTab === 'users' && userSubTab === 'teachers') {
      const delayDebounce = setTimeout(() => {
        fetchTeachers(1);
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [teacherFilters]);

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingStudent ? "Updating student profile..." : "Adding new student...");
    try {
      if (editingStudent) {
        await api.put(`/admin/users/students/${editingStudent._id}`, studentForm);
        toast.success("Student profile updated successfully!", { id: loadingToast });
      } else {
        await api.post('/admin/users/students', studentForm);
        toast.success("Student added successfully! Default pass: CodeWave@123", { id: loadingToast });
      }
      setShowStudentModal(false);
      setEditingStudent(null);
      setStudentForm({ rollNumber: '', fullName: '', email: '', phone: '', address: '', course: '', batch: '', status: 'active' });
      fetchStudents(studentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed", { id: loadingToast });
    }
  };

  const handleStudentStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const actionName = newStatus === 'suspended' ? 'suspending' : 'activating';
    const loadingToast = toast.loading(`${actionName.charAt(0).toUpperCase() + actionName.slice(1)} student account...`);
    try {
      await api.put(`/admin/users/students/${id}/status`, { status: newStatus });
      toast.success(`Student account is now ${newStatus}!`, { id: loadingToast });
      fetchStudents(studentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle status", { id: loadingToast });
    }
  };

  const handleStudentPasswordReset = async (id) => {
    const password = prompt("Enter new password for student (min 6 characters):");
    if (!password) return;
    if (password.length < 6) {
      toast.error("Password too short");
      return;
    }
    const loadingToast = toast.loading("Resetting password...");
    try {
      await api.put(`/admin/users/students/${id}/reset-password`, { password });
      toast.success("Password reset completed!", { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password", { id: loadingToast });
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Permanently delete this student and related fee/attendance records?")) return;
    const loadingToast = toast.loading("Deleting student profile...");
    try {
      await api.delete(`/admin/users/students/${id}`);
      toast.success("Student records deleted!", { id: loadingToast });
      fetchStudents(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete student", { id: loadingToast });
    }
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingTeacher ? "Updating teacher profile..." : "Adding teacher...");
    const subjectsArray = teacherForm.subjects.split(',').map(s => s.trim()).filter(s => s);
    const payload = {
      ...teacherForm,
      subjects: subjectsArray
    };
    try {
      if (editingTeacher) {
        await api.put(`/admin/users/teachers/${editingTeacher._id}`, payload);
        toast.success("Teacher profile updated!", { id: loadingToast });
      } else {
        await api.post('/admin/users/teachers', payload);
        toast.success("Teacher account created! Default pass: CodeWave@123", { id: loadingToast });
      }
      setShowTeacherModal(false);
      setEditingTeacher(null);
      setTeacherForm({ name: '', email: '', phone: '', subject: '', subjects: '', qualification: '', experience: '', salary: 0, status: 'active' });
      fetchTeachers(teacherPage);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed", { id: loadingToast });
    }
  };

  const handleTeacherStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const loadingToast = toast.loading(`Updating teacher status to ${newStatus}...`);
    try {
      await api.put(`/admin/users/teachers/${id}/status`, { status: newStatus });
      toast.success(`Teacher status is now ${newStatus}!`, { id: loadingToast });
      fetchTeachers(teacherPage);
    } catch (err) {
      toast.error("Failed to toggle status", { id: loadingToast });
    }
  };

  const handleAssignTeacherSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating teacher assignments...");
    const subjectsArray = assignTeacherForm.subjects.split(',').map(s => s.trim()).filter(s => s);
    try {
      await api.put(`/admin/users/teachers/${assigningTeacherId}/assign`, {
        subjects: subjectsArray,
        batches: assignTeacherForm.batches
      });
      toast.success("Subjects and batches assigned successfully!", { id: loadingToast });
      setShowAssignTeacherModal(false);
      setAssigningTeacherId('');
      fetchTeachers(teacherPage);
    } catch (err) {
      toast.error("Assignment failed", { id: loadingToast });
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Permanently delete this teacher account?")) return;
    const loadingToast = toast.loading("Deleting teacher account...");
    try {
      await api.delete(`/admin/users/teachers/${id}`);
      toast.success("Teacher removed successfully!", { id: loadingToast });
      fetchTeachers(1);
    } catch (err) {
      toast.error("Deletion failed", { id: loadingToast });
    }
  };

  const handleSubAdminSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingSubAdmin ? "Updating settings..." : "Creating sub-admin account...");
    try {
      if (editingSubAdmin) {
        await api.put(`/admin/users/sub-admins/${editingSubAdmin._id}`, subAdminForm);
        toast.success("Sub-admin settings updated!", { id: loadingToast });
      } else {
        if (!subAdminForm.password || subAdminForm.password.length < 6) {
          toast.error("Password must be at least 6 characters", { id: loadingToast });
          return;
        }
        await api.post('/admin/users/sub-admins', subAdminForm);
        toast.success("Sub-admin created successfully!", { id: loadingToast });
      }
      setShowSubAdminModal(false);
      setEditingSubAdmin(null);
      setSubAdminForm({ fullName: '', email: '', password: '', phone: '', permissions: [] });
      fetchSubAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed", { id: loadingToast });
    }
  };

  const handleDeleteSubAdmin = async (id) => {
    if (!window.confirm("Permanently delete this sub-admin account?")) return;
    const loadingToast = toast.loading("Removing account...");
    try {
      await api.delete(`/admin/users/sub-admins/${id}`);
      toast.success("Sub-admin deleted!", { id: loadingToast });
      fetchSubAdmins();
    } catch (err) {
      toast.error("Failed to delete", { id: loadingToast });
    }
  };

  const togglePermissionSelection = (perm) => {
    const current = [...subAdminForm.permissions];
    const index = current.indexOf(perm);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(perm);
    }
    setSubAdminForm({ ...subAdminForm, permissions: current });
  };

  const executeBulkAction = async (action, targetRole) => {
    let ids = [];
    if (targetRole === 'student') ids = selectedStudentIds;
    else if (targetRole === 'teacher') ids = selectedTeacherIds;
    else ids = selectedSubAdminIds;

    if (ids.length === 0) {
      toast.error("No items selected");
      return;
    }

    let resetPasswordValue = '';
    let newStatus = '';

    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to delete these ${ids.length} accounts?`)) return;
    } else if (action === 'status') {
      newStatus = prompt("Enter new status ('active', 'suspended', or 'inactive'):");
      if (!newStatus) return;
      if (!['active', 'suspended', 'inactive'].includes(newStatus)) {
        toast.error("Invalid status value.");
        return;
      }
    } else if (action === 'reset-password') {
      resetPasswordValue = prompt("Enter new password for selected accounts (min 6 characters):");
      if (!resetPasswordValue) return;
      if (resetPasswordValue.length < 6) {
        toast.error("Password too short");
        return;
      }
    }

    const loadingToast = toast.loading("Executing bulk updates...");
    try {
      await api.post('/admin/users/bulk-action', {
        action,
        ids,
        targetRole,
        newStatus,
        resetPasswordValue
      });
      toast.success("Bulk action completed!", { id: loadingToast });
      if (targetRole === 'student') {
        setSelectedStudentIds([]);
        fetchStudents(studentPage);
      } else if (targetRole === 'teacher') {
        setSelectedTeacherIds([]);
        fetchTeachers(teacherPage);
      } else {
        setSelectedSubAdminIds([]);
        fetchSubAdmins();
      }
    } catch (err) {
      toast.error("Bulk operation failed", { id: loadingToast });
    }
  };

  const handleCSVFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n').map(row => row.trim()).filter(row => row);
      if (rows.length < 2) {
        toast.error('CSV is empty or missing headers');
        return;
      }
      
      const headers = rows[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      const parsedStudents = [];
      const errors = [];

      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        if (cols.length === 0 || (cols.length === 1 && cols[0] === '')) continue;

        const student = {};
        headers.forEach((header, index) => {
          student[header] = cols[index] || '';
        });

        const rollNumber = student['rollNumber'] || student['Roll Number'] || student['RollNo'] || '';
        const fullName = student['fullName'] || student['Full Name'] || student['Name'] || '';
        const email = student['email'] || student['Email'] || '';
        const phone = student['phone'] || student['Phone'] || student['Mobile'] || '';
        const address = student['address'] || student['Address'] || '';
        const courseName = student['courseName'] || student['Course'] || '';
        const batchName = student['batchName'] || student['Batch'] || '';

        if (!rollNumber || !fullName || !email) {
          errors.push(`Row ${i + 1}: Missing Roll Number, Full Name, or Email.`);
        }

        parsedStudents.push({
          rollNumber,
          fullName,
          email,
          phone,
          address,
          courseName,
          batchName
        });
      }

      setImportedData(parsedStudents);
      setImportErrors(errors);
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = async () => {
    if (importedData.length === 0) {
      toast.error("No data parsed to import");
      return;
    }
    if (importErrors.length > 0) {
      if (!window.confirm("There are validation errors. Do you want to skip invalid rows and proceed?")) return;
    }

    const validStudents = importedData.filter(s => s.fullName && s.email && s.rollNumber);
    if (validStudents.length === 0) {
      toast.error("No valid student rows to import");
      return;
    }

    const loadingToast = toast.loading(`Importing ${validStudents.length} students...`);
    try {
      const res = await api.post('/admin/users/students/import', { students: validStudents });
      if (res.data.success) {
        const results = res.data.data;
        toast.success(`Successfully imported ${results.successCount} students!`, { id: loadingToast });
        if (results.errors.length > 0) {
          toast(`Skipped ${results.errors.length} duplicate/invalid rows.`, { icon: '⚠️' });
        }
        setShowImportModal(false);
        setImportedData([]);
        setImportErrors([]);
        fetchStudents(1);
      }
    } catch (err) {
      toast.error("Import failed", { id: loadingToast });
    }
  };

  const handleExportCSV = async (role) => {
    try {
      const res = await api.get(`/admin/users/export?role=${role}`);
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        let csvContent = "\uFEFF"; // BOM for Excel UTF-8
        
        if (role === 'student') {
          csvContent += "Roll Number,Full Name,Email,Phone,Course,Batch,Status\n";
          data.forEach(item => {
            const courseName = item.course ? item.course.courseName : '';
            const batchName = item.batch ? item.batch.batchName : '';
            csvContent += `"${item.rollNumber || ''}","${item.fullName || ''}","${item.email || ''}","${item.phone || ''}","${courseName}","${batchName}","${item.status || ''}"\n`;
          });
        } else if (role === 'teacher') {
          csvContent += "Name,Email,Phone,Subjects,Qualification,Experience,Salary,Status\n";
          data.forEach(item => {
            const subjectsStr = (item.subjects || []).join('; ');
            csvContent += `"${item.name || ''}","${item.email || ''}","${item.phone || ''}","${subjectsStr}","${item.qualification || ''}","${item.experience || ''}","${item.salary || 0}","${item.status || ''}"\n`;
          });
        } else {
          csvContent += "Full Name,Email,Phone,Permissions,Status\n";
          data.forEach(item => {
            const permissionsStr = (item.permissions || []).join('; ');
            csvContent += `"${item.fullName || ''}","${item.email || ''}","${item.phone || ''}","${permissionsStr}","${item.status || ''}"\n`;
          });
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${role}_export_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} records exported successfully!`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to export records');
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await api.get('/topics/all');
      setTopics(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load curriculum topics');
    }
  };

  const fetchAssessments = async () => {
    try {
      const res = await api.get('/assessments');
      setAssessments(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load active assessments');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const loadingToast = toast.loading("Updating user privilege level...");
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        toast.success("Role updated successfully!", { id: loadingToast });
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      toast.error("Failed to alter user privileges", { id: loadingToast });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you absolutely sure you want to delete this user? This action is irreversible.")) return;
    const loadingToast = toast.loading("Removing user account...");
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        toast.success("User deleted successfully", { id: loadingToast });
        setUsers(users.filter(u => u._id !== userId));
      }
    } catch (err) {
      toast.error("Failed to delete user account", { id: loadingToast });
    }
  };

  const openPersonalizeDrawer = (user) => {
    setSelectedUser(user);
    setCustomXp(user.xp || 0);
    setCustomProgress(user.overallProgress || 0);
    setCustomPhase(user.currentPhase || 0);
  };

  const handleSaveProgress = async () => {
    setUpdatingProgress(true);
    const loadingToast = toast.loading("Saving personalization updates...");
    try {
      const res = await api.put(`/admin/users/${selectedUser._id}/progress`, {
        xp: Number(customXp),
        overallProgress: Number(customProgress),
        currentPhase: Number(customPhase)
      });
      if (res.data.success) {
        toast.success("Student records updated!", { id: loadingToast });
        setUsers(users.map(u => u._id === selectedUser._id ? res.data.data : u));
        setSelectedUser(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to update student records", { id: loadingToast });
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleCreateDomain = async (e) => {
    e.preventDefault();
    if (!newDomain.name || !newDomain.slug) {
      toast.error("Please provide both domain name and a unique slug");
      return;
    }
    const loadingToast = toast.loading("Registering new domain...");
    try {
      const res = await api.post('/domains', newDomain);
      if (res.data) {
        toast.success("New domain added successfully!", { id: loadingToast });
        setDomains([...domains, res.data.data]);
        setShowDomainModal(false);
        setNewDomain({
          name: '',
          slug: '',
          shortDescription: '',
          estimatedDuration: '4-6 months',
          difficultyLevel: 'beginner',
          certificationLink: ''
        });
        // Reload stats
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data.data);
      }
    } catch (err) {
      toast.error("Failed to register domain: Slug might be duplicate", { id: loadingToast });
    }
  };

  const handleUpdateDomain = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Saving domain updates...");
    try {
      const res = await api.put(`/domains/${editingDomain._id}`, editingDomain);
      if (res.data.success) {
        toast.success("Domain updated successfully!", { id: loadingToast });
        setDomains(domains.map(d => d._id === editingDomain._id ? res.data.data : d));
        setEditingDomain(null);
      }
    } catch (err) {
      toast.error("Failed to update domain: slug might be duplicate", { id: loadingToast });
    }
  };

  const handleDeleteDomain = async (domainId) => {
    if (!window.confirm("Are you absolutely sure you want to delete this domain? This will also affect linked roadmaps!")) return;
    const loadingToast = toast.loading("Removing domain path...");
    try {
      const res = await api.delete(`/domains/${domainId}`);
      if (res.data.success) {
        toast.success("Domain removed successfully", { id: loadingToast });
        setDomains(domains.filter(d => d._id !== domainId));
      }
    } catch (err) {
      toast.error("Failed to delete domain path", { id: loadingToast });
    }
  };

  const handleUpdateTopicLinks = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating topic resource links...");
    try {
      const res = await api.put(`/topics/${editingTopic._id}`, {
        youtubeLink: editingTopic.youtubeLink?.trim() || '',
        gfgLink: editingTopic.gfgLink?.trim() || ''
      });
      if (res.data.success) {
        toast.success("Topic video & doc links updated!", { id: loadingToast });
        setTopics(topics.map(t => t._id === editingTopic._id ? res.data.data : t));
        setEditingTopic(null);
      }
    } catch (err) {
      toast.error("Failed to update topic links", { id: loadingToast });
    }
  };

  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    if (!newAssessment.title || !newAssessment.domainId) {
      toast.error("Title and Target Domain are required");
      return;
    }
    const loadingToast = toast.loading("Assigning assessment...");
    try {
      const res = await api.post('/assessments', newAssessment);
      if (res.data.success) {
        toast.success("New assessment assigned successfully!", { id: loadingToast });
        setAssessments([...assessments, res.data.data]);
        setShowAssessmentModal(false);
        setNewAssessment({
          title: '',
          description: '',
          domainId: '',
          platform: 'HackerRank',
          assessmentLink: '',
          passingScore: 60
        });
      }
    } catch (err) {
      toast.error("Failed to add assessment", { id: loadingToast });
    }
  };

  const handleUpdateAssessment = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating assessment details...");
    try {
      const res = await api.put(`/assessments/${editingAssessment._id}`, editingAssessment);
      if (res.data.success) {
        toast.success("Assessment updated successfully!", { id: loadingToast });
        setAssessments(assessments.map(a => a._id === editingAssessment._id ? res.data.data : a));
        setEditingAssessment(null);
      }
    } catch (err) {
      toast.error("Failed to update assessment", { id: loadingToast });
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    const loadingToast = toast.loading("Removing assessment...");
    try {
      const res = await api.delete(`/assessments/${assessmentId}`);
      if (res.data.success) {
        toast.success("Assessment removed successfully", { id: loadingToast });
        setAssessments(assessments.filter(a => a._id !== assessmentId));
      }
    } catch (err) {
      toast.error("Failed to delete assessment", { id: loadingToast });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
        <p className="text-sm font-bold text-slate-400">Loading CodeWave Solution Administration Console...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard fade-in max-w-7xl mx-auto pb-16 px-4">
      {/* Header and Welcome banner */}
      <div className="admin-hero card p-8 bg-gradient-to-br from-indigo-50/70 to-emerald-50/40 dark:from-slate-900 dark:to-indigo-950/70 border border-indigo-100 dark:border-indigo-900/30 shadow-md dark:shadow-2xl rounded-3xl relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[10px] font-black text-emerald-700 dark:text-indigo-400 uppercase tracking-widest bg-emerald-50 dark:bg-indigo-950 border border-emerald-200/60 dark:border-indigo-900/50 px-3 py-1 rounded-full">
              Teammate Portal
            </span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mt-3 mb-1 tracking-tight">Admin & Teammate Workspace</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Personalize student trajectories, oversee specializations, and customize platform curriculums.</p>
          </div>

          <div className="flex flex-wrap gap-2 bg-slate-100/80 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-200/60 dark:border-white/5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'overview' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              📊 Institute Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'users' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              👥 Manage Users
            </button>
            <button
              onClick={() => {
                setActiveTab('courses_batches');
                fetchCourses();
                fetchSubjects();
                fetchBatches();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'courses_batches' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              🏫 Courses & Batches
            </button>
            <button
              onClick={() => setActiveTab('domains')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'domains' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              🗺️ Domains
            </button>
            <button
              onClick={() => {
                setActiveTab('topics');
                fetchTopics();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'topics' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              📚 Topic Video Links
            </button>
            <button
              onClick={() => {
                setActiveTab('assessments');
                fetchAssessments();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'assessments' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              📝 Assign Assessments
            </button>
            <button
              onClick={() => {
                setActiveTab('claims');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'claims' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              ☁️ Cloud Credit Claims
            </button>
            <button
              onClick={() => {
                setActiveTab('activity');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'activity' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              📈 User Analytics
            </button>
            <button
              onClick={() => {
                setActiveTab('leaderboard');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'leaderboard' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              🏆 Leaderboard Settings
            </button>
            <button
              onClick={() => {
                setActiveTab('settings');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'settings' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Overview row (only show on other management tabs) */}
      {activeTab !== 'overview' && activeTab !== 'settings' && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="admin-stat-card bg-white border border-slate-100 dark:bg-slate-900/55 dark:border-white/5 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Registered</span>
            <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <FiUsers className="text-indigo-650 dark:text-indigo-400 text-lg" /> {stats?.totalUsers || 0}
            </div>
          </div>
          <div className="admin-stat-card bg-white border border-slate-100 dark:bg-slate-900/55 dark:border-white/5 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Students</span>
            <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <FiUserCheck className="text-emerald-650 dark:text-emerald-400 text-lg" /> {stats?.totalStudents || 0}
            </div>
          </div>
          <div className="admin-stat-card bg-white border border-slate-100 dark:bg-slate-900/55 dark:border-white/5 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Assigned Mentors</span>
            <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <FiAward className="text-amber-550 dark:text-amber-400 text-lg" /> {stats?.totalMentors || 0}
            </div>
          </div>
          <div className="admin-stat-card bg-white border border-slate-100 dark:bg-slate-900/55 dark:border-white/5 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Active Specializations</span>
            <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <FiMap className="text-purple-650 dark:text-purple-400 text-lg" /> {stats?.totalDomains || 0}
            </div>
          </div>
          <div className="admin-stat-card bg-white border border-slate-100 dark:bg-slate-900/55 dark:border-white/5 p-5 rounded-2xl col-span-2 md:col-span-1 shadow-sm hover:shadow-md transition-all duration-300">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Milestones</span>
            <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <FiCheckSquare className="text-sky-650 dark:text-sky-400 text-lg" /> {stats?.totalAssessments || 0}
            </div>
          </div>
        </div>
      )}

      {/* Tabs panels */}
      {activeTab === 'overview' && (
        <div className="space-y-10 animate-in fade-in duration-300">
          
          {/* Dashboard Cards Grid (12 Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
             {/* 1. Students */}
             <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Total Students</span>
                 <span className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{stats?.totalStudents || 0}</span>
               </div>
               <div className="p-3.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400">
                 <FiUsers size={22} />
               </div>
             </div>
             {/* 2. Teachers */}
             <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Total Teachers</span>
                 <span className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{stats?.totalTeachers || 0}</span>
               </div>
               <div className="p-3.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400">
                 <FiUserCheck size={22} />
               </div>
             </div>
             {/* 3. Courses */}
             <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Total Courses</span>
                 <span className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{stats?.totalCourses || 0}</span>
               </div>
               <div className="p-3.5 bg-violet-50 dark:bg-violet-500/10 rounded-2xl text-violet-600 dark:text-violet-400">
                 <FiBookOpen size={22} />
               </div>
             </div>
             {/* 4. Batches */}
             <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Total Batches</span>
                 <span className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{stats?.totalBatches || 0}</span>
               </div>
               <div className="p-3.5 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
                 <FiLayers size={22} />
               </div>
             </div>
             {/* 5. Live Classes */}
             <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Active Live Classes</span>
                 <span className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{stats?.activeLiveClasses || 0}</span>
               </div>
               <div className="p-3.5 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400">
                 <FiTv size={22} className="animate-pulse" />
               </div>
             </div>
             {/* 6. Video Lectures */}
             <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Video Lectures</span>
                 <span className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{stats?.totalVideoLectures || 0}</span>
               </div>
               <div className="p-3.5 bg-rose-50 dark:bg-rose-500/10 rounded-2xl text-rose-600 dark:text-rose-400">
                 <FiVideo size={22} />
               </div>
             </div>
             {/* 7. Notes */}
             <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Total Notes</span>
                 <span className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{stats?.totalNotes || 0}</span>
               </div>
               <div className="p-3.5 bg-sky-50 dark:bg-sky-500/10 rounded-2xl text-sky-600 dark:text-sky-400">
                 <FiFileText size={22} />
               </div>
             </div>
             {/* 8. Assignments */}
             <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Total Assignments</span>
                 <span className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{stats?.totalAssignments || 0}</span>
               </div>
               <div className="p-3.5 bg-orange-50 dark:bg-orange-500/10 rounded-2xl text-orange-600 dark:text-orange-400">
                 <FiEdit size={22} />
               </div>
             </div>
             {/* 9. Assessments */}
             <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Total Assessments</span>
                 <span className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{stats?.totalAssessments || 0}</span>
               </div>
               <div className="p-3.5 bg-pink-50 dark:bg-pink-500/10 rounded-2xl text-pink-600 dark:text-pink-400">
                 <FiCheckSquare size={22} />
               </div>
             </div>
             {/* 10. Attendance Today */}
             <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Attendance Today</span>
                 <span className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{stats?.attendanceToday || 0}%</span>
               </div>
               <div className="p-3.5 bg-teal-50 dark:bg-teal-500/10 rounded-2xl text-teal-600 dark:text-teal-400">
                 <FiClock size={22} />
               </div>
             </div>
             {/* 11. New Admissions */}
             <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">New Admissions (30d)</span>
                 <span className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{stats?.newAdmissions || 0}</span>
               </div>
               <div className="p-3.5 bg-fuchsia-50 dark:bg-fuchsia-500/10 rounded-2xl text-fuchsia-600 dark:text-fuchsia-400">
                 <FiPlus size={22} />
               </div>
             </div>
             {/* 12. Platform Activity */}
             <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-1">Platform Activity</span>
                 <span className="text-3xl font-black text-slate-800 dark:text-white leading-tight">{stats?.platformActivity || 0}</span>
               </div>
               <div className="p-3.5 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-600 dark:text-purple-400">
                 <FiActivity size={22} />
               </div>
             </div>
          </div>

          {/* Dashboard Charts (6 Charts in responsive grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Student Growth */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-550 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <FiTrendingUp className="text-indigo-500" /> Student Growth
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.charts?.studentGrowth || []}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorStudents)" name="Total Students" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Attendance Trends */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-550 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <FiClock className="text-emerald-500" /> Attendance Trends (Last 7 Days)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.charts?.attendanceTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[60, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Attendance Rate (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Assignment Submission Rate */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-550 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <FiEdit className="text-violet-500" /> Assignment Submission Rate
              </h3>
              <div className="h-64 flex flex-col sm:flex-row justify-center items-center gap-6">
                <div className="h-full w-full max-w-[200px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.charts?.assignmentSubmission || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#f43f5e" />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {(stats?.charts?.assignmentSubmission || []).map((entry, index) => {
                    const colors = ["#10b981", "#f59e0b", "#f43f5e"];
                    return (
                      <div key={entry.name} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colors[index] }}></span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{entry.name}: {entry.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Chart 4: Assessment Performance */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-550 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <FiCheckSquare className="text-amber-500" /> Assessment Performance
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.charts?.assessmentPerformance || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Student Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 5: Daily Active Users */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-550 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <FiActivity className="text-rose-500" /> Daily Active Users
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.charts?.dailyActiveUsers || []}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="users" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" name="Active Users" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 6: Monthly Analytics */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-550 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <FiLayers className="text-sky-500" /> Monthly Analytics
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={stats?.charts?.monthlyAnalytics || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="registrations" barSize={12} fill="#3b82f6" name="Admissions" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="materials" barSize={12} fill="#0ea5e9" name="Notes Upload" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="submissions" stroke="#10b981" strokeWidth={2} name="Coding Activity" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Recent Activity Section */}
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white flex items-center gap-2">
              <FiActivity /> Live Institute Activity Roster
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* 1. Registrations */}
               <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-5 rounded-3xl shadow-sm space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-wider text-indigo-650 dark:text-indigo-400 pb-2 border-b border-slate-100 dark:border-white/5">
                   New Student Registrations
                 </h4>
                 <div className="space-y-3.5">
                   {stats?.recentActivity?.newStudents?.length > 0 ? (
                     stats.recentActivity.newStudents.map((std) => (
                       <div key={std._id} className="flex justify-between items-center text-xs">
                         <div>
                           <span className="font-bold text-slate-800 dark:text-white block">{std.fullName}</span>
                           <span className="text-[10px] text-slate-550 dark:text-slate-400 block mt-0.5">{std.email}</span>
                         </div>
                         <span className="text-[9px] font-bold text-slate-550 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 px-2.5 py-1 rounded-lg shrink-0">
                           {new Date(std.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                         </span>
                       </div>
                     ))
                   ) : (
                     <p className="text-xs text-slate-400 font-semibold py-4 text-center">No recent registrations.</p>
                   )}
                 </div>
               </div>

               {/* 2. Submissions */}
               <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-5 rounded-3xl shadow-sm space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-wider text-emerald-650 dark:text-emerald-400 pb-2 border-b border-slate-100 dark:border-white/5">
                   Assignment Submissions
                 </h4>
                 <div className="space-y-3.5">
                   {stats?.recentActivity?.submissions?.length > 0 ? (
                     stats.recentActivity.submissions.map((sub, idx) => (
                       <div key={idx} className="flex justify-between items-center text-xs">
                         <div className="min-w-0 flex-1 pr-2">
                           <span className="font-bold text-slate-800 dark:text-white block truncate">{sub.assignmentTitle}</span>
                           <span className="text-[10px] text-slate-550 dark:text-slate-400 block mt-0.5 truncate">By: {sub.studentName}</span>
                         </div>
                         <span className={`text-[8px] font-black uppercase tracking-wide border px-2 py-0.5 rounded ${
                           sub.status === 'Graded' 
                             ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                             : 'bg-amber-50 text-amber-600 border-amber-100'
                         }`}>
                           {sub.status}
                         </span>
                       </div>
                     ))
                   ) : (
                     <p className="text-xs text-slate-400 font-semibold py-4 text-center">No recent submissions.</p>
                   )}
                 </div>
               </div>

               {/* 3. Teacher Uploads */}
               <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-5 rounded-3xl shadow-sm space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-wider text-purple-650 dark:text-purple-400 pb-2 border-b border-slate-100 dark:border-white/5">
                   Teacher Uploads (Notes)
                 </h4>
                 <div className="space-y-3.5">
                   {stats?.recentActivity?.teacherUploads?.length > 0 ? (
                     stats.recentActivity.teacherUploads.map((mat) => (
                       <div key={mat._id} className="flex justify-between items-center text-xs">
                         <div className="min-w-0 flex-1 pr-2">
                           <span className="font-bold text-slate-800 dark:text-white block truncate">{mat.title}</span>
                           <span className="text-[10px] text-slate-550 dark:text-slate-400 block mt-0.5 truncate">Uploaded by: {mat.uploadedBy?.fullName || 'Mentor'}</span>
                         </div>
                         <span className="text-[9px] font-bold text-slate-550 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 px-2.5 py-1 rounded-lg shrink-0">
                           {new Date(mat.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                         </span>
                       </div>
                     ))
                   ) : (
                     <p className="text-xs text-slate-400 font-semibold py-4 text-center">No recent uploads.</p>
                   )}
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* 4. Live Classes */}
               <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-5 rounded-3xl shadow-sm space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 pb-2 border-b border-slate-100 dark:border-white/5">
                   Live Classes Created
                 </h4>
                 <div className="space-y-3.5">
                   {stats?.recentActivity?.liveClasses?.length > 0 ? (
                     stats.recentActivity.liveClasses.map((cls) => (
                       <div key={cls._id} className="flex justify-between items-center text-xs">
                         <div className="min-w-0 flex-1 pr-2">
                           <span className="font-bold text-slate-800 dark:text-white block truncate">{cls.topic}</span>
                           <span className="text-[10px] text-slate-550 dark:text-slate-400 block mt-0.5 truncate">
                             Batch: {cls.batch?.batchName} &bull; Mentor: {cls.teacher?.name}
                           </span>
                         </div>
                         <span className="text-[9px] font-bold text-slate-550 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 px-2.5 py-1 rounded-lg shrink-0">
                           {new Date(cls.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                         </span>
                       </div>
                     ))
                   ) : (
                     <p className="text-xs text-slate-400 font-semibold py-4 text-center">No live classes scheduled.</p>
                   )}
                 </div>
               </div>

               {/* 5. Notifications */}
               <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-5 rounded-3xl shadow-sm space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-wider text-rose-650 dark:text-rose-400 pb-2 border-b border-slate-100 dark:border-white/5">
                   Recent Notifications & Announcements
                 </h4>
                 <div className="space-y-3.5">
                   {stats?.recentActivity?.notifications?.length > 0 ? (
                     stats.recentActivity.notifications.map((not) => (
                       <div key={not._id} className="flex justify-between items-center text-xs">
                         <div className="min-w-0 flex-1 pr-2">
                           <span className="font-bold text-slate-800 dark:text-white block truncate">{not.title}</span>
                           <span className="text-[10px] text-slate-550 dark:text-slate-400 block mt-0.5 truncate">{not.message || not.description}</span>
                         </div>
                         <span className="text-[9px] font-bold text-slate-550 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 px-2.5 py-1 rounded-lg shrink-0">
                           {new Date(not.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                         </span>
                       </div>
                     ))
                   ) : (
                     <p className="text-xs text-slate-400 font-semibold py-4 text-center">No recent notifications.</p>
                   )}
                 </div>
               </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          
          {/* User Sub-Tabs */}
          <div className="flex border-b border-slate-200 dark:border-white/5 pb-0">
            <button
              onClick={() => setUserSubTab('students')}
              className={`pb-3 px-4 text-xs font-black border-b-2 transition-all ${userSubTab === 'students' ? 'border-emerald-600 dark:border-indigo-500 text-emerald-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              🎓 Students ({studentPagination.total})
            </button>
            <button
              onClick={() => setUserSubTab('teachers')}
              className={`pb-3 px-4 text-xs font-black border-b-2 transition-all ${userSubTab === 'teachers' ? 'border-emerald-600 dark:border-indigo-500 text-emerald-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              👩‍🏫 Teachers ({teacherPagination.total})
            </button>
            <button
              onClick={() => setUserSubTab('subadmins')}
              className={`pb-3 px-4 text-xs font-black border-b-2 transition-all ${userSubTab === 'subadmins' ? 'border-emerald-600 dark:border-indigo-500 text-emerald-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
            >
              🛡️ Admins & Sub-Admins ({subAdminsList.length})
            </button>
          </div>

          {/* Render Students List Panel */}
          {userSubTab === 'students' && (
            <div className="space-y-6">
              {/* Controls toolbar */}
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search students by roll number, name, or email..."
                    value={studentFilters.search}
                    onChange={(e) => setStudentFilters({ ...studentFilters, search: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-all font-semibold"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={studentFilters.course}
                    onChange={(e) => setStudentFilters({ ...studentFilters, course: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500"
                  >
                    <option value="">All Courses</option>
                    {coursesList.map(c => (
                      <option key={c._id} value={c._id}>{c.courseName}</option>
                    ))}
                  </select>

                  <select
                    value={studentFilters.batch}
                    onChange={(e) => setStudentFilters({ ...studentFilters, batch: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500"
                  >
                    <option value="">All Batches</option>
                    {batchesList.map(b => (
                      <option key={b._id} value={b._id}>{b.batchName}</option>
                    ))}
                  </select>

                  <select
                    value={studentFilters.status}
                    onChange={(e) => setStudentFilters({ ...studentFilters, status: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <button
                    onClick={() => {
                      setEditingStudent(null);
                      setStudentForm({ rollNumber: '', fullName: '', email: '', phone: '', address: '', course: '', batch: '', status: 'active' });
                      setShowStudentModal(true);
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                  >
                    <FiPlus /> Add Student
                  </button>

                  <button
                    onClick={() => setShowImportModal(true)}
                    className="px-4 py-2.5 bg-emerald-50 dark:bg-indigo-650/20 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                  >
                    <FiUpload /> Import CSV
                  </button>

                  <button
                    onClick={() => handleExportCSV('student')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                  >
                    <FiDownload /> Export CSV
                  </button>
                </div>
              </div>

              {/* Bulk Actions Selector (Student) */}
              {selectedStudentIds.length > 0 && (
                <div className="p-4 bg-emerald-50/50 dark:bg-indigo-950/20 border border-emerald-150 dark:border-indigo-900/30 rounded-2xl flex items-center justify-between animate-fade-in">
                  <span className="text-xs font-bold text-slate-700 dark:text-indigo-300">
                    Selected {selectedStudentIds.length} students
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => executeBulkAction('status', 'student')}
                      className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => executeBulkAction('reset-password', 'student')}
                      className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    >
                      Reset Passwords
                    </button>
                    <button
                      onClick={() => executeBulkAction('delete', 'student')}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-black"
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[10px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                      <th className="p-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={studentsList.length > 0 && selectedStudentIds.length === studentsList.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedStudentIds(studentsList.map(s => s._id));
                            else setSelectedStudentIds([]);
                          }}
                        />
                      </th>
                      <th className="p-4">Roll Number</th>
                      <th className="p-4">Student Profile</th>
                      <th className="p-4">Assigned Course</th>
                      <th className="p-4">Assigned Batch</th>
                      <th className="p-4">Account Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {studentsList.length > 0 ? (
                      studentsList.map((std) => (
                        <tr key={std._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedStudentIds.includes(std._id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedStudentIds([...selectedStudentIds, std._id]);
                                else setSelectedStudentIds(selectedStudentIds.filter(id => id !== std._id));
                              }}
                            />
                          </td>
                          <td className="p-4 font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider">{std.rollNumber}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-indigo-650/20 text-emerald-700 dark:text-indigo-400 font-black text-xs flex items-center justify-center">
                                {std.fullName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 dark:text-white text-xs block">{std.fullName}</span>
                                <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">{std.email} &bull; {std.phone || 'No phone'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                            {std.course ? std.course.courseName : <span className="text-[10px] text-slate-400 italic">None</span>}
                          </td>
                          <td className="p-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                            {std.batch ? std.batch.batchName : <span className="text-[10px] text-slate-400 italic">None</span>}
                          </td>
                          <td className="p-4">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                              std.status === 'active'
                                ? 'bg-emerald-50 text-emerald-750 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                                : std.status === 'suspended'
                                ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                                : 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-white/5'
                            }`}>
                              {std.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleStudentStatusToggle(std._id, std.status)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border transition-all ${
                                  std.status === 'active'
                                    ? 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white'
                                    : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                }`}
                                title={std.status === 'active' ? "Suspend Student" : "Activate Student"}
                              >
                                <FiX />
                              </button>
                              <button
                                onClick={() => handleStudentPasswordReset(std._id)}
                                className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-150 text-indigo-650 hover:bg-indigo-650 hover:text-white flex items-center justify-center text-xs dark:bg-indigo-900/10 dark:border-indigo-500/20 dark:text-indigo-400 dark:hover:bg-indigo-600"
                                title="Reset Student Password"
                              >
                                <FiLock />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingStudent(std);
                                  setStudentForm({
                                    rollNumber: std.rollNumber,
                                    fullName: std.fullName,
                                    email: std.email,
                                    phone: std.phone || '',
                                    address: std.address || '',
                                    course: std.course?._id || std.course || '',
                                    batch: std.batch?._id || std.batch || '',
                                    status: std.status
                                  });
                                  setShowStudentModal(true);
                                }}
                                className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-indigo-600/10 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 flex items-center justify-center text-xs hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all"
                                title="Edit Student Profile"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(std._id)}
                                className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10 dark:border-rose-500/10 flex items-center justify-center text-xs hover:bg-rose-500 hover:text-white transition-all"
                                title="Delete Student"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-500 text-xs font-semibold">
                          No students found matching current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {studentPagination.pages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <span className="text-xs text-slate-500 font-semibold">
                    Showing Page {studentPagination.page} of {studentPagination.pages} &bull; Total {studentPagination.total} Students
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={studentPagination.page === 1}
                      onClick={() => fetchStudents(studentPagination.page - 1)}
                      className="px-3.5 py-1.5 border border-slate-200 dark:border-white/5 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      Previous
                    </button>
                    <button
                      disabled={studentPagination.page === studentPagination.pages}
                      onClick={() => fetchStudents(studentPagination.page + 1)}
                      className="px-3.5 py-1.5 border border-slate-200 dark:border-white/5 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Render Teachers List Panel */}
          {userSubTab === 'teachers' && (
            <div className="space-y-6">
              {/* Controls toolbar */}
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search teachers by name or email..."
                    value={teacherFilters.search}
                    onChange={(e) => setTeacherFilters({ ...teacherFilters, search: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-all font-semibold"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    placeholder="Filter by Subject..."
                    value={teacherFilters.subject}
                    onChange={(e) => setTeacherFilters({ ...teacherFilters, subject: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                  />

                  <select
                    value={teacherFilters.status}
                    onChange={(e) => setTeacherFilters({ ...teacherFilters, status: e.target.value })}
                    className="bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>

                  <button
                    onClick={() => {
                      setEditingTeacher(null);
                      setTeacherForm({ name: '', email: '', phone: '', subject: '', subjects: '', qualification: '', experience: '', salary: 0, status: 'active' });
                      setShowTeacherModal(true);
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                  >
                    <FiPlus /> Add Teacher
                  </button>

                  <button
                    onClick={() => handleExportCSV('teacher')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                  >
                    <FiDownload /> Export CSV
                  </button>
                </div>
              </div>

              {/* Bulk Actions Selector (Teacher) */}
              {selectedTeacherIds.length > 0 && (
                <div className="p-4 bg-emerald-50/50 dark:bg-indigo-950/20 border border-emerald-150 dark:border-indigo-900/30 rounded-2xl flex items-center justify-between animate-fade-in">
                  <span className="text-xs font-bold text-slate-700 dark:text-indigo-300">
                    Selected {selectedTeacherIds.length} teachers
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => executeBulkAction('status', 'teacher')}
                      className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => executeBulkAction('reset-password', 'teacher')}
                      className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    >
                      Reset Passwords
                    </button>
                    <button
                      onClick={() => executeBulkAction('delete', 'teacher')}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-black"
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[10px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                      <th className="p-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={teachersList.length > 0 && selectedTeacherIds.length === teachersList.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedTeacherIds(teachersList.map(t => t._id));
                            else setSelectedTeacherIds([]);
                          }}
                        />
                      </th>
                      <th className="p-4">Teacher Profile</th>
                      <th className="p-4">Subjects List</th>
                      <th className="p-4">Assigned Batches</th>
                      <th className="p-4">Joining Details</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {teachersList.length > 0 ? (
                      teachersList.map((tea) => (
                        <tr key={tea._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedTeacherIds.includes(tea._id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedTeacherIds([...selectedTeacherIds, tea._id]);
                                else setSelectedTeacherIds(selectedTeacherIds.filter(id => id !== tea._id));
                              }}
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 font-black text-xs flex items-center justify-center">
                                {tea.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 dark:text-white text-xs block">{tea.name}</span>
                                <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">{tea.email} &bull; {tea.phone || 'No phone'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {tea.subjects && tea.subjects.length > 0 ? (
                                tea.subjects.map((sub, i) => (
                                  <span key={i} className="text-[9px] font-bold text-slate-700 dark:text-slate-350 bg-slate-150 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200/50 dark:border-white/5">
                                    {sub}
                                  </span>
                                ))
                              ) : tea.subject ? (
                                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-350 bg-slate-150 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200/50 dark:border-white/5">
                                  {tea.subject}
                                </span>
                              ) : (
                                <span className="text-[9px] text-slate-400 italic">None</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {tea.batches && tea.batches.length > 0 ? (
                                tea.batches.map((bat, i) => (
                                  <span key={i} className="text-[9px] font-bold text-indigo-750 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/20">
                                    {bat.batchName || bat}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[9px] text-slate-400 italic">Unassigned</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] text-slate-750 dark:text-slate-350 font-bold block">Qual: {tea.qualification || 'N/A'}</span>
                            <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Salary: ₹{tea.salary?.toLocaleString() || 0}</span>
                          </td>
                          <td className="p-4">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                              tea.status === 'active'
                                ? 'bg-emerald-50 text-emerald-750 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                                : 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-white/5'
                            }`}>
                              {tea.status || 'active'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleTeacherStatusToggle(tea._id, tea.status || 'active')}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border transition-all ${
                                  (tea.status || 'active') === 'active'
                                    ? 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white'
                                    : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                }`}
                                title={(tea.status || 'active') === 'active' ? "Deactivate Teacher" : "Activate Teacher"}
                              >
                                <FiX />
                              </button>
                              <button
                                onClick={() => {
                                  setAssigningTeacherId(tea._id);
                                  setAssignTeacherForm({
                                    subjects: tea.subjects ? tea.subjects.join(', ') : tea.subject || '',
                                    batches: tea.batches ? tea.batches.map(b => b._id || b) : []
                                  });
                                  setShowAssignTeacherModal(true);
                                }}
                                className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-150 text-indigo-650 hover:bg-indigo-650 hover:text-white flex items-center justify-center text-xs dark:bg-indigo-900/10 dark:border-indigo-500/20 dark:text-indigo-400 dark:hover:bg-indigo-600"
                                title="Assign Batches & Subjects"
                              >
                                <FiLayers />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingTeacher(tea);
                                  setTeacherForm({
                                    name: tea.name,
                                    email: tea.email,
                                    phone: tea.phone || '',
                                    subject: tea.subject || '',
                                    subjects: tea.subjects ? tea.subjects.join(', ') : tea.subject || '',
                                    qualification: tea.qualification || '',
                                    experience: tea.experience || '',
                                    salary: tea.salary || 0,
                                    status: tea.status || 'active'
                                  });
                                  setShowTeacherModal(true);
                                }}
                                className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-indigo-600/10 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 flex items-center justify-center text-xs hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all"
                                title="Edit Teacher Profile"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteTeacher(tea._id)}
                                className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10 dark:border-rose-500/10 flex items-center justify-center text-xs hover:bg-rose-500 hover:text-white transition-all"
                                title="Delete Teacher"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-500 text-xs font-semibold">
                          No teachers found matching current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {teacherPagination.pages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <span className="text-xs text-slate-500 font-semibold">
                    Showing Page {teacherPagination.page} of {teacherPagination.pages} &bull; Total {teacherPagination.total} Teachers
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={teacherPagination.page === 1}
                      onClick={() => fetchTeachers(teacherPagination.page - 1)}
                      className="px-3.5 py-1.5 border border-slate-200 dark:border-white/5 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      Previous
                    </button>
                    <button
                      disabled={teacherPagination.page === teacherPagination.pages}
                      onClick={() => fetchTeachers(teacherPagination.page + 1)}
                      className="px-3.5 py-1.5 border border-slate-200 dark:border-white/5 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Render Admins Panel */}
          {userSubTab === 'subadmins' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase text-slate-550 dark:text-slate-400 tracking-wider">Sub-Administrators Control List</h3>
                <button
                  onClick={() => {
                    setEditingSubAdmin(null);
                    setSubAdminForm({ fullName: '', email: '', password: '', phone: '', permissions: [] });
                    setShowSubAdminModal(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                >
                  <FiPlus /> Create Sub-Admin
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[10px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                      <th className="p-4">Admin Profile</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Assigned Permissions</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {subAdminsList.length > 0 ? (
                      subAdminsList.map((adm) => (
                        <tr key={adm._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 font-black text-xs flex items-center justify-center border border-slate-250/60 dark:border-white/5">
                                <FiShield />
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 dark:text-white text-xs block">{adm.fullName}</span>
                                <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">{adm.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs font-bold text-slate-750 dark:text-slate-350">{adm.phone || 'No phone'}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {adm.permissions && adm.permissions.length > 0 ? (
                                adm.permissions.map((perm, i) => (
                                  <span key={i} className="text-[9px] font-black uppercase text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2.5 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/20">
                                    {perm.replace('manage_', '')}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[9px] text-rose-500 font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/20 px-2 py-0.5 rounded">No privileges</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                              adm.status === 'active'
                                ? 'bg-emerald-50 text-emerald-750 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                                : 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-white/5'
                            }`}>
                              {adm.status || 'active'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingSubAdmin(adm);
                                  setSubAdminForm({
                                    fullName: adm.fullName,
                                    email: adm.email,
                                    password: '',
                                    phone: adm.phone || '',
                                    permissions: adm.permissions || [],
                                    status: adm.status || 'active'
                                  });
                                  setShowSubAdminModal(true);
                                }}
                                className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-indigo-600/10 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 flex items-center justify-center text-xs hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all"
                                title="Edit sub-admin details / permissions"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteSubAdmin(adm._id)}
                                className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10 dark:border-rose-500/10 flex items-center justify-center text-xs hover:bg-rose-500 hover:text-white transition-all"
                                title="Delete Admin"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500 text-xs font-semibold">
                          No sub-administrators currently defined.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'domains' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">Domain Specializations</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Overview of registered learning pathways inside CodeWave Solution</p>
            </div>
            <button
              onClick={() => setShowDomainModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2"
            >
              <FiPlus /> Add Domain
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {domains.map((dom) => (
              <div key={dom._id} className="bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-black text-slate-800 dark:text-white text-sm">{dom.name}</h4>
                    <span className="text-[8px] font-black text-emerald-700 dark:text-indigo-400 uppercase tracking-widest bg-emerald-50 dark:bg-indigo-950 border border-emerald-200 dark:border-indigo-900 px-2 py-0.5 rounded-full">{dom.slug}</span>
                  </div>
                  <p className="text-slate-650 dark:text-slate-400 text-xs leading-relaxed mt-2 line-clamp-3">{dom.shortDescription}</p>
                  {dom.certificationLink && (
                    <div className="mt-3 truncate">
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 block">CERTIFICATION LINK:</span>
                      <a href={dom.certificationLink} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 dark:text-indigo-400 hover:underline">
                        {dom.certificationLink}
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex justify-between items-center text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                  <div className="flex gap-1.5">
                    <span className="bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">⏳ {dom.estimatedDuration || '4-6 months'}</span>
                    <span className="bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">🔥 {dom.difficultyLevel || 'Intermediate'}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingDomain(dom)}
                      className="px-2.5 py-1 bg-emerald-50 dark:bg-indigo-600/10 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 rounded-lg hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
                    >
                      <FiEdit size={10} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDomain(dom._id)}
                      className="px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-550/10 dark:border-rose-500/10 rounded-lg hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1"
                    >
                      <FiTrash2 size={10} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">Topic Video & Documentation Links</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Edit lecture videos and study guide documentation for each topic</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filter Domain:</span>
              <select
                value={selectedDomainForTopics}
                onChange={(e) => setSelectedDomainForTopics(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500"
              >
                <option value="">Select Domain...</option>
                {domains.map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedDomainForTopics ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[10px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                    <th className="p-4">Topic Title</th>
                    <th className="p-4">YouTube Video Link</th>
                    <th className="p-4">GFG/Doc Link</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {topics.filter(t => (t.domainId?._id || t.domainId) === selectedDomainForTopics).length > 0 ? (
                    topics.filter(t => (t.domainId?._id || t.domainId) === selectedDomainForTopics).map((t) => (
                      <tr key={t._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-slate-800 dark:text-white text-xs block">{t.title}</span>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Order: {t.order} • {t.difficulty}</span>
                        </td>
                        <td className="p-4">
                          {t.youtubeLink ? (
                            <a href={t.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-650 dark:text-indigo-400 hover:underline truncate block max-w-xs">
                              {t.youtubeLink}
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 dark:text-slate-650 italic">No Video Link</span>
                          )}
                        </td>
                        <td className="p-4">
                          {t.gfgLink ? (
                            <a href={t.gfgLink} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-605 dark:text-emerald-400 hover:underline truncate block max-w-xs">
                              {t.gfgLink}
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 dark:text-slate-650 italic">No Doc Link</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setEditingTopic(t)}
                            className="px-3 py-1.5 bg-emerald-50 dark:bg-indigo-600/10 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 rounded-lg text-[10px] font-black hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-1"
                          >
                            <FiVideo size={10} /> Edit Video & Docs
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500 text-xs font-semibold">
                        No topics found for this domain path.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 dark:text-slate-550 text-xs font-black bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-white/5">
              Please select a domain specialization path from the filter dropdown to view and edit topics.
            </div>
          )}
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">Milestone Assessments</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Manage and assign diagnostic tests / validation assessments to specific domains</p>
            </div>
            <button
              onClick={() => {
                if (domains.length === 0) {
                  toast.error("Please add a domain specialization path first!");
                  return;
                }
                setNewAssessment({
                  ...newAssessment,
                  domainId: domains[0]._id
                });
                setShowAssessmentModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2"
            >
              <FiPlus /> Assign Assessment
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((a) => {
              const domain = domains.find(d => d._id === (a.domainId?._id || a.domainId));
              return (
                <div key={a._id} className="bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-black text-slate-800 dark:text-white text-sm">{a.title}</h4>
                      <span className="text-[8px] font-black text-emerald-700 dark:text-indigo-400 uppercase tracking-widest bg-emerald-50 dark:bg-indigo-950 border border-emerald-200 dark:border-indigo-900 px-2 py-0.5 rounded-full">{a.platform}</span>
                    </div>
                    <p className="text-slate-650 dark:text-slate-400 text-xs leading-relaxed mt-2 line-clamp-3">{a.description || "No description provided."}</p>
                    <div className="mt-3">
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 block">TARGET DOMAIN:</span>
                      <span className="text-xs font-bold text-emerald-700 dark:text-indigo-300">{domain ? domain.name : 'All Specializations'}</span>
                    </div>
                    <div className="mt-3 truncate">
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 block">TEST URL:</span>
                      <a href={a.assessmentLink} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 dark:text-indigo-400 hover:underline">
                        {a.assessmentLink}
                      </a>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex justify-between items-center text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                    <span className="text-slate-700 dark:text-slate-300">🎯 Pass: {a.passingScore}%</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingAssessment(a)}
                        className="px-2.5 py-1 bg-emerald-50 dark:bg-indigo-600/10 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 rounded-lg hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAssessment(a._id)}
                        className="px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-550/10 dark:border-rose-500/10 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {assessments.length === 0 && (
              <div className="col-span-3 p-12 text-center text-slate-500 dark:text-slate-550 text-xs font-black bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-white/5">
                No milestone assessments assigned yet. Click "Assign Assessment" to begin!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Course, Subject, and Batch Management Panel */}
      {activeTab === 'courses_batches' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">Curriculums & Batches</h3>
              <p className="text-slate-550 dark:text-slate-400 text-xs mt-0.5">Manage courses, batches, academic sessions, and member allocations</p>
            </div>
            
            <div className="flex gap-2 bg-slate-100/80 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-200/60 dark:border-white/5">
              <button
                onClick={() => setCourseSubTab('courses')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${courseSubTab === 'courses' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
              >
                🏫 Courses
              </button>
              <button
                onClick={() => setCourseSubTab('subjects')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${courseSubTab === 'subjects' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
              >
                📚 Academic Subjects
              </button>
              <button
                onClick={() => setCourseSubTab('batches')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${courseSubTab === 'batches' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
              >
                👥 Batches
              </button>
              <button
                onClick={() => setCourseSubTab('allocations')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${courseSubTab === 'allocations' ? 'bg-emerald-600 dark:bg-indigo-600 text-white shadow-sm' : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
              >
                👥 Allocations & Schedules
              </button>
            </div>
          </div>

          {courseSubTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-slate-505 dark:text-slate-400 tracking-wider">Courses Catalog</h4>
                {hasPermission('manage_courses') && (
                  <button
                    onClick={() => {
                      setEditingCourse(null);
                      setCourseForm({ courseName: '', description: '', duration: '', fees: 0, subjects: [] });
                      setShowCourseModal(true);
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                  >
                    <FiPlus /> Add Course
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesList.map((course) => (
                  <div key={course._id} className="bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h5 className="font-black text-slate-800 dark:text-white text-sm flex items-center gap-2">
                          <FiBookOpen className="text-emerald-650 dark:text-indigo-400" /> {course.courseName}
                        </h5>
                        <span className="text-[10px] font-black text-slate-650 dark:text-slate-350 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 px-2.5 py-0.5 rounded-full shrink-0">
                          {course.duration}
                        </span>
                      </div>
                      <p className="text-slate-650 dark:text-slate-450 text-xs leading-relaxed mt-2 line-clamp-3">
                        {course.description || "No description provided."}
                      </p>
                      
                      {/* Linked Subjects list */}
                      <div className="mt-4">
                        <span className="text-[10px] font-black text-slate-550 dark:text-slate-400 block mb-1.5 uppercase">Linked Subjects:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {course.subjects && course.subjects.length > 0 ? (
                            course.subjects.map(s => (
                              <span key={s._id} className="text-[9px] bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 px-2 py-0.5 rounded text-slate-750 dark:text-slate-300 font-bold">
                                {s.subjectName} ({s.subjectCode})
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-405 italic">No subjects linked.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex justify-between items-center text-xs">
                      <span className="font-black text-emerald-650 dark:text-indigo-400 text-sm">
                        ₹{course.fees?.toLocaleString()}
                      </span>
                      {hasPermission('manage_courses') && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCourse(course);
                              setCourseForm({
                                courseName: course.courseName,
                                description: course.description || '',
                                duration: course.duration,
                                fees: course.fees,
                                subjects: course.subjects ? course.subjects.map(s => s._id || s) : []
                              });
                              setShowCourseModal(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-50 dark:bg-indigo-650/20 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 rounded-lg hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all text-[11px] font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-550/10 dark:border-rose-500/10 rounded-lg hover:bg-rose-500 hover:text-white transition-all text-[11px] font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {coursesList.length === 0 && (
                  <div className="col-span-3 p-12 text-center text-slate-500 dark:text-slate-550 text-xs font-black bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-white/5">
                    No courses available yet. Click "Add Course" to create one.
                  </div>
                )}
              </div>
            </div>
          )}

          {courseSubTab === 'subjects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-slate-550 dark:text-slate-400 tracking-wider">Academic Subjects Catalog</h4>
                {hasPermission('manage_courses') && (
                  <button
                    onClick={() => {
                      setEditingSubject(null);
                      setSubjectForm({ subjectName: '', subjectCode: '', description: '' });
                      setShowSubjectModal(true);
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                  >
                    <FiPlus /> Add Subject
                  </button>
                )}
              </div>

              {/* Subjects Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[10px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                      <th className="p-4">Subject Code</th>
                      <th className="p-4">Subject Name</th>
                      <th className="p-4">Description</th>
                      {hasPermission('manage_courses') && <th className="p-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                    {subjectsList.length > 0 ? (
                      subjectsList.map((sub) => (
                        <tr key={sub._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="p-4 font-bold text-slate-800 dark:text-white uppercase tracking-wider">{sub.subjectCode}</td>
                          <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{sub.subjectName}</td>
                          <td className="p-4 text-slate-650 dark:text-slate-400 font-medium">{sub.description || "N/A"}</td>
                          {hasPermission('manage_courses') && (
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingSubject(sub);
                                    setSubjectForm({
                                      subjectName: sub.subjectName,
                                      subjectCode: sub.subjectCode,
                                      description: sub.description || ''
                                    });
                                    setShowSubjectModal(true);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-indigo-650/20 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 flex items-center justify-center hover:bg-emerald-650 dark:hover:bg-indigo-600 hover:text-white transition-all"
                                  title="Edit Subject"
                                >
                                  <FiEdit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubject(sub._id)}
                                  className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/10 dark:border-rose-500/10 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                                  title="Delete Subject"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={hasPermission('manage_courses') ? 4 : 3} className="p-8 text-center text-slate-500 text-xs font-semibold">
                          No subjects available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {courseSubTab === 'batches' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black uppercase text-slate-550 dark:text-slate-400 tracking-wider">Academic Batches</h4>
                {hasPermission('manage_courses') && (
                  <button
                    onClick={() => {
                      setEditingBatch(null);
                      setBatchForm({
                        batchName: '',
                        startDate: '',
                        endDate: '',
                        timing: '',
                        capacity: 30,
                        academicSession: '2026-2027',
                        status: 'active',
                        course: coursesList.length > 0 ? coursesList[0]._id : '',
                        teachers: [],
                        subjects: []
                      });
                      setShowBatchModal(true);
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                  >
                    <FiPlus /> Add Batch
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {batchesList.map((batch) => {
                  const studentCount = batch.students ? batch.students.length : 0;
                  const capacity = batch.capacity || 30;
                  const occupancyPercent = Math.min(100, Math.round((studentCount / capacity) * 100));
                  
                  // progress bar color
                  let progressColor = "bg-emerald-500";
                  if (occupancyPercent >= 90) progressColor = "bg-rose-500 animate-pulse";
                  else if (occupancyPercent >= 70) progressColor = "bg-amber-500";

                  // status pill color
                  let statusPillClass = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/30";
                  if (batch.status === 'upcoming') statusPillClass = "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-900/30";
                  else if (batch.status === 'completed') statusPillClass = "bg-slate-50 text-slate-650 border-slate-100 dark:bg-slate-900 dark:text-slate-450 dark:border-white/5";
                  else if (batch.status === 'cancelled') statusPillClass = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-455 dark:border-rose-900/30";

                  return (
                    <div key={batch._id} className="bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h5 className="font-black text-slate-800 dark:text-white text-sm flex items-center gap-2">
                              <FiLayers className="text-indigo-650 dark:text-indigo-400" /> {batch.batchName}
                            </h5>
                            <span className="text-[10px] text-slate-550 font-bold block mt-1">
                              Course: {batch.course ? batch.course.courseName : <span className="italic text-slate-405">None</span>}
                            </span>
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${statusPillClass}`}>
                            {batch.status}
                          </span>
                        </div>

                        {/* Batch Details */}
                        <div className="grid grid-cols-2 gap-4 mt-4 text-[11px] font-bold text-slate-650 dark:text-slate-450">
                          <div className="flex items-center gap-1.5">
                            <FiClock className="text-slate-400 shrink-0" /> {batch.timing}
                          </div>
                          <div>
                            📅 Session: {batch.academicSession}
                          </div>
                          <div>
                            🏁 Starts: {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'N/A'}
                          </div>
                          <div>
                            {batch.endDate && `🏁 Ends: ${new Date(batch.endDate).toLocaleDateString()}`}
                          </div>
                        </div>

                        {/* Capacity Progress Bar */}
                        <div className="mt-4 space-y-1.5">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <span>Occupancy ({studentCount} / {capacity})</span>
                            <span>{occupancyPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-200/50 dark:border-white/5">
                            <div className={`h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${occupancyPercent}%` }}></div>
                          </div>
                          {studentCount >= capacity && (
                            <span className="text-[9px] font-black text-rose-550 uppercase tracking-widest block bg-rose-500/5 border border-rose-500/10 p-1.5 rounded-lg text-center">
                              ⚠️ Warning: Batch is at maximum capacity
                            </span>
                          )}
                        </div>

                        {/* Teachers Roster */}
                        <div className="mt-4 border-t border-slate-100 dark:border-white/5 pt-3">
                          <span className="text-[10px] font-black text-slate-550 dark:text-slate-400 block mb-1.5 uppercase">Instructors Roster:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {batch.teachers && batch.teachers.length > 0 ? (
                              batch.teachers.map(t => (
                                <span key={t._id} className="text-[9px] bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/20 px-2 py-0.5 rounded font-bold">
                                  {t.name}
                                </span>
                              ))
                            ) : batch.assignedTeacher ? (
                              <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/20 px-2 py-0.5 rounded font-bold">
                                {batch.assignedTeacher.name || batch.assignedTeacher}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-405 italic">No instructors assigned.</span>
                            )}
                          </div>
                        </div>

                        {/* Batch Subjects */}
                        <div className="mt-3 border-t border-slate-100 dark:border-white/5 pt-3">
                          <span className="text-[10px] font-black text-slate-550 dark:text-slate-400 block mb-1.5 uppercase">Batch Subjects:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {batch.subjects && batch.subjects.length > 0 ? (
                              batch.subjects.map(s => (
                                <span key={s._id} className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-indigo-900/20 px-2 py-0.5 rounded font-bold">
                                  {s.subjectName}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-405 italic">No subjects assigned.</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex flex-wrap justify-between items-center gap-2">
                        {hasPermission('manage_courses') ? (
                          <>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openAllocateStudentsModal(batch)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black transition-all flex items-center gap-1"
                              >
                                👥 Students
                              </button>
                              <button
                                onClick={() => openAllocateSubjectsModal(batch)}
                                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-black transition-all flex items-center gap-1"
                              >
                                📚 Subjects
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingBatch(batch);
                                  setBatchForm({
                                    batchName: batch.batchName,
                                    startDate: formatDateForInput(batch.startDate),
                                    endDate: formatDateForInput(batch.endDate),
                                    timing: batch.timing,
                                    capacity: batch.capacity,
                                    academicSession: batch.academicSession,
                                    status: batch.status,
                                    course: batch.course?._id || batch.course || '',
                                    teachers: batch.teachers ? batch.teachers.map(t => t._id || t) : [],
                                    subjects: batch.subjects ? batch.subjects.map(s => s._id || s) : []
                                  });
                                  setShowBatchModal(true);
                                }}
                                className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-indigo-650/20 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 flex items-center justify-center hover:bg-emerald-655 dark:hover:bg-indigo-600 hover:text-white transition-all text-xs"
                                title="Edit Batch"
                              >
                                <FiEdit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteBatch(batch._id)}
                                className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-455 border border-rose-500/10 dark:border-rose-500/10 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all text-xs"
                                title="Delete Batch"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-405 italic">Viewing only. No administrative permissions.</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {batchesList.length === 0 && (
                  <div className="col-span-2 p-12 text-center text-slate-500 dark:text-slate-550 text-xs font-black bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-white/5">
                    No batches defined yet. Click "Add Batch" to create one.
                  </div>
                )}
              </div>
            </div>
          )}

          {courseSubTab === 'allocations' && (
            <AdminAllocationHub />
          )}
        </div>
      )}

      {/* Cloud Credit Claims Tab Panel */}
      {activeTab === 'claims' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6 animate-in fade-in duration-300">
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">Cloud Credit Claims</h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs mt-0.5">Manage student requests for cloud credits and premium developer tools</p>
          </div>

          {claimsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[10px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                    <th className="p-4">Student</th>
                    <th className="p-4">Perk / Resource</th>
                    <th className="p-4">Requested Value</th>
                    <th className="p-4">Voucher Code</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                  {claims.length > 0 ? (
                    claims.map((claim) => (
                      <tr key={claim._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="p-4 font-semibold text-slate-800 dark:text-white">
                          <div>{claim.user?.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{claim.user?.email}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold">{claim.cloudCredit?.title}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{claim.cloudCredit?.platform}</div>
                        </td>
                        <td className="p-4 font-mono font-bold text-indigo-650 dark:text-indigo-400">
                          ${claim.amount}
                        </td>
                        <td className="p-4 font-mono">
                          {claim.status === 'approved' ? (
                            <span className="bg-slate-105 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/5 font-black text-indigo-505">
                              {claim.voucherCode}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">Not Approved Yet</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                            claim.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-750 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                              : claim.status === 'rejected'
                              ? 'bg-rose-50 text-rose-750 border-rose-100 dark:bg-rose-950/20 dark:text-rose-455 dark:border-rose-900/30'
                              : 'bg-amber-50 text-amber-750 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                          }`}>
                            {claim.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {claim.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={async () => {
                                  const customVoucher = prompt("Assign custom Voucher Code (Leave blank to generate automatically):", claim.voucherCode);
                                  const payload = { status: 'approved' };
                                  if (customVoucher) payload.voucherCode = customVoucher;
                                  
                                  const loadingToast = toast.loading("Approving claim...");
                                  try {
                                    await api.put(`/cloud-credits/admin/claims/${claim._id}`, payload);
                                    toast.success("Claim approved successfully!", { id: loadingToast });
                                    fetchClaims();
                                  } catch (err) {
                                    toast.error("Failed to approve claim", { id: loadingToast });
                                  }
                                }}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black transition-all"
                              >
                                Approve
                              </button>
                              <button
                                onClick={async () => {
                                  if (!window.confirm("Are you sure you want to reject this claim?")) return;
                                  const loadingToast = toast.loading("Rejecting claim...");
                                  try {
                                    await api.put(`/cloud-credits/admin/claims/${claim._id}`, { status: 'rejected' });
                                    toast.success("Claim rejected successfully!", { id: loadingToast });
                                    fetchClaims();
                                  } catch (err) {
                                    toast.error("Failed to reject claim", { id: loadingToast });
                                  }
                                }}
                                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-black transition-all"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic font-semibold">No actions needed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500 text-xs font-semibold">
                        No credit claims found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* User Analytics Panel */}
      {activeTab === 'activity' && (
        <AdminUserActivity />
      )}

      {/* Leaderboard Panel */}
      {activeTab === 'leaderboard' && (
        <AdminLeaderboard />
      )}

      {/* Institute Settings Panel */}
      {activeTab === 'settings' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">Centralized Settings Panel</h3>
              <p className="text-xs text-slate-550 mt-1">Configure global application options, academic parameters, safety lockouts, roles, and SMTP servers.</p>
            </div>
            {hasPermission('manage_settings') && ['profile', 'academic', 'security', 'storage', 'smtp', 'alerts', 'system'].includes(settingsSubTab) ? (
              <button
                type="button"
                onClick={() => handleSaveSettings()}
                className="px-5 py-2.5 bg-emerald-605 hover:bg-emerald-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 dark:shadow-indigo-650/20 transition-all flex items-center gap-2"
              >
                💾 Save Settings ({settingsSubTab.toUpperCase()})
              </button>
            ) : (
              <span className="text-[10px] text-slate-405 italic bg-slate-105 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-white/5">Viewing only. Updates are saved automatically or require settings authorization.</span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Sub-tabs */}
            <div className="flex lg:flex-col flex-row flex-wrap gap-1.5 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0">
              {[
                { id: 'profile', label: '🏢 Profile Settings', desc: 'Institute details & branding' },
                { id: 'academic', label: '🏫 Academic Config', desc: 'Working days, rules & holidays' },
                { id: 'security', label: '🔒 Auth & Security', desc: 'Password strength & lockout' },
                { id: 'storage', label: '💾 Storage Allocations', desc: 'Upload sizes & cleaner' },
                { id: 'smtp', label: '✉️ SMTP Configuration', desc: 'Mail servers & tester' },
                { id: 'alerts', label: '🔔 Alerts & Notifications', desc: 'Email, Push & System triggers' },
                { id: 'system', label: '⚙️ System Preferences', desc: 'Maintenance mode & flags' },
                { id: 'permissions', label: '🛡️ Admin Permissions', desc: 'Configure roles & capabilities' },
                { id: 'audit', label: '📋 System Audit Logs', desc: 'Trace administrative actions' },
                { id: 'sessions', label: '💻 Session Management', desc: 'Active logins & terminations' },
                { id: 'features', label: '🔒 Feature Management', desc: 'Lock or enable platform features' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSettingsSubTab(tab.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all border ${
                    settingsSubTab === tab.id
                      ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm'
                      : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <div className="text-xs font-black">{tab.label}</div>
                  <div className="text-[9px] font-medium opacity-70 mt-0.5 hidden lg:block">{tab.desc}</div>
                </button>
              ))}
            </div>

            {/* Sub-tab Content Area */}
            <div className="lg:col-span-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-white/5 rounded-2xl p-6">
              
              {/* 1. Profile Settings */}
              {settingsSubTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 dark:border-white/5 pb-3">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">Profile Settings</h4>
                    <p className="text-[10px] text-slate-500">Configure public contact details, brand address, and social links.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Institute Name</label>
                      <input
                        type="text"
                        value={settingsForm.name || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Institute Logo URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settingsForm.logo || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logo: e.target.value })}
                          placeholder="https://example.com/logo.png"
                          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        />
                        {settingsForm.logo && (
                          <img src={settingsForm.logo} alt="Preview" className="w-10 h-10 object-contain rounded-lg border dark:border-white/5 bg-slate-100" />
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Institute Physical Address</label>
                      <input
                        type="text"
                        value={settingsForm.address || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Contact Number</label>
                      <input
                        type="text"
                        value={settingsForm.contactDetails?.phone || ''}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm,
                          contactDetails: { ...settingsForm.contactDetails, phone: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Support Email</label>
                      <input
                        type="email"
                        value={settingsForm.contactDetails?.email || ''}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm,
                          contactDetails: { ...settingsForm.contactDetails, email: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Website URL</label>
                      <input
                        type="url"
                        value={settingsForm.contactDetails?.website || ''}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm,
                          contactDetails: { ...settingsForm.contactDetails, website: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Time Zone</label>
                      <select
                        value={settingsForm.timezone || 'Asia/Kolkata'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, timezone: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="UTC">UTC / Coordinated Time</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Social Media Links</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['facebook', 'twitter', 'linkedin', 'instagram'].map((platform) => (
                        <div key={platform}>
                          <label className="text-[9px] font-bold text-slate-400 block mb-1 capitalize">{platform}</label>
                          <input
                            type="url"
                            value={settingsForm.socialMediaLinks?.[platform] || ''}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              socialMediaLinks: { ...settingsForm.socialMediaLinks, [platform]: e.target.value }
                            })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Theme & Localization Preferences</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Language</label>
                        <select
                          value={settingsForm.language || 'en'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, language: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        >
                          <option value="en">English (US)</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="hi">हिन्दी</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Primary Color</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={settingsForm.themeSettings?.primaryColor || '#0284c7'}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              themeSettings: { ...settingsForm.themeSettings, primaryColor: e.target.value }
                            })}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-xs font-mono font-medium">{settingsForm.themeSettings?.primaryColor || '#0284c7'}</span>
                        </div>
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.themeSettings?.darkMode ?? true}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              themeSettings: { ...settingsForm.themeSettings, darkMode: e.target.checked }
                            })}
                            className="rounded accent-emerald-600 dark:accent-indigo-500"
                          />
                          <span>Default Dark Mode Theme</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Academic Configuration */}
              {settingsSubTab === 'academic' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 dark:border-white/5 pb-3">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">Academic Configuration</h4>
                    <p className="text-[10px] text-slate-500">Define session start/end timelines, operating days, holidays, and curriculum policies.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Academic Year</label>
                      <input
                        type="text"
                        value={settingsForm.academicYear || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, academicYear: e.target.value })}
                        placeholder="e.g. 2026-2027"
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Session Start Date</label>
                      <input
                        type="date"
                        value={settingsForm.sessionStartDate || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, sessionStartDate: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Session End Date</label>
                      <input
                        type="date"
                        value={settingsForm.sessionEndDate || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, sessionEndDate: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-2.5">Working Days Selection</h5>
                    <div className="flex flex-wrap gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                        const isWorking = (settingsForm.workingDays || []).includes(day);
                        return (
                          <button
                            type="button"
                            key={day}
                            onClick={() => toggleWorkingDay(day)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              isWorking
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-500'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Attendance Policies</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Min Required Attendance (%)</label>
                          <input
                            type="number"
                            min="50"
                            max="100"
                            value={settingsForm.attendanceRules?.minAttendancePercentage || 75}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              attendanceRules: { ...settingsForm.attendanceRules, minAttendancePercentage: parseInt(e.target.value) || 75 }
                            })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settingsForm.attendanceRules?.enableAttendancePenalty || false}
                              onChange={(e) => setSettingsForm({
                                ...settingsForm,
                                attendanceRules: { ...settingsForm.attendanceRules, enableAttendancePenalty: e.target.checked }
                              })}
                              className="rounded accent-indigo-500"
                            />
                            <span>Enable Penalty</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Grading & Rules</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Passing Grade Score (%)</label>
                          <input
                            type="number"
                            min="30"
                            max="100"
                            value={settingsForm.passingPercentage || 40}
                            onChange={(e) => setSettingsForm({ ...settingsForm, passingPercentage: parseInt(e.target.value) || 40 })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Standard Course Duration (mths)</label>
                          <input
                            type="number"
                            min="1"
                            value={settingsForm.courseDuration || 6}
                            onChange={(e) => setSettingsForm({ ...settingsForm, courseDuration: parseInt(e.target.value) || 6 })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Assignment Rules</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settingsForm.assignmentSubmissionRules?.allowLateSubmission ?? true}
                              onChange={(e) => setSettingsForm({
                                ...settingsForm,
                                assignmentSubmissionRules: { ...settingsForm.assignmentSubmissionRules, allowLateSubmission: e.target.checked }
                              })}
                              className="rounded accent-indigo-500"
                            />
                            <span>Allow Late Submission</span>
                          </label>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Late Penalty %</label>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={settingsForm.assignmentSubmissionRules?.latePenaltyPercentage || 10}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              assignmentSubmissionRules: { ...settingsForm.assignmentSubmissionRules, latePenaltyPercentage: parseInt(e.target.value) || 10 }
                            })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Assessment Policies</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Duration (minutes)</label>
                          <input
                            type="number"
                            min="10"
                            value={settingsForm.assessmentConfiguration?.durationMinutes || 60}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              assessmentConfiguration: { ...settingsForm.assessmentConfiguration, durationMinutes: parseInt(e.target.value) || 60 }
                            })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Max Attempts Allowed</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={settingsForm.assessmentConfiguration?.maxAttempts || 3}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              assessmentConfiguration: { ...settingsForm.assessmentConfiguration, maxAttempts: parseInt(e.target.value) || 3 }
                            })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Holidays Subpanel */}
                  <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Holiday Calendar</h5>
                    <div className="flex flex-col md:flex-row gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Holiday name (e.g. Christmas)"
                        value={newHoliday.name}
                        onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                        className="w-full md:w-1/2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                      <input
                        type="date"
                        value={newHoliday.date}
                        onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                        className="w-full md:w-1/3 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={addHoliday}
                        className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                      >
                        Add Holiday
                      </button>
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto border dark:border-white/5 rounded-xl bg-white dark:bg-slate-900/30">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-105 dark:bg-slate-900 text-slate-500 uppercase tracking-widest text-[9px] font-bold">
                          <tr>
                            <th className="px-4 py-2.5">Holiday</th>
                            <th className="px-4 py-2.5">Date</th>
                            <th className="px-4 py-2.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150 dark:divide-white/5">
                          {(settingsForm.holidays || []).map((holiday, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                              <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200">{holiday.name}</td>
                              <td className="px-4 py-2.5 text-slate-500">{new Date(holiday.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                              <td className="px-4 py-2.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => removeHoliday(idx)}
                                  className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                          {(settingsForm.holidays || []).length === 0 && (
                            <tr>
                              <td colSpan="3" className="px-4 py-4 text-center text-slate-400 italic">No holidays configured yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Authentication & Security */}
              {settingsSubTab === 'security' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 dark:border-white/5 pb-3">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">Authentication & Security</h4>
                    <p className="text-[10px] text-slate-500">Configure authentication password strength, lockout protocols, and session timeouts.</p>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Password Policies</h5>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Min Password Length</label>
                        <input
                          type="number"
                          min="6"
                          max="32"
                          value={settingsForm.passwordPolicies?.minLength || 6}
                          onChange={(e) => setSettingsForm({
                            ...settingsForm,
                            passwordPolicies: { ...settingsForm.passwordPolicies, minLength: parseInt(e.target.value) || 6 }
                          })}
                          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Password Expiry (days)</label>
                        <input
                          type="number"
                          min="0"
                          value={settingsForm.passwordPolicies?.passwordExpiry || 90}
                          onChange={(e) => setSettingsForm({
                            ...settingsForm,
                            passwordPolicies: { ...settingsForm.passwordPolicies, passwordExpiry: parseInt(e.target.value) || 90 }
                          })}
                          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.passwordPolicies?.requireSpecialChar || false}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              passwordPolicies: { ...settingsForm.passwordPolicies, requireSpecialChar: e.target.checked }
                            })}
                            className="rounded accent-indigo-500"
                          />
                          <span>Special Character</span>
                        </label>
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.passwordPolicies?.requireUppercase || false}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              passwordPolicies: { ...settingsForm.passwordPolicies, requireUppercase: e.target.checked }
                            })}
                            className="rounded accent-indigo-500"
                          />
                          <span>Uppercase Letter</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Session & Lockout Policy</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          min="5"
                          value={settingsForm.sessionTimeout || 60}
                          onChange={(e) => setSettingsForm({ ...settingsForm, sessionTimeout: parseInt(e.target.value) || 60 })}
                          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Max Login Attempts</label>
                        <input
                          type="number"
                          min="3"
                          max="20"
                          value={settingsForm.loginSecurity?.maxLoginAttempts || 5}
                          onChange={(e) => setSettingsForm({
                            ...settingsForm,
                            loginSecurity: { ...settingsForm.loginSecurity, maxLoginAttempts: parseInt(e.target.value) || 5 }
                          })}
                          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Lockout Time (minutes)</label>
                        <input
                          type="number"
                          min="5"
                          value={settingsForm.loginSecurity?.lockoutTime || 15}
                          onChange={(e) => setSettingsForm({
                            ...settingsForm,
                            loginSecurity: { ...settingsForm.loginSecurity, lockoutTime: parseInt(e.target.value) || 15 }
                          })}
                          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Security Features</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center pt-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.loginSecurity?.enableTwoFactor || false}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              loginSecurity: { ...settingsForm.loginSecurity, enableTwoFactor: e.target.checked }
                            })}
                            className="rounded accent-indigo-500"
                          />
                          <span>Enable Two-Factor Authentication</span>
                        </label>
                      </div>
                      <div className="flex items-center pt-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.loginSecurity?.forceEmailVerification || false}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              loginSecurity: { ...settingsForm.loginSecurity, forceEmailVerification: e.target.checked }
                            })}
                            className="rounded accent-indigo-500"
                          />
                          <span>Force Email Verification</span>
                        </label>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">JWT Expiration Time</label>
                        <select
                          value={settingsForm.loginSecurity?.jwtExpiration || '30d'}
                          onChange={(e) => setSettingsForm({
                            ...settingsForm,
                            loginSecurity: { ...settingsForm.loginSecurity, jwtExpiration: e.target.value }
                          })}
                          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        >
                          <option value="1h">1 Hour</option>
                          <option value="24h">24 Hours</option>
                          <option value="7d">7 Days</option>
                          <option value="30d">30 Days</option>
                          <option value="90d">90 Days</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-red-500/20 pt-4 bg-red-500/5 -mx-6 -mb-6 p-6 rounded-b-2xl space-y-3">
                    <h5 className="text-xs font-black text-red-650 dark:text-red-400">Emergency Actions</h5>
                    <p className="text-[10px] text-slate-500">Instantly force logout other logged-in users on all devices. Users will need to log back in.</p>
                    <button
                      type="button"
                      onClick={() => handleForceLogoutAll(null)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-md transition-colors"
                    >
                      ⚠️ Force Logout All Other Users Globally
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Storage Allocation */}
              {settingsSubTab === 'storage' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 dark:border-white/5 pb-3">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">Storage Allocation & Analytics</h4>
                    <p className="text-[10px] text-slate-500">Configure upload quotas, check disk analytics, and clean up unreferenced cache assets.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Storage Limits Form */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white">Upload Quota Settings</h5>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Total Platform Limit: {settingsForm.totalPlatformStorage || 100} GB</label>
                          <input
                            type="range"
                            min="10"
                            max="1000"
                            value={settingsForm.totalPlatformStorage || 100}
                            onChange={(e) => setSettingsForm({ ...settingsForm, totalPlatformStorage: parseInt(e.target.value) || 100 })}
                            className="w-full accent-indigo-600"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Video File Size Cap: {settingsForm.videoLimits || 500} MB</label>
                          <input
                            type="number"
                            min="10"
                            max="5000"
                            value={settingsForm.videoLimits || 500}
                            onChange={(e) => setSettingsForm({ ...settingsForm, videoLimits: parseInt(e.target.value) || 500 })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Notes Document Cap: {settingsForm.notesUploadLimit || 50} MB</label>
                          <input
                            type="number"
                            min="1"
                            max="200"
                            value={settingsForm.notesUploadLimit || 50}
                            onChange={(e) => setSettingsForm({ ...settingsForm, notesUploadLimit: parseInt(e.target.value) || 50 })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Assignment Submission Cap: {settingsForm.assignmentUploadLimit || 20} MB</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={settingsForm.assignmentUploadLimit || 20}
                            onChange={(e) => setSettingsForm({ ...settingsForm, assignmentUploadLimit: parseInt(e.target.value) || 20 })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Profile Image Upload Cap: {settingsForm.userProfileImageLimit || 3} MB</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={settingsForm.userProfileImageLimit || 3}
                            onChange={(e) => setSettingsForm({ ...settingsForm, userProfileImageLimit: parseInt(e.target.value) || 3 })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Usage Analytics */}
                    <div className="bg-slate-100 dark:bg-slate-900/50 p-5 rounded-2xl border dark:border-white/5 flex flex-col justify-between">
                      <div>
                        <h5 className="text-xs font-black text-slate-850 dark:text-white mb-3">Disk Usage Analytics</h5>
                        <div className="space-y-3.5">
                          <div>
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                              <span>Videos Lect. ({storageAnalytics.videoUsageMB || 0} MB)</span>
                              <span className="opacity-70">Limit: {settingsForm.videoLimits} MB</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, ((storageAnalytics.videoUsageMB || 0) / (settingsForm.videoLimits || 500)) * 100)}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                              <span>Notes Docs ({storageAnalytics.notesUsageMB || 0} MB)</span>
                              <span className="opacity-70">Limit: {settingsForm.notesUploadLimit} MB</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, ((storageAnalytics.notesUsageMB || 0) / (settingsForm.notesUploadLimit || 50)) * 100)}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                              <span>User Profiles ({storageAnalytics.avatarUsageMB || 0} MB)</span>
                              <span className="opacity-70">Limit: {settingsForm.userProfileImageLimit} MB</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, ((storageAnalytics.avatarUsageMB || 0) / (settingsForm.userProfileImageLimit || 3)) * 100)}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                              <span>Assignments ({storageAnalytics.assignmentsUsageMB || 0} MB)</span>
                              <span className="opacity-70">Limit: {settingsForm.assignmentUploadLimit} MB</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, ((storageAnalytics.assignmentsUsageMB || 0) / (settingsForm.assignmentUploadLimit || 20)) * 100)}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-slate-200 dark:border-white/5 mt-4 space-y-3">
                        <div className="text-[10px] text-slate-500">Unreferenced assets accumulate in the uploads folder. Trigger cleanup to reclaim server space.</div>
                        <button
                          type="button"
                          disabled={isCleaningStorage}
                          onClick={handleRunCleanup}
                          className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                        >
                          {isCleaningStorage ? '🧹 Cleaning up disk...' : '🧹 Cleanup Unused Files'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Allowed File Types</h5>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {['.pdf', '.csv', '.xlsx', '.png', '.jpg', '.jpeg', '.webp', '.mp4', '.zip', '.txt'].map((ext) => {
                        const isAllowed = (settingsForm.allowedFileTypes || []).includes(ext);
                        return (
                          <label key={ext} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isAllowed}
                              onChange={() => toggleAllowedFileType(ext)}
                              className="rounded accent-indigo-500"
                            />
                            <span>{ext}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. SMTP & Email Configuration */}
              {settingsSubTab === 'smtp' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 dark:border-white/5 pb-3">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">SMTP & Email Configuration</h4>
                    <p className="text-[10px] text-slate-500">Set up server routing protocols for automated system emails and invoices.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">SMTP Host Server</label>
                      <input
                        type="text"
                        value={settingsForm.smtp?.host || ''}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm,
                          smtp: { ...settingsForm.smtp, host: e.target.value }
                        })}
                        placeholder="e.g. smtp.mailtrap.io"
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">SMTP Port</label>
                      <input
                        type="number"
                        value={settingsForm.smtp?.port || 2525}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm,
                          smtp: { ...settingsForm.smtp, port: parseInt(e.target.value) || 2525 }
                        })}
                        placeholder="2525"
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Username / User Auth ID</label>
                      <input
                        type="text"
                        value={settingsForm.smtp?.username || settingsForm.smtp?.user || ''}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm,
                          smtp: { ...settingsForm.smtp, username: e.target.value, user: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Password</label>
                      <input
                        type="password"
                        value={settingsForm.smtp?.password || settingsForm.smtp?.pass || ''}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm,
                          smtp: { ...settingsForm.smtp, password: e.target.value, pass: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settingsForm.smtp?.sslTls || false}
                          onChange={(e) => setSettingsForm({
                            ...settingsForm,
                            smtp: { ...settingsForm.smtp, sslTls: e.target.checked }
                          })}
                          className="rounded accent-indigo-500"
                        />
                        <span>Enable SSL / TLS Security</span>
                      </label>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Sender Email Address</label>
                      <input
                        type="email"
                        value={settingsForm.smtp?.senderEmail || settingsForm.smtp?.fromEmail || ''}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm,
                          smtp: { ...settingsForm.smtp, senderEmail: e.target.value, fromEmail: e.target.value }
                        })}
                        placeholder="noreply@codewave.com"
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Sender Brand Display Name</label>
                      <input
                        type="text"
                        value={settingsForm.smtp?.senderName || 'CodeWave'}
                        onChange={(e) => setSettingsForm({
                          ...settingsForm,
                          smtp: { ...settingsForm.smtp, senderName: e.target.value }
                        })}
                        placeholder="CodeWave"
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Mail Connection Tester */}
                  <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-2">Test Connection</h5>
                    <p className="text-[10px] text-slate-500 mb-3">Send a test dispatch email to verify SMTP handshake credentials.</p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="recipient@example.com"
                        value={testEmailRecipient}
                        onChange={(e) => setTestEmailRecipient(e.target.value)}
                        className="w-full md:w-1/2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        disabled={isTestingSmtp}
                        onClick={handleTestSmtp}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                      >
                        {isTestingSmtp ? 'Sending...' : '📨 Verify & Send'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Alerts & Notifications */}
              {settingsSubTab === 'alerts' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 dark:border-white/5 pb-3">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">Alerts & Notifications</h4>
                    <p className="text-[10px] text-slate-500">Configure instant notification event triggers for email dispatch, push notification gateways, and system warnings.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-slate-850 dark:text-white border-b dark:border-white/5 pb-1">Email Alerts</h5>
                      {[
                        { key: 'registration', label: 'User Registration' },
                        { key: 'login', label: 'Login Dispatch' },
                        { key: 'assignmentDue', label: 'Assignment Deadlines' },
                        { key: 'assessmentResults', label: 'Assessment Results' }
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.alerts?.emailAlerts?.[item.key] ?? false}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              alerts: {
                                ...settingsForm.alerts,
                                emailAlerts: { ...settingsForm.alerts?.emailAlerts, [item.key]: e.target.checked }
                              }
                            })}
                            className="rounded accent-indigo-500"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-slate-855 dark:text-white border-b dark:border-white/5 pb-1">Push Notifications</h5>
                      {[
                        { key: 'newVideos', label: 'New Video Lectures' },
                        { key: 'newNotes', label: 'New Lecture Notes' },
                        { key: 'announcements', label: 'Portal Announcements' },
                        { key: 'roadmapUnlocks', label: 'Roadmap Milestone Unlock' }
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.alerts?.pushNotifications?.[item.key] ?? false}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              alerts: {
                                ...settingsForm.alerts,
                                pushNotifications: { ...settingsForm.alerts?.pushNotifications, [item.key]: e.target.checked }
                              }
                            })}
                            className="rounded accent-indigo-500"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-slate-860 dark:text-white border-b dark:border-white/5 pb-1">System Warnings</h5>
                      {[
                        { key: 'serverErrors', label: 'Server Internal Errors' },
                        { key: 'lowStorage', label: 'Low Storage Warnings' },
                        { key: 'failedJobs', label: 'Failed System Jobs' },
                        { key: 'failedEmails', label: 'SMTP Failed dispatches' }
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.alerts?.systemAlerts?.[item.key] ?? false}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              alerts: {
                                ...settingsForm.alerts,
                                systemAlerts: { ...settingsForm.alerts?.systemAlerts, [item.key]: e.target.checked }
                              }
                            })}
                            className="rounded accent-indigo-500"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Notification Dispatch Frequency</label>
                    <select
                      value={settingsForm.alerts?.alertFrequency || 'instant'}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        alerts: { ...settingsForm.alerts, alertFrequency: e.target.value }
                      })}
                      className="w-full md:w-1/3 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                    >
                      <option value="instant">Real-time (Instant dispatch)</option>
                      <option value="daily">Daily digest summary</option>
                      <option value="weekly">Weekly digest summary</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 7. System Preferences */}
              {settingsSubTab === 'system' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 dark:border-white/5 pb-3">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">System Preferences</h4>
                    <p className="text-[10px] text-slate-500">Configure global platform branding, landing layouts, maintenance toggles and feature flags.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white">Feature Flag Toggles</h5>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.system?.featureFlags?.enableAiChat ?? true}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              system: {
                                ...settingsForm.system,
                                featureFlags: { ...settingsForm.system?.featureFlags, enableAiChat: e.target.checked }
                              }
                            })}
                            className="rounded accent-indigo-500"
                          />
                          <span>Enable AI Code Guru chat assistant</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.system?.featureFlags?.enableGamification ?? true}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              system: {
                                ...settingsForm.system,
                                featureFlags: { ...settingsForm.system?.featureFlags, enableGamification: e.target.checked }
                              }
                            })}
                            className="rounded accent-indigo-500"
                          />
                          <span>Enable Gamification (XP streaks, points, leaderboard)</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.system?.featureFlags?.enableCloudCredits ?? true}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              system: {
                                ...settingsForm.system,
                                featureFlags: { ...settingsForm.system?.featureFlags, enableCloudCredits: e.target.checked }
                              }
                            })}
                            className="rounded accent-indigo-500"
                          />
                          <span>Enable Cloud Credits perks claims panel</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-slate-800 dark:text-white">Maintenance & Security mode</h5>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-red-650 dark:text-red-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.system?.maintenanceMode || false}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              system: { ...settingsForm.system, maintenanceMode: e.target.checked }
                            })}
                            className="rounded accent-red-600"
                          />
                          <span>⚠️ Trigger Platform Maintenance Mode (Locks user portals)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-white/5 pt-4">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white mb-3">Landing Page Configurations</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Hero Section Title</label>
                        <input
                          type="text"
                          value={settingsForm.system?.landingPageConfig?.heroTitle || ''}
                          onChange={(e) => setSettingsForm({
                            ...settingsForm,
                            system: {
                              ...settingsForm.system,
                              landingPageConfig: { ...settingsForm.system?.landingPageConfig, heroTitle: e.target.value }
                            }
                          })}
                          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Hero Section Subtitle</label>
                        <input
                          type="text"
                          value={settingsForm.system?.landingPageConfig?.heroSubtitle || ''}
                          onChange={(e) => setSettingsForm({
                            ...settingsForm,
                            system: {
                              ...settingsForm.system,
                              landingPageConfig: { ...settingsForm.system?.landingPageConfig, heroSubtitle: e.target.value }
                            }
                          })}
                          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex items-center pt-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.system?.landingPageConfig?.showTestimonials ?? true}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              system: {
                                ...settingsForm.system,
                                landingPageConfig: { ...settingsForm.system?.landingPageConfig, showTestimonials: e.target.checked }
                              }
                            })}
                            className="rounded accent-indigo-500"
                          />
                          <span>Show student testimonial reviews carousel</span>
                        </label>
                      </div>
                      <div className="flex items-center pt-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.system?.landingPageConfig?.showStats ?? true}
                            onChange={(e) => setSettingsForm({
                              ...settingsForm,
                              system: {
                                ...settingsForm.system,
                                landingPageConfig: { ...settingsForm.system?.landingPageConfig, showStats: e.target.checked }
                              }
                            })}
                            className="rounded accent-indigo-500"
                          />
                          <span>Show performance/enrolled analytics counters</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. Admin Permissions */}
              {settingsSubTab === 'permissions' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 dark:border-white/5 pb-3">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">Role-Based Permission Matrix</h4>
                    <p className="text-[10px] text-slate-500">Enable/disable authorization blocks per administrative staff role. Changes propagate in real time.</p>
                  </div>

                  <div className="space-y-4">
                    <form onSubmit={handleCreateRole} className="flex gap-2 bg-slate-100 dark:bg-slate-900/50 p-4 rounded-2xl border dark:border-white/5 items-center">
                      <div className="flex-1">
                        <label className="text-[9px] font-bold text-slate-500 block mb-1">Create Custom Role</label>
                        <input
                          type="text"
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          placeholder="e.g. Regional Manager"
                          className="w-full px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium outline-none focus:border-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors mt-4 self-end"
                      >
                        Create Role
                      </button>
                    </form>

                    <div className="space-y-4">
                      {rolesList.map((roleObj) => (
                        <div key={roleObj.role} className="p-5 bg-white dark:bg-slate-900 border dark:border-white/5 rounded-2xl space-y-3.5 shadow-sm">
                          <div className="flex justify-between items-center border-b dark:border-white/5 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-850 dark:text-white">{roleObj.role}</span>
                              {roleObj.isCustom ? (
                                <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-black">CUSTOM</span>
                              ) : (
                                <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">BUILT-IN</span>
                              )}
                            </div>
                            {roleObj.isCustom && (
                              <button
                                type="button"
                                onClick={() => handleSaveRolePermissions(roleObj.role, [], true)}
                                className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                              >
                                Delete Role
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                            {[
                              'Profile Settings',
                              'Academic Settings',
                              'Authentication Settings',
                              'Storage Management',
                              'SMTP Configuration',
                              'Notifications Management',
                              'User Management',
                              'Content Management',
                              'Analytics Management'
                            ].map((perm) => {
                              const hasPerm = (roleObj.permissions || []).includes(perm);
                              return (
                                <label key={perm} className="flex items-center gap-2 text-[11px] font-medium text-slate-700 dark:text-slate-350 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={hasPerm}
                                    onChange={() => handleTogglePermission(roleObj, perm)}
                                    className="rounded accent-indigo-500"
                                  />
                                  <span>{perm}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 9. Audit Logs */}
              {settingsSubTab === 'audit' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 dark:border-white/5 pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white">Administrative Audit Logs</h4>
                        <p className="text-[10px] text-slate-500">Track and review administrative settings alterations and emergency logins.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportAuditLogs}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        📥 Export to CSV
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                      <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={auditSearch}
                        onChange={(e) => { setAuditSearch(e.target.value); setAuditPage(1); }}
                        placeholder="Search logs by email or detail keys..."
                        className="w-full pl-9 pr-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <select
                      value={auditAction}
                      onChange={(e) => { setAuditAction(e.target.value); setAuditPage(1); }}
                      className="w-full md:w-56 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-medium text-slate-800 dark:text-white outline-none focus:border-indigo-500"
                    >
                      <option value="">All Action Types</option>
                      <option value="UPDATE_PROFILE_SETTINGS">Profile Details</option>
                      <option value="UPDATE_ACADEMIC_SETTINGS">Academic Configurations</option>
                      <option value="UPDATE_AUTH_SETTINGS">Auth Strengths</option>
                      <option value="UPDATE_SMTP_SETTINGS">SMTP credentials</option>
                      <option value="UPDATE_STORAGE_SETTINGS">Storage quotas</option>
                      <option value="CLEANUP_UNUSED_FILES">Disk cleanup logs</option>
                      <option value="TERMINATE_USER_SESSION">Session termination</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto border dark:border-white/5 rounded-2xl bg-white dark:bg-slate-900/20">
                    <table className="w-full text-left text-xs min-w-[700px]">
                      <thead className="bg-slate-105 dark:bg-slate-900 text-slate-500 uppercase tracking-widest text-[9px] font-bold">
                        <tr>
                          <th className="px-4 py-3">Timestamp</th>
                          <th className="px-4 py-3">Administrator</th>
                          <th className="px-4 py-3">Action</th>
                          <th className="px-4 py-3">Details</th>
                          <th className="px-4 py-3">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 dark:divide-white/5">
                        {auditLogs.map((log) => (
                          <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                            <td className="px-4 py-3 text-slate-500 font-mono text-[10px]">{new Date(log.timestamp || log.createdAt).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className="font-bold text-slate-800 dark:text-slate-250 block">{log.userId?.fullName || 'Legacy Admin'}</span>
                              <span className="text-[10px] text-slate-500 block">{log.userEmail}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 border px-2.5 py-1 rounded-full font-black text-center inline-block">{log.action}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-650 dark:text-slate-300 font-medium text-[11px]">{log.details}</td>
                            <td className="px-4 py-3 text-slate-400 font-mono text-[10px]">{log.ipAddress || '127.0.0.1'}</td>
                          </tr>
                        ))}
                        {auditLogs.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-4 py-8 text-center text-slate-400 italic">No audit records found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {auditTotalPages > 1 && (
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] text-slate-500">Page {auditPage} of {auditTotalPages}</span>
                      <div className="flex gap-2">
                        <button
                          disabled={auditPage <= 1}
                          onClick={() => setAuditPage(prev => Math.max(1, prev - 1))}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          disabled={auditPage >= auditTotalPages}
                          onClick={() => setAuditPage(prev => Math.min(auditTotalPages, prev + 1))}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 10. Session Management */}
              {settingsSubTab === 'sessions' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-200 dark:border-white/5 pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white">Active Sessions & Device Management</h4>
                        <p className="text-[10px] text-slate-500">Inspect concurrent logins, view browser configurations, and revoke tokens in real time.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleForceLogoutAll(null)}
                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-all shadow-sm"
                      >
                        Revoke All Other Sessions
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {activeSessions.map((session) => {
                      const isCurrent = session.token === api.defaults.headers.common['Authorization']?.split(' ')[1] || false;
                      return (
                        <div key={session._id} className="p-4 bg-white dark:bg-slate-900 border dark:border-white/5 rounded-2xl flex justify-between items-center shadow-sm">
                          <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-350 text-xl font-bold">
                              {session.userId?.avatar ? (
                                <img src={session.userId.avatar} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                (session.userId?.fullName || 'U').charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="flex gap-2 items-center">
                                <span className="text-xs font-black text-slate-850 dark:text-white">{session.userId?.fullName || 'Unknown User'}</span>
                                <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 border dark:border-white/5 px-2 py-0.5 rounded-full font-bold uppercase">{session.userId?.role || 'student'}</span>
                                {isCurrent && (
                                  <span className="text-[8px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-black">CURRENT SESSION</span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 block">{session.userId?.email || 'N/A'}</span>
                              <div className="flex gap-3 text-[9px] text-slate-500 mt-1">
                                <span>🌐 IP: {session.ipAddress || '127.0.0.1'}</span>
                                <span>💻 Device: {session.deviceInfo || 'Unknown'} / {session.browserInfo || 'Chrome'}</span>
                                <span>🕒 Active: {new Date(session.lastActivityAt).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleTerminateSession(session._id)}
                              className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/20 flex items-center justify-center text-red-500 transition-all"
                              title="Terminate active session"
                            >
                              <FiX />
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {activeSessions.length === 0 && (
                      <div className="text-center py-8 text-slate-400 italic">No active sessions tracked in database.</div>
                    )}
                  </div>
                </div>
              )}

              {/* 11. Feature Management */}
              {settingsSubTab === 'features' && (
                <div className="space-y-8 animate-in fade-in duration-200 text-left">
                  <div className="border-b border-slate-200 dark:border-white/5 pb-3">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">Feature Lock & Availability System</h4>
                    <p className="text-[10px] text-slate-500">Configure platform modules accessibility, audit changes, and toggle feature flag locks.</p>
                  </div>

                  {/* Warning for non-super admin */}
                  {!isUserSuperAdmin && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border border-amber-250 dark:border-amber-900/30 rounded-2xl text-xs font-bold">
                      ⚠️ Note: Only the Super Admin can change feature availability. You are currently in viewing-only mode.
                    </div>
                  )}

                  {/* Search, filters and bulk actions bar */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50 dark:bg-slate-900/50 p-4 border dark:border-white/5 rounded-2xl">
                    <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
                      <input
                        type="text"
                        value={featureSearch}
                        onChange={(e) => setFeatureSearch(e.target.value)}
                        placeholder="Search features..."
                        className="px-3 py-1.5 bg-white dark:bg-slate-950 border dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold"
                      />
                      <select
                        value={featureCategoryFilter}
                        onChange={(e) => setFeatureCategoryFilter(e.target.value)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-950 border dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold"
                      >
                        <option value="All">All Categories</option>
                        <option value="Core">Core</option>
                        <option value="DevOps">DevOps</option>
                        <option value="AI">AI</option>
                        <option value="Career">Career</option>
                      </select>
                      <select
                        value={featureEnabledFilter}
                        onChange={(e) => setFeatureEnabledFilter(e.target.value)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-950 border dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold"
                      >
                        <option value="all">All States</option>
                        <option value="enabled">Enabled</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>

                    {isUserSuperAdmin && bulkSelectedKeys.length > 0 && (
                      <div className="flex gap-2 items-center w-full sm:w-auto justify-end">
                        <span className="text-[10px] text-slate-500 font-bold">{bulkSelectedKeys.length} selected</span>
                        <button
                          type="button"
                          onClick={() => handleBulkToggleFeatures(true)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black transition-all"
                        >
                          Bulk Enable
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBulkToggleFeatures(false)}
                          className="px-3 py-1.5 bg-red-650 hover:bg-red-700 text-white rounded-lg text-xs font-black transition-all"
                        >
                          Bulk Disable
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Feature list table */}
                  <div className="card bg-white dark:bg-slate-900 border dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-white/5 text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                            {isUserSuperAdmin && <th className="p-4 w-12 text-center"><input type="checkbox" onChange={(e) => {
                              const filteredKeys = filteredFeatureFlags.map(f => f.featureKey);
                              setBulkSelectedKeys(e.target.checked ? filteredKeys : []);
                            }} checked={bulkSelectedKeys.length > 0 && bulkSelectedKeys.length === filteredFeatureFlags.length} /></th>}
                            <th className="p-4 text-left">Feature Name</th>
                            <th className="p-4 text-left">Key</th>
                            <th className="p-4 text-left">Category</th>
                            <th className="p-4 text-left">Description</th>
                            <th className="p-4 text-left">Last Modified</th>
                            <th className="p-4 text-center">Status</th>
                            {isUserSuperAdmin && <th className="p-4 text-right">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {filteredFeatureFlags.length === 0 ? (
                            <tr><td colSpan={isUserSuperAdmin ? 8 : 6} className="p-8 text-center text-slate-400">No feature flags found.</td></tr>
                          ) : (
                            filteredFeatureFlags.map((feat) => (
                              <tr key={feat.featureKey} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                                {isUserSuperAdmin && (
                                  <td className="p-4 text-center">
                                    <input 
                                      type="checkbox" 
                                      checked={bulkSelectedKeys.includes(feat.featureKey)} 
                                      onChange={(e) => {
                                        setBulkSelectedKeys(prev => 
                                          e.target.checked 
                                            ? [...prev, feat.featureKey] 
                                            : prev.filter(k => k !== feat.featureKey)
                                        );
                                      }}
                                    />
                                  </td>
                                )}
                                <td className="p-4 font-extrabold text-slate-900 dark:text-white">{feat.featureName}</td>
                                <td className="p-4 text-slate-500 font-mono text-[10px]">{feat.featureKey}</td>
                                <td className="p-4">
                                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded-full text-slate-650 dark:text-slate-350">{feat.category}</span>
                                </td>
                                <td className="p-4 text-[10px] text-slate-500 max-w-xs truncate">{feat.description}</td>
                                <td className="p-4 text-[10px] text-slate-400">
                                  {feat.updatedBy ? (
                                    <>
                                      <div>{feat.updatedBy.fullName}</div>
                                      <div>{new Date(feat.updatedAt).toLocaleString()}</div>
                                    </>
                                  ) : (
                                    'System Default'
                                  )}
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                    feat.enabled 
                                      ? 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/20' 
                                      : 'bg-rose-50 dark:bg-rose-950/25 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/20'
                                  }`}>
                                    {feat.enabled ? 'Enabled' : 'Disabled'}
                                  </span>
                                </td>
                                {isUserSuperAdmin && (
                                  <td className="p-4 text-right">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleFeature(feat.featureKey, !feat.enabled)}
                                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all tracking-wider ${
                                        feat.enabled
                                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-650 border border-rose-200'
                                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-650 border border-emerald-200'
                                      }`}
                                    >
                                      {feat.enabled ? 'Disable' : 'Enable'}
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Audit Logs Section */}
                  <div className="card p-6 bg-white dark:bg-slate-900 border dark:border-white/5 rounded-3xl shadow-sm text-left">
                    <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider mb-6">Feature Change Audit History</h3>
                    
                    {featureLogs.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">No feature log transitions tracked.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-semibold text-slate-700 dark:text-slate-200">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-white/5 text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                              <th className="pb-3 text-left">User</th>
                              <th className="pb-3 text-left">Details</th>
                              <th className="pb-3 text-left">IP Address</th>
                              <th className="pb-3 text-left">Browser</th>
                              <th className="pb-3 text-right">Timestamp</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-150 dark:divide-white/5">
                            {featureLogs.map((log) => (
                              <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                                <td className="py-3 font-extrabold text-slate-900 dark:text-white">
                                  <div>{log.userId?.fullName || 'Super Admin'}</div>
                                  <div className="text-[9px] text-slate-450 uppercase">{log.userEmail}</div>
                                </td>
                                <td className="py-3 text-[10px] text-slate-500 max-w-sm">{log.details}</td>
                                <td className="py-3 text-[10px] text-slate-400">{log.ipAddress}</td>
                                <td className="py-3 text-[10px] text-slate-400 max-w-xs truncate">{log.deviceInfo}</td>
                                <td className="py-3 text-right text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* User Personalization Modal (Drawer style) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-white/5 h-full overflow-y-auto p-8 shadow-2xl flex flex-col justify-between">
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-indigo-600/20 border border-emerald-100 dark:border-indigo-500/20 text-emerald-700 dark:text-indigo-400 font-black text-lg flex items-center justify-center">
                    {selectedUser.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 dark:text-white">{selectedUser.fullName}</h3>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{selectedUser.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  <FiX />
                </button>
              </div>

              {/* Progress & Personalization Slider Console */}
              <div className="bg-emerald-50/50 dark:bg-indigo-950/20 border border-emerald-100 dark:border-indigo-900/30 rounded-2xl p-5 space-y-4">
                <h4 className="text-[10px] font-black text-emerald-700 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <FiSettings /> Teammate Personalization panel
                </h4>

                <div className="space-y-4">
                  {/* XP update */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Custom User XP Balance:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={customXp}
                        onChange={(e) => setCustomXp(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950/85 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-bold w-full focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500"
                      />
                      <button
                        onClick={() => setCustomXp(Number(customXp) + 250)}
                        className="px-2.5 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-[9px] font-black text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                      >
                        +250 XP
                      </button>
                    </div>
                  </div>

                  {/* Progress percentage slider */}
                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-550 dark:text-slate-400 mb-1">
                      <span>Curriculum Completion Progress:</span>
                      <span className="text-slate-800 dark:text-white font-black">{customProgress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={customProgress}
                      onChange={(e) => setCustomProgress(e.target.value)}
                      className="w-full accent-emerald-650 dark:accent-indigo-500"
                    />
                  </div>

                  {/* Current phase */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Current Active Learning Phase Index:</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={customPhase}
                      onChange={(e) => setCustomPhase(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950/85 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-bold w-full focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveProgress}
                    disabled={updatingProgress}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:bg-slate-350 dark:disabled:bg-indigo-800 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                  >
                    {updatingProgress ? "Applying Changes..." : "Apply Personalization Settings"}
                  </button>
                </div>
              </div>

              {/* Onboarding Profiles & Stats details */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Academic & Onboarding Summary</h4>

                {selectedUser.profile?.collegeName ? (
                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-2">
                      <div className="flex justify-between"><span className="text-slate-500">Institution:</span><span className="text-slate-800 dark:text-white font-bold">{selectedUser.profile.collegeName}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Branch & Year:</span><span className="text-slate-800 dark:text-white font-bold">{selectedUser.profile.branch} • Year {selectedUser.profile.year}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Daily Study Target:</span><span className="text-slate-800 dark:text-white font-bold">{selectedUser.profile.dailyStudyTime || 0} minutes</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Pace:</span><span className="text-emerald-700 dark:text-indigo-400 font-bold">{selectedUser.profile.roadmapType || "Steady"}</span></div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-2">
                      <span className="text-[10px] text-slate-500 block">Languages & Tools:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {selectedUser.profile.knownLanguages?.map(lang => (
                          <span key={lang} className="text-[9px] bg-white dark:bg-slate-800/60 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-semibold">{lang}</span>
                        ))}
                        {selectedUser.profile.knownTools?.map(tool => (
                          <span key={tool} className="text-[9px] bg-white dark:bg-slate-800/60 px-2 py-0.5 rounded border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-semibold">{tool}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs italic">User has not completed the interest onboarding profile.</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-white/5 pt-6 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-2.5 bg-slate-150 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl text-xs font-black transition-all"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Domain Modal */}
      {showDomainModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Add New Domain Specialized Path</h3>
              <button
                onClick={() => setShowDomainModal(false)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateDomain} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Domain Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Computing"
                  value={newDomain.name}
                  onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Unique Slug:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. cloud-computing"
                  value={newDomain.slug}
                  onChange={(e) => setNewDomain({ ...newDomain, slug: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Description:</label>
                <textarea
                  placeholder="Summarize the career specialization target..."
                  rows="3"
                  value={newDomain.shortDescription}
                  onChange={(e) => setNewDomain({ ...newDomain, shortDescription: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Duration:</label>
                  <input
                    type="text"
                    value={newDomain.estimatedDuration}
                    onChange={(e) => setNewDomain({ ...newDomain, estimatedDuration: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Difficulty:</label>
                  <select
                    value={newDomain.difficultyLevel}
                    onChange={(e) => setNewDomain({ ...newDomain, difficultyLevel: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Global Certification Link:</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newDomain.certificationLink}
                  onChange={(e) => setNewDomain({ ...newDomain, certificationLink: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDomainModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Create Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Domain Modal */}
      {editingDomain && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Edit Domain Specialization</h3>
              <button
                onClick={() => setEditingDomain(null)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleUpdateDomain} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Domain Name:</label>
                <input
                  type="text"
                  required
                  value={editingDomain.name}
                  onChange={(e) => setEditingDomain({ ...editingDomain, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Unique Slug:</label>
                <input
                  type="text"
                  required
                  value={editingDomain.slug}
                  onChange={(e) => setEditingDomain({ ...editingDomain, slug: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Description:</label>
                <textarea
                  rows="3"
                  value={editingDomain.shortDescription}
                  onChange={(e) => setEditingDomain({ ...editingDomain, shortDescription: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Duration:</label>
                  <input
                    type="text"
                    value={editingDomain.estimatedDuration}
                    onChange={(e) => setEditingDomain({ ...editingDomain, estimatedDuration: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Difficulty:</label>
                  <select
                    value={editingDomain.difficultyLevel}
                    onChange={(e) => setEditingDomain({ ...editingDomain, difficultyLevel: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Global Certification Link:</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editingDomain.certificationLink || ''}
                  onChange={(e) => setEditingDomain({ ...editingDomain, certificationLink: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDomain(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Topic Links Modal */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Edit Topic Resource Links</h3>
              <button
                onClick={() => setEditingTopic(null)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleUpdateTopicLinks} className="space-y-4">
              <div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 block">TOPIC TITLE:</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white block mt-1">{editingTopic.title}</span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">YouTube Video Link:</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=... or video ID"
                  value={editingTopic.youtubeLink || ''}
                  onChange={(e) => setEditingTopic({ ...editingTopic, youtubeLink: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Documentation (GFG/Other) Link:</label>
                <input
                  type="url"
                  placeholder="https://geeksforgeeks.org/..."
                  value={editingTopic.gfgLink || ''}
                  onChange={(e) => setEditingTopic({ ...editingTopic, gfgLink: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTopic(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Save Links
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign/Add Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Assign Milestone Assessment</h3>
              <button
                onClick={() => setShowAssessmentModal(false)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Assessment Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced DevOps Challenge"
                  value={newAssessment.title}
                  onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Target Domain Specialization:</label>
                <select
                  required
                  value={newAssessment.domainId}
                  onChange={(e) => setNewAssessment({ ...newAssessment, domainId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                >
                  {domains.map(d => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Platform Provider:</label>
                <select
                  value={newAssessment.platform}
                  onChange={(e) => setNewAssessment({ ...newAssessment, platform: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                >
                  <option value="HackerRank">HackerRank</option>
                  <option value="GFG">GeeksforGeeks</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="CodeChef">CodeChef</option>
                  <option value="Custom">Custom</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Test/Assessment Link:</label>
                <input
                  type="url"
                  required
                  placeholder="https://hackerrank.com/..."
                  value={newAssessment.assessmentLink}
                  onChange={(e) => setNewAssessment({ ...newAssessment, assessmentLink: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Passing Score (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newAssessment.passingScore}
                    onChange={(e) => setNewAssessment({ ...newAssessment, passingScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Short Description:</label>
                <textarea
                  rows="2"
                  placeholder="Tell students what is required in this milestone test..."
                  value={newAssessment.description}
                  onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-medium"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssessmentModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Assign Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Assessment Modal */}
      {editingAssessment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Edit Milestone Assessment</h3>
              <button
                onClick={() => setEditingAssessment(null)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleUpdateAssessment} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Assessment Title:</label>
                <input
                  type="text"
                  required
                  value={editingAssessment.title}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Target Domain Specialization:</label>
                <select
                  required
                  value={editingAssessment.domainId?._id || editingAssessment.domainId}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, domainId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                >
                  {domains.map(d => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Platform Provider:</label>
                <select
                  value={editingAssessment.platform}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, platform: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                >
                  <option value="HackerRank">HackerRank</option>
                  <option value="GFG">GeeksforGeeks</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="CodeChef">CodeChef</option>
                  <option value="Custom">Custom</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Test/Assessment Link:</label>
                <input
                  type="url"
                  required
                  value={editingAssessment.assessmentLink}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, assessmentLink: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-555 dark:text-slate-400 block mb-1">Passing Score (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingAssessment.passingScore}
                    onChange={(e) => setEditingAssessment({ ...editingAssessment, passingScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-555 dark:text-slate-400 block mb-1">Short Description:</label>
                <textarea
                  rows="2"
                  value={editingAssessment.description}
                  onChange={(e) => setEditingAssessment({ ...editingAssessment, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-medium"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAssessment(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Save Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">
                {editingStudent ? "Edit Student Profile" : "Add Student Profile"}
              </h3>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Roll Number (Unique):</label>
                <input
                  type="text"
                  required
                  placeholder="CS-2026-001"
                  value={studentForm.rollNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={studentForm.fullName}
                  onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  placeholder="student@codewave.com"
                  value={studentForm.email}
                  disabled={!!editingStudent}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-colors font-semibold disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Course Allocation:</label>
                  <select
                    value={studentForm.course}
                    onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 font-semibold"
                  >
                    <option value="">No Course</option>
                    {coursesList.map(c => (
                      <option key={c._id} value={c._id}>{c.courseName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Batch Allocation:</label>
                  <select
                    value={studentForm.batch}
                    onChange={(e) => setStudentForm({ ...studentForm, batch: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 font-semibold"
                  >
                    <option value="">No Batch</option>
                    {batchesList.map(b => (
                      <option key={b._id} value={b._id}>{b.batchName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Phone Number:</label>
                  <input
                    type="text"
                    placeholder="9998887770"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-colors font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Status:</label>
                  <select
                    value={studentForm.status}
                    onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 font-semibold"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Physical Address:</label>
                <textarea
                  rows="2"
                  placeholder="Residential address..."
                  value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-medium"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-605 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  {editingStudent ? "Save Changes" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Teacher Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">
                {editingTeacher ? "Edit Teacher Settings" : "Add Teacher Account"}
              </h3>
              <button
                onClick={() => setShowTeacherModal(false)}
                className="text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Teacher Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Smith"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  placeholder="teacher@codewave.com"
                  value={teacherForm.email}
                  disabled={!!editingTeacher}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-colors font-semibold disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Contact Phone:</label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Subjects (Comma separated):</label>
                <input
                  type="text"
                  placeholder="Data Structures, Java, C++"
                  value={teacherForm.subjects}
                  onChange={(e) => setTeacherForm({ ...teacherForm, subjects: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Qualification:</label>
                  <input
                    type="text"
                    placeholder="M.Tech CSE"
                    value={teacherForm.qualification}
                    onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Experience Years:</label>
                  <input
                    type="text"
                    placeholder="5 Years"
                    value={teacherForm.experience}
                    onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Salary (₹):</label>
                  <input
                    type="number"
                    value={teacherForm.salary}
                    onChange={(e) => setTeacherForm({ ...teacherForm, salary: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Status:</label>
                  <select
                    value={teacherForm.status}
                    onChange={(e) => setTeacherForm({ ...teacherForm, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 font-semibold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-605 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  {editingTeacher ? "Save Changes" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Sub-Admin Modal */}
      {showSubAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">
                {editingSubAdmin ? "Edit Sub-Admin Permissions" : "Create Sub-Admin Account"}
              </h3>
              <button
                onClick={() => setShowSubAdminModal(false)}
                className="text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubAdminSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Sub-Admin Name:</label>
                <input
                  type="text"
                  required
                  placeholder="Assistant Admin"
                  value={subAdminForm.fullName}
                  onChange={(e) => setSubAdminForm({ ...subAdminForm, fullName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  placeholder="subadmin@codewave.com"
                  value={subAdminForm.email}
                  disabled={!!editingSubAdmin}
                  onChange={(e) => setSubAdminForm({ ...subAdminForm, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-colors font-semibold disabled:opacity-50"
                />
              </div>

              {!editingSubAdmin && (
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Password:</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters..."
                    value={subAdminForm.password}
                    onChange={(e) => setSubAdminForm({ ...subAdminForm, password: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-colors font-semibold"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Contact Phone:</label>
                <input
                  type="text"
                  placeholder="7776665551"
                  value={subAdminForm.phone}
                  onChange={(e) => setSubAdminForm({ ...subAdminForm, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              {editingSubAdmin && (
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Status:</label>
                  <select
                    value={subAdminForm.status}
                    onChange={(e) => setSubAdminForm({ ...subAdminForm, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 font-semibold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Manage Permissions Permissions Matrix:</label>
                <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl">
                  {[
                    { label: "Students Portal", key: "manage_students" },
                    { label: "Teachers Portal", key: "manage_teachers" },
                    { label: "Domain Specializations", key: "manage_courses" },
                    { label: "Curriculum DSL Topics", key: "manage_topics" },
                    { label: "Milestone Assessments", key: "manage_assessments" },
                    { label: "Sub-Admins Controls", key: "manage_subadmins" },
                    { label: "Institute Settings", key: "manage_settings" }
                  ].map((perm) => (
                    <label key={perm.key} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subAdminForm.permissions.includes(perm.key)}
                        onChange={() => togglePermissionSelection(perm.key)}
                        className="rounded accent-emerald-600 dark:accent-indigo-500"
                      />
                      <span>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubAdminModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-605 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  {editingSubAdmin ? "Save Settings" : "Deploy Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Teacher Batches/Subjects Modal */}
      {showAssignTeacherModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">Assign Course Batches & Subjects</h3>
              <button
                onClick={() => {
                  setShowAssignTeacherModal(false);
                  setAssigningTeacherId('');
                }}
                className="text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAssignTeacherSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Subjects (Comma separated):</label>
                <input
                  type="text"
                  required
                  placeholder="Data Structures, Java, System Design"
                  value={assignTeacherForm.subjects}
                  onChange={(e) => setAssignTeacherForm({ ...assignTeacherForm, subjects: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Assign Batches (Hold Ctrl to select multiple):</label>
                <select
                  multiple
                  value={assignTeacherForm.batches}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setAssignTeacherForm({ ...assignTeacherForm, batches: values });
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-3 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-600 dark:focus:border-indigo-500 font-semibold h-32"
                >
                  {batchesList.map(b => (
                    <option key={b._id} value={b._id}>{b.batchName}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignTeacherModal(false);
                    setAssigningTeacherId('');
                  }}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-605 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Save Assignments
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Students Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-800 dark:text-white text-base">Bulk Import Students (CSV)</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  CSV must contain headers: <code className="bg-slate-100 dark:bg-slate-850 px-1 py-0.5 rounded font-black text-slate-700 dark:text-white">rollNumber, fullName, email, phone, address, courseName, batchName</code>
                </p>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportedData([]);
                  setImportErrors([]);
                }}
                className="text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border-2 border-dashed border-slate-250 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer relative hover:border-emerald-500 transition-colors">
                <FiUpload size={28} className="text-slate-400 dark:text-slate-500 mb-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">
                  Click to select CSV File
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {importErrors.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30 rounded-2xl space-y-1">
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block">CSV Errors & Warnings:</span>
                  <div className="max-h-24 overflow-y-auto text-[10px] font-bold text-rose-700 dark:text-rose-450 list-disc list-inside space-y-0.5">
                    {importErrors.map((err, i) => (
                      <div key={i}>&bull; {err}</div>
                    ))}
                  </div>
                </div>
              )}

              {importedData.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                    Data Preview Grid ({importedData.length} records parsed)
                  </span>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 max-h-60 bg-slate-50/50 dark:bg-slate-950/20">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[9px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                          <th className="p-3">Roll Number</th>
                          <th className="p-3">Full Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Course</th>
                          <th className="p-3">Batch</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 dark:divide-white/5 text-[11px] font-bold text-slate-750 dark:text-slate-300">
                        {importedData.map((row, idx) => (
                          <tr key={idx} className={row.fullName && row.email && row.rollNumber ? "" : "bg-rose-500/5"}>
                            <td className="p-3">{row.rollNumber || <span className="text-rose-500 italic">Missing</span>}</td>
                            <td className="p-3">{row.fullName || <span className="text-rose-500 italic">Missing</span>}</td>
                            <td className="p-3">{row.email || <span className="text-rose-500 italic">Missing</span>}</td>
                            <td className="p-3">{row.phone || <span className="text-slate-400 italic">None</span>}</td>
                            <td className="p-3 text-slate-500">{row.courseName || <span className="italic">None</span>}</td>
                            <td className="p-3 text-slate-500">{row.batchName || <span className="italic">None</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportedData([]);
                  setImportErrors([]);
                }}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-605 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={importedData.length === 0}
                onClick={handleImportSubmit}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black disabled:opacity-55 transition-colors"
              >
                Import Selected Rows
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">
                {editingCourse ? "Edit Course Settings" : "Create New Course"}
              </h3>
              <button
                onClick={() => setShowCourseModal(false)}
                className="text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCourseSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Course Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Engineering"
                  value={courseForm.courseName}
                  onChange={(e) => setCourseForm({ ...courseForm, courseName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Duration (Months/Weeks):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6 Months"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-555 dark:text-slate-400 block mb-1">Course Fee (₹):</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={courseForm.fees}
                  onChange={(e) => setCourseForm({ ...courseForm, fees: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Description:</label>
                <textarea
                  rows="3"
                  placeholder="Detailed course description..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-medium"
                ></textarea>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-2.5">Associate Subjects:</label>
                <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl max-h-40 overflow-y-auto">
                  {subjectsList.map((sub) => {
                    const isChecked = courseForm.subjects.includes(sub._id);
                    return (
                      <label key={sub._id} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const newSubjects = isChecked
                              ? courseForm.subjects.filter(id => id !== sub._id)
                              : [...courseForm.subjects, sub._id];
                            setCourseForm({ ...courseForm, subjects: newSubjects });
                          }}
                          className="rounded accent-emerald-650 dark:accent-indigo-500"
                        />
                        <span>{sub.subjectName}</span>
                      </label>
                    );
                  })}
                  {subjectsList.length === 0 && (
                    <span className="text-[10px] text-slate-400 italic col-span-2">No subjects available. Add subjects first.</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-605 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  {editingCourse ? "Save Changes" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">
                {editingSubject ? "Edit Subject Details" : "Create New Subject"}
              </h3>
              <button
                onClick={() => setShowSubjectModal(false)}
                className="text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubjectSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Subject Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Data Structures"
                  value={subjectForm.subjectName}
                  onChange={(e) => setSubjectForm({ ...subjectForm, subjectName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Subject Code:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-301"
                  value={subjectForm.subjectCode}
                  onChange={(e) => setSubjectForm({ ...subjectForm, subjectCode: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Description:</label>
                <textarea
                  rows="3"
                  placeholder="Short description of topics covered..."
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-medium"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-605 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  {editingSubject ? "Save Changes" : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-800 dark:text-white text-base">
                {editingBatch ? "Edit Batch Settings" : "Create New Batch"}
              </h3>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleBatchSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Batch Name (Unique):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FSE-2026-A"
                  value={batchForm.batchName}
                  onChange={(e) => setBatchForm({ ...batchForm, batchName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Course:</label>
                  <select
                    required
                    value={batchForm.course}
                    onChange={(e) => setBatchForm({ ...batchForm, course: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-855 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                  >
                    <option value="" disabled>Select Course</option>
                    {coursesList.map(c => (
                      <option key={c._id} value={c._id}>{c.courseName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Capacity Limit:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={batchForm.capacity}
                    onChange={(e) => setBatchForm({ ...batchForm, capacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Start Date:</label>
                  <input
                    type="date"
                    required
                    value={batchForm.startDate}
                    onChange={(e) => setBatchForm({ ...batchForm, startDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">End Date (Optional):</label>
                  <input
                    type="date"
                    value={batchForm.endDate}
                    onChange={(e) => setBatchForm({ ...batchForm, endDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Timings (e.g. 9-11 AM):</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 06:00 PM - 08:00 PM"
                    value={batchForm.timing}
                    onChange={(e) => setBatchForm({ ...batchForm, timing: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-1">Academic Session:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026-2027"
                    value={batchForm.academicSession}
                    onChange={(e) => setBatchForm({ ...batchForm, academicSession: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-555 dark:text-slate-400 block mb-1">Batch Status:</label>
                  <select
                    value={batchForm.status}
                    onChange={(e) => setBatchForm({ ...batchForm, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 font-semibold"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 block mb-2.5">Assign Instructors (Teachers):</label>
                <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl max-h-40 overflow-y-auto">
                  {allTeachers.map((tea) => {
                    const isChecked = batchForm.teachers.includes(tea._id);
                    return (
                      <label key={tea._id} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-355 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const newTeachers = isChecked
                              ? batchForm.teachers.filter(id => id !== tea._id)
                              : [...batchForm.teachers, tea._id];
                            setBatchForm({ ...batchForm, teachers: newTeachers });
                          }}
                          className="rounded accent-emerald-655 dark:accent-indigo-500"
                        />
                        <span>{tea.name}</span>
                      </label>
                    );
                  })}
                  {allTeachers.length === 0 && (
                    <span className="text-[10px] text-slate-405 italic col-span-2">No teachers available.</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-605 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  {editingBatch ? "Save Changes" : "Create Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate Students Modal */}
      {showAllocateStudentsModal && allocatingBatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-800 dark:text-white text-base">
                  Allocate Students to {allocatingBatch.batchName}
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                  Capacity: {allocatingBatch.capacity} Students | Selected: {tempSelectedStudentIds.length}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowAllocateStudentsModal(false);
                  setAllocatingBatch(null);
                }}
                className="text-slate-500 hover:text-slate-855 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students by roll number or name..."
                value={allocateStudentsSearch}
                onChange={(e) => setAllocateStudentsSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-colors font-semibold"
              />
            </div>

            {tempSelectedStudentIds.length > allocatingBatch.capacity && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-450 rounded-xl text-xs font-bold text-center">
                ⚠️ Warning: Selected students count ({tempSelectedStudentIds.length}) exceeds batch capacity ({allocatingBatch.capacity}). Allocation will fail.
              </div>
            )}

            <form onSubmit={handleAllocateStudentsSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl max-h-60 overflow-y-auto space-y-2">
                {allStudentsForAllocation
                  .filter(std => {
                    const searchLower = allocateStudentsSearch.toLowerCase();
                    return std.fullName.toLowerCase().includes(searchLower) ||
                           std.rollNumber.toLowerCase().includes(searchLower) ||
                           std.email.toLowerCase().includes(searchLower);
                  })
                  .map((std) => {
                    const isChecked = tempSelectedStudentIds.includes(std._id);
                    return (
                      <label key={std._id} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-white/5 hover:border-emerald-500/30 dark:hover:border-indigo-500/30 cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const newSelected = isChecked
                                ? tempSelectedStudentIds.filter(id => id !== std._id)
                                : [...tempSelectedStudentIds, std._id];
                              setTempSelectedStudentIds(newSelected);
                            }}
                            className="rounded accent-emerald-650 dark:accent-indigo-500"
                          />
                          <div className="text-xs">
                            <span className="font-bold text-slate-800 dark:text-white block">{std.fullName}</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{std.rollNumber} &bull; {std.email}</span>
                          </div>
                        </div>
                        {std.batch && std.batch._id !== allocatingBatch._id && (
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/20 px-2 py-0.5 rounded">
                            In batch: {std.batch.batchName}
                          </span>
                        )}
                      </label>
                    );
                  })}
                {allStudentsForAllocation.length === 0 && (
                  <span className="text-[10px] text-slate-405 italic block text-center py-4">No students available.</span>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAllocateStudentsModal(false);
                    setAllocatingBatch(null);
                  }}
                  className="w-1/2 py-2.5 bg-slate-105 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-605 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={tempSelectedStudentIds.length > allocatingBatch.capacity}
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black disabled:opacity-55 transition-colors"
                >
                  Save Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Allocate Subjects Modal */}
      {showAllocateSubjectsModal && allocatingBatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-800 dark:text-white text-base">
                  Assign Subjects to {allocatingBatch.batchName}
                </h3>
                <span className="text-[10px] text-slate-550 dark:text-slate-400 block mt-1">
                  Select which curriculum subjects are active in this batch
                </span>
              </div>
              <button
                onClick={() => {
                  setShowAllocateSubjectsModal(false);
                  setAllocatingBatch(null);
                }}
                className="text-slate-500 hover:text-slate-855 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAllocateSubjectsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-2xl max-h-60 overflow-y-auto">
                {subjectsList.map((sub) => {
                  const isChecked = tempSelectedSubjectIds.includes(sub._id);
                  return (
                    <label key={sub._id} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const newSelected = isChecked
                            ? tempSelectedSubjectIds.filter(id => id !== sub._id)
                            : [...tempSelectedSubjectIds, sub._id];
                          setTempSelectedSubjectIds(newSelected);
                        }}
                        className="rounded accent-emerald-650 dark:accent-indigo-500"
                      />
                      <span>{sub.subjectName}</span>
                    </label>
                  );
                })}
                {subjectsList.length === 0 && (
                  <span className="text-[10px] text-slate-400 italic col-span-2 text-center py-4">No subjects defined.</span>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAllocateSubjectsModal(false);
                    setAllocatingBatch(null);
                  }}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-605 dark:text-slate-400 rounded-xl text-xs font-black hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors"
                >
                  Save Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
