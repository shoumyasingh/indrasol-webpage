import React, { useEffect, useRef } from "react";
import { ArrowRight, Brain, Shield, Code, CheckCircle, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Feature badge component with enhanced hover effects
const FeatureBadge = ({ icon: Icon, text }) => (
  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300">
    <div className="p-2 bg-indrasol-blue/10 rounded-lg mr-3 group-hover:bg-indrasol-blue/20 transition-colors">
      <Icon className="h-5 w-5 text-indrasol-blue group-hover:scale-110 transition-transform" strokeWidth={2} />
    </div>
    <span className="text-sm font-medium text-gray-800 group-hover:text-indrasol-blue transition-colors">{text}</span>
  </div>
);

// Bullet point component with enhanced animation
const BulletPoint = ({ children }) => (
  <li className="flex items-start space-x-2 mb-2 group">
    <CheckCircle 
      className="h-5 w-5 text-indrasol-blue flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" 
      strokeWidth={2} 
    />
    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{children}</span>
  </li>
);

// Simple breadcrumb component for sub-page context
const Breadcrumb = ({ items = [] }) => (
  <div className="flex items-center text-sm text-gray-500 mb-4">
    <Link to="/" className="hover:text-indrasol-blue transition-colors">Home</Link>
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <ChevronRight className="h-4 w-4 mx-1" />
        {item.link ? (
          <Link to={item.link} className="hover:text-indrasol-blue transition-colors">
            {item.label}
          </Link>
        ) : (
          <span className="text-gray-700">{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

export function AIHeroSection({ 
  // Configurable props with defaults
  title = "Build smart. Secure smarter.",
  showBreadcrumbs = true,
  compactMode = false,
  animateOnLoad = true,
  withVideo = false,
  videoSrc = ""
}) {
  const heroRef = useRef(null);
  const location = useLocation();
  
  // Animation on page load
  useEffect(() => {
    if (animateOnLoad && heroRef.current) {
      heroRef.current.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => {
        heroRef.current.classList.remove('opacity-0', 'translate-y-4');
        heroRef.current.classList.add('opacity-100', 'translate-y-0');
      }, 100);
    }
  }, [animateOnLoad]);
  
  // Breadcrumb items based on current route
  const breadcrumbItems = [
    { label: 'Services', link: '/services' },
    { label: 'AI Solutions & Security', link: null } // Current page has no link
  ];

  // Configuration data for feature badges
  const featureBadges = [
    { icon: Brain, text: "Custom LLM Solutions" },
    { icon: Code, text: "AI Integration" },
    { icon: Shield, text: "AI Security & Compliance" }
  ];

  // Calculate padding based on compact mode
  const sectionPadding = compactMode 
    ? "pt-16 pb-12 md:pt-24 md:pb-16" 
    : "pt-24 pb-16 md:pt-32 md:pb-24";

  // Format the title with specific words in black
  const formatTitle = () => {
    if (title === "Build smart. Secure smarter.") {
      return (
        <>
          <span className="text-black">Build</span>
          <span className="text-indrasol-blue"> smart. </span>
          <span className="text-black">Secure</span>
          <span className="text-indrasol-blue"> smarter.</span>
        </>
      );
    }
    return <span className="text-indrasol-blue">{title}</span>;
  };

  return (
    <section 
      ref={heroRef}
      className={`relative ${sectionPadding} overflow-hidden transition-all duration-700`}
    >
      {/* Background elements with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-indrasol-gray opacity-80"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indrasol-blue/10 rounded-full blur-3xl animate-pulse animation-delay-150"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indrasol-blue/5 rounded-full blur-3xl animate-pulse animation-delay-300"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Show breadcrumbs conditionally */}
        {showBreadcrumbs && <Breadcrumb items={breadcrumbItems} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-5">
            {/* Category badge */}
            <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-1">
              <span className="text-indrasol-blue font-semibold text-sm">AI Solutions & Security</span>
            </div>
            
            {/* Main headline with formatted title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {formatTitle()}
            </h1>
            
            {/* Description text with new content */}
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                We develop AI and LLM-powered apps and ensure they're secure from prompt injection, misuse, and model leaks.
              </p>
              
              {/* New bullet points with improved spacing */}
              <ul className="space-y-2 pl-1">
                <BulletPoint>LLM & AI App Development</BulletPoint>
                <BulletPoint>GenAI Security Reviews, Threat Modeling, MLSecOps</BulletPoint>
                <BulletPoint>Ethical AI Model Governance</BulletPoint>
                <BulletPoint>AI Security Posture Management (AI-SPM)</BulletPoint>
              </ul>
            </div>
            
            {/* CTA buttons with improved hover animations */}
            <div className="flex flex-col sm:flex-row gap-4 pt-5">
              <Link 
                to="/contact" 
                className="group px-6 py-3 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-all duration-300 inline-flex items-center justify-center shadow-lg shadow-indrasol-blue/20"
              >
                Request AI Consultation 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 stroke-2" />
              </Link>
              {/* <Link 
                to="/services/aisolutions" 
                className="group px-6 py-3 border-2 border-indrasol-blue text-indrasol-blue bg-white/80 backdrop-blur-sm rounded-lg hover:bg-indrasol-blue/10 transition-colors inline-flex items-center justify-center"
              >
                Explore AI Services
                <ArrowUpRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </Link> */}
            </div>

            {/* Feature badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6">
              {featureBadges.map((badge, index) => (
                <FeatureBadge key={index} icon={badge.icon} text={badge.text} />
              ))}
            </div>
          </div>
          
          {/* Media section with enhanced animations and responsive display */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl group">
                {withVideo && videoSrc ? (
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full rounded-xl shadow-xl"
                    poster="/services-ai/image-for-hero-section.png"
                  >
                    <source src={videoSrc} type="video/mp4" />
                    <img 
                      src="/services-ai/image-for-hero-section.png" 
                      alt="Advanced AI solutions and visualization" 
                      className="w-full rounded-xl shadow-xl"
                    />
                  </video>
                ) : (
                  <img 
                    src="/services-ai/image-for-hero-section.png" 
                    alt="Advanced AI solutions and visualization" 
                    className="w-full rounded-xl shadow-xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
                    loading="eager"
                  />
                )}
                
                {/* Decorative floating elements with improved animations */}
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-indrasol-blue/10 rounded-xl transform rotate-12 animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-indrasol-orange/10 rounded-xl transform -rotate-12 animate-pulse animation-delay-200"></div>
                
                {/* Optional overlay with gradient for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indrasol-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
       
    </section>
  );
}

export default AIHeroSection;