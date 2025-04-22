import React, { useEffect, useRef } from "react";
import {
  CheckCircle,
  Shield,
  Lock,
  Code,
  FileCode,
  Database,
  ArrowRight,
  Bug,
  Key,
} from "lucide-react";

// Modern Feature section component with enhanced styling and animations
const FeatureSection = ({
  title,
  subtitle,
  description,
  bulletPoints,
  whyItMatters,
  imageSrc = "/placeholder-image.jpg",
  imageAlt = "Feature illustration",
  reversed = false,
  accentColor = "bg-indrasol-blue/10",
}) => {
  const sectionRef = useRef(null);

  // Add intersection observer for scroll animations
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="py-20 border-b border-gray-100 last:border-b-0 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
    >
      <div
        className={`container mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
          reversed ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Content section with improved hierarchy and spacing */}
        <div className="space-y-8">
          {/* Modern section number badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-indrasol-blue/20 to-indrasol-blue/5 backdrop-blur-sm px-5 py-2 rounded-full">
            <span className="text-indrasol-blue font-semibold text-md">
              {title}
            </span>
          </div>

          {/* Enhanced section headline with subtle color gradient */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            {subtitle}
          </h2>

          {/* Improved description with better readability */}
          <p className="text-lg leading-relaxed text-gray-700 max-w-xl">
            {description}
          </p>

          {/* Modernized bullet points with improved animations */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 text-lg">What we do:</h3>
            <ul className="space-y-4 pt-2">
              {bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start group">
                  <div className="p-1 rounded-full bg-indrasol-blue/10 mr-3 group-hover:bg-indrasol-blue/20 transition-colors duration-300">
                    <CheckCircle
                      className="h-5 w-5 text-indrasol-blue flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Why it matters section with modern card styling */}
          <div className="bg-gradient-to-br from-indrasol-blue/10 to-indrasol-blue/5 p-6 rounded-xl border border-indrasol-blue/10 hover:shadow-md transition-shadow duration-300">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="bg-indrasol-blue/20 p-1 rounded-full mr-2">
                <Shield
                  className="h-4 w-4 text-indrasol-blue"
                  strokeWidth={2}
                />
              </span>
              Why it matters:
            </h3>
            <p className="text-gray-700 leading-relaxed">{whyItMatters}</p>
          </div>
        </div>

        {/* Simplified image container without shadows, zoom, or decorative elements */}
        <div className={`${reversed ? "lg:order-first" : ""}`}>
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full rounded-2xl object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component with modern styling
const CloudAfterHeroSection = () => {
  // Feature section data with application security focus
  const featureSections = [
    {
      title: "1. Full Stack SaaS EPM, ERP Cloud-Native application development",
      subtitle: "Build fast. Deploy safely.",
      description:
        "We specialize in Full Stack SaaS development for EPM and ERP cloud-native applications, delivering scalable, secure, and high-performance solutions. From frontend interfaces to backend systems and cloud infrastructure, we enable end-to-end digital transformation tailored to your enterprise needs.",
      bulletPoints: [
        "Design and develop end-to-end SaaS EPM & ERP applicationsn",
        "Build secure, cloud-native architectures from day one",
        "Integrate DevSecOps for faster, safer delivery",
        "Automate CI/CD, infrastructure-as-code, and monitoring",
      ],
      whyItMatters:
        "You get enterprise-grade applications that are secure, scalable, and built to support critical business functions—without the tech debt.",
      imageSrc: "/lovable-uploads/s2-1.png",
      imageAlt: " Full Stack SaaS EPM, ERP Cloud-Native application development",
      reversed: false,
      accentColor: "bg-indrasol-blue/10",
    },
    {
      title:
        "2. Cloud Security Posture Management (CSPM)",
      subtitle:
        "Secure your cloud, continuously.",
      description:
        "Cloud Security Posture Management (CSPM) continuously monitors and analyzes cloud environments to identify misconfigurations, enforce security policies, and ensure compliance with industry standards.",
      bulletPoints: [
        "Monitor for misconfigurations, vulnerabilities, and threats",
        "Enforce cloud security best practices across your environment",
        "Integrate with your CI/CD and infrastructure-as-code pipelines",
        "Provide visibility, alerts, and remediation steps",
      ],
      whyItMatters:
        " Misconfigured cloud resources are a leading cause of breaches. CSPM gives you continuous protection, not just periodic checks.",
      imageSrc: "/lovable-uploads/s2-2-removebg-preview.png",
      imageAlt: "Secure development illustration",
      reversed: true,
      accentColor: "bg-indrasol-orange/10",
    },
    {
      title: "3. Cloud Compliance (SOC 2, ISO, HIPAA, etc.)",
      subtitle: "Get compliant. Stay compliant.",
      description:
        "Cloud Compliance ensures your cloud infrastructure meets regulatory standards like SOC 2, ISO, and HIPAA by implementing robust controls, continuous monitoring, and audit readiness across your environments.",
      bulletPoints: [
        "Map your cloud architecture to compliance frameworks",
        "Build policies and controls aligned with SOC 2, ISO 27001, HIPAA, GDPR",
        "Implement automated evidence collection and reporting",
        "Prepare you for audits with minimal disruption",
      ],
      whyItMatters:
        "We take the guesswork out of compliance, so you can win trust, reduce risk, and speed up deals.",
      imageSrc: "/lovable-uploads/s2-3.png",
      imageAlt: "DevSecOps pipeline illustration",
      reversed: false,
      accentColor: "bg-indrasol-blue/10",
    },
    {
      title: "4. Managed Cloud Services (MSP)",
      subtitle: "Let us run your cloud while you run your business.",
      description:
        "Managed Cloud Services (MSP) provide end-to-end management, optimization, and support for your cloud infrastructure, ensuring high availability, performance, and cost-efficiency.",
      bulletPoints: [
        "Manage cloud infrastructure across AWS, Azure, GCP",
        "Provide 24/7 monitoring, patching, and cost optimization",
        "Ensure backup, disaster recovery, and high availability",
        "Support ongoing improvements and scaling"

      ],
      whyItMatters:
        "You stay focused on growth—we handle the complexity of keeping your cloud secure, stable, and efficient.",
      imageSrc: "/lovable-uploads/s1-4.png",
      imageAlt: "Secure development illustration",
      reversed: true,
      accentColor: "bg-indrasol-orange/10",
    },
  ];

  const introRef = useRef(null);
  const ctaRef = useRef(null);

  // Add scroll animations for intro and CTA sections
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

    if (introRef.current) {
      observer.observe(introRef.current);
    }

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => {
      if (introRef.current) {
        observer.unobserve(introRef.current);
      }
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  return (
    <section className="bg-white relative overflow-hidden">
      {/* Modern background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-indrasol-gray/5 opacity-80"></div>
      <div className="absolute top-1/3 right-0 w-1/2 h-1/3 bg-indrasol-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-0 w-1/2 h-1/3 bg-indrasol-orange/5 rounded-full blur-3xl"></div>

      {/* Enhanced introduction section with animation */}
      <div
        ref={introRef}
        className="relative pt-24 pb-12 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="inline-block px-4 py-1 bg-indrasol-blue/10 text-indrasol-blue font-medium rounded-full text-sm mb-6">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
          Cloud Engineering & Security
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
          We help organizations build, test, and deploy secure cloud-native solutions with confidence—protecting both your data and your reputation.
          </p>
        </div>
      </div>

      {/* Feature sections rendered with modern styling */}
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

      {/* Modern CTA section with improved visual appeal */}
      <div
        ref={ctaRef}
        className="relative py-24 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-br from-indrasol-blue/10 to-white rounded-2xl p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
              Ready to secure your applications?
            </h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Get in touch to discuss how our Cloud security expertise can
              help protect your software from emerging threats.
            </p>
            <button className="group px-8 py-4 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-all duration-300 inline-flex items-center justify-center shadow-lg shadow-indrasol-blue/20">
              Schedule a Cloud Assessment
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CloudAfterHeroSection;
