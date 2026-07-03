import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      const { data } = await api.get("/api/jobs/recruiter/mine");
      setJobs(data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const toggleVisibility = async (id) => {
    try {
      await api.patch(`/api/jobs/${id}/visibility`);
      loadJobs();
    } catch (err) {
      toast.error("Failed to update visibility");
    }
  };

  const deleteJob = async (id) => {
    if (!confirm("Delete this job posting? This cannot be undone.")) return;
    try {
      await api.delete(`/api/jobs/${id}`);
      toast.success("Job deleted");
      loadJobs();
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Job Postings</h1>
        <Link to="/recruiter/post-job" className="btn-primary">
          + Post a Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500">You haven't posted any jobs yet.</p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job._id} className="card flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-500">
                  {job.location} • {job.applicantCount} applicant{job.applicantCount !== 1 ? "s" : ""} •{" "}
                  <span className={job.isVisible ? "text-green-600" : "text-gray-400"}>
                    {job.isVisible ? "Live" : "Hidden"}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn-secondary text-sm">
                  Applicants ({job.applicantCount})
                </Link>
                <button onClick={() => toggleVisibility(job._id)} className="btn-secondary text-sm">
                  {job.isVisible ? "Hide" : "Unhide"}
                </button>
                <button
                  onClick={() => deleteJob(job._id)}
                  className="text-sm text-red-500 hover:text-red-700 px-3"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
