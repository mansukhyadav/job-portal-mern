// Sentry must be imported first, before anything else touches the app.
import "./instrument.js";
import Sentry from "./instrument.js";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./config/db.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";

dotenv.config();

const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Clerk webhook needs the raw body for signature verification,
// so it's mounted BEFORE express.json().
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());
app.use(clerkMiddleware());

// --- Routes ---
app.get("/", (req, res) => res.send("Job Portal API is running"));
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);

// --- Sentry error handler (must be registered after routes, before other error middleware) ---
Sentry.setupExpressErrorHandler(app);

// --- Fallback error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

export default app;
