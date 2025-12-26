import User from './models/User.js';
import Student from './models/Student.js';
import Major from './models/Major.js';
import Course from './models/Course.js';
import Grade from './models/Grade.js';
import Enrollment from './models/Enrollment.js';
import MajorChangeRequest from './models/MajorChangeRequest.js';
import bcrypt from 'bcryptjs';
import { connectDB } from './connection.js';

class Database {
  async init() {
    try {
      await connectDB();
      console.log('Database initialized');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  // User methods
  async findUserByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async findUserById(id) {
    return await User.findById(id);
  }

  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  // Student methods
  async getAllStudents() {
    return await Student.find().populate('majorId');
  }

  async getStudentById(id) {
    return await Student.findById(id).populate('majorId');
  }

  async createStudent(studentData) {
    const student = new Student(studentData);
    return await student.save();
  }

  async updateStudent(id, updates) {
    return await Student.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('majorId');
  }

  async deleteStudent(id) {
    return await Student.findByIdAndDelete(id);
  }

  // Course methods
  async getAllCourses() {
    return await Course.find().populate('instructorId majorId');
  }

  async getCourseById(id) {
    return await Course.findById(id).populate('instructorId majorId');
  }

  async getCoursesByMajor(majorId) {
    return await Course.find({ majorId }).populate('instructorId majorId');
  }

  async createCourse(courseData) {
    const course = new Course(courseData);
    return await course.save();
  }

  async updateCourse(id, updates) {
    return await Course.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('instructorId majorId');
  }

  async deleteCourse(id) {
    return await Course.findByIdAndDelete(id);
  }

  // Grade methods
  async getAllGrades() {
    return await Grade.find().populate('studentId courseId');
  }

  async getGradeById(id) {
    return await Grade.findById(id).populate('studentId courseId');
  }

  async getGradesByStudent(studentId) {
    return await Grade.find({ studentId }).populate('courseId');
  }

  async createGrade(gradeData) {
    const grade = new Grade(gradeData);
    return await grade.save();
  }

  async updateGrade(id, updates) {
    return await Grade.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('studentId courseId');
  }

  async deleteGrade(id) {
    return await Grade.findByIdAndDelete(id);
  }

  // Enrollment methods
  async getAllEnrollments() {
    return await Enrollment.find().populate('studentId courseId');
  }

  async getEnrollmentById(id) {
    return await Enrollment.findById(id).populate('studentId courseId');
  }

  async getEnrollmentsByStudent(studentId) {
    return await Enrollment.find({ studentId }).populate('courseId');
  }

  async createEnrollment(enrollmentData) {
    const enrollment = new Enrollment(enrollmentData);
    return await enrollment.save();
  }

  async updateEnrollment(id, updates) {
    return await Enrollment.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('studentId courseId');
  }

  async deleteEnrollment(id) {
    return await Enrollment.findByIdAndDelete(id);
  }

  async findEnrollment(studentId, courseId) {
    return await Enrollment.findOne({ studentId, courseId });
  }

  async countEnrollmentsByCourse(courseId) {
    return await Enrollment.countDocuments({ courseId, status: 'enrolled' });
  }

  // Major methods
  async getAllMajors() {
    return await Major.find();
  }

  async getMajorById(id) {
    return await Major.findById(id);
  }

  async createMajor(majorData) {
    const major = new Major(majorData);
    return await major.save();
  }

  async updateMajor(id, updates) {
    return await Major.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  }

  async deleteMajor(id) {
    return await Major.findByIdAndDelete(id);
  }

  // Major Change Request methods
  async getAllMajorChangeRequests() {
    return await MajorChangeRequest.find()
      .populate('studentId currentMajorId requestedMajorId reviewedBy');
  }

  async getMajorChangeRequestById(id) {
    return await MajorChangeRequest.findById(id)
      .populate('studentId currentMajorId requestedMajorId reviewedBy');
  }

  async createMajorChangeRequest(requestData) {
    const request = new MajorChangeRequest(requestData);
    return await request.save();
  }

  async updateMajorChangeRequest(id, updates) {
    return await MajorChangeRequest.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
      .populate('studentId currentMajorId requestedMajorId reviewedBy');
  }

  async deleteMajorChangeRequest(id) {
    return await MajorChangeRequest.findByIdAndDelete(id);
  }

  // User CRUD (for admin)
  async getAllUsers() {
    return await User.find().select('-password');
  }

  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async updateUser(id, updates) {
    return await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  // Helper method to find student by user email
  async findStudentByEmail(email) {
    return await Student.findOne({ email: email.toLowerCase() });
  }

  // Helper method to find student by user ID
  async findStudentByUserId(userId) {
    const user = await this.findUserById(userId);
    if (!user) return null;
    return await this.findStudentByEmail(user.email);
  }
}

const db = new Database();

export default db;
