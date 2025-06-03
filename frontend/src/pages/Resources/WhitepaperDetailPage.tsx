import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share, 
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
  wpTitle: string;
  content: string;
  markdown_content?: string;
  markdown_url?: string;
  docx_url?: string;
  excerpt?: string;
  coverImage?: string;
  wpCategory: string;
  wpAuthor: string;
  wpAuthor_desc?: string;
  wpAuthor_profile_url?: string;
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

const TableOfContents: React.FC<{ structure: DocumentStructure | null; whitepaper: Whitepaper }> = ({ structure, whitepaper }) => {
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
        const id = generateHeadingId(item.text);
        const element = document.getElementById(id);
        
        if (!element) {
          // Try to find by text content if ID doesn't work
          const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          const foundElement = Array.from(allHeadings).find(h => {
            const headingText = h.textContent?.trim().toLowerCase() || '';
            const itemText = item.text.toLowerCase().trim();
            return headingText === itemText || headingText.includes(itemText) || itemText.includes(headingText);
          }) as HTMLElement;
          
          return {
            id,
            text: item.text,
            offsetTop: foundElement?.offsetTop || 0,
            element: foundElement
          };
        }
        
        return {
          id,
          text: item.text,
          offsetTop: element.offsetTop,
          element
        };
      }).filter(section => section.offsetTop > 0 && section.element); // Only include sections that exist

      if (sections.length === 0) {
        setActiveSection('');
        return;
      }

      const scrollPosition = window.scrollY + 100; // Account for navbar
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if we're at the very bottom of the page
      const isAtBottom = (window.scrollY + viewportHeight) >= (documentHeight - 50);
      
      let newActiveSection = '';
      
      if (isAtBottom) {
        // If at bottom, activate the last section
        newActiveSection = sections[sections.length - 1].id;
      } else {
        // Find the section that's currently most visible
        let bestMatch = null;
        let bestScore = -1;
        
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          const sectionTop = section.offsetTop;
          const sectionBottom = i < sections.length - 1 ? sections[i + 1].offsetTop : documentHeight;
          
          // Calculate how much of this section is in the viewport
          const visibleTop = Math.max(scrollPosition, sectionTop);
          const visibleBottom = Math.min(scrollPosition + viewportHeight, sectionBottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          
          // Score based on visibility and position
          let score = 0;
          if (scrollPosition >= sectionTop - 50 && scrollPosition < sectionBottom) {
            score = visibleHeight + (scrollPosition >= sectionTop ? 1000 : 0);
          }
          
          if (score > bestScore) {
            bestScore = score;
            bestMatch = section;
          }
        }
        
        if (bestMatch) {
          newActiveSection = bestMatch.id;
        } else {
          // Fallback: find the closest section above current scroll position
          for (let i = sections.length - 1; i >= 0; i--) {
            if (scrollPosition >= sections[i].offsetTop - 100) {
              newActiveSection = sections[i].id;
              break;
            }
          }
        }
      }
      
      // Only update if the active section actually changed
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    };

    // Debounce scroll events for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [structure, activeSection]);

  if (!structure?.tableOfContents?.length) {
    // If no TOC, just show Document Info
    return (
      <div className="sticky top-24 hidden lg:block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Document Information</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <Building className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium">Publisher</div>
                <div className="text-gray-600">{whitepaper.wpAuthor}</div>
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
                <div className="text-gray-600">{whitepaper.wpCategory}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-24 hidden lg:block space-y-6">
      {/* Table of Contents */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
      
      {/* Document Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Document Information</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <Building className="h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium">Publisher</div>
              <div className="text-gray-600">{whitepaper.wpAuthor}</div>
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
              <div className="text-gray-600">{whitepaper.wpCategory}</div>
            </div>
          </div>
        </div>
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
  const generateDocumentStructure = (markdown: string, whitepaperTitle?: string): DocumentStructure => {
    console.log('Analyzing markdown content:', markdown.substring(0, 500) + '...');
    
    const lines = markdown.split('\n');
    const headings: Array<{ level: number; text: string; id: string }> = [];
    const tableOfContents: Array<{ id: string; text: string; level: number }> = [];
    let totalWordCount = 0;
    let hasImages = false;
    let hasTables = false;
    let hasCode = false;
    let firstH1Found = false;

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
        
        // Check if this heading should be excluded from TOC
        const isMainTitle = (
          level === 1 && 
          !firstH1Found && 
          (
            !whitepaperTitle || 
            text.toLowerCase().includes(whitepaperTitle.toLowerCase()) ||
            whitepaperTitle.toLowerCase().includes(text.toLowerCase()) ||
            text.toLowerCase() === whitepaperTitle.toLowerCase()
          )
        );
        
        if (level === 1 && !firstH1Found) {
          firstH1Found = true;
        }
        
        headings.push({ level, text, id });
        
        // Add to TOC if level <= 4 and it's not the main title
        if (level <= 4 && !isMainTitle) {
          tableOfContents.push({ id, text, level });
        }
        
        if (isMainTitle) {
          console.log(`Excluding main title from TOC: "${text}"`);
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
    const fetchWhitepaperDetail = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        
        let { data, error } = await supabase
          .from('whitepapers')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        
        if (error) {
          console.error('Supabase error for slug query:', error);
        }
        
        if (error || !data) {
          const { data: idData, error: idError } = await supabase
            .from('whitepapers')
            .select('*')
            .eq('id', slug)
            .maybeSingle();
            
          if (idError) {
            console.error('Supabase error for id query:', idError);
          }
            
          if (idError || !idData) {
            const { data: allPapers, error: allError } = await supabase
              .from('whitepapers')
              .select('*');
              
            if (allError) {
              console.error('Supabase error for all papers query:', allError);
              throw new Error(`Failed to load whitepapers: ${allError.message}`);
            }
            
            const paper = allPapers.find(paper => generateSlug(paper.wpTitle) === slug);
            
            if (!paper) {
              throw new Error('Whitepaper not found');
            }
            
            data = paper;
          } else {
            data = idData;
          }
        }
        
        if (data) {
          // Debug: Log the actual data from database
          console.log('Raw database data:', data);
          console.log('Available fields:', Object.keys(data));
          console.log('wpCategory from database:', data.wpCategory);
          
          // Handle potential field name variations
          const categoryValue = data.wpCategory || (data as any)['category'] || 'General';
          console.log('Final category value being used:', categoryValue);
          
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
            wpTitle: data.wpTitle,
            content: data.content,
            markdown_content: data.markdown_content,
            markdown_url: data.markdown_url,
            docx_url: data.docx_url,
            excerpt: data.excerpt || generateExcerpt(data.wpTitle),
            coverImage: data.coverImage || getCoverImage(categoryValue),
            wpCategory: categoryValue,
            wpAuthor: data.wpAuthor || 'Indrasol Team',
            wpAuthor_desc: data.wpAuthor_desc || '',
            wpAuthor_profile_url: data.wpAuthor_profile_url || '',
            publishDate: formattedDate,
            readTime: readTime,
            slug: data.slug || generateSlug(data.wpTitle),
            created_at: data.created_at,
            tags: data.tags || [],
            document_structure: data.document_structure,
            word_count: wordCount,
            has_images: data.has_images,
            has_tables: data.has_tables,
            has_code: data.has_code,
            featured: data.featured
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
            
            const structure = generateDocumentStructure(cleanedMarkdown, data.wpTitle);
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

          // Parse document structure if available (fallback)
          if (data.document_structure && !finalMarkdownContent) {
            try {
              const structure = JSON.parse(data.document_structure);
              setDocumentStructure(structure);
            } catch (e) {
              console.error('Error parsing document structure:', e);
            }
          }

          // Fetch related whitepapers with proper typing
          const { data: related } = await supabase
            .from('whitepapers')
            .select('*')
            .eq('wpCategory', categoryValue)
            .neq('id', data.id)
            .limit(3);

          if (related) {
            const formattedRelated: Whitepaper[] = related.map(paper => ({
              id: paper.id,
              wpTitle: paper.wpTitle,
              slug: paper.slug || generateSlug(paper.wpTitle),
              excerpt: paper.excerpt || generateExcerpt(paper.wpTitle),
              wpCategory: paper.wpCategory || (paper as any)['category'] || 'General',
              content: paper.content || '',
              wpAuthor: paper.wpAuthor || 'Indrasol Team',
              wpAuthor_desc: paper.wpAuthor_desc || '',
              wpAuthor_profile_url: paper.wpAuthor_profile_url || '',
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
    const title = whitepaper?.wpTitle || 'Indrasol Whitepaper';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'x':
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
      
      {/* Hero Section with Dark Background */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-indrasol-orange pt-32 pb-16 overflow-hidden mt-20">
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
              <Link to="/resources" className="hover:text-white transition-colors">
                Resources
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link to="/resources/whitepaper" className="hover:text-white transition-colors">
                Whitepapers
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-400 truncate max-w-xs">{whitepaper.wpTitle}</span>
            </nav>
          </div>
          
          {/* Hero Content */}
          <div className="max-w-4xl">
            {/* Category and Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              {whitepaper.featured && (
                <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-2 rounded-full">
                  FEATURED
                </span>
              )}
              <span className="bg-indrasol-blue text-white text-sm font-medium px-4 py-2 rounded-full">
                {whitepaper.wpCategory}
              </span>
              <div className="flex items-center text-gray-300 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {whitepaper.publishDate}
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {whitepaper.readTime}
              </div>
              {whitepaper.word_count && (
                <div className="flex items-center text-gray-300 text-sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {whitepaper.word_count.toLocaleString()} words
                </div>
              )}
            </div>
            
            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              {whitepaper.wpTitle}
            </h1>
            
            {/* Author Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-xl font-bold border border-white/30">
                {whitepaper.wpAuthor.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-white text-lg">{whitepaper.wpAuthor}</div>
                <div className="text-sm text-gray-300">Author</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <article className="pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 max-w-5xl mx-auto">
              {/* Share buttons - moved to top of content */}
              <div className="flex items-center justify-end gap-2 mb-8 pt-8">
                <span className="text-sm text-gray-500 mr-2">Share:</span>
                <button 
                  onClick={() => shareOnSocial('x')}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  aria-label="Share on X"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#000000"/>
                  </svg>
                </button>
                <button 
                  onClick={() => shareOnSocial('linkedin')}
                  className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
                  </svg>
                </button>
              </div>
              
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
              
              {/* Author Bio */}
              {whitepaper.wpAuthor_desc && (
                <div className="bg-gray-50 rounded-xl p-8 mb-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About the Author</h3>
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-indrasol-blue rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                      {whitepaper.wpAuthor.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{whitepaper.wpAuthor}</h4>
                      <p className="text-gray-600 mt-3">
                        {whitepaper.wpAuthor_desc}
                      </p>
                      {whitepaper.wpAuthor_profile_url && (
                        <Link
                          to={whitepaper.wpAuthor_profile_url}
                          className="text-indrasol-blue hover:text-indrasol-blue/80 font-medium flex items-center mt-4 transition-colors"
                        >
                          <span>View {whitepaper.wpAuthor}'s profile</span>
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
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
                        to={`/resources/whitepaper/${paper.slug || generateSlug(paper.wpTitle)}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="p-6">
                          <div className="bg-indrasol-blue text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
                            {paper.wpCategory}
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2 group-hover:text-indrasol-blue transition-colors line-clamp-2">
                            {paper.wpTitle}
                          </h4>
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {paper.excerpt || generateExcerpt(paper.wpTitle)}
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
              <TableOfContents structure={documentStructure} whitepaper={whitepaper} />
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