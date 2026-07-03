import Job from "../models/Job.js";
import Application from "../models/Application.js";

// @route  POST /api/jobs
// @desc   Recruiter creates a new job posting
export const createJob = async (req, res) => {
  try {
    const { title, description, location, category, level, type, salary, skillsRequired } = req.body;

    if (!title || !description || !location || !category || !salary) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const job = await Job.create({
      title,
      description,
      location,
      category,
      level,
      type,
      salary,
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : (skillsRequired || "").split(",").map((s) => s.trim()).filter(Boolean),
      recruiterId: req.user._id,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while creating job" });
  }
};

// @route  GET /api/jobs
// @desc   Public - list all visible jobs, with optional search/filter
export const getJobs = async (req, res) => {
  try {
    const { search, location, category, level, type } = req.query;
    const filter = { isVisible: true };

    if (search) filter.$text = { $search: search };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (type) filter.type = type;

    const jobs = await Job.find(filter)
      .populate("recruiterId", "name companyName companyLogo")
      .sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while fetching jobs" });
  }
};

// @route  GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiterId",
      "name companyName companyLogo companyWebsite"
    );
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while fetching job" });
  }
};

// @route  GET /api/jobs/recruiter/mine
// @desc   Recruiter - list jobs they've posted
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });

    // Attach applicant counts for the recruiter dashboard
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ jobId: job._id });
        return { ...job.toObject(), applicantCount };
      })
    );

    res.json({ success: true, jobs: jobsWithCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while fetching your jobs" });
  }
};

// @route  PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.recruiterId !== req.user._id) {
      return res.status(403).json({ success: false, message: "You do not own this job posting" });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while updating job" });
  }
};

// @route  DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.recruiterId !== req.user._id) {
      return res.status(403).json({ success: false, message: "You do not own this job posting" });
    }

    await job.deleteOne();
    await Application.deleteMany({ jobId: job._id });

    res.json({ success: true, message: "Job deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error while deleting job" });
  }
};

// @route  PATCH /api/jobs/:id/visibility
export const toggleVisibility = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.recruiterId !== req.user._id) {
      return res.status(403).json({ success: false, message: "You do not own this job posting" });
    }
    job.isVisible = !job.isVisible;
    await job.save();
    res.json({ success: true, job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
