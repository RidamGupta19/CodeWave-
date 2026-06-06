import React from 'react';
import { FiLoader } from 'react-icons/fi';

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--bg-main)] flex flex-col items-center justify-center transition-all duration-500 animate-fade-in">
      <div className="relative flex flex-col items-center">
        {/* Glow behind loader */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[var(--primary)]/20 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Spinner */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-[var(--border)] relative overflow-hidden">
            <div className="absolute inset-0 border-t-4 border-[var(--primary)] rounded-full animate-spin"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-[var(--shadow-bubbly)]">
            <span className="text-white font-black text-xs">CF</span>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight mb-2">Waking up the Forge</h2>
        <p className="text-[var(--text-muted)] text-sm font-semibold max-w-xs text-center animate-pulse">
          Starting our secure servers... This may take up to 30 seconds if they are asleep.
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;
