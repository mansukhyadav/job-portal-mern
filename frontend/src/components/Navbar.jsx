import { Link } from "react-router-dom";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useProfile } from "../context/UserContext";

const Navbar = () => {
  const { profile } = useProfile();

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-500">
          Job<span className="text-gray-800">Portal</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/jobs" className="text-sm font-medium text-gray-600 hover:text-brand-500">
            Browse Jobs
          </Link>

          <SignedIn>
            {profile?.role === "recruiter" ? (
              <>
                <Link to="/recruiter/dashboard" className="text-sm font-medium text-gray-600 hover:text-brand-500">
                  Dashboard
                </Link>
                <Link to="/recruiter/post-job" className="btn-primary text-sm">
                  Post a Job
                </Link>
              </>
            ) : (
              <Link to="/seeker/dashboard" className="text-sm font-medium text-gray-600 hover:text-brand-500">
                My Applications
              </Link>
            )}
            <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-brand-500">
              Profile
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-primary text-sm">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
