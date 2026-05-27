import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiShield, FiChevronRight } from 'react-icons/fi';

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
    <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center p-6 selection:bg-indigo-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-50/50 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-emerald-50/50 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-[480px] w-full fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#4361ee] text-white shadow-lg shadow-indigo-100 mb-6 text-2xl font-bold">
            CF
          </div>
          <h2 className="text-3xl font-bold text-[#101828] tracking-tight mb-2">Create your account</h2>
          <p className="text-[#667085] font-medium">Join 2,400+ students building tech careers.</p>
        </div>

        <div className="card bg-white p-10 border-soft">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#344054] mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#98a2b3]">
                  <FiUser className="text-sm" />
                </div>
                <input 
                  type="text" 
                  name="fullName" 
                  required 
                  className="input-field pl-10" 
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="John Doe" 
                  value={formData.fullName}
                  onChange={handleChange} 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#344054] mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#98a2b3]">
                  <FiMail className="text-sm" />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="input-field pl-10" 
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="name@company.com" 
                  value={formData.email}
                  onChange={handleChange} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#344054] mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#98a2b3]">
                    <FiLock className="text-sm" />
                  </div>
                  <input 
                    type="password" 
                    name="password" 
                    required 
                    className="input-field pl-10" 
                    style={{ paddingLeft: '2.75rem' }}
                    placeholder="••••••••" 
                    minLength="6" 
                    value={formData.password}
                    onChange={handleChange} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#344054] mb-1.5">Confirm</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#98a2b3]">
                    <FiShield className="text-sm" />
                  </div>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    required 
                    className="input-field pl-10" 
                    style={{ paddingLeft: '2.75rem' }}
                    placeholder="••••••••" 
                    value={formData.confirmPassword}
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
            
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 text-lg shadow-md shadow-indigo-100 mt-2">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Create Account <FiChevronRight className="ml-1" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#f2f4f7] text-center">
            <p className="text-[#667085] text-sm font-medium">
              Already have an account? <Link to="/login" className="text-[#4361ee] font-bold hover:text-[#3730a3]">Log in</Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-xs text-[#98a2b3] max-w-xs mx-auto leading-relaxed">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Signup;
