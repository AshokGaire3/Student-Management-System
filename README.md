# 🎓 Student Management System

A comprehensive React-based Student Management System built with TypeScript, Tailwind CSS, and Vite. This system provides role-based access control for administrators, instructors, and students with full CRUD operations for academic management.

## ✨ Features

### 🔐 Authentication & Authorization
- **Role-based access control** (Admin, Instructor, Student)
- **Secure login system** with demo accounts
- **Protected routes** based on user roles

### 👨‍💼 Administrator Features
- Complete user management
- Course and enrollment oversight
- Comprehensive reporting system
- Major change request management

### 👨‍🏫 Instructor Features
- Course management and creation
- Grade management and assignment
- Student enrollment tracking
- Course-specific reporting

### 🎓 Student Features
- Personal dashboard with course overview
- Grade viewing and tracking
- Course registration system
- Profile and settings management
- Major change requests

## 🚀 Demo Accounts

After running `npm run seed`, you can use these accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| **Admin** | `admin@university.edu` | `admin123` | Full system access |
| **Instructor** | `jane.instructor@university.edu` | `instructor123` | Course & grade management |
| **Student** | `emma.rodriguez@student.edu` | `student123` | Personal dashboard & courses |

**Note:** Passwords are securely hashed using bcrypt. The seed script creates these accounts with sample data.

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18.3.1 with TypeScript
- **Styling:** Tailwind CSS 3.4.1
- **Build Tool:** Vite 7.1.1
- **Icons:** Lucide React
- **Code Quality:** ESLint + TypeScript strict mode

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **CORS:** Enabled for cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- MongoDB (local installation or MongoDB Atlas account)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/AshokGaire3/Student-Management-System.git
   cd Student-Management-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MongoDB**
   
   **Option A: Local MongoDB**
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   
   # Windows: Download and install from mongodb.com
   # Linux: Follow MongoDB installation guide
   ```
   
   **Option B: MongoDB Atlas (Cloud - Recommended)**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string

4. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/student-management
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-secret-key-change-in-production
   ```
   
   For MongoDB Atlas, use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-management
   ```

5. **Seed the Database**
   ```bash
   npm run seed
   ```
   This will create demo accounts and sample data.

6. **Start development servers**
   
   Start both frontend and backend:
   ```bash
   npm run dev:all
   ```
   
   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   npm run dev:server
   
   # Terminal 2 - Frontend
   npm run dev
   ```

7. **Open your browser**
   - Frontend: Navigate to `http://localhost:5173`
   - Backend API: `http://localhost:5000`

### Available Scripts

```bash
# Development
npm run dev        # Start frontend development server
npm run dev:server # Start backend server
npm run dev:all    # Start both frontend and backend concurrently

# Database
npm run seed       # Seed database with initial data

# Build & Deploy
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run serve      # Serve built files locally
npm run lint       # Run ESLint

# Deployment
npm run deploy           # Deploy to GitHub Pages
npm run deploy:vercel    # Deploy to Vercel
npm run deploy:netlify   # Deploy to Netlify
```

## 🗄️ Database

This application uses **MongoDB** (NoSQL database) with Mongoose ODM:

- **Local MongoDB:** For development on your machine
- **MongoDB Atlas:** Cloud-hosted option (recommended for easy setup)
- **Schema Validation:** All models have validation rules
- **Relationships:** Proper references between collections
- **Indexes:** Optimized queries with database indexes

See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed database setup instructions.

## 🌐 Deployment Options

This application is ready for deployment on multiple platforms:

### 🔥 GitHub Pages (Frontend Only)

The repository includes GitHub Actions for automatic deployment:

1. **Enable GitHub Pages** in your repository settings
2. **Push to main branch** - automatic deployment will trigger
3. **Access your app** at: `https://ashokgaire3.github.io/Student-Management-System/`

**Manual Deployment:**
```bash
npm run deploy
```

### ⚡ Vercel (Full Stack - Recommended)

**Frontend + Backend:**
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Configure environment variables** in Vercel dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your secret key
   - `NODE_ENV=production`

3. **Deploy**
   ```bash
   npm run deploy:vercel
   ```

Or connect your GitHub repository directly on [vercel.com](https://vercel.com)

**Note:** Vercel supports both frontend and backend deployment. Make sure to set up MongoDB Atlas for production.

### 🌊 Netlify (Frontend Only)

**Note:** For full-stack deployment with Netlify, you'll need to deploy the backend separately (e.g., Railway, Render, or Heroku).

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build and deploy**
   ```bash
   npm run build
   npm run deploy:netlify
   ```

Or drag and drop the `dist` folder to [netlify.com](https://netlify.com)

### 🚂 Backend Deployment Options

- **Railway** - Easy deployment with MongoDB support
- **Render** - Free tier available, supports MongoDB
- **Heroku** - Classic PaaS option
- **DigitalOcean App Platform** - Simple deployment
- **AWS/GCP/Azure** - Enterprise solutions

For backend deployment, ensure:
- MongoDB Atlas connection string is set
- Environment variables are configured
- CORS allows your frontend domain

## 📁 Project Structure

```
Student-Management-System/
├── server/                    # Backend API
│   ├── database/
│   │   ├── models/           # Mongoose models (User, Student, Course, etc.)
│   │   ├── connection.js     # MongoDB connection
│   │   ├── database.js       # Database operations layer
│   │   └── seed.js           # Database seed script
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── courses.js
│   │   ├── grades.js
│   │   ├── enrollments.js
│   │   ├── majors.js
│   │   └── majorChangeRequests.js
│   └── index.js              # Server entry point
├── src/                      # Frontend
│   ├── components/
│   │   ├── admin/           # Admin-specific components
│   │   ├── auth/            # Authentication components
│   │   ├── courses/         # Course management
│   │   ├── dashboard/       # Dashboard components
│   │   ├── enrollment/      # Enrollment management
│   │   ├── grades/          # Grade management
│   │   ├── layout/          # Layout components (Header, Sidebar)
│   │   ├── profile/         # Profile and settings
│   │   ├── reports/         # Reporting system
│   │   └── students/        # Student management
│   ├── contexts/
│   │   ├── AuthContext.tsx  # Authentication context
│   │   └── DataContext.tsx  # Application data context
│   ├── services/
│   │   ├── api.ts           # API service layer
│   │   └── toast.tsx        # Toast notification system
│   └── main.tsx             # Application entry point
└── package.json             # Dependencies and scripts
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Protected API Routes** - Role-based access control middleware
- **CORS Configuration** - Controlled cross-origin requests
- **Input Validation** - Mongoose schema validation
- **Environment Variables** - Secure configuration management
- **SQL Injection Protection** - MongoDB ObjectId validation

## 🎨 UI/UX Features

- **Fully responsive design** for all screen sizes
- **Modern UI components** with Tailwind CSS
- **Intuitive navigation** with role-based menus
- **Interactive forms** with real-time validation
- **Loading states** and error handling
- **Consistent design system** across components

## 📊 System Capabilities

- **Student Management:** Full CRUD operations with MongoDB
- **Course Management:** Complete course lifecycle with enrollment tracking
- **Grade Management:** Comprehensive grading system with GPA calculation
- **Enrollment Tracking:** Student-course relationship management
- **Major Management:** Academic major administration
- **Major Change Requests:** Request and approval workflow
- **Reporting System:** Data visualization and analytics
- **User Management:** Role-based user administration
- **RESTful API:** Complete backend API with Express.js and MongoDB

## 🧪 Quality Assurance

- **TypeScript strict mode** for type safety
- **ESLint configuration** for code quality
- **Component-based architecture** for maintainability
- **MongoDB schema validation** for data integrity
- **Comprehensive error handling** with try-catch blocks
- **Async/await patterns** for clean asynchronous code
- **Production-ready build optimization**

## 📚 Additional Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup and installation guide
- **[README_BACKEND.md](./README_BACKEND.md)** - Backend API documentation
- **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** - MongoDB setup and configuration guide
- **[CHANGELOG.md](./CHANGELOG.md)** - List of changes and enhancements

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Ashok Gaire**
- GitHub: [@AshokGaire3](https://github.com/AshokGaire3)

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure MongoDB is running (local) or your Atlas connection string is correct
- Check firewall settings if using MongoDB Atlas
- Verify environment variables are set correctly

### Authentication Issues
- Clear browser localStorage and try logging in again
- Verify JWT_SECRET is set in environment variables
- Check that user exists in database (run `npm run seed` if needed)

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 5000: `lsof -ti:5000 | xargs kill`

### Module Not Found Errors
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

⭐ If you found this project helpful, please consider giving it a star!
