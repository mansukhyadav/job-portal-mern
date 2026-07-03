import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <Link to={`/jobs/${job._id}`} className="card hover:shadow-md transition-shadow block">
      <div className="flex items-start gap-4">
        <img
          src={job.recruiterId?.companyLogo || "https://api.dicebear.com/7.x/initials/svg?seed=" + (job.recruiterId?.companyName || "Company")}
          alt={job.recruiterId?.companyName}
          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
          <p className="text-sm text-gray-500">{job.recruiterId?.companyName || "Confidential"}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded-full">{job.location}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{job.type}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{job.level}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-semibold text-gray-900">₹{job.salary?.toLocaleString()}</p>
          <p className="text-xs text-gray-400">/year</p>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
