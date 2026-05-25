import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiX, FiCpu, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalAiChat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Hide the global chat bubble if the user is on the dedicated Code Guru page
  const isDedicatedChatPage = location.pathname === '/code-guru';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      fetchHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ai/history');
      if (res.data.data.length === 0) {
        setMessages([{
          _id: 'initial',
          role: 'assistant',
          content: `Hi ${user?.fullName?.split(' ')[0] || 'there'}! 👋 I'm Code Guru.\n\nAsk me anything! Whether you want to know **where to start** or **what domain you should choose**, need help explaining a tricky coding logic, or want a daily study schedule, I'm here to support you! 🚀`
        }]);
      } else {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.log('Failed to load global chat history:', err.message);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput('');
    
    const userMsgObj = { _id: Date.now(), role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsgObj]);
    setSending(true);

    try {
      const res = await api.post('/ai/chat', { message: userMessage });
      setMessages(prev => [...prev, { _id: Date.now() + 1, role: 'assistant', content: res.data.data.message }]);
    } catch (err) {
      toast.error('Failed to get response');
    } finally {
      setSending(false);
    }
  };

  if (!user || isDedicatedChatPage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-[350px] sm:w-[400px] h-[500px] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 mr-0 select-none"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 flex items-center justify-between text-white shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-sm shadow-inner">
                  <FiCpu className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-black tracking-tight leading-tight">Code Guru</div>
                  <div className="text-[9px] text-indigo-200 font-bold uppercase tracking-widest mt-0.5">AI Coding Helper</div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
                title="Close chat"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-main)]/30 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg._id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[8px] text-[var(--text-light)] font-bold uppercase tracking-wider mb-1 px-1">
                    {msg.role === 'user' ? 'You' : 'Code Guru'}
                  </span>
                  <div className={`text-xs max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[var(--primary)] text-white rounded-tr-none' 
                      : 'bg-[var(--bg-card)] text-[var(--text-main)] rounded-tl-none border border-[var(--border)]'
                  }`}>
                    {msg.role === 'user' ? (
                      <div className="whitespace-pre-wrap font-semibold">{msg.content}</div>
                    ) : (
                      <div className="markdown-prose text-[var(--text-main)] prose-xs">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {sending && (
                <div className="flex flex-col items-start">
                  <span className="text-[8px] text-[var(--text-light)] font-bold uppercase tracking-wider mb-1 px-1">Code Guru typing</span>
                  <div className="bg-[var(--bg-card)] rounded-2xl rounded-tl-none border border-[var(--border)] px-4 py-2.5 flex items-center gap-1 shadow-sm">
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-[var(--bg-card)] border-t border-[var(--border)] flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl px-3.5 py-2 text-xs text-[var(--text-main)] placeholder-[var(--text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-semibold"
                disabled={sending}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || sending}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                  !input.trim() || sending 
                    ? 'bg-[var(--bg-sub)] text-[var(--text-light)] border border-[var(--border)] cursor-not-allowed' 
                    : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-md shadow-indigo-500/20'
                }`}
              >
                <FiSend size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl shadow-indigo-500/30 transition-all border border-white/15"
        title="Chat with Code Guru"
      >
        {isOpen ? <FiX className="text-2xl" /> : <FiMessageSquare className="text-2xl" />}
      </motion.button>

    </div>
  );
};

export default GlobalAiChat;
