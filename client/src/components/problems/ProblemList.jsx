import React from 'react';
import ProblemCard from './ProblemCard';

const difficultyClasses = {
  Easy: 'text-emerald-600',
  Medium: 'text-amber-600',
  Hard: 'text-rose-600'
};

const statusText = {
  solved: 'Solved',
  attempted: 'Attempted',
  unsolved: 'Unsolved'
};

const ProblemList = ({ problems, onSelect }) => {
  if (problems.length === 0) {
    return (
      <div className="card p-10 bg-white text-center">
        <h3 className="text-xl font-black text-[#101828]">No problems found</h3>
        <p className="text-[#667085] font-medium mt-2">
          Try widening the filters or switching to another domain.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden lg:block card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8fafc] border-b border-[#e5e7eb]">
            <tr className="text-[10px] font-black text-[#667085] uppercase tracking-widest">
              <th className="px-5 py-4">Problem</th>
              <th className="px-5 py-4">Topic</th>
              <th className="px-5 py-4">Domain</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr
                key={problem._id}
                onClick={() => onSelect(problem)}
                className="border-b border-[#f2f4f7] last:border-b-0 cursor-pointer hover:bg-[#f9fafb] transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="font-black text-[#101828]">{problem.title}</div>
                  <div className="flex items-center gap-3 mt-1 text-sm font-bold">
                    <span className={difficultyClasses[problem.difficulty] || 'text-slate-600'}>
                      {problem.difficulty}
                    </span>
                    <span className="text-[#98a2b3]">•</span>
                    <span className="text-[#667085]">{problem.tags?.slice(0, 3).join(', ')}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-bold text-[#475467]">{problem.topic}</td>
                <td className="px-5 py-4 text-sm font-bold text-[#475467]">{problem.domain?.name}</td>
                <td className="px-5 py-4 text-sm font-bold text-[#475467]">{problem.problemType}</td>
                <td className="px-5 py-4 text-sm font-black text-[#2563eb]">
                  {statusText[problem.userStatus] || 'Unsolved'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {problems.map((problem) => (
          <ProblemCard key={problem._id} problem={problem} onOpen={onSelect} />
        ))}
      </div>
    </div>
  );
};

export default ProblemList;
