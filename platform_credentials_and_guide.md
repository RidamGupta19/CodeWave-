# 🌐 CodeWave Developer Guide & Credentials

This document contains essential credentials, local endpoints, and feature architecture details for the CodeWave platform.

---

## 🔑 Default Seed Credentials

Use these credentials to test the student, instructor, and administration workflows.

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **👑 Admin** | `admin@codewavesolution.com` | `Admin@1910` |
| **👩‍🏫 Teacher (Instructor)** | `teacher@codewavesolution.com` | `Teacher@123` |
| **👨‍🎓 Student** | `student@codewavesolution.com` | `Student@123` |

---

## 🖥️ Local Infrastructure Ports

* **Frontend Client (Vite)**: [http://localhost:5173](http://localhost:5173)
* **Backend REST API (Express)**: [http://localhost:5000](http://localhost:5000)
  * Base API path: `/api` (e.g., [http://localhost:5000/api](http://localhost:5000/api))
* **Database**: Runs on an automatic **in-memory MongoDB server** initialized on launch. Database auto-seeding triggers automatically whenever the dataset is empty.

---

## 🚀 Key Stabilized Features

### 1. ☁️ Cloud Credits Perks Claims
* **Student Flow**: Go to the **Perks** or **Resources** tab, choose a cloud service (GitHub, AWS, GCP, Azure, MongoDB, Vercel, Netlify), and click **Claim**. Claim status updates instantly.
* **Admin Flow**: Access the **Cloud Credits Claims** tab on the Admin Dashboard to review student requests, assign custom voucher codes, and approve or decline them.
* **Race Condition Prevention**: Enforces a unique compound index `{ user: 1, cloudCredit: 1 }` preventing double-claiming or voucher code leakage.

### 2. 📸 User Profile Image Uploads
* **Compressions & Validation**: High-resolution avatars are resized to a max dimension of 800px and compressed into lightweight **WebP files** (at `0.85` quality) in the browser.
* **Limits**: Enforces a strict **3 MB** file size limit on both the frontend and backend. Only `PNG`, `JPG`, `JPEG`, and `WEBP` formats are permitted.
* **Disk Optimization**: Automatically deletes the old profile picture from `server/uploads/` on disk whenever a user uploads a new photo.

### 3. 🎯 Monaco coding problems (Zero to Coding)
* **Student flow**: Browse problems filtered by difficulty level, inspect examples, hints, and constraints, write code in the Monaco Editor, and execute tests.
* **Admin flow**: Create, edit, and delete problems. Supports publishing or unpublishing, adding constraints, test cases, and editorial walkthroughs.

### 4. 🎥 Video Lecture Playlists
* Arranges lectures by playlist orders, assigns videos to designated batches, and keeps track of student watch milestones and resume points.
