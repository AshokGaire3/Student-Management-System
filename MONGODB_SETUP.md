# MongoDB Setup Guide

## Prerequisites

1. **Install MongoDB:**
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **Linux**: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

   Or use **MongoDB Atlas** (cloud-hosted MongoDB) - recommended for easy setup

2. **Start MongoDB:**
   ```bash
   # macOS/Linux
   brew services start mongodb-community
   # or
   mongod
   
   # Windows
   net start MongoDB
   ```

## Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variable:**
   Create or update `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/student-management
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-secret-key-change-in-production
   ```

   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-management
   ```

3. **Seed the database:**
   ```bash
   node server/database/seed.js
   ```

4. **Start the server:**
   ```bash
   npm run dev:all
   ```

## Database Models

All models are in `server/database/models/`:

- **User** - Authentication and user accounts
- **Student** - Student information
- **Major** - Academic majors
- **Course** - Course information
- **Grade** - Student grades
- **Enrollment** - Student course enrollments
- **MajorChangeRequest** - Major change requests

## MongoDB Atlas Setup (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Whitelist your IP address (0.0.0.0/0 for development)
6. Get connection string and update `MONGODB_URI` in `.env`

## Database Commands

**Connect to MongoDB shell:**
```bash
mongosh
# or
mongo
```

**List databases:**
```javascript
show dbs
```

**Use database:**
```javascript
use student-management
```

**Show collections:**
```javascript
show collections
```

**Query data:**
```javascript
db.students.find()
db.courses.find()
```

## Reset Database

To reset the database with fresh seed data:

```bash
node server/database/seed.js
```

This will:
- Clear all existing data
- Create fresh seed data with demo accounts
- Populate with sample students, courses, grades, etc.


