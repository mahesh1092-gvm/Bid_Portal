import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { api } from "../lib/api";

export default function MyBidsPage() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    api.get("/bids/mine").then(({ data }) => setBids(data.payload));
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">My Bids</h1>
      <div className="panel overflow-hidden">
        {bids.map((bid) => (
          <Link key={bid._id} to={`/projects/${bid.projectId?._id}`} className="grid gap-3 border-b border-stone-200 p-4 last:border-b-0 md:grid-cols-[1fr_120px_120px]">
            <div>
              <div className="font-semibold text-ink">{bid.projectId?.title}</div>
              <div className="text-sm text-stone-500">{bid.estimatedDays} days estimated</div>
            </div>
            <div className="text-sm font-semibold">₹{bid.bidAmount}</div>
            <StatusBadge value={bid.status} />
          </Link>
        ))}
        {!bids.length && <div className="p-6 text-center text-sm text-stone-500">No bids submitted.</div>}
      </div>
    </div>
  );
}
