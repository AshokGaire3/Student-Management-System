import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../database/database.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await db.verifyPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;
    res.json({
      token,
      user: userObj
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register (for students)
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth, phone, address, majorId } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.createUser({
      email,
      password: hashedPassword,
      role: 'student',
      name: `${firstName} ${lastName}`
    });

    // Create student record
    const newStudent = await db.createStudent({
      firstName,
      lastName,
      email,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
      enrollmentDate: new Date(),
      status: 'active',
      phone: phone || '',
      address: address || '',
      gpa: 0,
      majorId: majorId
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id.toString(), email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    const userObj = newUser.toObject();
    delete userObj.password;
    const studentObj = newStudent.toObject();
    res.status(201).json({
      token,
      user: userObj,
      student: studentObj
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    const user = await db.findUserById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userObj = user.toObject();
    delete userObj.password;
    res.json({ user: userObj });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;

