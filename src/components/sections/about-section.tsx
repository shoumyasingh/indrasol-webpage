import React from "react";
import { MapPin, Users, Clock, Award, ChevronRight } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      {/* Modern background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-indrasol-gray/30"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indrasol-blue/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indrasol-orange/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="inline-block text-indrasol-blue font-semibold mb-2 bg-indrasol-blue/10 px-4 py-1 rounded-full">Our Story</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">About </span>
            <span className="text-indrasol-blue">Indrasol</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/lovable-uploads/offering.png" 
                alt="Indrasol team working together" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-indrasol-blue/30 to-transparent opacity-60"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indrasol-orange/20 rounded-2xl z-0 transform rotate-12"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 border-4 border-indrasol-blue/10 rounded-2xl z-0"></div>
          </div>
          
          <div className="lg:col-span-7 space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-gray-700">
                Founded in 2010, Indrasol is a global provider of consulting, implementation, and support services for the Oracle solution stack, data analytics, and business intelligence. We also provide comprehensive cloud consulting services.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                With over a decade of experience, our team of experts help organizations cut costs while dramatically improving performance. Our passion for service and commitment to delivering great value defines our approach to client relationships.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indrasol-blue/10 rounded-xl group-hover:bg-indrasol-blue/20 transition-colors duration-300">
                    <MapPin className="h-6 w-6 text-indrasol-blue" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900">Global Presence</h3>
                    <p className="text-gray-700 mt-1">Offices in US, Singapore & India</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indrasol-blue/10 rounded-xl group-hover:bg-indrasol-blue/20 transition-colors duration-300">
                    <Users className="h-6 w-6 text-indrasol-blue" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900">Team Size</h3>
                    <p className="text-gray-700 mt-1">51-200 employees</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indrasol-blue/10 rounded-xl group-hover:bg-indrasol-blue/20 transition-colors duration-300">
                    <Clock className="h-6 w-6 text-indrasol-blue" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900">Established</h3>
                    <p className="text-gray-700 mt-1">Founded in 2010</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indrasol-blue/10 rounded-xl group-hover:bg-indrasol-blue/20 transition-colors duration-300">
                    <Award className="h-6 w-6 text-indrasol-blue" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900">Expertise</h3>
                    <p className="text-gray-700 mt-1">Decades of experience</p>
                  </div>
                </div>
              </div>
            </div>
            
            <a href="/about" className="inline-flex items-center text-indrasol-blue font-medium mt-6 group">
              Learn more about our journey 
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}