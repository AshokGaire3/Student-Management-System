import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  Plus,
  Check,
  X
} from 'lucide-react';

const CourseRegistration: React.FC = () => {
  const { user } = useAuth();
  const { courses, enrollments, addEnrollment, getStudentEnrollments } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('Spring 2024');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const studentEnrollments = user ? getStudentEnrollments(user.id) : [];
  const enrolledCourseIds = studentEnrollments.map((e: any) => e.courseId);

  const semesters = ['Spring 2024', 'Fall 2023', 'Summer 2024'];
  const departments = ['all', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = selectedSemester === 'all' || 
                           `${course.semester} ${course.year}` === selectedSemester;
    
    const matchesDepartment = selectedDepartment === 'all' || 
                             course.courseCode.startsWith(selectedDepartment.split(' ')[0].toUpperCase());
    
    return matchesSearch && matchesSemester && matchesDepartment;
  });

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    
    try {
      await addEnrollment({
        id: `enr-${Date.now()}`,
        studentId: user.id,
        courseId: courseId,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'enrolled' as const
      });
      alert('Successfully enrolled in the course!');
    } catch (error) {
      alert('Failed to enroll. Please try again.');
    }
  };

  const getCourseStatus = (courseId: string) => {
    if (enrolledCourseIds.includes(courseId)) {
      return 'enrolled';
    }
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return 'available';
    
    const courseEnrollments = enrollments.filter(e => e.courseId === courseId);
    if (courseEnrollments.length >= course.maxStudents) {
      return 'full';
    }
    
    return 'available';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enrolled':
        return <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Enrolled
        </span>;
      case 'full':
        return <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" />
          Full
        </span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          Available
        </span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Course Registration</h1>
        <p className="text-gray-600">Search and register for available courses</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, instructors, or course codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Semester Filter */}
          <div className="lg:w-48">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Semesters</option>
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="lg:w-48">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Departments</option>
              {departments.slice(1).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Current Enrollments Summary */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-900">Current Enrollment</h3>
            <p className="text-sm text-blue-700">
              You are enrolled in {studentEnrollments.length} courses this semester
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {studentEnrollments.length}/7
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Courses ({filteredCourses.length})
          </h2>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCourses.map((course) => {
              const status = getCourseStatus(course.id);
              const courseEnrollmentCount = enrollments.filter(e => e.courseId === course.id).length;
              
              return (
                <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {course.courseCode} - {course.courseName}
                        </h3>
                        {getStatusBadge(status)}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{course.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Instructor: {course.instructorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{course.semester} {course.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Credits: {course.credits}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>
                            {courseEnrollmentCount}/{course.maxStudents} enrolled
                          </span>
                        </div>
                      </div>
                      
                      {course.schedule && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Schedule:</span> {course.schedule}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      {status === 'enrolled' ? (
                        <div className="text-center">
                          <div className="text-green-600 font-medium mb-1">✓ Enrolled</div>
                          <button
                            className="text-sm text-red-600 hover:text-red-700"
                            onClick={() => {
                              // In a real app, this would handle unenrollment
                              alert('Contact your advisor to drop courses');
                            }}
                          >
                            Drop Course
                          </button>
                        </div>
                      ) : status === 'full' ? (
                        <div className="text-center text-gray-500">
                          <div className="font-medium mb-1">Course Full</div>
                          <button className="text-sm text-blue-600 hover:text-blue-700">
                            Join Waitlist
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Enroll
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseRegistration;
