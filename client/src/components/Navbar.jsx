import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiBell, FiSearch, FiSun, FiMoon } from 'react-icons/fi';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('careerforge_theme') || 'light');

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

  return (
    <header className="h-20 border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 lg:px-8 transition-colors duration-300">
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick}
          className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-main)] p-2 hover:bg-[var(--bg-sub)] rounded-xl transition-all"
        >
          <FiMenu className="text-2xl" />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-[var(--bg-sub)] border border-[var(--border)] px-4 py-2 rounded-xl w-72">
          <FiSearch className="text-[var(--text-light)]" />
          <input 
            type="text" 
            placeholder="Search topics..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[var(--text-light)] text-[var(--text-main)]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark/Light Mode Toggler */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)] rounded-xl transition-all duration-300"
          title={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
        >
          {theme === 'dark' ? (
            <FiSun className="text-xl text-amber-400 rotate-0 transition-transform duration-500" />
          ) : (
            <FiMoon className="text-xl text-indigo-500 rotate-0 transition-transform duration-500" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)] rounded-xl transition-all">
          <FiBell className="text-xl" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-[var(--bg-card)]"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-5 border-l border-[var(--border)]">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-black text-[var(--text-main)]">{user?.fullName || 'User'}</p>
            <p className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-widest">{user?.role || 'student'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] font-bold text-lg shadow-sm">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
