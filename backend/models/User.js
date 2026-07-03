import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Clerk's user id (e.g. "user_2abc...") is used as the primary key
    // so we never have to keep a separate auth<->db mapping table.
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    role: {
      type: String,
      enum: ["seeker", "recruiter"],
      default: "seeker",
    },

    // Job-seeker specific fields
    resume: { type: String, default: "" }, // Cloudinary URL
    resumePublicId: { type: String, default: "" },
    skills: [{ type: String }],
    bio: { type: String, default: "" },

    // Recruiter specific fields
    companyName: { type: String, default: "" },
    companyLogo: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
  },
  { timestamps: true, _id: false }
);

const User = mongoose.model("User", userSchema);
export default User;
