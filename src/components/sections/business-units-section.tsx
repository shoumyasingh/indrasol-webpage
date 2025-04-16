
import React from "react";
import { ExternalLink } from "lucide-react";

const businessUnits = [
  {
    title: "Oracle Hyperion Managed Services",
    description: "Dedicated support and optimization for Oracle Hyperion solutions to maximize your investment.",
    link: "https://www.hyperion.support",
    bgColor: "bg-gradient-to-br from-indrasol-blue to-indrasol-darkblue"
  },
  {
    title: "PeopleSoft Managed Services",
    description: "Specialized services for maintaining and enhancing your PeopleSoft implementation.",
    link: "https://www.peoplesoft-support.com",
    bgColor: "bg-gradient-to-br from-indrasol-blue/90 to-indrasol-blue"
  },
  {
    title: "Cyber Security",
    description: "Comprehensive security solutions to protect your data and infrastructure from evolving threats.",
    link: "#",
    bgColor: "bg-gradient-to-br from-indrasol-darkblue to-indrasol-blue/90"
  }
];

export function BusinessUnitsSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Specialized Business Units</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our dedicated business units provide specialized services to meet specific industry needs with focused expertise.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {businessUnits.map((unit, index) => (
            <div 
              key={index} 
              className={`${unit.bgColor} rounded-lg shadow-lg overflow-hidden text-white p-8`}
            >
              <h3 className="text-2xl font-bold mb-4">{unit.title}</h3>
              <p className="mb-6 text-white/90">{unit.description}</p>
              {unit.link !== "#" && (
                <a 
                  href={unit.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white hover:underline"
                >
                  Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
