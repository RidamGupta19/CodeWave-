import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiUsers, FiMap, FiCheckSquare, FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) {
      toast.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Overview of platform metrics</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<FiUsers />} color="blue" />
        <StatCard title="Students" value={stats?.totalStudents || 0} icon={<FiUsers />} color="emerald" />
        <StatCard title="Active Domains" value={stats?.totalDomains || 0} icon={<FiMap />} color="indigo" />
        <StatCard title="Assessments" value={stats?.totalAssessments || 0} icon={<FiCheckSquare />} color="amber" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h2 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full btn-secondary justify-between">
              Manage Domains <FiMap />
            </button>
            <button className="w-full btn-secondary justify-between">
              Manage Users <FiUsers />
            </button>
            <button className="w-full btn-secondary justify-between">
              Manage Assessments <FiCheckSquare />
            </button>
            <button className="w-full btn-secondary justify-between">
              Manage Badges <FiAward />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">More CRUD management tools can be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className={`glass p-6 border ${colorMap[color].split(' ')[2]}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colorMap[color].split(' ')[0]} ${colorMap[color].split(' ')[1]}`}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm font-medium text-slate-400">{title}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
