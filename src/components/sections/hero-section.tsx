
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-white to-indrasol-gray">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Transforming Organizations with Cloud & Data Expertise
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
              Indrasol delivers consulting, implementation and support services for Oracle solutions, cloud platforms, and data analytics that drive business value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                to="/contact" 
                className="px-6 py-3 bg-indrasol-blue text-white rounded-md hover:bg-indrasol-darkblue transition-colors inline-flex items-center justify-center"
              >
                Request Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/#services" 
                className="px-6 py-3 border border-indrasol-blue text-indrasol-blue rounded-md hover:bg-indrasol-gray transition-colors inline-flex items-center justify-center"
              >
                Explore Services
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-indrasol-blue/10 rounded-lg transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
                alt="Business professionals working on technology solutions" 
                className="rounded-lg shadow-xl relative z-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
