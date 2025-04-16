
import React from "react";
import { 
  Database, 
  Cloud, 
  BarChart, 
  Shield, 
  Server, 
  Bot, 
  Globe, 
  PenTool
} from "lucide-react";

const services = [
  {
    icon: <Database className="h-10 w-10 text-indrasol-blue" />,
    title: "Oracle Solutions",
    description: "Expert consulting and implementation for Oracle Hyperion, PeopleSoft, Oracle Fusion and JD Edwards."
  },
  {
    icon: <Cloud className="h-10 w-10 text-indrasol-blue" />,
    title: "Cloud Consulting",
    description: "Strategic migration and optimization for Microsoft Azure, AWS, and Google Cloud Platform."
  },
  {
    icon: <BarChart className="h-10 w-10 text-indrasol-blue" />,
    title: "Data Analytics",
    description: "Transform raw data into actionable insights with our advanced analytics solutions."
  },
  {
    icon: <Bot className="h-10 w-10 text-indrasol-blue" />,
    title: "Business Intelligence & AI",
    description: "Leverage AI and BI tools to enhance decision-making and operational efficiency."
  },
  {
    icon: <Server className="h-10 w-10 text-indrasol-blue" />,
    title: "Managed Services",
    description: "Dedicated support for Oracle Hyperion and PeopleSoft through our specialized business units."
  },
  {
    icon: <Shield className="h-10 w-10 text-indrasol-blue" />,
    title: "Cyber Security",
    description: "Protect your digital assets with our comprehensive security services."
  },
  {
    icon: <Globe className="h-10 w-10 text-indrasol-blue" />,
    title: "Cloud DevOps",
    description: "Streamline development and operations with our cloud-based DevOps solutions."
  },
  {
    icon: <PenTool className="h-10 w-10 text-indrasol-blue" />,
    title: "Data Engineering",
    description: "Build robust data pipelines and infrastructure to power your analytics initiatives."
  }
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We offer a comprehensive range of IT consulting and implementation services to help businesses leverage technology for growth and efficiency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-700">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
