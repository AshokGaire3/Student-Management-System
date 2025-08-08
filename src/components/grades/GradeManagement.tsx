import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData, Grade } from '../../contexts/DataContext';
import { Search, Plus, Edit, Award, Filter, TrendingUp } from 'lucide-react';
import GradeModal from './GradeModal';

const GradeManagement: React.FC = () => {
  const { user } = useAuth();
  const { grades, students, courses, addGrade, updateGrade, getStudentGrades } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [modalMode, setModalMode] = useState<'edit' | 'create'>('create');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter grades based on user role and search criteria
  const filteredGrades = grades.filter(grade => {
    const student = students.find(s => s.id === grade.studentId);
    const course = courses.find(c => c.id === grade.courseId);
    
    if (!student || !course) return false;

    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = filterCourse === 'all' || grade.courseId === filterCourse;

    // For students, only show their own grades
    if (user?.role === 'student') {
      return matchesSearch && matchesCourse && grade.studentId === user.id;
    }

    return matchesSearch && matchesCourse;
  });

  const handleCreateGrade = () => {
    setSelectedGrade(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditGrade = (grade: Grade) => {
    setSelectedGrade(grade);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const getGradeColor = (points: number) => {
    if (points >= 3.7) return 'text-green-600 bg-green-100';
    if (points >= 3.0) return 'text-blue-600 bg-blue-100';
    if (points >= 2.0) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStudentGPA = (studentId: string) => {
    const studentGrades = getStudentGrades(studentId);
    if (studentGrades.length === 0) return 0;
    
    const totalPoints = studentGrades.reduce((sum, grade) => sum + grade.points, 0);
    return (totalPoints / studentGrades.length);
  };

  // Calculate summary statistics
  const totalGrades = filteredGrades.length;
  const avgGrade = totalGrades > 0 
    ? (filteredGrades.reduce((sum, grade) => sum + grade.points, 0) / totalGrades).toFixed(2)
    : '0.00';
  const highPerformers = filteredGrades.filter(grade => grade.points >= 3.5).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'student' 
              ? 'View your academic performance and grades'
              : 'Manage student grades and academic performance'
            }
          </p>
        </div>
        {user?.role !== 'student' && (
          <button
            onClick={handleCreateGrade}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Grade</span>
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Grades</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalGrades}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average Grade</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{avgGrade}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">High Performers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{highPerformers}</p>
              <p className="text-sm text-gray-500">A- or better</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students or courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.courseCode} - {course.courseName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Student</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Course</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Assignment</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Grade</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Points</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Date</th>
                {user?.role !== 'student' && (
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGrades.map((grade) => {
                const student = students.find(s => s.id === grade.studentId);
                const course = courses.find(c => c.id === grade.courseId);
                
                if (!student || !course) return null;

                return (
                  <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.avatar || `https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150`}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-gray-500">GPA: {getStudentGPA(student.id).toFixed(2)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{course.courseCode}</p>
                        <p className="text-sm text-gray-500">{course.courseName}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">{grade.assignment}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getGradeColor(grade.points)}`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">{grade.points.toFixed(1)}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(grade.dateAssigned).toLocaleDateString()}
                    </td>
                    {user?.role !== 'student' && (
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleEditGrade(grade)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Grade"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredGrades.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No grades found</h3>
                <p className="text-sm">
                  {searchTerm || filterCourse !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : user?.role === 'student' 
                      ? 'No grades have been assigned yet.'
                      : 'Start by adding grades for your students.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grade Modal */}
      <GradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        grade={selectedGrade}
        mode={modalMode}
      />
    </div>
  );
};

export default GradeManagement;