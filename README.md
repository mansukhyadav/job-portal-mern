# Job Portal — Full-Stack MERN Application

A full-stack job portal with role-based authentication (recruiters vs. job seekers), job posting, applications with resume uploads, an applicant tracking system, real-time error monitoring, and cloud deployment support.

**Stack:** MongoDB · Express · React (Vite) · Node.js · Clerk (auth) · Cloudinary (file storage) · Sentry (monitoring) · Tailwind CSS · deployed on Vercel

---

## ✨ Features

- **Secure role-based auth** via Clerk — users sign up once and choose "Job Seeker" or "Recruiter"; routes and API endpoints are gated by role.
- **Recruiter dashboard** — post jobs, edit/hide/delete postings, view applicant counts.
- **Job-seeker dashboard** — browse/search/filter jobs, apply with resume + cover letter, track application status.
- **Resume & profile management** — upload resumes (PDF) and company logos to Cloudinary; edit bio/skills/company info.
- **Applicant Tracking System (ATS)** — recruiters view applicants per job and move them through Pending → Reviewed → Shortlisted → Hired/Rejected.
- **RESTful API** — clean CRUD endpoints for jobs, applications, and users, all protected with Clerk-verified JWTs.
- **Sentry integration** — real-time error monitoring & performance tracing on both backend (Express) and frontend (React).
- **Deployable to Vercel** — both `frontend/` and `backend/` include `vercel.json` for one-click cloud hosting.

---

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── config/          # MongoDB + Cloudinary config
│   ├── controllers/     # Business logic (jobs, applications, users)
│   ├── middleware/      # Clerk auth guard, role guard, multer upload
│   ├── models/          # Mongoose schemas: User, Job, Application
│   ├── routes/          # Express routers
│   ├── instrument.js    # Sentry init (must load first)
│   └── server.js        # App entry point
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, JobCard, ProtectedRoute
    │   ├── context/     # UserContext (syncs Clerk user -> backend profile)
    │   ├── lib/api.js   # Axios instance w/ Clerk token interceptor
    │   ├── pages/        # Home, Jobs, JobDetail, Dashboards, Profile...
    │   └── App.jsx / main.jsx
    └── index.html
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB)
- A [Clerk](https://clerk.com) application (free tier is fine)
- A [Cloudinary](https://cloudinary.com) account (free tier)
- A [Sentry](https://sentry.io) project for both backend (Node) and frontend (React)

### 2. Backend setup
```bash
cd backend
cp .env.example .env      # fill in your real keys
npm install
npm run dev                # starts on http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
cp .env.example .env      # fill in your real keys
npm install
npm run dev                # starts on http://localhost:5173
```

### 4. Clerk webhook (optional but recommended)
In the Clerk dashboard → Webhooks, point an endpoint at:
`https://<your-backend-url>/api/webhooks/clerk`
Subscribe to `user.created`, `user.updated`, `user.deleted`. Copy the signing secret into `CLERK_WEBHOOK_SECRET`.

---

## ☁️ Deploying to Vercel

1. Push this repo to GitHub.
2. Import `backend/` as one Vercel project (Node.js) — add all backend `.env` variables in Vercel's dashboard.
3. Import `frontend/` as a second Vercel project (Vite) — add all frontend `VITE_*` variables, with `VITE_BACKEND_URL` pointing at your deployed backend URL.
4. Update `CLIENT_URL` in the backend's env vars to your deployed frontend URL (for CORS).

---

## 🔑 API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/jobs` | Public | List/search/filter visible jobs |
| GET | `/api/jobs/:id` | Public | Job details |
| POST | `/api/jobs` | Recruiter | Create job |
| PUT | `/api/jobs/:id` | Recruiter (owner) | Update job |
| DELETE | `/api/jobs/:id` | Recruiter (owner) | Delete job |
| PATCH | `/api/jobs/:id/visibility` | Recruiter (owner) | Toggle visibility |
| GET | `/api/jobs/recruiter/mine` | Recruiter | List own postings + applicant counts |
| POST | `/api/applications/:jobId` | Seeker | Apply to a job (multipart, `resume` file optional) |
| GET | `/api/applications/mine` | Seeker | My applications |
| GET | `/api/applications/job/:jobId` | Recruiter (owner) | Applicants for one job |
| GET | `/api/applications/recruiter/all` | Recruiter | All applicants across postings |
| PATCH | `/api/applications/:id/status` | Recruiter (owner) | Update applicant status |
| GET | `/api/users/me` | Any signed-in | Own profile |
| PUT | `/api/users/me` | Any signed-in | Update profile/role |
| POST | `/api/users/me/resume` | Any signed-in | Upload resume |
| POST | `/api/users/me/logo` | Any signed-in | Upload company logo |

---

## 🛡️ Security notes

- All mutating routes verify the Clerk session server-side (`requireAuth`) — the frontend never trusts its own role state for authorization, only for UI.
- Ownership checks (`job.recruiterId !== req.user._id`) prevent recruiters from editing/deleting each other's jobs.
- File uploads are streamed directly to Cloudinary in-memory (via multer) — nothing touches disk, which also makes this safe for serverless deployment.
- Sentry captures both handled and unhandled errors on both ends without leaking `.env` secrets into client bundles (only `VITE_`-prefixed vars are exposed to the frontend).
