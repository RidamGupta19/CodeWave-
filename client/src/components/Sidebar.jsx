import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiMap, FiList, FiCheckSquare, 
  FiMessageSquare, FiSettings, FiLogOut, FiUsers, FiGift, FiUser, FiBookOpen, FiZap
} from 'react-icons/fi';
import { MdOutlineDashboard } from "react-icons/md";

const Sidebar = ({ isAdmin }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdOutlineDashboard /> },
    { name: 'Mission Map', path: '/roadmap', icon: <FiMap /> },
    { name: 'Domains', path: '/domains', icon: <FiList /> },
    { name: 'Assessments', path: '/assessments', icon: <FiCheckSquare /> },
    { name: 'Free Resources', path: '/resources', icon: <FiGift /> },
    { name: 'Career Guide', path: '/career-guide', icon: <FiBookOpen /> },
    { name: 'AI Mentor', path: '/ai-mentor', icon: <FiMessageSquare /> },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: <MdOutlineDashboard /> },
    { name: 'Manage Users', path: '/admin/users', icon: <FiUsers /> },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <div className="sidebar hidden lg:flex">
      <div className="flex flex-col h-full w-full">
        {/* Brand */}
        <div className="mb-12 px-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">CF</div>
          <div>
            <h1 className="text-2xl font-black text-[#1a1a1a] tracking-tight">CareerForge</h1>
            <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] -mt-1">Future Architect</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-4">Navigation</div>
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
        <div className="mt-auto pt-8">
          {!isAdmin && (
            <div className="px-4 mb-8">
              <div className="card p-4 bg-gray-50 border-gray-100 relative overflow-hidden group">
                <FiZap className="absolute -right-2 -bottom-2 text-4xl text-amber-500/10 group-hover:scale-125 transition-transform" />
                <div className="flex justify-between items-center mb-3">
                  <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Experience</div>
                  <div className="text-xs font-black text-amber-900">{user?.xp || 0} XP</div>
                </div>
                <div className="progress-container h-1.5 bg-gray-200">
                  <div className="progress-bar-fill bg-amber-500" style={{ width: `${((user?.xp || 0) % 1000) / 10}%` }}></div>
                </div>
              </div>
            </div>
          )}

          <div className="px-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center text-primary text-xl font-black shadow-sm">
              {user?.fullName?.charAt(0) || 'S'}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-black text-[#1a1a1a] truncate">{user?.fullName || 'Student'}</div>
              <div className="text-[10px] text-gray-400 font-bold truncate uppercase tracking-widest">Level {user?.currentPhase || 0} Member</div>
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
              className="sidebar-link w-full text-left hover:bg-red-50 hover:text-red-600 group transition-colors text-sm"
            >
              <FiLogOut className="text-lg opacity-60 group-hover:text-red-600" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
