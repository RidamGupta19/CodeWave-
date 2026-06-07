import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiX, FiUsers, FiClock, FiCalendar } from 'react-icons/fi';

export default function BatchManagement() {
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(null);
  
  // Form State
  const [form, setForm] = useState({
    batchName: '',
    startDate: '',
    endDate: '',
    timing: '',
    assignedTeacher: '',
    students: [] // Array of student IDs
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [batRes, teaRes, stuRes] = await Promise.all([
        api.get('/institute/batches'),
        api.get('/institute/teachers'),
        api.get('/institute/students')
      ]);
      setBatches(batRes.data.data);
      setTeachers(teaRes.data.data);
      setStudents(stuRes.data.data);
    } catch (err) {
      toast.error('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAddModalOpen) {
        await api.post('/institute/batches', form);
        toast.success('Batch created successfully!');
        setIsAddModalOpen(false);
      } else {
        await api.put(`/institute/batches/${currentBatch._id}`, form);
        toast.success('Batch updated successfully!');
        setIsEditModalOpen(false);
      }
      fetchData();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setForm({
      batchName: '',
      startDate: '',
      endDate: '',
      timing: '',
      assignedTeacher: '',
      students: []
    });
    setCurrentBatch(null);
  };

  const openEdit = (batch) => {
    setCurrentBatch(batch);
    setForm({
      batchName: batch.batchName,
      startDate: batch.startDate ? new Date(batch.startDate).toISOString().substring(0, 10) : '',
      endDate: batch.endDate ? new Date(batch.endDate).toISOString().substring(0, 10) : '',
      timing: batch.timing,
      assignedTeacher: batch.assignedTeacher?._id || '',
      students: batch.students?.map(s => s._id) || []
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this batch?')) return;
    try {
      await api.delete(`/institute/batches/${id}`);
      toast.success('Batch deleted');
      fetchData();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const handleStudentSelect = (studentId) => {
    const isSelected = form.students.includes(studentId);
    let updated;
    if (isSelected) {
      updated = form.students.filter(id => id !== studentId);
    } else {
      updated = [...form.students, studentId];
    }
    setForm({ ...form, students: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Learning Batches</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Configure batch rosters, class timings and student groupings</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="btn-primary flex items-center gap-2 text-xs py-3 px-5"
        >
          <FiPlus strokeWidth={3} /> Add Batch
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : batches.length === 0 ? (
          <div className="col-span-full card p-10 text-center text-[var(--text-muted)] font-bold">
            No batches configured yet.
          </div>
        ) : (
          batches.map(b => (
            <div key={b._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5">
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-xl font-bold shadow-sm shrink-0 text-green-600">
                    <FiUsers />
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg">
                      <FiEdit size={14} />
                    </button>
                    <button onClick={() => handleDelete(b._id)} className="p-1.5 hover:bg-red-500/10 text-rose-500 rounded-lg">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-base font-black text-[var(--text-main)] mt-4">{b.batchName}</h3>
                
                <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <FiClock className="text-[var(--primary)]" />
                    <span className="font-semibold">{b.timing}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <FiCalendar className="text-[var(--primary)]" />
                    <span className="font-semibold">
                      Starts: {new Date(b.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Instructor</span>
                    <p className="font-bold text-[var(--text-main)] mt-0.5">{b.assignedTeacher?.name || 'Unassigned'}</p>
                  </div>
                  <div className="pt-1">
                    <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Enrolled Count</span>
                    <p className="font-extrabold text-[var(--secondary)] mt-0.5">{b.students?.length || 0} Students</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Batch Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
              className="absolute top-4 right-4 p-2 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--bg-sub)]"
            >
              <FiX size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6">
              {isAddModalOpen ? 'Create New Batch' : 'Edit Batch Config'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Batch Name</label>
                <input 
                  type="text" 
                  required
                  value={form.batchName}
                  onChange={(e) => setForm({...form, batchName: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="e.g. Alpha Web Dev"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({...form, startDate: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">End Date</label>
                  <input 
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({...form, endDate: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Timing Schedule</label>
                  <input 
                    type="text" 
                    required
                    value={form.timing}
                    onChange={(e) => setForm({...form, timing: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                    placeholder="e.g. 10:00 AM - 12:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Assign Instructor</label>
                  <select 
                    value={form.assignedTeacher}
                    onChange={(e) => setForm({...form, assignedTeacher: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="">Select Instructor</option>
                    {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Roster Selection */}
              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-2">Enroll Students (Roster)</label>
                <div className="bg-[var(--bg-sub)] border border-[var(--border)] rounded-xl p-3 max-h-[160px] overflow-y-auto space-y-1.5 custom-scrollbar">
                  {students.map(s => {
                    const isSelected = form.students.includes(s._id);
                    return (
                      <div 
                        key={s._id} 
                        onClick={() => handleStudentSelect(s._id)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors text-xs font-bold ${
                          isSelected 
                            ? 'bg-[var(--primary)] text-white' 
                            : 'hover:bg-[var(--bg-card)] text-[var(--text-main)]'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          readOnly
                          className="accent-[var(--primary)] shrink-0" 
                        />
                        <div className="truncate">
                          <span>{s.fullName}</span>
                          <span className={`text-[10px] ml-2 ${isSelected ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>({s.rollNumber})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                  {isAddModalOpen ? 'Create Batch' : 'Save Config'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
