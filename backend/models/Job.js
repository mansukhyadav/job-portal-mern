import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    level: {
      type: String,
      enum: ["Internship", "Entry Level", "Mid Level", "Senior Level"],
      default: "Entry Level",
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    salary: { type: Number, required: true },
    skillsRequired: [{ type: String }],
    isVisible: { type: Boolean, default: true },

    recruiterId: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", description: "text", category: "text" });

const Job = mongoose.model("Job", jobSchema);
export default Job;
