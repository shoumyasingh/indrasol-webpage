import React, { useState } from "react";
import { ExternalLink, Server, Users, Shield, ArrowRight } from "lucide-react";

const businessUnits = [
  {
    icon: <Server className="h-8 w-8 text-white" strokeWidth={1.5} />,
    title: "Oracle Hyperion Managed Services",
    description: "Dedicated support and optimization for Oracle Hyperion solutions to maximize your investment.",
    link: "https://www.hyperion.support",
    bgGradient: "from-indrasol-blue to-indrasol-blue/80",
    accentColor: "bg-white/10"
  },
  {
    icon: <Users className="h-8 w-8 text-white" strokeWidth={1.5} />,
    title: "PeopleSoft Managed Services",
    description: "Specialized services for maintaining and enhancing your PeopleSoft implementation.",
    link: "https://www.peoplesoft-support.com",
    bgGradient: "from-indrasol-orange to-indrasol-orange/80",
    accentColor: "bg-white/10"
  },
  {
    icon: <Shield className="h-8 w-8 text-white" strokeWidth={1.5} />,
    title: "Cyber Security",
    description: "Comprehensive security solutions to protect your data and infrastructure from evolving threats.",
    link: "#",
    bgGradient: "from-indrasol-blue/90 to-indrasol-blue/70",
    accentColor: "bg-white/10"
  }
];

export function BusinessUnitsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-indrasol-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indrasol-orange/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-indrasol-blue font-semibold mb-2 bg-indrasol-blue/10 px-4 py-1 rounded-full">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">Specialized </span>
            <span className="text-indrasol-blue relative">
              <span className="relative z-10">Business Units</span>
            </span>
            
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our dedicated business units provide specialized services to meet specific industry needs with focused expertise.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {businessUnits.map((unit, index) => (
            <div 
              key={index} 
              className="relative group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br ${unit.bgGradient} h-full p-8 transition-transform duration-500 group-hover:scale-[1.02]`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                
                <div className="relative z-10">
                  {/* Icon with background */}
                  <div className={`inline-flex items-center justify-center p-4 ${unit.accentColor} rounded-2xl mb-6`}>
                    {unit.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white">{unit.title}</h3>
                  <p className="mb-8 text-white/90 text-lg">{unit.description}</p>
                  
                  {unit.link !== "#" ? (
                    <a 
                      href={unit.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-white font-medium group-hover:underline transition-all duration-300"
                    >
                      Visit Website 
                      <ArrowRight 
                        className={`ml-2 h-5 w-5 transition-transform duration-300 ${hoveredIndex === index ? 'transform translate-x-1' : ''}`} 
                        strokeWidth={2}
                      />
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-white/80 font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
              
              {/* Card reflection effect */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/10 to-transparent rounded-b-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <a 
            href="/business-units" 
            className="inline-flex items-center bg-white text-indrasol-blue font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
          >
            Explore all our business units
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}