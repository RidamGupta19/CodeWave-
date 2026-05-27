import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import submissionApi from '../../api/submissionApi';
import api from '../../api/axios';
import SubmissionTable from '../../components/submissions/SubmissionTable';

const ManageSubmissions = () => {
  const [domains, setDomains] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filters, setFilters] = useState({
    domainId: '',
    status: '',
    language: '',
    search: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await submissionApi.getAll({
        domainId: filters.domainId,
        status: filters.status,
        language: filters.language
      });
      const allSubmissions = response.data.data || [];
      const searchValue = filters.search.trim().toLowerCase();
      const filtered = searchValue
        ? allSubmissions.filter((submission) => {
            const haystack = `${submission.user?.fullName || ''} ${submission.problem?.title || ''}`.toLowerCase();
            return haystack.includes(searchValue);
          })
        : allSubmissions;
      setSubmissions(filtered);
    } catch (error) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/domains').then((response) => setDomains(response.data.data || []));
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [filters.domainId, filters.status, filters.language, filters.search]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 lg:px-8 space-y-6">
      <div>
        <div className="badge badge-blue mb-4 py-1.5 px-4 font-bold">Admin</div>
        <h1 className="text-4xl font-extrabold text-[#101828] tracking-tight">Manage submissions</h1>
        <p className="text-[#667085] text-lg font-medium mt-3 max-w-3xl">
          Review what students are shipping, inspect verdict trends, and open any submitted code.
        </p>
      </div>

      <div className="card p-5 bg-white grid md:grid-cols-4 gap-4">
        <input
          type="text"
          value={filters.search}
          onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          placeholder="Search by user or problem"
          className="rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
        />
        <select
          value={filters.domainId}
          onChange={(event) => setFilters((current) => ({ ...current, domainId: event.target.value }))}
          className="rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
        >
          <option value="">All domains</option>
          {domains.map((domain) => (
            <option key={domain._id} value={domain._id}>
              {domain.name}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
          className="rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
        >
          <option value="">All verdicts</option>
          <option value="Accepted">Accepted</option>
          <option value="Wrong Answer">Wrong Answer</option>
          <option value="Runtime Error">Runtime Error</option>
          <option value="Compilation Error">Compilation Error</option>
          <option value="Time Limit Exceeded">Time Limit Exceeded</option>
        </select>
        <select
          value={filters.language}
          onChange={(event) => setFilters((current) => ({ ...current, language: event.target.value }))}
          className="rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
        >
          <option value="">All languages</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="C++">C++</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <SubmissionTable
          submissions={submissions}
          showUser={true}
          onViewCode={setSelectedSubmission}
        />
      )}

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card w-full max-w-5xl bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#101828]">
                  {selectedSubmission.user?.fullName} • {selectedSubmission.problem?.title}
                </h2>
                <p className="text-sm text-[#667085] font-medium">
                  {selectedSubmission.language} • {selectedSubmission.status}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedSubmission(null)} className="btn-secondary">
                Close
              </button>
            </div>
            <pre className="rounded-2xl bg-[#0f172a] p-4 text-sm text-slate-100 overflow-auto max-h-[65vh]">
              {selectedSubmission.code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubmissions;
