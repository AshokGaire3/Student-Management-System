import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { X, Users, BookOpen, Calendar, AlertCircle } from 'lucide-react';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ isOpen, onClose }) => {
  const { students, courses, enrollments, enrollStudent } = useData();
  
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'enrolled' as const
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for existing enrollment
    const existingEnrollment = enrollments.find(
      e => e.studentId === formData.studentId && e.courseId === formData.courseId
    );
    
    if (existingEnrollment) {
      setWarnings(['Student is already enrolled in this course.']);
      return;
    }

    enrollStudent(formData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      courseId: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'enrolled'
    });
    setWarnings([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear warnings when user makes changes
    if (warnings.length > 0) {
      setWarnings([]);
    }
  };

  const validateEnrollment = () => {
    const newWarnings: string[] = [];
    
    if (formData.studentId && formData.courseId) {
      // Check if already enrolled
      const existingEnrollment = enrollments.find(
        e => e.studentId === formData.studentId && e.courseId === formData.courseId
      );
      
      if (existingEnrollment) {
        newWarnings.push('Student is already enrolled in this course.');
      }
      
      // Check course capacity
      const course = courses.find(c => c.id === formData.courseId);
      if (course && course.enrolledStudents >= course.maxStudents) {
        newWarnings.push('Course is at maximum capacity.');
      }
    }
    
    setWarnings(newWarnings);
  };

  // Validate when student or course selection changes
  React.useEffect(() => {
    if (formData.studentId && formData.courseId) {
      validateEnrollment();
    } else {
      setWarnings([]);
    }
  }, [formData.studentId, formData.courseId]);

  if (!isOpen) return null;

  const selectedStudent = students.find(s => s.id === formData.studentId);
  const selectedCourse = courses.find(c => c.id === formData.courseId);

  // Get student's current enrollments
  const studentEnrollments = formData.studentId 
    ? enrollments.filter(e => e.studentId === formData.studentId && e.status === 'enrolled')
    : [];

  const totalCredits = studentEnrollments.reduce((sum, enrollment) => {
    const course = courses.find(c => c.id === enrollment.courseId);
    return sum + (course?.credits || 0);
  }, 0);

  const newTotalCredits = selectedCourse ? totalCredits + selectedCourse.credits : totalCredits;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Enroll Student</h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Select Student
            </label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            >
              <option value="">Choose a student</option>
              {students
                .filter(student => student.status === 'active')
                .map(student => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.email})
                  </option>
                ))
              }
            </select>
            {selectedStudent && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedStudent.avatar || `https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150`}
                    alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">GPA:</span> {selectedStudent.gpa.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> {selectedStudent.status}
                      </div>
                      <div>
                        <span className="font-medium">Current Credits:</span> {totalCredits}
                      </div>
                      <div>
                        <span className="font-medium">Active Courses:</span> {studentEnrollments.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Select Course
            </label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            >
              <option value="">Choose a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.courseCode} - {course.courseName} ({course.credits} credits)
                </option>
              ))}
            </select>
            {selectedCourse && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedCourse.courseName}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Course Code:</span> {selectedCourse.courseCode}
                  </div>
                  <div>
                    <span className="font-medium">Credits:</span> {selectedCourse.credits}
                  </div>
                  <div>
                    <span className="font-medium">Instructor:</span> {selectedCourse.instructorName}
                  </div>
                  <div>
                    <span className="font-medium">Enrollment:</span> {selectedCourse.enrolledStudents}/{selectedCourse.maxStudents}
                  </div>
                </div>
                
                {/* Course capacity indicator */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Course Capacity</span>
                    <span className="text-gray-600">
                      {selectedCourse.enrolledStudents}/{selectedCourse.maxStudents}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        (selectedCourse.enrolledStudents / selectedCourse.maxStudents) >= 1 
                          ? 'bg-red-500' 
                          : (selectedCourse.enrolledStudents / selectedCourse.maxStudents) > 0.8 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((selectedCourse.enrolledStudents / selectedCourse.maxStudents) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Credit Load Summary */}
          {selectedStudent && selectedCourse && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Credit Load Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Current Credits:</span>
                  <span className="font-medium">{totalCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span>Course Credits:</span>
                  <span className="font-medium">+{selectedCourse.credits}</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-1 font-medium">
                  <span>Total Credits:</span>
                  <span>{newTotalCredits}</span>
                </div>
                {newTotalCredits > 18 && (
                  <p className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded mt-2">
                    ⚠️ Total credits exceed recommended limit (18 credits)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Enrollment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Enrollment Date
              </label>
              <input
                type="date"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="enrolled">Enrolled</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-900">Enrollment Issues</h4>
                  <ul className="mt-1 text-sm text-red-800 space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={warnings.length > 0}
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enroll Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentModal;