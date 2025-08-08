import React, { useState, useEffect } from 'react';
import { useData, Grade } from '../../contexts/DataContext';
import { X, Award, User, BookOpen } from 'lucide-react';

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: Grade | null;
  mode: 'edit' | 'create';
}

const GradeModal: React.FC<GradeModalProps> = ({ isOpen, onClose, grade, mode }) => {
  const { students, courses, addGrade, updateGrade } = useData();
  
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    grade: '',
    points: 0,
    assignment: '',
    dateAssigned: new Date().toISOString().split('T')[0]
  });

  const gradeOptions = [
    { letter: 'A+', points: 4.0 },
    { letter: 'A', points: 4.0 },
    { letter: 'A-', points: 3.7 },
    { letter: 'B+', points: 3.3 },
    { letter: 'B', points: 3.0 },
    { letter: 'B-', points: 2.7 },
    { letter: 'C+', points: 2.3 },
    { letter: 'C', points: 2.0 },
    { letter: 'C-', points: 1.7 },
    { letter: 'D+', points: 1.3 },
    { letter: 'D', points: 1.0 },
    { letter: 'F', points: 0.0 }
  ];

  useEffect(() => {
    if (grade && mode === 'edit') {
      setFormData({
        studentId: grade.studentId,
        courseId: grade.courseId,
        grade: grade.grade,
        points: grade.points,
        assignment: grade.assignment,
        dateAssigned: grade.dateAssigned
      });
    } else if (mode === 'create') {
      setFormData({
        studentId: '',
        courseId: '',
        grade: '',
        points: 0,
        assignment: '',
        dateAssigned: new Date().toISOString().split('T')[0]
      });
    }
  }, [grade, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      addGrade(formData);
    } else if (mode === 'edit' && grade) {
      updateGrade(grade.id, formData);
    }
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? parseFloat(value) || 0 : value
    }));
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGrade = gradeOptions.find(g => g.letter === e.target.value);
    if (selectedGrade) {
      setFormData(prev => ({
        ...prev,
        grade: selectedGrade.letter,
        points: selectedGrade.points
      }));
    }
  };

  if (!isOpen) return null;

  const title = mode === 'create' ? 'Add New Grade' : 'Edit Grade';
  const selectedStudent = students.find(s => s.id === formData.studentId);
  const selectedCourse = courses.find(c => c.id === formData.courseId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Student
            </label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            >
              <option value="">Select a student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} ({student.email})
                </option>
              ))}
            </select>
            {selectedStudent && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedStudent.avatar || `https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150`}
                    alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </p>
                    <p className="text-xs text-gray-500">Current GPA: {selectedStudent.gpa.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Course
            </label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.courseCode} - {course.courseName}
                </option>
              ))}
            </select>
            {selectedCourse && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{selectedCourse.courseName}</p>
                <p className="text-xs text-gray-500">
                  Instructor: {selectedCourse.instructorName} | Credits: {selectedCourse.credits}
                </p>
              </div>
            )}
          </div>

          {/* Assignment Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment/Assessment
            </label>
            <input
              type="text"
              name="assignment"
              value={formData.assignment}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g., Final Exam, Project 1, Quiz 3"
              required
            />
          </div>

          {/* Grade Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="w-4 h-4 inline mr-2" />
                Letter Grade
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleGradeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Select grade</option>
                {gradeOptions.map(option => (
                  <option key={option.letter} value={option.letter}>
                    {option.letter} ({option.points})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade Points
              </label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleInputChange}
                min="0"
                max="4"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Assigned
            </label>
            <input
              type="date"
              name="dateAssigned"
              value={formData.dateAssigned}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          {/* Grade Preview */}
          {formData.grade && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Grade Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p><span className="font-medium">Student:</span> {selectedStudent?.firstName} {selectedStudent?.lastName}</p>
                <p><span className="font-medium">Course:</span> {selectedCourse?.courseCode}</p>
                <p><span className="font-medium">Assignment:</span> {formData.assignment}</p>
                <p><span className="font-medium">Grade:</span> {formData.grade} ({formData.points} points)</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
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
              {mode === 'create' ? 'Add Grade' : 'Update Grade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeModal;