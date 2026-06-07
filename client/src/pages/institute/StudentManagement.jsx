import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiX } from 'react-icons/fi';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  
  // Form State
  const [form, setForm] = useState({
    rollNumber: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    course: '',
    batch: '',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stuRes, crsRes, batRes] = await Promise.all([
        api.get('/institute/students'),
        api.get('/institute/courses'),
        api.get('/institute/batches')
      ]);
      setStudents(stuRes.data.data);
      setCourses(crsRes.data.data);
      setBatches(batRes.data.data);
    } catch (err) {
      toast.error('Failed to load students data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCourse) params.course = selectedCourse;
      if (selectedBatch) params.batch = selectedBatch;
      if (selectedStatus) params.status = selectedStatus;
      
      const res = await api.get('/institute/students', { params });
      setStudents(res.data.data);
    } catch (err) {
      toast.error('Search failed');
    }
  };

  useEffect(() => {
    handleSearch();
  }, [selectedCourse, selectedBatch, selectedStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAddModalOpen) {
        await api.post('/institute/students', form);
        toast.success('Student added successfully! Default password is CodeWave@123');
        setIsAddModalOpen(false);
      } else {
        await api.put(`/institute/students/${currentStudent._id}`, form);
        toast.success('Student updated successfully!');
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
      rollNumber: '',
      fullName: '',
      email: '',
      phone: '',
      address: '',
      course: '',
      batch: '',
      status: 'active'
    });
    setCurrentStudent(null);
  };

  const openEdit = (student) => {
    setCurrentStudent(student);
    setForm({
      rollNumber: student.rollNumber,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone || '',
      address: student.address || '',
      course: student.course?._id || '',
      batch: student.batch?._id || '',
      status: student.status
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/institute/students/${id}`);
      toast.success('Student deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-main)]">Student Directory</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Manage enrollments, batches and classes</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="btn-primary flex items-center gap-2 text-xs py-3 px-5"
        >
          <FiPlus strokeWidth={3} /> Add Student
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-5 bg-[var(--bg-card)] border border-[var(--border)] flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-[var(--bg-sub)] border border-[var(--border)] px-3 py-2.5 rounded-xl">
          <FiSearch className="text-[var(--text-light)]" />
          <input 
            type="text" 
            placeholder="Search by name, email, roll number..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="bg-transparent border-none outline-none text-xs w-full text-[var(--text-main)]"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={selectedCourse} 
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl px-4 py-2.5 outline-none font-bold text-[var(--text-main)]"
          >
            <option value="">All Courses</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
          </select>

          <select 
            value={selectedBatch} 
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl px-4 py-2.5 outline-none font-bold text-[var(--text-main)]"
          >
            <option value="">All Batches</option>
            {batches.map(b => <option key={b._id} value={b._id}>{b.batchName}</option>)}
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl px-4 py-2.5 outline-none font-bold text-[var(--text-main)]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          <button onClick={handleSearch} className="btn-secondary py-2.5 px-4 text-xs font-black uppercase">
            Apply
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="card bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-20 text-[var(--text-muted)] font-bold">
            No students found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-sub)]/55">
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-[var(--text-light)]">Roll Number</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-[var(--text-light)]">Full Name</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-[var(--text-light)]">Course / Batch</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-[var(--text-light)]">Status</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-[var(--text-light)]">Admission Date</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-[var(--text-light)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {students.map((stu) => (
                  <tr key={stu._id} className="hover:bg-[var(--bg-sub)]/25 transition-colors">
                    <td className="p-4 text-xs font-black text-[var(--text-main)]">{stu.rollNumber}</td>
                    <td className="p-4">
                      <div className="font-extrabold text-sm text-[var(--text-main)]">{stu.fullName}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">{stu.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-xs text-[var(--text-main)]">{stu.course?.courseName || 'N/A'}</div>
                      <div className="text-[10px] text-[var(--secondary)] font-extrabold uppercase mt-0.5">{stu.batch?.batchName || 'No Batch'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        stu.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : stu.status === 'inactive' 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {stu.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-semibold text-[var(--text-muted)]">
                      {new Date(stu.admissionDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEdit(stu)} 
                          className="p-1.5 hover:bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg transition-colors"
                        >
                          <FiEdit size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(stu._id)} 
                          className="p-1.5 hover:bg-red-500/10 text-rose-500 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <button 
              onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
              className="absolute top-4 right-4 p-2 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--bg-sub)] transition-colors"
            >
              <FiX size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6">
              {isAddModalOpen ? 'Add Student' : 'Edit Student'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Roll Number</label>
                  <input 
                    type="text" 
                    required 
                    disabled={isEditModalOpen}
                    value={form.rollNumber}
                    onChange={(e) => setForm({...form, rollNumber: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={form.fullName}
                    onChange={(e) => setForm({...form, fullName: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Email Address</label>
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
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Status</label>
                  <select 
                    value={form.status}
                    onChange={(e) => setForm({...form, status: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Course Assignment</label>
                  <select 
                    value={form.course}
                    onChange={(e) => setForm({...form, course: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="">No Course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Batch Assignment</label>
                  <select 
                    value={form.batch}
                    onChange={(e) => setForm({...form, batch: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                  >
                    <option value="">No Batch</option>
                    {batches.map(b => <option key={b._id} value={b._id}>{b.batchName}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Residential Address</label>
                <textarea 
                  rows="2"
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})}
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
                  className="btn-primary py-3 px-6 text-xs font-black uppercase shadow-lg"
                >
                  {isAddModalOpen ? 'Create Student' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
