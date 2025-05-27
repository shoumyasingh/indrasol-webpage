import React, { useEffect, useRef } from "react";
import { 
  ArrowRight, 
  Brain, 
  Shield, 
  Code, 
  Cloud, 
  Database,
  Cpu,
  CheckCircle,
  ChevronRight,
  Lock,
  BarChart
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ChatBot } from "@/components/ui/chatbot";

// Service card component with hover effects and animations
const ServiceCard = ({ 
  icon: Icon, 
  title, 
  subtitle,
  description, 
  features, 
  link,
  linkText = "Learn More",
  accentColor = "indrasol-blue"
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="opacity-0 translate-y-8 transition-all duration-700 ease-out h-full"
    >
      <div className="group h-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Card header with gradient accent */}
        <div className="h-2 bg-gradient-to-r from-indrasol-blue to-indrasol-blue/80"></div>
        
        <div className="p-8 h-full flex flex-col">
          {/* Icon and title section */}
          <div className="flex items-start mb-6">
            <div className="p-3 bg-indrasol-blue/10 rounded-xl mr-4 group-hover:bg-indrasol-blue/20 transition-colors">
              <Icon className="h-8 w-8 text-indrasol-blue group-hover:scale-110 transition-transform" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-indrasol-blue font-medium">{subtitle}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 flex-grow">{description}</p>

          {/* Features list */}
          <div className="mb-6">
            <p className="font-semibold text-gray-800 mb-3">Key Services:</p>
            <ul className="space-y-2">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <CheckCircle className="h-4 w-4 text-indrasol-blue flex-shrink-0 mt-0.5 mr-2" strokeWidth={2} />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA button */}
          <Link 
            to={link}
            className="group/btn inline-flex items-center justify-center px-5 py-2.5 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-all duration-300 mt-auto"
          >
            {linkText}
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Hero section component
const ServicesHeroSection = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => {
        heroRef.current.classList.remove('opacity-0', 'translate-y-4');
        heroRef.current.classList.add('opacity-100', 'translate-y-0');
      }, 100);
    }
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden transition-all duration-700"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-indrasol-gray/5 opacity-80"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indrasol-blue/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indrasol-orange/5 rounded-full blur-3xl animate-pulse animation-delay-300"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-indrasol-blue transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-700">Services</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-black">Transform Your Business With</span>
            <br />
            <span className="text-indrasol-blue">Secure, Scalable Solutions</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            From AI innovation to cloud transformation, application security to data engineering—we deliver 
            end-to-end technology solutions that drive growth while ensuring security and compliance.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="group px-6 py-3 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-all duration-300 inline-flex items-center justify-center shadow-lg shadow-indrasol-blue/20"
            >
              Get Started 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2} />
            </Link>
            <a 
              href="#services-overview" 
              className="px-6 py-3 border-2 border-indrasol-blue text-indrasol-blue bg-white/80 backdrop-blur-sm rounded-lg hover:bg-indrasol-blue/10 transition-colors inline-flex items-center justify-center"
            >
              Explore Services
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-indrasol-blue mr-2" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-indrasol-blue mr-2" />
              <span>Proven Results</span>
            </div>
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-indrasol-blue mr-2" />
              <span>Compliance Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  // Services data
  const services = [
    {
      icon: Cpu,
      title: "AI Solutions & Security",
      subtitle: "Build smart. Secure smarter.",
      description: "We develop AI and LLM-powered applications while ensuring they're secure from prompt injection, misuse, and model leaks. Our comprehensive approach combines cutting-edge AI development with robust security practices.",
      features: [
        "LLM & AI Application Development",
        "GenAI Security Reviews & Threat Modeling",
        "AI Security Posture Management (AI-SPM)",
        "MLSecOps Implementation"
      ],
      link: "/services/aisolutions",
      accentColor: "indrasol-blue"
    },
    {
      icon: Cloud,
      title: "Cloud Engineering & Security",
      subtitle: "Modern cloud. Built to scale.",
      description: "We build cloud-native applications, ensure compliance, and keep your infrastructure secure and optimized. From development to management, we provide end-to-end cloud solutions.",
      features: [
        "Cloud-Native App Development",
        "Cloud Security Posture Management (CSPM)",
        "Cloud Compliance (SOC 2, ISO, HIPAA)",
        "Managed Cloud Services (MSP)"
      ],
      link: "/services/cloud-engineering",
      accentColor: "indrasol-blue"
    },
    {
      icon: Code,
      title: "Application Security & Compliance",
      subtitle: "Secure every layer.",
      description: "We help you find and fix security gaps, ensure SaaS compliance, and protect sensitive data. Our comprehensive security approach covers your entire application stack.",
      features: [
        "Application Security Posture Management",
        "Penetration Testing (Web, API, AI)",
        "SaaS Security & Compliance",
        "Security Tool Development"
      ],
      link: "/services/application-security",
      accentColor: "indrasol-blue"
    },
    {
      icon: Database,
      title: "Data Engineering & Security",
      subtitle: "Turn data into advantage.",
      description: "We design secure data pipelines, modernize platforms, and ensure governance so your business can scale with trust and insight. Transform your data into strategic assets.",
      features: [
        "Enterprise Performance Management (EPM)",
        "Data Pipeline Architecture & ETL/ELT",
        "Secure Data Platforms (Snowflake, Databricks)",
        "Data Security Posture Management (DSPM)"
      ],
      link: "/services/data-engineering",
      accentColor: "indrasol-blue"
    }
  ];

  const overviewRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (overviewRef.current) {
      observer.observe(overviewRef.current);
    }

    return () => {
      if (overviewRef.current) {
        observer.unobserve(overviewRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <ServicesHeroSection />

        {/* Services Overview Section */}
        <section id="services-overview" className="py-20 bg-white">
          <div 
            ref={overviewRef}
            className="container mx-auto px-4 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
          >
            {/* Section header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1 bg-indrasol-blue/10 text-indrasol-blue font-medium rounded-full text-sm mb-4">
                Our Services
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Comprehensive Technology Solutions
              </h2>
              <p className="text-xl text-gray-700">
                We combine deep technical expertise with industry best practices to deliver 
                solutions that accelerate your digital transformation journey.
              </p>
            </div>

            {/* Services grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-indrasol-blue/5 to-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Let's discuss how our integrated technology solutions can help you achieve 
              your business goals while maintaining security and compliance.
            </p>
            <Link
              to="/contact"
              className="group px-8 py-4 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-all duration-300 inline-flex items-center justify-center shadow-lg shadow-indrasol-blue/20 text-lg"
            >
              Schedule a Consultation
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
      <ChatBot />
    </div>
  );
};

export default Services;