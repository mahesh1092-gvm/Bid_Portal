import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white text-stone-800 font-sans flex flex-col justify-between">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-stone-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-stone-700 tracking-tight">
            FreelanceBid
          </Link>
          <nav className="flex items-center gap-6 text-xs font-medium text-stone-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/login" className="hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-blue-600 transition-colors">
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-10 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-stone-400">
            &copy; 2026 Freelance Bid Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
