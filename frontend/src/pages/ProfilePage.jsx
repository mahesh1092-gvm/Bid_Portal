import { useState } from "react";
import { ExternalLink, Github, Linkedin, Save, Star } from "lucide-react";
import { api, getMessage } from "../lib/api";
import { useAuthStore } from "../store/authStore";

const initials = (name = "") => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    githubUrl: user?.githubUrl || "",
    linkedinUrl: user?.linkedinUrl || "",
    portfolioUrl: user?.portfolioUrl || "",
    education: user?.education || "",
    skills: user?.skills?.join(", ") || "",
    profileImage: null,
  });
  const [message, setMessage] = useState("");

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });
      const { data } = await api.put("/api/auth/profile", payload);
      setUser(data.payload);
      setMessage("Profile updated.");
    } catch (err) {
      setMessage(getMessage(err));
    }
  };

  const links = [
    { label: "GitHub", href: user?.githubUrl, icon: Github },
    { label: "LinkedIn", href: user?.linkedinUrl, icon: Linkedin },
    { label: "Portfolio", href: user?.portfolioUrl, icon: ExternalLink },
  ].filter((link) => link.href);

  return (
    <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
      <aside className="panel p-5">
        <div className="flex items-center gap-4">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="h-20 w-20 rounded-md object-cover" />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-md bg-moss text-xl font-bold text-white">{initials(user?.name)}</div>
          )}
          <div>
            <div className="font-semibold text-ink">{user?.name}</div>
            <div className="text-sm text-stone-500">{user?.role}</div>
            <div className="mt-1 inline-flex items-center gap-1 text-sm text-gold"><Star size={15} /> {user?.rating || 0} ({user?.totalReviews || 0})</div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-stone-200 p-3"><b>{user?.completedProjects || 0}</b><br />Completed</div>
          <div className="rounded-md border border-stone-200 p-3"><b>{user?.reliabilityScore ?? 100}%</b><br />Reliable</div>
        </div>
        {!!links.length && (
          <div className="mt-5 space-y-2">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="btn-secondary w-full">
                <link.icon size={16} /> {link.label}
              </a>
            ))}
          </div>
        )}
      </aside>
      <form className="panel space-y-4 p-5" onSubmit={submit}>
        <h1 className="text-2xl font-bold text-ink">Profile</h1>
        <input className="form-field" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" required />
        <input className="form-field" type="file" accept="image/*" onChange={(e) => update("profileImage", e.target.files?.[0] || null)} />
        <textarea className="form-field min-h-28" placeholder="Bio / About me" value={form.bio} onChange={(e) => update("bio", e.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="form-field" placeholder="GitHub URL" value={form.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} />
          <input className="form-field" placeholder="LinkedIn URL" value={form.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} />
        </div>
        <input className="form-field" placeholder="Portfolio website URL" value={form.portfolioUrl} onChange={(e) => update("portfolioUrl", e.target.value)} />
        <input className="form-field" placeholder="Education" value={form.education} onChange={(e) => update("education", e.target.value)} />
        <input className="form-field" placeholder="Skills, comma separated" value={form.skills} onChange={(e) => update("skills", e.target.value)} />
        {message && <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700">{message}</div>}
        <button className="btn-primary"><Save size={17} /> Save profile</button>
      </form>
    </div>
  );
}
