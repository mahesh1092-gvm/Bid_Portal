import { Calendar, IndianRupee, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project._id}`} className="panel block p-4 transition hover:border-moss hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink">{project.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-stone-600">{project.description}</p>
        </div>
        <StatusBadge value={project.status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.skillsRequired?.slice(0, 4).map((skill) => (
          <span key={skill} className="rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-700">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-4 grid gap-2 text-sm text-stone-600 sm:grid-cols-3">
        <span className="inline-flex items-center gap-1">
          <IndianRupee size={15} /> {project.budget}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar size={15} /> {new Date(project.deadline).toLocaleDateString()}
        </span>
        <span className="inline-flex items-center gap-1">
          <UserRound size={15} /> {project.clientId?.name || "Client"}
        </span>
      </div>
    </Link>
  );
}
