import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { 
  FiMap, FiList, FiCheckSquare, FiAward, FiMessageSquare, FiTrendingUp,
  FiUsers, FiBookOpen, FiClock, FiFileText, FiDollarSign, FiFolder, FiBell, FiZap,
  FiMenu, FiX, FiLogOut, FiSettings, FiBriefcase, FiPlay, FiVideo
} from 'react-icons/fi';
import { MdOutlineDashboard, MdOutlineManageAccounts } from "react-icons/md";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: <MdOutlineDashboard /> },
    { name: 'Roadmap', path: '/student/roadmap', icon: <FiMap /> },
    { name: 'My Courses', path: '/student/courses', icon: <FiBookOpen /> },
    { name: 'Live Classes', path: '/student/live-classes', icon: <FiVideo /> },
    { name: 'Video Lectures', path: '/student/video-lectures', icon: <FiPlay /> },
    { name: 'Notes & Materials', path: '/student/notes', icon: <FiFolder /> },
    { name: 'Assignments', path: '/student/assignments', icon: <FiFileText /> },
    { name: 'Assessments', path: '/student/assessments', icon: <FiCheckSquare /> },
    { name: 'Attendance', path: '/student/attendance', icon: <FiClock /> },
    { name: 'Results', path: '/student/results', icon: <FiAward /> },
    { name: 'Notifications', path: '/student/notifications', icon: <FiBell /> },
    { name: 'Profile', path: '/student/profile', icon: <FiUsers /> },
  ];

  const teacherLinks = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: <MdOutlineDashboard /> },
    { name: 'My Batches', path: '/teacher/batches', icon: <FiUsers /> },
    { name: 'Students', path: '/teacher/students', icon: <FiUsers /> },
    { name: 'Attendance', path: '/teacher/attendance', icon: <FiClock /> },
    { name: 'Live Classes', path: '/teacher/live-classes', icon: <FiVideo /> },
    { name: 'Video Lectures', path: '/teacher/video-lectures', icon: <FiPlay /> },
    { name: 'Notes', path: '/teacher/notes', icon: <FiFolder /> },
    { name: 'Assignments', path: '/teacher/assignments', icon: <FiFileText /> },
    { name: 'Assessments', path: '/teacher/assessments', icon: <FiCheckSquare /> },
    { name: 'Results', path: '/teacher/results', icon: <FiAward /> },
    { name: 'Notifications', path: '/teacher/notifications', icon: <FiBell /> },
    { name: 'Profile', path: '/teacher/profile', icon: <FiSettings /> },
  ];

  const careerLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdOutlineDashboard /> },
    { name: 'Domains', path: '/domains', icon: <FiList /> },
    { name: 'Roadmaps', path: '/roadmap', icon: <FiMap /> },
    { name: 'Assessments', path: '/assessments', icon: <FiCheckSquare /> },
    { name: 'Badges & Stats', path: '/profile', icon: <FiAward /> },
    { name: 'CodeWave AI', path: '/code-guru', icon: <FiMessageSquare /> },
    { name: 'Zero to Coding', path: '/zero-to-coding', icon: <FiZap /> },
    { name: 'Cloud Credits', path: '/resources', icon: <FiBriefcase /> },
  ];

  const instituteLinks = [
    { name: 'Attendance', path: '/institute/attendance', icon: <FiClock />, roles: ['admin', 'teacher', 'student'] },
    { name: 'Schedule', path: '/institute/schedule', icon: <FiTrendingUp />, roles: ['admin', 'teacher', 'student'] },
    { name: 'Notices', path: '/institute/notices', icon: <FiBell />, roles: ['admin', 'teacher', 'student'] },
    { name: 'Materials', path: '/institute/materials', icon: <FiFolder />, roles: ['admin', 'teacher', 'student'] },
    { name: 'Assignments', path: '/institute/assignments', icon: <FiFileText />, roles: ['admin', 'teacher', 'student'] },
    { name: 'Fees', path: '/institute/fees', icon: <FiDollarSign />, roles: ['admin', 'student'] },
    { name: 'Students', path: '/institute/students', icon: <FiUsers />, roles: ['admin', 'teacher'] },
    { name: 'Roadmap Monitor', path: '/institute/roadmap-progress', icon: <FiMap />, roles: ['admin', 'teacher'] },
    { name: 'Teachers', path: '/institute/teachers', icon: <MdOutlineManageAccounts />, roles: ['admin'] },
    { name: 'Courses', path: '/institute/courses', icon: <FiBookOpen />, roles: ['admin'] },
    { name: 'Batches', path: '/institute/batches', icon: <FiUsers />, roles: ['admin', 'teacher'] },
  ];

  const adminLinks = [
    { name: 'Manage Users', path: '/admin/users', icon: <FiUsers /> },
    { name: 'Problem Bank', path: '/admin/problems', icon: <FiFileText /> },
    { name: 'Submissions', path: '/admin/submissions', icon: <FiAward /> },
    { name: 'Topics', path: '/admin/topics', icon: <FiBookOpen /> },
  ];

  const filteredInstLinks = instituteLinks.filter(link => !link.roles || link.roles.includes(user.role));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--bg-card)] border-r border-[var(--border)] py-6 px-4 overflow-y-auto no-scrollbar select-none">
      {/* Header Logo */}
      <div className="mb-8 pl-2">
        <Logo />
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 space-y-7">
        
        {user.role === 'student' ? (
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider pl-3 mb-2.5">
                Student Portal
              </div>
              <nav className="space-y-1">
                {studentLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive 
                          ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20' 
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)]'
                      }`
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
            <div>
              <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider pl-3 mb-2.5">
                Career Development Hub
              </div>
              <nav className="space-y-1">
                {careerLinks.filter(link => !['/dashboard', '/profile', '/assessments'].includes(link.path)).map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive 
                          ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20' 
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)]'
                      }`
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        ) : user.role === 'teacher' ? (
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider pl-3 mb-2.5">
                Teacher Portal
              </div>
              <nav className="space-y-1">
                {teacherLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive 
                          ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20' 
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)]'
                      }`
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
            <div>
              <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider pl-3 mb-2.5">
                Career Development Hub
              </div>
              <nav className="space-y-1">
                {careerLinks.filter(link => !['/dashboard', '/profile', '/assessments'].includes(link.path)).map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive 
                          ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20' 
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)]'
                      }`
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        ) : (
          <>
            {/* Section 1: Career Development Hub */}
            <div>
              <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider pl-3 mb-2.5">
                Career Development Hub
              </div>
              <nav className="space-y-1">
                {careerLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive 
                          ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20' 
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)]'
                      }`
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Section 2: Institute Management */}
            <div>
              <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider pl-3 mb-2.5">
                Institute Management
              </div>
              <nav className="space-y-1">
                {filteredInstLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive 
                          ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20' 
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)]'
                      }`
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Section 3: Admin Panel */}
            {user.role === 'admin' && (
              <div>
                <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-wider pl-3 mb-2.5">
                  Admin Panel
                </div>
                <nav className="space-y-1">
                  {adminLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          isActive 
                            ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20' 
                            : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)]'
                        }`
                      }
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer User Info & Logout */}
      <div className="mt-8 pt-4 border-t border-[var(--border)] flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] font-black shadow-sm shrink-0">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-black text-[var(--text-main)] truncate">{user.fullName}</h4>
            <p className="text-[9px] text-[var(--text-light)] uppercase font-extrabold tracking-wider truncate">{user.role}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
        >
          <FiLogOut className="text-lg" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg-card)] sticky top-0 z-30">
        <Logo />
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-sub)]"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="relative w-64 h-full animate-fade-in shadow-2xl" onClick={() => setIsOpen(false)}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
