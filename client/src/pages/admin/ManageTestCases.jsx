import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import problemApi from '../../api/problemApi';
import TestCaseEditor from '../../components/admin/TestCaseEditor';

const ManageTestCases = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [visibleTestCases, setVisibleTestCases] = useState([]);
  const [hiddenTestCases, setHiddenTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await problemApi.getAll();
        const match = (response.data.data || []).find((item) => item._id === id);
        setProblem(match || null);
        setVisibleTestCases(match?.visibleTestCases || []);
        setHiddenTestCases(match?.hiddenTestCases || []);
      } catch (error) {
        toast.error('Failed to load problem');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await problemApi.update(id, {
        visibleTestCases,
        hiddenTestCases
      });
      toast.success('Test cases updated');
      navigate('/admin/problems');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save test cases');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 lg:px-8 space-y-6">
      <div>
        <div className="badge badge-blue mb-4 py-1.5 px-4 font-bold">Admin</div>
        <h1 className="text-4xl font-extrabold text-[#101828] tracking-tight">Manage test cases</h1>
        <p className="text-[#667085] text-lg font-medium mt-3">
          {problem?.title || 'Selected problem'}
        </p>
      </div>

      <div className="card p-6 bg-white">
        <TestCaseEditor
          label="Visible Test Cases"
          value={visibleTestCases}
          onChange={setVisibleTestCases}
        />
      </div>

      <div className="card p-6 bg-white">
        <TestCaseEditor
          label="Hidden Test Cases"
          value={hiddenTestCases}
          onChange={setHiddenTestCases}
        />
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => navigate('/admin/problems')} className="btn-secondary">
          Cancel
        </button>
        <button type="button" onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Test Cases'}
        </button>
      </div>
    </div>
  );
};

export default ManageTestCases;
