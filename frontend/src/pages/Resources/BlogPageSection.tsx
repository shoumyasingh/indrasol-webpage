import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  ChevronRight,
  Eye,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { supabase } from "@/supabase";
import { format, parseISO } from "date-fns";

// Types for blog posts
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  authorRole: string;
  publishDate: string;
  readTime: string;
  slug: string;
  featured?: boolean;
}

// Function to generate read time estimate
const calculateReadTime = (content: string): string => {
  // Average reading speed is about 200-250 words per minute
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

// Helper function to extract the first image from various sources
const extractCoverImage = (blog: any): string => {
  const defaultImage = `/api/placeholder/800/400?text=${encodeURIComponent(blog.title)}`;
  
  // 1. Check if there's a dedicated cover_image field
  if (blog.cover_image) {
    return blog.cover_image;
  }
  
  // 2. Check document_structure for first image
  if (blog.document_structure) {
    try {
      const structure = JSON.parse(blog.document_structure);
      
      // Look for images in the structure
      if (structure.images && Array.isArray(structure.images) && structure.images.length > 0) {
        const firstImage = structure.images[0];
        if (firstImage.src) return firstImage.src;
        if (firstImage.placeholder) return firstImage.placeholder;
      }
      
      // Alternative: look for images in sections
      if (structure.sections && Array.isArray(structure.sections)) {
        for (const section of structure.sections) {
          if (section.images && Array.isArray(section.images) && section.images.length > 0) {
            const firstImage = section.images[0];
            if (firstImage.src) return firstImage.src;
            if (firstImage.placeholder) return firstImage.placeholder;
          }
        }
      }
    } catch (e) {
      console.warn('Error parsing document structure for blog:', blog.id, e);
    }
  }
  
  // 3. Extract from markdown content (look for first image)
  if (blog.markdown_content || blog.content) {
    const content = blog.markdown_content || blog.content;
    
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
  
  return defaultImage;
};

// Helper function to normalize image URLs (especially Supabase URLs)
const normalizeImageUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's a Supabase storage URL, ensure it's a public URL
  if (url.includes('storage/v1/object/')) {
    // Convert signed URLs to public URLs if needed
    if (url.includes('/sign/')) {
      return url.replace('/storage/v1/object/sign/', '/storage/v1/object/public/');
    }
    // Ensure it's a proper public URL format
    else if (!url.includes('/public/')) {
      // Extract the bucket and path from the URL
      const urlParts = url.split('/storage/v1/object/');
      if (urlParts.length > 1) {
        const pathPart = urlParts[1];
        if (!pathPart.startsWith('public/')) {
          return url.replace('/storage/v1/object/', '/storage/v1/object/public/');
        }
      }
    }
  }
  
  return url;
};

// Featured blog post card component
const FeaturedBlogCard: React.FC<{ blog: BlogPost }> = ({ blog }) => {
  const navigate = useNavigate();

  // Handle card click to navigate to blog detail page
  const handleCardClick = () => {
    navigate(`/Resources/blog/${blog.slug}`);
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative h-64 overflow-hidden">
        <span className="absolute top-4 left-4 bg-indrasol-blue/90 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
          {blog.category}
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
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `/api/placeholder/800/400?text=${encodeURIComponent(blog.title)}`;
          }}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-end items-center mb-3">
          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {blog.publishDate}
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {blog.readTime}
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-indrasol-blue transition-colors">
          {blog.title}
        </h3>
        {/* <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {blog.excerpt}
        </p> */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <div>
              <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full">
                {blog.author}
              </div>
              {blog.authorRole && (
                <div className="text-xs text-gray-500 mt-1">{blog.authorRole}</div>
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

// Regular blog post card component
const BlogCard: React.FC<{ blog: BlogPost }> = ({ blog }) => {
  const navigate = useNavigate();

  // Handle card click to navigate to blog detail page
  const handleCardClick = () => {
    navigate(`/Resources/blog/${blog.slug}`);
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
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `/api/placeholder/800/400?text=${encodeURIComponent(blog.title)}`;
          }}
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
          <div>
            <span className="text-xs font-medium text-gray-700">{blog.author}</span>
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

// Empty state component
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

// Loading state component
const LoadingState: React.FC = () => (
  <div className="text-center py-16">
    <Loader2 className="h-12 w-12 mx-auto text-indrasol-blue animate-spin mb-4" />
    <h3 className="text-lg font-medium text-gray-600">Loading blog posts...</h3>
  </div>
);

// Category filter component
const CategoryFilter: React.FC<{
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
}> = ({ activeCategory, setActiveCategory, categories }) => {
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
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Fetch blogs from Supabase
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        
        // Fetch blogs from Supabase, ordered by creation date (newest first)
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform the data to match our BlogPost interface
          const transformedBlogs: BlogPost[] = data.map((blog, index) => {
            // Format the date
            let formattedDate;
            try {
              formattedDate = format(parseISO(blog.created_at), 'MMMM d, yyyy');
            } catch (e) {
              formattedDate = 'Unknown date';
            }
            
            // Extract the first image from content for cover image, or use placeholder
            let coverImage = extractCoverImage(blog);
            
            return {
              id: blog.id,
              title: blog.title,
              excerpt: blog.excerpt || 'No excerpt available',
              coverImage,
              category: blog.category || 'Uncategorized',
              author: blog.author || 'Indrasol Team',
              authorRole: '', // Not available in our database
              publishDate: formattedDate,
              readTime: calculateReadTime(blog.content || ''),
              slug: blog.slug,
              featured: index < 2 // Mark the first 2 as featured for now
            };
          });
          
          setBlogs(transformedBlogs);
          
          // Extract unique categories for filter
          const uniqueCategories = [...new Set(data.map(blog => blog.category || 'Uncategorized'))];
          setCategories(['All', ...uniqueCategories]);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
    
    // Set up real-time subscription for new blogs
    const subscription = supabase
      .channel('blogs-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, fetchBlogs)
      .subscribe();
    
    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Filter blogs based on selected category
  const filteredBlogs =
    activeCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === activeCategory);

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

          {loading ? (
            <LoadingState />
          ) : error ? (
            <EmptyState message={error} />
          ) : blogs.length === 0 ? (
            <EmptyState message="No blog posts found" />
          ) : (
            <>
              {/* Category filter */}
              <CategoryFilter
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                categories={categories}
              />

              {/* Featured blogs section (only show if we have featured blogs in the filtered results) */}
              {featuredBlogs.length > 0 && (
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Featured Articles
                    </h3>
                    <Link
                      to="/Resources/blogs2"
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
                {/* <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Latest Articles</h3>
                  <Link
                    to="/Resources/blogs2"
                    className="text-indrasol-blue font-medium text-sm flex items-center hover:underline"
                  >
                    View all <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div> */}
                {/* {regularBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {regularBlogs.slice(0, 6).map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No regular blog posts found" />
                )} */}

                {/* View more button - only show if we have more than 6 regular blogs */}
                {/* {regularBlogs.length > 6 && (
                  <div className="text-center mt-12 mb-8">
                    <Link
                      to="/Resources/blogs2"
                      className="group inline-flex items-center px-6 py-3 bg-indrasol-blue text-white rounded-lg hover:bg-indrasol-blue/90 transition-colors shadow-lg shadow-indrasol-blue/20"
                    >
                      Explore All Articles
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                )} */}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
      <BackToTop />
    </>
  );
};

export default BlogPageSection;