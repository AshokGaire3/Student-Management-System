import React, { useState, useEffect } from 'react';
import { useData, Course } from '../../contexts/DataContext';
import { X, BookOpen, User, Calendar, Users } from 'lucide-react';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  mode: 'view' | 'edit' | 'create';
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, course, mode }) => {
  const { addCourse, updateCourse } = useData();
  
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    instructorId: '',
    instructorName: '',
    credits: 3,
    semester: 'Fall',
    year: new Date().getFullYear(),
    enrolledStudents: 0,
    maxStudents: 30
  });

  useEffect(() => {
    if (course && (mode === 'view' || mode === 'edit')) {
      setFormData({
        courseName: course.courseName,
        courseCode: course.courseCode,
        instructorId: course.instructorId,
        instructorName: course.instructorName,
        credits: course.credits,
        semester: course.semester,
        year: course.year,
        enrolledStudents: course.enrolledStudents,
        maxStudents: course.maxStudents
      });
    } else if (mode === 'create') {
      setFormData({
        courseName: '',
        courseCode: '',
        instructorId: '',
        instructorName: '',
        credits: 3,
        semester: 'Fall',
        year: new Date().getFullYear(),
        enrolledStudents: 0,
        maxStudents: 30
      });
    }
  }, [course, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      addCourse(formData);
    } else if (mode === 'edit' && course) {
      updateCourse(course.id, formData);
    }
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['credits', 'year', 'enrolledStudents', 'maxStudents'].includes(name) 
        ? parseInt(value) || 0 
        : value
    }));
  };

  if (!isOpen) return null;

  const isReadOnly = mode === 'view';
  const title = mode === 'create' ? 'Add New Course' : mode === 'edit' ? 'Edit Course' : 'Course Details';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Course Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  readOnly={isReadOnly}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Code
                </label>
                <input
                  type="text"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  readOnly={isReadOnly}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                  placeholder="e.g., CS101"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credits
                </label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  readOnly={isReadOnly}
                  min="1"
                  max="6"
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                  required
                />
              </div>
            </div>

            {/* Instructor & Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Instructor & Schedule
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor Name
                </label>
                <input
                  type="text"
                  name="instructorName"
                  value={formData.instructorName}
                  onChange={handleInputChange}
                  readOnly={isReadOnly}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    disabled={isReadOnly}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                    }`}
                    required
                  >
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Fall">Fall</option>
                    <option value="Winter">Winter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    min="2020"
                    max="2030"
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                    }`}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Information */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Enrollment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Enrolled Students
                </label>
                <input
                  type="number"
                  name="enrolledStudents"
                  value={formData.enrolledStudents}
                  onChange={handleInputChange}
                  readOnly={isReadOnly}
                  min="0"
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Students
                </label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleInputChange}
                  readOnly={isReadOnly}
                  min="1"
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    isReadOnly ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                  required
                />
              </div>
            </div>

            {/* Enrollment Progress */}
            {mode === 'view' && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Enrollment Progress</span>
                  <span className="text-sm text-gray-600">
                    {formData.enrolledStudents}/{formData.maxStudents} ({Math.round((formData.enrolledStudents / formData.maxStudents) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min((formData.enrolledStudents / formData.maxStudents) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!isReadOnly && (
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                {mode === 'create' ? 'Create Course' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CourseModal;