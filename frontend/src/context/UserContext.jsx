import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import api, { attachAuthInterceptor } from "../lib/api";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interceptorReady, setInterceptorReady] = useState(false);

  useEffect(() => {
    attachAuthInterceptor(getToken);
    setInterceptorReady(true);
  }, [getToken]);

  const refreshProfile = useCallback(async () => {
    if (!isSignedIn) {
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/api/users/me");
      setProfile(data.user);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoaded && interceptorReady) refreshProfile();
  }, [isLoaded, interceptorReady, refreshProfile]);

  return (
    <UserContext.Provider value={{ profile, loading, refreshProfile, clerkUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useProfile = () => useContext(UserContext);
