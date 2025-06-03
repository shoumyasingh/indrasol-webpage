import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  Search,
  BookOpen,
  Loader2,
  Eye,
  Filter,
  X,
  ChevronDown,
  Grid3X3,
  List,
  Tag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { supabase } from "@/supabase";
import { format, parseISO, subDays, isAfter } from "date-fns";

// Types for search and filters
interface SearchFilters {
  searchTerm: string;
  selectedTags: string[];
  dateRange: string;
  readTimeRange: string;
}

// Simplified whitepaper interface (like blogs)
interface WhitePaper {
  id: string;
  wpTitle: string;
  content: string;        // Required like blogs
  excerpt?: string;
  coverImage?: string;
  wpCategory: string;
  wpAuthor: string;
  authorRole?: string;
  publishDate: string;
  createdAt: string; // Add this for accurate date filtering
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

// Helper function to extract the first image from various sources
const extractCoverImage = (whitepaper: any): string => {
  const defaultImage = `/api/placeholder/800/400?text=${encodeURIComponent(whitepaper.wpTitle)}`;
  
  // 1. Check document_structure for first image (priority)
  if (whitepaper.document_structure) {
    try {
      const structure = JSON.parse(whitepaper.document_structure);
      
      // Look for images in the structure
      if (structure.images && Array.isArray(structure.images) && structure.images.length > 0) {
        const firstImage = structure.images[0];
        if (firstImage.src) return normalizeImageUrl(firstImage.src);
        if (firstImage.placeholder) return normalizeImageUrl(firstImage.placeholder);
      }
      
      // Alternative: look for images in sections
      if (structure.sections && Array.isArray(structure.sections)) {
        for (const section of structure.sections) {
          if (section.images && Array.isArray(section.images) && section.images.length > 0) {
            const firstImage = section.images[0];
            if (firstImage.src) return normalizeImageUrl(firstImage.src);
            if (firstImage.placeholder) return normalizeImageUrl(firstImage.placeholder);
          }
        }
      }
    } catch (e) {
      console.warn('Error parsing document structure for whitepaper:', whitepaper.id, e);
    }
  }
  
  // 2. Check if there's a dedicated coverImage field
  if (whitepaper.coverImage) {
    return normalizeImageUrl(whitepaper.coverImage);
  }
  
  // 3. Extract from markdown content (look for first image)
  if (whitepaper.markdown_content || whitepaper.content) {
    const content = whitepaper.markdown_content || whitepaper.content;
    
    // Try markdown image syntax first: ![alt](url)
    const markdownImgMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (markdownImgMatch && markdownImgMatch[2]) {
      return normalizeImageUrl(markdownImgMatch[2]);
    }
    
    // Fallback to HTML img tags
    const htmlImgMatch = content.match(/<img[^>]+src="([^"]+)"[^>]*>/);
    if (htmlImgMatch && htmlImgMatch[1]) {
      return normalizeImageUrl(htmlImgMatch[1]);
    }
  }
  
  // 4. Fallback to category-based default images
  return getCoverImage(whitepaper.wpCategory);
};

// Helper function to normalize image URLs
const normalizeImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Handle base64 images
  if (url.startsWith('data:')) {
    return url;
  }
  
  // Handle relative URLs
  if (url.startsWith('/')) {
    return url;
  }
  
  // Handle Supabase signed URLs - convert to public URLs
  if (url.includes('storage/v1/object/sign')) {
    return url.replace('/storage/v1/object/sign/', '/storage/v1/object/public/');
  }
  
  return url;
};

const getCoverImage = (wpCategory: string): string => {
  return defaultCoverImages[wpCategory] || defaultCoverImages.Default;
};

const generateExcerpt = (title: string): string => {
  return `This whitepaper explores ${title} in detail, providing insights and recommendations based on research by Indrasol experts.`;
};

// Function to generate read time estimate
const calculateReadTime = (content: string): string => {
  // Average reading speed is about 200-250 words per minute
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

// Modern search bar with filters component
const SearchAndFilters: React.FC<{
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  availableTags: string[];
}> = ({ filters, setFilters, availableTags }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  // Close tag dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.tag-dropdown')) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters = filters.selectedTags.length > 0 || filters.dateRange !== "all" || filters.readTimeRange !== "all";
  const activeFilterCount = filters.selectedTags.length + 
    (filters.dateRange !== "all" ? 1 : 0) + 
    (filters.readTimeRange !== "all" ? 1 : 0);

  const clearAllFilters = () => {
    setFilters({
      searchTerm: "",
      selectedTags: [],
      dateRange: "all",
      readTimeRange: "all"
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    
    setFilters({ ...filters, selectedTags: newTags });
  };

  const removeTag = (tagToRemove: string) => {
    setFilters({
      ...filters,
      selectedTags: filters.selectedTags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="mb-8">
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search whitepapers by title, content, author, or category..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl text-gray-900 placeholder-gray-400 focus:border-indrasol-blue focus:outline-none focus:shadow-lg focus:shadow-indrasol-blue/10 transition-all duration-300"
          />
          {filters.searchTerm && (
            <button
              onClick={() => setFilters({ ...filters, searchTerm: "" })}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toggle and Active Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${
            showFilters || hasActiveFilters
              ? "border-indrasol-blue/30 bg-gradient-to-r from-indrasol-blue/10 to-purple-500/5 text-indrasol-blue shadow-lg shadow-indrasol-blue/10"
              : "border-gray-200/50 bg-white/80 hover:border-indrasol-blue/20 text-gray-600 hover:shadow-md"
          }`}
        >
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-gradient-to-r from-indrasol-blue to-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full shadow-sm"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            
            {filters.dateRange !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm rounded-full shadow-sm">
                {filters.dateRange === "7" ? "Last 7 days" : 
                 filters.dateRange === "30" ? "Last 30 days" : 
                 filters.dateRange === "90" ? "Last 3 months" : filters.dateRange}
                <button
                  onClick={() => setFilters({ ...filters, dateRange: "all" })}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.readTimeRange !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-full shadow-sm">
                {filters.readTimeRange === "5" ? "< 5 mins" : 
                 filters.readTimeRange === "10" ? "5-10 mins" : 
                 filters.readTimeRange === "10+" ? "> 10 mins" : filters.readTimeRange}
                <button
                  onClick={() => setFilters({ ...filters, readTimeRange: "all" })}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
        showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 space-y-6 border border-gray-200/50 shadow-lg">
          {/* Tags Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4 text-indrasol-blue" />
              Categories
            </h4>
            <div className="relative tag-dropdown">
              <button
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-indrasol-blue/30 transition-colors"
              >
                <span className="text-gray-700">
                  {filters.selectedTags.length === 0 
                    ? "Select categories..." 
                    : `${filters.selectedTags.length} selected`}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showTagDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showTagDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  {availableTags.map((tag, index) => (
                    <label
                      key={tag}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        index !== availableTags.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="w-4 h-4 text-indrasol-blue border-gray-300 rounded focus:ring-indrasol-blue focus:ring-2"
                      />
                      <span className="text-gray-700 font-medium">{tag}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indrasol-blue" />
              Date Published
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: "all", label: "All time" },
                { value: "7", label: "Last 7 days" },
                { value: "30", label: "Last 30 days" },
                { value: "90", label: "Last 3 months" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilters({ ...filters, dateRange: option.value })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filters.dateRange === option.value
                      ? "bg-gradient-to-r from-indrasol-blue to-blue-600 text-white shadow-md transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-indrasol-blue/30"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Read Time Filter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indrasol-blue" />
              Read Time
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: "all", label: "Any length" },
                { value: "5", label: "< 5 mins" },
                { value: "10", label: "5-10 mins" },
                { value: "10+", label: "> 10 mins" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilters({ ...filters, readTimeRange: option.value })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filters.readTimeRange === option.value
                      ? "bg-gradient-to-r from-indrasol-blue to-blue-600 text-white shadow-md transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-indrasol-blue/30"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Featured whitepaper card component (matching blog style)
const FeaturedWhitePaperCard: React.FC<{ whitePaper: WhitePaper }> = ({
  whitePaper,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const slug = whitePaper.slug || generateSlug(whitePaper.wpTitle);
    navigate(`/resources/whitepaper/${slug}`);
  };

  const coverImage = whitePaper.coverImage; // Use the extracted cover image directly
  const publishDate = getMonthYear(whitePaper.created_at);
  const excerpt = whitePaper.excerpt || generateExcerpt(whitePaper.wpTitle);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative h-64 overflow-hidden">
        <span className="absolute top-4 left-4 bg-indrasol-blue/90 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          {whitePaper.wpCategory}
        </span>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <BookOpen className="h-6 w-6 text-indrasol-blue" />
          </div>
        </div>
        <img
          src={coverImage}
          alt={whitePaper.wpTitle}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getCoverImage(whitePaper.wpCategory); // Fallback to category default
          }}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-end items-center mb-3">
          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {publishDate}
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {whitePaper.readTime || "10-15 min read"}
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
          {whitePaper.wpTitle}
        </h3>
        {/* <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {excerpt}
        </p> */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <div>
              <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
                {whitePaper.wpAuthor}
              </div>
              {whitePaper.authorRole && (
                <div className="text-xs text-gray-500 mt-1">{whitePaper.authorRole}</div>
              )}
            </div>
          </div>
          <div className="flex items-center">
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
    const slug = whitePaper.slug || generateSlug(whitePaper.wpTitle);
    navigate(`/resources/whitepaper/${slug}`);
  };

  const coverImage = whitePaper.coverImage; // Use the extracted cover image directly
  const publishDate = getMonthYear(whitePaper.created_at);
  const excerpt = whitePaper.excerpt || generateExcerpt(whitePaper.wpTitle);

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
          src={coverImage}
          alt={whitePaper.wpTitle}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getCoverImage(whitePaper.wpCategory); // Fallback to category default
          }}
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
            {whitePaper.wpCategory}
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {publishDate}
          </div>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
          {whitePaper.wpTitle}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
          {excerpt}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-xs font-medium text-gray-700">{whitePaper.wpAuthor}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" />
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

// View Toggle Component
const ViewToggle: React.FC<{
  viewMode: "gallery" | "list";
  setViewMode: (mode: "gallery" | "list") => void;
}> = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => setViewMode("gallery")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          viewMode === "gallery"
            ? "bg-white text-indrasol-blue shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
        title="Gallery view"
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="hidden sm:inline">Gallery</span>
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          viewMode === "list"
            ? "bg-white text-indrasol-blue shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
        title="List view"
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  );
};

// List view whitepaper card component
const WhitePaperListCard: React.FC<{ whitePaper: WhitePaper }> = ({ whitePaper }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const slug = whitePaper.slug || generateSlug(whitePaper.wpTitle);
    navigate(`/resources/whitepaper/${slug}`);
  };

  const coverImage = whitePaper.coverImage; // Use the extracted cover image directly
  const publishDate = getMonthYear(whitePaper.created_at);
  const excerpt = whitePaper.excerpt || generateExcerpt(whitePaper.wpTitle);

  return (
    <div
      className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="flex gap-6">
        {/* Thumbnail */}
        <div className="hidden md:block flex-shrink-0">
          <div className="relative w-48 h-32 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/90 rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                <Eye className="h-4 w-4 text-indrasol-blue" />
              </div>
            </div>
            <img
              src={coverImage}
              alt={whitePaper.wpTitle}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getCoverImage(whitePaper.wpCategory); // Fallback to category default
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
              {whitePaper.wpCategory}
            </span>
            <div className="flex items-center gap-3 text-gray-500 text-xs">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {publishDate}
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {whitePaper.readTime || "10-15 min read"}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indrasol-blue transition-colors">
            {whitePaper.wpTitle}
          </h3>
          
          {/* Only show excerpt if it's not "No excerpt available" */}
          {excerpt && excerpt !== "No excerpt available" && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {excerpt}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">{whitePaper.wpAuthor}</span>
              {whitePaper.authorRole && (
                <span className="text-xs text-gray-500">{whitePaper.authorRole}</span>
              )}
            </div>
            <span className="text-indrasol-blue text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              Read article
              <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
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
    <div className="overflow-x-auto -mx-4 px-4 flex-1">
      <div className="flex items-center space-x-2 min-w-max">
        <span className="text-sm font-medium text-gray-600 mr-2">Categories:</span>
        {displayCategories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
              activeCategory === category
                ? "bg-indrasol-blue text-white shadow-md transform scale-105"
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

// Main whitepaper section component
const WhitePaperSection: React.FC = () => {
  const [whitepapers, setWhitepapers] = useState<WhitePaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    selectedTags: [],
    dateRange: "all",
    readTimeRange: "all"
  });
  const [viewMode, setViewMode] = useState<"gallery" | "list">("gallery");

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
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Raw whitepaper data from database:', data);
        
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
          const readTime = item.readTime || calculateReadTime(item.content || '');
          
          // Extract cover image from document first, then fallback to category default
          const coverImage = extractCoverImage(item);
          
          // Handle wpCategory with fallback logic (same as in WhitepaperDetailPage)
          const categoryValue = item.wpCategory || (item as any)['category'] || 'General';
          
          return {
            id: item.id,
            wpTitle: item.wpTitle,
            content: item.content || '',
            excerpt: item.excerpt || generateExcerpt(item.wpTitle),
            coverImage: coverImage,
            wpCategory: categoryValue,
            wpAuthor: item.wpAuthor || 'Indrasol Team',
            authorRole: '', // Not available in our database
            publishDate: formattedDate,
            createdAt: item.created_at, // Store original date for filtering
            readTime: readTime,
            slug: item.slug || generateSlug(item.wpTitle),
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
        
        // Extract unique categories - filter out null/undefined values
        const uniqueCategories = [...new Set(
          formattedData
            .map(item => item.wpCategory)
            .filter(category => category && category !== 'General' && category.trim() !== '')
        )].sort();
        
        // Add 'General' back if any whitepapers actually have it as a category
        const hasGeneralCategory = formattedData.some(item => item.wpCategory === 'General');
        if (hasGeneralCategory) {
          uniqueCategories.push('General');
        }
        
        console.log('Available categories:', uniqueCategories);
        
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
      : whitepapers.filter(wp => wp.wpCategory === activeCategory);
    
    // Search filter - enhanced to include better category matching
    if (filters.searchTerm) {
      const query = filters.searchTerm.toLowerCase().trim();
      result = result.filter(wp => {
        const titleMatch = wp.wpTitle.toLowerCase().includes(query);
        const authorMatch = wp.wpAuthor.toLowerCase().includes(query);
        const categoryMatch = wp.wpCategory.toLowerCase().includes(query);
        const excerptMatch = wp.excerpt && wp.excerpt.toLowerCase().includes(query);
        const contentMatch = wp.content && wp.content.toLowerCase().includes(query);
        
        return titleMatch || authorMatch || categoryMatch || excerptMatch || contentMatch;
      });
    }
    
    // Tag filter (using categories as tags) - improved logic
    if (filters.selectedTags.length > 0) {
      result = result.filter(wp => filters.selectedTags.includes(wp.wpCategory));
    }
    
    // Date filter
    if (filters.dateRange !== "all") {
      const daysAgo = parseInt(filters.dateRange);
      const filterDate = subDays(new Date(), daysAgo);
      result = result.filter(wp => {
        const wpDate = parseISO(wp.createdAt);
        return isAfter(wpDate, filterDate);
      });
    }
    
    // Read time filter
    if (filters.readTimeRange !== "all") {
      result = result.filter(wp => {
        const readTimeStr = wp.readTime || "10 min read";
        const readTime = parseInt(readTimeStr);
        
        if (filters.readTimeRange === "5" && readTime >= 5) return false;
        if (filters.readTimeRange === "10" && (readTime < 5 || readTime > 10)) return false;
        if (filters.readTimeRange === "10+" && readTime <= 10) return false;
        
        return true;
      });
    }
    
    const sortedResult = [...result].sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortOption === "title") {
        return a.wpTitle.localeCompare(b.wpTitle);
      }
      return 0;
    });
    
    return sortedResult;
  }, [whitepapers, activeCategory, filters, sortOption]);

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
          <SearchAndFilters 
            filters={filters}
            setFilters={setFilters}
            availableTags={availableCategories}
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
              {/* Results counter */}
              {(filters.searchTerm || filters.selectedTags.length > 0 || 
                filters.dateRange !== "all" || filters.readTimeRange !== "all") && (
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-indrasol-blue/5 to-purple-500/5 backdrop-blur-sm border border-indrasol-blue/10 rounded-xl px-6 py-4">
                    <p className="text-gray-700">
                      <span className="font-semibold text-indrasol-blue">{filteredAndSortedWhitePapers.length}</span>
                      {filteredAndSortedWhitePapers.length === 1 ? ' whitepaper' : ' whitepapers'} found
                      {filters.searchTerm && (
                        <span> for "<span className="font-medium">{filters.searchTerm}</span>"</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Category filter and View Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                {/* Category Filter */}
                {availableCategories.length > 0 && (
                  <CategoryFilter
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    availableCategories={availableCategories}
                  />
                )}
                
                {/* View Toggle - Debug: Always show */}
                <div className="flex items-center gap-2">
                  
                  <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                </div>
              </div>

              {/* Whitepapers content */}
              {filteredAndSortedWhitePapers.length === 0 ? (
                <EmptyState message="No whitepapers match your search criteria. Try adjusting your filters." />
              ) : (
                <>
                  {/* Gallery View */}
                  {viewMode === "gallery" ? (
                    <>
                      {featuredWhitePapers.length > 0 && (
                        <div className="mb-12">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                              Featured Articles
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {featuredWhitePapers.slice(0, 2).map((whitePaper, index) => (
                              <div
                                key={whitePaper.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.2}s` }}
                              >
                                <FeaturedWhitePaperCard whitePaper={whitePaper} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Regular whitepapers grid */}
                      {regularWhitePapers.length > 0 && (
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">All Articles</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {regularWhitePapers.map((whitePaper, index) => (
                              <div
                                key={whitePaper.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                              >
                                <WhitePaperCard whitePaper={whitePaper} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* List View */
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                          All Articles ({filteredAndSortedWhitePapers.length})
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {filteredAndSortedWhitePapers.map((whitePaper, index) => (
                          <div
                            key={whitePaper.id}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <WhitePaperListCard whitePaper={whitePaper} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
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

