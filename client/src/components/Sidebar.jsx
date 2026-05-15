import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiMap, FiList, FiCheckSquare, 
  FiMessageSquare, FiSettings, FiLogOut, FiUsers, FiGift, FiUser, FiBookOpen
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
    { name: 'Domains', path: '/domains', icon: <FiList /> },
    { name: 'Roadmap', path: '/roadmap', icon: <FiMap /> },
    { name: 'Assessments', path: '/assessments', icon: <FiCheckSquare /> },
    { name: 'Free Resources', path: '/resources', icon: <FiGift /> },
    { name: 'Career Guide', path: '/career-guide', icon: <FiBookOpen /> },
    { name: 'AI Career Agent', path: '/ai-mentor', icon: <FiMessageSquare /> },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: <MdOutlineDashboard /> },
    { name: 'Manage Users', path: '/admin/users', icon: <FiUsers /> },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <div className="sidebar hidden lg:flex">
      <div className="flex flex-col h-full">
        {/* Brand */}
        <div className="mb-10 px-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4361ee] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-100">CF</div>
          <h1 className="text-xl font-bold text-[#101828] tracking-tight">CareerForge</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1.5">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="text-xl opacity-80">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User & Actions */}
        <div className="mt-auto pt-6 border-t border-[#eaecf0]">
          <div className="px-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f9fafb] border border-[#eaecf0] flex items-center justify-center text-[#475467]">
              <FiUser />
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-[#101828] truncate">{user?.name || 'Student'}</div>
              <div className="text-[10px] text-[#667085] font-medium truncate uppercase tracking-widest">Engineering</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            {!isAdmin && (
              <NavLink to="/setup-profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <FiSettings className="text-xl opacity-80" /> Settings
              </NavLink>
            )}
            <button 
              onClick={handleLogout} 
              className="sidebar-link w-full text-left hover:bg-red-50 hover:text-red-600 group transition-colors"
            >
              <FiLogOut className="text-xl opacity-80 group-hover:text-red-600" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
