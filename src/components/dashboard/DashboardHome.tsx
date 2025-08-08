import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Users, BookOpen, GraduationCap, TrendingUp, Award, Calendar, Clock, UserPlus } from 'lucide-react';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const { students, courses, enrollments } = useData();

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Courses',
      value: courses.length,
      change: '+5%',
      changeType: 'positive' as const,
      icon: BookOpen,
      color: 'indigo'
    },
    {
      title: 'Enrollments',
      value: enrollments.length,
      change: '+8%',
      changeType: 'positive' as const,
      icon: GraduationCap,
      color: 'emerald'
    },
    {
      title: 'Avg GPA',
      value: '3.75',
      change: '+0.2',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'enrollment', text: 'Emma Rodriguez enrolled in CS101', time: '2 hours ago', icon: UserPlus },
    { id: 2, type: 'grade', text: 'New grade submitted for MATH101', time: '4 hours ago', icon: Award },
    { id: 3, type: 'student', text: 'James Wilson updated profile', time: '6 hours ago', icon: Users },
    { id: 4, type: 'course', text: 'New course ENG101 created', time: '1 day ago', icon: BookOpen }
  ];

  const upcomingTasks = [
    { id: 1, task: 'Grade Submission Deadline - CS101', due: 'Tomorrow', priority: 'high' },
    { id: 2, task: 'Student Registration Opens', due: 'Next Week', priority: 'medium' },
    { id: 3, task: 'Faculty Meeting', due: 'Friday 2PM', priority: 'low' },
    { id: 4, task: 'System Maintenance', due: 'Weekend', priority: 'medium' }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500 from-blue-500 to-blue-600',
      indigo: 'bg-indigo-500 from-indigo-500 to-indigo-600',
      emerald: 'bg-emerald-500 from-emerald-500 to-emerald-600',
      purple: 'bg-purple-500 from-purple-500 to-purple-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100 text-lg">
          Here's what's happening with your {user?.role === 'admin' ? 'institution' : 'courses'} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">from last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{activity.text}</p>
                    <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
              View all activities
            </button>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="text-gray-900 text-sm font-medium">{task.task}</p>
                      <p className="text-gray-500 text-xs mt-1">{task.due}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
              View all tasks
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {user?.role === 'admin' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <Users className="w-6 h-6 text-gray-500" />
              <span className="text-gray-700 font-medium">Add New Student</span>
            </button>
            <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <BookOpen className="w-6 h-6 text-gray-500" />
              <span className="text-gray-700 font-medium">Create Course</span>
            </button>
            <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <GraduationCap className="w-6 h-6 text-gray-500" />
              <span className="text-gray-700 font-medium">Generate Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;