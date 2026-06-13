import { Bell, BriefcaseBusiness, Gavel, LayoutDashboard, LogOut, Plus, UserRound, Search } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects/browse", label: "Browse Projects", icon: Search, roles: ["FREELANCER"] },
  { to: "/projects", label: "Projects", icon: BriefcaseBusiness, roles: ["CLIENT"] },
  { to: "/projects/new", label: "Post Project", icon: Plus, roles: ["CLIENT"] },
  { to: "/bids", label: "My Bids", icon: Gavel, roles: ["FREELANCER"] },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-cloud">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-stone-200 bg-white px-4 py-5 lg:block">
        <div className="mb-8">
          <div className="text-lg font-bold text-ink">Freelance Bid Portal</div>
          <div className="mt-1 text-xs uppercase tracking-wider text-moss">{user?.role}</div>
        </div>
        <nav className="space-y-1">
          {navItems
            .filter((item) => !item.roles || item.roles.includes(user?.role))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-moss text-white" : "text-stone-600 hover:bg-stone-100 hover:text-ink"
                  }`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
        </nav>
      </aside>

      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm text-stone-500">Hi, {user?.name}</div>
              <div className="font-semibold text-ink">Student freelance workspace</div>
            </div>
            <div className="flex items-center gap-2">
              {user?.role === "CLIENT" && (
                <button className="btn-primary" onClick={() => navigate("/projects/new")}>
                  <Plus size={17} />
                  Project
                </button>
              )}
              <button className="btn-secondary" onClick={handleLogout}>
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {navItems
              .filter((item) => !item.roles || item.roles.includes(user?.role))
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold ${
                      isActive ? "bg-moss text-white" : "bg-stone-100 text-stone-700"
                    }`
                  }
                >
                  <item.icon size={15} />
                  {item.label}
                </NavLink>
              ))}
          </nav>
        </header>
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
