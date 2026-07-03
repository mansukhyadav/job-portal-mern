import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// @route  GET /api/users/me
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @route  PUT /api/users/me
// @desc   Update profile fields (role, bio, skills, company info, etc.)
export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "role",
      "bio",
      "skills",
      "companyName",
      "companyWebsite",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] =
          field === "skills" && typeof req.body.skills === "string"
            ? req.body.skills.split(",").map((s) => s.trim()).filter(Boolean)
            : req.body[field];
      }
    });

    await req.user.save();
    res.json({ success: true, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while updating profile" });
  }
};

// @route  POST /api/users/me/resume
// @desc   Upload / replace resume (PDF)
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    // Remove old resume from Cloudinary if present
    if (req.user.resumePublicId) {
      await cloudinary.uploader.destroy(req.user.resumePublicId, { resource_type: "raw" }).catch(() => {});
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "job-portal/resumes", format: "pdf" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    req.user.resume = uploadResult.secure_url;
    req.user.resumePublicId = uploadResult.public_id;
    await req.user.save();

    res.json({ success: true, resume: req.user.resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while uploading resume" });
  }
};

// @route  POST /api/users/me/logo
// @desc   Recruiter uploads company logo (image)
export const uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "job-portal/logos" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    req.user.companyLogo = uploadResult.secure_url;
    await req.user.save();

    res.json({ success: true, companyLogo: req.user.companyLogo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while uploading logo" });
  }
};
