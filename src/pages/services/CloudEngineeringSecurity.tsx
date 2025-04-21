
import React from "react";
import { Cloud, Shield, Server, Cpu, Globe, Layers, Key, Settings, Link, Lock, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link as RouterLink } from "react-router-dom";

const features = [
  {
    icon: Cloud,
    title: "Cloud Architecture & Migration",
    description:
      "Expert design, implementation, and migration for AWS, Azure, and Google Cloud tailored to your business goals.",
  },
  {
    icon: Server,
    title: "Cloud Infrastructure Management",
    description:
      "End-to-end management of compute, storage, and network resources. Automated provisioning and 24/7 monitoring.",
  },
  {
    icon: Cpu,
    title: "DevOps & Automation",
    description:
      "CI/CD pipelines, Infrastructure as Code, and container orchestration (Kubernetes, Docker) for maximum agility.",
  },
  {
    icon: Shield,
    title: "Cloud Security & Compliance",
    description:
      "Zero-trust principles, identity management, data encryption, threat detection, and constant compliance monitoring.",
  },
  {
    icon: Globe,
    title: "Multi-Cloud & Hybrid Engineering",
    description:
      "Design resilient architectures that span multiple clouds or connect on-premise and public cloud securely.",
  },
  {
    icon: Key,
    title: "Identity & Access Management",
    description:
      "Enterprise-grade authentication/authorization, role-based access controls, SSO, and federated identity services.",
  },
  {
    icon: Settings,
    title: "Cloud Cost Optimization",
    description:
      "Analyze spend, eliminate waste, and recommend changes to maximize cloud ROI with an ongoing optimization program.",
  },
  {
    icon: Lock,
    title: "Data Security & Backup",
    description:
      "Robust solutions for data encryption, secure backup, disaster recovery, and business continuity.",
  },
];

const partners = [
  { name: "AWS", logo: "/partners-logo/aws.png" },
  { name: "Microsoft", logo: "/partners-logo/microsoft.png" },
  { name: "Oracle", logo: "/partners-logo/oracle.png" },
  { name: "CSA", logo: "/partners-logo/csa.png" },
  // Add more logos if available
];

export default function CloudEngineeringSecurity() {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:pt-32 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-100/60 to-indigo-200 opacity-70 pointer-events-none"></div>
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl"></div>
        <div className="container mx-auto max-w-5xl px-6 relative z-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="flex-1 space-y-5">
              <span className="inline-block text-indigo-700 font-semibold mb-2 bg-indigo-200/30 px-4 py-1 rounded-full text-base tracking-wide">
                Services &gt; Cloud Engineering & Security
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                Modern <span className="text-indigo-700">Cloud Engineering</span> <br /> & <span className="text-indigo-700">Security</span> Services
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl">
                Accelerate innovation with Indrasol’s enterprise-grade cloud consulting, migration, DevOps, and security services. Empower your business for secure, scalable, and cost-efficient transformation on AWS, Azure & Google Cloud.
              </p>
              <div className="flex gap-4 pt-4">
                <RouterLink to="/contact">
                  <Button size="lg" className="bg-indrasol-blue hover:bg-indigo-800">
                    Start Your Cloud Journey
                  </Button>
                </RouterLink>
                <RouterLink to="/#services">
                  <Button size="lg" variant="outline" className="border-indigo-700 text-indigo-700 hover:bg-indigo-100">
                    Explore All Services
                  </Button>
                </RouterLink>
              </div>
            </div>
            <div className="flex-shrink-0 hidden md:block">
              <img
                src="/lovable-uploads/Mascot_cloud.png"
                alt="Cloud Security & Engineering"
                className="w-80 h-80 object-contain drop-shadow-xl rounded-[2rem] bg-white/60 p-4"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Features/Services Grid */}
      <section className="container mx-auto px-6 py-8 md:py-16 max-w-6xl">
        <div className="mb-14 text-center max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Our Cloud Engineering & Security Expertise
          </h2>
          <p className="text-md text-gray-600">
            From architecture design and cloud migration to DevOps automation and security hardening—our experts ensure your cloud journey is seamless, secure, and future-ready.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="group rounded-2xl bg-white/90 border border-gray-100 shadow-lg px-6 py-8 flex flex-col items-start hover:shadow-indigo-100 hover:-translate-y-1 transition-all relative"
            >
              <span className="inline-flex items-center justify-center rounded-xl bg-indigo-100 p-3 mb-4">
                <feature.icon className="h-8 w-8 text-indigo-700" />
              </span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* Partners/Platforms */}
      <section className="container mx-auto px-6 py-6 md:py-12 max-w-4xl">
        <div className="bg-indigo-50/80 border border-indigo-100 px-4 py-8 rounded-xl text-center shadow">
          <h4 className="text-lg font-medium text-gray-800 mb-3">
            We engineer solutions on all major cloud platforms:
          </h4>
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {partners.map((p, i) => (
              <div key={p.name} className="flex flex-col items-center">
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-14 w-auto object-contain mb-1"
                  style={{ filter: "grayscale(0.2)" }}
                />
                <span className="text-gray-700 font-medium text-sm mt-2">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Why Indrasol */}
      <section className="container mx-auto px-6 py-8 md:py-16 max-w-5xl">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600/90 to-indigo-400/70 px-6 py-10 md:px-12 md:py-14 text-white shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Indrasol?</h3>
          <ul className="grid md:grid-cols-2 gap-6 font-medium">
            <li className="flex items-center gap-3">
              <Shield className="h-7 w-7 text-white/90" />
              Decade-plus expertise in global cloud, security, and DevOps consulting
            </li>
            <li className="flex items-center gap-3">
              <Network className="h-7 w-7 text-white/90" />
              Architecture, migration and operations across AWS, Azure, GCP, hybrid & multi-cloud
            </li>
            <li className="flex items-center gap-3">
              <Layers className="h-7 w-7 text-white/90" />
              Full-stack support from strategy to implementation to managed services
            </li>
            <li className="flex items-center gap-3">
              <Lock className="h-7 w-7 text-white/90" />
              Deep focus on security, compliance and operational excellence
            </li>
          </ul>
          <div className="pt-8 text-center">
            <RouterLink to="/contact">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-indigo-50 border-2 border-indigo-700 font-bold"
              >
                Request a Consultation
              </Button>
            </RouterLink>
          </div>
        </div>
      </section>
      {/* Call to action */}
      <section className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="rounded-2xl bg-white/90 border border-indigo-100 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-8 md:px-10">
          <div>
            <h4 className="text-xl font-bold mb-2 text-indigo-700">Ready for a secure and future-proof cloud?</h4>
            <p className="text-gray-800 mb-3">
              Schedule a complimentary cloud assessment with Indrasol's experts.
            </p>
          </div>
          <RouterLink to="/contact">
            <Button size="lg" className="bg-indrasol-blue hover:bg-indigo-800">
              Let's Talk
            </Button>
          </RouterLink>
        </div>
      </section>
    </div>
  );
}
