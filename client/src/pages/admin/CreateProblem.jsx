import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import problemApi from '../../api/problemApi';
import ProblemForm from '../../components/admin/ProblemForm';

const CreateProblem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      await problemApi.create(payload);
      toast.success('Problem created successfully');
      navigate('/admin/problems');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 lg:px-8 space-y-6">
      <div>
        <div className="badge badge-blue mb-4 py-1.5 px-4 font-bold">Admin</div>
        <h1 className="text-4xl font-extrabold text-[#101828] tracking-tight">Create a new problem</h1>
        <p className="text-[#667085] text-lg font-medium mt-3">
          Add a challenge to the problem bank with test cases, starter code, and attached resources.
        </p>
      </div>

      <ProblemForm onSubmit={handleSubmit} submitLabel="Create Problem" loading={loading} />
    </div>
  );
};

export default CreateProblem;
