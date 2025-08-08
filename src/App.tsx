import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/layout/Dashboard';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  if (!isAuthenticated) {
    return (
      <LoginForm 
        onLogin={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  return <Dashboard user={currentUser} onLogout={() => setIsAuthenticated(false)} />;
}

export default App;