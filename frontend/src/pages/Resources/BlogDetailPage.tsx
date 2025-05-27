import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share, 
  Facebook, 
  Twitter, 
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
  excerpt: string;
  author: string;
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

  useEffect(() => {
    const handleScroll = () => {
      if (!structure?.tableOfContents) return;

      const sections = structure.tableOfContents.map(item => ({
        id: item.id,
        offsetTop: document.getElementById(item.id)?.offsetTop || 0
      }));

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].offsetTop) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [structure]);

  if (!structure?.tableOfContents?.length) return null;

  return (
    <div className="sticky top-24 hidden lg:block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-4 w-4 mr-2 text-indrasol-blue" />
          Table of Contents
        </h3>
        <nav className="space-y-2">
          {structure.tableOfContents.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-sm transition-all duration-200 ${
                activeSection === item.id
                  ? 'text-indrasol-blue font-medium border-l-2 border-indrasol-blue pl-3'
                  : 'text-gray-600 hover:text-gray-900 border-l-2 border-transparent hover:border-gray-300 pl-3'
              } ${item.level > 2 ? 'ml-4' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {item.text}
            </a>
          ))}
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
            excerpt: data.excerpt || 'No excerpt available',
            author: data.author || 'Indrasol Team',
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

          // Parse document structure if available
          if (data.document_structure) {
            try {
              const structure = JSON.parse(data.document_structure);
              setDocumentStructure(structure);
            } catch (e) {
              console.error('Error parsing document structure:', e);
            }
          }

          // Set markdown content
          if (data.markdown_content) {
            setMarkdownContent(data.markdown_content);
          } else if (data.markdown_url) {
            try {
              const response = await fetch(data.markdown_url);
              const markdown = await response.text();
              setMarkdownContent(markdown);
            } catch (err) {
              console.error('Error fetching markdown from URL:', err);
              setMarkdownContent(data.content || '');
            }
          } else {
            setMarkdownContent(data.content || '');
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
              excerpt: post.excerpt || '',
              category: post.category || 'Uncategorized',
              content: post.content || '',
              author: post.author || 'Indrasol Team',
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
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
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
      
      <article className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center text-sm text-gray-500">
              <Link to="/" className="hover:text-indrasol-blue transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link to="/Resources/blogs2" className="hover:text-indrasol-blue transition-colors">
                Blog
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-700 truncate max-w-xs">{blog.title}</span>
            </nav>
          </div>
          
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 max-w-4xl mx-auto">
              {/* Article Header */}
              <header className="mb-12">
                <div className="flex flex-wrap gap-4 mb-4">
                  <span className="bg-indrasol-blue/10 text-indrasol-blue text-sm font-medium px-4 py-1 rounded-full">
                    {blog.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {blog.publishDate}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {blog.readTime}
                  </div>
                  {blog.word_count && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {blog.word_count.toLocaleString()} words
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {blog.title}
                </h1>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indrasol-blue text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {blog.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{blog.author}</div>
                      <div className="text-sm text-gray-500">Author</div>
                    </div>
                  </div>
                  
                  {/* Share buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 mr-2">Share:</span>
                    <button 
                      onClick={() => shareOnSocial('facebook')}
                      className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4 text-gray-700" />
                    </button>
                    <button 
                      onClick={() => shareOnSocial('twitter')}
                      className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4 text-gray-700" />
                    </button>
                    <button 
                      onClick={() => shareOnSocial('linkedin')}
                      className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>
                
                {blog.excerpt && (
                  <div className="mt-8 text-xl text-gray-700 border-l-4 border-indrasol-blue pl-4 italic">
                    {blog.excerpt}
                  </div>
                )}
              </header>
              
              {/* Featured Image */}
              {blog.featured_image && (
                <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
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
                      {blog.author} is an expert in {blog.category} with extensive experience in the field. 
                      Their insights and knowledge have been valuable contributions to the industry.
                    </p>
                    <Link
                      to="#"
                      className="text-indrasol-blue hover:text-indrasol-blue/80 font-medium flex items-center mt-4 transition-colors"
                    >
                      <span>View all posts by {blog.author}</span>
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
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {post.excerpt}
                          </p>
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