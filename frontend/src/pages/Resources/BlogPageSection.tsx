import React, { useState } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";

// Types for blog posts
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  publishDate: string;
  readTime: string;
  slug: string;
  featured?: boolean;
}

// Sample data (would typically come from an API or CMS)
const sampleBlogs: BlogPost[] = [
  {
    id: "1",
    title: "Cyber Risk Management",
    excerpt:
      "Demystifying Secure Architecture Review of Generative AI-Based Products and Services.",
    coverImage: "/blog-images/blog1.png",
    category: "Cybersecurity",
    author: "Satish Govindappa",
    authorRole: "",
    authorAvatar: "/blog-images/SatishGovindappa.png",
    publishDate: "April 18, 2025",
    readTime: "8 min read",
    slug: "cyber-risk-management",
    featured: true,
  },
//   {
//     id: "2",
//     title: "Implementing RAG Systems for Enhanced Threat Detection",
//     excerpt:
//       "A practical guide to implementing Retrieval-Augmented Generation for more effective cybersecurity threat analysis.",
//     coverImage: "/blog-images/rag-threat-detection.jpg",
//     category: "Machine Learning",
//     author: "Maya Patel",
//     authorRole: "ML Security Researcher",
//     authorAvatar: "/avatars/maya-patel.jpg",
//     publishDate: "April 10, 2025",
//     readTime: "10 min read",
//     slug: "rag-threat-detection",
//     featured: true,
//   },
//   {
//     id: "3",
//     title: "Zero Trust Architecture: Beyond the Buzzword",
//     excerpt:
//       "Practical strategies for implementing genuine zero trust architecture in modern enterprise networks.",
//     coverImage: "/blog-images/zero-trust.jpg",
//     category: "Security Architecture",
//     author: "James Wilson",
//     authorRole: "Security Consultant",
//     authorAvatar: "/avatars/james-wilson.jpg",
//     publishDate: "April 5, 2025",
//     readTime: "7 min read",
//     slug: "zero-trust-architecture-guide",
//   },
//   {
//     id: "4",
//     title: "The Hidden Dangers of Prompt Injection in LLMs",
//     excerpt:
//       "Understanding and mitigating prompt injection attacks in large language model applications.",
//     coverImage: "/blog-images/prompt-injection.jpg",
//     category: "AI Security",
//     author: "Dr. Alex Chen",
//     authorRole: "Chief Security Architect",
//     authorAvatar: "/avatars/alex-chen.jpg",
//     publishDate: "March 28, 2025",
//     readTime: "6 min read",
//     slug: "prompt-injection-dangers",
//   },
  
];

// Categories for filtering
const categories = [
  "All",
  "AI Security",
  "Cybersecurity",
  "Machine Learning",
  "Security Architecture",
  "AI Ethics",
];

// Featured blog post card component
const FeaturedBlogCard: React.FC<{ blog: BlogPost }> = ({ blog }) => {
  const navigate = useNavigate();

  // Handle card click to navigate to blog detail page
  const handleCardClick = () => {
    navigate(`/blog/${blog.slug}`);
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
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Eye className="h-6 w-6 text-indrasol-blue" />
          </div>
        </div>
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
            {blog.category}
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {blog.publishDate}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {blog.excerpt}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <img
              src={blog.authorAvatar}
              alt={blog.author}
              className="h-8 w-8 rounded-full mr-2 border border-gray-200"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {blog.author}
              </div>
              <div className="text-xs text-gray-500">{blog.authorRole}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-gray-500 text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {blog.readTime}
            </div>
            <span className="text-indrasol-blue text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              Read more{" "}
              <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Regular blog post card component
const BlogCard: React.FC<{ blog: BlogPost }> = ({ blog }) => {
  const navigate = useNavigate();

  // Handle card click to navigate to blog detail page
  const handleCardClick = () => {
    navigate(`/blog/${blog.slug}`);
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Eye className="h-5 w-5 text-indrasol-blue" />
          </div>
        </div>
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
            {blog.category}
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {blog.publishDate}
          </div>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
          {blog.excerpt}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <img
              src={blog.authorAvatar}
              alt={blog.author}
              className="h-6 w-6 rounded-full mr-2 border border-gray-200"
            />
            <span className="text-xs text-gray-700">{blog.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {blog.readTime}
            </span>
            <span className="text-indrasol-blue text-xs font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              Read{" "}
              <ArrowRight className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
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

// Main blog page section component
const BlogPageSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter blogs based on selected category
  const filteredBlogs =
    activeCategory === "All"
      ? sampleBlogs
      : sampleBlogs.filter((blog) => blog.category === activeCategory);

  // Separate featured and regular blogs
  const featuredBlogs = filteredBlogs.filter((blog) => blog.featured);
  const regularBlogs = filteredBlogs.filter((blog) => !blog.featured);

  return (
    <>
      <Navbar />
      <section className="pt-40 pb-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
              <span className="text-indrasol-blue font-semibold text-sm">
                Insights & Knowledge
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest from the{" "}
              <span className="text-indrasol-blue">Indrasol Blog</span>
            </h2>
            <p className="text-lg text-gray-600">
              Expert perspectives on cybersecurity, AI, and data engineering from
              our team and industry leaders.
            </p>
          </div>

          {/* Category filter */}
          <CategoryFilter
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {/* Featured blogs section (only show if we have featured blogs in the filtered results) */}
          {featuredBlogs.length > 0 && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Featured Articles
                </h3>
                <Link
                  to="/blog"
                  className="text-indrasol-blue font-medium text-sm flex items-center hover:underline"
                >
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredBlogs.slice(0, 2).map((blog) => (
                  <FeaturedBlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </div>
          )}

          {/* Regular blogs grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Latest Articles</h3>
              <Link
                to="/blog"
                className="text-indrasol-blue font-medium text-sm flex items-center hover:underline"
              >
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {regularBlogs.slice(0, 6).map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* View more button */}
            <div className="text-center mt-12 mb-8">
              <Link
                to="/blog"
                className="group inline-flex items-center px-6 py-3 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-colors shadow-lg shadow-indrasol-blue/20"
              >
                Explore All Articles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </>
  );
};

export default BlogPageSection;
// export { BlogDetailPage };