import React, { useState, useEffect } from "react";
import {
  Calendar,
  ArrowRight,
  ChevronRight,
  Search,
  BookOpen,
  Loader2,
  Eye,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { supabase } from "@/supabase";

// Simplified whitepaper interface (like blogs)
interface WhitePaper {
  id: string;
  title: string;
  content: string;        // Required like blogs
  excerpt?: string;
  coverImage?: string;
  category: string;
  author: string;
  publishDate: string;
  readTime?: string;
  slug?: string;
  featured?: boolean;
  created_at: string;
}

// Default cover images based on category
const defaultCoverImages: Record<string, string> = {
  "AI Security": "/whitepaperImage/ai-security.jpg",
  "Machine Learning": "/whitepaperImage/machine-learning.jpg",
  "Security Architecture": "/whitepaperImage/security-architecture.jpg",
  "MLSecOps": "/whitepaperImage/mlsecops.jpg",
  "AI Ethics": "/whitepaperImage/ai-ethics.jpg",
  "Cybersecurity": "/whitepaperImage/cybersecurity.jpg",
  "Default": "/whitepaperImage/scope.png",
};

// Helper functions
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long',
    day: 'numeric' 
  });
};

const getMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const getCoverImage = (category: string): string => {
  return defaultCoverImages[category] || defaultCoverImages.Default;
};

const generateExcerpt = (title: string): string => {
  return `This whitepaper explores ${title} in detail, providing insights and recommendations based on research by Indrasol experts.`;
};

// Featured whitepaper card component (matching blog style)
const FeaturedWhitePaperCard: React.FC<{ whitePaper: WhitePaper }> = ({
  whitePaper,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const slug = whitePaper.slug || generateSlug(whitePaper.title);
    navigate(`/components/whitepaper/${slug}`);
  };

  const coverImage = whitePaper.coverImage || getCoverImage(whitePaper.category);
  const publishDate = getMonthYear(whitePaper.created_at);
  const excerpt = whitePaper.excerpt || generateExcerpt(whitePaper.title);

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
            <BookOpen className="h-6 w-6 text-indrasol-blue" />
          </div>
        </div>
        <img
          src={coverImage}
          alt={whitePaper.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `/api/placeholder/800/400?text=${encodeURIComponent(whitePaper.title)}`;
          }}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
            {whitePaper.category}
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {publishDate}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
          {whitePaper.title}
        </h3>
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {excerpt}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {whitePaper.author}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-gray-500 text-xs flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              {whitePaper.readTime || "10-15 min read"}
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

// Regular whitepaper card component (matching blog style)
const WhitePaperCard: React.FC<{ whitePaper: WhitePaper }> = ({
  whitePaper,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const slug = whitePaper.slug || generateSlug(whitePaper.title);
    navigate(`/components/whitepaper/${slug}`);
  };

  const coverImage = whitePaper.coverImage || getCoverImage(whitePaper.category);
  const publishDate = getMonthYear(whitePaper.created_at);
  const excerpt = whitePaper.excerpt || generateExcerpt(whitePaper.title);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <BookOpen className="h-5 w-5 text-indrasol-blue" />
          </div>
        </div>
        <img
          src={coverImage}
          alt={whitePaper.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `/api/placeholder/800/400?text=${encodeURIComponent(whitePaper.title)}`;
          }}
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
            {whitePaper.category}
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {publishDate}
          </div>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
          {whitePaper.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
          {excerpt}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-xs font-medium text-gray-700">{whitePaper.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              {whitePaper.readTime || "10-15 min read"}
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
  availableCategories: string[];
}> = ({ activeCategory, setActiveCategory, availableCategories }) => {
  const displayCategories = ['All', ...availableCategories.filter(c => c !== 'All')];
  
  return (
    <div className="overflow-x-auto pb-4 mb-6 -mx-4 px-4">
      <div className="flex space-x-2 min-w-max">
        {displayCategories.map((category) => (
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

// Empty state component (matching blog style)
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
    <div className="mx-auto w-24 h-24 mb-4 text-gray-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-600">{message}</h3>
    <p className="mt-2 text-gray-500">Check back soon for new content!</p>
  </div>
);

// Loading state component (matching blog style)
const LoadingState: React.FC = () => (
  <div className="text-center py-16">
    <Loader2 className="h-12 w-12 mx-auto text-indrasol-blue animate-spin mb-4" />
    <h3 className="text-lg font-medium text-gray-600">Loading whitepapers...</h3>
  </div>
);
const SearchAndFilter: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
}> = ({ searchQuery, setSearchQuery, sortOption, setSortOption }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search whitepapers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue bg-white"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="latest">Sort by: Latest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="title">Sort by: Title (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Main whitepaper section component
const WhitePaperSection: React.FC = () => {
  const [whitepapers, setWhitepapers] = useState<WhitePaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Fetch whitepapers from Supabase (simplified like blogs)
  useEffect(() => {
    const fetchWhitePapers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('whitepapers')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Convert data to WhitePaper interface (simplified)
        const formattedData = data.map((item: any) => {
          // Format date
          let formattedDate;
          try {
            formattedDate = formatDate(item.created_at);
          } catch (e) {
            formattedDate = 'Unknown date';
          }
          
          // Calculate read time
          const readTime = item.readTime || `${Math.max(1, Math.ceil((item.content?.split(/\s+/).length || 0) / 200))} min read`;
          
          return {
            id: item.id,
            title: item.title,
            content: item.content,
            excerpt: item.excerpt || generateExcerpt(item.title),
            coverImage: item.coverImage || getCoverImage(item.category),
            category: item.category || 'General',
            author: item.author || 'Indrasol Team',
            publishDate: formattedDate,
            readTime: readTime,
            slug: item.slug || generateSlug(item.title),
            created_at: item.created_at,
            featured: false, // Will be set based on index
          };
        });
        
        // Mark first two as featured
        if (formattedData.length > 0) {
          formattedData[0].featured = true;
        }
        if (formattedData.length > 1) {
          formattedData[1].featured = true;
        }
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((item: any) => item.category))];
        setAvailableCategories(uniqueCategories);
        
        setWhitepapers(formattedData);
      } catch (err: any) {
        console.error("Error fetching whitepapers:", err);
        setError(err.message || "Failed to load whitepapers");
      } finally {
        setLoading(false);
      }
    };
    
    fetchWhitePapers();
  }, []);

  // Apply filters and sorting (same as blogs)
  const filteredAndSortedWhitePapers = React.useMemo(() => {
    let result = activeCategory === "All" 
      ? whitepapers
      : whitepapers.filter(wp => wp.category === activeCategory);
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(wp => 
        wp.title.toLowerCase().includes(lowerQuery) ||
        wp.author.toLowerCase().includes(lowerQuery) ||
        wp.category.toLowerCase().includes(lowerQuery) ||
        (wp.excerpt && wp.excerpt.toLowerCase().includes(lowerQuery))
      );
    }
    
    return [...result].sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [whitepapers, activeCategory, searchQuery, sortOption]);

  // Separate featured and regular whitepapers
  const featuredWhitePapers = filteredAndSortedWhitePapers.filter(wp => wp.featured);
  const regularWhitePapers = filteredAndSortedWhitePapers.filter(wp => !wp.featured);

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
              <span className="text-indrasol-blue">Indrasol Whitepapers</span>
            </h2>
            <p className="text-lg text-gray-600">
              Expert perspectives on cybersecurity, AI, and data engineering from
              our team and industry leaders.
            </p>
          </div>

          {/* Search and filter */}
          <SearchAndFilter 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />

          {/* Loading state */}
          {loading ? (
            <LoadingState />
          ) : error ? (
            <EmptyState message={error} />
          ) : whitepapers.length === 0 ? (
            <EmptyState message="No whitepapers found" />
          ) : (
            <>
              {/* Category filter */}
              {availableCategories.length > 0 && (
                <CategoryFilter
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  availableCategories={availableCategories}
                />
              )}

              {/* Featured whitepapers section */}
              {featuredWhitePapers.length > 0 && (
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Featured Articles
                    </h3>
                    <Link
                      to="/resources/whitepaper"
                      className="text-indrasol-blue font-medium text-sm flex items-center hover:underline"
                    >
                      View all <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredWhitePapers.slice(0, 2).map((whitePaper) => (
                      <FeaturedWhitePaperCard
                        key={whitePaper.id}
                        whitePaper={whitePaper}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular whitepapers grid */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Latest Articles</h3>
                  <Link
                    to="/resources/whitepaper"
                    className="text-indrasol-blue font-medium text-sm flex items-center hover:underline"
                  >
                    View all <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                {regularWhitePapers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {regularWhitePapers.slice(0, 6).map((whitePaper) => (
                      <WhitePaperCard key={whitePaper.id} whitePaper={whitePaper} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No regular whitepapers found" />
                )}

                {/* View more button - only show if we have more than 6 regular whitepapers */}
                {regularWhitePapers.length > 6 && (
                  <div className="text-center mt-12 mb-8">
                    <Link
                      to="/resources/whitepaper"
                      className="group inline-flex items-center px-6 py-3 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-colors shadow-lg shadow-indrasol-blue/20"
                    >
                      Explore All Articles
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Request whitepaper CTA (simplified) */}
          <div className="mt-16 bg-indrasol-blue rounded-xl p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3 space-y-4">
                <h3 className="text-2xl font-bold text-white">
                  Looking for specific research?
                </h3>
                <p className="text-white/90">
                  Our team can provide custom research and whitepapers on AI
                  security, cybersecurity, and data engineering topics
                  relevant to your organization.
                </p>
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-white text-indrasol-blue rounded-lg hover:bg-gray-100 transition-colors font-medium flex-1 text-center"
                >
                  Request Custom Research
                </Link>
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

export default WhitePaperSection;















// import React, { useState, useEffect } from "react";
// import {
//   Calendar,
//   Download,
//   FileText,
//   ArrowRight,
//   ChevronRight,
//   Search,
//   Filter,
//   BookOpen,
//   LockKeyhole,
//   Database,
//   Cpu,
//   Bookmark,
//   Shield,
//   RefreshCw,
//   Loader2,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { Navbar } from "@/components/ui/navbar";
// import { Footer } from "@/components/ui/footer";
// import { BackToTop } from "@/components/ui/back-to-top";
// import { supabase } from "@/supabase";

// // Types for white papers
// interface WhitePaper {
//   id: string;
//   title: string;
//   excerpt?: string;
//   coverImage?: string;
//   category: string;
//   author: string;
//   publishDate: string;
//   readTime?: string;
//   slug?: string;
//   featured?: boolean;
//   file_url: string;
//   file_name: string;
//   created_at: string;
// }

// // Default cover images based on category
// const defaultCoverImages: Record<string, string> = {
//   "AI Security": "/whitepaperImage/ai-security.jpg",
//   "Machine Learning": "/whitepaperImage/machine-learning.jpg",
//   "Security Architecture": "/whitepaperImage/security-architecture.jpg",
//   "MLSecOps": "/whitepaperImage/mlsecops.jpg",
//   "AI Ethics": "/whitepaperImage/ai-ethics.jpg",
//   "Cybersecurity": "/whitepaperImage/cybersecurity.jpg",
//   "Default": "/whitepaperImage/scope.png",
// };

// // Categories for filtering
// const categories = [
//   "All",
//   "AI Security",
//   "Machine Learning",
//   "Security Architecture",
//   "MLSecOps",
//   "AI Ethics",
//   "Cybersecurity",
// ];

// // Helper functions for data formatting
// const generateSlug = (title: string): string => {
//   return title
//     .toLowerCase()
//     .replace(/[^\w\s]/gi, '')
//     .replace(/\s+/g, '-');
// };

// const formatDate = (dateString: string): string => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', { 
//     year: 'numeric', 
//     month: 'long',
//     day: 'numeric' 
//   });
// };

// const getMonthYear = (dateString: string): string => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
// };

// const getCoverImage = (category: string): string => {
//   return defaultCoverImages[category] || defaultCoverImages.Default;
// };

// // Generate excerpt from filename if none exists
// const generateExcerpt = (title: string): string => {
//   return `This whitepaper explores ${title} in detail, providing insights and recommendations based on research by Indrasol experts.`;
// };

// // Featured white paper card component
// const FeaturedWhitePaperCard: React.FC<{ whitePaper: WhitePaper }> = ({
//   whitePaper,
// }) => {
//   const navigate = useNavigate();

//   // Handle card click to navigate to whitepaper detail page
//   const handleCardClick = () => {
//     // Open the file directly if it's an external URL
//     if (whitePaper.file_url) {
//       window.open(whitePaper.file_url, '_blank');
//     } else {
//       // Use slug if available, otherwise generate from title
//       const slug = whitePaper.slug || generateSlug(whitePaper.title);
//       navigate(`/components/whitepaper/${slug}`);
//     }
//   };

//   // Use the whitepaper's coverImage if available, otherwise use default based on category
//   const coverImage = whitePaper.coverImage || getCoverImage(whitePaper.category);
  
//   // Format the date for display
//   const publishDate = getMonthYear(whitePaper.created_at);
  
//   // Use the excerpt if available, otherwise generate one
//   const excerpt = whitePaper.excerpt || generateExcerpt(whitePaper.title);

//   return (
//     <div
//       className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer group"
//       onClick={handleCardClick}
//     >
//       <div className="relative h-64 overflow-hidden">
//         <span className="absolute top-4 left-4 bg-indrasol-blue/90 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
//           FEATURED
//         </span>
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
//         <img
//           src={coverImage}
//           alt={whitePaper.title}
//           className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
//         />
//       </div>
//       <div className="p-6 flex flex-col flex-grow">
//         <div className="flex justify-between items-center mb-3">
//           <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
//             {whitePaper.category}
//           </div>
//           <div className="flex items-center text-gray-500 text-xs">
//             <Calendar className="h-3 w-3 mr-1" />
//             {publishDate}
//           </div>
//         </div>
//         <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
//           {whitePaper.title}
//         </h3>
//         <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
//           {excerpt}
//         </p>
//         <div className="pt-4 mt-auto border-t border-gray-100">
//           <div className="flex justify-between items-center">
//             <div className="text-sm text-gray-600">
//               By {whitePaper.author}
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="text-gray-500 text-xs flex items-center">
//                 <BookOpen className="h-3 w-3 mr-1" />
//                 {whitePaper.readTime || "10-15 min read"}
//               </div>
//               <span className="text-indrasol-blue text-sm font-medium flex items-center group-hover:underline">
//                 Read More <ArrowRight className="ml-1 h-4 w-4" />
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Regular white paper card component
// const WhitePaperCard: React.FC<{ whitePaper: WhitePaper }> = ({
//   whitePaper,
// }) => {
//   const navigate = useNavigate();

//   // Handle card click to navigate to whitepaper detail page or open the file
//   const handleCardClick = () => {
//     // Open the file directly if it's an external URL
//     if (whitePaper.file_url) {
//       window.open(whitePaper.file_url, '_blank');
//     } else {
//       // Use slug if available, otherwise generate from title
//       const slug = whitePaper.slug || generateSlug(whitePaper.title);
//       navigate(`/components/whitepaper/${slug}`);
//     }
//   };

//   // Use the whitepaper's coverImage if available, otherwise use default based on category
//   const coverImage = whitePaper.coverImage || getCoverImage(whitePaper.category);
  
//   // Format the date for display
//   const publishDate = getMonthYear(whitePaper.created_at);
  
//   // Use the excerpt if available, otherwise generate one
//   const excerpt = whitePaper.excerpt || generateExcerpt(whitePaper.title);

//   return (
//     <div
//       className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer group"
//       onClick={handleCardClick}
//     >
//       <div className="relative h-48 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
//         <img
//           src={coverImage}
//           alt={whitePaper.title}
//           className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
//         />
//       </div>
//       <div className="p-5 flex flex-col flex-grow">
//         <div className="flex justify-between items-center mb-2">
//           <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
//             {whitePaper.category}
//           </div>
//           <div className="flex items-center text-gray-500 text-xs">
//             <Calendar className="h-3 w-3 mr-1" />
//             {publishDate}
//           </div>
//         </div>
//         <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
//           {whitePaper.title}
//         </h3>
//         <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3">
//           {excerpt}
//         </p>
//         <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
//           <div className="text-xs text-gray-600 line-clamp-1">
//             By {whitePaper.author}
//           </div>
//           <span className="text-indrasol-blue text-xs font-medium flex items-center hover:underline">
//             View Whitepaper <Download className="ml-1 h-3 w-3" />
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Category filter component
// const CategoryFilter: React.FC<{
//   activeCategory: string;
//   setActiveCategory: (category: string) => void;
//   availableCategories: string[];
// }> = ({ activeCategory, setActiveCategory, availableCategories }) => {
//   // Make sure we have "All" as the first option
//   const displayCategories = ['All', ...availableCategories.filter(c => c !== 'All')];
  
//   return (
//     <div className="overflow-x-auto pb-4 mb-6 -mx-4 px-4">
//       <div className="flex space-x-2 min-w-max">
//         {displayCategories.map((category) => (
//           <button
//             key={category}
//             className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
//               activeCategory === category
//                 ? "bg-indrasol-blue text-white shadow-md"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//             onClick={() => setActiveCategory(category)}
//           >
//             {category}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// // White paper search and filter section
// const SearchAndFilter: React.FC<{
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   sortOption: string;
//   setSortOption: (option: string) => void;
// }> = ({ searchQuery, setSearchQuery, sortOption, setSortOption }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 mb-8">
//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="relative flex-grow">
//           <input
//             type="text"
//             placeholder="Search white papers..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue"
//           />
//           <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//         </div>
//         <div className="flex gap-2">
//           <select 
//             className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/20 focus:border-indrasol-blue bg-white"
//             value={sortOption}
//             onChange={(e) => setSortOption(e.target.value)}
//           >
//             <option value="latest">Sort by: Latest</option>
//             <option value="oldest">Sort by: Oldest</option>
//             <option value="title">Sort by: Title (A-Z)</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main white papers section component
// const WhitePaperSection: React.FC = () => {
//   const [whitepapers, setWhitepapers] = useState<WhitePaper[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOption, setSortOption] = useState("latest");
//   const [availableCategories, setAvailableCategories] = useState<string[]>([]);

//   // Fetch whitepapers from Supabase
//   useEffect(() => {
//     const fetchWhitePapers = async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from('whitepapers')
//           .select('*')
//           .order('created_at', { ascending: false });
          
//         if (error) {
//           throw error;
//         }
        
//         // Convert Supabase data to our WhitePaper interface
//         const formattedData = data.map((item: any) => ({
//           id: item.id,
//           title: item.title,
//           author: item.author,
//           category: item.category,
//           created_at: item.created_at,
//           file_url: item.file_url,
//           file_name: item.file_name,
//           publishDate: getMonthYear(item.created_at),
//           // Mark first two as featured for display purposes
//           featured: false,
//         }));
        
//         // Mark the first few items as featured if they exist
//         if (formattedData.length > 0) {
//           formattedData[0].featured = true;
//         }
//         if (formattedData.length > 1) {
//           formattedData[1].featured = true;
//         }
        
//         // Extract unique categories
//         const uniqueCategories = [...new Set(data.map((item: any) => item.category))];
//         setAvailableCategories(uniqueCategories);
        
//         setWhitepapers(formattedData);
//       } catch (err: any) {
//         console.error("Error fetching whitepapers:", err);
//         setError(err.message || "Failed to load whitepapers");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchWhitePapers();
//   }, []);

//   // Apply filters and sorting
//   const filteredAndSortedWhitePapers = React.useMemo(() => {
//     // First filter by category if not "All"
//     let result = activeCategory === "All" 
//       ? whitepapers
//       : whitepapers.filter(wp => wp.category === activeCategory);
    
//     // Then filter by search query if present
//     if (searchQuery) {
//       const lowerQuery = searchQuery.toLowerCase();
//       result = result.filter(wp => 
//         wp.title.toLowerCase().includes(lowerQuery) ||
//         wp.author.toLowerCase().includes(lowerQuery) ||
//         wp.category.toLowerCase().includes(lowerQuery)
//       );
//     }
    
//     // Apply sorting
//     return [...result].sort((a, b) => {
//       if (sortOption === "latest") {
//         return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
//       } else if (sortOption === "oldest") {
//         return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
//       } else if (sortOption === "title") {
//         return a.title.localeCompare(b.title);
//       }
//       return 0;
//     });
//   }, [whitepapers, activeCategory, searchQuery, sortOption]);

//   // Separate featured and regular white papers
//   const featuredWhitePapers = filteredAndSortedWhitePapers.filter(wp => wp.featured);
//   const regularWhitePapers = filteredAndSortedWhitePapers.filter(wp => !wp.featured);

//   return (
//     <>
//       <Navbar />
//       <section className="pt-40 pb-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
//         <div className="container mx-auto px-4">
//           {/* Section header */}
//           <div className="text-center max-w-3xl mx-auto mb-12">
//             <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
//               <span className="text-indrasol-blue font-semibold text-sm">
//                 Technical Resources
//               </span>
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               <span className="text-indrasol-blue">White Papers</span> &
//               Research
//             </h2>
//             <p className="text-lg text-gray-600">
//               In-depth technical analysis, research findings, and best practices
//               for AI security, cybersecurity, and data engineering from our
//               experts.
//             </p>
//           </div>

//           {/* Search and filter */}
//           <SearchAndFilter 
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             sortOption={sortOption}
//             setSortOption={setSortOption}
//           />

//           {/* Loading state */}
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <Loader2 className="h-12 w-12 text-indrasol-blue animate-spin mb-4" />
//               <p className="text-gray-600">Loading whitepapers...</p>
//             </div>
//           ) : error ? (
//             <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center my-8">
//               <p className="font-medium">Error loading whitepapers</p>
//               <p className="text-sm mt-2">{error}</p>
//               <button 
//                 onClick={() => window.location.reload()}
//                 className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm transition-colors"
//               >
//                 Try Again
//               </button>
//             </div>
//           ) : filteredAndSortedWhitePapers.length === 0 ? (
//             <div className="text-center py-12">
//               <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-xl font-bold text-gray-700 mb-2">No whitepapers found</h3>
//               <p className="text-gray-500 mb-4">
//                 {searchQuery 
//                   ? "Try adjusting your search criteria or category filter" 
//                   : "No whitepapers are available in this category yet"}
//               </p>
//               {(searchQuery || activeCategory !== "All") && (
//                 <button 
//                   onClick={() => {
//                     setSearchQuery("");
//                     setActiveCategory("All");
//                   }}
//                   className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
//                 >
//                   Clear Filters
//                 </button>
//               )}
//             </div>
//           ) : (
//             <>
//               {/* Category filter - only show with available categories */}
//               {availableCategories.length > 0 && (
//                 <CategoryFilter
//                   activeCategory={activeCategory}
//                   setActiveCategory={setActiveCategory}
//                   availableCategories={availableCategories}
//                 />
//               )}

//               {/* Featured white papers section */}
//               {featuredWhitePapers.length > 0 && (
//                 <div className="mb-12">
//                   <div className="flex justify-between items-center mb-6">
//                     <h3 className="text-xl font-bold text-gray-900">
//                       Featured White Papers
//                     </h3>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     {featuredWhitePapers.slice(0, 2).map((whitePaper) => (
//                       <FeaturedWhitePaperCard
//                         key={whitePaper.id}
//                         whitePaper={whitePaper}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Regular white papers grid */}
//               <div>
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-xl font-bold text-gray-900">
//                     All White Papers
//                   </h3>
//                   <div className="text-sm text-gray-500">
//                     Showing {regularWhitePapers.length} of{" "}
//                     {whitepapers.length} resources
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {regularWhitePapers.map((whitePaper) => (
//                     <WhitePaperCard key={whitePaper.id} whitePaper={whitePaper} />
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Request white paper CTA */}
//           <div className="mt-16 bg-indrasol-blue rounded-xl p-8 shadow-xl">
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
//               <div className="md:col-span-3 space-y-4">
//                 <h3 className="text-2xl font-bold text-white">
//                   Looking for specific research?
//                 </h3>
//                 <p className="text-white/90">
//                   Our team can provide custom research and white papers on AI
//                   security, cybersecurity, and data engineering topics
//                   relevant to your organization.
//                 </p>
//               </div>
//               <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
//                 <Link
//                   to="/contact"
//                   className="px-6 py-3 bg-white text-indrasol-blue rounded-lg hover:bg-gray-100 transition-colors font-medium flex-1 text-center"
//                 >
//                   Request Custom Research
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <Footer />
//       <BackToTop />
//     </>
//   );
// };

// // Main categories with icons for the capabilities section
// const WhitePaperCategories: React.FC = () => {
//   const categoryIcons = [
//     {
//       category: "AI Security",
//       icon: <LockKeyhole className="h-8 w-8 text-indrasol-blue" />,
//       description:
//         "Securing AI systems from attacks, vulnerabilities, and misuse",
//     },
//     {
//       category: "Machine Learning",
//       icon: <Cpu className="h-8 w-8 text-indrasol-blue" />,
//       description:
//         "Architecture, algorithms, and implementation best practices",
//     },
//     {
//       category: "Security Architecture",
//       icon: <Shield className="h-8 w-8 text-indrasol-blue" />,
//       description: "Designing secure systems and implementing robust controls",
//     },
//     {
//       category: "MLSecOps",
//       icon: <RefreshCw className="h-8 w-8 text-indrasol-blue" />,
//       description: "Integrating security into the ML development lifecycle",
//     },
//     {
//       category: "AI Ethics",
//       icon: <Database className="h-8 w-8 text-indrasol-blue" />,
//       description: "Governance, compliance, and ethical considerations for AI",
//     },
//   ];

//   return (
//     <section className="py-32 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="text-center max-w-3xl mx-auto mb-12">
//           <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
//             <span className="text-indrasol-blue font-semibold text-sm">
//               Research Areas
//             </span>
//           </div>
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             Our White Paper Categories
//           </h2>
//           <p className="text-lg text-gray-600">
//             Explore our research across key areas of AI security and modern
//             system architectures
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {categoryIcons.map((item) => (
//             <div
//               key={item.category}
//               className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-all text-center"
//             >
//               <div className="mx-auto w-16 h-16 bg-indrasol-blue/10 rounded-full flex items-center justify-center mb-4">
//                 {item.icon}
//               </div>
//               <h3 className="text-xl font-bold mb-2">{item.category}</h3>
//               <p className="text-gray-600 mb-4">{item.description}</p>
//               <Link
//                 to={`/resources/whitepapers?category=${encodeURIComponent(
//                   item.category
//                 )}`}
//                 className="text-indrasol-blue font-medium hover:underline flex items-center justify-center"
//               >
//                 View Papers <ChevronRight className="ml-1 h-4 w-4" />
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// // White paper detail page component
// const WhitePaperDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
//   const [whitePaper, setWhitePaper] = useState<WhitePaper | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   // Fetch whitepaper data based on slug
//   useEffect(() => {
//     const fetchWhitePaper = async () => {
//       setLoading(true);
//       try {
//         // First try to find by slug if it's a real slug
//         let query = supabase
//           .from('whitepapers')
//           .select('*');
          
//         // We need to check different ways as the slug could be:
//         // 1. An ID
//         // 2. A generated slug from the title
//         // First try direct match
//         let { data, error } = await query
//           .eq('id', slug)
//           .maybeSingle();
          
//         // If not found by ID, try getting all papers and find by generated slug
//         if (error || !data) {
//           const { data: allPapers, error: allError } = await supabase
//             .from('whitepapers')
//             .select('*');
            
//           if (allError) throw allError;
          
//           // Try to find a whitepaper whose title would generate this slug
//           data = allPapers.find(paper => generateSlug(paper.title) === slug) || null;
//         }
        
//         if (!data) {
//           throw new Error("Whitepaper not found");
//         }
        
//         // Format the data for display
//         const formattedData: WhitePaper = {
//           id: data.id,
//           title: data.title,
//           author: data.author,
//           category: data.category,
//           created_at: data.created_at,
//           file_url: data.file_url,
//           file_name: data.file_name,
//           publishDate: getMonthYear(data.created_at),
//           readTime: "10-15 min read",
//           excerpt: data.excerpt || generateExcerpt(data.title),
//           coverImage: data.coverImage || getCoverImage(data.category),
//         };
        
//         setWhitePaper(formattedData);
//       } catch (err: any) {
//         console.error("Error fetching whitepaper:", err);
//         setError(err.message || "Failed to load whitepaper");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchWhitePaper();
//   }, [slug]);

//   // If we have a file URL, redirect to it directly
//   useEffect(() => {
//     if (whitePaper?.file_url) {
//       window.open(whitePaper.file_url, '_blank');
//       // Navigate back to the whitepapers list
//       navigate('/resources/whitepapers');
//     }
//   }, [whitePaper, navigate]);

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen py-16 bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto">
//             {/* Breadcrumb */}
//             <div className="flex items-center text-sm text-gray-500 mb-8">
//               <Link to="/" className="hover:text-indrasol-blue">
//                 Home
//               </Link>
//               <ChevronRight className="h-4 w-4 mx-2" />
//               <Link to="/resources" className="hover:text-indrasol-blue">
//                 Resources
//               </Link>
//               <ChevronRight className="h-4 w-4 mx-2" />
//               <Link
//                 to="/resources/whitepapers"
//                 className="hover:text-indrasol-blue"
//               >
//                 White Papers
//               </Link>
//               <ChevronRight className="h-4 w-4 mx-2" />
//               <span className="text-gray-700">{loading ? 'Loading...' : whitePaper?.title || 'Not Found'}</span>
//             </div>

//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <Loader2 className="h-12 w-12 text-indrasol-blue animate-spin mb-4" />
//                 <p className="text-gray-600">Loading whitepaper...</p>
//               </div>
//             ) : error || !whitePaper ? (
//               <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center my-8">
//                 <p className="font-medium">Whitepaper not found</p>
//                 <p className="text-sm mt-2">{error || "The requested whitepaper could not be found"}</p>
//                 <Link 
//                   to="/resources/whitepapers"
//                   className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm transition-colors inline-block"
//                 >
//                   Back to Whitepapers
//                 </Link>
//               </div>
//             ) : (
//               <>
//                 {/* Header section */}
//                 <div className="mb-8">
//                   <div className="flex items-center space-x-4 mb-4">
//                     <div className="bg-indrasol-blue/10 text-indrasol-blue text-sm font-semibold px-4 py-1 rounded-full">
//                       {whitePaper.category}
//                     </div>
//                     <div className="flex items-center text-gray-500 text-sm">
//                       <Calendar className="h-4 w-4 mr-1" />
//                       {whitePaper.publishDate}
//                     </div>
//                     <div className="flex items-center text-gray-500 text-sm">
//                       <BookOpen className="h-4 w-4 mr-1" />
//                       {whitePaper.readTime}
//                     </div>
//                   </div>
//                   <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
//                     {whitePaper.title}
//                   </h1>

//                   {/* Author section */}
//                   <div className="flex items-center mb-8">
//                     <div>
//                       <div className="font-bold text-gray-900">Author:</div>
//                       <div className="text-indrasol-blue text-lg">
//                         {whitePaper.author}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Featured image and download card */}
//                 <div className="flex flex-col md:flex-row gap-8 mb-12">
//                   <div className="md:w-2/3">
//                     <div className="rounded-xl overflow-hidden">
//                       <img
//                         src={whitePaper.coverImage}
//                         alt={whitePaper.title}
//                         className="w-full h-auto"
//                       />
//                     </div>
//                   </div>
//                   <div className="md:w-1/3">
//                     <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//                       <h3 className="text-xl font-bold mb-4">
//                         White Paper Details
//                       </h3>
//                       <div className="space-y-4 mb-6">
//                         <div className="flex items-start">
//                           <Calendar className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
//                           <div>
//                             <div className="text-sm font-medium">Published</div>
//                             <div className="text-gray-600">
//                               {whitePaper.publishDate}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-start">
//                           <BookOpen className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
//                           <div>
//                             <div className="text-sm font-medium">Reading Time</div>
//                             <div className="text-gray-600">
//                               {whitePaper.readTime}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-start">
//                           <Bookmark className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
//                           <div>
//                             <div className="text-sm font-medium">Category</div>
//                             <div className="text-gray-600">
//                               {whitePaper.category}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <a 
//                         href={whitePaper.file_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-full bg-indrasol-blue text-white px-4 py-3 rounded-lg hover:bg-indrasol-blue/90 transition-colors flex items-center justify-center font-medium shadow-lg shadow-indrasol-blue/20"
//                       >
//                         <Download className="mr-2 h-5 w-5" />
//                         Download Whitepaper
//                       </a>
//                     </div>
//                   </div>
//                 </div>

//                 {/* White paper content - overview */}
//                 <div className="prose prose-lg max-w-none mb-12">
//                   <h2>Overview</h2>
//                   <p className="text-xl text-gray-700 leading-relaxed mb-6">
//                     {whitePaper.excerpt}
//                   </p>

//                   <p className="mb-4">
//                     This white paper provides a comprehensive analysis of{" "}
//                     {whitePaper.title.toLowerCase()}. It explores the current
//                     challenges, proven methodologies, and strategic approaches that
//                     organizations can implement to enhance their security posture.
//                   </p>
//                 </div>

//                 {/* Back to white papers button */}
//                 <div className="text-center mt-12 mb-16">
//                   <Link
//                     to="/resources/whitepapers"
//                     className="inline-flex items-center px-6 py-3 border-2 border-indrasol-blue text-indrasol-blue rounded-lg hover:bg-indrasol-blue/10 transition-colors"
//                   >
//                     View All White Papers
//                   </Link>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//       <BackToTop />
//     </>
//   );
// };

// export default WhitePaperSection;
// export { WhitePaperDetailPage, WhitePaperCategories };
