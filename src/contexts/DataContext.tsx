import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '../services/toast';
import * as api from '../services/api';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  phone: string;
  address: string;
  gpa: number;
  majorId: string;
  avatar?: string;
}

export interface Course {
  id: string;
  courseName: string;
  courseCode: string;
  instructorId: string;
  instructorName: string;
  credits: number;
  semester: string;
  year: number;
  enrolledStudents: number;
  maxStudents: number;
  majorId: string;
  prerequisites?: string[];
  description: string;
  schedule?: string;
}

export interface Major {
  id: string;
  majorName: string;
  majorCode: string;
  description: string;
  requiredCredits: number;
  degreeType: 'Bachelor' | 'Master' | 'PhD';
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  grade: string;
  points: number;
  dateAssigned: string;
  assignment: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  status: 'enrolled' | 'completed' | 'dropped';
}

export interface MajorChangeRequest {
  id: string;
  studentId: string;
  currentMajorId: string;
  requestedMajorId: string;
  status: 'pending' | 'approved' | 'denied';
  requestDate: string;
  reviewDate?: string;
  reviewedBy?: string;
  reason: string;
  adminComments?: string;
}

interface DataContextType {
  students: Student[];
  courses: Course[];
  grades: Grade[];
  enrollments: Enrollment[];
  majors: Major[];
  majorChangeRequests: MajorChangeRequest[];
  loading: boolean;
  
  // Student operations
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  
  // Course operations
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  
  // Grade operations
  addGrade: (grade: Omit<Grade, 'id'>) => Promise<void>;
  updateGrade: (id: string, grade: Partial<Grade>) => Promise<void>;
  
  // Enrollment operations
  enrollStudent: (enrollment: Omit<Enrollment, 'id'>) => Promise<void>;
  addEnrollment: (enrollment: Enrollment) => Promise<void>;
  getStudentEnrollments: (studentId: string) => Enrollment[];
  
  // Major operations
  addMajor: (major: Omit<Major, 'id'>) => Promise<void>;
  updateMajor: (id: string, major: Partial<Major>) => Promise<void>;
  deleteMajor: (id: string) => Promise<void>;
  
  // Major change request operations
  submitMajorChangeRequest: (request: Omit<MajorChangeRequest, 'id'>) => Promise<void>;
  reviewMajorChangeRequest: (id: string, status: 'approved' | 'denied', adminComments?: string) => Promise<void>;
  
  // Utility functions
  getStudentGrades: (studentId: string) => Grade[];
  getStudentCourses: (studentId: string) => Course[];
  getCourseStudents: (courseId: string) => Student[];
  getMajorCourses: (majorId: string) => Course[];
  getStudentMajor: (studentId: string) => Major | undefined;
  calculateGPA: (studentId: string) => number;
  
  // Refresh data
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [majorChangeRequests, setMajorChangeRequests] = useState<MajorChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [studentsData, coursesData, gradesData, enrollmentsData, majorsData, requestsData] = await Promise.all([
        api.studentsAPI.getAll().catch(() => []),
        api.coursesAPI.getAll().catch(() => []),
        api.gradesAPI.getAll().catch(() => []),
        api.enrollmentsAPI.getAll().catch(() => []),
        api.majorsAPI.getAll().catch(() => []),
        api.majorChangeRequestsAPI.getAll().catch(() => [])
      ]);

      setStudents(studentsData);
      setCourses(coursesData);
      setGrades(gradesData);
      setEnrollments(enrollmentsData);
      setMajors(majorsData);
      setMajorChangeRequests(requestsData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const refreshData = async () => {
    await loadData();
  };

  // Student operations
  const addStudent = async (student: Omit<Student, 'id'>) => {
    try {
      const newStudent = await api.studentsAPI.create(student);
      setStudents(prev => [...prev, newStudent]);
      showToast('Student added successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to add student', 'error');
      throw error;
    }
  };

  const updateStudent = async (id: string, updatedStudent: Partial<Student>) => {
    try {
      const updated = await api.studentsAPI.update(id, updatedStudent);
      setStudents(prev => prev.map(s => s.id === id ? updated : s));
      showToast('Student updated successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to update student', 'error');
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await api.studentsAPI.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      showToast('Student deleted successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to delete student', 'error');
      throw error;
    }
  };

  // Course operations
  const addCourse = async (course: Omit<Course, 'id'>) => {
    try {
      const newCourse = await api.coursesAPI.create(course);
      setCourses(prev => [...prev, newCourse]);
      showToast('Course added successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to add course', 'error');
      throw error;
    }
  };

  const updateCourse = async (id: string, updatedCourse: Partial<Course>) => {
    try {
      const updated = await api.coursesAPI.update(id, updatedCourse);
      setCourses(prev => prev.map(c => c.id === id ? updated : c));
      showToast('Course updated successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to update course', 'error');
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await api.coursesAPI.delete(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      showToast('Course deleted successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to delete course', 'error');
      throw error;
    }
  };

  // Grade operations
  const addGrade = async (grade: Omit<Grade, 'id'>) => {
    try {
      const newGrade = await api.gradesAPI.create(grade);
      setGrades(prev => [...prev, newGrade]);
      showToast('Grade added successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to add grade', 'error');
      throw error;
    }
  };

  const updateGrade = async (id: string, updatedGrade: Partial<Grade>) => {
    try {
      const updated = await api.gradesAPI.update(id, updatedGrade);
      setGrades(prev => prev.map(g => g.id === id ? updated : g));
      showToast('Grade updated successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to update grade', 'error');
      throw error;
    }
  };

  // Enrollment operations
  const enrollStudent = async (enrollment: Omit<Enrollment, 'id'>) => {
    try {
      const newEnrollment = await api.enrollmentsAPI.create(enrollment);
      setEnrollments(prev => [...prev, newEnrollment]);
      
      // Refresh courses to update enrollment count
      const updatedCourse = await api.coursesAPI.getById(enrollment.courseId);
      setCourses(prev => prev.map(c => c.id === enrollment.courseId ? updatedCourse : c));
      
      showToast('Enrollment successful', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to enroll student', 'error');
      throw error;
    }
  };

  const addEnrollment = async (enrollment: Enrollment) => {
    setEnrollments(prev => [...prev, enrollment]);
  };

  const getStudentEnrollments = (studentId: string) => {
    return enrollments.filter(enrollment => enrollment.studentId === studentId);
  };

  // Major operations
  const addMajor = async (major: Omit<Major, 'id'>) => {
    try {
      const newMajor = await api.majorsAPI.create(major);
      setMajors(prev => [...prev, newMajor]);
      showToast('Major added successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to add major', 'error');
      throw error;
    }
  };

  const updateMajor = async (id: string, updatedMajor: Partial<Major>) => {
    try {
      const updated = await api.majorsAPI.update(id, updatedMajor);
      setMajors(prev => prev.map(m => m.id === id ? updated : m));
      showToast('Major updated successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to update major', 'error');
      throw error;
    }
  };

  const deleteMajor = async (id: string) => {
    try {
      await api.majorsAPI.delete(id);
      setMajors(prev => prev.filter(m => m.id !== id));
      showToast('Major deleted successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to delete major', 'error');
      throw error;
    }
  };

  // Major change request operations
  const submitMajorChangeRequest = async (request: Omit<MajorChangeRequest, 'id'>) => {
    try {
      const newRequest = await api.majorChangeRequestsAPI.create(request);
      setMajorChangeRequests(prev => [...prev, newRequest]);
      showToast('Major change request submitted successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to submit request', 'error');
      throw error;
    }
  };

  const reviewMajorChangeRequest = async (id: string, status: 'approved' | 'denied', adminComments?: string) => {
    try {
      const updated = await api.majorChangeRequestsAPI.review(id, status, adminComments);
      setMajorChangeRequests(prev => prev.map(r => r.id === id ? updated : r));
      
      // If approved, refresh students to get updated major
      if (status === 'approved') {
        await loadData();
      }
      
      showToast(`Request ${status} successfully`, 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to review request', 'error');
      throw error;
    }
  };

  // Utility functions
  const getStudentGrades = (studentId: string) => {
    return grades.filter(grade => grade.studentId === studentId);
  };

  const getStudentCourses = (studentId: string) => {
    const studentEnrollments = enrollments.filter(e => e.studentId === studentId);
    return courses.filter(course => 
      studentEnrollments.some(e => e.courseId === course.id)
    );
  };

  const getCourseStudents = (courseId: string) => {
    const courseEnrollments = enrollments.filter(e => e.courseId === courseId);
    return students.filter(student => 
      courseEnrollments.some(e => e.studentId === student.id)
    );
  };

  const getMajorCourses = (majorId: string) => {
    return courses.filter(course => course.majorId === majorId);
  };

  const getStudentMajor = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? majors.find(m => m.id === student.majorId) : undefined;
  };

  const calculateGPA = (studentId: string) => {
    const studentGrades = getStudentGrades(studentId);
    if (studentGrades.length === 0) return 0;
    
    const totalPoints = studentGrades.reduce((sum, grade) => sum + grade.points, 0);
    return Math.round((totalPoints / studentGrades.length) * 100) / 100;
  };

  const value: DataContextType = {
    students,
    courses,
    grades,
    enrollments,
    majors,
    majorChangeRequests,
    loading,
    
    // Student operations
    addStudent,
    updateStudent,
    deleteStudent,
    
    // Course operations
    addCourse,
    updateCourse,
    deleteCourse,
    
    // Grade operations
    addGrade,
    updateGrade,
    
    // Enrollment operations
    enrollStudent,
    addEnrollment,
    getStudentEnrollments,
    
    // Major operations
    addMajor,
    updateMajor,
    deleteMajor,
    
    // Major change request operations
    submitMajorChangeRequest,
    reviewMajorChangeRequest,
    
    // Utility functions
    getStudentGrades,
    getStudentCourses,
    getCourseStudents,
    getMajorCourses,
    getStudentMajor,
    calculateGPA,
    
    // Refresh data
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
