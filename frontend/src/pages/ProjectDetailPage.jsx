import { useEffect, useState } from "react";
import { Check, Eye, Gavel, IndianRupee, Play, Send, Star, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { api, getMessage } from "../lib/api";
import { useAuthStore } from "../store/authStore";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidForm, setBidForm] = useState({ bidAmount: "", estimatedDays: "", proposal: "" });
  const [workForm, setWorkForm] = useState({ url: "", note: "" });
  const [revisionMessage, setRevisionMessage] = useState("");
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [message, setMessage] = useState("");

  const loadProject = async () => {
    const { data } = await api.get(`/api/projects/${id}`);
    setProject(data.payload.project);
    setBids(data.payload.bids);
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const submitBid = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await api.post("/api/bids", { ...bidForm, projectId: id });
      setBidForm({ bidAmount: "", estimatedDays: "", proposal: "" });
      setMessage("Bid submitted.");
      loadProject();
    } catch (err) {
      setMessage(getMessage(err));
    }
  };

  const updateBidStatus = async (bidId, status) => {
    await api.patch(`/api/bids/${bidId}/status`, { status });
    loadProject();
  };

  const startProject = async () => {
    await api.patch(`/api/projects/${id}/start`);
    loadProject();
  };

  const submitWork = async (event) => {
    event.preventDefault();
    await api.patch(`/api/projects/${id}/submit`, workForm);
    setWorkForm({ url: "", note: "" });
    loadProject();
  };

  const requestRevision = async () => {
    await api.patch(`/api/projects/${id}/request-revision`, { message: revisionMessage });
    setRevisionMessage("");
    loadProject();
  };

  const completeProject = async () => {
    await api.patch(`/api/projects/${id}/complete`);
    loadProject();
  };

  const submitReview = async (event) => {
    event.preventDefault();
    const receiverId = user.role === "CLIENT" ? project.selectedFreelancerId?._id : project.clientId?._id;
    await api.post("/api/reviews", { projectId: id, receiverId, ...review });
    setMessage("Review submitted.");
  };

  if (!project) return <div className="text-sm text-stone-500">Loading...</div>;

  const isClientOwner = user.role === "CLIENT" && project.clientId?._id === user._id;
  const isSelectedFreelancer = user.role === "FREELANCER" && project.selectedFreelancerId?._id === user._id;
  const canBid = user.role === "FREELANCER" && project.status === "open";
  const canReview = project.status === "completed" && [project.clientId?._id, project.selectedFreelancerId?._id].includes(user._id);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_440px]">
      <section className="space-y-5">
        <div className="panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-ink">{project.title}</h1>
              <p className="mt-1 text-sm text-stone-500">By {project.clientId?.name}</p>
            </div>
            <StatusBadge value={project.status} />
          </div>
          <p className="mt-5 whitespace-pre-line text-sm leading-6 text-stone-700">{project.description}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-stone-200 p-3 text-sm"><b>Budget</b><br />Rs. {project.budget}</div>
            <div className="rounded-md border border-stone-200 p-3 text-sm"><b>Deadline</b><br />{new Date(project.deadline).toLocaleDateString()}</div>
            <div className="rounded-md border border-stone-200 p-3 text-sm"><b>Category</b><br />{project.category}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.skillsRequired?.map((skill) => <span className="rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-700" key={skill}>{skill}</span>)}
          </div>

          {isSelectedFreelancer && project.status === "assigned" && (
            <button className="btn-primary mt-5" onClick={startProject}><Play size={17} /> Start work</button>
          )}
        </div>

        {isSelectedFreelancer && ["assigned", "in_progress"].includes(project.status) && (
          <form className="panel space-y-3 p-5" onSubmit={submitWork}>
            <h2 className="font-semibold text-ink">Submit Completed Work</h2>
            {project.submittedWork?.revisionMessage && <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{project.submittedWork.revisionMessage}</div>}
            <input className="form-field" placeholder="Work URL" value={workForm.url} onChange={(e) => setWorkForm({ ...workForm, url: e.target.value })} />
            <textarea className="form-field" placeholder="Submission note" value={workForm.note} onChange={(e) => setWorkForm({ ...workForm, note: e.target.value })} />
            <button className="btn-primary"><Send size={17} /> Submit work</button>
          </form>
        )}

        {isClientOwner && project.status === "submitted" && (
          <div className="panel space-y-3 p-5">
            <h2 className="font-semibold text-ink">Review Submitted Work</h2>
            {project.submittedWork?.url && <a className="text-sm font-semibold text-moss underline" href={project.submittedWork.url} target="_blank" rel="noreferrer">Open submitted work</a>}
            <p className="text-sm text-stone-600">{project.submittedWork?.note}</p>
            <textarea className="form-field" placeholder="Revision message" value={revisionMessage} onChange={(e) => setRevisionMessage(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" onClick={completeProject}><Check size={17} /> Approve completion</button>
              <button className="btn-secondary" onClick={requestRevision}><X size={17} /> Request revision</button>
            </div>
          </div>
        )}

        {canReview && (
          <form className="panel space-y-3 p-5" onSubmit={submitReview}>
            <h2 className="font-semibold text-ink">Rate participant</h2>
            <select className="form-field" value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
            </select>
            <textarea className="form-field" placeholder="Comment" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
            <button className="btn-primary"><Star size={17} /> Submit review</button>
          </form>
        )}
      </section>

      <aside className="space-y-5">
        {canBid && (
          <form className="panel space-y-3 p-5" onSubmit={submitBid}>
            <h2 className="font-semibold text-ink">Submit Bid</h2>
            <input className="form-field" type="number" min="1" placeholder="Bid amount" value={bidForm.bidAmount} onChange={(e) => setBidForm({ ...bidForm, bidAmount: e.target.value })} required />
            <input className="form-field" type="number" min="1" placeholder="Estimated days" value={bidForm.estimatedDays} onChange={(e) => setBidForm({ ...bidForm, estimatedDays: e.target.value })} required />
            <textarea className="form-field" placeholder="Proposal" value={bidForm.proposal} onChange={(e) => setBidForm({ ...bidForm, proposal: e.target.value })} required />
            <button className="btn-primary"><Gavel size={17} /> Place bid</button>
          </form>
        )}
        {message && <div className="panel p-3 text-sm text-stone-700">{message}</div>}
        <div className="panel p-5">
          <h2 className="font-semibold text-ink">Bids</h2>
          <div className="mt-4 space-y-3">
            {bids.map((bid) => (
              <div key={bid._id} className="rounded-md border border-stone-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/freelancers/${bid.freelancerId?._id}`} className="font-semibold text-ink hover:text-moss">
                      {bid.freelancerId?.name}
                    </Link>
                    <div className="mt-1 inline-flex items-center gap-1 text-sm text-stone-600"><IndianRupee size={14} /> {bid.bidAmount} · {bid.estimatedDays} days</div>
                  </div>
                  <StatusBadge value={bid.status} />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {bid.freelancerId?.skills?.slice(0, 4).map((skill) => <span key={skill} className="rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-700">{skill}</span>)}
                </div>
                <p className="mt-2 text-sm text-stone-600">{bid.proposal}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to={`/freelancers/${bid.freelancerId?._id}`} className="btn-secondary"><Eye size={16} /> View profile</Link>
                  {isClientOwner && project.status === "open" && bid.status === "pending" && (
                    <>
                      <button className="btn-primary" onClick={() => updateBidStatus(bid._id, "accepted")}><Check size={16} /> Accept</button>
                      <button className="btn-secondary" onClick={() => updateBidStatus(bid._id, "rejected")}><X size={16} /> Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {!bids.length && <p className="text-sm text-stone-500">No bids yet.</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}
