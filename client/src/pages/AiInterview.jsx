import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiPlayCircle, FiCheckCircle, FiAward, FiClock, FiVideo } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AiInterview() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/ai-interview/sessions');
      setSessions(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load mock interview history.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    try {
      setStarting(true);
      const { data } = await api.post('/ai-interview/start');
      toast.success(data.message || 'Interview initialized!');
      // Simulate redirection to session
      toast.loading(`Launching session: ${data.sessionId}...`, { duration: 2000 });
    } catch (err) {
      console.error(err);
      toast.error('Failed to start interview.');
    } finally {
      setStarting(false);
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
      <div className="bg-gradient-to-r from-violet-600 to-indigo-850 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center text-9xl pointer-events-none pr-8">
          💬
        </div>
        <div className="relative z-10 space-y-4 max-w-xl text-left">
          <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-3.5 py-1.5 rounded-full border border-white/10">AI Simulator</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1">AI Mock Interview Drills</h1>
          <p className="text-sm text-indigo-150 font-semibold leading-relaxed">
            Practice technical and behavioral questions in real-time. Receive instant grading metrics, visual speech feedback, and correct roadmap suggestions.
          </p>
          <button 
            onClick={handleStartInterview} 
            disabled={starting}
            className="px-6 py-3 bg-white text-indigo-650 hover:bg-indigo-50 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FiPlayCircle className="text-lg" /> {starting ? 'Initializing...' : 'Start Mock Interview'}
          </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-xl flex items-center justify-center text-xl shrink-0 border border-indigo-100 dark:border-indigo-900/10">
            <FiVideo />
          </div>
          <div>
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Sessions Taken</span>
            <div className="text-2xl font-black text-[var(--text-main)] mt-1">{sessions.length}</div>
          </div>
        </div>
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl flex items-center justify-center text-xl shrink-0 border border-emerald-100 dark:border-emerald-900/10">
            <FiAward />
          </div>
          <div>
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Average Score</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-450 mt-1">
              {sessions.length > 0 ? `${Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length)}%` : 'N/A'}
            </div>
          </div>
        </div>
        <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl flex items-center justify-center text-xl shrink-0 border border-amber-100 dark:border-amber-900/10">
            <FiCheckCircle />
          </div>
          <div>
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Readiness Rank</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-500 mt-1">Elite SDE</div>
          </div>
        </div>
      </div>

      {/* Sessions History Table */}
      <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl shadow-sm text-left">
        <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider mb-6">Recent Sessions History</h3>
        
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)]">No past mock sessions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-semibold text-[var(--text-main)]">
              <thead>
                <tr className="border-b border-[var(--border-light)] text-[10px] font-black uppercase tracking-wider text-[var(--text-light)]">
                  <th className="pb-3 text-left">Session Topic</th>
                  <th className="pb-3 text-left">Date</th>
                  <th className="pb-3 text-left">Score</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--bg-sub)]/30 transition-colors">
                    <td className="py-4 font-extrabold">{s.title}</td>
                    <td className="py-4 text-[var(--text-muted)] flex items-center gap-1.5"><FiClock /> {new Date(s.date).toLocaleDateString()}</td>
                    <td className="py-4 text-emerald-600 dark:text-emerald-450 font-black">{s.score}%</td>
                    <td className="py-4 text-right"><span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-full border border-emerald-100 dark:border-emerald-900/20 text-[9px] font-black uppercase tracking-wider">{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
