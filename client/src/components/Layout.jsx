import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ isAdmin = false }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('careerforge_theme') || 'light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

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

  // Close sidebar on page navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex bg-[var(--bg-main)] min-h-screen text-[var(--text-main)] transition-colors duration-300 relative">
      <Sidebar isAdmin={isAdmin} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-[280px] ml-0 transition-all">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-[var(--bg-main)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
