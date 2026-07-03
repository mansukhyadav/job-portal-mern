import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import JobCard from "../components/JobCard";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/jobs")
      .then(({ data }) => setJobs(data.jobs.slice(0, 6)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl mx-auto">
          Find your next role, or your next great hire
        </h1>
        <p className="text-gray-500 mt-4 max-w-lg mx-auto">
          A simple, focused job portal connecting job seekers with recruiters.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
          <Link to="/recruiter/post-job" className="btn-secondary">
            Post a Job
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Openings</h2>
        {loading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet. Be the first!</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
