import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiTrash2, FiUser, FiCpu, FiCompass, FiZap, FiAward, FiClock, FiStar, FiActivity, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

// Robust Error Boundary for ReactMarkdown to prevent blank page crashes in React 19
class SafeMarkdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SafeMarkdown caught rendering exception:", error, errorInfo);
  }

  render() {
    const { content, className } = this.props;
    if (this.state.hasError || !content) {
      return <div className={`whitespace-pre-wrap ${className || ''}`}>{content || ''}</div>;
    }

    // Dynamic cleaning of mojibake characters that can trip up v10 markdown parsers
    let cleanContent = content;
    try {
      cleanContent = cleanContent
        .replace(/ðŸ‘‹/g, '👋')
        .replace(/ðŸš€/g, '🚀')
        .replace(/ðŸ‘¾/g, '👾')
        .replace(/ðŸ”¥/g, '🔥')
        .replace(/ðŸ’¬/g, '💬')
        .replace(/ðŸ’ª/g, '💪')
        .replace(/ðŸ—‚/g, '📋')
        .replace(/ðŸ” /g, '💡')
        .replace(/ðŸŽ¯/g, '🎯')
        .replace(/ðŸ“Š/g, '📊')
        .replace(/ðŸ“…/g, '📅')
        .replace(/ðŸ /g, '🛠️')
        .replace(/ðŸ¾/g, '🐾');
    } catch (e) {
      console.warn("Character cleaning exception:", e);
    }

    return (
      <div className={className || ''}>
        <ReactMarkdown>{cleanContent}</ReactMarkdown>
      </div>
    );
  }
}

const AiChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [insights, setInsights] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
    fetchInsights();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ai/history');
      if (res.data.data.length === 0) {
        setMessages([{
          _id: 'initial',
          role: 'assistant',
          content: `Hi ${user.fullName.split(' ')[0]}! 👋 I am Code Guru, your personal coding helper!\n\nI can guide you on:\n\n* **Domain Selection:** Deciding what domain to choose (Web Development or DSA).\n* **Weak Topics:** Targeted revision and practice strategies.\n* **Weekly Plan:** Custom learning schedules built for your pace.\n* **Placement Audit:** Placement and internship readiness metrics.\n* **Concepts & Coding:** Explaining tricky programming syntax or logic.\n\nWhat should we tackle today? Choose a suggested question below or ask me anything! 🚀`
        }]);
      } else {
        setMessages(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await api.get('/ai/performance-insights');
      setInsights(res.data.data);
    } catch (err) {
      console.log('Error loading dynamic AI insights:', err.message);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || sending) return;

    setInput('');
    const userMessage = text.trim();
    
    // Add User Message optimistically
    const newMsg = { _id: Date.now(), role: 'user', content: userMessage };
    setMessages(prev => [...prev, newMsg]);
    setSending(true);

    try {
      const res = await api.post('/ai/chat', { message: userMessage });
      setMessages(prev => [...prev, { _id: Date.now() + 1, role: 'assistant', content: res.data.data.message }]);
      
      // Refresh insights dynamically after a question is asked to keep stats in sync!
      fetchInsights();
    } catch (err) {
      toast.error('Failed to get response from Code Guru');
      setMessages(prev => prev.filter(m => m._id !== newMsg._id));
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear your mentorship log?')) return;
    try {
      await api.delete('/ai/history');
      setMessages([{
        _id: 'initial',
        role: 'assistant',
        content: "Chat history cleared. How can I help you today?"
      }]);
      toast.success('Mentorship history cleared');
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  const suggestedPrompts = [
    { label: "What domain should I choose?", text: "What domain should I choose?" },
    { label: "What should I learn next?", text: "What should I learn next in my roadmap?" },
    { label: "Analyze my performance", text: "Analyze my performance, what are my weak topics?" },
    { label: "Create my weekly plan", text: "Create my weekly study plan based on my pace" },
    { label: "Suggest a project", text: "Suggest a project for my level and domain" }
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 lg:px-10 transition-colors duration-300">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 border-b border-[var(--border)] pb-5">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-main)] flex items-center gap-2.5">
            <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white p-2 rounded-xl text-lg shadow-md shrink-0">🤖</span>
            <span className="text-gradient">Code Guru</span> AI Chat
          </h1>
          <p className="text-xs text-[var(--text-light)] font-bold uppercase tracking-wider mt-1">Your premium personal coding mentor, career coach, and assistant</p>
        </div>
        <button 
          onClick={handleClear} 
          className="p-3 text-[var(--text-light)] hover:text-red-500 hover:bg-red-500/5 rounded-xl border border-[var(--border)] transition-all shrink-0"
          title="Clear History"
        >
          <FiTrash2 size={16} />
        </button>
      </div>

      {/* Main Workspace - Grid layout split panel */}
      <div className="grid lg:grid-cols-3 gap-8 items-start h-[calc(100vh-230px)] min-h-[500px]">
        
        {/* Left Side: Real-time Mentor Insights Dashboard */}
        <div className="space-y-6 lg:col-span-1 h-full overflow-y-auto pr-2 custom-scrollbar hidden lg:block">
          
          {/* Readiness Meter Card */}
          {insights && (
            <div className="card p-6 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 border-[var(--primary)]/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <FiAward className="text-7xl text-[var(--primary)]" />
              </div>
              <h3 className="text-xs font-black text-[var(--text-light)] uppercase tracking-wider mb-4">Internship Readiness Audit</h3>
              
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full border-4 border-[var(--primary)]/15 border-t-[var(--primary)] flex flex-col items-center justify-center shrink-0 shadow-md">
                  <span className="text-lg font-black text-[var(--text-main)]">{insights.readinessPercent}%</span>
                </div>
                <div>
                  <div className="font-extrabold text-[var(--text-main)] text-sm">Almost Interview Ready!</div>
                  <p className="text-[10px] text-[var(--text-light)] font-medium mt-0.5">Solve lessons and score in assessments to cross the 85% benchmark.</p>
                </div>
              </div>
            </div>
          )}

          {/* Diagnostic Strengths & Weaknesses */}
          <div className="card p-6 space-y-5">
            <h3 className="text-xs font-black text-[var(--text-light)] uppercase tracking-wider border-b border-[var(--border)] pb-2">Diagnostic Metrics</h3>
            
            {insights ? (
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex justify-between items-center bg-[var(--bg-sub)] p-3 rounded-xl border border-[var(--border)]">
                  <div>
                    <div className="text-[9px] text-[var(--text-light)] uppercase font-black">Domain</div>
                    <span className="text-[var(--text-main)] font-black text-sm">{insights.domain}</span>
                  </div>
                  <span className="text-xl">🚀</span>
                </div>

                <div className="flex justify-between items-center bg-[var(--bg-sub)] p-3 rounded-xl border border-[var(--border)]">
                  <div>
                    <div className="text-[9px] text-[var(--text-light)] uppercase font-black">Strongest Concept</div>
                    <span className="text-emerald-500 font-black text-sm">{insights.strongestTopic}</span>
                  </div>
                  <span className="text-xl">🏆</span>
                </div>

                <div className="flex justify-between items-center bg-[var(--bg-sub)] p-3 rounded-xl border border-[var(--border)]">
                  <div>
                    <div className="text-[9px] text-[var(--text-light)] uppercase font-black">Flagged for Revision</div>
                    <span className="text-amber-500 font-black text-sm">{insights.weakestTopic}</span>
                  </div>
                  <span className="text-xl">⚠️</span>
                </div>

                <div className="flex justify-between items-center bg-[var(--bg-sub)] p-3 rounded-xl border border-[var(--border)]">
                  <div>
                    <div className="text-[9px] text-[var(--text-light)] uppercase font-black">Coding Consistency</div>
                    <span className="text-[var(--primary)] font-black text-sm">{insights.consistency}</span>
                  </div>
                  <span className="text-xl">🔥</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-[var(--text-light)] italic">Loading metrics...</div>
            )}
          </div>

          {/* Mentor Smart Recommendations */}
          <div className="card p-6">
            <h3 className="text-xs font-black text-[var(--text-light)] uppercase tracking-wider mb-4 border-b border-[var(--border)] pb-2">Coach Actionables</h3>
            <ul className="space-y-3.5">
              {insights && insights.recommendations?.map((rec, i) => (
                <li key={i} className="flex gap-2.5 items-start text-xs font-semibold text-[var(--text-muted)] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-1.5"></span>
                  <span>{rec}</span>
                </li>
              ))}
              {!insights && <li className="text-center py-4 text-[var(--text-light)] italic">Loading recommendations...</li>}
            </ul>
          </div>
        </div>

        {/* Right Side: High-End Chat Stream Container */}
        <div className="lg:col-span-2 h-full flex flex-col bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          
          {/* Chat Bubble Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg._id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Bubble Header */}
                <div className={`flex items-center gap-1.5 mb-1.5 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[var(--primary)] text-white' 
                      : 'bg-gradient-to-tr from-violet-500 to-indigo-500 text-white'
                  }`}>
                    {msg.role === 'user' ? <FiUser size={12} /> : <FiCpu size={12} />}
                  </div>
                  <span className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-wider">{msg.role === 'user' ? 'You' : 'Code Guru'}</span>
                </div>
                
                {/* Bubble Container */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm max-w-[85%] rounded-2xl p-4 md:p-5 shadow-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[var(--primary-light)] text-[var(--text-main)] rounded-tr-none border border-[var(--primary)]/10 font-semibold' 
                      : 'bg-[var(--bg-sub)] text-[var(--text-main)] rounded-tl-none border border-[var(--border)]'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <SafeMarkdown className="markdown-prose text-[var(--text-main)]" content={msg.content} />
                  )}
                </motion.div>
              </div>
            ))}

            {/* Typing Indicator */}
            {sending && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1.5 mb-1.5 px-1">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs bg-gradient-to-tr from-violet-500 to-indigo-500 text-white">
                    <FiCpu size={12} />
                  </div>
                  <span className="text-[9px] text-[var(--text-light)] font-black uppercase tracking-wider">Code Guru typing</span>
                </div>
                
                <div className="bg-[var(--bg-sub)] rounded-2xl rounded-tl-none border border-[var(--border)] p-4 flex items-center gap-1.5 shadow-sm">
                  <div className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full animate-bounce shrink-0"></div>
                  <div className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full animate-bounce shrink-0" style={{animationDelay: '0.15s'}}></div>
                  <div className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full animate-bounce shrink-0" style={{animationDelay: '0.3s'}}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick reply actions/Prompts */}
          <div className="px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-sub)]/50 flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(prompt.text)}
                disabled={sending}
                className="text-[10px] font-black uppercase bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] border border-[var(--border)] px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm shrink-0"
              >
                <FiCompass size={12} /> {prompt.label}
              </button>
            ))}
          </div>

          {/* Chat Interactive Input Bar */}
          <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border)]">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }} 
              className="flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Code Guru anything about code syntax, domain choices, career prep..."
                className="flex-1 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] placeholder-[var(--text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-semibold"
                disabled={sending}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || sending}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                  !input.trim() || sending 
                    ? 'bg-[var(--bg-sub)] text-[var(--text-light)] border border-[var(--border)] cursor-not-allowed' 
                    : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-md shadow-indigo-500/20'
                }`}
              >
                <FiSend size={16} />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AiChat;
