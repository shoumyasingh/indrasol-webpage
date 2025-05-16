import React, { useState } from "react";
import { 
  Database, 
  Cloud, 
  BarChart, 
  Shield, 
  Server, 
  Bot, 
  Globe, 
  PenTool,
  ArrowRight
} from "lucide-react";

const services = [
  {
    icon: <Database className="h-12 w-12 text-indrasol-blue stroke-[1.5]" />,
    title: "Oracle Solutions",
    description: "Expert consulting and implementation for Oracle Hyperion, PeopleSoft, Oracle Fusion and JD Edwards.",
    link: "/services/oracle"
  },
  {
    icon: <Cloud className="h-12 w-12 text-indrasol-blue stroke-[1.5]" />,
    title: "Cloud Consulting",
    description: "Strategic migration and optimization for Microsoft Azure, AWS, and Google Cloud Platform.",
    link: "/services/cloud"
  },
  {
    icon: <BarChart className="h-12 w-12 text-indrasol-blue stroke-[1.5]" />,
    title: "Data Analytics",
    description: "Transform raw data into actionable insights with our advanced analytics solutions.",
    link: "/services/analytics"
  },
  {
    icon: <Bot className="h-12 w-12 text-indrasol-blue stroke-[1.5]" />,
    title: "Business Intelligence & AI",
    description: "Leverage AI and BI tools to enhance decision-making and operational efficiency.",
    link: "/services/bi-ai"
  },
  {
    icon: <Server className="h-12 w-12 text-indrasol-blue stroke-[1.5]" />,
    title: "Managed Services",
    description: "Dedicated support for Oracle Hyperion and PeopleSoft through our specialized business units.",
    link: "/services/managed"
  },
  {
    icon: <Shield className="h-12 w-12 text-indrasol-blue stroke-[1.5]" />,
    title: "Cyber Security",
    description: "Protect your digital assets with our comprehensive security services.",
    link: "/services/security"
  },
  {
    icon: <Globe className="h-12 w-12 text-indrasol-blue stroke-[1.5]" />,
    title: "Cloud DevOps",
    description: "Streamline development and operations with our cloud-based DevOps solutions.",
    link: "/services/devops"
  },
  {
    icon: <PenTool className="h-12 w-12 text-indrasol-blue stroke-[1.5]" />,
    title: "Data Engineering",
    description: "Build robust data pipelines and infrastructure to power your analytics initiatives.",
    link: "/services/data-engineering"
  }
];

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services" className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-indrasol-blue/5 blur-3xl -z-10"></div>
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-indrasol-blue/5 blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <span className="inline-block text-indrasol-blue font-semibold mb-2 bg-indrasol-blue/10 px-4 py-1 rounded-full">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">Our </span>
            <span className="text-indrasol-blue">Services</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We offer a comprehensive range of IT consulting and implementation services to help businesses leverage technology for growth and efficiency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Accent background shape */}
              <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-indrasol-blue/5 rounded-full transition-all duration-500 group-hover:scale-150"></div>
              
              <div className="mb-6 relative">
                <div className="p-3 inline-flex items-center justify-center bg-indrasol-blue/10 rounded-2xl transition-all duration-300 group-hover:bg-indrasol-blue/20">
                  {service.icon}
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 relative">
                {service.title}
              </h3>
              
              <p className="text-gray-700 mb-6 relative z-10">
                {service.description}
              </p>
              
              <a 
                href={service.link} 
                className="inline-flex items-center text-indrasol-blue font-medium transition-all duration-300 relative"
              >
                Learn more 
                <ArrowRight 
                  className={`ml-2 h-4 w-4 transition-transform duration-300 ${hoveredIndex === index ? 'transform translate-x-1' : ''}`} 
                  strokeWidth={2.5}
                />
              </a>
              
              {/* Hover border effect */}
              <div className="absolute inset-0 border-2 border-transparent rounded-2xl transition-all duration-300 group-hover:border-indrasol-blue/20"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}