import React, { useState, useEffect } from "react";
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  BookOpen, 
  Edit, 
  Heart, 
  MessageCircle, 
  Share2, 
  ChevronRight,
  TrendingUp,
  Filter,
  BookmarkPlus,
  Plus,
  ArrowRight
} from "lucide-react";

// Sample data for blogs and authors
const sampleBlogs = [
  {
    id: 1,
    title: "The Future of AI Security in Enterprise Systems",
    excerpt: "Exploring the emerging trends in AI security and how they're reshaping enterprise architecture.",
    coverImage: "/blog-images/ai-security.jpg",
    category: "AI Security",
    authorId: 1,
    publishDate: "April 18, 2025",
    readTime: "8 min read",
    likes: 124,
    comments: 23,
    featured: true,
    tags: ["AI", "Security", "Enterprise"]
  },
  {
    id: 2,
    title: "Implementing RAG Systems for Enhanced Threat Detection",
    excerpt: "How Retrieval-Augmented Generation is revolutionizing the way we detect and respond to security threats.",
    coverImage: "/blog-images/rag-systems.jpg",
    category: "Machine Learning",
    authorId: 2,
    publishDate: "April 15, 2025",
    readTime: "12 min read",
    likes: 89,
    comments: 15,
    featured: true,
    tags: ["RAG", "Threat Detection", "LLM"]
  },
  {
    id: 3,
    title: "Zero Trust Architecture: Beyond the Buzzword",
    excerpt: "A practical guide to implementing genuine zero trust architecture in modern networks.",
    coverImage: "/blog-images/zero-trust.jpg",
    category: "Security Architecture",
    authorId: 3,
    publishDate: "April 10, 2025",
    readTime: "10 min read",
    likes: 76,
    comments: 19,
    featured: false,
    tags: ["Zero Trust", "Network Security", "Architecture"]
  },
  {
    id: 4,
    title: "MLSecOps: Bridging the Gap Between ML and Security",
    excerpt: "Best practices for integrating security into your machine learning operations workflow.",
    coverImage: "/blog-images/mlsecops.jpg",
    category: "MLSecOps",
    authorId: 1,
    publishDate: "April 5, 2025",
    readTime: "7 min read",
    likes: 62,
    comments: 8,
    featured: false,
    tags: ["MLSecOps", "DevOps", "Security"]
  },
  {
    id: 5,
    title: "Prompt Injection Attacks: The Hidden Threat to LLM Applications",
    excerpt: "Understanding and defending against prompt injection attacks in your AI applications.",
    coverImage: "/blog-images/prompt-injection.jpg",
    category: "AI Security",
    authorId: 2,
    publishDate: "April 2, 2025",
    readTime: "9 min read",
    likes: 105,
    comments: 31,
    featured: false,
    tags: ["LLM", "Security", "Prompt Engineering"]
  },
  {
    id: 6,
    title: "The Ethics of AI in Cybersecurity Decision Making",
    excerpt: "Exploring the ethical implications of autonomous security systems and human oversight.",
    coverImage: "/blog-images/ai-ethics.jpg",
    category: "AI Ethics",
    authorId: 3,
    publishDate: "March 28, 2025",
    readTime: "11 min read",
    likes: 93,
    comments: 27,
    featured: false,
    tags: ["AI Ethics", "Cybersecurity", "Governance"]
  }
];

const sampleAuthors = [
  {
    id: 1,
    name: "Dr. Alex Chen",
    avatar: "/avatars/alex-chen.jpg",
    role: "Chief Security Architect",
    bio: "Leading expert in AI security architecture with over 15 years of experience in enterprise systems.",
    articles: 42,
    followers: 1250
  },
  {
    id: 2,
    name: "Maya Patel",
    avatar: "/avatars/maya-patel.jpg",
    role: "ML Security Researcher",
    bio: "Specializing in the intersection of machine learning and security, with a focus on adversarial attacks.",
    articles: 28,
    followers: 978
  },
  {
    id: 3,
    name: "James Wilson",
    avatar: "/avatars/james-wilson.jpg",
    role: "Zero Trust Specialist",
    bio: "Helping organizations implement effective zero trust architectures in complex environments.",
    articles: 35,
    followers: 1430
  }
];

// Blog category tags
const categories = [
  "All",
  "AI Security",
  "Machine Learning",
  "Security Architecture",
  "MLSecOps",
  "AI Ethics",
  "Threat Modeling",
  "Cloud Security"
];

// Main Header component with search and navigation
const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-10">
            <div className="text-2xl font-bold text-indrasol-blue">Indrasol<span className="text-indrasol-orange">Blog</span></div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-indrasol-blue font-medium">Home</a>
              <a href="#" className="text-gray-700 hover:text-indrasol-blue font-medium">Categories</a>
              <a href="#" className="text-gray-700 hover:text-indrasol-blue font-medium">Authors</a>
              <a href="#" className="text-gray-700 hover:text-indrasol-blue font-medium">Resources</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search blogs..." 
                className="py-2 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue w-64"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button className="hidden md:flex items-center bg-indrasol-blue/10 hover:bg-indrasol-blue/20 text-indrasol-blue px-4 py-2 rounded-lg transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              <span>Write</span>
            </button>
            <button className="hidden md:block border border-indrasol-blue text-indrasol-blue hover:bg-indrasol-blue/5 px-4 py-2 rounded-lg transition-colors">Sign In</button>
            <button className="block md:hidden">
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero section for the blog homepage
const BlogHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-indrasol-blue/5 to-white py-16 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indrasol-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indrasol-orange/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
            <span className="text-indrasol-blue font-semibold text-sm">Knowledge Hub</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Insights on <span className="text-indrasol-blue">Security</span> and <span className="text-indrasol-blue">AI</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore expert perspectives, practical guides, and the latest trends in cybersecurity, AI, and data engineering.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-indrasol-blue text-white px-6 py-3 rounded-lg hover:bg-indrasol-blue/90 transition-colors shadow-lg shadow-indrasol-blue/20 flex items-center justify-center">
              <span>Start Reading</span>
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
            <button className="bg-white text-indrasol-blue border-2 border-indrasol-blue px-6 py-3 rounded-lg hover:bg-indrasol-blue/5 transition-colors flex items-center justify-center">
              <Plus className="mr-2 h-5 w-5" />
              <span>Contribute</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Featured article card component
const FeaturedArticleCard = ({ blog }) => {
  const author = sampleAuthors.find(author => author.id === blog.authorId);
  
  return (
    <div className="rounded-xl overflow-hidden shadow-xl bg-white transition-transform hover:scale-[1.02] duration-300">
      <div className="relative h-64 overflow-hidden">
        <span className="absolute top-4 left-4 bg-indrasol-blue/90 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          FEATURED
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <img 
          src={blog.coverImage} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-white/80 text-sm flex items-center">
            <Calendar className="h-3 w-3 mr-1" /> {blog.publishDate}
          </span>
          <h2 className="text-xl font-bold text-white mt-1">{blog.title}</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
            {blog.category}
          </div>
          <span className="text-gray-500 text-sm flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {blog.readTime}
          </span>
        </div>
        <p className="text-gray-600 mb-4">
          {blog.excerpt}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={author.avatar} 
              alt={author.name}
              className="h-8 w-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700 font-medium">{author.name}</span>
          </div>
          <div className="flex space-x-3 text-gray-500">
            <span className="flex items-center text-xs">
              <Heart className="h-3 w-3 mr-1" /> {blog.likes}
            </span>
            <span className="flex items-center text-xs">
              <MessageCircle className="h-3 w-3 mr-1" /> {blog.comments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Regular article card component
const ArticleCard = ({ blog }) => {
  const author = sampleAuthors.find(author => author.id === blog.authorId);
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={blog.coverImage} 
          alt={blog.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
            {blog.category}
          </div>
          <span className="text-gray-500 text-xs flex items-center">
            <Calendar className="h-3 w-3 mr-1" /> {blog.publishDate}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 hover:text-indrasol-blue transition-colors">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {blog.excerpt}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={author.avatar} 
              alt={author.name}
              className="h-6 w-6 rounded-full mr-2"
            />
            <span className="text-xs text-gray-700">{author.name}</span>
          </div>
          <span className="text-gray-500 text-xs flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {blog.readTime}
          </span>
        </div>
      </div>
    </div>
  );
};

// Featured articles section
const FeaturedArticles = () => {
  const featuredBlogs = sampleBlogs.filter(blog => blog.featured);
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
          <a href="#" className="text-indrasol-blue font-medium text-sm flex items-center hover:underline">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredBlogs.map(blog => (
            <FeaturedArticleCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Category filter component
const CategoryFilter = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className="overflow-x-auto pb-2 mb-6">
      <div className="flex space-x-2 min-w-max">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeCategory === category
                ? "bg-indrasol-blue text-white"
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

// Latest articles section
const LatestArticles = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const filteredBlogs = activeCategory === "All" 
    ? sampleBlogs 
    : sampleBlogs.filter(blog => blog.category === activeCategory);
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
          <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-indrasol-blue transition-colors">
              <Filter className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-indrasol-blue transition-colors">
              <TrendingUp className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <CategoryFilter 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBlogs.map(blog => (
            <ArticleCard key={blog.id} blog={blog} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-white text-indrasol-blue border border-indrasol-blue px-6 py-3 rounded-lg hover:bg-indrasol-blue/5 transition-colors inline-flex items-center">
            <span>Load More Articles</span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Author spotlight section
const AuthorSpotlight = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Authors</h2>
          <a href="#" className="text-indrasol-blue font-medium text-sm flex items-center hover:underline">
            View all authors <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleAuthors.map(author => (
            <div key={author.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={author.avatar} 
                    alt={author.name}
                    className="h-16 w-16 rounded-full mr-4 border-2 border-indrasol-blue/20"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{author.name}</h3>
                    <p className="text-indrasol-blue text-sm">{author.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {author.bio}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="font-bold text-indrasol-blue">{author.articles}</div>
                      <div className="text-xs text-gray-500">Articles</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-indrasol-blue">{author.followers}</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                  </div>
                  <button className="text-indrasol-blue border border-indrasol-blue text-sm px-3 py-1 rounded-full hover:bg-indrasol-blue hover:text-white transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Newsletter signup component
const NewsletterSignup = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-indrasol-blue/90 to-indrasol-blue">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full mb-4">
            <span className="text-white font-semibold text-sm">Join Our Community</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-white/80 mb-8">
            Get the latest insights, tutorials, and security updates delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-3 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <button className="bg-white text-indrasol-blue px-6 py-3 rounded-lg hover:bg-white/90 transition-colors font-medium flex items-center justify-center">
              <span>Subscribe</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
          <p className="text-white/60 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

// Contribute CTA section
const ContributeCTA = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
                <span className="text-indrasol-blue font-semibold text-sm">Share Your Expertise</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Become a Contributor
              </h2>
              <p className="text-gray-600 mb-6">
                Share your knowledge, insights, and experiences with our community of security professionals and AI enthusiasts.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-start">
                  <div className="bg-indrasol-blue/10 rounded-full p-1 mt-0.5 mr-3">
                    <svg className="h-3 w-3 text-indrasol-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-600 text-sm">Reach thousands of professionals in the field</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indrasol-blue/10 rounded-full p-1 mt-0.5 mr-3">
                    <svg className="h-3 w-3 text-indrasol-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-600 text-sm">Establish yourself as a thought leader</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indrasol-blue/10 rounded-full p-1 mt-0.5 mr-3">
                    <svg className="h-3 w-3 text-indrasol-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-600 text-sm">Get feedback from experts in the community</span>
                </li>
              </ul>
              <button className="bg-indrasol-blue text-white px-6 py-3 rounded-lg hover:bg-indrasol-blue/90 transition-colors shadow-lg shadow-indrasol-blue/20 flex items-center">
                <Edit className="mr-2 h-5 w-5" />
                <span>Start Writing Today</span>
              </button>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-indrasol-blue/10"></div>
              <img 
                src="/blog-images/contribute.jpg" 
                alt="Become a contributor"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Blog detail page component (for when a blog post is selected)
const BlogDetail = ({ blogId }) => {
  const blog = sampleBlogs.find(blog => blog.id === blogId) || sampleBlogs[0];
  const author = sampleAuthors.find(author => author.id === blog.authorId);
  
  return (
    <div className="bg-white">
      {/* Blog header */}
      <div className="relative aspect-[21/9] max-h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
        <img 
          src={blog.coverImage} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 pb-12">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-indrasol-blue/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                {blog.category}
              </span>
              <span className="text-white/80 text-sm flex items-center">
                <Calendar className="h-3 w-3 mr-1" /> {blog.publishDate}
              </span>
              <span className="text-white/80 text-sm flex items-center">
                <Clock className="h-3 w-3 mr-1" /> {blog.readTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {blog.title}
            </h1>
            <div className="flex items-center">
              <img 
                src={author.avatar} 
                alt={author.name}
                className="h-10 w-10 rounded-full mr-3 border-2 border-white/30"
              />
              <div>
                <div className="text-white font-medium">{author.name}</div>
                <div className="text-white/70 text-sm">{author.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blog content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {blog.excerpt}
              </p>
              
              <h2>Introduction</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
              
              <h2>Main Concepts</h2>
              <p>
                Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
              
              <blockquote>
                The security landscape is constantly evolving, and our approaches must evolve with it. Static security models are no longer sufficient in today's dynamic threat environment.
              </blockquote>
              
              <h2>Implementation Strategies</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
              
              <h3>Strategy 1: Defense in Depth</h3>
              <p>
                Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
              
              <h3>Strategy 2: Zero Trust</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
              
              <h2>Conclusion</h2>
              <p>
                Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
            </div>
            
            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {blog.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Share and like buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-b border-gray-200 py-4">
              <div className="flex items-center space-x-4">
                <button className="flex items-center text-gray-600 hover:text-indrasol-blue transition-colors">
                  <Heart className="h-5 w-5 mr-2" />
                  <span>Like ({blog.likes})</span>
                </button>
                <button className="flex items-center text-gray-600 hover:text-indrasol-blue transition-colors">
                  <BookmarkPlus className="h-5 w-5 mr-2" />
                  <span>Save</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-indrasol-blue/10 hover:text-indrasol-blue transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Author info */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <div className="flex items-start">
                <img 
                  src={author.avatar} 
                  alt={author.name}
                  className="h-16 w-16 rounded-full mr-4 border-2 border-indrasol-blue/20"
                />
                <div>
                  <h3 className="font-bold text-lg mb-1">{author.name}</h3>
                  <p className="text-indrasol-blue text-sm mb-2">{author.role}</p>
                  <p className="text-gray-600 text-sm mb-3">
                    {author.bio}
                  </p>
                  <button className="text-indrasol-blue border border-indrasol-blue text-sm px-4 py-1 rounded-full hover:bg-indrasol-blue hover:text-white transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            </div>
            
            {/* Comments section placeholder */}
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6">Comments ({blog.comments})</h3>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-gray-500">Comments section placeholder</p>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            {/* Related posts */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Related Articles</h3>
              <div className="space-y-4">
                {sampleBlogs.slice(0, 3).map(relatedBlog => (
                  <div key={relatedBlog.id} className="flex items-start">
                    <img 
                      src={relatedBlog.coverImage}
                      alt={relatedBlog.title}
                      className="w-16 h-16 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <h4 className="font-medium text-sm hover:text-indrasol-blue transition-colors">
                        {relatedBlog.title}
                      </h4>
                      <p className="text-gray-500 text-xs mt-1">{relatedBlog.readTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Popular tags */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["AI Security", "Zero Trust", "LLM", "MLSecOps", "Cloud Security", "STRIDE", "RAG", "Prompt Engineering"].map(tag => (
                  <span key={tag} className="bg-white border border-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-indrasol-blue/5 hover:border-indrasol-blue/20 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Newsletter signup */}
            <div className="bg-indrasol-blue/10 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get the latest security insights and tutorials delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue"
                />
                <button className="w-full bg-indrasol-blue text-white px-4 py-2 rounded-lg hover:bg-indrasol-blue/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Blog creation/editing interface
const BlogEditor = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
            <p className="text-gray-600">Share your knowledge and insights with the community</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Cover Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <div className="mb-3">
                  <svg className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-2">Drag and drop your image here, or click to browse</p>
                <p className="text-gray-400 text-sm">Recommended size: 1600 x 900px</p>
                <button className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  Upload Image
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Title</label>
              <input 
                type="text" 
                placeholder="Enter a compelling title for your article" 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Category</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue">
                  <option>Select a category</option>
                  {categories.filter(c => c !== "All").map(category => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Tags</label>
                <input 
                  type="text" 
                  placeholder="Enter tags separated by commas" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Short Excerpt</label>
              <textarea 
                placeholder="Write a short summary of your article (150-200 characters)" 
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue"
                rows={3}
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Content</label>
              <div className="border border-gray-200 rounded-lg p-2">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2 mb-2">
                  <button className="p-1 rounded hover:bg-gray-100">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 17l3-3m0 0l3 3m-3-3V7m6 10l3-3m0 0l3 3m-3-3V7" />
                    </svg>
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                  </button>
                  <span className="h-5 w-px bg-gray-300 mx-1"></span>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                    </svg>
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    </svg>
                  </button>
                  <span className="h-5 w-px bg-gray-300 mx-1"></span>
                  <button className="p-1 rounded hover:bg-gray-100 font-bold">B</button>
                  <button className="p-1 rounded hover:bg-gray-100 italic">I</button>
                  <button className="p-1 rounded hover:bg-gray-100 underline">U</button>
                </div>
                {/* Editor area */}
                <textarea 
                  placeholder="Write your article content here..." 
                  className="w-full px-4 py-3 rounded-lg focus:outline-none"
                  rows={12}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Save as Draft
              </button>
              <button className="px-6 py-3 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-colors shadow-lg shadow-indrasol-blue/20">
                Publish Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">Indrasol<span className="text-indrasol-orange">Blog</span></div>
            <p className="text-gray-400 mb-6">
              Expert insights on cybersecurity, AI, and data engineering from industry professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.filter(c => c !== "All").slice(0, 6).map(category => (
                <li key={category}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">{category}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Featured Articles</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Authors</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Write for Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Subscribe</h3>
            <p className="text-gray-400 mb-4">
              Stay updated with our latest articles and resources
            </p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/50 focus:border-indrasol-blue"
              />
              <button className="w-full bg-indrasol-blue text-white px-4 py-2 rounded-lg hover:bg-indrasol-blue/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} IndrasolBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main blog homepage layout
export function BlogPage() {
  // State for demo purposes to toggle between different views
  const [view, setView] = useState("home"); // Can be "home", "detail", or "editor"
  const [selectedBlogId, setSelectedBlogId] = useState(1);
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {view === "home" && (
        <>
          <BlogHero />
          <FeaturedArticles />
          <LatestArticles />
          <AuthorSpotlight />
          <NewsletterSignup />
          <ContributeCTA />
        </>
      )}
      
      {view === "detail" && (
        <BlogDetail blogId={selectedBlogId} />
      )}
      
      {view === "editor" && (
        <BlogEditor />
      )}
      
      <Footer />
      
      {/* Demo controls */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-50">
        <div className="text-sm font-bold mb-2">Demo Navigation</div>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded text-xs ${view === "home" ? "bg-indrasol-blue text-white" : "bg-gray-100"}`}
            onClick={() => setView("home")}
          >
            Home
          </button>
          <button 
            className={`px-3 py-1 rounded text-xs ${view === "detail" ? "bg-indrasol-blue text-white" : "bg-gray-100"}`}
            onClick={() => setView("detail")}
          >
            Article Detail
          </button>
          <button 
            className={`px-3 py-1 rounded text-xs ${view === "editor" ? "bg-indrasol-blue text-white" : "bg-gray-100"}`}
            onClick={() => setView("editor")}
          >
            Blog Editor
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;