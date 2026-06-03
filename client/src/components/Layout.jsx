import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import GlobalAiChat from './GlobalAiChat';

const Layout = ({ isAdmin = false }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('careerforge_theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Listen to global theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('careerforge_theme') || 'light');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  return (
    <div className="flex flex-col bg-[var(--bg-main)] min-h-screen text-[var(--text-main)] transition-colors duration-300 relative">
      <Navbar isAdmin={isAdmin} />
      <main className="flex-1 overflow-y-auto bg-[var(--bg-main)] relative">
        <Outlet />
      </main>
      <GlobalAiChat />
    </div>
  );
};

export default Layout;
