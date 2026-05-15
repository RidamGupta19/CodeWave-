import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-[#eaecf0] bg-white/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-6">
        <button className="lg:hidden text-[#475467] hover:text-[#101828]">
          <FiMenu className="text-2xl" />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-[#f9fafb] border border-[#eaecf0] px-4 py-2 rounded-xl w-72">
          <FiSearch className="text-[#98a2b3]" />
          <input 
            type="text" 
            placeholder="Search topics..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#98a2b3] text-[#101828]"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative p-2.5 text-[#475467] hover:text-[#101828] hover:bg-[#f9fafb] rounded-xl transition-all">
          <FiBell className="text-xl" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#4361ee] rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-5 border-l border-[#eaecf0]">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-[#101828]">{user?.fullName || 'User'}</p>
            <p className="text-[10px] text-[#667085] font-bold uppercase tracking-widest">{user?.role || 'student'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4361ee] font-bold text-lg shadow-sm">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
