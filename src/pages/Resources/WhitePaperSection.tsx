import React, { useState } from "react";
import {
  Calendar,
  Download,
  FileText,
  ArrowRight,
  ChevronRight,
  Search,
  Filter,
  BookOpen,
  LockKeyhole,
  Database,
  Cpu,
  Bookmark,
  Shield,
  RefreshCw
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";

// Types for white papers
interface WhitePaper {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  authors: string[];
  publishDate: string;
  readTime: string;
  pageCount: number;
  fileSize: string;
  downloadUrl: string;
  slug: string;
  featured?: boolean;
}

// Sample data (would typically come from an API or CMS)
const sampleWhitePapers: WhitePaper[] = [
  {
    id: "1",
    title: "Securing Large Language Models: Enterprise Implementation Guide",
    excerpt:
      "A comprehensive guide to implementing security controls for LLMs in enterprise environments, covering prompt injection, data leakage, and compliance requirements.",
    coverImage: "/whitepaper-images/llm-security.jpg",
    category: "AI Security",
    authors: ["Dr. Alex Chen", "Maya Patel"],
    publishDate: "April 2025",
    readTime: "25 min read",
    pageCount: 42,
    fileSize: "3.2 MB",
    downloadUrl: "/whitepapers/securing-large-language-models.pdf",
    slug: "securing-large-language-models",
    featured: true,
  },
  {
    id: "2",
    title: "RAG System Architecture: Best Practices for Security and Scale",
    excerpt:
      "An architectural overview of secure Retrieval-Augmented Generation systems, with implementation patterns for ensuring data security throughout the knowledge lifecycle.",
    coverImage: "/whitepaper-images/rag-architecture.jpg",
    category: "Machine Learning",
    authors: ["Maya Patel", "James Wilson"],
    publishDate: "March 2025",
    readTime: "35 min read",
    pageCount: 56,
    fileSize: "4.8 MB",
    downloadUrl: "/whitepapers/rag-system-architecture.pdf",
    slug: "rag-system-architecture",
    featured: true,
  },
  {
    id: "3",
    title: "Zero Trust Implementation for AI Systems",
    excerpt:
      "A practical framework for implementing Zero Trust security principles in AI/ML infrastructure, with specific focus on model serving and inference pipelines.",
    coverImage: "/whitepaper-images/zero-trust-ai.jpg",
    category: "Security Architecture",
    authors: ["James Wilson", "Sarah Johnson"],
    publishDate: "February 2025",
    readTime: "30 min read",
    pageCount: 48,
    fileSize: "3.6 MB",
    downloadUrl: "/whitepapers/zero-trust-implementation-ai.pdf",
    slug: "zero-trust-implementation-ai",
  },
  {
    id: "4",
    title: "Prompt Injection: Attack Vectors and Defenses",
    excerpt:
      "A technical analysis of prompt injection attack patterns, their impact on enterprise systems, and defensive strategies including context boundaries and input sanitization.",
    coverImage: "/whitepaper-images/prompt-injection.jpg",
    category: "AI Security",
    authors: ["Dr. Alex Chen", "Robert Davis"],
    publishDate: "February 2025",
    readTime: "20 min read",
    pageCount: 32,
    fileSize: "2.7 MB",
    downloadUrl: "/whitepapers/prompt-injection-defenses.pdf",
    slug: "prompt-injection-defenses",
  },
  {
    id: "5",
    title: "MLSecOps: Integrating Security into the ML Lifecycle",
    excerpt:
      "A comprehensive guide to incorporating security practices into every phase of the machine learning operations lifecycle, from data collection to deployment.",
    coverImage: "/whitepaper-images/mlsecops.jpg",
    category: "MLSecOps",
    authors: ["Maya Patel", "Dr. Michael Lopez"],
    publishDate: "January 2025",
    readTime: "40 min read",
    pageCount: 64,
    fileSize: "5.1 MB",
    downloadUrl: "/whitepapers/mlsecops-guide.pdf",
    slug: "mlsecops-guide",
  },
  {
    id: "6",
    title: "Model Governance Framework for Enterprise AI",
    excerpt:
      "Establishing effective governance protocols for AI models in regulated industries, including versioning, access controls, audit trails, and compliance documentation.",
    coverImage: "/whitepaper-images/model-governance.jpg",
    category: "AI Ethics",
    authors: ["Sarah Johnson", "James Wilson"],
    publishDate: "January 2025",
    readTime: "30 min read",
    pageCount: 46,
    fileSize: "3.9 MB",
    downloadUrl: "/whitepapers/model-governance-framework.pdf",
    slug: "model-governance-framework",
  },
];

// Categories for filtering
const categories = [
  "All",
  "AI Security",
  "Machine Learning",
  "Security Architecture",
  "MLSecOps",
  "AI Ethics",
];

// Featured white paper card component
const FeaturedWhitePaperCard: React.FC<{ whitePaper: WhitePaper }> = ({ whitePaper }) => {
  const navigate = useNavigate();

  // Handle card click to navigate to whitepaper detail page
  const handleCardClick = () => {
    navigate(`/resources/whitepapers/${whitePaper.slug}`);
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative h-64 overflow-hidden">
        <span className="absolute top-4 left-4 bg-indrasol-blue/90 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          FEATURED
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <div className="absolute bottom-4 right-4">
            <span className="flex items-center text-white text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
              <FileText className="h-4 w-4 mr-2" />
              {whitePaper.pageCount} pages
            </span>
          </div>
        </div>
        <img
          src={whitePaper.coverImage}
          alt={whitePaper.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
            {whitePaper.category}
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {whitePaper.publishDate}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
          {whitePaper.title}
        </h3>
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {whitePaper.excerpt}
        </p>
        <div className="pt-4 mt-auto border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              By {whitePaper.authors.join(", ")}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-gray-500 text-xs flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                {whitePaper.readTime}
              </div>
              <a 
                href={whitePaper.downloadUrl}
                onClick={(e) => e.stopPropagation()}
                className="text-indrasol-blue text-sm font-medium flex items-center group-hover:underline"
              >
                Download <Download className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Regular white paper card component
const WhitePaperCard: React.FC<{ whitePaper: WhitePaper }> = ({ whitePaper }) => {
  const navigate = useNavigate();

  // Handle card click to navigate to whitepaper detail page
  const handleCardClick = () => {
    navigate(`/resources/whitepapers/${whitePaper.slug}`);
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <div className="absolute bottom-3 right-3">
            <span className="flex items-center text-white text-xs bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
              <FileText className="h-3 w-3 mr-1" />
              {whitePaper.pageCount}p
            </span>
          </div>
        </div>
        <img
          src={whitePaper.coverImage}
          alt={whitePaper.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
            {whitePaper.category}
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {whitePaper.publishDate}
          </div>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
          {whitePaper.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3">
          {whitePaper.excerpt}
        </p>
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-600 line-clamp-1">
            By {whitePaper.authors.join(", ")}
          </div>
          <a 
            href={whitePaper.downloadUrl}
            onClick={(e) => e.stopPropagation()}
            className="text-indrasol-blue text-xs font-medium flex items-center hover:underline"
          >
            Download <Download className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

// Category filter component
const CategoryFilter: React.FC<{
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}> = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="overflow-x-auto pb-4 mb-6 -mx-4 px-4">
      <div className="flex space-x-2 min-w-max">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeCategory === category
                ? "bg-indrasol-blue text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

// White paper search and filter section
const SearchAndFilter: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search white papers..."
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue bg-white">
            <option value="">Sort by: Latest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="popular">Sort by: Most Downloads</option>
          </select>
          <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// White paper detail page component
const WhitePaperDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  // In a real implementation, you would fetch the white paper data based on the slug
  const whitePaper = sampleWhitePapers.find((wp) => wp.slug === slug) || sampleWhitePapers[0];

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-8">
              <Link to="/" className="hover:text-indrasol-blue">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link to="/resources" className="hover:text-indrasol-blue">
                Resources
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link to="/resources/whitepapers" className="hover:text-indrasol-blue">
                White Papers
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-700">{whitePaper.title}</span>
            </div>

            {/* Header section */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-indrasol-blue/10 text-indrasol-blue text-sm font-semibold px-4 py-1 rounded-full">
                  {whitePaper.category}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  {whitePaper.publishDate}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FileText className="h-4 w-4 mr-1" />
                  {whitePaper.pageCount} pages
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {whitePaper.title}
              </h1>

              {/* Authors section */}
              <div className="flex items-center mb-8">
                <div>
                  <div className="font-bold text-gray-900">Authors:</div>
                  <div className="text-indrasol-blue text-lg">
                    {whitePaper.authors.join(", ")}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured image and download card */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
              <div className="md:w-2/3">
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={whitePaper.coverImage}
                    alt={whitePaper.title}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-bold mb-4">White Paper Details</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Published</div>
                        <div className="text-gray-600">{whitePaper.publishDate}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Length</div>
                        <div className="text-gray-600">{whitePaper.pageCount} pages ({whitePaper.fileSize})</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BookOpen className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Reading Time</div>
                        <div className="text-gray-600">{whitePaper.readTime}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Bookmark className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Category</div>
                        <div className="text-gray-600">{whitePaper.category}</div>
                      </div>
                    </div>
                  </div>
                  <a 
                    href={whitePaper.downloadUrl}
                    className="w-full bg-indrasol-blue text-white px-4 py-3 rounded-lg hover:bg-indrasol-blue/90 transition-colors flex items-center justify-center font-medium shadow-lg shadow-indrasol-blue/20"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download White Paper
                  </a>
                </div>
              </div>
            </div>

            {/* White paper content - overview */}
            <div className="prose prose-lg max-w-none mb-12">
              <h2>Overview</h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                {whitePaper.excerpt}
              </p>

              <p className="mb-4">
                This white paper provides a comprehensive analysis of {whitePaper.title.toLowerCase()}. It explores the current challenges, proven methodologies, and strategic approaches that organizations can implement to enhance their security posture.
              </p>

              <h2>Key Topics Covered</h2>
              
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-indrasol-blue/10 rounded-full p-1 mt-1 mr-3">
                    <svg className="h-3 w-3 text-indrasol-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Current challenges and emerging threats in the {whitePaper.category} landscape</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indrasol-blue/10 rounded-full p-1 mt-1 mr-3">
                    <svg className="h-3 w-3 text-indrasol-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Proven methodologies for implementing robust security controls</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indrasol-blue/10 rounded-full p-1 mt-1 mr-3">
                    <svg className="h-3 w-3 text-indrasol-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Case studies from real-world implementations across industries</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indrasol-blue/10 rounded-full p-1 mt-1 mr-3">
                    <svg className="h-3 w-3 text-indrasol-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Strategic approaches to integrating security into existing workflows</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indrasol-blue/10 rounded-full p-1 mt-1 mr-3">
                    <svg className="h-3 w-3 text-indrasol-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Actionable recommendations and implementation guidelines</span>
                </li>
              </ul>
            </div>

            {/* Related white papers section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Related White Papers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sampleWhitePapers
                  .filter(
                    (relatedPaper) =>
                      relatedPaper.id !== whitePaper.id &&
                      relatedPaper.category === whitePaper.category
                  )
                  .slice(0, 3)
                  .map((relatedPaper) => (
                    <WhitePaperCard key={relatedPaper.id} whitePaper={relatedPaper} />
                  ))}
              </div>
            </div>

            {/* Back to white papers button */}
            <div className="text-center mt-12 mb-16">
              <Link
                to="/resources/whitepapers"
                className="inline-flex items-center px-6 py-3 border-2 border-indrasol-blue text-indrasol-blue rounded-lg hover:bg-indrasol-blue/10 transition-colors"
              >
                View All White Papers
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
};

// Main white papers section component
const WhitePaperSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter white papers based on selected category
  const filteredWhitePapers =
    activeCategory === "All"
      ? sampleWhitePapers
      : sampleWhitePapers.filter((wp) => wp.category === activeCategory);

  // Separate featured and regular white papers
  const featuredWhitePapers = filteredWhitePapers.filter((wp) => wp.featured);
  const regularWhitePapers = filteredWhitePapers.filter((wp) => !wp.featured);

  return (
    <>
      <Navbar />
      <section className="pt-8 pb-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
              <span className="text-indrasol-blue font-semibold text-sm">
                Technical Resources
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="text-indrasol-blue">White Papers</span> & Research
            </h2>
            <p className="text-lg text-gray-600">
              In-depth technical analysis, research findings, and best practices for AI security,
              cybersecurity, and data engineering from our experts.
            </p>
          </div>

          {/* Search and filter */}
          <SearchAndFilter />

          {/* Category filter */}
          <CategoryFilter
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {/* Featured white papers section */}
          {featuredWhitePapers.length > 0 && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Featured White Papers
                </h3>
                <Link
                  to="/resources/whitepapers"
                  className="text-indrasol-blue font-medium text-sm flex items-center hover:underline"
                >
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredWhitePapers.slice(0, 2).map((whitePaper) => (
                  <FeaturedWhitePaperCard key={whitePaper.id} whitePaper={whitePaper} />
                ))}
              </div>
            </div>
          )}

          {/* Regular white papers grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">All White Papers</h3>
              <div className="text-sm text-gray-500">
                Showing {regularWhitePapers.length} of {sampleWhitePapers.length} resources
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {regularWhitePapers.map((whitePaper) => (
                <WhitePaperCard key={whitePaper.id} whitePaper={whitePaper} />
              ))}
            </div>

            {/* Request white paper CTA */}
            <div className="mt-16 bg-indrasol-blue rounded-xl p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-3 space-y-4">
                  <h3 className="text-2xl font-bold text-white">
                    Looking for specific research?
                  </h3>
                  <p className="text-white/90">
                    Our team can provide custom research and white papers on AI security,
                    cybersecurity, and data engineering topics relevant to your organization.
                  </p>
                </div>
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-white text-indrasol-blue rounded-lg hover:bg-gray-100 transition-colors font-medium flex-1 text-center"
                  >
                    Request Custom Research
                  </Link>
                  <Link
                    to="/resources"
                    className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium flex-1 text-center"
                  >
                    Explore Resources
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </>
  );
};

// Main categories with icons for the capabilities section
const WhitePaperCategories: React.FC = () => {
  const categoryIcons = [
    {
      category: "AI Security",
      icon: <LockKeyhole className="h-8 w-8 text-indrasol-blue" />,
      description: "Securing AI systems from attacks, vulnerabilities, and misuse"
    },
    {
      category: "Machine Learning",
      icon: <Cpu className="h-8 w-8 text-indrasol-blue" />,
      description: "Architecture, algorithms, and implementation best practices"
    },
    {
      category: "Security Architecture",
      icon: <Shield className="h-8 w-8 text-indrasol-blue" />,
      description: "Designing secure systems and implementing robust controls"
    },
    {
      category: "MLSecOps",
      icon: <RefreshCw className="h-8 w-8 text-indrasol-blue" />,
      description: "Integrating security into the ML development lifecycle"
    },
    {
      category: "AI Ethics",
      icon: <Database className="h-8 w-8 text-indrasol-blue" />,
      description: "Governance, compliance, and ethical considerations for AI"
    }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
            <span className="text-indrasol-blue font-semibold text-sm">
              Research Areas
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our White Paper Categories
          </h2>
          <p className="text-lg text-gray-600">
            Explore our research across key areas of AI security and modern system architectures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoryIcons.map((item) => (
            <div key={item.category} className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-all text-center">
              <div className="mx-auto w-16 h-16 bg-indrasol-blue/10 rounded-full flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.category}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <Link
                to={`/resources/whitepapers?category=${encodeURIComponent(item.category)}`}
                className="text-indrasol-blue font-medium hover:underline flex items-center justify-center"
              >
                View Papers <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhitePaperSection;
export { WhitePaperDetailPage, WhitePaperCategories };