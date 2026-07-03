import { Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./context/UserContext";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import PostJob from "./pages/PostJob";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import JobApplicants from "./pages/JobApplicants";
import SeekerDashboard from "./pages/SeekerDashboard";
import Profile from "./pages/Profile";

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

function App() {
  return (
    <UserProvider>
      <Navbar />
      <SentryRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/post-job"
          element={
            <ProtectedRoute requiredRole="recruiter">
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute requiredRole="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:jobId/applicants"
          element={
            <ProtectedRoute requiredRole="recruiter">
              <JobApplicants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seeker/dashboard"
          element={
            <ProtectedRoute requiredRole="seeker">
              <SeekerDashboard />
            </ProtectedRoute>
          }
        />
      </SentryRoutes>
    </UserProvider>
  );
}

export default Sentry.withProfiler(App);
