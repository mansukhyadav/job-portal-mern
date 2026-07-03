import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useProfile } from "../context/UserContext";

// requiredRole: "seeker" | "recruiter" | undefined (any signed-in user)
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { profile, loading } = useProfile();

  if (!isLoaded || loading) {
    return <div className="flex justify-center py-20 text-gray-500">Loading...</div>;
  }

  if (!isSignedIn) return <Navigate to="/" replace />;

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
