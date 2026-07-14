import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiFileText, FiAward, FiCompass, FiCpu, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AiResumeBuilder() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [resumeText, setResumeText] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/ai-resume/resumes');
      setResumes(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load resumes list.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeResume = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      return toast.error('Please paste or type your resume details first.');
    }

    try {
      setAnalyzing(true);
      setAnalysisResult(null);
      const { data } = await api.post('/ai-resume/analyze', { resumeText });
      setAnalysisResult(data);
      toast.success('ATS analysis completed successfully!');
    } catch (err) {
      console.error(err);
      toast.error('ATS analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-650 to-emerald-850 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center text-9xl pointer-events-none pr-8">
          📝
        </div>
        <div className="relative z-10 space-y-4 max-w-xl text-left">
          <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-3.5 py-1.5 rounded-full border border-white/10">ATS Analyzer</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1">AI Resume Builder & Auditor</h1>
          <p className="text-sm text-teal-100 font-semibold leading-relaxed">
            Optimize your resume for big-tech ATS filters. Get real-time readability audits, structural grammar scoring, and specialized keyword recommendations.
          </p>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid lg:grid-cols-3 gap-8 text-left">
        
        {/* Left Column: Creator and Analyzer */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider">Paste Resume Content</h3>
            <p className="text-[10px] text-[var(--text-light)] font-bold">Paste the full text of your resume to verify readability indices and ATS scoring benchmarks.</p>
            
            <form onSubmit={handleAnalyzeResume} className="space-y-4">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your professional summary, work experience, and core skills list here..."
                rows={8}
                className="w-full px-4 py-3 bg-[var(--bg-sub)]/50 border border-[var(--border)] rounded-2xl outline-none text-xs text-[var(--text-main)] font-semibold focus:border-[var(--primary)] transition-all resize-none"
                required
              />
              <button 
                type="submit"
                disabled={analyzing}
                className="btn-primary w-full py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <FiCpu className="text-base" /> {analyzing ? 'Analyzing ATS Score...' : 'Audit Resume with AI'}
              </button>
            </form>
          </div>

          {/* Analysis Result Card */}
          {analysisResult && (
            <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl shadow-sm space-y-6 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center pb-3 border-b border-[var(--border-light)]">
                <h4 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider">Analysis Audit Report</h4>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-full border border-emerald-100 dark:border-emerald-900/10 text-xs font-black">
                  <FiAward /> ATS Score: {analysisResult.score}%
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">Critical Action Items</span>
                <ul className="space-y-2.5">
                  {analysisResult.suggestions.map((item, idx) => (
                    <li key={idx} className="text-xs text-[var(--text-muted)] font-bold flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center text-[10px] font-bold border border-amber-100 dark:border-amber-900/20 shrink-0 mt-0.5">!</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: History */}
        <div className="space-y-6">
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl shadow-sm space-y-6">
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider">My Resumes</h3>
            
            <div className="space-y-3">
              {resumes.map((r) => (
                <div key={r.id} className="p-4 bg-[var(--bg-sub)]/30 border border-[var(--border)] rounded-2xl flex items-center gap-3.5 hover:border-[var(--primary)] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-500 border border-teal-100 dark:border-teal-900/10 flex items-center justify-center text-lg shrink-0">
                    <FiFileText />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="text-xs font-extrabold text-[var(--text-main)] truncate">{r.title}</h4>
                    <p className="text-[9px] text-[var(--text-muted)] font-bold mt-0.5">Score: {r.score}% | ATS Audited</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
