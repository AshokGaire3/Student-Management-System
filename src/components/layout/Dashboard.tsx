import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardHome from '../dashboard/DashboardHome';
import StudentDashboard from '../students/StudentDashboard';
import StudentManagement from '../students/StudentManagement';
import CourseManagement from '../courses/CourseManagement';
import CourseRegistration from '../courses/CourseRegistration';
import GradeManagement from '../grades/GradeManagement';
import Reports from '../reports/Reports';
import EnrollmentManagement from '../enrollment/EnrollmentManagement';
import MajorChangeRequestManagement from '../admin/MajorChangeRequestManagement';
import Profile from '../profile/Profile';
import Settings from '../profile/Settings';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return user?.role === 'student' ? <StudentDashboard /> : <DashboardHome />;
      case 'students':
        return <StudentManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'course-registration':
        return <CourseRegistration />;
      case 'grades':
        return <GradeManagement />;
      case 'enrollment':
        return <EnrollmentManagement />;
      case 'major-requests':
        return <MajorChangeRequestManagement />;
      case 'reports':
        return <Reports />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return user?.role === 'student' ? <StudentDashboard /> : <DashboardHome />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={user?.role}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user}
          onLogout={onLogout}
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={setActiveView}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 lg:p-8">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;