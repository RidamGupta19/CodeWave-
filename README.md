# CodeWave Solution 🚀

CodeWave Solution is a premium coaching institute management system integrated with a gamified Career Development Hub for students. It enables complete administrative oversight of batches, scheduling, courses, attendance, materials, and fees, while keeping the interactive roadmap tracking, problem solving, assessments, and AI mentoring for student career growth.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, React Router, Axios, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT (JSON Web Tokens) with dynamic role authorization and Google Sign-in flow
- **AI Integration**: OpenAI (Configurable API Key)

## Project Structure
- `/client` - Frontend React application (Vite)
- `/server` - Backend Node/Express API

## Key Modules

### 1. Institute Management System
- **Students & Teachers**: Full administration, enrollment, and profile management.
- **Courses & Batches**: CRUD courses, manage student batch assignments.
- **Attendance Tracker**: Teacher attendance logging with student percentage analytics.
- **Scheduler**: Classroom scheduler and calendar timeline.
- **Notice Board**: Multi-role notices feed (Admins write, Teachers/Students view).
- **Study Materials & Assignments**: Resource uploads, downloading, and assignment management.
- **Fees & Billing Console**: Log payments, check due balances, and generate invoice receipts.

### 2. Career Development Hub
- **14 Career Domains**: Comprehensive roadmaps from Web Dev to DSA.
- **Progress Tracking**: Heatmaps, topic completion, phase-wise tracking.
- **Assessments & Badges**: HackerRank certification integration and custom topic badges.
- **CodeWave AI Mentor**: Get personalized advice based on your domain, billing records, schedule, and progress.

## Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

## Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
```
Copy the `.env.example` to `.env` and fill in your details.
Ensure you provide a valid `MONGODB_URI` and `JWT_SECRET`. If you have an OpenAI API key, add it to `AI_API_KEY`.

Start the backend:
```bash
npm run dev
```

### 2. Database Seeding
To populate the database with the default coaching records, domains, roadmaps, and resources:
```bash
cd server
npm run seed
```
*(Make sure MongoDB is running before running the seed script)*

### 3. Frontend Setup
```bash
cd client
npm install
```
Start the frontend development server:
```bash
npm run dev
```

## Default Roles
- **Admin**: `admin@codewavesolution.com` / `Admin@123` (Created via seed script)
- **Teacher**: `teacher@codewavesolution.com` / `Teacher@123` (Created via seed script)
- **Student**: `student@codewavesolution.com` / `Student@123` (Created via seed script)

## License
MIT
