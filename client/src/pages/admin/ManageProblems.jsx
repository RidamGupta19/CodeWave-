import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import problemApi from '../../api/problemApi';
import api from '../../api/axios';
import ProblemFilters from '../../components/problems/ProblemFilters';

const defaultFilters = {
  search: '',
  domainId: '',
  topic: '',
  difficulty: '',
  problemType: '',
  status: '',
  tags: '',
  isPublished: ''
};

const ManageProblems = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState([]);
  const [problems, setProblems] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);

  const fetchProblems = async (activeFilters = filters) => {
    setLoading(true);
    try {
      const response = await problemApi.getAll(activeFilters);
      setProblems(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/domains').then((response) => setDomains(response.data.data || []));
    fetchProblems(defaultFilters);
  }, []);

  useEffect(() => {
    fetchProblems(filters);
  }, [filters.search, filters.domainId, filters.topic, filters.difficulty, filters.problemType, filters.tags, filters.isPublished]);

  const togglePublish = async (problem) => {
    try {
      await problemApi.update(problem._id, { isPublished: !problem.isPublished });
      toast.success(problem.isPublished ? 'Problem moved to draft' : 'Problem published');
      fetchProblems();
    } catch (error) {
      toast.error('Failed to update publish state');
    }
  };

  const deleteProblem = async (problem) => {
    if (!window.confirm(`Delete "${problem.title}"?`)) {
      return;
    }

    try {
      await problemApi.remove(problem._id);
      toast.success('Problem deleted');
      fetchProblems();
    } catch (error) {
      toast.error('Failed to delete problem');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 lg:px-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="badge badge-blue mb-4 py-1.5 px-4 font-bold">Admin</div>
          <h1 className="text-4xl font-extrabold text-[#101828] tracking-tight">Manage Problems</h1>
          <p className="text-[#667085] text-lg font-medium mt-3 max-w-3xl">
            Publish curated practice challenges without disturbing the rest of the roadmap system.
          </p>
        </div>
        <button type="button" onClick={() => navigate('/admin/problems/create')} className="btn-primary">
          Create Problem
        </button>
      </div>

      <ProblemFilters
        filters={filters}
        domains={domains}
        onChange={(field, value) => setFilters((current) => ({ ...current, [field]: value }))}
        onReset={() => setFilters(defaultFilters)}
        adminMode={true}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f8fafc] border-b border-[#e5e7eb]">
                <tr className="text-[10px] font-black uppercase tracking-widest text-[#667085]">
                  <th className="px-5 py-4">Problem</th>
                  <th className="px-5 py-4">Domain</th>
                  <th className="px-5 py-4">Topic</th>
                  <th className="px-5 py-4">Difficulty</th>
                  <th className="px-5 py-4">State</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem) => (
                  <tr key={problem._id} className="border-b border-[#f2f4f7] last:border-b-0">
                    <td className="px-5 py-4">
                      <div className="font-black text-[#101828]">{problem.title}</div>
                      <div className="text-xs font-bold text-[#667085] mt-1">{problem.problemType}</div>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#344054]">{problem.domain?.name}</td>
                    <td className="px-5 py-4 text-sm font-bold text-[#344054]">{problem.topic}</td>
                    <td className="px-5 py-4 text-sm font-bold text-[#344054]">{problem.difficulty}</td>
                    <td className="px-5 py-4 text-sm font-black text-[#2563eb]">
                      {problem.isPublished ? 'Published' : 'Draft'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/problems/edit/${problem._id}`)}
                          className="btn-secondary"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/problems/test-cases/${problem._id}`)}
                          className="btn-secondary"
                        >
                          Test Cases
                        </button>
                        <button type="button" onClick={() => togglePublish(problem)} className="btn-secondary">
                          {problem.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button type="button" onClick={() => deleteProblem(problem)} className="btn-secondary text-rose-600">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProblems;
