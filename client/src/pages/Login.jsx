import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiChevronRight, FiX } from 'react-icons/fi';
import { BsLightningFill } from 'react-icons/bs';
import Logo from '../components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(email.trim(), password.trim());
      toast.success('Welcome back!');
      if (data.user.role === 'admin') navigate('/admin');
      else if (!data.user.activeDomain && !data.user.selectedDomain) navigate('/domains');
      else navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (account) => {
    setIsGoogleModalOpen(false);
    setIsLoading(true);
    try {
      const res = await apiGoogleAuth(account.email, account.name);
      localStorage.setItem('cw_token', res.token);
      localStorage.setItem('cw_user', JSON.stringify(res.user));
      setUser(res.user);
      toast.success(`Welcome back, ${res.user.fullName}!`);
      
      if (res.user.role === 'admin') navigate('/admin');
      else if (res.user.role === 'teacher') navigate('/dashboard');
      else if (!res.user.activeDomain && !res.user.selectedDomain) navigate('/domains');
      else navigate('/dashboard');
    } catch (err) {
      toast.error('Google Auth login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const apiGoogleAuth = async (email, fullName) => {
    // Direct call to Axios
    const axios = require('../api/axios').default;
    const { data } = await axios.post('/auth/google', { email, fullName });
    return data;
  };

  return (
    <div className="min-h-screen bg-[var(--land-bg-alt)] flex items-center justify-center p-6 selection:bg-[var(--brand-green-light)] selection:text-[var(--brand-green)]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-green-light)] rounded-bl-full -z-10 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100 rounded-tr-full -z-10 opacity-70"></div>
      
      <div className="max-w-[440px] w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-6">
            <Logo hideText={true} className="w-14 h-14" />
          </div>
          <h2 className="text-3xl font-black text-[var(--land-text)] tracking-tight mb-2">Welcome to CodeWave Solution</h2>
          <div className="flex items-center justify-center gap-2 text-[var(--land-nav)] font-bold">
            <BsLightningFill className="text-[var(--brand-orange)]" />
            <span>Ready to level up your career?</span>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          
          {/* Continue with Google */}
          <button 
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-100 text-[var(--land-text)] py-3.5 rounded-xl text-sm font-black transition-all shadow-sm mb-6 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-gray-100"></div>
            <span className="text-[9px] uppercase font-black tracking-wider text-gray-400">or sign in with email</span>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-extrabold text-[var(--land-text)] mb-2 uppercase tracking-wide">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiMail strokeWidth={3} />
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 text-[var(--land-text)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--brand-green)] focus:bg-white transition-all font-bold" 
                  placeholder="geek@codewavesolution.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-extrabold text-[var(--land-text)] uppercase tracking-wide">Password</label>
                <a href="#" className="text-xs font-black text-[var(--brand-orange)] hover:text-[var(--brand-orange-hover)]">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiLock strokeWidth={3} />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 text-[var(--land-text)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--brand-green)] focus:bg-white transition-all font-bold" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white py-4 rounded-xl text-lg font-black shadow-[var(--shadow-bubbly)] hover:-translate-y-1 transition-transform flex items-center justify-center gap-2">
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In <FiChevronRight strokeWidth={4} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-[var(--land-nav)] font-bold">
              New to CodeWave Solution? <Link to="/signup" className="text-[var(--brand-green)] font-black hover:text-[var(--brand-green-hover)] ml-1">Create an account</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Mock Google Login modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-sm shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors cursor-pointer animate-fade-in"
            >
              <FiX size={18} />
            </button>
            
            <div className="text-center mb-6">
              <svg viewBox="0 0 24 24" className="w-8 h-8 mx-auto mb-2">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <h3 className="text-base font-black text-gray-900">Sign in with Google</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Select an account to proceed</p>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Jane Smith (Student)', email: 'student@codewavesolution.com' },
                { name: 'John Doe (Instructor)', email: 'teacher@codewavesolution.com' },
                { name: 'CodeWave Admin', email: 'admin@codewavesolution.com' }
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleGoogleLogin(acc)}
                  className="w-full text-left p-3.5 bg-gray-50 border border-gray-100 hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/40 rounded-xl transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-extrabold text-xs text-stone-600 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                    {acc.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-black text-gray-900 leading-tight">{acc.name}</div>
                    <div className="text-[10px] text-gray-400 font-semibold">{acc.email}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
