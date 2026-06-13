import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { api } from "../lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ q: "", status: "", category: "", skill: "" });

  const loadProjects = async () => {
    const { data } = await api.get("/projects", { params: filters });
    setProjects(data.payload);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Projects</h1>
        <p className="text-sm text-stone-500">Browse, filter, bid, and track student work.</p>
      </div>
      <div className="panel grid gap-3 p-4 md:grid-cols-[1fr_160px_160px_160px_auto]">
        <input className="form-field" placeholder="Search projects" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <select className="form-field" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All status</option>
          <option value="open">Open</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In progress</option>
          <option value="submitted">Submitted</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input className="form-field" placeholder="Category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
        <input className="form-field" placeholder="Skill" value={filters.skill} onChange={(e) => setFilters({ ...filters, skill: e.target.value })} />
        <button className="btn-primary" onClick={loadProjects}><Search size={17} /> Search</button>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {projects.map((project) => <ProjectCard key={project._id} project={project} />)}
      </div>
      {!projects.length && <div className="panel p-6 text-center text-sm text-stone-500">No projects found.</div>}
    </div>
  );
}
