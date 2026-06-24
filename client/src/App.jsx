import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Domains from './pages/Domains';
import Roadmap from './pages/Roadmap';
import TopicDetail from './pages/TopicDetail';
import Assessments from './pages/Assessments';
import AiChat from './pages/AiChat';
import Resources from './pages/Resources';
import CareerGuide from './pages/CareerGuide';
import ZeroToCoding from './pages/ZeroToCoding';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProblems from './pages/admin/ManageProblems';
import CreateProblem from './pages/admin/CreateProblem';
import EditProblem from './pages/admin/EditProblem';
import ManageSubmissions from './pages/admin/ManageSubmissions';
import ManageTestCases from './pages/admin/ManageTestCases';
import ManageTopics from './pages/admin/ManageTopics';

// Institute Pages
import StudentManagement from './pages/institute/StudentManagement';
import TeacherManagement from './pages/institute/TeacherManagement';
import CourseManagement from './pages/institute/CourseManagement';
import BatchManagement from './pages/institute/BatchManagement';
import AttendanceManagement from './pages/institute/AttendanceManagement';
import FeesManagement from './pages/institute/FeesManagement';
import NoticeBoard from './pages/institute/NoticeBoard';
import StudyMaterials from './pages/institute/StudyMaterials';
import ClassScheduler from './pages/institute/ClassScheduler';
import AssignmentManagement from './pages/institute/AssignmentManagement';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentLiveClasses from './pages/student/StudentLiveClasses';
import StudentVideoLectures from './pages/student/StudentVideoLectures';
import StudentNotes from './pages/student/StudentNotes';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentAssessments from './pages/student/StudentAssessments';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentResults from './pages/student/StudentResults';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentProfile from './pages/student/StudentProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ className: 'premium-toast', style: { background: '#ffffff', color: '#101828', border: '1px solid #eaecf0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(16, 24, 40, 0.1)' } }} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Student / Teacher / Admin General Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'admin', 'teacher']} />}>
            <Route element={<Layout />}>
              <Route path="/setup-profile" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/domains" element={<Domains />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/topic/:id" element={<TopicDetail />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/code-guru" element={<AiChat />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/career-guide" element={<CareerGuide />} />
              <Route path="/zero-to-coding" element={<ZeroToCoding />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Student Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<Layout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<StudentCourses />} />
              <Route path="/student/live-classes" element={<StudentLiveClasses />} />
              <Route path="/student/video-lectures" element={<StudentVideoLectures />} />
              <Route path="/student/notes" element={<StudentNotes />} />
              <Route path="/student/assignments" element={<StudentAssignments />} />
              <Route path="/student/assessments" element={<StudentAssessments />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
              <Route path="/student/results" element={<StudentResults />} />
              <Route path="/student/notifications" element={<StudentNotifications />} />
              <Route path="/student/profile" element={<StudentProfile />} />
            </Route>
          </Route>

          {/* Teacher and Admin Only Institute Management Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher']} />}>
            <Route element={<Layout />}>
              <Route path="/institute/students" element={<StudentManagement />} />
              <Route path="/institute/teachers" element={<TeacherManagement />} />
              <Route path="/institute/courses" element={<CourseManagement />} />
              <Route path="/institute/batches" element={<BatchManagement />} />
              <Route path="/institute/attendance" element={<AttendanceManagement />} />
              <Route path="/institute/fees" element={<FeesManagement />} />
              <Route path="/institute/notices" element={<NoticeBoard />} />
              <Route path="/institute/materials" element={<StudyMaterials />} />
              <Route path="/institute/schedule" element={<ClassScheduler />} />
              <Route path="/institute/assignments" element={<AssignmentManagement />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<Layout isAdmin={true} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminDashboard />} />
              <Route path="/admin/problems" element={<ManageProblems />} />
              <Route path="/admin/problems/create" element={<CreateProblem />} />
              <Route path="/admin/problems/edit/:id" element={<EditProblem />} />
              <Route path="/admin/problems/test-cases/:id" element={<ManageTestCases />} />
              <Route path="/admin/submissions" element={<ManageSubmissions />} />
              <Route path="/admin/topics" element={<ManageTopics />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
