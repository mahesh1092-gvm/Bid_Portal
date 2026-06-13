import { useState } from "react";
import { BriefcaseBusiness, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMessage } from "../lib/api";
import { useAuthStore } from "../store/authStore";

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

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateFile = (event) => setForm((current) => ({ ...current, profileImage: event.target.files?.[0] || null }));

  const buildRegisterPayload = () => {
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });
    return payload;
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await register(buildRegisterPayload());
      }
      await login({ email: form.email, password: form.password });
      navigate("/");
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cloud px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_460px]">
        <section className="min-h-[calc(100vh-4rem)] rounded-lg border border-stone-200 bg-cover bg-center p-8 text-white">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-ink/75 px-3 py-2 text-sm font-semibold">
              <BriefcaseBusiness size={18} />
              Freelance Bid Portal
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">Freelance Bid Portal</h1>
            <p className="mt-4 max-w-xl text-base text-white/90">
              Student projects, service bids, submissions, ratings, and reliability tracking in one workspace.
            </p>
          </div>
        </section>

        <section className="panel self-start p-5">
          <div className="mb-5 grid grid-cols-2 rounded-md bg-stone-100 p-1">
            <button className={`rounded px-3 py-2 text-sm font-semibold ${mode === "login" ? "bg-white shadow-sm" : ""}`} onClick={() => setMode("login")}>
              Login
            </button>
            <button className={`rounded px-3 py-2 text-sm font-semibold ${mode === "register" ? "bg-white shadow-sm" : ""}`} onClick={() => setMode("register")}>
              Register
            </button>
          </div>

          <form className="space-y-3" onSubmit={submit}>
            {mode === "register" && (
              <>
                <input className="form-field" name="name" placeholder="Full name" value={form.name} onChange={update} required />
                <select className="form-field" name="role" value={form.role} onChange={update} required>
                  <option value="CLIENT">Client</option>
                  <option value="FREELANCER">Freelancer</option>
                </select>
              </>
            )}
            <input className="form-field" name="email" type="email" placeholder="Email" value={form.email} onChange={update} required />
            <input className="form-field" name="password" type="password" placeholder="Password" value={form.password} onChange={update} required />
            {mode === "register" && (
              <>
                <input className="form-field" type="file" accept="image/*" onChange={updateFile} />
                <textarea className="form-field min-h-20" name="bio" placeholder="Bio / About me" value={form.bio} onChange={update} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="form-field" name="githubUrl" placeholder="GitHub URL" value={form.githubUrl} onChange={update} />
                  <input className="form-field" name="linkedinUrl" placeholder="LinkedIn URL" value={form.linkedinUrl} onChange={update} />
                </div>
                <input className="form-field" name="portfolioUrl" placeholder="Portfolio website URL" value={form.portfolioUrl} onChange={update} />
                <input className="form-field" name="skills" placeholder="Skills, comma separated" value={form.skills} onChange={update} />
                <input className="form-field" name="education" placeholder="Education" value={form.education} onChange={update} />
              </>
            )}
            {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
            <button className="btn-primary w-full" disabled={loading}>
              {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
