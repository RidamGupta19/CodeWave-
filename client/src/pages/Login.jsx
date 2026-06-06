import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiChevronRight } from 'react-icons/fi';
import { BsLightningFill } from 'react-icons/bs';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
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

  return (
    <div className="min-h-screen bg-[var(--land-bg-alt)] flex items-center justify-center p-6 selection:bg-[var(--brand-green-light)] selection:text-[var(--brand-green)]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-green-light)] rounded-bl-full -z-10 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100 rounded-tr-full -z-10 opacity-70"></div>
      
      <div className="max-w-[440px] w-full relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--brand-green)] text-white shadow-[var(--shadow-bubbly)] mb-6 text-3xl font-black transform hover:-translate-y-1 transition-transform">
            CF
          </Link>
          <h2 className="text-3xl font-black text-[var(--land-text)] tracking-tight mb-2">Welcome Back Geeks!</h2>
          <div className="flex items-center justify-center gap-2 text-[var(--land-nav)] font-bold">
            <BsLightningFill className="text-[var(--brand-orange)]" />
            <span>Ready to level up your career?</span>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
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
                  placeholder="geek@careerforge.com"
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
              New to CareerForge? <Link to="/signup" className="text-[var(--brand-green)] font-black hover:text-[var(--brand-green-hover)] ml-1">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
