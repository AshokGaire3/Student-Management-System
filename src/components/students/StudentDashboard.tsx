import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { User, BookOpen, GraduationCap, Award, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import MajorChangeRequestModal from './MajorChangeRequestModal';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { students, enrollments, courses, majors, majorChangeRequests, getStudentGrades, getStudentCourses, getStudentMajor, calculateGPA } = useData();
  const [showMajorChangeModal, setShowMajorChangeModal] = useState(false);

  if (!user || user.role !== 'student') return null;

  const student = students.find(s => s.email === user.email);
  const studentMajor = student ? getStudentMajor(student.id) : null;
  const studentGrades = student ? getStudentGrades(student.id) : [];
  const studentCourses = student ? getStudentCourses(student.id) : [];
  const currentGPA = student ? calculateGPA(student.id) : 0;
  
  // Get major courses and completed courses
  const majorCourses = studentMajor ? courses.filter(c => c.majorId === studentMajor.id) : [];
  const completedCourses = studentCourses.filter(course => 
    enrollments.some(e => e.studentId === student?.id && e.courseId === course.id && e.status === 'completed')
  );
  
  // Get recent grades
  const recentGrades = studentGrades
    .sort((a, b) => new Date(b.dateAssigned).getTime() - new Date(a.dateAssigned).getTime())
    .slice(0, 5);

  // Get major change request status
  const pendingMajorRequest = student ? majorChangeRequests.find(
    req => req.studentId === student.id && req.status === 'pending'
  ) : null;

  const recentMajorRequest = student ? majorChangeRequests
    .filter(req => req.studentId === student.id)
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())[0] : null;

  if (!student) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Student Profile Not Found</h2>
        <p className="text-gray-600">Unable to load your student profile. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {student.firstName}!</h1>
            <p className="text-blue-100 text-lg">
              {studentMajor?.majorName} • GPA: {currentGPA.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Current GPA</p>
              <p className="text-3xl font-bold text-gray-900">{currentGPA.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Enrolled Courses</p>
              <p className="text-3xl font-bold text-gray-900">{studentCourses.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedCourses.length}</p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Credits</p>
              <p className="text-3xl font-bold text-gray-900">
                {completedCourses.reduce((sum, course) => sum + course.credits, 0)}
              </p>
            </div>
            <GraduationCap className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Major Information & Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Major Information</h2>
              <button
                onClick={() => setShowMajorChangeModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!!pendingMajorRequest}
              >
                {pendingMajorRequest ? 'Request Pending' : 'Change Major'}
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Current Major */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Current Major</h3>
                  <p className="text-blue-800">{studentMajor?.majorName} ({studentMajor?.majorCode})</p>
                </div>
              </div>
              <p className="text-blue-700 text-sm">{studentMajor?.description}</p>
              <div className="mt-3 text-sm text-blue-600">
                <span className="font-medium">Degree:</span> {studentMajor?.degreeType} • 
                <span className="font-medium"> Required Credits:</span> {studentMajor?.requiredCredits}
              </div>
            </div>

            {/* Major Change Request Status */}
            {recentMajorRequest && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Major Change Request</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    recentMajorRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    recentMajorRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {recentMajorRequest.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                    {recentMajorRequest.status.charAt(0).toUpperCase() + recentMajorRequest.status.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Requested:</span>
                    <span className="ml-2 font-medium">
                      {majors.find(m => m.id === recentMajorRequest.requestedMajorId)?.majorName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Submitted:</span>
                    <span className="ml-2">{recentMajorRequest.requestDate}</span>
                  </div>
                  {recentMajorRequest.status !== 'pending' && recentMajorRequest.reviewDate && (
                    <div>
                      <span className="text-gray-600">Reviewed:</span>
                      <span className="ml-2">{recentMajorRequest.reviewDate}</span>
                    </div>
                  )}
                  {recentMajorRequest.adminComments && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <span className="text-gray-600">Admin Comments:</span>
                      <p className="mt-1">{recentMajorRequest.adminComments}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Major Requirements Progress */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Major Requirements Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed Courses</span>
                  <span className="font-medium">{completedCourses.length} / {majorCourses.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${majorCourses.length > 0 ? (completedCourses.length / majorCourses.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Credits Earned</span>
                  <span className="font-medium">
                    {completedCourses.reduce((sum, course) => sum + course.credits, 0)} / {studentMajor?.requiredCredits || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${studentMajor ? Math.min((completedCourses.reduce((sum, course) => sum + course.credits, 0) / studentMajor.requiredCredits) * 100, 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Grades</h2>
          </div>
          <div className="p-6">
            {recentGrades.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No grades available yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentGrades.map((grade) => {
                  const course = courses.find(c => c.id === grade.courseId);
                  return (
                    <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{course?.courseName || 'Unknown Course'}</h4>
                        <p className="text-sm text-gray-600">{grade.assignment}</p>
                        <p className="text-xs text-gray-500">{grade.dateAssigned}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          grade.points >= 3.7 ? 'text-green-600' :
                          grade.points >= 3.0 ? 'text-blue-600' :
                          grade.points >= 2.0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {grade.grade}
                        </div>
                        <div className="text-sm text-gray-500">{grade.points} pts</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Enrollments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Current Enrollments</h2>
        </div>
        <div className="p-6">
          {studentCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No current enrollments</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentCourses.map((course) => {
                const enrollment = enrollments.find(e => e.studentId === student.id && e.courseId === course.id);
                const courseGrades = studentGrades.filter(g => g.courseId === course.id);
                const averageGrade = courseGrades.length > 0 
                  ? (courseGrades.reduce((sum, g) => sum + g.points, 0) / courseGrades.length).toFixed(1)
                  : 'N/A';
                
                return (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{course.courseName}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        enrollment?.status === 'enrolled' ? 'bg-green-100 text-green-800' :
                        enrollment?.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {enrollment?.status || 'Unknown'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{course.courseCode}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Instructor:</span>
                      <span>{course.instructorName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Credits:</span>
                      <span>{course.credits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Grade:</span>
                      <span className="font-medium">{averageGrade}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Major Change Request Modal */}
      <MajorChangeRequestModal 
        isOpen={showMajorChangeModal} 
        onClose={() => setShowMajorChangeModal(false)} 
      />
    </div>
  );
};

export default StudentDashboard;
