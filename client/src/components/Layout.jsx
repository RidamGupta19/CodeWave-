import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import GlobalAiChat from './GlobalAiChat';

const Layout = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('codewave_theme') || 'light');

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
      setTheme(localStorage.getItem('codewave_theme') || 'light');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row bg-[var(--bg-main)] min-h-screen text-[var(--text-main)] transition-colors duration-300 relative">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[var(--bg-main)] relative p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
      <GlobalAiChat />
    </div>
  );
};

export default Layout;
