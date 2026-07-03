import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

const statusColor = {
  Pending: "bg-gray-100 text-gray-700",
  Reviewed: "bg-blue-100 text-blue-700",
  Shortlisted: "bg-purple-100 text-purple-700",
  Rejected: "bg-red-100 text-red-700",
  Hired: "bg-green-100 text-green-700",
};

const SeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/applications/mine")
      .then(({ data }) => setApplications(data.applications))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-500">
          You haven't applied to any jobs yet. <Link to="/jobs" className="text-brand-500 hover:underline">Browse jobs</Link>.
        </p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app._id} className="card flex items-center justify-between">
              <div>
                <Link to={`/jobs/${app.jobId?._id}`} className="font-semibold text-gray-900 hover:text-brand-500">
                  {app.jobId?.title}
                </Link>
                <p className="text-sm text-gray-500">
                  {app.jobId?.recruiterId?.companyName} • {app.jobId?.location}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColor[app.status]}`}>{app.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
