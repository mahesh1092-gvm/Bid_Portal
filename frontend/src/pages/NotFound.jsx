import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto my-24 text-center px-6 space-y-6">
      <h1 className="text-6xl font-extrabold text-stone-300">404</h1>
      <h2 className="text-2xl font-bold text-stone-900">Page Not Found</h2>
      <p className="text-stone-500 text-sm leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="pt-4">
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-[#0070f3] hover:bg-[#0051cb] text-white text-xs font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
