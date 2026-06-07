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
  FiFileText
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [topics, setTopics] = useState([]);
  const [assessments, setAssessments] = useState([]);
  
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'domains' | 'topics' | 'assessments'
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

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, domainsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/domains')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
      setDomains(domainsRes.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load administration workspace data');
    } finally {
      setLoading(false);
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

      {/* Statistics Overview row */}
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

      {/* Tabs panels */}
      {activeTab === 'users' && (
        <div className="admin-panel bg-white dark:bg-slate-900/40 border border-slate-150 dark:border-white/5 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
          {/* Controls toolbar */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search registered teammates or students by name/email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500 transition-all font-semibold"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Privilege Filter:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950/45 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500"
              >
                <option value="all">Show All Users</option>
                <option value="student">Students Only</option>
                <option value="mentor">Mentors Only</option>
                <option value="admin">Admins Only</option>
              </select>
            </div>
          </div>

          {/* Users Grid/Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-slate-950/40 text-[10px] font-black text-slate-550 dark:text-slate-400 uppercase tracking-widest">
                  <th className="p-4">User Identity</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Selected Specialization</th>
                  <th className="p-4">XP & Progress</th>
                  <th className="p-4">Academic details</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-indigo-600/20 border border-emerald-100 dark:border-indigo-500/20 text-emerald-700 dark:text-indigo-400 font-black text-sm flex items-center justify-center">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 dark:text-white text-xs block">{user.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 rounded-lg px-2 py-1.5 text-[10px] font-black text-emerald-700 dark:text-indigo-300 uppercase tracking-wider focus:outline-none focus:border-emerald-650 dark:focus:border-indigo-500"
                        >
                          <option value="student">Student</option>
                          <option value="mentor">Mentor</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                      <td className="p-4">
                        {user.selectedDomain ? (
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-lg">
                            🚀 {user.selectedDomain.name}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Unselected</span>
                        )}
                      </td>
                      <td className="p-4 space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black">
                          <span className="text-amber-600 dark:text-amber-400">{user.xp || 0} XP • Lvl {Math.floor((user.xp || 0) / 1000) + 1}</span>
                          <span className="text-emerald-700 dark:text-indigo-400">{user.overallProgress || 0}% Complete</span>
                        </div>
                        <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-950/80 rounded-full overflow-hidden border border-slate-300/40 dark:border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-indigo-500 dark:to-indigo-400 transition-all duration-300"
                            style={{ width: `${user.overallProgress || 0}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="p-4">
                        {user.profile?.collegeName ? (
                          <div>
                            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold block">{user.profile.collegeName.substring(0, 25)}</span>
                            <span className="text-[9px] text-slate-550 dark:text-slate-550 font-semibold block">{user.profile.branch} • Year {user.profile.year}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">No academic profile</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openPersonalizeDrawer(user)}
                            className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-indigo-600/10 text-emerald-700 dark:text-indigo-400 border border-emerald-100 dark:border-indigo-500/10 flex items-center justify-center text-xs hover:bg-emerald-600 dark:hover:bg-indigo-600 hover:text-white transition-all"
                            title="Personalize & View details"
                          >
                            <FiEye />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10 dark:border-rose-500/10 flex items-center justify-center text-xs hover:bg-rose-500 hover:text-white transition-all"
                            title="Delete User"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 text-xs font-semibold">
                      No users match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
    </div>
  );
};

export default AdminDashboard;
