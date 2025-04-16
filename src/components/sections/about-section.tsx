
import React from "react";
import { MapPin, Users, Clock, Award } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-indrasol-gray">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
              alt="Indrasol team working together" 
              className="rounded-lg shadow-xl w-full"
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Indrasol</h2>
            <p className="text-lg text-gray-700">
              Founded in 2010, Indrasol is a global provider of consulting, implementation, and support services for the Oracle solution stack, data analytics, and business intelligence. We also provide comprehensive cloud consulting services.
            </p>
            <p className="text-lg text-gray-700">
              With over a decade of experience, our team of experts help organizations cut costs while dramatically improving performance. Our passion for service and commitment to delivering great value defines our approach to client relationships.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-indrasol-blue mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Global Presence</h3>
                  <p className="text-gray-700">Offices in US, Singapore & India</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-indrasol-blue mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Team Size</h3>
                  <p className="text-gray-700">51-200 employees</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-indrasol-blue mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Established</h3>
                  <p className="text-gray-700">Founded in 2010</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-indrasol-blue mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Expertise</h3>
                  <p className="text-gray-700">Decades of experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
