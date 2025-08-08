import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  
  // Student operations
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  
  // Course operations
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  // Grade operations
  addGrade: (grade: Omit<Grade, 'id'>) => void;
  updateGrade: (id: string, grade: Partial<Grade>) => void;
  
  // Enrollment operations
  enrollStudent: (enrollment: Omit<Enrollment, 'id'>) => void;
  addEnrollment: (enrollment: Enrollment) => void;
  getStudentEnrollments: (studentId: string) => Enrollment[];
  
  // Major operations
  addMajor: (major: Omit<Major, 'id'>) => void;
  updateMajor: (id: string, major: Partial<Major>) => void;
  deleteMajor: (id: string) => void;
  
  // Major change request operations
  submitMajorChangeRequest: (request: Omit<MajorChangeRequest, 'id'>) => void;
  reviewMajorChangeRequest: (id: string, status: 'approved' | 'denied', adminComments?: string) => void;
  
  // Utility functions
  getStudentGrades: (studentId: string) => Grade[];
  getStudentCourses: (studentId: string) => Course[];
  getCourseStudents: (courseId: string) => Student[];
  getMajorCourses: (majorId: string) => Course[];
  getStudentMajor: (studentId: string) => Major | undefined;
  calculateGPA: (studentId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock majors data
const mockMajors: Major[] = [
  {
    id: '1',
    majorName: 'Computer Science',
    majorCode: 'CS',
    description: 'Study of algorithmic processes and computational systems',
    requiredCredits: 120,
    degreeType: 'Bachelor'
  },
  {
    id: '2',
    majorName: 'Mathematics',
    majorCode: 'MATH',
    description: 'Study of numbers, quantity, structure, space, and change',
    requiredCredits: 120,
    degreeType: 'Bachelor'
  },
  {
    id: '3',
    majorName: 'English Literature',
    majorCode: 'ENG',
    description: 'Study of written works, especially those considered of superior or lasting artistic merit',
    requiredCredits: 120,
    degreeType: 'Bachelor'
  },
  {
    id: '4',
    majorName: 'Business Administration',
    majorCode: 'BUS',
    description: 'Study of business management, economics, and organizational behavior',
    requiredCredits: 120,
    degreeType: 'Bachelor'
  }
];

// Mock data
const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'Emma',
    lastName: 'Rodriguez',
    email: 'emma.rodriguez@student.edu',
    dateOfBirth: '2002-05-15',
    enrollmentDate: '2023-08-15',
    status: 'active',
    phone: '+1 (555) 123-4567',
    address: '123 College Ave, University City, UC 12345',
    gpa: 3.85,
    majorId: '1', // Computer Science
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@student.edu',
    dateOfBirth: '2001-11-22',
    enrollmentDate: '2023-08-15',
    status: 'active',
    phone: '+1 (555) 234-5678',
    address: '456 University Blvd, Campus Town, CT 67890',
    gpa: 3.92,
    majorId: '2', // Mathematics
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    firstName: 'Sophia',
    lastName: 'Chen',
    email: 'sophia.chen@student.edu',
    dateOfBirth: '2003-03-08',
    enrollmentDate: '2023-08-15',
    status: 'active',
    phone: '+1 (555) 345-6789',
    address: '789 Academic Way, Scholar Hill, SH 13579',
    gpa: 3.67,
    majorId: '3', // English Literature
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

const mockCourses: Course[] = [
  {
    id: '1',
    courseName: 'Introduction to Computer Science',
    courseCode: 'CS101',
    instructorId: '2',
    instructorName: 'Prof. Michael Chen',
    credits: 3,
    semester: 'Fall',
    year: 2024,
    enrolledStudents: 28,
    maxStudents: 30,
    majorId: '1', // Computer Science
    description: 'Fundamental concepts of computer science including programming, algorithms, and data structures.',
    prerequisites: []
  },
  {
    id: '2',
    courseName: 'Calculus I',
    courseCode: 'MATH101',
    instructorId: '3',
    instructorName: 'Dr. Lisa Park',
    credits: 4,
    semester: 'Fall',
    year: 2024,
    enrolledStudents: 25,
    maxStudents: 35,
    majorId: '2', // Mathematics
    description: 'Introduction to differential and integral calculus with applications.',
    prerequisites: []
  },
  {
    id: '3',
    courseName: 'English Composition',
    courseCode: 'ENG101',
    instructorId: '4',
    instructorName: 'Prof. David Kim',
    credits: 3,
    semester: 'Fall',
    year: 2024,
    enrolledStudents: 22,
    maxStudents: 25,
    majorId: '3', // English Literature
    description: 'Fundamentals of academic writing, critical thinking, and literary analysis.',
    prerequisites: []
  }
];

const mockGrades: Grade[] = [
  {
    id: '1',
    studentId: '1',
    courseId: '1',
    grade: 'A-',
    points: 3.7,
    dateAssigned: '2024-01-15',
    assignment: 'Final Project'
  },
  {
    id: '2',
    studentId: '1',
    courseId: '2',
    grade: 'B+',
    points: 3.3,
    dateAssigned: '2024-01-12',
    assignment: 'Midterm Exam'
  },
  {
    id: '3',
    studentId: '2',
    courseId: '1',
    grade: 'A',
    points: 4.0,
    dateAssigned: '2024-01-15',
    assignment: 'Final Project'
  }
];

const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    studentId: '1',
    courseId: '1',
    enrollmentDate: '2023-08-15',
    status: 'enrolled'
  },
  {
    id: '2',
    studentId: '1',
    courseId: '2',
    enrollmentDate: '2023-08-15',
    status: 'enrolled'
  },
  {
    id: '3',
    studentId: '2',
    courseId: '1',
    enrollmentDate: '2023-08-15',
    status: 'enrolled'
  }
];

const mockMajorChangeRequests: MajorChangeRequest[] = [
  {
    id: '1',
    studentId: '1',
    currentMajorId: '1', // Computer Science
    requestedMajorId: '4', // Business Administration
    status: 'pending',
    requestDate: '2024-01-10',
    reason: 'I have developed a strong interest in business strategy and entrepreneurship through elective courses.'
  },
  {
    id: '2',
    studentId: '2',
    currentMajorId: '2', // Mathematics
    requestedMajorId: '1', // Computer Science
    status: 'approved',
    requestDate: '2023-12-15',
    reviewDate: '2024-01-05',
    reviewedBy: 'admin',
    reason: 'I want to apply my mathematical background to software development and algorithms.',
    adminComments: 'Approved due to strong mathematical foundation and relevant coursework.'
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [majors, setMajors] = useState<Major[]>(mockMajors);
  const [majorChangeRequests, setMajorChangeRequests] = useState<MajorChangeRequest[]>(mockMajorChangeRequests);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updatedStudent } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse = { ...course, id: Date.now().toString() };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (id: string, updatedCourse: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...updatedCourse } : course
    ));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const addGrade = (grade: Omit<Grade, 'id'>) => {
    const newGrade = { ...grade, id: Date.now().toString() };
    setGrades(prev => [...prev, newGrade]);
  };

  const updateGrade = (id: string, updatedGrade: Partial<Grade>) => {
    setGrades(prev => prev.map(grade => 
      grade.id === id ? { ...grade, ...updatedGrade } : grade
    ));
  };

  const enrollStudent = (enrollment: Omit<Enrollment, 'id'>) => {
    const newEnrollment = { ...enrollment, id: Date.now().toString() };
    setEnrollments(prev => [...prev, newEnrollment]);
  };

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

  // Major operations
  const addMajor = (major: Omit<Major, 'id'>) => {
    const newMajor = { ...major, id: Date.now().toString() };
    setMajors(prev => [...prev, newMajor]);
  };

  const updateMajor = (id: string, updatedMajor: Partial<Major>) => {
    setMajors(prev => prev.map(major => 
      major.id === id ? { ...major, ...updatedMajor } : major
    ));
  };

  const deleteMajor = (id: string) => {
    setMajors(prev => prev.filter(major => major.id !== id));
  };

  // Major change request operations
  const submitMajorChangeRequest = (request: Omit<MajorChangeRequest, 'id'>) => {
    const newRequest = { ...request, id: Date.now().toString() };
    setMajorChangeRequests(prev => [...prev, newRequest]);
  };

  const reviewMajorChangeRequest = (id: string, status: 'approved' | 'denied', adminComments?: string) => {
    setMajorChangeRequests(prev => prev.map(request => 
      request.id === id ? { 
        ...request, 
        status, 
        reviewDate: new Date().toISOString().split('T')[0],
        reviewedBy: 'admin',
        adminComments 
      } : request
    ));
    
    // If approved, update student's major
    if (status === 'approved') {
      const request = majorChangeRequests.find(r => r.id === id);
      if (request) {
        updateStudent(request.studentId, { majorId: request.requestedMajorId });
      }
    }
  };

  // Utility functions
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

  // Additional enrollment functions
  const addEnrollment = (enrollment: Enrollment) => {
    setEnrollments(prev => [...prev, enrollment]);
  };

  const getStudentEnrollments = (studentId: string) => {
    return enrollments.filter(enrollment => enrollment.studentId === studentId);
  };

  const value: DataContextType = {
    students,
    courses,
    grades,
    enrollments,
    majors,
    majorChangeRequests,
    
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
    calculateGPA
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};