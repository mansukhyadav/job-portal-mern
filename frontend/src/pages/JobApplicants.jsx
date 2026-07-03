import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

const STATUS_OPTIONS = ["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];

const statusColor = {
  Pending: "bg-gray-100 text-gray-700",
  Reviewed: "bg-blue-100 text-blue-700",
  Shortlisted: "bg-purple-100 text-purple-700",
  Rejected: "bg-red-100 text-red-700",
  Hired: "bg-green-100 text-green-700",
};

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get(`/api/applications/job/${jobId}`);
      setApplications(data.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/applications/${id}/status`, { status });
      setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Applicants</h1>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applicants yet for this job.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app._id} className="card flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={app.userId?.image || "https://api.dicebear.com/7.x/initials/svg?seed=" + app.userId?.name}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{app.userId?.name}</p>
                  <p className="text-sm text-gray-500 truncate">{app.userId?.email}</p>
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-brand-500 hover:underline"
                  >
                    View Resume
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[app.status]}`}>{app.status}</span>
                <select
                  className="input-field text-sm py-1"
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
