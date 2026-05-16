import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiCode, FiCpu, FiTerminal, FiLayers, FiExternalLink, FiChevronRight } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CareerGuide = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [selecting, setSelecting] = useState(false);

  const sections = [
    {
      id: 'web-dev',
      slug: 'web-development',
      title: 'Web Development',
      icon: <FiCode className="text-blue-500" />,
      content: `Web development is the most visible and accessible entry point into the tech industry. It involves creating everything from simple portfolios to complex SaaS platforms like GitHub or Airbnb. In today’s market, every business requires a digital presence, making web developers consistently high in demand.`,
      skills: [
        { name: 'Frontend', details: 'HTML5, CSS3, JavaScript (ES6+), React, Next.js' },
        { name: 'Backend', details: 'Node.js, Python (Django/Flask), Go' },
        { name: 'Databases', details: 'PostgreSQL, MySQL, MongoDB' }
      ],
      resources: [
        { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
        { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/' }
      ]
    },
    {
      id: 'dsa',
      slug: 'dsa',
      title: 'Data Structures & Algorithms',
      icon: <FiCpu className="text-purple-500" />,
      content: `DSA is the fundamental language of efficient problem-solving. Whether you are optimizing a search engine or managing a database, DSA helps you write code that is fast and scalable. It is also the primary filter used by top-tier tech companies during interviews.`,
      skills: [
        { name: 'Linear', details: 'Arrays, Linked Lists, Stacks, Queues' },
        { name: 'Non-Linear', details: 'Trees (Binary, Heaps), Graphs' },
        { name: 'Algorithms', details: 'Sorting, Binary Search, Dynamic Programming' }
      ],
      resources: [
        { name: 'LeetCode', url: 'https://leetcode.com/' },
        { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/' }
      ]
    },
    {
      id: 'cp',
      slug: 'dsa', // Linking CP to DSA domain as it's the closest match
      title: 'Competitive Programming',
      icon: <FiTerminal className="text-emerald-500" />,
      content: `Competitive Programming is a mental sport where you solve complex algorithmic puzzles under tight time constraints. It improves coding speed, logical accuracy, and your ability to handle edge cases in high-stakes engineering roles.`,
      skills: [
        { name: 'Mathematics', details: 'Number Theory, Combinatorics, Geometry' },
        { name: 'Platforms', details: 'Codeforces, AtCoder, CodeChef' },
        { name: 'Mindset', details: 'Consistency, Analytical thinking, Speed' }
      ],
      resources: [
        { name: 'Codeforces', url: 'https://codeforces.com/' },
        { name: 'USACO Guide', url: 'https://usaco.guide/' }
      ]
    },
    {
      id: 'devops',
      slug: 'devops',
      title: 'DevOps & Cloud',
      icon: <FiLayers className="text-orange-500" />,
      content: `DevOps bridges the gap between development and operations. It involves automation, containerization, and cloud infrastructure to ensure software is shipped faster and with fewer bugs.`,
      skills: [
        { name: 'Core Tools', details: 'Git, Docker, Kubernetes' },
        { name: 'Automation', details: 'GitHub Actions, Jenkins, CI/CD Pipelines' },
        { name: 'Cloud', details: 'AWS, Azure, Google Cloud Platform' }
      ],
      resources: [
        { name: 'Roadmap.sh', url: 'https://roadmap.sh/devops' },
        { name: 'Docker Docs', url: 'https://docs.docker.com/' }
      ]
    }
  ];

  const handleSelectDomain = async (slug) => {
    setSelecting(true);
    try {
      // 1. Fetch domain by slug
      const res = await api.get('/domains');
      const domain = res.data.data.find(d => d.slug === slug);
      
      if (!domain) {
        toast.error('Domain roadmap not found yet.');
        return;
      }

      // 2. Select it
      await api.post('/progress/select-domain', { domainId: domain._id });
      await refreshUser();
      toast.success(`You've chosen ${domain.name}!`);
      navigate('/setup-profile');
    } catch (err) {
      toast.error('Failed to select roadmap');
    } finally {
      setSelecting(false);
    }
  };

  return (
    <div className="fade-in max-w-5xl mx-auto py-12 px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16 text-center">
        <div className="badge badge-blue mb-4 py-1.5 px-4 font-bold">Expert Guide</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#101828] tracking-tight mb-6">
          Navigating Your Tech Journey
        </h1>
        <p className="text-xl text-[#667085] font-medium max-w-3xl mx-auto leading-relaxed">
          A comprehensive breakdown of core computer science domains to help you move from ambiguity to professional mastery.
        </p>
      </div>

      {/* Introduction Card */}
      <div className="card p-8 bg-[#101828] border-none mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4361ee]/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 border border-white/10 text-white">
            <FiBookOpen />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">The Roadmap to Success</h2>
            <p className="text-indigo-100/70 leading-relaxed font-medium">
              The most successful tech professionals aren't those who know everything, but those who build a deep mastery of a specific domain while maintaining a broad understanding of the tech ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Guide Sections */}
      <div className="space-y-20">
        {sections.map((section, idx) => (
          <div key={section.id} id={section.id} className="relative">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Content Side */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#eaecf0] shadow-sm flex items-center justify-center text-2xl">
                    {section.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-[#101828] tracking-tight">{section.title}</h2>
                </div>
                <p className="text-lg text-[#475467] leading-relaxed mb-8">
                  {section.content}
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {section.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="p-4 rounded-xl bg-[#f9fafb] border border-[#eaecf0]">
                      <div className="text-xs font-black text-[#98a2b3] uppercase tracking-widest mb-1">{skill.name}</div>
                      <div className="text-sm font-bold text-[#344054]">{skill.details}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Side */}
              <div className="lg:w-80">
                <div className="card p-6 bg-white border-soft sticky top-24">
                  <h4 className="text-sm font-black text-[#101828] uppercase tracking-widest mb-6 border-b border-[#f2f4f7] pb-3">Recommended Learning</h4>
                  <div className="space-y-3">
                    {section.resources.map((res, rIdx) => (
                      <a 
                        key={rIdx} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border border-[#eaecf0] hover:border-[#4361ee] hover:bg-indigo-50 transition-all group"
                      >
                        <span className="text-sm font-bold text-[#475467] group-hover:text-[#4361ee]">{res.name}</span>
                        <FiExternalLink className="text-[#98a2b3] group-hover:text-[#4361ee]" />
                      </a>
                    ))}
                  </div>
                  <button 
                    disabled={selecting}
                    onClick={() => handleSelectDomain(section.slug)}
                    className="w-full mt-6 py-2.5 rounded-lg bg-[#4361ee] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#3730a3] transition-all disabled:opacity-50"
                  >
                    {selecting ? "Setting Up..." : "Start This Roadmap"} <FiChevronRight />
                  </button>
                </div>
              </div>
            </div>
            {idx !== sections.length - 1 && (
              <div className="mt-20 border-b border-[#f2f4f7] w-1/2 mx-auto"></div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Advice */}
      <div className="mt-32 p-10 rounded-3xl bg-[#fcfcfd] border-2 border-dashed border-[#eaecf0] text-center">
        <h3 className="text-2xl font-bold text-[#101828] mb-4">Ready to Commit?</h3>
        <p className="text-[#667085] max-w-2xl mx-auto mb-8 font-medium">
          Choose a domain above or explore all 14 specializations in our academy to start your journey.
        </p>
        <button 
          onClick={() => navigate('/domains')}
          className="btn-primary py-3 px-8 text-lg shadow-xl shadow-indigo-100"
        >
          Browse All Specializations
        </button>
      </div>
    </div>
  );
};

export default CareerGuide;
