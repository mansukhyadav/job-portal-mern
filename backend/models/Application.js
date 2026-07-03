import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: String, ref: "User", required: true }, // seeker
    recruiterId: { type: String, ref: "User", required: true },

    resume: { type: String, required: true }, // Cloudinary URL snapshot at time of applying
    coverLetter: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// A seeker can only apply once per job
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
