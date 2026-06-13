import React from "react";

export default function About() {
  const chooseReasons = [
    {
      title: "Easy Project Posting",
      description: "Post projects and receive bids quickly.",
    },
    {
      title: "Skilled Student Freelancers",
      description: "Connect with talented students from different domains.",
    },
    {
      title: "Portfolio Building",
      description: "Gain experience and showcase completed projects.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-100 py-16 md:py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            About FreelanceBid
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            A platform that connects students with talented freelancers, making collaboration, project completion, and skill-building easier.
          </p>
        </div>
      </section>

      {/* Mission & Why Choose Content Section */}
      <section className="flex-grow py-16 px-6 max-w-5xl mx-auto w-full space-y-16">
        
        {/* Mission Card */}
        <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Our Mission
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            To help students gain practical experience, build portfolios, and collaborate on real-world projects through a trusted freelance marketplace.
          </p>
        </div>


      </section>

    </div>
  );
}
