import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { useProfile } from "../context/UserContext";

const Profile = () => {
  const { profile, refreshProfile } = useProfile();
  const [form, setForm] = useState({ role: "seeker", bio: "", skills: "", companyName: "", companyWebsite: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        role: profile.role || "seeker",
        bio: profile.bio || "",
        skills: (profile.skills || []).join(", "),
        companyName: profile.companyName || "",
        companyWebsite: profile.companyWebsite || "",
      });
    }
  }, [profile]);

  if (!profile) return <p className="text-center py-20 text-gray-500">Loading...</p>;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/users/me", form);
      toast.success("Profile updated");
      refreshProfile();
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      await api.post("/api/users/me/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume uploaded");
      refreshProfile();
      setResumeFile(null);
    } catch (err) {
      toast.error("Failed to upload resume");
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    const formData = new FormData();
    formData.append("logo", logoFile);
    try {
      await api.post("/api/users/me/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Logo uploaded");
      refreshProfile();
      setLogoFile(null);
    } catch (err) {
      toast.error("Failed to upload logo");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

      <form onSubmit={handleSave} className="card space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">I am a</label>
          <div className="flex gap-3">
            {["seeker", "recruiter"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setForm({ ...form, role: r })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  form.role === r ? "bg-brand-500 text-white border-brand-500" : "bg-white text-gray-600 border-gray-300"
                }`}
              >
                {r === "seeker" ? "Job Seeker" : "Recruiter"}
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="input-field"
          placeholder="Short bio"
          rows={3}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        {form.role === "seeker" ? (
          <>
            <input
              className="input-field"
              placeholder="Skills, comma separated"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
            <div className="border border-dashed border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                Resume: {profile.resume ? <a href={profile.resume} target="_blank" rel="noreferrer" className="text-brand-500 underline">View current</a> : "None uploaded"}
              </p>
              <input type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
              <button type="button" onClick={handleResumeUpload} className="btn-secondary text-sm ml-2">
                Upload
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              className="input-field"
              placeholder="Company name"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
            <input
              className="input-field"
              placeholder="Company website"
              value={form.companyWebsite}
              onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
            />
            <div className="border border-dashed border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                Company logo: {profile.companyLogo ? <img src={profile.companyLogo} className="w-10 h-10 inline-block rounded ml-2" alt="" /> : "None uploaded"}
              </p>
              <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
              <button type="button" onClick={handleLogoUpload} className="btn-secondary text-sm ml-2">
                Upload
              </button>
            </div>
          </>
        )}

        <button className="btn-primary w-full" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
