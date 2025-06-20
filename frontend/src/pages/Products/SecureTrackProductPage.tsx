import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Shield,
  FileText,
  Search,
  Eye,
  AlertTriangle,
  CheckCircle,
  Database,
  Zap,
  Lock,
  FileSearch,
  Cpu,
  BarChart,
  ChevronDown,
  Layers,
  RefreshCw,
  Brain,
  Code,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { Link } from "react-router-dom";

// Hero section for SecureTrack product
const SecureTrackHero = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <Navbar />
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-indrasol-gray opacity-80"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indrasol-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indrasol-orange/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-indrasol-blue transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/products" className="hover:text-indrasol-blue transition-colors">Products</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-700">SecureTrack</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-2">
              <span className="text-indrasol-blue font-semibold text-sm">
                AI-Powered Security Architecture Analysis
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-indrasol-blue">SecureTrack</span>
              <span className="block mt-1">Analyze. Identify. Secure.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
              Intelligent security architecture design review application that
              analyzes diagrams, identifies gaps, and provides actionable
              recommendations using AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                to="/contact"
                className="group px-6 py-3 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-all duration-300 inline-flex items-center justify-center shadow-lg shadow-indrasol-blue/20"
              >
                Request Demo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 stroke-2" />
              </Link>
              {/* <button className="px-6 py-3 border-2 border-indrasol-blue text-indrasol-blue bg-white/80 backdrop-blur-sm rounded-lg hover:bg-indrasol-blue/10 transition-colors inline-flex items-center justify-center">
                View Demo
              </button> */}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              {/* <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100"> */}
              {/* Placeholder for app interface screenshot */}
              <div className="relative ">
                <img
                  src="/product-images/Securetrack.png"
                  alt="Business professionals working on technology solutions"
                  className="w-full transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Stats preview cards */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-indrasol-blue/5 rounded-lg p-4">
                  <div className="text-indrasol-blue font-bold text-2xl">
                    95%
                  </div>
                  <div className="text-gray-600 text-sm">
                    Threat Detection Rate
                  </div>
                </div>
                <div className="bg-indrasol-orange/5 rounded-lg p-4">
                  <div className="text-indrasol-orange font-bold text-2xl">
                    76%
                  </div>
                  <div className="text-gray-600 text-sm">Time Saved</div>
                  {/* </div> */}
                </div>

                {/* Decorative elements */}
                {/* <div className="absolute -top-6 -left-6 w-16 h-16 bg-indrasol-blue/10 rounded-xl transform rotate-12 animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-indrasol-orange/10 rounded-xl transform -rotate-12"></div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Key Features section
const KeyFeaturesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
            <span className="text-indrasol-blue font-semibold text-sm">
              Key Capabilities
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Security Architecture Analysis
          </h2>
          <p className="text-lg text-gray-700">
            SecureTrack delivers intelligent insights for robust security
            architecture design
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Diagram Analysis Feature */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <FileSearch className="h-7 w-7 text-indrasol-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3">Diagram Analysis</h3>
            <p className="text-gray-600 mb-4">
              Upload architecture diagrams in multiple formats. SecureTrack's
              computer vision algorithms identify components, connections, and
              security controls.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2 flex-shrink-0" />
                <span>Supports Visio, Lucidchart, Draw.io</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2 flex-shrink-0" />
                <span>Component recognition</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2 flex-shrink-0" />
                <span>Flow analysis</span>
              </li>
            </ul>
          </div>

          {/* Security Gap Identification */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-indrasol-orange/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <AlertTriangle className="h-7 w-7 text-indrasol-orange" />
            </div>
            <h3 className="text-xl font-bold mb-3">Gap Identification</h3>
            <p className="text-gray-600 mb-4">
              Automatically identify security gaps, vulnerabilities, and missing
              controls based on industry best practices and compliance
              frameworks.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-orange mr-2 flex-shrink-0" />
                <span>Compliance mapping</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-orange mr-2 flex-shrink-0" />
                <span>Vulnerability detection</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-orange mr-2 flex-shrink-0" />
                <span>Control assessment</span>
              </li>
            </ul>
          </div>

          {/* Intelligent Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <Zap className="h-7 w-7 text-indrasol-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Recommendations</h3>
            <p className="text-gray-600 mb-4">
              Get actionable recommendations to improve your security
              architecture design with context-aware suggestions and best
              practices.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2 flex-shrink-0" />
                <span>Prioritized action items</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2 flex-shrink-0" />
                <span>Implementation guidance</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2 flex-shrink-0" />
                <span>Risk mitigation strategies</span>
              </li>
            </ul>
          </div>

          {/* Threat Modeling */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <Shield className="h-7 w-7 text-indrasol-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3">Threat Modeling</h3>
            <p className="text-gray-600 mb-4">
              Automatically generate comprehensive threat models based on your
              architecture, identifying potential attack vectors and mitigation
              strategies.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2 flex-shrink-0" />
                <span>STRIDE methodology</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2 flex-shrink-0" />
                <span>Attack path visualization</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2 flex-shrink-0" />
                <span>Risk scoring</span>
              </li>
            </ul>
          </div>

          {/* Compliance Mapping */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-indrasol-orange/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <FileText className="h-7 w-7 text-indrasol-orange" />
            </div>
            <h3 className="text-xl font-bold mb-3">Compliance Mapping</h3>
            <p className="text-gray-600 mb-4">
              Map your architecture against industry standards and regulations
              to identify compliance gaps and requirements.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-orange mr-2 flex-shrink-0" />
                <span>NIST, ISO, CIS, MITRE</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-orange mr-2 flex-shrink-0" />
                <span>Compliance gap analysis</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-orange mr-2 flex-shrink-0" />
                <span>Audit-ready reporting</span>
              </li>
            </ul>
          </div>

          {/* Historical Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
              <BarChart className="h-7 w-7 text-indrasol-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3">Design Evolution</h3>
            <p className="text-gray-600 mb-4">
              Track changes in your security architecture over time, measure
              improvement, and demonstrate security posture enhancement.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2 flex-shrink-0" />
                <span>Version comparison</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2 flex-shrink-0" />
                <span>Progress tracking</span>
              </li>
              <li className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2 flex-shrink-0" />
                <span>Security posture metrics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// Technology section
const TechnologySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
            <span className="text-indrasol-blue font-semibold text-sm">
              Advanced Technology
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powered by Cutting-Edge AI
          </h2>
          <p className="text-lg text-gray-700">
            SecureTrack leverages the latest AI technologies to deliver accurate
            security architecture assessments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* AI-Driven Analysis */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indrasol-blue/20 to-indrasol-blue/5 rounded-xl transform -rotate-1"></div>
            <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 z-10">
              <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-indrasol-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Driven Analysis</h3>
              <p className="text-gray-600">
                Our advanced machine learning models analyze security
                architecture diagrams to identify components, connections, and
                potential security weaknesses with exceptional accuracy.
              </p>
            </div>
          </div>

          {/* Retrieval-Augmented Generation */}
          <div className="relative mt-10 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-indrasol-blue/10 to-indrasol-orange/10 rounded-xl"></div>
            <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 z-10">
              <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Database className="h-6 w-6 text-indrasol-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Retrieval-Augmented Generation
              </h3>
              <p className="text-gray-600">
                SecureTrack's RAG system combines a vast knowledge base of
                security best practices with generative AI to provide
                context-aware, accurate recommendations.
              </p>
            </div>
          </div>

          {/* Threat Modeling Frameworks */}
          <div className="relative mt-10 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-indrasol-orange/15 to-indrasol-orange/5 rounded-xl transform rotate-1"></div>
            <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 z-10">
              <div className="p-3 bg-indrasol-orange/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-indrasol-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Threat Modeling Frameworks
              </h3>
              <p className="text-gray-600">
                Built on industry-standard methodologies like STRIDE, PASTA, and
                MITRE ATT&CK, our threat modeling engine identifies potential
                attack vectors and suggests effective mitigations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// How It Works section with animation
const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  // Auto-advance steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === 4 ? 1 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
            <span className="text-indrasol-blue font-semibold text-sm">
              Simple Process
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How SecureTrack Works
          </h2>
          <p className="text-lg text-gray-700">
            Four simple steps to transform your security architecture design
          </p>
        </div>

        {/* Process visualization */}
        <div className="max-w-5xl mx-auto">
          <div className="relative pb-10">
            {/* Progress bar */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 hidden md:block">
              <div
                className="h-1 bg-indrasol-blue transition-all duration-500 ease-in-out"
                style={{ width: `${(activeStep - 1) * 33.33}%` }}
              ></div>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div
                className={`relative ${
                  activeStep >= 1 ? "opacity-100" : "opacity-50"
                } transition-opacity duration-500`}
                onClick={() => setActiveStep(1)}
              >
                <div
                  className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto
                  transition-colors duration-500
                  ${
                    activeStep >= 1
                      ? "bg-indrasol-blue text-white"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
                >
                  1
                </div>
                <h3 className="text-lg font-bold text-center mb-2">
                  Upload Diagram
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Upload your security architecture diagram in common formats.
                </p>
              </div>

              <div
                className={`relative ${
                  activeStep >= 2 ? "opacity-100" : "opacity-50"
                } transition-opacity duration-500`}
                onClick={() => setActiveStep(2)}
              >
                <div
                  className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto
                  transition-colors duration-500
                  ${
                    activeStep >= 2
                      ? "bg-indrasol-blue text-white"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
                >
                  2
                </div>
                <h3 className="text-lg font-bold text-center mb-2">
                  AI Analysis
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Our AI analyzes your diagram and identifies components and
                  flows.
                </p>
              </div>

              <div
                className={`relative ${
                  activeStep >= 3 ? "opacity-100" : "opacity-50"
                } transition-opacity duration-500`}
                onClick={() => setActiveStep(3)}
              >
                <div
                  className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto
                  transition-colors duration-500
                  ${
                    activeStep >= 3
                      ? "bg-indrasol-blue text-white"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
                >
                  3
                </div>
                <h3 className="text-lg font-bold text-center mb-2">
                  Gap Detection
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  SecureTrack identifies security gaps and vulnerabilities in
                  the design.
                </p>
              </div>

              <div
                className={`relative ${
                  activeStep >= 4 ? "opacity-100" : "opacity-50"
                } transition-opacity duration-500`}
                onClick={() => setActiveStep(4)}
              >
                <div
                  className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto
                  transition-colors duration-500
                  ${
                    activeStep >= 4
                      ? "bg-indrasol-blue text-white"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
                >
                  4
                </div>
                <h3 className="text-lg font-bold text-center mb-2">
                  Recommendations
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Get actionable recommendations and detailed security reports.
                </p>
              </div>
            </div>
          </div>

          {/* Step visualization */}
          {/* <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {activeStep === 1 && (
                <div className="text-center p-8">
                  <FileText className="h-16 w-16 text-indrasol-blue/50 mx-auto mb-4" />
                  <p className="text-gray-500">Upload Interface Placeholder</p>
                </div>
              )}
              {activeStep === 2 && (
                <div className="text-center p-8">
                  <Cpu className="h-16 w-16 text-indrasol-blue/50 mx-auto mb-4" />
                  <p className="text-gray-500">Analysis Process Placeholder</p>
                </div>
              )}
              {activeStep === 3 && (
                <div className="text-center p-8">
                  <AlertTriangle className="h-16 w-16 text-indrasol-orange/50 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Gap Detection Interface Placeholder
                  </p>
                </div>
              )}
              {activeStep === 4 && (
                <div className="text-center p-8">
                  <Zap className="h-16 w-16 text-indrasol-blue/50 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Recommendations Interface Placeholder
                  </p>
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

// Use Cases section
const UseCasesSection = () => {
  const [activeTab, setActiveTab] = useState("enterprise");

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
            <span className="text-indrasol-blue font-semibold text-sm">
              Industry Solutions
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Security Architecture Excellence Across Industries
          </h2>
          <p className="text-lg text-gray-700">
            See how SecureTrack adapts to different security architecture needs
          </p>
        </div>

        {/* Industry tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "enterprise"
                ? "bg-indrasol-blue text-white shadow-lg shadow-indrasol-blue/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("enterprise")}
          >
            Enterprise IT
          </button>
          <button
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "financial"
                ? "bg-indrasol-blue text-white shadow-lg shadow-indrasol-blue/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("financial")}
          >
            Financial Services
          </button>
          <button
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "healthcare"
                ? "bg-indrasol-blue text-white shadow-lg shadow-indrasol-blue/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("healthcare")}
          >
            Healthcare
          </button>
          <button
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "government"
                ? "bg-indrasol-blue text-white shadow-lg shadow-indrasol-blue/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("government")}
          >
            Government
          </button>
        </div>

        {/* Use case content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Use case description */}
          <div>
            {activeTab === "enterprise" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Enterprise IT Security Architecture
                </h3>
                <p className="text-lg text-gray-700">
                  Ensure your enterprise IT infrastructure incorporates robust
                  security controls across cloud, on-premise, and hybrid
                  environments.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Analyze complex multi-cloud architectures</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>
                      Ensure zero-trust implementation across all layers
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Validate security zone segmentation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>
                      Align with enterprise security policies and standards
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "financial" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Financial Services Security
                </h3>
                <p className="text-lg text-gray-700">
                  Meet stringent regulatory requirements and protect sensitive
                  financial data with comprehensive security architecture
                  validation.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>PCI-DSS compliance verification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Banking regulation alignment (GLBA, SOX)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Fraud detection architecture assessment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Transaction security validation</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "healthcare" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Healthcare Security Compliance
                </h3>
                <p className="text-lg text-gray-700">
                  Protect patient data and medical systems with HIPAA-compliant
                  security architecture designs.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>HIPAA compliance verification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Medical device security assessment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Patient data protection controls</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Telehealth infrastructure security</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "government" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Government Systems Security
                </h3>
                <p className="text-lg text-gray-700">
                  Ensure governmental systems meet the highest security
                  standards with rigorous architecture assessment.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>FedRAMP compliance assessment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>FISMA requirements validation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Critical infrastructure protection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Classified system boundary validation</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Use case illustration */}
          <div>
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
              {activeTab === "enterprise" && (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">
                    Enterprise Architecture Illustration
                  </span>
                </div>
              )}
              {activeTab === "financial" && (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">
                    Financial Services Illustration
                  </span>
                </div>
              )}
              {activeTab === "healthcare" && (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">
                    Healthcare Systems Illustration
                  </span>
                </div>
              )}
              {activeTab === "government" && (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">
                    Government Systems Illustration
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Pricing section
const PricingSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
            <span className="text-indrasol-blue font-semibold text-sm">
              Flexible Options
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-700">
            Scale your security architecture assessment as your needs grow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-8">
              <h3 className="text-xl font-bold mb-2">Essentials</h3>
              <p className="text-gray-600 mb-6">
                For individual security architects
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>5 architecture reviews per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic gap analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Standard threat modeling</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Email support</span>
                </li>
              </ul>
              <button className="w-full py-3 px-6 border-2 border-indrasol-blue text-indrasol-blue rounded-lg hover:bg-indrasol-blue/10 transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Team Plan */}
          <div className="bg-white rounded-xl shadow-xl border-2 border-indrasol-blue overflow-hidden transform scale-105 relative z-10">
            <div className="bg-indrasol-blue text-white py-2 text-center text-sm font-bold">
              MOST POPULAR
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <p className="text-gray-600 mb-6">
                For security teams and consultants
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$399</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>20 architecture reviews per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced gap analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Compliance mapping (NIST, ISO, etc.)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced threat modeling</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Up to 5 team members</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <button className="w-full py-3 px-6 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-colors shadow-lg shadow-indrasol-blue/20">
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-8">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">Custom</span>
                <span className="text-gray-600"></span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited architecture reviews</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Custom compliance frameworks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Enterprise integration (JIRA, DevOps)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited team members</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
                  <span>On-premise deployment option</span>
                </li>
              </ul>
              <button className="w-full py-3 px-6 border-2 border-indrasol-blue text-indrasol-blue rounded-lg hover:bg-indrasol-blue/10 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// FAQ section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What types of diagram formats does SecureTrack support?",
      answer:
        "SecureTrack supports a wide range of diagram formats including Visio (.vsdx), Lucidchart exports, Draw.io (.drawio), Microsoft Threat Modeling Tool, PNG, JPEG, and PDF formats. Our AI can analyze diagrams created in any common architecture modeling tool.",
    },
    {
      question: "How accurate is the AI-based architecture analysis?",
      answer:
        "SecureTrack's AI analysis has been trained on thousands of security architecture diagrams and achieves a 95% accuracy rate in component identification and security gap detection. The system continuously improves through machine learning and expert validation.",
    },
    {
      question: "Can SecureTrack integrate with our existing security tools?",
      answer:
        "Yes, SecureTrack offers API integration with common tools in the security ecosystem, including JIRA, DevOps pipelines, GRC platforms, and vulnerability management solutions. This enables seamless incorporation into your existing security workflows.",
    },
    {
      question: "How does the compliance mapping feature work?",
      answer:
        "SecureTrack maps your architecture components against requirements from major compliance frameworks (NIST, ISO, CIS, etc.), identifying areas where your design meets or falls short of compliance requirements. Each control is evaluated and recommendations are provided for gaps.",
    },
    {
      question: "Is my architecture data secure on the platform?",
      answer:
        "We take data security seriously. All uploaded diagrams and analysis are encrypted both in transit and at rest. For Enterprise customers, we offer private cloud and on-premise deployment options. We do not use customer data to train our AI models without explicit permission.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
            <span className="text-indrasol-blue font-semibold text-sm">
              Common Questions
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-700">
            Everything you need to know about SecureTrack
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className="w-full text-left p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="mt-2 p-6 bg-gray-50 rounded-xl">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA section
const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-indrasol-blue to-indrasol-blue/80 rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Transform Your Security Architecture?
              </h2>
              <p className="text-xl text-white/90">
                Join hundreds of security architects using SecureTrack to
                identify vulnerabilities and strengthen their security posture.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-4 bg-white text-indrasol-blue rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg">
                  Start Free Trial
                </button>
                <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium">
                  Request Demo
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="aspect-video bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white/70">Demo Video Placeholder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main SecureTrack Product Page component
export function SecureTrackProductPage() {
  return (
    <div className="bg-white">
      <SecureTrackHero />
      <KeyFeaturesSection />
      <TechnologySection />
      <HowItWorksSection />
      {/* <UseCasesSection /> */}
      {/* <PricingSection /> */}
      <FAQSection />
      {/* <CTASection /> */}
      <Footer />
      <BackToTop />
    </div>
  );
}

export default SecureTrackProductPage;
