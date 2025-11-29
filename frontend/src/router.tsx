import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SyllabusPage from './pages/SyllabusPage';
import SyllabusFullPage from './pages/SyllabusFullPage';
import MCQPracticePage from './pages/MCQPracticePage';
import MCQAI from './pages/MCQAI';
import ChatPage from './pages/ChatPage';
// import AccountPendingPage from './pages/AccountPendingPage'; // No longer directly redirected here
import { useAuth } from './hooks/useAuth';
import { LoadingScreen } from './components/UI/LoadingScreen';

const RequireAuth: React.FC<{ children: React.ReactElement; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, isAuthenticated, initialized, loading } = useAuth();

  if (!initialized || loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // PENDING status check is removed here, allowing them to access the dashboard.
  // Content blocking will be handled within the components.

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AuthRedirect: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAuthenticated, initialized, loading } = useAuth();
  if (!initialized || loading) {
    return <LoadingScreen />;
  }
  // Only redirect if authenticated and not ADMIN, and status is not PENDING
  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
};

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <AuthRedirect>
            <LoginPage />
          </AuthRedirect>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRedirect>
            <RegisterPage />
          </AuthRedirect>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      {/* The AccountPendingPage route is removed as redirection is no longer handled in RequireAuth */}
      {/* <Route
        path="/account-pending"
        element={<AccountPendingPage />}
      /> */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <UserDashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth adminOnly>
            <AdminDashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/mcq"
        element={
          <RequireAuth>
            <MCQPracticePage />
          </RequireAuth>
        }
      />
      <Route
        path="/mcq-ai"
        element={
          <RequireAuth>
            <MCQAI />
          </RequireAuth>
        }
      />
      <Route
        path="/chat"
        element={
          <RequireAuth>
            <ChatPage />
          </RequireAuth>
        }
      />
      <Route
        path="/syllabus"
        element={
          <RequireAuth>
            <SyllabusPage />
          </RequireAuth>
        }
      />
      <Route
        path="/syllabus/full"
        element={
          <RequireAuth>
            <SyllabusFullPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
