import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

// Components
import Layout from "./components/Layout";
import PublicLayout from "./components/PublicLayout";
import Home from "./components/Home";

// Pages
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage"; // Authenticated projects page
import BrowseProjects from "./pages/BrowseProjects";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectFormPage from "./pages/ProjectFormPage";
import ProfilePage from "./pages/ProfilePage";
//import NotificationsPage from "./pages/NotificationsPage";
import MyBidsPage from "./pages/MyBidsPage";
import FreelancerProfilePage from "./pages/FreelancerProfilePage";

// New Public Pages
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  if (loading) return <div className="p-8 text-sm text-stone-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuthStore();
  if (loading) return <div className="p-8 text-sm text-stone-500">Loading...</div>;
  if (user) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { user, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) return <div className="p-8 text-sm text-stone-500">Loading...</div>;

  return (
    <Routes>
      {/* Root Route and Main Layouts based on Authentication state */}
      {user ? (
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/browse" element={<BrowseProjects />} />
          <Route path="projects/new" element={<ProjectFormPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="bids" element={<MyBidsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="freelancers/:id" element={<FreelancerProfilePage />} />
          {/* <Route path="notifications" element={<NotificationsPage />} /> */}
        </Route>
      ) : (
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />
        </Route>
      )}

      {/* Guest Fallback redirects */}
      {!user && (
        <>
          <Route path="/projects" element={<Navigate to="/login" replace />} />
          <Route path="/projects/browse" element={<Navigate to="/login" replace />} />
          <Route path="/projects/new" element={<Navigate to="/login" replace />} />
          <Route path="/projects/:id" element={<Navigate to="/login" replace />} />
          <Route path="/bids" element={<Navigate to="/login" replace />} />
          <Route path="/profile" element={<Navigate to="/login" replace />} />
          <Route path="/freelancers/:id" element={<Navigate to="/login" replace />} />
          {/* <Route path="/notifications" element={<Navigate to="/login" replace />} /> */}
        </>
      )}

      {/* Legacy /auth Redirect */}
      <Route path="/auth" element={<Navigate to={user ? "/" : "/login"} replace />} />

      {/* 404 Route */}
      <Route path="*" element={<PublicLayout />}>
        <Route index element={<NotFound />} />
      </Route>
    </Routes>
  );
}
