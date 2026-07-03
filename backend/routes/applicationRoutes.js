import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  getAllApplicantsForRecruiter,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Seeker
router.post("/:jobId", requireAuth, requireRole("seeker"), upload.single("resume"), applyToJob);
router.get("/mine", requireAuth, requireRole("seeker"), getMyApplications);

// Recruiter
router.get("/recruiter/all", requireAuth, requireRole("recruiter"), getAllApplicantsForRecruiter);
router.get("/job/:jobId", requireAuth, requireRole("recruiter"), getApplicantsForJob);
router.patch("/:id/status", requireAuth, requireRole("recruiter"), updateApplicationStatus);

export default router;
