import React from "react";
import { MapPin, Clock, Award, ChevronRight, Users, Settings } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      {/* Modern background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-indrasol-gray/20"></div>
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-indrasol-blue/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-indrasol-orange/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-indrasol-blue font-semibold mb-2 bg-indrasol-blue/10 px-4 py-1 rounded-full">Our Story</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">About </span>
            <span className="text-indrasol-blue">Indrasol</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We deliver innovative IT solutions that drive business transformation and growth.
          </p>
        </div>
        
        <div className="max-w-8xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-10">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-gray-700">
                Founded in 2010, Indrasol is a global provider of consulting, implementation, and support services for the Oracle solution stack, data analytics, and business intelligence. We also provide comprehensive cloud consulting services.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                With over a decade of experience, our team of experts help organizations cut costs while dramatically improving performance. Our passion for service and commitment to delivering great value defines our approach to client relationships.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <div className="p-4 bg-indrasol-blue/10 rounded-xl mb-4 inline-block group-hover:bg-indrasol-blue/20 transition-colors duration-300">
                  <MapPin className="h-8 w-8 text-indrasol-blue" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Global Presence</h3>
                <p className="text-gray-700">Offices in USA, Mexico, Singapore & India</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <div className="p-4 bg-indrasol-blue/10 rounded-xl mb-4 inline-block group-hover:bg-indrasol-blue/20 transition-colors duration-300">
                  <Clock className="h-8 w-8 text-indrasol-blue" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Established</h3>
                <p className="text-gray-700">Founded in 2010</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <div className="p-4 bg-indrasol-blue/10 rounded-xl mb-4 inline-block group-hover:bg-indrasol-blue/20 transition-colors duration-300">
                  <Award className="h-8 w-8 text-indrasol-blue" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Expertise</h3>
                <p className="text-gray-700">Decades of experience</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href="/about" 
              className="inline-flex items-center bg-indrasol-blue text-white font-medium px-8 py-3 rounded-xl shadow-lg shadow-indrasol-blue/20 hover:bg-indrasol-blue/90 transition-colors group"
            >
              Learn more about our journey 
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}