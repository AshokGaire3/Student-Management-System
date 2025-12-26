import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './services/toast';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/layout/Dashboard';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gray-50">
            <AppContent />
          </div>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

function AppContent() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <Dashboard user={user} onLogout={logout} />;
}

export default App;