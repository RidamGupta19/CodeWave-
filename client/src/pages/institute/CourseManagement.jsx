import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiX, FiBook } from 'react-icons/fi';

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  
  // Form State
  const [form, setForm] = useState({
    courseName: '',
    description: '',
    duration: '',
    fees: '',
    assignedTeacher: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [crsRes, teaRes] = await Promise.all([
        api.get('/institute/courses'),
        api.get('/institute/teachers')
      ]);
      setCourses(crsRes.data.data);
      setTeachers(teaRes.data.data);
    } catch (err) {
      toast.error('Failed to load courses data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAddModalOpen) {
        await api.post('/institute/courses', form);
        toast.success('Course created successfully!');
        setIsAddModalOpen(false);
      } else {
        await api.put(`/institute/courses/${currentCourse._id}`, form);
        toast.success('Course updated successfully!');
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
      courseName: '',
      description: '',
      duration: '',
      fees: '',
      assignedTeacher: ''
    });
    setCurrentCourse(null);
  };

  const openEdit = (course) => {
    setCurrentCourse(course);
    setForm({
      courseName: course.courseName,
      description: course.description || '',
      duration: course.duration,
      fees: course.fees,
      assignedTeacher: course.assignedTeacher?._id || ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.delete(`/institute/courses/${id}`);
      toast.success('Course deleted');
      fetchData();
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Course Catalogs</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Configure syllabus, tuition pricing and curriculum tracks</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="btn-primary flex items-center gap-2 text-xs py-3 px-5"
        >
          <FiPlus strokeWidth={3} /> Add Course
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="col-span-full card p-10 text-center text-[var(--text-muted)] font-bold">
            No courses configured yet.
          </div>
        ) : (
          courses.map(c => (
            <div key={c._id} className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5">
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl font-bold shadow-sm shrink-0 text-indigo-600">
                    <FiBook />
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-[var(--bg-sub)] text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg">
                      <FiEdit size={14} />
                    </button>
                    <button onClick={() => handleDelete(c._id)} className="p-1.5 hover:bg-red-500/10 text-rose-500 rounded-lg">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-base font-black text-[var(--text-main)] mt-4">{c.courseName}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1.5 line-clamp-2 leading-relaxed">{c.description || 'No description provided.'}</p>
                
                <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Duration</span>
                    <p className="font-bold text-[var(--text-main)] mt-0.5">{c.duration}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Tuition Fee</span>
                    <p className="font-extrabold text-[var(--primary)] mt-0.5">₹{c.fees}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Instructor</span>
                    <p className="font-bold text-[var(--text-main)] mt-0.5">{c.assignedTeacher?.name || 'Unassigned'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Course Modal */}
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
              {isAddModalOpen ? 'Create Course Track' : 'Edit Course Details'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Course Title</label>
                <input 
                  type="text" 
                  required
                  value={form.courseName}
                  onChange={(e) => setForm({...form, courseName: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="e.g. Full Stack Development"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Duration</label>
                  <input 
                    type="text" 
                    required
                    value={form.duration}
                    onChange={(e) => setForm({...form, duration: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                    placeholder="e.g. 6 Months"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Course Fees (INR)</label>
                  <input 
                    type="number" 
                    required
                    value={form.fees}
                    onChange={(e) => setForm({...form, fees: e.target.value})}
                    className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                    placeholder="e.g. 15000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Assign Instructor</label>
                <select 
                  value={form.assignedTeacher}
                  onChange={(e) => setForm({...form, assignedTeacher: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-bold"
                >
                  <option value="">Select Instructor</option>
                  {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.subject})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Course Description</label>
                <textarea 
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="Outline key technologies and topics taught..."
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
                  {isAddModalOpen ? 'Create Course' : 'Save Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
