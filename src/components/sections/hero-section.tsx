import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Modern background with gradient and blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-indrasol-gray opacity-80"></div>
      
      {/* Decorative shapes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indrasol-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indrasol-blue/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">Transforming Organizations with</span>
              <span className="text-indrasol-blue block mt-1">Cloud & Data Expertise</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
              Indrasol delivers consulting, implementation and support services for Oracle solutions, cloud platforms, and data analytics that drive business value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link 
                to="/contact" 
                className="group px-6 py-3 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-all duration-300 inline-flex items-center justify-center shadow-lg shadow-indrasol-blue/20"
              >
                Request Consultation 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 stroke-2" />
              </Link>
              <Link 
                to="/#services" 
                className="px-6 py-3 border-2 border-indrasol-blue text-indrasol-blue bg-white/80 backdrop-blur-sm rounded-lg hover:bg-indrasol-blue/10 transition-colors inline-flex items-center justify-center"
              >
                Explore Services
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              {/* Multiple layered effect for depth */}
              <div className="absolute inset-0 bg-indrasol-blue/5 rounded-2xl transform rotate-3 scale-105"></div>
              <div className="absolute inset-0 bg-indrasol-blue/10 rounded-2xl transform -rotate-2"></div>
              
              {/* Main image with enhanced styling */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="/public/lovable-uploads/indrasol_hero1.png" 
                  alt="Business professionals working on technology solutions" 
                  className="w-full transition-transform duration-700 hover:scale-105"
                />
                
                {/* Modern overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-indrasol-blue/20 to-transparent opacity-70"></div>
              </div>
              
              {/* Floating accent element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-xl shadow-xl flex items-center justify-center transform rotate-12">
                <div className="w-16 h-16 bg-indrasol-blue/20 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-indrasol-blue rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}