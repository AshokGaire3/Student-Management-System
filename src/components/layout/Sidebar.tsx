import React from 'react';
import {
  Home,
  Users,
  BookOpen,
  GraduationCap,
  FileText,
  UserPlus,
  X,
  BarChart3,
  Calendar,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
  userRole: 'admin' | 'instructor' | 'student';
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isOpen,
  onClose,
  userRole
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'instructor', 'student'] },
    { id: 'students', label: 'Students', icon: Users, roles: ['admin', 'instructor'] },
    { id: 'courses', label: 'Courses', icon: BookOpen, roles: ['admin', 'instructor'] },
    { id: 'course-registration', label: 'Course Registration', icon: Calendar, roles: ['student'] },
    { id: 'grades', label: 'Grades', icon: GraduationCap, roles: ['admin', 'instructor', 'student'] },
    { id: 'enrollment', label: 'Enrollment', icon: UserPlus, roles: ['admin'] },
    { id: 'major-requests', label: 'Major Requests', icon: Settings, roles: ['admin'] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: ['admin', 'instructor'] }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const handleItemClick = (viewId: string) => {
    setActiveView(viewId);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EduManager</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Quick Stats</p>
              <p className="text-xs text-gray-500">Real-time analytics</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;