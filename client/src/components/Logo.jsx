import React from 'react';

export default function Logo({ className = "w-9 h-9", textClassName = "text-xl", hideText = false }) {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className={`${className} rounded-xl bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-extrabold shadow-md group-hover:scale-105 transition-transform shrink-0`}>
        {/* CodeWave logo symbol */}
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
          <path d="M12 3v12" />
        </svg>
      </div>
      {!hideText && (
        <div className="text-left">
          <h1 className={`${textClassName} font-black tracking-tight text-[var(--text-main)] leading-none`}>
            CodeWave <span className="text-[var(--primary)]">Solution</span>
          </h1>
          <div className="text-[8px] font-black text-[var(--secondary)] uppercase tracking-[0.15em] mt-0.5">Institute Coaching</div>
        </div>
      )}
    </div>
  );
}
