import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiShield, FiChevronRight } from 'react-icons/fi';
import { BsLightningFill } from 'react-icons/bs';

const Signup = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      registerData.email = registerData.email.trim();
      await register(registerData);
      toast.success('Account created successfully!');
      navigate('/domains');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--land-bg-alt)] flex items-center justify-center p-6 selection:bg-[var(--brand-green-light)] selection:text-[var(--brand-green)] relative overflow-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[var(--brand-green-light)] rounded-full blur-[100px] -z-10 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-yellow-100 rounded-full blur-[80px] -z-10 opacity-70"></div>

      <div className="max-w-[480px] w-full relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--brand-green)] text-white shadow-[var(--shadow-bubbly)] mb-6 text-3xl font-black transform hover:-translate-y-1 transition-transform">
            CF
          </Link>
          <h2 className="text-3xl font-black text-[var(--land-text)] tracking-tight mb-2">Create your account</h2>
          <div className="flex items-center justify-center gap-2 text-[var(--land-nav)] font-bold">
            <BsLightningFill className="text-[var(--brand-orange)]" />
            <span>Join 2,400+ geeks building tech careers.</span>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-extrabold text-[var(--land-text)] mb-2 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiUser strokeWidth={3} />
                </div>
                <input 
                  type="text" 
                  name="fullName" 
                  required 
                  className="w-full bg-gray-50 border-2 border-gray-100 text-[var(--land-text)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--brand-green)] focus:bg-white transition-all font-bold" 
                  placeholder="John Doe" 
                  value={formData.fullName}
                  onChange={handleChange} 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-extrabold text-[var(--land-text)] mb-2 uppercase tracking-wide">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiMail strokeWidth={3} />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full bg-gray-50 border-2 border-gray-100 text-[var(--land-text)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--brand-green)] focus:bg-white transition-all font-bold" 
                  placeholder="geek@careerforge.com" 
                  value={formData.email}
                  onChange={handleChange} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-extrabold text-[var(--land-text)] mb-2 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FiLock strokeWidth={3} />
                  </div>
                  <input 
                    type="password" 
                    name="password" 
                    required 
                    className="w-full bg-gray-50 border-2 border-gray-100 text-[var(--land-text)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--brand-green)] focus:bg-white transition-all font-bold" 
                    placeholder="••••••••" 
                    minLength="6" 
                    value={formData.password}
                    onChange={handleChange} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-extrabold text-[var(--land-text)] mb-2 uppercase tracking-wide">Confirm</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FiShield strokeWidth={3} />
                  </div>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    required 
                    className="w-full bg-gray-50 border-2 border-gray-100 text-[var(--land-text)] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--brand-green)] focus:bg-white transition-all font-bold" 
                    placeholder="••••••••" 
                    value={formData.confirmPassword}
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
            
            <button type="submit" disabled={isLoading} className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white py-4 rounded-xl text-lg font-black shadow-[var(--shadow-bubbly)] hover:-translate-y-1 transition-transform flex items-center justify-center gap-2 mt-4">
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Create Account <FiChevronRight strokeWidth={4} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-[var(--land-nav)] font-bold">
              Already have an account? <Link to="/login" className="text-[var(--brand-green)] font-black hover:text-[var(--brand-green-hover)] ml-1">Log in</Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-xs text-gray-400 max-w-xs mx-auto font-bold uppercase tracking-wider">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Signup;
