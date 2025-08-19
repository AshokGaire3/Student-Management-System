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

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| **Admin** | `admin@school.edu` | `admin123` | Full system access "Still in development phase, will not work now" |
| **Instructor** | `instructor@school.edu` | `instructor123` | Course & grade management "Still in development phase, will not work now"|
| **Student** | `emma.rodriguez@student.edu` | `student123` | Personal dashboard & courses "This will work"|

## 🛠️ Technology Stack

- **Frontend Framework:** React 18.3.1 with TypeScript
- **Styling:** Tailwind CSS 3.4.1
- **Build Tool:** Vite 7.1.1
- **Icons:** Lucide React
- **Code Quality:** ESLint + TypeScript strict mode

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

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

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run serve      # Serve built files locally
npm run lint       # Run ESLint
```

## 🌐 Deployment Options

This application is ready for deployment on multiple platforms:

### 🔥 GitHub Pages (Automated)

The repository includes GitHub Actions for automatic deployment:

1. **Enable GitHub Pages** in your repository settings
2. **Push to main branch** - automatic deployment will trigger
3. **Access your app** at: `https://ashokgaire3.github.io/Student-Management-System/`

**Manual Deployment:**
```bash
npm run deploy
```

### ⚡ Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   npm run deploy:vercel
   ```

Or connect your GitHub repository directly on [vercel.com](https://vercel.com)

### 🌊 Netlify

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

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Authentication components
│   ├── courses/         # Course management
│   ├── dashboard/       # Dashboard components
│   ├── enrollment/      # Enrollment management
│   ├── grades/          # Grade management
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── profile/         # Profile and settings
│   ├── reports/         # Reporting system
│   └── students/        # Student management
├── contexts/
│   ├── AuthContext.tsx  # Authentication context
│   └── DataContext.tsx  # Application data context
└── main.tsx             # Application entry point
```

## 🔒 Security Features

- **Protected routes** with role-based access
- **Environment variable protection** via `.gitignore`
- **Secure credential handling** for demo accounts
- **Input validation** across all forms
- **Error boundary implementation**

## 🎨 UI/UX Features

- **Fully responsive design** for all screen sizes
- **Modern UI components** with Tailwind CSS
- **Intuitive navigation** with role-based menus
- **Interactive forms** with real-time validation
- **Loading states** and error handling
- **Consistent design system** across components

## 📊 System Capabilities

- **Student Management:** CRUD operations for student records
- **Course Management:** Complete course lifecycle management
- **Grade Management:** Comprehensive grading system
- **Enrollment Tracking:** Student-course relationship management
- **Reporting System:** Data visualization and analytics
- **User Management:** Role-based user administration

## 🧪 Quality Assurance

- **TypeScript strict mode** for type safety
- **ESLint configuration** for code quality
- **Component-based architecture** for maintainability
- **Comprehensive error handling**
- **Production-ready build optimization**

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

---

⭐ If you found this project helpful, please consider giving it a star!
