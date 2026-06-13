import { useEffect, useState } from "react";
import { ExternalLink, Github, Linkedin, Star } from "lucide-react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";

const initials = (name = "") => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export default function FreelancerProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get(`/auth/users/${id}`).then(({ data }) => setProfile(data.payload));
  }, [id]);

  if (!profile) return <div className="text-sm text-stone-500">Loading profile...</div>;

  const { user, reviews } = profile;
  const links = [
    { label: "GitHub", href: user.githubUrl, icon: Github },
    { label: "LinkedIn", href: user.linkedinUrl, icon: Linkedin },
    { label: "Portfolio", href: user.portfolioUrl, icon: ExternalLink },
  ].filter((link) => link.href);

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <aside className="panel p-5">
        <div className="flex items-center gap-4">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="h-24 w-24 rounded-md object-cover" />
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-md bg-moss text-2xl font-bold text-white">{initials(user.name)}</div>
          )}
          <div>
            <h1 className="text-xl font-bold text-ink">{user.name}</h1>
            <p className="text-sm text-stone-500">{user.education || "Student freelancer"}</p>
            <div className="mt-1 inline-flex items-center gap-1 text-sm text-gold"><Star size={15} /> {user.rating || 0} ({user.totalReviews || 0})</div>
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-stone-700">{user.bio || "No bio added yet."}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-stone-200 p-3"><b>{user.completedProjects || 0}</b><br />Completed</div>
          <div className="rounded-md border border-stone-200 p-3"><b>{user.reliabilityScore ?? 100}%</b><br />Reliability</div>
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

      <section className="space-y-5">
        <div className="panel p-5">
          <h2 className="font-semibold text-ink">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {user.skills?.length ? user.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-700">{skill}</span>
            )) : <span className="text-sm text-stone-500">No skills added.</span>}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="font-semibold text-ink">Portfolio Projects</h2>
          <div className="mt-3 space-y-3">
            {user.portfolio?.length ? user.portfolio.map((item) => (
              <a key={item._id || item.title} href={item.url || "#"} target="_blank" rel="noreferrer" className="block rounded-md border border-stone-200 p-3">
                <div className="font-semibold text-ink">{item.title}</div>
                <p className="text-sm text-stone-600">{item.description}</p>
              </a>
            )) : <p className="text-sm text-stone-500">No portfolio projects added.</p>}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="font-semibold text-ink">Reviews</h2>
          <div className="mt-3 space-y-3">
            {reviews.length ? reviews.map((review) => (
              <div key={review._id} className="rounded-md border border-stone-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <b>{review.reviewerId?.name || "Reviewer"}</b>
                  <span className="inline-flex items-center gap-1 text-sm text-gold"><Star size={14} /> {review.rating}</span>
                </div>
                <p className="mt-2 text-sm text-stone-600">{review.comment}</p>
                <p className="mt-1 text-xs text-stone-500">{review.projectId?.title}</p>
              </div>
            )) : <p className="text-sm text-stone-500">No reviews yet.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
