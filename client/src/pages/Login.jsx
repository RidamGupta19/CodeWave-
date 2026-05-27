import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiChevronRight } from 'react-icons/fi';

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
    <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center p-6 selection:bg-indigo-100">
      <div className="max-w-[440px] w-full fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#4361ee] text-white shadow-lg shadow-indigo-100 mb-6 text-2xl font-bold">
            CF
          </div>
          <h2 className="text-3xl font-bold text-[#101828] tracking-tight mb-2">Welcome back</h2>
          <p className="text-[#667085] font-medium">Please enter your details to continue.</p>
        </div>

        <div className="card bg-white p-10 border-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#344054] mb-2">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#98a2b3]">
                  <FiMail />
                </div>
                <input 
                  type="email" 
                  required
                  className="input-field pl-10" 
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-[#344054]">Password</label>
                <a href="#" className="text-xs font-bold text-[#4361ee] hover:text-[#3730a3]">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#98a2b3]">
                  <FiLock />
                </div>
                <input 
                  type="password" 
                  required
                  className="input-field pl-10" 
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 text-lg shadow-md shadow-indigo-100">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign in <FiChevronRight className="ml-1" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#f2f4f7] text-center">
            <p className="text-[#667085] text-sm font-medium">
              New to CareerForge? <Link to="/signup" className="text-[#4361ee] font-bold hover:text-[#3730a3]">Create an account</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-[#98a2b3] text-xs font-medium uppercase tracking-widest">
            Handcrafted for Engineering Students
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
