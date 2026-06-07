import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiArrowRight, FiCheckCircle, FiStar, FiTrendingUp, FiTarget, FiZap } from 'react-icons/fi';
import { BsLightningFill } from 'react-icons/bs';
import Logo from '../components/Logo';

const Landing = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Removed auto-redirect useEffect to allow logged-in users to view the landing page

  return (
    <div className="min-h-screen bg-[var(--land-bg)] flex flex-col font-sans selection:bg-[var(--brand-green-light)] selection:text-[var(--brand-green)]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Navbar */}
      <nav className="px-6 py-4 bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          {/* Logo */}
          <Logo />
          
          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-8 text-[var(--land-nav)] font-bold text-base">
            <a href="#roadmaps" className="hover:text-[var(--brand-green)] transition-colors">Courses & Roadmaps</a>
            <a href="#roadmaps" className="hover:text-[var(--brand-green)] transition-colors">Tutorials</a>
            <a href="#roadmaps" className="hover:text-[var(--brand-green)] transition-colors">Practice</a>
            <div className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-black rounded-md -ml-6 -mt-4 transform rotate-12">NEW</div>
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white font-extrabold px-6 py-2.5 rounded-lg transition-all shadow-[var(--shadow-bubbly)] hover:-translate-y-0.5 flex items-center gap-2">
                Go to Dashboard <FiArrowRight strokeWidth={3} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-[var(--land-nav)] hover:text-[var(--brand-green)] font-extrabold transition-colors px-4 py-2">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white font-extrabold px-6 py-2.5 rounded-lg transition-all shadow-[var(--shadow-bubbly)] hover:-translate-y-0.5 flex items-center gap-2">
                  Sign Up For Free <FiArrowRight strokeWidth={3} />
                </Link>
              </>
            )}
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-[var(--land-text)] p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiMenu size={28} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col ml-auto animate-fade-in">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-[var(--land-text)]">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <FiX size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6 text-[var(--land-nav)] font-bold">
              <a href="#roadmaps" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--brand-green)] text-lg">Courses & Roadmaps</a>
              <a href="#roadmaps" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--brand-green)] text-lg">Tutorials</a>
              <a href="#roadmaps" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--brand-green)] text-lg">Practice</a>
              
              <div className="border-t border-gray-100 pt-6 mt-4 flex flex-col gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="bg-[var(--brand-green)] text-white text-center font-extrabold px-6 py-3 rounded-lg w-full">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center text-lg font-bold hover:text-[var(--brand-green)] py-2">
                      Sign In
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="bg-[var(--brand-green)] text-white text-center font-extrabold px-6 py-3 rounded-lg w-full shadow-md">
                      Sign Up For Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section (Summer Skill Up Style) */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#F0FBFE]">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--brand-green-light)] rounded-bl-[200px] -z-10 opacity-60"></div>
        <div className="absolute top-20 left-10 w-24 h-24 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -z-10"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-[var(--brand-purple)] rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"></div>

        <section className="pt-20 pb-24 px-6 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-[var(--brand-orange)] font-black text-sm mb-6 shadow-sm transform -rotate-2">
                <BsLightningFill className="text-yellow-400" size={18} /> YOUR TECH JOURNEY STARTS HERE
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[var(--land-text)] leading-[1.1] mb-6 tracking-tight">
                Level Up Your<br />
                <span className="text-[var(--brand-green)] relative inline-block">
                  {isAuthenticated && user?.selectedDomain?.name ? user.selectedDomain.name : 'Tech'} Career
                  <svg className="absolute w-full h-4 -bottom-1 left-0 text-yellow-400" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="transparent"/></svg>
                </span>
                <br />Today.
              </h1>
              
              <p className="text-[var(--land-nav)] text-lg md:text-xl font-semibold mb-10 max-w-xl mx-auto lg:mx-0">
                Master Data Structures, Web Development, and AI. Join millions of students upgrading their skills with interactive roadmaps and AI mentorship.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-hover)] text-white text-lg font-black px-8 py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(244,130,37,0.3)] hover:-translate-y-1 w-full sm:w-auto text-center">
                    Continue Learning
                  </Link>
                ) : (
                  <Link to="/signup" className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-hover)] text-white text-lg font-black px-8 py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(244,130,37,0.3)] hover:-translate-y-1 w-full sm:w-auto text-center">
                    Start Learning Now
                  </Link>
                )}
                <div className="flex items-center gap-3 text-[var(--land-nav)] font-bold text-sm bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white ${['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400'][i-1]}`}>
                        U{i}
                      </div>
                    ))}
                  </div>
                  <span>Join our growing community</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image/Graphic */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
              <div className="relative bg-white p-6 rounded-3xl shadow-[var(--shadow-soft)] border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute -top-6 -left-6 bg-[var(--brand-yellow)] text-white w-20 h-20 rounded-full flex flex-col items-center justify-center font-black shadow-lg transform -rotate-12 z-20">
                  <span className="text-2xl leading-none">100%</span>
                  <span className="text-[10px] uppercase">Free</span>
                </div>
                
                <div className="bg-[#F8FAFC] rounded-2xl overflow-hidden border border-gray-100">
                  <div className="bg-gray-100 px-4 py-3 flex gap-2 border-b border-gray-200">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="p-6 font-mono text-sm text-gray-800 h-[300px] flex flex-col justify-center">
                    <div className="text-[var(--brand-purple)] font-bold">class <span className="text-[var(--brand-blue)]">CodeWaveSolution</span> {'{'}</div>
                    <div className="pl-6 mt-2">
                      <span className="text-[var(--brand-green)] font-bold">public static void</span> <span className="text-yellow-600 font-bold">main</span>(String[] args) {'{'}
                    </div>
                    <div className="pl-12 mt-2">
                      System.out.<span className="text-[var(--brand-blue)] font-bold">println</span>(<span className="text-[var(--brand-orange)]">"Welcome to CodeWave Solution!"</span>);
                    </div>
                    <div className="pl-12 mt-2">
                      <span className="text-gray-400 italic">// Your success journey starts here</span>
                    </div>
                    <div className="pl-6 mt-2">{'}'}</div>
                    <div className="mt-2">{'}'}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Horizontal Feature Strip */}
        <section className="bg-white border-y border-gray-200 py-10 relative z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8">
              {[
                { icon: <FiTarget />, text: "14+ Structured Roadmaps", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: <BsLightningFill />, text: "Interactive AI Mentorship", color: "text-[var(--brand-orange)]", bg: "bg-orange-50" },
                { icon: <FiCheckCircle />, text: "Industry Verified Badges", color: "text-[var(--brand-green)]", bg: "bg-green-50" },
                { icon: <FiTrendingUp />, text: "Real-time Skill Tracking", color: "text-[var(--brand-purple)]", bg: "bg-purple-50" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="font-extrabold text-[var(--land-text)]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section id="roadmaps" className="px-6 py-24 bg-gray-50 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-[var(--land-text)] mb-4">Choose Your <span className="text-[var(--brand-green)]">Pathway</span></h2>
              <p className="text-[var(--land-nav)] text-lg font-bold">Comprehensive, step-by-step guides to master your favorite tech stack.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Data Structures & Algorithms", desc: "Master problem solving and ace top tech interviews.", icon: "🧠", color: "border-blue-200 hover:border-blue-500" },
                { title: "Full Stack Web Development", desc: "Build scalable web apps from frontend to backend.", icon: "🌐", color: "border-green-200 hover:border-[var(--brand-green)]" },
                { title: "Data Science & Machine Learning", desc: "Dive into analytics, pandas, and neural networks.", icon: "📊", color: "border-purple-200 hover:border-purple-500" },
                { title: "Cloud Computing & DevOps", desc: "Learn AWS, Docker, Kubernetes and CI/CD pipelines.", icon: "☁️", color: "border-orange-200 hover:border-[var(--brand-orange)]" },
                { title: "System Design", desc: "Architect highly scalable and distributed systems.", icon: "🏗️", color: "border-yellow-200 hover:border-yellow-500" },
                { title: "Cybersecurity", desc: "Ethical hacking, network security, and cryptography.", icon: "🛡️", color: "border-red-200 hover:border-red-500" }
              ].map((card, idx) => (
                <Link to="/signup" key={idx} className={`bg-white rounded-3xl p-8 border-2 ${card.color} transition-all duration-300 hover:shadow-[var(--shadow-bubbly)] hover:-translate-y-2 group cursor-pointer block`}>
                  <div className="text-4xl mb-6 bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">{card.icon}</div>
                  <h3 className="text-2xl font-black text-[var(--land-text)] mb-3">{card.title}</h3>
                  <p className="text-[var(--land-nav)] font-bold mb-6 leading-relaxed">{card.desc}</p>
                  <div className="flex items-center text-[var(--brand-green)] font-extrabold uppercase tracking-widest text-xs">
                    Explore Track <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#1E293B] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Logo hideText={true} />
            <div>
              <span className="text-xl font-black tracking-tight block text-[var(--text-main)] dark:text-white">CodeWave Solution</span>
              <span className="text-gray-400 text-sm font-semibold">© 2026 CodeWave Solution. All rights reserved.</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-gray-300 font-bold">
            <a href="#" className="hover:text-white hover:underline transition-all">About Us</a>
            <a href="#" className="hover:text-white hover:underline transition-all">Careers</a>
            <a href="#" className="hover:text-white hover:underline transition-all">Privacy Policy</a>
            <a href="#" className="hover:text-white hover:underline transition-all">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
