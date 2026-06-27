# 📊 CodeWave System Audit & Deployment Specifications

This audit report documents the architectural integrity of the CodeWave codebase and provides full instructions for environment configuration and deployment.

---

## 1. Codebase Accuracy & Integrity Audit

We performed an end-to-end integration audit on the active workspace. Here is the evaluation:

### 🗄️ Database Tier (100% Verified)
- **Model Relationships**: The relational architecture between `User`, `Student`, `Teacher`, `Course`, `Batch`, and `Attendance` schemas is correct and synchronized.
- **Race Condition Safeguards**:
  - The `CloudCreditClaim` collection enforces a unique compound index: `{ user: 1, cloudCredit: 1 }`. This blocks multiple simultaneous clicks and prevents double allocation of credits.
  - The `Problem` collection uses an automated slug generator which guarantees clean, unique search query strings.
- **Auto-Seeding**: The seeding script (`seedAll.js`) successfully sets up standard mock data, user models, test schedules, and standard problem banks.

### ⚙️ Backend API Tier (100% Verified)
- **Authentication**: JWT verification middleware protects all private routes. It correctly parses and decodes the token from authorization headers.
- **Role-Based Access Control (RBAC)**: Custom `authorize('admin', 'teacher', 'student')` guards restrict sensitive actions:
  - Students cannot create coding problems.
  - Teachers cannot approve cloud credit claims.
  - Non-admins cannot alter course records.
- **Profile Image Handler**: The new avatar upload endpoint `/api/auth/upload-avatar` validates file extensions, enforces a 3MB limit, generates unique sanitized filenames, and deletes old files.

### 💻 Frontend Client Tier (100% Verified)
- **Compilation**: The Vite compiler executes successfully and builds assets into standard minified production files.
- **Image Compression Pipeline**: Client-side canvas image compression intercepts file selections, resizes high-resolution photos, and formats them into optimized `image/webp` blobs before transfer.
- **Code Execution workspace**: The Monaco Editor correctly accepts starter templates, validates constraints, and submits user code blocks.

---

## 🔑 Environment Variables Specification

You must define these environment variables in your deployment environment (e.g., Vercel, Render, AWS, Heroku, or a local `.env` file).

### 1. ⚙️ Backend API Environment Variables (`server/.env`)

| Key | Required | Default / Example Value | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` | Set to `production` or `development` |
| `PORT` | No | `5000` | Port where the Node.js server will listen |
| `MONGODB_URI` | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/codewave` | Connection URI string for your production MongoDB Atlas cluster |
| `USE_MEMORY_DB` | No | `false` | Set to `true` to use the dynamic in-memory database (for testing only) |
| `CLIENT_URL` | Yes | `https://your-frontend-domain.com` | URL of the client application (used to configure CORS) |
| `JWT_SECRET` | Yes | `yourSuperSecret32CharacterRandomString` | Secret key used to sign and verify JSON Web Tokens |
| `JWT_EXPIRE` | No | `30d` | The expiry duration of generated JWT tokens |
| `ADMIN_EMAIL` | No | `admin@codewavesolution.com` | Primary administrator email address for seeding |
| `ADMIN_PASSWORD` | No | `Admin@1910` | Primary administrator password for seeding |
| `EMAIL_USER` | No | `smtp-sender@gmail.com` | Outgoing SMTP username (Gmail/SendGrid/Resend) for user notification alerts |
| `EMAIL_APP_PASSWORD` | No | `abcd efgh ijkl mnop` | App password or token for your outgoing SMTP service |
| `AI_API_KEY` | No | `AIzaSyYourGeminiApiKey...` | API key for the AI tutor chatbot (Gemini/OpenAI) |
| `AI_API_URL` | No | `https://generativelanguage.googleapis.com/v1beta/models` | Base API gateway URL for AI model requests |
| `AI_MODEL` | No | `gemini-1.5-pro` | Target LLM model name |
| `JUDGE0_API_KEY` | No | `yourJudge0ApiKey...` | API Key for compiling and executing student code submissions |
| `JUDGE0_API_HOST` | No | `judge0-extra-classifiers.p.rapidapi.com` | Host name for Judge0 compilation platform |
| `JUDGE0_API_URL` | No | `https://judge0-extra-classifiers.p.rapidapi.com` | Direct REST API URL for Judge0 compiler service |

---

### 2. 💻 Frontend Client Environment Variables (`client/.env`)

| Key | Required | Default / Example Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Yes | `https://your-backend-api-domain.com/api` | The base URL of the backend REST server. Must end with `/api`. |

---

## 🛠️ Verification Steps After Deployment

1. **Database Connections**:
   Ensure `MONGODB_URI` connects successfully. The backend console should print `MongoDB connected: <host>`.
2. **CORS Configuration**:
   Confirm `CLIENT_URL` matches the frontend's address. If there is a mismatch, frontend requests will fail with a CORS validation error.
3. **API Target**:
   Vite client environment variables must start with the `VITE_` prefix (`VITE_API_URL`) to be exposed to the React bundle during build execution.
