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

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [topics, setTopics] = useState([]);
  const [assessments, setAssessments] = useState([]);
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'domains' | 'topics' | 'assessments'
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

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, domainsRes, coursesRes, batchesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/domains'),
        api.get('/institute/courses'),
        api.get('/institute/batches')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
      setDomains(domainsRes.data.data || []);
      setCoursesList(coursesRes.data.data || []);
      setBatchesList(batchesRes.data.data || []);
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

  useEffect(() => {
    if (activeTab === 'users') {
      if (userSubTab === 'students') {
        fetchStudents(1);
      } else if (userSubTab === 'teachers') {
        fetchTeachers(1);
      } else if (userSubTab === 'subadmins') {
        fetchSubAdmins();
      }
    }
  }, [activeTab, userSubTab]);

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
          </div>
        </div>
      </div>

      {/* Statistics Overview row (only show on other management tabs) */}
      {activeTab !== 'overview' && (
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
                    { label: "Sub-Admins Controls", key: "manage_subadmins" }
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
    </div>
  );
};

export default AdminDashboard;
