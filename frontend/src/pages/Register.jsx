import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getMessage } from "../lib/api";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "CLIENT",
  bio: "",
  githubUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
  skills: "",
  education: "",
  profileImage: null,
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const update = (e) => {
    const name = e.target.name === "register_email" ? "email" : (e.target.name === "register_password" ? "password" : e.target.name);
    setForm((curr) => ({ ...curr, [name]: e.target.value }));
  };
  const updateFile = (e) => setForm((curr) => ({ ...curr, profileImage: e.target.files?.[0] || null }));

  const buildRegisterPayload = () => {
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(buildRegisterPayload());
      await login({ email: form.email, password: form.password });
      navigate("/");
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-stone-50 rounded-2xl shadow-sm border border-stone-100">
      <h2 className="text-2xl font-bold text-stone-900 text-center mb-6">Create an Account</h2>
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={update}
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">Select ROLE</label>
            <select
              name="role"
              value={form.role}
              onChange={update}
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              required
            >
              <option value="CLIENT">Client (Post Projects)</option>
              <option value="FREELANCER">Freelancer (Bid on Projects)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">Email Address</label>
            <input
              type="email"
              name="register_email"
              autoComplete="off"
              value={form.email}
              onChange={update}
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">Password</label>
            <input
              type="password"
              name="register_password"
              autoComplete="new-password"
              value={form.password}
              onChange={update}
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={updateFile}
            className="w-full text-xs text-stone-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">Bio / About yourself</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={update}
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 min-h-20"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">GitHub URL</label>
            <input
              type="url"
              name="githubUrl"
              value={form.githubUrl}
              onChange={update}
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              placeholder="GitHub URL"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">LinkedIn URL</label>
            <input
              type="url"
              name="linkedinUrl"
              value={form.linkedinUrl}
              onChange={update}
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              placeholder="LinkedIn URL"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">Portfolio Website</label>
            <input
              type="url"
              name="portfolioUrl"
              value={form.portfolioUrl}
              onChange={update}
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              placeholder="Portfolio URL"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">Education</label>
            <input
              type="text"
              name="education"
              value={form.education}
              onChange={update}
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              placeholder="Education"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">Skills</label>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={update}
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            placeholder=" Skills"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#0070f3] hover:bg-[#0051cb] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <div className="mt-6 text-center text-xs text-stone-500">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
          Log in here
        </Link>
      </div>
    </div>
  );
}
