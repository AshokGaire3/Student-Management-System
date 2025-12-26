# Student Management System - Setup Guide

## Overview

This is a full-stack Student Management System with:
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express.js + JWT Authentication
- **Database**: JSON-based file storage (can be easily replaced with a real database)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory (optional, defaults are provided):

```env
VITE_API_URL=http://localhost:5000/api
```

For the backend, create `server/.env`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Start Development Servers

**Option 1: Start both frontend and backend together (Recommended)**

```bash
npm run dev:all
```

**Option 2: Start them separately**

Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@university.edu` | `admin123` |
| Instructor | `jane.instructor@university.edu` | `instructor123` |
| Student | `emma.rodriguez@student.edu` | `student123` |

## Project Structure

```
Student-Management-System/
├── server/                 # Backend API
│   ├── database/          # Database layer
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── src/                   # Frontend source
│   ├── components/        # React components
│   ├── contexts/          # React contexts (Auth, Data)
│   ├── services/          # API service layer
│   └── App.tsx            # Main app component
└── package.json           # Dependencies and scripts
```

## Available Scripts

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev:server` - Start backend server
- `npm run dev:all` - Start both frontend and backend

### Deployment
- `npm run deploy` - Deploy to GitHub Pages
- `npm run deploy:vercel` - Deploy to Vercel
- `npm run deploy:netlify` - Deploy to Netlify

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Instructor, Student)
- Protected API routes
- Secure token storage

### Student Management
- Create, read, update, delete students
- Student profile management
- GPA tracking
- Major assignment

### Course Management
- Full CRUD operations for courses
- Instructor assignment
- Enrollment capacity management
- Prerequisites support

### Grade Management
- Grade entry and editing
- Student grade tracking
- GPA calculation
- Grade history

### Enrollment System
- Course enrollment
- Enrollment status tracking
- Capacity management
- Enrollment history

### Major Change Requests
- Submit major change requests
- Admin review and approval
- Request status tracking
- Comments and feedback

## API Documentation

See [README_BACKEND.md](./README_BACKEND.md) for detailed API documentation.

## Development Notes

### Backend

- The database is stored in `server/database/data/database.json`
- This file is gitignored - it will be created on first run
- To reset the database, delete the `server/database/data/` directory

### Frontend

- API calls are made through the service layer in `src/services/api.ts`
- The frontend uses React Context for state management
- Toast notifications are provided through `src/services/toast.tsx`

### Authentication Flow

1. User logs in via `/api/auth/login`
2. Server returns JWT token and user data
3. Token is stored in localStorage
4. Token is included in Authorization header for protected routes
5. Backend middleware validates token on each request

## Troubleshooting

### Backend not starting
- Check if port 5000 is already in use
- Verify Node.js version (should be v16+)
- Check that all dependencies are installed

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env` (if set)
- Verify CORS is enabled in backend (should be by default)

### Database errors
- Check file permissions in `server/database/data/`
- Ensure the directory exists
- Check Node.js has write permissions

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Change `JWT_SECRET` to a strong random string
3. Consider using a proper database (MongoDB, PostgreSQL, etc.)
4. Implement proper password hashing (bcrypt)
5. Add rate limiting and security headers

### Frontend
1. Set `VITE_API_URL` to your production API URL
2. Build: `npm run build`
3. Deploy the `dist` folder to your hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License

