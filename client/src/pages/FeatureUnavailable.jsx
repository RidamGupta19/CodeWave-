import React from 'react';
import { Link } from 'react-router-dom';
import { FiLock, FiArrowLeft } from 'react-icons/fi';

export default function FeatureUnavailable() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
        
        {/* Subtle Background Accent Gradient */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all duration-500"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-2xl group-hover:bg-[var(--primary)]/15 transition-all duration-500"></div>

        {/* Lock Icon Wrapper */}
        <div className="w-16 h-16 bg-amber-50/85 dark:bg-amber-950/20 text-amber-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 border border-amber-100 dark:border-amber-900/20 shadow-sm animate-bounce">
          <FiLock strokeWidth={2.5} />
        </div>

        {/* Header Title */}
        <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight mb-3">
          Feature Currently Unavailable
        </h1>

        {/* Descriptions */}
        <p className="text-xs text-[var(--text-muted)] font-bold mb-4 leading-relaxed">
          This feature has been temporarily disabled by the administrator.
        </p>
        
        <h2 className="text-sm font-extrabold text-[var(--text-main)] px-4 py-2.5 bg-[var(--bg-sub)] rounded-2xl border border-[var(--border)] mb-8">
          Please contact your institute administrator for more information.
        </h2>

        {/* Go Back Link */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl text-xs font-black shadow-md shadow-[var(--primary)]/20 hover:-translate-y-0.5 transition-all"
        >
          <FiArrowLeft strokeWidth={2.5} /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
