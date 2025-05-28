import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share, 
  X, 
  Linkedin, 
  Loader2, 
  User,
  BookOpen,
  Tag,
  ChevronRight,
  Eye,
  MessageCircle,
  Heart
} from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { BackToTop } from '@/components/ui/back-to-top';
import { supabase } from '@/supabase';
import { format, parseISO } from 'date-fns';
import { EnhancedMarkdownRenderer } from '@/components/EnhancedMarkdownRenderer';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  markdown_content?: string;
  markdown_url?: string;
  author: string;
  author_desc: string;
  author_profile_url: string;
  category: string;
  publishDate: string;
  readTime: string;
  slug: string;
  featured_image?: string;
  tags?: string[];
  document_structure?: string;
  word_count?: number;
  has_images?: boolean;
  has_tables?: boolean;
  has_code?: boolean;
  created_at: string;
  updated_at?: string;
}

interface DocumentStructure {
  sections: unknown[];
  headings: Array<{ level: number; text: string; id: string }>;
  tableOfContents: Array<{ id: string; text: string; level: number }>;
  totalWordCount: number;
  estimatedReadTime: string;
  hasImages: boolean;
  hasTables: boolean;
  hasCode: boolean;
}

const TableOfContents: React.FC<{ structure: DocumentStructure | null }> = ({ structure }) => {
  const [activeSection, setActiveSection] = useState<string>('');

  // Helper function to generate heading IDs consistently (same as in EnhancedMarkdownRenderer)
  const generateHeadingId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!structure?.tableOfContents) return;

      const sections = structure.tableOfContents.map(item => {
        // Use the same ID generation logic
        const id = generateHeadingId(item.text);
        return {
          id,
          offsetTop: document.getElementById(id)?.offsetTop || 0
        };
      });

      const scrollPosition = window.scrollY + 120; // Account for sticky navbar
      
      // Find the current active section
      let currentActiveSection = '';
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].offsetTop) {
          currentActiveSection = sections[i].id;
          break;
        }
      }
      
      setActiveSection(currentActiveSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [structure]);

  if (!structure?.tableOfContents?.length) return null;

  return (
    <div className="sticky top-24 hidden lg:block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-4 w-4 mr-2 text-indrasol-blue" />
          Table of Contents
        </h3>
        <nav className="space-y-2">
          {structure.tableOfContents.map((item) => {
            const headingId = generateHeadingId(item.text);
            
            // Clean the display text by removing markdown formatting
            const displayText = item.text
              .replace(/^__(.+)__$/, '$1') // Remove __text__
              .replace(/^\*\*(.+)\*\*$/, '$1') // Remove **text**
              .replace(/^_(.+)_$/, '$1') // Remove _text_
              .replace(/^\*(.+)\*$/, '$1') // Remove *text*
              .replace(/\\\-/g, '-') // Replace \- with -
              .trim();
            
            return (
              <a
                key={headingId}
                href={`#${headingId}`}
                className={`block text-sm transition-all duration-200 hover:bg-gray-50 rounded px-2 py-1 ${
                  activeSection === headingId
                    ? 'text-indrasol-blue font-medium border-l-2 border-indrasol-blue pl-3 bg-indrasol-blue/5'
                    : 'text-gray-600 hover:text-gray-900 border-l-2 border-transparent hover:border-gray-300 pl-3'
                } ${item.level > 2 ? 'ml-4' : ''} ${item.level > 3 ? 'ml-8' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Clicking TOC item:', item.text);
                  
                  // Primary method: find by text content (more reliable)
                  const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                  console.log('All headings found:', Array.from(allHeadings).map(h => ({ 
                    tag: h.tagName, 
                    id: h.id, 
                    text: h.textContent?.trim() 
                  })));
                  
                  // Try exact match first with cleaned text
                  let element = Array.from(allHeadings).find(h => 
                    h.textContent?.trim() === displayText ||
                    h.textContent?.trim() === item.text.trim()
                  ) as HTMLElement;
                  
                  // If no exact match, try partial match with both original and cleaned text
                  if (!element) {
                    element = Array.from(allHeadings).find(h => {
                      const headingText = h.textContent?.trim().toLowerCase() || '';
                      const originalTocText = item.text.toLowerCase();
                      const cleanedTocText = displayText.toLowerCase();
                      
                      return headingText.includes(cleanedTocText) ||
                             headingText.includes(originalTocText) ||
                             cleanedTocText.includes(headingText) ||
                             originalTocText.includes(headingText);
                    }) as HTMLElement;
                  }
                  
                  // Fallback: try by ID
                  if (!element) {
                    element = document.getElementById(headingId);
                  }
                  
                  console.log('Found element:', element, 'Text:', element?.textContent?.trim());
                  
                  if (element) {
                    // Scroll with offset to account for sticky navbar
                    const offsetTop = element.offsetTop - 100;
                    console.log('Scrolling to offset:', offsetTop);
                    window.scrollTo({
                      top: offsetTop,
                      behavior: 'smooth'
                    });
                    
                    // Update URL hash if element has an ID
                    if (element.id) {
                      window.history.pushState(null, '', `#${element.id}`);
                    }
                  } else {
                    console.log('No matching element found for original:', item.text, 'or cleaned:', displayText);
                  }
                }}
              >
                <span className="flex items-center">
                  {item.level === 1 && <span className="w-2 h-2 bg-indrasol-blue rounded-full mr-2 flex-shrink-0"></span>}
                  {item.level === 2 && <span className="w-1.5 h-1.5 bg-indrasol-blue/70 rounded-full mr-2 flex-shrink-0"></span>}
                  {item.level >= 3 && <span className="w-1 h-1 bg-indrasol-blue/50 rounded-full mr-2 flex-shrink-0"></span>}
                  {displayText}
                </span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [documentStructure, setDocumentStructure] = useState<DocumentStructure | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  // Helper function to generate heading IDs consistently
  const generateHeadingId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  };

  // Remove embedded TOC from markdown content
  const removeEmbeddedTOC = (markdown: string): string => {
    let cleaned = markdown;
    
    // More specific patterns to match the TOC format in your content
    const tocPatterns = [
      // Match "## Table of Contents" followed by bullet points with links
      /^#{1,6}\s*Table of Contents\s*\n((?:\s*[-*+]\s*\[.*?\]\(.*?\)\s*\n)*)/gmi,
      // Match standalone "Table of Contents" section
      /^Table of Contents\s*\n((?:\s*[-*+]\s*\[.*?\]\(.*?\)\s*\n)*)/gmi,
      // Match individual TOC bullet points with links
      /^\s*[-*+]\s*\[.*?\]\(#.*?\)\s*$/gmi,
      // Match the specific format from your image
      /^\s*•\s*\[.*?\]\(.*?\)\s*$/gmi,
    ];
    
    console.log('Original markdown length:', markdown.length);
    
    tocPatterns.forEach((pattern, index) => {
      const before = cleaned.length;
      cleaned = cleaned.replace(pattern, '');
      const after = cleaned.length;
      if (before !== after) {
        console.log(`Pattern ${index} removed ${before - after} characters`);
      }
    });
    
    // Clean up extra newlines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    
    console.log('Cleaned markdown length:', cleaned.length);
    console.log('First 500 chars of cleaned markdown:', cleaned.substring(0, 500));
    
    return cleaned.trim();
  };

  // Generate document structure from markdown content
  const generateDocumentStructure = (markdown: string): DocumentStructure => {
    console.log('Analyzing markdown content:', markdown.substring(0, 500) + '...');
    
    const lines = markdown.split('\n');
    const headings: Array<{ level: number; text: string; id: string }> = [];
    const tableOfContents: Array<{ id: string; text: string; level: number }> = [];
    let totalWordCount = 0;
    let hasImages = false;
    let hasTables = false;
    let hasCode = false;

    lines.forEach((line, index) => {
      // Check for images
      if (line.includes('![')) hasImages = true;
      
      // Check for tables
      if (line.includes('|') && line.match(/\|.*\|/)) hasTables = true;
      
      // Check for code blocks
      if (line.startsWith('```')) hasCode = true;
      
      // Count words
      const words = line.split(/\s+/).filter(word => word.length > 0);
      totalWordCount += words.length;
      
      // Process headings - more robust regex
      const headingMatch = line.match(/^(#{1,6})\s*(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        const id = generateHeadingId(text);
        
        console.log(`Found heading at line ${index}: Level ${level}, Text: "${text}", ID: "${id}"`);
        
        headings.push({ level, text, id });
        
        // Add to TOC if level <= 4
        if (level <= 4) {
          tableOfContents.push({ id, text, level });
        }
      }
    });

    console.log('Generated headings:', headings);
    console.log('Generated TOC:', tableOfContents);

    // Calculate estimated read time (200 words per minute)
    const readTimeMinutes = Math.max(1, Math.ceil(totalWordCount / 200));
    const estimatedReadTime = `${readTimeMinutes} min read`;

    return {
      sections: [], // We don't need sections for TOC
      headings,
      tableOfContents,
      totalWordCount,
      estimatedReadTime,
      hasImages,
      hasTables,
      hasCode
    };
  };

  // Handle URL hash navigation on page load
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const offsetTop = element.offsetTop - 100;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }, 500); // Delay to ensure content is rendered
      }
    };

    // Handle hash navigation on page load
    handleHashNavigation();
    
    // Handle hash changes
    window.addEventListener('hashchange', handleHashNavigation);
    
    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, [markdownContent]);

  // Debug: Check if headings are rendered with correct IDs
  useEffect(() => {
    if (markdownContent && documentStructure) {
      setTimeout(() => {
        console.log('Checking rendered headings...');
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        console.log('All headings found on page:', Array.from(allHeadings).map(h => ({ 
          tag: h.tagName, 
          id: h.id, 
          text: h.textContent?.trim(),
          hasId: !!h.id 
        })));
        
        // Check if TOC items match rendered headings
        documentStructure.tableOfContents.forEach(tocItem => {
          const element = document.getElementById(tocItem.id);
          console.log(`TOC item "${tocItem.text}" (ID: ${tocItem.id}) -> Element found:`, !!element);
        });
      }, 1000); // Wait for content to render
    }
  }, [markdownContent, documentStructure]);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) {
          throw new Error('Blog post not found');
        }
        
        if (data) {
          let formattedDate;
          try {
            formattedDate = format(parseISO(data.created_at), 'MMMM d, yyyy');
          } catch (e) {
            formattedDate = 'Unknown date';
          }
          
          const content = data.markdown_content || data.content || '';
          const wordCount = data.word_count || content.split(/\s+/).length;
          const readTime = data.readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
          
          setBlog({
            id: data.id,
            title: data.title,
            content: data.content,
            markdown_content: data.markdown_content,
            markdown_url: data.markdown_url,
            author: data.author || 'Indrasol Team',
            author_desc: data.author_desc || '',
            author_profile_url: data.author_profile_url || '',
            category: data.category || 'Uncategorized',
            publishDate: formattedDate,
            readTime: readTime,
            slug: data.slug,
            featured_image: data.featured_image,
            tags: data.tags || [],
            document_structure: data.document_structure,
            word_count: wordCount,
            has_images: data.has_images,
            has_tables: data.has_tables,
            has_code: data.has_code,
            created_at: data.created_at,
            updated_at: data.updated_at
          });

          // Set markdown content first
          let finalMarkdownContent = '';
          if (data.markdown_content) {
            finalMarkdownContent = data.markdown_content;
          } else if (data.markdown_url) {
            try {
              const response = await fetch(data.markdown_url);
              const markdown = await response.text();
              finalMarkdownContent = markdown;
            } catch (err) {
              console.error('Error fetching markdown from URL:', err);
              finalMarkdownContent = data.content || '';
            }
          } else {
            finalMarkdownContent = data.content || '';
          }

          // Generate document structure dynamically from markdown content
          if (finalMarkdownContent) {
            // Remove any existing TOC from markdown content to avoid duplication
            const cleanedMarkdown = removeEmbeddedTOC(finalMarkdownContent);
            setMarkdownContent(cleanedMarkdown);
            
            const structure = generateDocumentStructure(cleanedMarkdown);
            console.log('Generated TOC structure:', structure.tableOfContents);
            setDocumentStructure(structure);
          } else if (data.document_structure) {
            try {
              const structure = JSON.parse(data.document_structure);
              setDocumentStructure(structure);
            } catch (e) {
              console.error('Error parsing document structure:', e);
            }
          }

          // Fetch related posts with proper typing
          const { data: related } = await supabase
            .from('blogs')
            .select('*')
            .eq('category', data.category)
            .neq('id', data.id)
            .limit(3);

          if (related) {
            const formattedRelated: BlogPost[] = related.map(post => ({
              id: post.id,
              title: post.title,
              slug: post.slug,
              category: post.category || 'Uncategorized',
              content: post.content || '',
              author: post.author || 'Indrasol Team',
              author_desc: post.author_desc || '',
              author_profile_url: post.author_profile_url || '',
              publishDate: format(parseISO(post.created_at), 'MMMM d, yyyy'),
              readTime: post.readTime || '5 min read',
              created_at: post.created_at
            }));
            setRelatedPosts(formattedRelated);
          }
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
        setError('Failed to load the blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogDetail();
  }, [slug]);
  
  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || 'Indrasol Blog';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'x':
        shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto text-indrasol-blue animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-600">Loading blog post...</h3>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-24 min-h-screen">
          <div className="bg-gray-50 rounded-lg p-12 text-center max-w-2xl mx-auto">
            <div className="mx-auto w-24 h-24 mb-4 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 16h.01M5.8 21h12.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C23 18.72 23 17.88 23 16.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 00-1.311-1.311C20.72 3 19.88 3 18.2 3H5.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C1 5.28 1 6.12 1 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C3.28 21 4.12 21 5.8 21z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "We couldn't find the blog post you're looking for."}</p>
            <button 
              onClick={() => navigate('/Resources/blogs2')}
              className="px-5 py-2 bg-indrasol-blue text-white rounded-md hover:bg-indrasol-blue/90 transition-colors inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section with Dark Background */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-indrasol-blue pt-32 pb-16 overflow-hidden mt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 mr-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center text-sm text-gray-300">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link to="/Resources/blogs2" className="hover:text-white transition-colors">
                Blog
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-400 truncate max-w-xs">{blog.title}</span>
            </nav>
          </div>
          
          {/* Hero Content */}
          <div className="max-w-4xl">
            {/* Category and Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="bg-indrasol-blue text-white text-sm font-medium px-4 py-2 rounded-full">
                {blog.category}
              </span>
              <div className="flex items-center text-gray-300 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {blog.publishDate}
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {blog.readTime}
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              {blog.title}
            </h1>
            
            {/* Author Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-xl font-bold border border-white/30">
                {blog.author.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-white text-lg">{blog.author}</div>
                <div className="text-sm text-gray-300">Author</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <article className="pb-16">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 max-w-4xl mx-auto">
              {/* Featured Image */}
              {blog.featured_image && (
                <div className="mb-12 rounded-xl overflow-hidden shadow-lg -mt-8 relative z-10">
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* Share buttons - moved to top of content */}
              <div className="flex items-center justify-end gap-2 mb-8 pt-8">
                <span className="text-sm text-gray-500 mr-2">Share:</span>
                <button 
                  onClick={() => shareOnSocial('x')}
                  className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                  aria-label="Share on X"
                >
                  <svg className="h-4 w-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => shareOnSocial('linkedin')}
                  className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="h-4 w-4" fill="#0077B5" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
              
              {/* Article Content */}
              <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
                <EnhancedMarkdownRenderer content={markdownContent} />
              </div>
              
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-12">
                  <Tag className="h-4 w-4 text-gray-500" />
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Author Bio */}
              <div className="bg-gray-50 rounded-xl p-8 mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About the Author</h3>
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-indrasol-blue rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {blog.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{blog.author}</h4>
                    <p className="text-gray-600 mt-3">
                    {blog.author_desc}
                    </p>
                    <Link
                      to={blog.author_profile_url || '#'}
                      className="text-indrasol-blue hover:text-indrasol-blue/80 font-medium flex items-center mt-4 transition-colors"
                    >
                      <span>View {blog.author}'s profile</span>
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/Resources/blog/${post.slug}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="p-6">
                          <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
                            {post.category}
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2 group-hover:text-indrasol-blue transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="mt-4 text-indrasol-blue text-sm font-medium flex items-center">
                            Read more 
                            <ArrowLeft className="h-4 w-4 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-between items-center border-t border-gray-200 pt-8">
                <button 
                  onClick={() => navigate('/Resources/blogs2')}
                  className="text-indrasol-blue hover:underline flex items-center font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to all articles
                </button>
              </div>
            </div>
            
            {/* Sidebar - Table of Contents */}
            <aside className="w-80 hidden lg:block">
              <TableOfContents structure={documentStructure} />
            </aside>
          </div>
        </div>
      </article>
      
      <Footer />
      <BackToTop />
    </>
  );
};

export default BlogDetailPage;