import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiMap, FiList, FiCheckSquare, 
  FiMessageSquare, FiSettings, FiLogOut, FiUsers, FiGift, FiUser, FiBookOpen, FiZap,
  FiX
} from 'react-icons/fi';
import { MdOutlineDashboard } from "react-icons/md";

const Sidebar = ({ isAdmin, isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdOutlineDashboard /> },
    { name: 'Zero to Coding', path: '/zero-to-coding', icon: <FiZap className="text-[var(--primary)] font-black" /> },
    { name: 'Mission Map', path: '/roadmap', icon: <FiMap /> },
    { name: 'Domains', path: '/domains', icon: <FiList /> },
    { name: 'Assessments', path: '/assessments', icon: <FiCheckSquare /> },
    { name: 'Free Resources', path: '/resources', icon: <FiGift /> },
    { name: 'Career Guide', path: '/career-guide', icon: <FiBookOpen /> },
    { name: 'Code Guru', path: '/code-guru', icon: <FiMessageSquare /> },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: <MdOutlineDashboard /> },
    { name: 'Manage Users', path: '/admin/users', icon: <FiUsers /> },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer Container */}
      <div className={`sidebar flex transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full w-full">
          {/* Brand & Mobile Close button */}
          <div className="mb-10 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25">CF</div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[var(--text-main)]">CareerForge</h1>
                <div className="text-[9px] font-black text-[var(--primary)] uppercase tracking-[0.2em] -mt-1">Future Architect</div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-[var(--bg-sub)] rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              title="Close Menu"
            >
              <FiX className="text-xl" />
            </button>
          </div>


        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1 no-scrollbar">
          <div className="text-[9px] font-black text-[var(--text-light)] uppercase tracking-widest mb-3 px-4">Navigation</div>
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-bold">{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User & Experience Section */}
        <div className="mt-auto pt-6 border-t border-[var(--border)]">
          {!isAdmin && (
            <div className="px-4 mb-6">
              <div className="card p-4 bg-[var(--bg-sub)] border-[var(--border)] relative overflow-hidden group">
                <FiZap className="absolute -right-2 -bottom-2 text-4xl text-amber-500/10 group-hover:scale-125 transition-transform" />
                <div className="flex justify-between items-center mb-3">
                  <div className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Experience</div>
                  <div className="text-xs font-black text-[var(--text-main)]">{user?.xp || 0} XP</div>
                </div>
                <div className="progress-container h-1.5 bg-slate-200 dark:bg-zinc-800">
                  <div className="progress-bar-fill bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${Math.min(100, ((user?.xp || 0) % 1000) / 10)}%` }}></div>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 mb-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] flex items-center justify-center text-[var(--primary)] text-xl font-black shadow-sm">
              {user?.fullName?.charAt(0) || 'S'}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-black text-[var(--text-main)] truncate">{user?.fullName || 'Student'}</div>
              <div className="text-[9px] text-[var(--text-light)] font-bold truncate uppercase tracking-widest">Level {user?.currentPhase || 0} Member</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            {!isAdmin && (
              <NavLink to="/setup-profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} text-sm`}>
                <FiSettings className="text-lg opacity-60" /> Settings
              </NavLink>
            )}
            <button 
              onClick={handleLogout} 
              className="sidebar-link w-full text-left hover:bg-rose-500/10 hover:text-rose-500 group transition-colors text-sm"
            >
              <FiLogOut className="text-lg opacity-60 group-hover:text-rose-500" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
