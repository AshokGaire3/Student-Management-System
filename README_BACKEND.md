# Backend API Documentation

## Overview

The Student Management System backend is built with Node.js, Express.js, and uses a JSON-based file storage system. The API provides RESTful endpoints for managing students, courses, grades, enrollments, majors, and major change requests.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `server` directory (or use the provided `.env.example`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
```

3. Start the development server:
```bash
npm run dev:server
```

Or start both frontend and backend concurrently:
```bash
npm run dev:all
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "admin@university.edu",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "admin-1",
    "email": "admin@university.edu",
    "role": "admin",
    "name": "Dr. Sarah Johnson"
  }
}
```

#### POST `/api/auth/register`
Register a new student account.

**Request Body:**
```json
{
  "email": "newstudent@student.edu",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2000-01-01",
  "phone": "+1 (555) 123-4567",
  "address": "123 Main St",
  "majorId": "1"
}
```

#### GET `/api/auth/me`
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

### Students

#### GET `/api/students`
Get all students (admin, instructor only).

#### GET `/api/students/:id`
Get student by ID.

#### POST `/api/students`
Create a new student (admin only).

#### PUT `/api/students/:id`
Update student information.

#### DELETE `/api/students/:id`
Delete a student (admin only).

### Courses

#### GET `/api/courses`
Get all courses.

#### GET `/api/courses/:id`
Get course by ID.

#### GET `/api/courses/major/:majorId`
Get courses by major ID.

#### POST `/api/courses`
Create a new course (admin, instructor only).

#### PUT `/api/courses/:id`
Update course information (admin, instructor only).

#### DELETE `/api/courses/:id`
Delete a course (admin only).

### Grades

#### GET `/api/grades`
Get all grades (filtered by role).

#### GET `/api/grades/:id`
Get grade by ID.

#### GET `/api/grades/student/:studentId`
Get grades by student ID.

#### POST `/api/grades`
Create a new grade (admin, instructor only).

#### PUT `/api/grades/:id`
Update grade (admin, instructor only).

#### DELETE `/api/grades/:id`
Delete a grade (admin only).

### Enrollments

#### GET `/api/enrollments`
Get all enrollments (filtered by role).

#### GET `/api/enrollments/:id`
Get enrollment by ID.

#### GET `/api/enrollments/student/:studentId`
Get enrollments by student ID.

#### POST `/api/enrollments`
Create a new enrollment.

**Request Body:**
```json
{
  "courseId": "1",
  "studentId": "1"
}
```

#### PUT `/api/enrollments/:id`
Update enrollment.

#### DELETE `/api/enrollments/:id`
Delete an enrollment.

### Majors

#### GET `/api/majors`
Get all majors.

#### GET `/api/majors/:id`
Get major by ID.

#### POST `/api/majors`
Create a new major (admin only).

#### PUT `/api/majors/:id`
Update major (admin only).

#### DELETE `/api/majors/:id`
Delete a major (admin only).

### Major Change Requests

#### GET `/api/major-change-requests`
Get all major change requests (filtered by role).

#### GET `/api/major-change-requests/:id`
Get major change request by ID.

#### POST `/api/major-change-requests`
Create a new major change request.

**Request Body:**
```json
{
  "currentMajorId": "1",
  "requestedMajorId": "2",
  "reason": "I want to change my major because..."
}
```

#### PUT `/api/major-change-requests/:id/review`
Review a major change request (admin only).

**Request Body:**
```json
{
  "status": "approved",
  "adminComments": "Approved due to..."
}
```

#### DELETE `/api/major-change-requests/:id`
Delete a major change request.

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are issued upon login and expire after 7 days.

## Role-Based Access Control

- **Admin**: Full access to all endpoints
- **Instructor**: Can manage courses, grades, and view students
- **Student**: Can view their own data, enroll in courses, and submit major change requests

## Error Handling

All errors are returned in the following format:

```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Database

The backend currently uses a JSON file-based database located at `server/database/data/database.json`. This is suitable for development and can be easily replaced with a proper database (MongoDB, PostgreSQL, etc.) in production.

## Demo Accounts

- **Admin**: `admin@university.edu` / `admin123`
- **Instructor**: `jane.instructor@university.edu` / `instructor123`
- **Student**: `emma.rodriguez@student.edu` / `student123`

## Development

### Project Structure

```
server/
├── database/
│   ├── data/          # JSON database files (gitignored)
│   └── database.js    # Database operations
├── middleware/
│   └── auth.js        # Authentication middleware
├── routes/
│   ├── auth.js
│   ├── students.js
│   ├── courses.js
│   ├── grades.js
│   ├── enrollments.js
│   ├── majors.js
│   └── majorChangeRequests.js
└── index.js           # Server entry point
```

### Adding New Endpoints

1. Create or update the appropriate route file in `server/routes/`
2. Import and use the route in `server/index.js`
3. Add authentication/authorization middleware as needed
4. Update the frontend API service in `src/services/api.ts`

## Production Considerations

1. **Security**:
   - Use proper password hashing (bcrypt) instead of plain text comparison
   - Change JWT_SECRET to a strong random string
   - Implement rate limiting
   - Add input validation and sanitization
   - Use HTTPS

2. **Database**:
   - Replace JSON file storage with a proper database
   - Add database migrations
   - Implement connection pooling

3. **Performance**:
   - Add caching (Redis)
   - Implement pagination for list endpoints
   - Add database indexing

4. **Monitoring**:
   - Add logging (Winston, Morgan)
   - Implement error tracking (Sentry)
   - Add health check endpoints

