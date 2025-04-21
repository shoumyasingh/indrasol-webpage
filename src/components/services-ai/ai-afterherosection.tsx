import React from "react";
import { CheckCircle, Shield, Brain, Code, Lock } from "lucide-react";

// Feature section component for consistent styling
const FeatureSection = ({ 
  title, 
  subtitle, 
  description, 
  bulletPoints, 
  whyItMatters,
  imageSrc = "/placeholder-image.jpg", 
  imageAlt = "Feature illustration",
  reversed = false,
  accentColor = "bg-indrasol-blue/10" 
}) => (
  <div className="py-16 border-b border-gray-100 last:border-b-0">
    <div className={`container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
      {/* Content section */}
      <div className="space-y-6">
        {/* Section number badge */}
        <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-1">
          <span className="text-indrasol-blue font-semibold text-md">{title}</span>
        </div>
        
        {/* Section headline */}
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
          {subtitle}
        </h2>
        
        {/* Section description */}
        <p className="text-lg text-gray-700">{description}</p>
        
        {/* Bullet points */}
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-800">What we do:</h3>
          <ul className="space-y-2 pl-1 pt-2">
            {bulletPoints.map((point, index) => (
              <li key={index} className="flex items-start space-x-2 mb-2 group">
                <CheckCircle 
                  className="h-5 w-5 text-indrasol-blue flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" 
                  strokeWidth={2} 
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Why it matters section - Now using the passed whyItMatters property */}
        <div className="bg-indrasol-blue/5 p-4 rounded-lg border border-indrasol-blue/10">
          <h3 className="font-semibold text-gray-800 mb-2">Why it matters:</h3>
          <p className="text-gray-700">{whyItMatters}</p>
        </div>
      </div>
      
      {/* Image container with styling similar to hero section */}
      <div className={`${reversed ? 'lg:order-first' : ''}`}>
        <div className="relative">
          <div className="relative ">
            <img 
              src={imageSrc} 
              alt={imageAlt} 
              className="w-full rounded-xl transition-all duration-700 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Decorative elements */}
            {/* <div className={`absolute -top-6 -left-6 w-16 h-16 ${accentColor} rounded-xl transform rotate-12 animate-pulse`}></div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-indrasol-orange/10 rounded-xl transform -rotate-12 animate-pulse animation-delay-200"></div> */}
            
            {/* Gradient overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-tr from-indrasol-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div> */}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main component that includes all feature sections
const AIAfterHeroSection = () => {
  // Feature section data with different "Why it matters" text for each section
  const featureSections = [
    {
      title: "1. LLM & AI Application Development",
      subtitle: "Build intelligent, secure AI applications.",
      description: "We leverage the latest advancements in large language models to develop AI applications that transform your business capabilities.",
      bulletPoints: [
        "Develop custom LLM apps (chatbots, copilots, automation)",
        "Integrate with APIs, internal tools, and business data",
        "Fine-tune models and optimize prompts for performance",
        "Deploy securely with scalable infrastructure"
      ],
      whyItMatters: "You get AI that's tailored to your business, secure by design, and ready for real-world use.",
      imageSrc: "/lovable-uploads/srvc1-1.png",
      imageAlt: "LLM & AI Application Development illustration",
      reversed: false,
      accentColor: "bg-indrasol-blue/10"
    },
    {
      title: "2. GenAI Security Reviews, Threat Modeling & MLSecOps",
      subtitle: "Secure your AI before it ships.",
      description: "We conduct comprehensive security reviews and implement MLSecOps practices to ensure your AI systems remain secure throughout their lifecycle.",
      bulletPoints: [
        "Conduct end-to-end security reviews of GenAI applications",
        "Perform AI/ML threat modeling using STRIDE, MITRE ATLAS",
        "Identify risks like prompt injection, model leaks, and misuse",
        "Set up MLSecOps pipelines for continuous AI risk management"
      ],
      whyItMatters: "AI systems face new attack surfaces—our approach helps you find and fix risks early, so you can innovate with confidence.",
      imageSrc: "/lovable-uploads/srvc1-2.png",
      imageAlt: "GenAI Security Reviews illustration",
      reversed: true,
      accentColor: "bg-indrasol-orange/10"
    },
    {
      title: "3. AI Security Posture Management (AI-SPM)",
      subtitle: "Visibility and control across your AI stack",
      description: "Our AI Security Posture Management approach provides continuous monitoring and assessment of your organization's AI security stance.",
      bulletPoints: [
        "Monitor AI systems for risks, misconfigurations, and misuse",
        "Enforce policies on model usage, data access, and logging",
        "Detect prompt injection attempts and unauthorized activity",
        "Integrate with DevSecOps and MLSecOps workflows",
      ],
      whyItMatters: "As AI adoption grows, so do its risks. AI-SPM helps you stay secure, compliant, and in control—without slowing innovation.",
      imageSrc: "/lovable-uploads/srvc1-3.png",
      imageAlt: "AI Security Posture Management illustration",
      reversed: false,
      accentColor: "bg-indrasol-blue/10"
    }
  ];

  return (
    <section className="bg-white relative overflow-hidden">
      {/* Background elements */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-indrasol-gray/5 opacity-80"></div>
      <div className="absolute top-1/4 -right-64 w-96 h-96 bg-indrasol-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-indrasol-orange/5 rounded-full blur-3xl"></div> */}
      
      {/* Introduction section */}
      <div className="relative pt-16 pb-8">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Our AI & Security Services</h2>
          <p className="text-lg text-gray-700">
            We combine cutting-edge AI development with industry-leading security practices to help organizations build and deploy intelligent systems with confidence.
          </p>
        </div>
      </div>
      
      {/* Feature sections - explicitly passing whyItMatters to each FeatureSection */}
      <div className="relative">
        {featureSections.map((section, index) => (
          <FeatureSection 
            key={index}
            title={section.title}
            subtitle={section.subtitle}
            description={section.description}
            bulletPoints={section.bulletPoints}
            whyItMatters={section.whyItMatters}
            imageSrc={section.imageSrc}
            imageAlt={section.imageAlt}
            reversed={section.reversed}
            accentColor={section.accentColor}
          />
        ))}
      </div>
      
      {/* CTA section */}
      <div className="relative py-16 bg-gradient-to-br from-indrasol-blue/5 to-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-6">Ready to enhance your AI capabilities?</h3>
          <button className="px-8 py-3 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-all duration-300 inline-flex items-center justify-center shadow-lg shadow-indrasol-blue/20">
            Schedule a Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default AIAfterHeroSection;