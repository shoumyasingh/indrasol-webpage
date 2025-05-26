import React, { useEffect, useRef } from "react";
import { 
  ArrowRight, 
  Search,
  Shield,
  FileSearch,
  Target,
  TrendingUp,
  AlertTriangle,
  Database,
  Brain,
  CheckCircle,
  ChevronRight,
  Zap,
  Activity,
  Lock,
  BarChart
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ChatBot } from "@/components/ui/chatbot";

// Product card component with hover effects and animations
const ProductCard = ({ 
  icon: Icon, 
  title, 
  tagline,
  description, 
  features, 
  stats,
  link,
  linkText = "Learn More",
  accentColor = "indrasol-blue",
  isNew = false
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
      <div className="group h-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 relative">
        {/* New badge */}
        {isNew && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-indrasol-orange text-white text-xs font-bold px-3 py-1 rounded-full">
              NEW
            </span>
          </div>
        )}
        
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
              <p className="text-sm text-indrasol-blue font-medium">{tagline}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 flex-grow">{description}</p>

          {/* Stats section */}
          {stats && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-indrasol-blue">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Features list */}
          <div className="mb-6">
            <p className="font-semibold text-gray-800 mb-3">Key Features:</p>
            <ul className="space-y-2">
              {features.slice(0, 4).map((feature, index) => (
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
const ProductsHeroSection = () => {
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
            <span className="text-gray-700">Products</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-black">Intelligent Solutions For</span>
            <br />
            <span className="text-indrasol-blue">Modern Business Challenges</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Discover our suite of AI-powered products designed to streamline your operations, 
            enhance security, and drive business growth through intelligent automation.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="group px-6 py-3 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-all duration-300 inline-flex items-center justify-center shadow-lg shadow-indrasol-blue/20"
            >
              Request Demo 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2} />
            </Link>
            <a 
              href="#products-overview" 
              className="px-6 py-3 border-2 border-indrasol-blue text-indrasol-blue bg-white/80 backdrop-blur-sm rounded-lg hover:bg-indrasol-blue/10 transition-colors inline-flex items-center justify-center"
            >
              Explore Products
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Brain className="h-5 w-5 text-indrasol-blue mr-2" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-indrasol-blue mr-2" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-indrasol-blue mr-2" />
              <span>Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Benefits section
const BenefitsSection = () => {
  const benefitsRef = useRef(null);

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

    if (benefitsRef.current) {
      observer.observe(benefitsRef.current);
    }

    return () => {
      if (benefitsRef.current) {
        observer.unobserve(benefitsRef.current);
      }
    };
  }, []);

  const benefits = [
    {
      icon: TrendingUp,
      title: "Accelerate Growth",
      description: "Leverage AI to identify opportunities and optimize operations for rapid business expansion."
    },
    {
      icon: Shield,
      title: "Enhance Security",
      description: "Proactively identify and address security vulnerabilities before they become threats."
    },
    {
      icon: Target,
      title: "Improve Accuracy",
      description: "AI-driven insights ensure precision in decision-making and risk assessment."
    },
    {
      icon: Database,
      title: "Streamline Operations",
      description: "Automate complex processes and reduce manual effort across your organization."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
      <div 
        ref={benefitsRef}
        className="container mx-auto px-4 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1 bg-indrasol-blue/10 text-indrasol-blue font-medium rounded-full text-sm mb-4">
            Why Choose Our Products
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Built for Modern Enterprises
          </h2>
          <p className="text-xl text-gray-700">
            Our products combine cutting-edge AI technology with deep industry expertise 
            to deliver solutions that drive real business value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="p-4 bg-indrasol-blue/10 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-indrasol-blue/20 transition-colors">
                <benefit.icon className="h-8 w-8 text-indrasol-blue" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Products component
const Products = () => {
  // Products data
  const products = [
    {
      icon: Search,
      title: "Bizradar",
      tagline: "Discover. Analyze. Win.",
      description: "AI-driven contract tracking dashboard that automates the discovery and analysis of cybersecurity, AI, and data engineering projects across government and freelance marketplaces.",
      features: [
        "24/7 monitoring of government & freelance platforms",
        "AI-powered contract matching",
        "Real-time opportunity alerts",
        "Comprehensive market intelligence",
        "Win probability scoring"
      ],
      stats: [
        { value: "2.5K+", label: "Daily Contracts" },
        { value: "98%", label: "Match Accuracy" }
      ],
      link: "/Products/Bizradar",
      accentColor: "indrasol-blue",
      isNew: false
    },
    {
      icon: FileSearch,
      title: "SecureTrack",
      tagline: "Analyze. Identify. Secure.",
      description: "Intelligent security architecture design review application that analyzes diagrams, identifies gaps, and provides actionable recommendations using AI-driven insights.",
      features: [
        "Automated diagram analysis",
        "Security gap identification",
        "Compliance mapping (NIST, ISO, CIS)",
        "AI-powered threat modeling",
        "Actionable recommendations"
      ],
      stats: [
        { value: "95%", label: "Threat Detection" },
        { value: "76%", label: "Time Saved" }
      ],
      link: "/Products/Securetrack",
      accentColor: "indrasol-blue",
      isNew: false
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
        <ProductsHeroSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Products Overview Section */}
        <section id="products-overview" className="py-20 bg-white">
          <div 
            ref={overviewRef}
            className="container mx-auto px-4 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
          >
            {/* Section header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1 bg-indrasol-blue/10 text-indrasol-blue font-medium rounded-full text-sm mb-4">
                Our Products
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Intelligent Solutions Portfolio
              </h2>
              <p className="text-xl text-gray-700">
                Each product is designed to address specific business challenges with 
                precision and intelligence, delivering measurable results.
              </p>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {products.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>

            {/* Coming Soon section */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center bg-indrasol-orange/10 px-6 py-3 rounded-full">
                <Activity className="h-5 w-5 text-indrasol-orange mr-2" />
                <span className="text-indrasol-orange font-semibold">
                  More innovative products coming soon!
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Seamless Integration & Support
              </h2>
              <p className="text-xl text-gray-700 mb-12">
                Our products are designed to integrate seamlessly with your existing 
                infrastructure and workflows, backed by enterprise-grade support.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 mx-auto mb-4">
                    <Database className="h-8 w-8 text-indrasol-blue" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">API Integration</h3>
                  <p className="text-gray-600">RESTful APIs for seamless integration with your existing tools</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 mx-auto mb-4">
                    <Lock className="h-8 w-8 text-indrasol-blue" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Enterprise Security</h3>
                  <p className="text-gray-600">Bank-grade encryption and compliance with industry standards</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 mx-auto mb-4">
                    <BarChart className="h-8 w-8 text-indrasol-blue" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Analytics & Insights</h3>
                  <p className="text-gray-600">Comprehensive dashboards and reporting capabilities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-gradient-to-r from-indrasol-blue to-indrasol-blue/80 rounded-2xl p-12 shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Experience the power of AI-driven solutions. Schedule a personalized 
                demo to see how our products can accelerate your success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="group px-8 py-4 bg-white text-indrasol-blue rounded-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center text-lg font-medium"
                >
                  Schedule Demo
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={2} />
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center text-lg font-medium"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
      <ChatBot />
    </div>
  );
};

export default Products;