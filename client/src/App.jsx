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

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProblems from './pages/admin/ManageProblems';
import CreateProblem from './pages/admin/CreateProblem';
import EditProblem from './pages/admin/EditProblem';
import ManageSubmissions from './pages/admin/ManageSubmissions';
import ManageTestCases from './pages/admin/ManageTestCases';
import ManageTopics from './pages/admin/ManageTopics';

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

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
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
