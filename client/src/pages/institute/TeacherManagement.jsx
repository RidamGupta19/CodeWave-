import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    experience: '',
    salary: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/institute/teachers');
      setTeachers(res.data.data);
    } catch (err) {
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAddModalOpen) {
        await api.post('/institute/teachers', form);
        toast.success('Teacher account created! Default password: CodeWave@123');
        setIsAddModalOpen(false);
      } else {
        await api.put(`/institute/teachers/${currentTeacher._id}`, form);
        toast.success('Teacher updated successfully!');
        setIsEditModalOpen(false);
      }
      fetchTeachers();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      subject: '',
      qualification: '',
      experience: '',
      salary: ''
    });
    setCurrentTeacher(null);
  };

  const openEdit = (teacher) => {
    setCurrentTeacher(teacher);
    setForm({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone || '',
      subject: teacher.subject,
      qualification: teacher.qualification || '',
      experience: teacher.experience || '',
      salary: teacher.salary || ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher account? This will unassign them from courses/batches.')) return;
    try {
      await api.delete(`/institute/teachers/${id}`);
      toast.success('Teacher deleted');
      fetchTeachers();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Teacher Management</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Configure staff, subjects and qualifications</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="btn-primary flex items-center gap-2 text-xs py-3 px-5"
        >
          <FiPlus strokeWidth={3} /> Add Instructor
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : teachers.length === 0 ? (
          <div className="col-span-full card p-10 text-center text-[var(--text-muted)] font-bold">
            No instructors registered yet.
          </div>
        ) : (
          teachers.map(t => (
            <div key={t._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-xl font-bold shadow-sm shrink-0">
                    👨‍🏫
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(t)} className="p-1.5 hover:bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg">
                      <FiEdit size={14} />
                    </button>
                    <button onClick={() => handleDelete(t._id)} className="p-1.5 hover:bg-red-500/10 text-rose-500 rounded-lg">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-base font-black text-[var(--text-main)] mt-4">{t.name}</h3>
                <p className="text-xs text-[var(--text-muted)] font-semibold mt-0.5">{t.email}</p>
                
                <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Subject</span>
                    <p className="font-extrabold text-[var(--primary)] mt-0.5">{t.subject}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Experience</span>
                    <p className="font-bold text-[var(--text-main)] mt-0.5">{t.experience || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Qualification</span>
                    <p className="font-bold text-[var(--text-main)] mt-0.5 truncate">{t.qualification || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Salary (Monthly)</span>
                    <p className="font-bold text-[var(--text-main)] mt-0.5">₹{t.salary || '0'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Instructor Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button 
              onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
              className="absolute top-4 right-4 p-2 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--bg-sub)]"
            >
              <FiX size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6">
              {isAddModalOpen ? 'Register Instructor' : 'Edit Instructor details'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Email address</label>
                <input 
                  type="email" 
                  required
                  disabled={isEditModalOpen}
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Phone</label>
                  <input 
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Subject specialty</label>
                  <input 
                    type="text" 
                    required
                    value={form.subject}
                    onChange={(e) => setForm({...form, subject: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Qualification</label>
                  <input 
                    type="text" 
                    value={form.qualification}
                    onChange={(e) => setForm({...form, qualification: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Experience</label>
                  <input 
                    type="text" 
                    value={form.experience}
                    onChange={(e) => setForm({...form, experience: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Monthly Salary (INR)</label>
                <input 
                  type="number" 
                  value={form.salary}
                  onChange={(e) => setForm({...form, salary: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className="btn-secondary py-3 px-5 text-xs font-black uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary py-3 px-6 text-xs font-black uppercase"
                >
                  {isAddModalOpen ? 'Create Account' : 'Save Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
