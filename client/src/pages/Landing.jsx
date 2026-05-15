import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTarget, FiMap, FiAward, FiCpu, FiCheckCircle, FiUsers, FiTrendingUp, FiLayers, FiBookOpen, FiZap } from 'react-icons/fi';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col selection:bg-indigo-100">
      {/* Navbar */}
      <nav className="navbar px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4361ee] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
              CF
            </div>
            <h1 className="text-2xl font-bold text-[#101828] tracking-tight">CareerForge</h1>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[#475467] font-medium">
            <a href="#features" className="hover:text-[#101828] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#101828] transition-colors">How it Works</a>
            <a href="#impact" className="hover:text-[#101828] transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-[#475467] hover:text-[#101828] font-semibold transition-colors px-4 py-2">Log In</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-24 pb-32 px-6 overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8 fade-in">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Modern career engineering for the next generation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#101828] tracking-tight mb-8 leading-[1.1] fade-in">
              Master your tech career <br className="hidden md:block" />
              <span className="text-[#4361ee]">with intention.</span>
            </h1>
            
            <p className="text-xl text-[#667085] mb-12 max-w-2xl mx-auto leading-relaxed fade-in">
              Stop wandering. Follow expert-designed roadmaps, track your deep work, and build the technical expertise required by industry leaders.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in">
              <Link to="/signup" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto shadow-xl shadow-indigo-100">
                Start Learning Now <FiArrowRight className="ml-2" />
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                Explore Curriculum
              </Link>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="py-20 border-y border-[#eaecf0] bg-[#f9fafb]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#101828] mb-2">14+</div>
                <div className="text-[#667085] font-medium uppercase text-xs tracking-widest">Domains</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#101828] mb-2">500+</div>
                <div className="text-[#667085] font-medium uppercase text-xs tracking-widest">Topics</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#101828] mb-2">2.4k</div>
                <div className="text-[#667085] font-medium uppercase text-xs tracking-widest">Engineers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#101828] mb-2">100%</div>
                <div className="text-[#667085] font-medium uppercase text-xs tracking-widest">Open Access</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-[#101828] mb-6 tracking-tight">Built for human focus</h2>
              <p className="text-[#667085] max-w-2xl mx-auto text-lg">A polished, minimalist experience designed to help you focus on what matters: your growth.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card p-8 card-hover border-soft bg-white">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                  <FiBookOpen />
                </div>
                <h3 className="text-xl font-bold text-[#101828] mb-3">Structured Content</h3>
                <p className="text-[#667085] leading-relaxed">No more infinite scrolling through tutorials. Follow a logical progression from fundamentals to mastery.</p>
              </div>

              <div className="card p-8 card-hover border-soft bg-white">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                  <FiTrendingUp />
                </div>
                <h3 className="text-xl font-bold text-[#101828] mb-3">Progress Tracking</h3>
                <p className="text-[#667085] leading-relaxed">Visualize your learning journey with clean activity heatmaps and beautiful, informative dashboard widgets.</p>
              </div>

              <div className="card p-8 card-hover border-soft bg-white">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                  <FiAward />
                </div>
                <h3 className="text-xl font-bold text-[#101828] mb-3">Skill Validation</h3>
                <p className="text-[#667085] leading-relaxed">Validate your theoretical knowledge with assessments and earn badges that actually mean something.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 px-6 bg-[#f9fafb] border-y border-[#eaecf0]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-[#101828] mb-8 leading-tight tracking-tight">Simple. Intentional. <br/>Results-driven.</h2>
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-[#eaecf0] shadow-sm flex items-center justify-center font-bold text-[#4361ee]">1</div>
                    <div>
                      <h4 className="text-xl font-bold text-[#101828] mb-2">Identify your domain</h4>
                      <p className="text-[#667085] text-lg">Select your specialized path from 14+ technical domains, each mapped to real-world job requirements.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-[#eaecf0] shadow-sm flex items-center justify-center font-bold text-[#4361ee]">2</div>
                    <div>
                      <h4 className="text-xl font-bold text-[#101828] mb-2">Build deep expertise</h4>
                      <p className="text-[#667085] text-lg">Work through structured modules with curated resources that avoid the common 'tutorial hell'.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-[#eaecf0] shadow-sm flex items-center justify-center font-bold text-[#4361ee]">3</div>
                    <div>
                      <h4 className="text-xl font-bold text-[#101828] mb-2">Earn your credentials</h4>
                      <p className="text-[#667085] text-lg">Complete assessments to verify your mastery and earn badges that document your learning progression.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="card overflow-hidden shadow-2xl border-soft p-1.5 bg-[#f2f4f7] rotate-1">
                  <div className="bg-white rounded-[10px] p-8 min-h-[400px] flex flex-col justify-center items-center text-center">
                    <div className="w-20 h-20 bg-indigo-50 rounded-2xl mb-8 flex items-center justify-center text-3xl text-indigo-600">
                      <FiCpu />
                    </div>
                    <h4 className="text-2xl font-bold text-[#101828] mb-3">Intelligent Mentorship</h4>
                    <p className="text-[#667085] max-w-xs text-lg leading-relaxed">A dedicated AI assistant that understands your roadmap and helps you overcome technical hurdles 24/7.</p>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-200 rounded-full blur-[120px] -z-10 opacity-30"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto card bg-[#101828] p-12 md:p-24 text-center relative overflow-hidden border-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to master your future?</h2>
              <p className="text-indigo-100/60 mb-12 text-xl max-w-2xl mx-auto leading-relaxed">Join a community of focused students building the future of technology, one module at a time.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/signup" className="btn-primary bg-white text-[#101828] hover:bg-[#fcfcfd] border-white px-12 py-5 w-full sm:w-auto font-bold text-xl">
                  Get Started for Free
                </Link>
                <Link to="/login" className="text-white border-white/20 hover:bg-white/5 btn-secondary px-12 py-5 w-full sm:w-auto font-bold text-xl bg-transparent">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#eaecf0] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 pb-16 border-b border-[#f2f4f7]">
            <div className="space-y-6 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4361ee] flex items-center justify-center text-white font-bold text-sm">CF</div>
                <span className="text-xl font-bold text-[#101828] tracking-tight">CareerForge</span>
              </div>
              <p className="text-[#667085] leading-relaxed">Helping students build professional engineering careers through structured, intentional learning paths.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-4">
                <h5 className="font-bold text-[#101828]">Platform</h5>
                <ul className="space-y-3 text-[#667085]">
                  <li><a href="#features" className="hover:text-[#4361ee]">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-[#4361ee]">Roadmaps</a></li>
                  <li><a href="#" className="hover:text-[#4361ee]">Curriculum</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-[#101828]">Support</h5>
                <ul className="space-y-3 text-[#667085]">
                  <li><a href="#" className="hover:text-[#4361ee]">Help Center</a></li>
                  <li><a href="#" className="hover:text-[#4361ee]">Resources</a></li>
                  <li><a href="#" className="hover:text-[#4361ee]">Contact</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-[#101828]">Social</h5>
                <ul className="space-y-3 text-[#667085]">
                  <li><a href="#" className="hover:text-[#4361ee]">Twitter</a></li>
                  <li><a href="#" className="hover:text-[#4361ee]">GitHub</a></li>
                  <li><a href="#" className="hover:text-[#4361ee]">LinkedIn</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[#98a2b3] text-sm">
            <p>&copy; {new Date().getFullYear()} CareerForge. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-[#667085]">Privacy Policy</a>
              <a href="#" className="hover:text-[#667085]">Terms of Service</a>
              <a href="#" className="hover:text-[#667085]">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
