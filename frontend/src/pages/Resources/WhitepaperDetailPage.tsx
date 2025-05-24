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
  Download,
  FileText,
  ChevronRight,
  Tag,
  Building,
  Mail
} from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { BackToTop } from '@/components/ui/back-to-top';
import { supabase } from '@/supabase';
import { format, parseISO } from 'date-fns';
import { EnhancedMarkdownRenderer } from '@/components/EnhancedMarkdownRenderer';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.min.css';

interface Whitepaper {
  id: string;
  title: string;
  content: string;
  markdown_content?: string;
  markdown_url?: string;
  docx_url?: string;
  excerpt?: string;
  coverImage?: string;
  category: string;
  author: string;
  publishDate: string;
  readTime?: string;
  slug?: string;
  created_at: string;
  tags?: string[];
  document_structure?: string;
  word_count?: number;
  has_images?: boolean;
  has_tables?: boolean;
  has_code?: boolean;
  featured?: boolean;
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

const WhitepaperDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [whitepaper, setWhitepaper] = useState<Whitepaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [documentStructure, setDocumentStructure] = useState<DocumentStructure | null>(null);
  const [relatedWhitepapers, setRelatedWhitepapers] = useState<Whitepaper[]>([]);

  useEffect(() => {
    const fetchWhitepaperDetail = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        
        let { data, error } = await supabase
          .from('whitepapers')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        
        if (error || !data) {
          const { data: idData, error: idError } = await supabase
            .from('whitepapers')
            .select('*')
            .eq('id', slug)
            .maybeSingle();
            
          if (idError || !idData) {
            const { data: allPapers, error: allError } = await supabase
              .from('whitepapers')
              .select('*');
              
            if (allError) throw new Error('Failed to load whitepapers');
            
            const paper = allPapers.find(paper => generateSlug(paper.title) === slug);
            
            if (!paper) {
              throw new Error('Whitepaper not found');
            }
            
            data = paper;
          } else {
            data = idData;
          }
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
          
          setWhitepaper({
            id: data.id,
            title: data.title,
            content: data.content,
            markdown_content: data.markdown_content,
            markdown_url: data.markdown_url,
            docx_url: data.docx_url,
            excerpt: data.excerpt || generateExcerpt(data.title),
            coverImage: data.coverImage || getCoverImage(data.category),
            category: data.category || 'General',
            author: data.author || 'Indrasol Team',
            publishDate: formattedDate,
            readTime: readTime,
            slug: data.slug || generateSlug(data.title),
            created_at: data.created_at,
            tags: data.tags || [],
            document_structure: data.document_structure,
            word_count: wordCount,
            has_images: data.has_images,
            has_tables: data.has_tables,
            has_code: data.has_code,
            featured: data.featured
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

          // Fetch related whitepapers with proper typing
          const { data: related } = await supabase
            .from('whitepapers')
            .select('*')
            .eq('category', data.category)
            .neq('id', data.id)
            .limit(3);

          if (related) {
            const formattedRelated: Whitepaper[] = related.map(paper => ({
              id: paper.id,
              title: paper.title,
              slug: paper.slug || generateSlug(paper.title),
              excerpt: paper.excerpt || generateExcerpt(paper.title),
              category: paper.category || 'General',
              content: paper.content || '',
              author: paper.author || 'Indrasol Team',
              publishDate: format(parseISO(paper.created_at), 'MMMM d, yyyy'),
              readTime: paper.readTime || '10 min read',
              created_at: paper.created_at
            }));
            setRelatedWhitepapers(formattedRelated);
          }
        }
      } catch (error) {
        console.error('Error fetching whitepaper details:', error);
        setError('Failed to load the whitepaper. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWhitepaperDetail();
  }, [slug]);
  
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };
  
  const generateExcerpt = (title: string): string => {
    return `This whitepaper explores ${title} in detail, providing insights and recommendations based on research by Indrasol experts.`;
  };
  
  const getCoverImage = (category: string): string => {
    const defaultCoverImages: Record<string, string> = {
      "AI Security": "/whitepaperImage/ai-security.jpg",
      "Machine Learning": "/whitepaperImage/machine-learning.jpg",
      "Security Architecture": "/whitepaperImage/security-architecture.jpg",
      "MLSecOps": "/whitepaperImage/mlsecops.jpg",
      "AI Ethics": "/whitepaperImage/ai-ethics.jpg",
      "Cybersecurity": "/whitepaperImage/cybersecurity.jpg",
      "Default": "/whitepaperImage/scope.png",
    };
    return defaultCoverImages[category] || defaultCoverImages.Default;
  };
  
  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const title = whitepaper?.title || 'Indrasol Whitepaper';
    
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
            <h3 className="text-lg font-medium text-gray-600">Loading whitepaper...</h3>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !whitepaper) {
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
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Whitepaper Not Found</h1>
            <p className="text-gray-500">{error || "We couldn't find the whitepaper you're looking for."}</p>
            <button 
              onClick={() => navigate('/resources/whitepaper')}
              className="mt-6 px-5 py-2 bg-indrasol-blue text-white rounded-md hover:bg-indrasol-blue/90 transition-colors inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Whitepapers
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
      
      <article className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center text-sm text-gray-500">
              <Link to="/" className="hover:text-indrasol-blue transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link to="/resources" className="hover:text-indrasol-blue transition-colors">
                Resources
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link to="/resources/whitepaper" className="hover:text-indrasol-blue transition-colors">
                Whitepapers
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-700 truncate max-w-xs">{whitepaper.title}</span>
            </nav>
          </div>
          
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 max-w-5xl mx-auto">
              {/* Whitepaper Header */}
              <header className="mb-12 bg-white rounded-xl shadow-sm p-8">
                <div className="flex flex-wrap gap-4 mb-6">
                  {whitepaper.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-bold px-4 py-1 rounded-full">
                      FEATURED
                    </span>
                  )}
                  <span className="bg-indrasol-blue/10 text-indrasol-blue text-sm font-medium px-4 py-1 rounded-full">
                    {whitepaper.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {whitepaper.publishDate}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {whitepaper.readTime}
                  </div>
                  {whitepaper.word_count && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {whitepaper.word_count.toLocaleString()} words
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {whitepaper.title}
                </h1>
                
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indrasol-blue text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {whitepaper.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{whitepaper.author}</div>
                      <div className="text-sm text-gray-500">Author</div>
                    </div>
                  </div>
                  
                  {/* Download and Share buttons */}
                  <div className="flex items-center gap-4">
                    {whitepaper.docx_url && (
                      <a
                        href={whitepaper.docx_url}
                        download
                        className="bg-indrasol-blue text-white px-4 py-2 rounded-lg hover:bg-indrasol-blue/90 transition-colors flex items-center font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    )}
                    
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
                </div>
                
                {whitepaper.excerpt && (
                  <div className="bg-indrasol-blue/5 border-l-4 border-indrasol-blue pl-6 pr-4 py-4 rounded-r-lg">
                    <p className="text-lg text-gray-700 italic">
                      {whitepaper.excerpt}
                    </p>
                  </div>
                )}
              </header>
              
              {/* Cover Image */}
              {whitepaper.coverImage && (
                <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={whitepaper.coverImage}
                    alt={whitepaper.title}
                    className="w-full h-auto"
                    onError={(e) => {
                      e.currentTarget.src = getCoverImage(whitepaper.category);
                    }}
                  />
                </div>
              )}
              
              {/* Whitepaper Content */}
              <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
                <EnhancedMarkdownRenderer content={markdownContent} />
              </div>
              
              {/* Tags */}
              {whitepaper.tags && whitepaper.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-12">
                  <Tag className="h-4 w-4 text-gray-500" />
                  {whitepaper.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Citation Box */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-12">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-indrasol-blue" />
                  Cite this whitepaper:
                </h4>
                <p className="text-sm text-gray-600 font-mono bg-white p-3 rounded border border-gray-200">
                  {whitepaper.author}. ({new Date(whitepaper.created_at).getFullYear()}). {whitepaper.title}. Indrasol. Retrieved from {window.location.href}
                </p>
              </div>
              
              {/* CTA Section */}
              <div className="bg-gradient-to-r from-indrasol-blue to-indrasol-blue/80 rounded-xl p-8 shadow-xl mb-12">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                  <div className="md:col-span-3 space-y-4 text-white">
                    <h3 className="text-2xl font-bold">
                      Need more information?
                    </h3>
                    <p className="text-white/90">
                      Our team of experts can provide custom guidance on implementing the strategies outlined in this whitepaper for your organization.
                    </p>
                  </div>
                  <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/contact"
                      className="px-6 py-3 bg-white text-indrasol-blue rounded-lg hover:bg-gray-100 transition-colors font-medium flex-1 text-center shadow-lg flex items-center justify-center"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Request Consultation
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Related Whitepapers */}
              {relatedWhitepapers.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Whitepapers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedWhitepapers.map((paper) => (
                      <Link
                        key={paper.id}
                        to={`/components/whitepaper/${paper.slug || generateSlug(paper.title)}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="p-6">
                          <div className="bg-indrasol-blue/10 text-indrasol-blue text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
                            {paper.category}
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2 group-hover:text-indrasol-blue transition-colors line-clamp-2">
                            {paper.title}
                          </h4>
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {paper.excerpt || generateExcerpt(paper.title)}
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
                  onClick={() => navigate('/resources/whitepaper')}
                  className="text-indrasol-blue hover:underline flex items-center font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to all whitepapers
                </button>
              </div>
            </div>
            
            {/* Sidebar */}
            <aside className="w-80 hidden lg:block space-y-6">
              {/* Table of Contents */}
              <TableOfContents structure={documentStructure} />
              
              {/* Document Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Document Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Publisher</div>
                      <div className="text-gray-600">Indrasol</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Published</div>
                      <div className="text-gray-600">{whitepaper.publishDate}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Reading Time</div>
                      <div className="text-gray-600">{whitepaper.readTime}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Category</div>
                      <div className="text-gray-600">{whitepaper.category}</div>
                    </div>
                  </div>
                </div>
                {whitepaper.docx_url && (
                  <a
                    href={whitepaper.docx_url}
                    download
                    className="mt-6 w-full bg-indrasol-blue text-white px-4 py-3 rounded-lg hover:bg-indrasol-blue/90 transition-colors flex items-center justify-center font-medium"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </a>
                )}
              </div>
            </aside>
          </div>
        </div>
      </article>
      
      <Footer />
      <BackToTop />
    </>
  );
};

export default WhitepaperDetailPage;