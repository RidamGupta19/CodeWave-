import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FiAward, FiCheckSquare, FiBookmark, FiZap, FiTarget, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentResults() {
  const { user } = useAuth();
  const [careerData, setCareerData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const [progRes, assignRes] = await Promise.all([
        api.get('/progress/dashboard'),
        api.get('/institute/assignments')
      ]);
      setCareerData(progRes.data.data);
      setAssignments(assignRes.data.data);
    } catch (err) {
      console.error('Error fetching results:', err);
      toast.error('Failed to load performance results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg mb-6" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-32 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-32 bg-[var(--bg-sub)]/30 rounded-2xl" />
          <div className="h-32 bg-[var(--bg-sub)]/30 rounded-2xl" />
        </div>
        <div className="h-64 bg-[var(--bg-sub)]/30 rounded-2xl" />
      </div>
    );
  }

  // Process career test results
  const activeDomain = careerData?.user?.selectedDomain;
  const progressKey = activeDomain ? (activeDomain.slug === 'web-development' || activeDomain.slug === 'webdev' ? 'webdev' : (activeDomain.slug === 'opensource' || activeDomain.slug === 'open-source' ? 'opensource' : (activeDomain.slug === 'devops' ? 'devops' : 'dsa'))) : 'dsa';
  const domainProgress = careerData?.user?.domainsProgress?.[progressKey] || {};
  const testResults = domainProgress.testResults || [];
  
  // Process classroom assignment grades
  const studentId = careerData?.user?._id;
  const gradedAssignments = assignments.filter(a => {
    const sub = a.submissions?.find(s => s.status === 'Graded');
    return sub !== undefined;
  }).map(a => {
    const sub = a.submissions.find(s => s.status === 'Graded');
    return {
      title: a.title,
      grade: sub.grade,
      feedback: sub.feedback,
      date: sub.submittedAt
    };
  });

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">Grades & Performance</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Review aggregated academic marks, technical test logs and career roadmap credentials</p>
      </div>

      {/* Stats Summary cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">XP Milestones</span>
          <div className="text-2xl font-black text-[var(--primary)] mt-2 flex items-center justify-center gap-1">
            <FiZap /> {careerData?.user?.xp || 0}
          </div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Quizzes Passed</span>
          <div className="text-2xl font-black text-[var(--text-main)] mt-2">
            {testResults.filter(t => t.passed).length}
          </div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Assignments Graded</span>
          <div className="text-2xl font-black text-[var(--text-main)] mt-2">
            {gradedAssignments.length}
          </div>
        </div>
        <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm text-center">
          <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Overall Progress</span>
          <div className="text-2xl font-black text-[var(--success)] mt-2">
            {careerData?.user?.overallProgress || 0}%
          </div>
        </div>
      </div>

      {/* Main results panel */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Classroom Grades Table */}
        <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-[var(--border-light)]">
              <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
                <FiBookmark /> Classroom Assignment Grades
              </h3>
            </div>
            {gradedAssignments.length === 0 ? (
              <div className="p-12 text-center text-[var(--text-muted)] font-semibold">
                No assignments have been graded yet.
              </div>
            ) : (
              <div className="overflow-x-auto text-xs font-semibold">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[var(--bg-sub)]/50 border-b border-[var(--border-light)] text-[var(--text-muted)] font-black uppercase tracking-wider">
                      <th className="p-4">Assignment Topic</th>
                      <th className="p-4">Mentor Feedback</th>
                      <th className="p-4 text-right">Grade Letter</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--text-main)]">
                    {gradedAssignments.map((ga, idx) => (
                      <tr key={idx} className="border-b border-[var(--border-light)] last:border-b-0 hover:bg-[var(--bg-sub)]/10">
                        <td className="p-4 font-black">{ga.title}</td>
                        <td className="p-4 text-[var(--text-muted)] italic">"{ga.feedback || 'Good attempt!'}"</td>
                        <td className="p-4 text-right text-[var(--success)] font-black text-sm">{ga.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Technical assessments checkpoints logs */}
        <div className="card bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[var(--border-light)]">
            <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider flex items-center gap-2">
              <FiCheckSquare /> Programming Quizzes Checkpoints
            </h3>
          </div>
          {testResults.length === 0 ? (
            <div className="p-12 text-center text-[var(--text-muted)] font-semibold">
              No technical assessments submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto text-xs font-semibold">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--bg-sub)]/50 border-b border-[var(--border-light)] text-[var(--text-muted)] font-black uppercase tracking-wider">
                    <th className="p-4">Assessment ID</th>
                    <th className="p-4">Submission Score</th>
                    <th className="p-4 text-right">Quiz Status</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text-main)]">
                  {testResults.map((tr, idx) => (
                    <tr key={tr._id || idx} className="border-b border-[var(--border-light)] last:border-b-0 hover:bg-[var(--bg-sub)]/10">
                      <td className="p-4 font-mono font-bold text-[var(--text-light)]">
                        {String(tr.assessmentId).slice(-8).toUpperCase()}
                      </td>
                      <td className="p-4">{tr.score}%</td>
                      <td className="p-4 text-right">
                        {tr.passed ? (
                          <span className="px-2 py-0.5 bg-green-50 text-[var(--success)] border border-green-100 rounded text-[9px] font-black uppercase tracking-wide">
                            Passed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-50 text-rose-500 border border-red-100 rounded text-[9px] font-black uppercase tracking-wide">
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
