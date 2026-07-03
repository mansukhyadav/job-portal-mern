import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
});

// Call this once from App.jsx (inside a component that has access to
// Clerk's useAuth hook) to make every subsequent request carry a
// fresh Clerk session token automatically.
export const attachAuthInterceptor = (getToken) => {
  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default api;
