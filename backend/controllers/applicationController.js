import Application from "../models/Application.js";
import Job from "../models/Job.js";
import cloudinary from "../config/cloudinary.js";

// @route  POST /api/applications/:jobId
// @desc   Seeker applies to a job (resume already on profile, or freshly uploaded)
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    let resumeUrl = req.user.resume;

    // Allow applying with a freshly uploaded resume (multipart/form-data)
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "raw", folder: "job-portal/resumes", format: "pdf" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      resumeUrl = uploadResult.secure_url;
    }

    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: "No resume found. Upload a resume to your profile or attach one with this application.",
      });
    }

    const application = await Application.create({
      jobId,
      userId: req.user._id,
      recruiterId: job.recruiterId,
      resume: resumeUrl,
      coverLetter,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "You already applied to this job" });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while applying" });
  }
};

// @route  GET /api/applications/mine
// @desc   Seeker - view their own applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate({
        path: "jobId",
        select: "title location salary type recruiterId",
        populate: { path: "recruiterId", select: "companyName companyLogo" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while fetching applications" });
  }
};

// @route  GET /api/applications/job/:jobId
// @desc   Recruiter - view all applicants for one of their job postings
export const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.recruiterId !== req.user._id) {
      return res.status(403).json({ success: false, message: "You do not own this job posting" });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("userId", "name email image skills bio")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while fetching applicants" });
  }
};

// @route  GET /api/applications/recruiter/all
// @desc   Recruiter - view every applicant across all their postings (tracking board)
export const getAllApplicantsForRecruiter = async (req, res) => {
  try {
    const applications = await Application.find({ recruiterId: req.user._id })
      .populate("userId", "name email image skills")
      .populate("jobId", "title location")
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while fetching applicants" });
  }
};

// @route  PATCH /api/applications/:id/status
// @desc   Recruiter updates an applicant's status (Pending -> Reviewed -> Shortlisted -> Hired/Rejected)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    if (application.recruiterId !== req.user._id) {
      return res.status(403).json({ success: false, message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while updating status" });
  }
};
