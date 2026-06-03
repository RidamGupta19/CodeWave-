import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiMenu, FiX, FiBell, FiSearch, FiSun, FiMoon, FiLogOut, FiSettings,
  FiMap, FiList, FiCheckSquare, FiMessageSquare, FiGift, FiBookOpen, FiZap, FiUsers
} from 'react-icons/fi';
import { MdOutlineDashboard } from "react-icons/md";

const Navbar = ({ isAdmin }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('careerforge_theme') || 'light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('careerforge_theme') || 'light');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('careerforge_theme', nextTheme);
    window.dispatchEvent(new Event('themechange'));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdOutlineDashboard /> },
    { name: 'Zero to Coding', path: '/zero-to-coding', icon: <FiZap className="text-[var(--primary)] font-black" /> },
    { name: 'Roadmaps', path: '/roadmap', icon: <FiMap /> },
    { name: 'Domains', path: '/domains', icon: <FiList /> },
    { name: 'Code Guru', path: '/code-guru', icon: <FiMessageSquare /> },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: <MdOutlineDashboard /> },
    { name: 'Manage Users', path: '/admin/users', icon: <FiUsers /> }, // Note: Need to import FiUsers if used
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      <header className="h-[72px] border-b border-[var(--border)] bg-[var(--bg-card)]/90 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8 transition-colors duration-300">
        
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3 lg:gap-6">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-main)] p-2 hover:bg-[var(--bg-sub)] rounded-xl transition-all"
          >
            <FiMenu className="text-2xl" />
          </button>
          
          <Link to="/" className="flex items-center gap-2 group outline-none">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform shrink-0">
              CF
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tight text-[var(--text-main)] leading-none">CareerForge</h1>
              <div className="text-[8px] font-black text-[var(--secondary)] uppercase tracking-[0.2em] mt-0.5">Geek in Training</div>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 xl:px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)]'
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span className="whitespace-nowrap">{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search (Desktop Only) */}
          <div className="hidden xl:flex items-center gap-2 bg-[var(--bg-sub)] border border-[var(--border)] px-3 py-1.5 rounded-xl w-48 focus-within:border-[var(--primary)] transition-colors">
            <FiSearch className="text-[var(--text-light)] shrink-0" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-xs w-full placeholder:text-[var(--text-light)] text-[var(--text-main)]"
            />
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)] rounded-xl transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <FiSun className="text-lg text-amber-400" /> : <FiMoon className="text-lg text-indigo-500" />}
          </button>

          <button className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)] rounded-xl transition-all">
            <FiBell className="text-lg" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
          </button>
          
          <div className="relative border-l border-[var(--border)] pl-2 sm:pl-4">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-[var(--bg-sub)] transition-colors border border-transparent focus:border-[var(--border)]"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] font-bold text-sm shadow-sm shrink-0">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-black text-[var(--text-main)] leading-none">{user?.fullName?.split(' ')[0] || 'User'}</p>
                <p className="text-[8px] text-[var(--text-light)] font-black uppercase tracking-widest mt-0.5">{user?.xp || 0} XP</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden py-1">
                  <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-sub)]/50">
                    <p className="text-sm font-black text-[var(--text-main)] truncate">{user?.fullName}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                  </div>
                  {!isAdmin && (
                    <Link to="/setup-profile" className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)] transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                      <FiSettings /> Settings
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-72 max-w-full bg-[var(--bg-card)] h-full shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-extrabold text-sm shadow-md">CF</div>
                <h1 className="text-lg font-black tracking-tight text-[var(--text-main)]">CareerForge</h1>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-sub)] rounded-lg">
                <FiX className="text-xl" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
              <div className="text-[10px] font-black text-[var(--text-light)] uppercase tracking-widest px-3 mb-2">Navigation</div>
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-[var(--primary)] text-white shadow-md' 
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)]'
                    }`
                  }
                >
                  <span className="text-xl">{link.icon}</span>
                  {link.name}
                </NavLink>
              ))}
            </nav>
            {!isAdmin && (
              <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-sub)]/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] font-bold shadow-sm shrink-0">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-black text-[var(--text-main)]">{user?.fullName || 'User'}</div>
                    <div className="text-[10px] text-[var(--secondary)] font-bold uppercase tracking-widest">{user?.xp || 0} XP Earned</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
