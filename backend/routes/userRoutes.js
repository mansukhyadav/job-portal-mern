import express from "express";
import { getMe, updateProfile, uploadResume, uploadCompanyLogo } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateProfile);
router.post("/me/resume", requireAuth, upload.single("resume"), uploadResume);
router.post("/me/logo", requireAuth, upload.single("logo"), uploadCompanyLogo);

export default router;
