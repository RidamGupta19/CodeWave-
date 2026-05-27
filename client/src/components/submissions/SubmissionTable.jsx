import React from 'react';

const statusClasses = {
  Accepted: 'text-emerald-600',
  'Wrong Answer': 'text-amber-600',
  'Runtime Error': 'text-rose-600',
  'Compilation Error': 'text-rose-600',
  'Time Limit Exceeded': 'text-orange-600',
  'Judge Error': 'text-slate-600'
};

const SubmissionTable = ({ submissions, showUser = false, onViewCode }) => {
  if (!submissions.length) {
    return (
      <div className="card p-8 bg-white text-center">
        <h3 className="text-lg font-black text-[#101828]">No submissions yet</h3>
        <p className="text-[#667085] font-medium mt-2">
          Submit a solution to start building your history.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#f8fafc] border-b border-[#e5e7eb]">
            <tr className="text-[10px] font-black uppercase tracking-widest text-[#667085]">
              {showUser && <th className="px-5 py-4">User</th>}
              <th className="px-5 py-4">Problem</th>
              <th className="px-5 py-4">Language</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Runtime</th>
              <th className="px-5 py-4">Memory</th>
              <th className="px-5 py-4">Submitted</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id} className="border-b border-[#f2f4f7] last:border-b-0">
                {showUser && (
                  <td className="px-5 py-4 text-sm font-bold text-[#344054]">
                    {submission.user?.fullName}
                  </td>
                )}
                <td className="px-5 py-4">
                  <div className="font-black text-[#101828]">{submission.problem?.title}</div>
                  <div className="text-xs font-bold text-[#667085] mt-1">
                    {submission.problem?.difficulty || submission.topic}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-bold text-[#344054]">{submission.language}</td>
                <td className={`px-5 py-4 text-sm font-black ${statusClasses[submission.status] || 'text-slate-600'}`}>
                  {submission.status}
                </td>
                <td className="px-5 py-4 text-sm font-bold text-[#344054]">{submission.runtime || '—'}</td>
                <td className="px-5 py-4 text-sm font-bold text-[#344054]">{submission.memory || '—'}</td>
                <td className="px-5 py-4 text-sm font-bold text-[#344054]">
                  {new Date(submission.submittedAt || submission.createdAt).toLocaleString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <button type="button" onClick={() => onViewCode(submission)} className="btn-secondary">
                    View Code
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionTable;
