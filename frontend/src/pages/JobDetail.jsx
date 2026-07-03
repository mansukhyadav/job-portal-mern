import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { useProfile } from "../context/UserContext";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const { profile } = useProfile();

  useEffect(() => {
    api
      .get(`/api/jobs/${id}`)
      .then(({ data }) => setJob(data.job))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);
      if (resumeFile) formData.append("resume", resumeFile);

      await api.post(`/api/applications/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Application submitted!");
      setCoverLetter("");
      setResumeFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>;
  if (!job) return <p className="text-center py-20 text-gray-500">Job not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="card">
        <div className="flex items-center gap-4">
          <img
            src={job.recruiterId?.companyLogo || "https://api.dicebear.com/7.x/initials/svg?seed=" + (job.recruiterId?.companyName || "Company")}
            className="w-16 h-16 rounded-lg object-cover bg-gray-100"
            alt=""
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-500">{job.recruiterId?.companyName}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded-full">{job.location}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{job.type}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{job.level}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">₹{job.salary?.toLocaleString()}/yr</span>
        </div>

        <h2 className="font-semibold mt-6 mb-2">Description</h2>
        <p className="text-gray-600 whitespace-pre-line">{job.description}</p>

        {job.skillsRequired?.length > 0 && (
          <>
            <h2 className="font-semibold mt-6 mb-2">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill) => (
                <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <SignedOut>
        <div className="card mt-6 text-center">
          <p className="text-gray-600 mb-3">Sign in to apply for this job.</p>
          <SignInButton mode="modal">
            <button className="btn-primary">Sign In</button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        {profile?.role === "seeker" ? (
          <form onSubmit={handleApply} className="card mt-6">
            <h2 className="font-semibold mb-3">Apply to this job</h2>
            <textarea
              className="input-field mb-3"
              rows={4}
              placeholder="Cover letter (optional)"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <label className="block text-sm text-gray-600 mb-3">
              {profile?.resume ? "Resume on file will be used unless you upload a new one:" : "Upload your resume (PDF):"}
              <input
                type="file"
                accept="application/pdf"
                className="block mt-1"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
            </label>
            <button className="btn-primary" type="submit" disabled={applying}>
              {applying ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-500 mt-6">Only job seekers can apply to jobs.</p>
        )}
      </SignedIn>
    </div>
  );
};

export default JobDetail;
