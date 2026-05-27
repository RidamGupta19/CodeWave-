import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If student hasn't selected a domain, redirect to /domains
  if (user.role === 'student' && !user.activeDomain && window.location.pathname !== '/domains' && window.location.pathname !== '/career-guide') {
     return <Navigate to="/domains" replace />;
  }

  // Force profile setup for students
  if (user.role === 'student' && user.activeDomain && !user.profile?.isProfileComplete && window.location.pathname !== '/setup-profile') {
     return <Navigate to="/setup-profile" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
