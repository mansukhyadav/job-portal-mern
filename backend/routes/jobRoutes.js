import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  toggleVisibility,
} from "../controllers/jobController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/", getJobs);

// Recruiter-only (must come before "/:id" so "mine" isn't parsed as an id)
router.get("/recruiter/mine", requireAuth, requireRole("recruiter"), getMyJobs);
router.post("/", requireAuth, requireRole("recruiter"), createJob);
router.put("/:id", requireAuth, requireRole("recruiter"), updateJob);
router.delete("/:id", requireAuth, requireRole("recruiter"), deleteJob);
router.patch("/:id/visibility", requireAuth, requireRole("recruiter"), toggleVisibility);

// Public - keep last since ":id" is a catch-all
router.get("/:id", getJobById);

export default router;
