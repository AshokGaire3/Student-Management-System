import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from './connection.js';
import User from './models/User.js';
import Student from './models/Student.js';
import Major from './models/Major.js';
import Course from './models/Course.js';
import Grade from './models/Grade.js';
import Enrollment from './models/Enrollment.js';
import MajorChangeRequest from './models/MajorChangeRequest.js';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Major.deleteMany({});
    await Course.deleteMany({});
    await Grade.deleteMany({});
    await Enrollment.deleteMany({});
    await MajorChangeRequest.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create Majors
    const majors = await Major.insertMany([
      {
        majorName: 'Computer Science',
        majorCode: 'CS',
        description: 'Study of algorithmic processes and computational systems',
        requiredCredits: 120,
        degreeType: 'Bachelor'
      },
      {
        majorName: 'Mathematics',
        majorCode: 'MATH',
        description: 'Study of numbers, quantity, structure, space, and change',
        requiredCredits: 120,
        degreeType: 'Bachelor'
      },
      {
        majorName: 'English Literature',
        majorCode: 'ENG',
        description: 'Study of written works, especially those considered of superior or lasting artistic merit',
        requiredCredits: 120,
        degreeType: 'Bachelor'
      },
      {
        majorName: 'Business Administration',
        majorCode: 'BUS',
        description: 'Study of business management, economics, and organizational behavior',
        requiredCredits: 120,
        degreeType: 'Bachelor'
      }
    ]);

    console.log('✅ Created majors');

    // Create Users
    const adminPassword = await hashPassword('admin123');
    const instructorPassword = await hashPassword('instructor123');
    const studentPassword = await hashPassword('student123');

    const users = await User.insertMany([
      {
        email: 'admin@university.edu',
        password: adminPassword,
        role: 'admin',
        name: 'Dr. Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        email: 'jane.instructor@university.edu',
        password: instructorPassword,
        role: 'instructor',
        name: 'Prof. Michael Chen',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    ]);

    console.log('✅ Created users');

    // Create Students
    const students = await Student.insertMany([
      {
        firstName: 'Emma',
        lastName: 'Rodriguez',
        email: 'emma.rodriguez@student.edu',
        dateOfBirth: new Date('2002-05-15'),
        enrollmentDate: new Date('2023-08-15'),
        status: 'active',
        phone: '+1 (555) 123-4567',
        address: '123 College Ave, University City, UC 12345',
        gpa: 3.85,
        majorId: majors[0]._id, // Computer Science
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        firstName: 'James',
        lastName: 'Wilson',
        email: 'james.wilson@student.edu',
        dateOfBirth: new Date('2001-11-22'),
        enrollmentDate: new Date('2023-08-15'),
        status: 'active',
        phone: '+1 (555) 234-5678',
        address: '456 University Blvd, Campus Town, CT 67890',
        gpa: 3.92,
        majorId: majors[1]._id, // Mathematics
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        firstName: 'Sophia',
        lastName: 'Chen',
        email: 'sophia.chen@student.edu',
        dateOfBirth: new Date('2003-03-08'),
        enrollmentDate: new Date('2023-08-15'),
        status: 'active',
        phone: '+1 (555) 345-6789',
        address: '789 Academic Way, Scholar Hill, SH 13579',
        gpa: 3.67,
        majorId: majors[2]._id, // English Literature
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    ]);

    // Create student users
    const studentUsers = await User.insertMany([
      {
        email: 'emma.rodriguez@student.edu',
        password: studentPassword,
        role: 'student',
        name: 'Emma Rodriguez',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        email: 'james.wilson@student.edu',
        password: studentPassword,
        role: 'student',
        name: 'James Wilson',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      {
        email: 'sophia.chen@student.edu',
        password: studentPassword,
        role: 'student',
        name: 'Sophia Chen',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    ]);

    console.log('✅ Created students');

    // Create Courses
    const courses = await Course.insertMany([
      {
        courseName: 'Introduction to Computer Science',
        courseCode: 'CS101',
        instructorId: users[1]._id, // Prof. Michael Chen
        instructorName: 'Prof. Michael Chen',
        credits: 3,
        semester: 'Fall',
        year: 2024,
        enrolledStudents: 28,
        maxStudents: 30,
        majorId: majors[0]._id, // Computer Science
        description: 'Fundamental concepts of computer science including programming, algorithms, and data structures.',
        prerequisites: [],
        schedule: 'Mon, Wed, Fri 10:00 AM - 11:00 AM'
      },
      {
        courseName: 'Calculus I',
        courseCode: 'MATH101',
        instructorId: users[1]._id,
        instructorName: 'Prof. Michael Chen',
        credits: 4,
        semester: 'Fall',
        year: 2024,
        enrolledStudents: 25,
        maxStudents: 35,
        majorId: majors[1]._id, // Mathematics
        description: 'Introduction to differential and integral calculus with applications.',
        prerequisites: [],
        schedule: 'Tue, Thu 2:00 PM - 4:00 PM'
      },
      {
        courseName: 'English Composition',
        courseCode: 'ENG101',
        instructorId: users[1]._id,
        instructorName: 'Prof. Michael Chen',
        credits: 3,
        semester: 'Fall',
        year: 2024,
        enrolledStudents: 22,
        maxStudents: 25,
        majorId: majors[2]._id, // English Literature
        description: 'Fundamentals of academic writing, critical thinking, and literary analysis.',
        prerequisites: [],
        schedule: 'Mon, Wed 1:00 PM - 2:30 PM'
      }
    ]);

    console.log('✅ Created courses');

    // Create Enrollments
    await Enrollment.insertMany([
      {
        studentId: students[0]._id, // Emma
        courseId: courses[0]._id, // CS101
        enrollmentDate: new Date('2023-08-15'),
        status: 'enrolled'
      },
      {
        studentId: students[0]._id, // Emma
        courseId: courses[1]._id, // MATH101
        enrollmentDate: new Date('2023-08-15'),
        status: 'enrolled'
      },
      {
        studentId: students[1]._id, // James
        courseId: courses[0]._id, // CS101
        enrollmentDate: new Date('2023-08-15'),
        status: 'enrolled'
      }
    ]);

    console.log('✅ Created enrollments');

    // Create Grades
    await Grade.insertMany([
      {
        studentId: students[0]._id, // Emma
        courseId: courses[0]._id, // CS101
        grade: 'A-',
        points: 3.7,
        dateAssigned: new Date('2024-01-15'),
        assignment: 'Final Project'
      },
      {
        studentId: students[0]._id, // Emma
        courseId: courses[1]._id, // MATH101
        grade: 'B+',
        points: 3.3,
        dateAssigned: new Date('2024-01-12'),
        assignment: 'Midterm Exam'
      },
      {
        studentId: students[1]._id, // James
        courseId: courses[0]._id, // CS101
        grade: 'A',
        points: 4.0,
        dateAssigned: new Date('2024-01-15'),
        assignment: 'Final Project'
      }
    ]);

    console.log('✅ Created grades');

    // Create Major Change Requests
    await MajorChangeRequest.insertMany([
      {
        studentId: students[0]._id, // Emma
        currentMajorId: majors[0]._id, // Computer Science
        requestedMajorId: majors[3]._id, // Business Administration
        status: 'pending',
        requestDate: new Date('2024-01-10'),
        reason: 'I have developed a strong interest in business strategy and entrepreneurship through elective courses.'
      },
      {
        studentId: students[1]._id, // James
        currentMajorId: majors[1]._id, // Mathematics
        requestedMajorId: majors[0]._id, // Computer Science
        status: 'approved',
        requestDate: new Date('2023-12-15'),
        reviewDate: new Date('2024-01-05'),
        reviewedBy: users[0]._id, // Admin
        reason: 'I want to apply my mathematical background to software development and algorithms.',
        adminComments: 'Approved due to strong mathematical foundation and relevant coursework.'
      }
    ]);

    console.log('✅ Created major change requests');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${majors.length} majors`);
    console.log(`   - ${users.length + studentUsers.length} users`);
    console.log(`   - ${students.length} students`);
    console.log(`   - ${courses.length} courses`);
    console.log(`   - ${(await Enrollment.countDocuments())} enrollments`);
    console.log(`   - ${(await Grade.countDocuments())} grades`);
    console.log(`   - ${(await MajorChangeRequest.countDocuments())} major change requests`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
};

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;


