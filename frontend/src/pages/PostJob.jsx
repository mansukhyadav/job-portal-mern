import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";

const initialState = {
  title: "",
  description: "",
  location: "",
  category: "",
  level: "Entry Level",
  type: "Full-time",
  salary: "",
  skillsRequired: "",
};

const PostJob = () => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/jobs", form);
      toast.success("Job posted successfully!");
      navigate("/recruiter/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <input
          className="input-field"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          className="input-field"
          name="description"
          placeholder="Job Description"
          rows={5}
          value={form.description}
          onChange={handleChange}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            className="input-field"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            name="category"
            placeholder="Category (e.g. Engineering)"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <select className="input-field" name="level" value={form.level} onChange={handleChange}>
            <option>Internship</option>
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior Level</option>
          </select>
          <select className="input-field" name="type" value={form.type} onChange={handleChange}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
          <input
            className="input-field"
            name="salary"
            type="number"
            placeholder="Salary (₹/yr)"
            value={form.salary}
            onChange={handleChange}
            required
          />
        </div>
        <input
          className="input-field"
          name="skillsRequired"
          placeholder="Skills required, comma separated"
          value={form.skillsRequired}
          onChange={handleChange}
        />
        <button className="btn-primary w-full" type="submit" disabled={submitting}>
          {submitting ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
