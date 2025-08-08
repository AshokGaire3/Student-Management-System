import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Download, FileText, Users, BarChart3, Calendar } from 'lucide-react';

const Reports: React.FC = () => {
  const { students, courses, enrollments, majors, getStudentGrades, getCourseStudents, getStudentMajor } = useData();
  const [selectedReport, setSelectedReport] = useState('student-transcripts');

  const reportTypes = [
    {
      id: 'student-transcripts',
      name: 'Student Transcripts',
      description: 'Generate detailed academic transcripts',
      icon: FileText
    },
    {
      id: 'class-rosters',
      name: 'Class Rosters',
      description: 'View enrolled students for each course',
      icon: Users
    },
    {
      id: 'major-distribution',
      name: 'Major Distribution',
      description: 'Analyze student distribution across majors',
      icon: BarChart3
    },
    {
      id: 'enrollment-summary',
      name: 'Enrollment Summary',
      description: 'Course enrollment statistics',
      icon: Calendar
    }
  ];

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const renderStudentTranscripts = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Student Transcripts</h3>
          <button
            onClick={() => {
              const transcripts = students.map(student => ({
                StudentID: student.id,
                Name: `${student.firstName} ${student.lastName}`,
                Email: student.email,
                Major: getStudentMajor(student.id)?.majorName || 'Undeclared',
                GPA: student.gpa,
                Status: student.status,
                EnrollmentDate: student.enrollmentDate
              }));
              exportToCSV(transcripts, 'student_transcripts');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
        
        <div className="grid gap-4">
          {students.map(student => {
            const studentGrades = getStudentGrades(student.id);
            const studentMajor = getStudentMajor(student.id);
            
            return (
              <div key={student.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{student.firstName} {student.lastName}</h4>
                    <p className="text-sm text-gray-600">{student.email}</p>
                    <p className="text-sm text-gray-600">Major: {studentMajor?.majorName || 'Undeclared'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">GPA: {student.gpa.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Status: {student.status}</p>
                  </div>
                </div>
                
                {studentGrades.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Course</th>
                          <th className="text-left py-2">Grade</th>
                          <th className="text-left py-2">Points</th>
                          <th className="text-left py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentGrades.map((grade) => {
                          const course = courses.find(c => c.id === grade.courseId);
                          return (
                            <tr key={grade.id} className="border-b">
                              <td className="py-2">{course?.courseCode} - {course?.courseName}</td>
                              <td className="py-2">{grade.grade}</td>
                              <td className="py-2">{grade.points}</td>
                              <td className="py-2">{grade.dateAssigned}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderClassRosters = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Class Rosters</h3>
        </div>
        
        <div className="grid gap-4">
          {courses.map(course => {
            const enrolledStudents = getCourseStudents(course.id);
            
            return (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{course.courseCode} - {course.courseName}</h4>
                    <p className="text-sm text-gray-600">Instructor: {course.instructorName}</p>
                    <p className="text-sm text-gray-600">{course.semester} {course.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {enrolledStudents.length} / {course.maxStudents} students
                    </p>
                    <button
                      onClick={() => {
                        const roster = enrolledStudents.map(s => ({
                          StudentID: s.id,
                          Name: `${s.firstName} ${s.lastName}`,
                          Email: s.email,
                          Major: getStudentMajor(s.id)?.majorName || 'Undeclared',
                          Status: s.status
                        }));
                        exportToCSV(roster, `${course.courseCode}_roster`);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Export Roster
                    </button>
                  </div>
                </div>
                
                {enrolledStudents.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Student</th>
                          <th className="text-left py-2">Email</th>
                          <th className="text-left py-2">Major</th>
                          <th className="text-left py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrolledStudents.map((student) => (
                          <tr key={student.id} className="border-b">
                            <td className="py-2">{student.firstName} {student.lastName}</td>
                            <td className="py-2">{student.email}</td>
                            <td className="py-2">{getStudentMajor(student.id)?.majorName || 'Undeclared'}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                student.status === 'active' ? 'bg-green-100 text-green-800' :
                                student.status === 'graduated' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {student.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMajorDistribution = () => {
    const distribution = majors.map(major => {
      const majorStudents = students.filter(s => s.majorId === major.id);
      return {
        major: major.majorName,
        code: major.majorCode,
        studentCount: majorStudents.length,
        percentage: students.length > 0 ? ((majorStudents.length / students.length) * 100).toFixed(1) : '0'
      };
    });

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Major Distribution</h3>
          <button
            onClick={() => {
              exportToCSV(
                distribution.map(d => ({
                  Major: d.major,
                  Code: d.code,
                  StudentCount: d.studentCount,
                  Percentage: d.percentage
                })),
                'major_distribution'
              );
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-4">Overview</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Students:</span>
                <span className="font-medium">{students.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Majors:</span>
                <span className="font-medium">{majors.length}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {distribution.map((major, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{major.major} ({major.code})</span>
                  <span className="text-sm text-gray-600">{major.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${major.percentage}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-600 mt-1">
                  {major.studentCount} students
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEnrollmentSummary = () => {
    const courseSummary = courses.map(course => {
      const enrolledStudents = getCourseStudents(course.id);
      const completedEnrollments = enrollments.filter(e => e.courseId === course.id && e.status === 'completed').length;
      const activeEnrollments = enrollments.filter(e => e.courseId === course.id && e.status === 'enrolled').length;
      
      return {
        course,
        enrollments: {
          total: enrolledStudents.length,
          active: activeEnrollments,
          completed: completedEnrollments,
          utilizationRate: ((enrolledStudents.length / course.maxStudents) * 100).toFixed(1)
        }
      };
    });

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Enrollment Summary</h3>
          <button
            onClick={() => {
              exportToCSV(
                courseSummary.map(c => ({
                  CourseCode: c.course.courseCode,
                  CourseName: c.course.courseName,
                  Instructor: c.course.instructorName,
                  MaxStudents: c.course.maxStudents,
                  TotalEnrolled: c.enrollments.total,
                  Active: c.enrollments.active,
                  Completed: c.enrollments.completed,
                  UtilizationRate: c.enrollments.utilizationRate
                })),
                'enrollment_summary'
              );
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800">Total Enrollments</h4>
            <p className="text-2xl font-bold text-blue-900">{enrollments.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800">Active</h4>
            <p className="text-2xl font-bold text-green-900">
              {enrollments.filter(e => e.status === 'enrolled').length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800">Completed</h4>
            <p className="text-2xl font-bold text-purple-900">
              {enrollments.filter(e => e.status === 'completed').length}
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4">Course</th>
                <th className="text-left py-3 px-4">Instructor</th>
                <th className="text-left py-3 px-4">Capacity</th>
                <th className="text-left py-3 px-4">Enrolled</th>
                <th className="text-left py-3 px-4">Active</th>
                <th className="text-left py-3 px-4">Completed</th>
                <th className="text-left py-3 px-4">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {courseSummary.map((course, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{course.course.courseCode}</div>
                      <div className="text-gray-600">{course.course.courseName}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{course.course.instructorName}</td>
                  <td className="py-3 px-4">{course.course.maxStudents}</td>
                  <td className="py-3 px-4">{course.enrollments.total}</td>
                  <td className="py-3 px-4">{course.enrollments.active}</td>
                  <td className="py-3 px-4">{course.enrollments.completed}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            parseFloat(course.enrollments.utilizationRate) >= 80 ? 'bg-red-500' :
                            parseFloat(course.enrollments.utilizationRate) >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${course.enrollments.utilizationRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{course.enrollments.utilizationRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'student-transcripts':
        return renderStudentTranscripts();
      case 'class-rosters':
        return renderClassRosters();
      case 'major-distribution':
        return renderMajorDistribution();
      case 'enrollment-summary':
        return renderEnrollmentSummary();
      default:
        return <div>Select a report type</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Generate comprehensive reports and analyze student data</p>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedReport === report.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <report.icon className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-medium text-sm">{report.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{report.description}</p>
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {renderReportContent()}
      </div>
    </div>
  );
};

export default Reports;