import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

const difficultyClasses = {
  Easy: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Medium: 'bg-amber-50 text-amber-700 border-amber-100',
  Hard: 'bg-rose-50 text-rose-700 border-rose-100'
};

const statusClasses = {
  solved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  attempted: 'bg-amber-50 text-amber-700 border-amber-100',
  unsolved: 'bg-slate-50 text-slate-500 border-slate-200'
};

const ProblemCard = ({ problem, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen(problem)}
    className="card w-full p-5 text-left hover:border-blue-200 hover:shadow-md transition-all"
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
              difficultyClasses[problem.difficulty] || statusClasses.unsolved
            }`}
          >
            {problem.difficulty}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
              statusClasses[problem.userStatus] || statusClasses.unsolved
            }`}
          >
            {problem.userStatus || 'unsolved'}
          </span>
        </div>
        <h3 className="text-lg font-black text-[#101828] tracking-tight">{problem.title}</h3>
        <p className="text-sm text-[#667085] font-medium mt-2 line-clamp-2">
          {problem.description}
        </p>
      </div>
      <FiArrowRight className="text-xl text-gray-300 shrink-0" />
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#667085]">
      <span>{problem.domain?.name}</span>
      <span>•</span>
      <span>{problem.topic}</span>
      <span>•</span>
      <span>{problem.problemType}</span>
    </div>

    {problem.tags?.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {problem.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-[10px] font-black uppercase tracking-widest text-[#475467]"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </button>
);

export default ProblemCard;
