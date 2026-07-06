import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FiUserPlus, FiLayers, FiCalendar, FiClock, FiTrash2, 
  FiPlus, FiBookOpen, FiUser, FiCheckCircle, FiAlertCircle 
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminAllocationHub() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  // Selections
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [courseStatus, setCourseStatus] = useState('Active');

  const [selectedScheduleBatch, setSelectedScheduleBatch] = useState('');
  const [scheduleData, setScheduleData] = useState({
    classDays: [],
    startTime: '19:00',
    endTime: '21:00',
    timezone: 'Asia/Kolkata',
    holidayDates: [],
    extraClasses: []
  });

  // Teacher Swap state
  const [selectedTeacherBatch, setSelectedTeacherBatch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  // Add items states
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '' });
  const [newExtraClass, setNewExtraClass] = useState({ date: '', startTime: '19:00', endTime: '21:00', topic: '' });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHubData();
  }, []);

  const fetchHubData = async () => {
    try {
      setLoading(true);
      const [resStudents, resTeachers, resCourses, resBatches] = await Promise.all([
        api.get('/admin/users/students', { params: { limit: 1000 } }),
        api.get('/admin/users/teachers', { params: { limit: 1000 } }),
        api.get('/admin/courses'),
        api.get('/admin/batches')
      ]);

      setStudents(resStudents.data.data || resStudents.data.students || []);
      setTeachers(resTeachers.data.data || resTeachers.data.teachers || []);
      setCourses(resCourses.data.data || resCourses.data || []);
      setBatches(resBatches.data.data || resBatches.data || []);
    } catch (err) {
      console.error('Failed to fetch allocations hub data:', err);
      toast.error('Failed to load allocation options');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
    // Find if student has existing course/batch
    const found = students.find(s => s._id === studentId || s.userId?._id === studentId);
    if (found) {
      const userObj = found.userId || found;
      setSelectedCourse(userObj.courseId || found.course?._id || '');
      setSelectedBatch(userObj.batchId || found.batch?._id || '');
      setCourseStatus(userObj.courseStatus || 'Active');
    }
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourse) {
      return toast.error('Please select both a student and a course.');
    }

    const payload = {
      userId: selectedStudent,
      courseId: selectedCourse,
      batchId: selectedBatch || undefined,
      courseStatus
    };

    const loadToast = toast.loading('Allocating Course & Batch...');
    try {
      await api.post('/admin/course/assign', payload);
      toast.success('Allocated Course & Batch successfully!', { id: loadToast });
      fetchHubData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Allocation failed', { id: loadToast });
    }
  };

  const handleRemoveCourse = async () => {
    if (!selectedStudent) return toast.error('Please select a student.');

    const loadToast = toast.loading('Removing course allocation...');
    try {
      await api.delete('/admin/course/remove', { data: { userId: selectedStudent } });
      toast.success('Course assignment removed successfully!', { id: loadToast });
      setSelectedCourse('');
      setSelectedBatch('');
      fetchHubData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove allocation', { id: loadToast });
    }
  };

  // Schedule functions
  const handleScheduleBatchSelect = async (batchId) => {
    setSelectedScheduleBatch(batchId);
    if (!batchId) return;

    try {
      const found = batches.find(b => b._id === batchId);
      if (found) {
        // Look up schedule via schedule controller or defaults
        setScheduleData({
          classDays: ['Monday', 'Wednesday', 'Friday'],
          startTime: found.timing ? found.timing.split(' - ')[0] || '19:00' : '19:00',
          endTime: found.timing ? found.timing.split(' - ')[1] || '21:00' : '21:00',
          timezone: 'Asia/Kolkata',
          holidayDates: [],
          extraClasses: []
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDayToggle = (day) => {
    setScheduleData(prev => {
      const days = prev.classDays.includes(day)
        ? prev.classDays.filter(d => d !== day)
        : [...prev.classDays, day];
      return { ...prev, classDays: days };
    });
  };

  const addHoliday = () => {
    if (!newHoliday.date || !newHoliday.name) return toast.error('Enter holiday details');
    setScheduleData(prev => ({
      ...prev,
      holidayDates: [...prev.holidayDates, { ...newHoliday, date: new Date(newHoliday.date) }]
    }));
    setNewHoliday({ name: '', date: '' });
  };

  const removeHoliday = (idx) => {
    setScheduleData(prev => ({
      ...prev,
      holidayDates: prev.holidayDates.filter((_, i) => i !== idx)
    }));
  };

  const addExtraClass = () => {
    if (!newExtraClass.date || !newExtraClass.startTime) return toast.error('Enter extra class details');
    setScheduleData(prev => ({
      ...prev,
      extraClasses: [...prev.extraClasses, { ...newExtraClass, date: new Date(newExtraClass.date) }]
    }));
    setNewExtraClass({ date: '', startTime: '19:00', endTime: '21:00', topic: '' });
  };

  const removeExtraClass = (idx) => {
    setScheduleData(prev => ({
      ...prev,
      extraClasses: prev.extraClasses.filter((_, i) => i !== idx)
    }));
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    if (!selectedScheduleBatch) return toast.error('Please select a batch.');

    const loadToast = toast.loading('Saving batch timetable schedules...');
    try {
      await api.put('/admin/schedule/update', {
        batchId: selectedScheduleBatch,
        ...scheduleData
      });
      toast.success('Updated schedule successfully!', { id: loadToast });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update schedule', { id: loadToast });
    }
  };

  // Swap Teacher
  const handleTeacherSwapSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacherBatch) return toast.error('Please select a batch.');

    const loadToast = toast.loading('Assigning instructor to batch...');
    try {
      await api.put('/admin/batch/update', {
        batchId: selectedTeacherBatch,
        assignedTeacher: selectedTeacher || null
      });
      toast.success('Instructor updated successfully!', { id: loadToast });
      fetchHubData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign teacher', { id: loadToast });
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div className="grid lg:grid-cols-2 gap-8 text-left">
        
        {/* PANEL 1: COURSE & BATCH ALLOCATION */}
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h4 className="text-sm font-black uppercase text-slate-700 dark:text-white tracking-wider flex items-center gap-2">
              <FiUserPlus className="text-emerald-650 dark:text-indigo-400" /> Course & Batch Allocator
            </h4>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Assign courses, shift batches, and drop students from active syllabi tracks.</p>
          </div>

          <form onSubmit={handleAssignCourse} className="space-y-4">
            
            {/* Student selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Select Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold focus:border-emerald-600 dark:focus:border-indigo-600 transition-all"
                required
              >
                <option value="">-- Choose a Student --</option>
                {students.map(s => {
                  const labelName = s.userId?.fullName || s.fullName || s.email;
                  const roll = s.rollNumber || '';
                  return (
                    <option key={s._id} value={s.userId?._id || s._id}>
                      {labelName} {roll ? `(${roll})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Course selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Course Track</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold focus:border-emerald-600 dark:focus:border-indigo-600 transition-all"
                required
              >
                <option value="">-- Choose Course --</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.courseName} ({c.duration})</option>
                ))}
              </select>
            </div>

            {/* Batch Selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Batch Assignment</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold focus:border-emerald-600 dark:focus:border-indigo-600 transition-all"
              >
                <option value="">-- Choose Batch --</option>
                {batches.map(b => (
                  <option key={b._id} value={b._id}>{b.batchName} ({b.timing})</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Enrollment Status</label>
              <select
                value={courseStatus}
                onChange={(e) => setCourseStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold focus:border-emerald-600 dark:focus:border-indigo-600 transition-all"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all"
              >
                Assign Allocation
              </button>
              
              {selectedStudent && (
                <button
                  type="button"
                  onClick={handleRemoveCourse}
                  className="px-5 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-450 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  Remove Course
                </button>
              )}
            </div>

          </form>
        </div>

        {/* PANEL 2: TEACHER SWAP ASSIGNMENT */}
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h4 className="text-sm font-black uppercase text-slate-700 dark:text-white tracking-wider flex items-center gap-2">
              <FiUser className="text-emerald-650 dark:text-indigo-400" /> Instructor & Teacher Swaps
            </h4>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Reassign lecturers and primary mentors to academic classroom groups.</p>
          </div>

          <form onSubmit={handleTeacherSwapSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Target Batch</label>
              <select
                value={selectedTeacherBatch}
                onChange={(e) => {
                  setSelectedTeacherBatch(e.target.value);
                  const found = batches.find(b => b._id === e.target.value);
                  setSelectedTeacher(found?.assignedTeacher?._id || found?.assignedTeacher || '');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold focus:border-emerald-600 dark:focus:border-indigo-600 transition-all"
                required
              >
                <option value="">-- Choose Academic Batch --</option>
                {batches.map(b => (
                  <option key={b._id} value={b._id}>{b.batchName} ({b.timing})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Assigned Lecturer/Teacher</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold focus:border-emerald-600 dark:focus:border-indigo-600 transition-all"
              >
                <option value="">-- None / Unassigned --</option>
                {teachers.map(t => (
                  <option key={t._id} value={t._id}>{t.name} ({t.subject || 'Lecturer'})</option>
                ))}
              </select>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all"
              >
                Confirm Teacher Swap
              </button>
            </div>

          </form>
        </div>

        {/* PANEL 3: BATCH SCHEDULES & HOLIDAYS */}
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-6 lg:col-span-2">
          <div>
            <h4 className="text-sm font-black uppercase text-slate-700 dark:text-white tracking-wider flex items-center gap-2">
              <FiCalendar className="text-emerald-650 dark:text-indigo-400" /> Batch Schedules, Holidays & Extra Classes
            </h4>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Configure class days, timings, holidays list, and extra sessions schedules.</p>
          </div>

          <form onSubmit={handleUpdateSchedule} className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Target Batch</label>
                  <select
                    value={selectedScheduleBatch}
                    onChange={(e) => handleScheduleBatchSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold focus:border-emerald-600 dark:focus:border-indigo-600 transition-all"
                    required
                  >
                    <option value="">-- Select Batch --</option>
                    {batches.map(b => (
                      <option key={b._id} value={b._id}>{b.batchName} ({b.timing})</option>
                    ))}
                  </select>
                </div>

                {/* Class Days Checkboxes */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Weekly Class Days</label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => {
                      const isActive = scheduleData.classDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`px-3 py-1.5 border rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                            isActive 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-indigo-950/20 dark:border-indigo-500 dark:text-indigo-400' 
                              : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Timings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Start Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 19:00"
                      value={scheduleData.startTime}
                      onChange={(e) => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold focus:border-emerald-600 dark:focus:border-indigo-600 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">End Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 21:00"
                      value={scheduleData.endTime}
                      onChange={(e) => setScheduleData({ ...scheduleData, endTime: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold focus:border-emerald-600 dark:focus:border-indigo-600 transition-all"
                    />
                  </div>
                </div>

                {/* Timezone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Time Zone</label>
                  <input
                    type="text"
                    value={scheduleData.timezone}
                    onChange={(e) => setScheduleData({ ...scheduleData, timezone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-xl outline-none text-xs text-slate-800 dark:text-white font-semibold focus:border-emerald-600 dark:focus:border-indigo-600 transition-all"
                  />
                </div>

              </div>

              {/* Holidays & Extra classes */}
              <div className="space-y-6">
                
                {/* Holidays configuration */}
                <div className="space-y-3 p-4 bg-rose-500/[0.01] border border-rose-500/10 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider">Configure Holidays</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Holiday name"
                      value={newHoliday.name}
                      onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                      className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-lg outline-none text-xs text-slate-800 dark:text-white font-semibold"
                    />
                    <input
                      type="date"
                      value={newHoliday.date}
                      onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                      className="px-2 py-1.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-lg outline-none text-xs text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={addHoliday}
                      className="px-3 bg-rose-500 text-white rounded-lg text-xs font-black"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {scheduleData.holidayDates.map((h, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-1.5 bg-slate-100/50 dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded">
                        <span>{h.name} ({new Date(h.date).toLocaleDateString()})</span>
                        <button type="button" onClick={() => removeHoliday(idx)} className="text-rose-500 hover:text-rose-600">
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extra Classes configuration */}
                <div className="space-y-3 p-4 bg-cyan-500/[0.01] border border-cyan-500/10 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-cyan-500 tracking-wider">Configure Extra Classes</span>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Topic"
                        value={newExtraClass.topic}
                        onChange={(e) => setNewExtraClass({ ...newExtraClass, topic: e.target.value })}
                        className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-lg outline-none text-xs text-slate-800 dark:text-white font-semibold"
                      />
                      <input
                        type="date"
                        value={newExtraClass.date}
                        onChange={(e) => setNewExtraClass({ ...newExtraClass, date: e.target.value })}
                        className="px-2 py-1.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-lg outline-none text-xs text-slate-800"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Start Time"
                        value={newExtraClass.startTime}
                        onChange={(e) => setNewExtraClass({ ...newExtraClass, startTime: e.target.value })}
                        className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-lg outline-none text-xs text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={addExtraClass}
                        className="px-4 py-1.5 bg-cyan-500 text-white rounded-lg text-xs font-black"
                      >
                        Add Class
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {scheduleData.extraClasses.map((ec, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-1.5 bg-slate-100/50 dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 rounded">
                        <span>{ec.topic || 'Extra Class'} ({new Date(ec.date).toLocaleDateString()} @ {ec.startTime})</span>
                        <button type="button" onClick={() => removeExtraClass(idx)} className="text-rose-500 hover:text-rose-600">
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={!selectedScheduleBatch}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all animate-pulse"
              >
                Save Batch Schedule Timetable
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
