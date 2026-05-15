# CareerForge 🚀

CareerForge is a career-guidance and skill-tracking platform for BTech/engineering students. It helps students choose a career domain, follow a structured roadmap, track progress, attempt assessments, earn badges, and get guided by an AI career agent.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS (v4), React Router, Axios, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI (Configurable API Key)

## Project Structure

- `/client` - Frontend React application (Vite)
- `/server` - Backend Node/Express API

## Features
- **14 Career Domains**: Comprehensive roadmaps from Web Dev to Data Science.
- **Progress Tracking**: Heatmaps, topic completion, phase-wise tracking.
- **Assessments & Badges**: HackerRank certification integration and custom badges.
- **AI Career Mentor**: Get personalized advice based on your domain and progress.
- **Admin Dashboard**: Manage domains, phases, topics, users, and resources.

## Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

## Setup Instructions

### 1. Backend Setup

```bash
cd server
npm install
```

Copy the `.env.example` to `.env` and fill in your details:
```bash
cp .env.example .env
```
Ensure you provide a valid `MONGODB_URI` and `JWT_SECRET`. If you have an OpenAI API key, add it to `AI_API_KEY`.

Start the backend:
```bash
npm run dev
```

### 2. Database Seeding

To populate the database with the default domains, roadmaps, and resources:
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
- **Admin**: `admin@careerforge.com` / `Admin@123` (Created via seed script)
- **Student**: Any new user that registers via the UI will be a student by default.

## License
MIT
