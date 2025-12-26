import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';
import gradeRoutes from './routes/grades.js';
import enrollmentRoutes from './routes/enrollments.js';
import majorRoutes from './routes/majors.js';
import majorChangeRequestRoutes from './routes/majorChangeRequests.js';
import { authenticateToken } from './middleware/auth.js';
import db from './database/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database before starting server
try {
  await db.init();
} catch (err) {
  console.error('Failed to initialize database:', err);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/students', authenticateToken, studentRoutes);
app.use('/api/courses', authenticateToken, courseRoutes);
app.use('/api/grades', authenticateToken, gradeRoutes);
app.use('/api/enrollments', authenticateToken, enrollmentRoutes);
app.use('/api/majors', authenticateToken, majorRoutes);
app.use('/api/major-change-requests', authenticateToken, majorChangeRequestRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;

