import { useState } from "react";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, getMessage } from "../lib/api";

export default function ProjectFormPage() {
  const [form, setForm] = useState({ title: "", description: "", budget: "", deadline: "", category: "", skillsRequired: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/api/projects", form);
      navigate(`/projects/${data.payload._id}`);
    } catch (err) {
      setError(getMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <h1 className="text-2xl font-bold text-ink">Post Project</h1>
      <form className="panel space-y-4 p-5" onSubmit={submit}>
        <input className="form-field" name="title" placeholder="Title" value={form.title} onChange={update} required />
        <textarea className="form-field min-h-32" name="description" placeholder="Description" value={form.description} onChange={update} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="form-field" name="budget" type="number" min="1" placeholder="Budget" value={form.budget} onChange={update} required />
          <input className="form-field" name="deadline" type="date" value={form.deadline} onChange={update} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="form-field" name="category" placeholder="Category" value={form.category} onChange={update} />
          <input className="form-field" name="skillsRequired" placeholder="Skills required" value={form.skillsRequired} onChange={update} />
        </div>
        {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
        <button className="btn-primary"><Save size={17} /> Save project</button>
      </form>
    </div>
  );
}
