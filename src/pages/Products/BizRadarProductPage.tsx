import React, { useState } from "react";
import {
  ArrowRight,
  Search,
  Database,
  Server,
  LineChart,
  TrendingUp,
  Target,
  Filter,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  PieChart,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";

// Hero section for BizRadar product
const BizRadarHero = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <Navbar />
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-indrasol-gray opacity-80"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indrasol-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indrasol-orange/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-2">
              <span className="text-indrasol-blue font-semibold text-sm">
                AI-Powered Contract Intelligence
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-indrasol-blue">BizRadar</span>
              <span className="block mt-1">Discover. Analyze. Win.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
              AI-driven contract tracking dashboard that automates the discovery
              and analysis of cybersecurity, AI, and data engineering projects
              across government and freelance marketplaces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="group px-6 py-3 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-all duration-300 inline-flex items-center justify-center shadow-lg shadow-indrasol-blue/20">
                Request Demo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 stroke-2" />
              </button>
              <button className="px-6 py-3 border-2 border-indrasol-blue text-indrasol-blue bg-white/80 backdrop-blur-sm rounded-lg hover:bg-indrasol-blue/10 transition-colors inline-flex items-center justify-center">
                View Features
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
                {/* Placeholder for dashboard screenshot */}
                <div className="relative ">
                <img 
                  src="/product-images/biz.png" 
                  alt="Business professionals working on technology solutions" 
                  className="w-full transition-transform duration-700 hover:scale-105"
                />
                
                
              </div>

                {/* Stats preview cards */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-indrasol-blue/5 rounded-lg p-4">
                    <div className="text-indrasol-blue font-bold text-2xl">
                      2.5K+
                    </div>
                    <div className="text-gray-600 text-sm">Daily Contracts</div>
                  </div>
                  <div className="bg-indrasol-orange/5 rounded-lg p-4">
                    <div className="text-indrasol-orange font-bold text-2xl">
                      98%
                    </div>
                    <div className="text-gray-600 text-sm">Match Accuracy</div>
                  </div>
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

// Data Sources section
const DataSourcesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
            <span className="text-indrasol-blue font-semibold text-sm">
              Comprehensive Coverage
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Multiple Data Sources, One Platform
          </h2>
          <p className="text-lg text-gray-700">
            BizRadar aggregates contract opportunities from across the digital
            landscape, ensuring you never miss a relevant opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Government Sources Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <FileText className="h-7 w-7 text-indrasol-blue" />
            </div>
            <h3 className="text-xl font-bold mb-2">Government Platforms</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive coverage of SAM.gov, GovWin, GovTribe, and other
              federal, state, and local procurement systems.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2" />
                <span>SAM.gov</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2" />
                <span>GovWin</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2" />
                <span>GovTribe</span>
              </div>
            </div>
          </div>

          {/* Freelance Marketplaces Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-indrasol-orange/10 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <TrendingUp className="h-7 w-7 text-indrasol-orange" />
            </div>
            <h3 className="text-xl font-bold mb-2">Freelance Marketplaces</h3>
            <p className="text-gray-600 mb-4">
              Stay on top of in-demand skills by tracking projects from leading
              freelance platforms across the globe.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-orange mr-2" />
                <span>Upwork</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-orange mr-2" />
                <span>Fiverr</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-orange mr-2" />
                <span>Freelancer</span>
              </div>
            </div>
          </div>

          {/* RFP Databases Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Database className="h-7 w-7 text-indrasol-blue" />
            </div>
            <h3 className="text-xl font-bold mb-2">RFP Databases</h3>
            <p className="text-gray-600 mb-4">
              Access to thousands of Request For Proposals from corporations,
              non-profits, and educational institutions.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2" />
                <span>Corporate RFPs</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2" />
                <span>Educational Institutions</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-blue mr-2" />
                <span>Non-profit Organizations</span>
              </div>
            </div>
          </div>

          {/* Industry News Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-indrasol-orange/10 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <LineChart className="h-7 w-7 text-indrasol-orange" />
            </div>
            <h3 className="text-xl font-bold mb-2">Industry Intelligence</h3>
            <p className="text-gray-600 mb-4">
              Get early insights on upcoming projects through our proprietary
              analysis of industry news and announcements.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-orange mr-2" />
                <span>Press Releases</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-orange mr-2" />
                <span>Industry Publications</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-indrasol-orange mr-2" />
                <span>Budget Announcements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Technology stack section
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
            Our sophisticated technology stack ensures accurate, relevant, and
            timely contract recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* ETL Pipelines */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indrasol-blue/20 to-indrasol-blue/5 rounded-xl transform -rotate-1"></div>
            <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 z-10">
              <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Server className="h-6 w-6 text-indrasol-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">ETL Pipelines</h3>
              <p className="text-gray-600">
                Automated Extract, Transform, Load processes that continuously
                gather and normalize contract data from diverse sources,
                ensuring comprehensive coverage.
              </p>
            </div>
          </div>

          {/* Vector Database */}
          <div className="relative mt-10 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-indrasol-blue/10 to-indrasol-orange/10 rounded-xl"></div>
            <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 z-10">
              <div className="p-3 bg-indrasol-blue/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Database className="h-6 w-6 text-indrasol-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">Vector Database</h3>
              <p className="text-gray-600">
                Semantic search capabilities that understand the context and
                meaning behind contract requirements, going beyond simple
                keyword matching.
              </p>
            </div>
          </div>

          {/* LLM-Powered Search */}
          <div className="relative mt-10 md:mt-5">
            <div className="absolute inset-0 bg-gradient-to-r from-indrasol-orange/15 to-indrasol-orange/5 rounded-xl transform rotate-1"></div>
            <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-100 z-10">
              <div className="p-3 bg-indrasol-orange/10 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-indrasol-orange" />
              </div>
              <h3 className="text-xl font-bold mb-3">LLM-Powered Search</h3>
              <p className="text-gray-600">
                AI that understands your business capabilities and matches them
                with contract opportunities that align with your expertise and
                growth objectives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features section
const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("discover");

  return (
    <section className="py-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
            <span className="text-indrasol-blue font-semibold text-sm">
              Key Capabilities
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How BizRadar Works
          </h2>
          <p className="text-lg text-gray-700">
            Our intelligent platform streamlines the entire contract discovery
            and analysis process.
          </p>
        </div>

        {/* Feature navigation tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "discover"
                ? "bg-indrasol-blue text-white shadow-lg shadow-indrasol-blue/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("discover")}
          >
            Discover
          </button>
          <button
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "analyze"
                ? "bg-indrasol-blue text-white shadow-lg shadow-indrasol-blue/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("analyze")}
          >
            Analyze
          </button>
          <button
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "match"
                ? "bg-indrasol-blue text-white shadow-lg shadow-indrasol-blue/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("match")}
          >
            Match
          </button>
          <button
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === "alert"
                ? "bg-indrasol-blue text-white shadow-lg shadow-indrasol-blue/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("alert")}
          >
            Alert
          </button>
        </div>

        {/* Feature content area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Feature description */}
          <div className="order-2 md:order-1">
            {activeTab === "discover" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Automated Discovery
                </h3>
                <p className="text-lg text-gray-700">
                  BizRadar continuously scans multiple data sources to discover
                  relevant contract opportunities in cybersecurity, AI, and data
                  engineering domains.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>
                      24/7 monitoring of government procurement platforms
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>
                      Real-time tracking of freelance marketplace opportunities
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>
                      Early detection of upcoming contract opportunities
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>
                      Comprehensive coverage across federal, state, and local
                      levels
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "analyze" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Intelligent Analysis
                </h3>
                <p className="text-lg text-gray-700">
                  Our AI-powered system analyzes contract details to extract key
                  information and identify the most relevant opportunities for
                  your business.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>
                      NLP-based extraction of requirements and qualifications
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Budget and timeline analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Historical success pattern recognition</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Competitive landscape assessment</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "match" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Precision Matching
                </h3>
                <p className="text-lg text-gray-700">
                  BizRadar matches contract opportunities with your company's
                  capabilities, experience, and growth objectives to find the
                  perfect fit.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Capability-based matching algorithm</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Win probability scoring</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Strategic fit assessment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Team skill alignment</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "alert" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Smart Alerts
                </h3>
                <p className="text-lg text-gray-700">
                  Get timely notifications about high-potential opportunities,
                  upcoming deadlines, and market trends relevant to your
                  business.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Priority-based notification system</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Deadline reminders and submission tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Market trend insights and analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span>Multi-channel delivery (email, SMS, app)</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Feature illustration */}
          <div className="order-1 md:order-2">
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
              {activeTab === "discover" && (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">
                    Discovery Dashboard Illustration
                  </span>
                </div>
              )}
              {activeTab === "analyze" && (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">
                    Analysis Dashboard Illustration
                  </span>
                </div>
              )}
              {activeTab === "match" && (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">
                    Matching System Illustration
                  </span>
                </div>
              )}
              {activeTab === "alert" && (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">
                    Alert System Illustration
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
// const PricingSection = () => {
//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="text-center max-w-3xl mx-auto mb-16">
//           <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
//             <span className="text-indrasol-blue font-semibold text-sm">
//               Flexible Options
//             </span>
//           </div>
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             Choose Your Plan
//           </h2>
//           <p className="text-lg text-gray-700">
//             Scale your contract intelligence as your business grows.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {/* Starter Plan */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
//             <div className="p-8">
//               <h3 className="text-xl font-bold mb-2">Starter</h3>
//               <p className="text-gray-600 mb-6">
//                 For small businesses and startups
//               </p>
//               <div className="mb-6">
//                 <span className="text-4xl font-bold">$299</span>
//                 <span className="text-gray-600">/month</span>
//               </div>
//               <ul className="space-y-3 mb-8">
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Up to 100 contract matches/month</span>
//                 </li>
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Basic filtering tools</span>
//                 </li>
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Email alerts</span>
//                 </li>
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Single user account</span>
//                 </li>
//               </ul>
//               <button className="w-full py-3 px-6 border-2 border-indrasol-blue text-indrasol-blue rounded-lg hover:bg-indrasol-blue/10 transition-colors">
//                 Get Started
//               </button>
//             </div>
//           </div>

//           {/* Professional Plan */}
//           <div className="bg-white rounded-xl shadow-xl border-2 border-indrasol-blue overflow-hidden transform scale-105 relative z-10">
//             <div className="bg-indrasol-blue text-white py-2 text-center text-sm font-bold">
//               MOST POPULAR
//             </div>
//             <div className="p-8">
//               <h3 className="text-xl font-bold mb-2">Professional</h3>
//               <p className="text-gray-600 mb-6">
//                 For growing teams and agencies
//               </p>
//               <div className="mb-6">
//                 <span className="text-4xl font-bold">$699</span>
//                 <span className="text-gray-600">/month</span>
//               </div>
//               <ul className="space-y-3 mb-8">
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Unlimited contract matches</span>
//                 </li>
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Advanced filtering & analytics</span>
//                 </li>
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Email + SMS alerts</span>
//                 </li>
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Up to 5 user accounts</span>
//                 </li>
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Win probability scoring</span>
//                 </li>
//               </ul>
//               <button className="w-full py-3 px-6 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-colors shadow-lg shadow-indrasol-blue/20">
//                 Get Started
//               </button>
//             </div>
//           </div>

//           {/* Enterprise Plan */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
//             <div className="p-8">
//               <h3 className="text-xl font-bold mb-2">Enterprise</h3>
//               <p className="text-gray-600 mb-6">For larger organizations</p>
//               <div className="mb-6">
//                 <span className="text-4xl font-bold">Custom</span>
//                 <span className="text-gray-600"></span>
//               </div>
//               <ul className="space-y-3 mb-8">
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>All Professional features</span>
//                 </li>
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Custom data sources integration</span>
//                 </li>
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>API access</span>
//                 </li>
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Unlimited user accounts</span>
//                 </li>
//                 <li className="flex items-start">
//                   <CheckCircle className="h-5 w-5 text-indrasol-blue mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Dedicated account manager</span>
//                 </li>
//               </ul>
//               <button className="w-full py-3 px-6 border-2 border-indrasol-blue text-indrasol-blue rounded-lg hover:bg-indrasol-blue/10 transition-colors">
//                 Contact Sales
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// FAQ section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does BizRadar find contract opportunities?",
      answer:
        "BizRadar uses automated ETL pipelines to continuously scan government procurement platforms (SAM.gov, GovWin, GovTribe) and freelance marketplaces (Upwork, Fiverr, Freelancer). Our system extracts relevant data, transforms it into a standardized format, and loads it into our centralized database for analysis and matching.",
    },
    {
      question: "What industries does BizRadar focus on?",
      answer:
        "BizRadar specializes in cybersecurity, AI, and data engineering contract opportunities. These focus areas allow us to provide deep, specialized coverage of these high-growth technical domains.",
    },
    {
      question: "How accurate are the contract matches?",
      answer:
        "BizRadar uses advanced vector database technology and LLM-powered search to understand the semantic meaning behind contract requirements. This allows us to achieve a 98% accuracy rate in matching relevant opportunities to your business capabilities.",
    },
    {
      question: "Can I customize the types of contracts I want to see?",
      answer:
        "Yes, BizRadar offers extensive customization options. You can filter by contract value, duration, location, required certifications, agency type, and many other parameters to focus on exactly the types of opportunities you're most interested in.",
    },
    {
      question: "How often is the database updated?",
      answer:
        "Our ETL pipelines run continuously, with most data sources being updated multiple times per day. Government procurement platforms are typically updated every 1-2 hours, while freelance marketplace opportunities are tracked in near real-time.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
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
            Everything you need to know about BizRadar
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
// const CTASection = () => {
//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="bg-gradient-to-r from-indrasol-blue to-indrasol-blue/80 rounded-2xl p-8 md:p-12 shadow-xl">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//             <div className="space-y-6">
//               <h2 className="text-3xl md:text-4xl font-bold text-white">
//                 Ready to Discover Your Next Contract Opportunity?
//               </h2>
//               <p className="text-xl text-white/90">
//                 Join thousands of cybersecurity, AI, and data engineering firms
//                 using BizRadar to find and win more contracts.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 pt-4">
//                 <button className="px-8 py-4 bg-white text-indrasol-blue rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg">
//                   Request Demo
//                 </button>
//                 <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium">
//                   View Pricing
//                 </button>
//               </div>
//             </div>
//             <div className="hidden md:block">
//               <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
//                 <div className="aspect-video bg-white/10 rounded-lg flex items-center justify-center">
//                   <span className="text-white/70">Demo Video Placeholder</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// Main BizRadar Product Page component
export function BizRadarProductPage() {
  return (
    <div className="bg-white">
      <BizRadarHero />
      <DataSourcesSection />
      <TechnologySection />
      {/* <FeaturesSection /> */}
      {/* <PricingSection /> */}
      <FAQSection />
      {/* <CTASection /> */}
      <Footer />
      <BackToTop />
    </div>
  );
}

export default BizRadarProductPage;
