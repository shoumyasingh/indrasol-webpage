
import React from "react";

const clients = [
  "Oracle",
  "Microsoft",
  "AWS",
  "Google Cloud",
  "PeopleSoft",
  "Hyperion",
  "JD Edwards",
  "Azure"
];

export function ClientsSection() {
  return (
    <section className="py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trusted by Industry Leaders</h2>
          <p className="text-gray-600 mt-2">
            We work with the world's leading technology platforms
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {clients.map((client, index) => (
            <div 
              key={index}
              className="flex items-center justify-center px-6 py-3 bg-gray-50 rounded-lg shadow-sm hover:shadow transition-shadow"
            >
              <span className="text-indrasol-blue font-semibold">{client}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
