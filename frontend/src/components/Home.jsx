import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      title: "Browse Projects",
      description: "Explore academic, technical, and creative projects posted by peers to find the perfect fit.",
    },
    {
      title: "Post Projects",
      description: "List your tasks with clear requirements, budgets, and deadlines to attract top student talent.",
    },
    {
      title: "Find Freelancers",
      description: "Connect with skilled student freelancers ready to help you succeed in your next project.",
    },
    {
      title: "Manage Bids",
      description: "Review competitive offers, compare profiles, and select the perfect freelancer for your budget.",
    },
    {
      title: "Track Progress",
      description: "Monitor project milestones, communicate in real-time, and ensure high-quality delivery.",
    },
    {
      title: "Build Portfolio",
      description: "Showcase completed projects and reviews to gain credibility and win more work.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 bg-white border-b border-slate-100">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
            Freelance <span className="text-blue-600">Bid Portal</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-500 leading-relaxed">
            Connect students with talented freelancers. Post projects, receive bids, and collaborate efficiently.
          </p>

          <div className="pt-2">
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid Section */}
      <section className="flex-grow py-16 md:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto w-full px-6">
          
          {/* Section Heading */}
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Why Choose FreelanceBid?
            </h2>
            <p className="max-w-xl mx-auto text-slate-500 text-xs sm:text-sm leading-relaxed">
              Everything students need to collaborate, hire, and build experience.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3"
              >
                <h3 className="text-base font-bold text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
