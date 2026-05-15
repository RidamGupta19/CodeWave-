import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ isAdmin = false }) => {
  return (
    <div className="flex bg-[#fcfcfd] min-h-screen text-[#101828]">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col lg:ml-[280px] ml-0 transition-all">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
