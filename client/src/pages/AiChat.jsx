import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiSend, FiTrash2, FiUser, FiCpu } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const AiChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/ai/history');
      if (res.data.data.length === 0) {
        // Add initial greeting
        setMessages([{
          _id: 'initial',
          role: 'assistant',
          content: `Hi ${user.fullName.split(' ')[0]}! 👋 I'm your CareerForge AI Mentor.\n\nI see you're interested in **${user.selectedDomain?.name || 'exploring tech careers'}**. I can help you with:\n- Career roadmaps and next steps\n- Explaining complex technical concepts\n- Project ideas and interview prep\n- Study plans\n\nHow can I help you today?`
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput('');
    
    // Optimistic UI update
    const newMsg = { _id: Date.now(), role: 'user', content: userMessage };
    setMessages(prev => [...prev, newMsg]);
    setSending(true);

    try {
      const res = await api.post('/ai/chat', { message: userMessage });
      setMessages(prev => [...prev, { _id: Date.now() + 1, role: 'assistant', content: res.data.data.message }]);
    } catch (err) {
      toast.error('Failed to get response');
      // Remove failed message
      setMessages(prev => prev.filter(m => m._id !== newMsg._id));
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear chat history?')) return;
    try {
      await api.delete('/ai/history');
      setMessages([{
        _id: 'initial',
        role: 'assistant',
        content: "Chat history cleared. How can I help you today?"
      }]);
      toast.success('Chat history cleared');
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  const commonQuestions = [
    "What should be my next step?",
    "How to prepare for interviews?",
    "Suggest a good project idea",
    "I'm stuck, how to improve?"
  ];

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiCpu className="text-indigo-400" /> AI Career Mentor
          </h1>
          <p className="text-sm text-slate-400">Ask anything about your learning path</p>
        </div>
        <button onClick={handleClear} className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors" title="Clear History">
          <FiTrash2 />
        </button>
      </div>

      <div className="glass flex-1 flex flex-col overflow-hidden rounded-2xl border border-slate-700/50">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg._id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-center gap-2 mb-1 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-pink-500 text-white'}`}>
                  {msg.role === 'user' ? <FiUser /> : <FiCpu />}
                </div>
                <span className="text-xs text-slate-400 font-medium">{msg.role === 'user' ? 'You' : 'CareerForge AI'}</span>
              </div>
              
              <div className={`text-sm ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai text-slate-200'}`}>
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:mb-2 prose-headings:mt-4 prose-ul:my-1 prose-li:my-0">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex flex-col items-start">
              <div className="chat-bubble-ai text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <div className="px-6 py-2 flex flex-wrap gap-2">
            {commonQuestions.map((q, i) => (
              <button 
                key={i} 
                onClick={() => setInput(q)}
                className="text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-[#0a0a0f]/80 border-t border-slate-700/50">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for guidance, project ideas, or roadmaps..."
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={sending}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || sending}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${!input.trim() || sending ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
            >
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
