import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getMessage } from "../lib/api";
import { Briefcase, Calendar, DollarSign, Tag, Users, X } from "lucide-react";

export default function BrowseProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  // Bid form state
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [proposal, setProposal] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bidSuccess, setBidSuccess] = useState("");
  const [bidError, setBidError] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/projects?status=open");
      setProjects(data.payload);
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenBidModal = (project) => {
    setSelectedProject(project);
    setBidAmount(project.budget); // prefill with project budget
    setEstimatedDays("7"); // default to 7 days
    setProposal("");
    setBidSuccess("");
    setBidError("");
  };

  const handleCloseBidModal = () => {
    setSelectedProject(null);
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setBidError("");
    setBidSuccess("");
    setSubmittingBid(true);

    try {
      await api.post("/api/bids", {
        projectId: selectedProject._id,
        bidAmount: Number(bidAmount),
        estimatedDays: Number(estimatedDays),
        proposal,
      });
      setBidSuccess("Your bid has been submitted successfully!");
      // Reload projects to update bid count
      loadProjects();
      setTimeout(() => {
        handleCloseBidModal();
      }, 1500);
    } catch (err) {
      setBidError(getMessage(err));
    } finally {
      setSubmittingBid(false);
    }
  };

  if (loading && projects.length === 0) {
    return <div className="p-8 text-center text-stone-500">Loading open projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Browse Projects</h1>
        <p className="text-sm text-stone-500">Discover projects posted by clients and place your bids.</p>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="panel p-8 text-center text-stone-500">
          No open projects available at the moment. Check back later!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div key={project._id} className="panel p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-bold text-ink hover:text-moss transition-colors">
                    {project.title}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
                    Open
                  </span>
                </div>

                <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <DollarSign size={14} className="text-stone-400" />
                    <div>
                      <span className="font-semibold text-stone-700">${project.budget}</span> (Budget)
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <Calendar size={14} className="text-stone-400" />
                    <div>
                      <span className="font-semibold text-stone-700">
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-600 col-span-2">
                    <Users size={14} className="text-stone-400" />
                    <div>
                      <span className="font-semibold text-stone-700">{project.bidCount ?? 0}</span> existing bid(s)
                    </div>
                  </div>
                </div>

                {/* Required Skills */}
                {project.skillsRequired && project.skillsRequired.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.skillsRequired.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600"
                      >
                        <Tag size={8} />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-stone-100">
                <Link
                  to={`/projects/${project._id}`}
                  className="btn-secondary flex-1 text-center py-2 text-xs"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleOpenBidModal(project)}
                  className="btn-primary flex-1 py-2 text-xs"
                >
                  Place Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Place Bid Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-lg border border-stone-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-ink">
                Place Bid on <span className="text-moss">{selectedProject.title}</span>
              </h2>
              <button
                onClick={handleCloseBidModal}
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">
                    Bid Amount ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-moss focus:ring-2 focus:ring-moss/10"
                    placeholder="50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">
                    Est. Delivery (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-moss focus:ring-2 focus:ring-moss/10"
                    placeholder="7"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1.5">
                  Proposal / Pitch Description
                </label>
                <textarea
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-moss focus:ring-2 focus:ring-moss/10 min-h-24"
                  placeholder="Describe why you are the best fit for this project..."
                  required
                />
              </div>

              {bidError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700">
                  {bidError}
                </div>
              )}

              {bidSuccess && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700">
                  {bidSuccess}
                </div>
              )}

              <div className="flex gap-3 pt-3 border-t border-stone-100 justify-end">
                <button
                  type="button"
                  onClick={handleCloseBidModal}
                  className="px-4 py-2 text-xs font-semibold text-stone-500 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBid}
                  className="px-4 py-2 text-xs font-semibold text-white bg-moss hover:bg-ink rounded-lg shadow-sm transition-colors disabled:opacity-60"
                >
                  {submittingBid ? "Submitting..." : "Submit Bid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
