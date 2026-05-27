import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import problemApi from '../../api/problemApi';
import ProblemForm from '../../components/admin/ProblemForm';

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await problemApi.getAll();
        const match = (response.data.data || []).find((item) => item._id === id);
        setProblem(match || null);
      } catch (error) {
        toast.error('Failed to load problem');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      await problemApi.update(id, payload);
      toast.success('Problem updated successfully');
      navigate('/admin/problems');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update problem');
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
        <h1 className="text-4xl font-extrabold text-[#101828] tracking-tight">Edit problem</h1>
        <p className="text-[#667085] text-lg font-medium mt-3">
          Update statement details, test coverage, and publishing controls.
        </p>
      </div>

      {problem ? (
        <ProblemForm
          initialValues={problem}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          loading={saving}
        />
      ) : (
        <div className="card p-8 bg-white text-center">
          <h2 className="text-xl font-black text-[#101828]">Problem not found</h2>
        </div>
      )}
    </div>
  );
};

export default EditProblem;
