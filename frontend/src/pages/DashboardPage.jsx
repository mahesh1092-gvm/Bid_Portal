import { useEffect, useState } from "react";
import { Activity, BriefcaseBusiness, CheckCircle2, Gavel, IndianRupee } from "lucide-react";
import { api } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import StatCard from "../components/StatCard";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    api.get("/auth/dashboard").then(({ data }) => setStats(data.payload));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-sm text-stone-500">{user?.role === "CLIENT" ? "Project activity and incoming bids." : "Bid activity and earned work."}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label={user?.role === "CLIENT" ? "Projects Posted" : "Assigned Projects"} value={stats?.totalProjectsPosted ?? "-"} icon={BriefcaseBusiness} />
        <StatCard label="Active Projects" value={stats?.activeProjects ?? "-"} icon={Activity} />
        <StatCard label="Total Bids" value={stats?.totalBids ?? "-"} icon={Gavel} />
        <StatCard label="Completed" value={stats?.completedProjects ?? "-"} icon={CheckCircle2} />
        <StatCard label="Earnings" value={`₹${stats?.earningsOverview ?? 0}`} icon={IndianRupee} />
      </div>
    </div>
  );
}
