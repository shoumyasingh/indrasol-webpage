// WhitepaperTemplateGenerator.ts
// Simplified version - similar to blog processing, no file handling

import { marked } from 'marked';
import TurndownService from 'turndown';
import mammoth from 'mammoth';
import { getProxiedImageUrl } from './imageUtils';

// Simplified whitepaper structure interfaces
interface Section {
  id: string;
  title: string;
  content: string;
  icon: string;
}

interface TableOfContentItem {
  id: string;
  title: string;
}

interface WhitepaperImage {
  src: string;
  alt?: string;
  caption?: string;
}

/**
 * Process a document file (DOCX) and extract its content - same as blog processing
 */
export async function processDocumentFile(docxBuffer: ArrayBuffer): Promise<{
  content: string;
  images: WhitepaperImage[];
  structure: {
    title: string;
    author?: string;
    headings: { level: number, text: string, id: string }[];
  };
}> {
  const options = {
    convertImage: mammoth.images.imgElement(async (image: any) => {
      return {
        src: '#',
        alt: image.altText || 'Document image'
      };
    })
  };

  try {
    const result = await mammoth.convertToHtml({ arrayBuffer: docxBuffer }, options);
    const extractedHtml = result.value;
    
    console.log("Document processed with mammoth, messages:", result.messages);
    
    const extractedImages = await extractImagesFromDocument(docxBuffer);
    const structure = extractDocumentStructure(extractedHtml);
    
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '*',
      codeBlockStyle: 'fenced',
      linkStyle: 'inlined'
    });
    
    // Same custom rules as blog processing
    turndownService.addRule('figureCaptions', {
      filter: (node) => {
        return node.nodeName === 'P' && 
               node.classList && node.classList.contains('caption');
      },
      replacement: (content) => {
        return `*${content}*\n\n`;
      }
    });
    
    turndownService.addRule('codeBlocks', {
      filter: (node) => {
        return node.nodeName === 'PRE' && 
               node.classList && node.classList.contains('code');
      },
      replacement: (content) => {
        return `\n\`\`\`\n${content}\n\`\`\`\n\n`;
      }
    });
    
    turndownService.addRule('nestedLists', {
      filter: ['ul', 'ol'],
      replacement: (content, node) => {
        const parent = node.parentNode;
        const isNested = parent && 
                        (parent.nodeName === 'LI' || 
                         parent.nodeName === 'UL' || 
                         parent.nodeName === 'OL');
                         
        const prefix = isNested ? '' : '\n\n';
        const suffix = isNested ? '' : '\n\n';
        
        return prefix + content + suffix;
      }
    });
    
    const extractedText = turndownService.turndown(extractedHtml);
    
    return {
      content: extractedText,
      images: extractedImages,
      structure: structure
    };
  } catch (error) {
    console.error("Error processing document:", error);
    throw new Error(`Failed to process document: ${error.message}`);
  }
}

/**
 * Extract images from a DOCX document - same as blog processing
 */
async function extractImagesFromDocument(docxBuffer: ArrayBuffer): Promise<WhitepaperImage[]> {
  try {
    const imagePromises: Promise<any>[] = [];
    
    await mammoth.convertToHtml({ arrayBuffer: docxBuffer }, {
      convertImage: mammoth.images.imgElement(async (image: any) => {
        const imagePromise = image.read()
          .then(imageBuffer => {
            let mimeType = 'image/jpeg';
            if (image.contentType) {
              mimeType = image.contentType;
            } else if (image.path && image.path.endsWith('.png')) {
              mimeType = 'image/png';
            } else if (image.path && image.path.endsWith('.svg')) {
              mimeType = 'image/svg+xml';
            } else if (image.path && image.path.endsWith('.gif')) {
              mimeType = 'image/gif';
            }
            
            const base64 = `data:${mimeType};base64,${Buffer.from(imageBuffer).toString('base64')}`;
            
            return {
              src: base64,
              alt: image.altText || 'Document image',
              caption: image.altText || 'Document image'
            };
          })
          .catch(error => {
            console.error("Error extracting image:", error);
            return null;
          });
        
        imagePromises.push(imagePromise);
        
        return {
          src: '#',
          alt: image.altText || 'Document image'
        };
      })
    });
    
    const extractedImages = await Promise.all(imagePromises);
    return extractedImages.filter(img => img !== null);
  } catch (error) {
    console.error("Error extracting images:", error);
    return [];
  }
}

/**
 * Extract document structure from HTML content - same as blog processing
 */
function extractDocumentStructure(html: string): {
  title: string;
  author?: string;
  headings: { level: number, text: string, id: string }[];
} {
  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i) || html.match(/<h2[^>]*>(.*?)<\/h2>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : 'Untitled Document';
  
  const authorMatch = html.match(/<p[^>]*class="document-author"[^>]*>(.*?)<\/p>/i);
  const author = authorMatch ? authorMatch[1].replace(/<[^>]*>/g, '') : undefined;
  
  const headingRegex = /<h([2-6])[^>]*>(.*?)<\/h\1>/gi;
  const headings: { level: number, text: string, id: string }[] = [];
  
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '');
    const id = text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    headings.push({ level, text, id });
  }
  
  return { title, author, headings };
}

/**
 * Generate a simplified whitepaper HTML template (more like blog style)
 * 
 * @param title The whitepaper title
 * @param authors Author or authors of the whitepaper
 * @param publishDate Publication date
 * @param readTime Estimated reading time
 * @param coverImage Path to the cover image
 * @param abstract Brief summary of the whitepaper
 * @param sections Content sections with titles and content
 * @param images Array of image objects to be included
 * @returns HTML string of the formatted whitepaper
 */
export function generateWhitepaperTemplate(
  title: string,
  authors: string,
  publishDate: string,
  readTime: string,
  coverImage: string,
  abstract: string,
  sections: Section[],
  images: WhitepaperImage[] = []
): string {
  // Convert the abstract and section content to HTML
  const abstractHtml = marked.parse(abstract) as string;
  
  // Generate HTML for each section
  const sectionsHtml = sections.map(section => {
    const sectionHtml = marked.parse(section.content) as string;
    const iconClass = getIconClass(section.icon);
    
    return `
      <div id="${section.id}" class="scroll-mt-24 mb-12">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 rounded-full bg-indrasol-blue/10 flex items-center justify-center text-indrasol-blue mr-5 flex-shrink-0">
            <i class="${iconClass}"></i>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900">
            ${section.title}
          </h2>
        </div>

        <div class="pl-0 md:pl-16">
          ${sectionHtml}
          ${insertSectionImage(section.id, images)}
        </div>
      </div>
    `;
  }).join('');
  
  // Generate table of contents
  const tableOfContents = [{ id: "abstract", title: "Abstract" }, ...sections.map(section => ({ id: section.id, title: section.title }))];
  const tocHtml = `
    <div id="toc-container" class="sticky top-4 transition-all duration-300 bg-white rounded-2xl shadow-md">
      <div class="p-6">
        <h3 class="font-bold text-lg mb-4">Table of Contents</h3>
        <nav class="space-y-2">
          ${tableOfContents.map(item => `
            <a
              href="#${item.id}"
              class="flex items-center py-2 px-3 rounded-lg text-sm transition-colors hover:bg-indrasol-blue/10 text-gray-700"
            >
              <i class="fas fa-chevron-right h-4 w-4 mr-2 text-indrasol-blue"></i>
              ${item.title}
            </a>
          `).join('')}
        </nav>
      </div>
    </div>
  `;
  
  // Generate the simplified whitepaper HTML (more blog-like)
  return `
    <div class="min-h-screen bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
      <!-- Hero Section with Featured Image -->
      <div class="w-full h-64 md:h-96 relative bg-gradient-to-r from-indrasol-blue to-indrasol-blue/80 overflow-hidden">
        <div class="absolute inset-0 bg-pattern opacity-10"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
        <div class="container mx-auto px-6 h-full flex items-center relative z-10">
          <div class="max-w-3xl">
            <div class="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <i class="fas fa-calendar h-4 w-4 mr-2"></i>
              ${publishDate}
              <span class="mx-2">•</span>
              <i class="fas fa-clock h-4 w-4 mr-2"></i>
              ${readTime}
            </div>
            <h1 class="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              ${title}
            </h1>
            <div class="flex items-center">
              <div class="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full">
                <span class="font-medium">By ${authors}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-12">
        <div class="max-w-8xl mx-auto">
          <!-- Breadcrumb -->
          <div class="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <a href="/" class="hover:text-indrasol-blue transition-colors">
              Home
            </a>
            <i class="fas fa-chevron-right h-4 w-4 mx-2 flex-shrink-0"></i>
            <a href="/Resources" class="hover:text-indrasol-blue transition-colors">
              Resources
            </a>
            <i class="fas fa-chevron-right h-4 w-4 mx-2 flex-shrink-0"></i>
            <a href="/Resources/whitepaper" class="hover:text-indrasol-blue transition-colors">
              White Papers
            </a>
            <i class="fas fa-chevron-right h-4 w-4 mx-2 flex-shrink-0"></i>
            <span class="text-gray-700 font-medium">
              ${title}
            </span>
          </div>

          <!-- Main content with sidebar layout -->
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Main content -->
            <div class="lg:w-2/3 order-2 lg:order-1">
              <div class="bg-white rounded-2xl shadow-md overflow-hidden mb-12">
                <!-- Content wrapper with padding -->
                <div class="p-6 md:p-10">
                  <!-- Share and Reading Time Bar -->
                  <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div class="flex items-center">
                      <span class="text-sm text-gray-500">
                        ${readTime}
                      </span>
                    </div>
                  </div>

                  <!-- Abstract Section -->
                  <div id="abstract" class="scroll-mt-24 mb-16">
                    <div class="flex items-center mb-6">
                      <div class="w-12 h-12 rounded-full bg-indrasol-blue/10 flex items-center justify-center text-indrasol-blue mr-5 flex-shrink-0">
                        <i class="fas fa-file-text"></i>
                      </div>
                      <h2 class="text-2xl md:text-3xl font-bold text-gray-900">
                        Abstract
                      </h2>
                    </div>

                    <div class="pl-0 md:pl-16">
                      <div class="bg-gradient-to-r from-indrasol-blue/10 to-indrasol-blue/5 p-6 rounded-xl border-l-4 border-indrasol-blue mb-8">
                        ${abstractHtml}
                      </div>
                      <div class="relative overflow-hidden rounded-xl shadow-lg mb-8 group">
                        <img
                          src="${getProxiedImageUrl(coverImage)}"
                          alt="${title}"
                          class="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
                          onerror="this.src='/api/placeholder/1200/600?text=${encodeURIComponent(title)}'; this.onerror=null;"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Content Sections -->
                  ${sectionsHtml}

                  <!-- Contact us section -->
                  <div class="bg-gradient-to-r from-indrasol-blue to-indrasol-blue/80 rounded-xl p-8 shadow-xl mt-16">
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                      <div class="md:col-span-3 space-y-4">
                        <h3 class="text-2xl font-bold text-white">
                          Need more information?
                        </h3>
                        <p class="text-white/90">
                          Our team of experts can provide custom guidance on implementing the strategies outlined in this whitepaper for your organization.
                        </p>
                      </div>
                      <div class="md:col-span-2 flex flex-col sm:flex-row gap-4">
                        <a
                          href="/contact"
                          class="px-6 py-3 bg-white text-indrasol-blue rounded-lg hover:bg-gray-100 transition-colors font-medium flex-1 text-center shadow-lg"
                        >
                          Request a Consultation
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="lg:w-1/4 order-1 lg:order-2">
              <!-- Author Information Card -->
              <div class="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
                <div class="bg-gradient-to-r from-indrasol-blue to-indrasol-blue/80 p-4">
                  <h3 class="text-white font-bold text-lg">
                    White Paper Details
                  </h3>
                </div>
                <div class="p-6">
                  <div class="flex items-center mb-6">
                    <div class="w-12 h-12 bg-indrasol-blue/20 rounded-full flex items-center justify-center">
                      <i class="fas fa-user h-6 w-6 text-indrasol-blue"></i>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm text-gray-500">Authors</div>
                      <div class="font-medium text-indrasol-blue">
                        ${authors}
                      </div>
                    </div>
                  </div>

                  <div class="space-y-4 mb-6 border-t border-gray-100 pt-4">
                    <div class="flex items-start">
                      <i class="fas fa-calendar h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5"></i>
                      <div>
                        <div class="text-sm font-medium text-gray-700">
                          Published
                        </div>
                        <div class="text-gray-600">
                          ${publishDate}
                        </div>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <i class="fas fa-book-open h-5 w-5 text-indrasol-blue mr-3 flex-shrink-0 mt-0.5"></i>
                      <div>
                        <div class="text-sm font-medium text-gray-700">
                          Reading Time
                        </div>
                        <div class="text-gray-600">
                          ${readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Table of Contents -->
              ${tocHtml}
            </div>
          </div>

          <!-- Back to whitepapers button -->
          <div class="text-center mt-16">
            <a
              href="/Resources/whitepaper"
              class="inline-flex items-center px-8 py-4 border-2 border-indrasol-blue text-indrasol-blue rounded-lg hover:bg-indrasol-blue/10 transition-colors font-medium"
            >
              View All White Papers
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Get the appropriate icon class for a section based on its icon type
 */
function getIconClass(iconType: string): string {
  const iconMap: Record<string, string> = {
    'FileText': 'fas fa-file-text',
    'BookOpen': 'fas fa-book-open',
    'LockKeyhole': 'fas fa-lock',
    'Shield': 'fas fa-shield',
    'Cpu': 'fas fa-microchip',
    'RefreshCw': 'fas fa-sync',
    'Database': 'fas fa-database',
    'Default': 'fas fa-file-alt'
  };
  
  return iconMap[iconType] || iconMap.Default;
}

/**
 * Insert an image relevant to the section if available
 */
function insertSectionImage(sectionId: string, images: WhitepaperImage[]): string {
  if (!images || images.length === 0) return '';
  
  const sectionNum = parseInt(sectionId.replace('section-', ''), 10) || 0;
  const imageIndex = sectionNum % images.length;
  const relevantImage = images[imageIndex];
  
  if (!relevantImage) return '';
  
  return `
    <div class="relative overflow-hidden rounded-xl shadow-lg mb-8 group">
      <img
        src="${getProxiedImageUrl(relevantImage.src)}"
        alt="${relevantImage.alt || 'Whitepaper illustration'}"
        class="w-full h-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
        onerror="this.src='/api/placeholder/800/400?text=Illustration'; this.onerror=null;"
      />
      ${relevantImage.caption ? `
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <p class="text-white p-4 text-sm italic">
          ${relevantImage.caption}
        </p>
      </div>
      ` : ''}
    </div>
  `;
}

/**
 * Generate whitepaper HTML from markdown content - simplified like blogs
 */
export function generateWhitepaperFromMarkdown(
  markdownContent: string,
  title: string,
  authors: string,
  publishDate: string,
  coverImage: string = '',
  extractedImages: WhitepaperImage[] = []
): string {
  // Use default cover image if none provided
  let finalCoverImage = coverImage || `/api/placeholder/1200x600/0072e5/ffffff?text=${encodeURIComponent(title)}`;
  
  if (!coverImage && extractedImages && extractedImages.length > 0) {
    const firstImage = extractedImages[0];
    if (firstImage && firstImage.src) {
      finalCoverImage = firstImage.src;
    }
  }

  const lexer = new marked.Lexer();
  const tokens = lexer.lex(markdownContent);

  const markdownImages: WhitepaperImage[] = [];
  tokens.forEach(token => {
    if (token.type === 'image') {
      markdownImages.push({
        src: token.href,
        alt: token.text,
        caption: token.title || undefined
      });
    }
  });

  const allImages = [...extractedImages, ...markdownImages];

  // Extract sections and abstract
  const sections: Section[] = [];
  let abstract = '';
  let currentSection: Section | null = null;
  let currentContent: string[] = [];
  let sectionCounter = 0;

  for (const token of tokens) {
    if (token.type === 'heading') {
      const headerLevel = token.depth;
      const headerText = token.text.trim();

      if (headerLevel === 2) {
        if (currentSection) {
          sections.push({
            id: currentSection.id,
            title: currentSection.title,
            content: marked.parse(currentContent.join('\n')) as string,
            icon: currentSection.icon
          });
          currentContent = [];
        }

        sectionCounter++;
        const sectionId = `section-${sectionCounter}`;
      let icon = 'Default';
        const lowerTitle = headerText.toLowerCase();
        if (lowerTitle.includes('introduction')) icon = 'BookOpen';
        else if (lowerTitle.includes('security')) icon = 'Shield';
        else if (lowerTitle.includes('technology')) icon = 'Cpu';
        else if (lowerTitle.includes('data')) icon = 'Database';

        currentSection = {
        id: sectionId,
          title: headerText,
          content: '',
          icon
        };
      } else if (headerLevel > 2 && currentSection) {
        currentContent.push(token.raw);
      }
    } else if (currentSection) {
      currentContent.push(token.raw || '');
    } else {
      abstract += token.raw || '';
    }
  }

  if (currentSection && currentContent.length > 0) {
    sections.push({
      id: currentSection.id,
      title: currentSection.title,
      content: marked.parse(currentContent.join('\n')) as string,
      icon: currentSection.icon
    });
  }

  abstract = abstract.trim();
  if (abstract) {
    abstract = marked.parse(abstract) as string;
  } else {
    abstract = '<p>No abstract provided.</p>';
  }

  // Estimate read time
  const cleanText = markdownContent.replace(/#[^\n]*\n|!?\[.*?\]\(.*?\)|\n|\s+/g, ' ').trim();
  const wordCount = cleanText.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';
  
  // Generate the whitepaper template
  return generateWhitepaperTemplate(
    title,
    authors,
    publishDate,
    readTime,
    finalCoverImage,
    abstract,
    sections,
    allImages.slice(1) // Use remaining images for sections
  );
}

/**
 * Generate a basic preview from raw markdown text
 * 
 * @param markdownText Raw markdown text
 * @param title Optional title
 * @param authors Optional authors
 * @returns Preview HTML
 */
export function generateWhitepaperPreview(
  markdownText: string,
  title: string = 'Untitled Whitepaper',
  authors: string = 'Anonymous'
): string {
  // Format current date
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const publishDate = new Date().toLocaleDateString('en-US', options);
  
  // Clean up markdown
  const cleanedMarkdown = cleanupMarkdown(markdownText);
  
  // Extract any images from markdown
  const imageRegex = /!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g;
  const extractedImages: WhitepaperImage[] = [];
  
  let match;
  while ((match = imageRegex.exec(markdownText)) !== null) {
    extractedImages.push({
      src: match[2],
      alt: match[1] || 'Image',
      caption: match[3] || match[1] || 'Image'
    });
  }
  
  // Generate preview
  return generateWhitepaperFromMarkdown(
    cleanedMarkdown,
    title,
    authors,
    publishDate,
    '',
    extractedImages
  );
}

export async function processWhitepaperDocument(
  file: File,
  title?: string,
  authors?: string
): Promise<string> {
  try {
    // Read the file as ArrayBuffer
    const fileBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
    
    // Process the document file
    const { content, images, structure } = await processDocumentFile(fileBuffer);
    
    // Use document structure to extract title and author if not provided
    const documentTitle = title || structure.title || file.name.replace(/\.[^/.]+$/, "");
    const documentAuthors = authors || structure.author || 'Anonymous';
    
    // Format the current date
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const publishDate = new Date().toLocaleDateString('en-US', options);
    
    // Clean up the markdown content
    const cleanedMarkdown = cleanupMarkdown(content);
    
    // Generate a simple HTML version (without the edit functionality)
    const baseHtml = generateWhitepaperFromMarkdown(
      cleanedMarkdown,
      documentTitle,
      documentAuthors,
      publishDate,
      '',  // No cover image specified
      images
    );
    
    // Wrap it with the edit functionality
    return `
      <div class="fixed top-0 left-0 right-0 bg-yellow-500 text-center py-2 text-white font-bold z-50 flex justify-between items-center px-4">
        <span>Preview Mode - This is how your whitepaper will appear when published</span>
        <button 
          id="preview-edit-toggle" 
          class="bg-white text-yellow-600 px-4 py-1 rounded-md hover:bg-gray-100 transition-colors font-medium"
          onclick="toggleEditMode()"
        >
          Switch to Edit Mode
        </button>
      </div>
      
      <!-- Floating edit button that's always visible -->
      <div class="fixed bottom-4 right-4 z-50">
        <button 
          id="floating-edit-toggle" 
          class="bg-indrasol-blue text-white px-6 py-3 rounded-full shadow-lg hover:bg-indrasol-blue/90 transition-colors font-medium flex items-center"
          onclick="toggleEditMode()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path></svg>
          Edit Content
        </button>
      </div>
      
      <div id="preview-content" class="preview-mode">
        ${baseHtml}
      </div>
      
      <div id="edit-content" class="edit-mode hidden">
        <div class="container mx-auto py-16 px-4">
          <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-xl font-bold mb-4">Edit Whitepaper Content</h2>
            <p class="text-gray-600 mb-6">
              Edit the markdown content below. Use level 2 headings (## Heading) to create properly structured sections.
              <span class="text-indrasol-blue font-medium">Content before the first level 2 heading becomes the abstract.</span>
            </p>
            <textarea 
              id="markdown-editor" 
              class="w-full h-[70vh] p-4 border border-gray-300 rounded-lg font-mono text-sm"
              spellcheck="false"
            >${cleanedMarkdown.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
            <div class="flex justify-end mt-4">
              <button 
                id="update-preview" 
                class="bg-indrasol-blue text-white px-6 py-2 rounded-md hover:bg-indrasol-blue/90 transition-colors font-medium"
                onclick="updatePreview()"
              >
                Update Preview
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        .edit-mode.hidden, .preview-mode.hidden {
          display: none;
        }
      </style>
      
      <script>
        // Store original title and authors from the initial render
        const originalTitle = "${documentTitle.replace(/"/g, '\\"')}";
        const originalAuthors = "${documentAuthors.replace(/"/g, '\\"')}";
        
        function toggleEditMode() {
          const previewContent = document.getElementById('preview-content');
          const editContent = document.getElementById('edit-content');
          const toggleButton = document.getElementById('preview-edit-toggle');
          
          if (previewContent.classList.contains('hidden')) {
            // Switch to preview mode
            previewContent.classList.remove('hidden');
            editContent.classList.add('hidden');
            toggleButton.textContent = 'Switch to Edit Mode';
          } else {
            // Switch to edit mode
            previewContent.classList.add('hidden');
            editContent.classList.remove('hidden');
            toggleButton.textContent = 'Switch to Preview Mode';
          }
        }
        
        function updatePreview() {
          const markdownEditor = document.getElementById('markdown-editor');
          const markdownContent = markdownEditor.value;
          
          // Show loading indicator
          const loadingDiv = document.createElement('div');
          loadingDiv.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
          loadingDiv.innerHTML = '<div class="bg-white p-6 rounded-lg shadow-xl"><div class="animate-spin h-10 w-10 border-4 border-indrasol-blue border-t-transparent rounded-full mx-auto mb-4"></div><p class="text-center font-medium">Updating preview...</p></div>';
          document.body.appendChild(loadingDiv);
          
          // Store scroll position
          const scrollPosition = window.scrollY;
          
          try {
            setTimeout(() => {
              // Convert markdown to basic HTML (simplified for client-side use)
              const convertToHtml = (md) => {
                // Replace markdown headings with HTML headings
                let html = md
                  .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
                  .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
                  .replace(/^#### (.*?)$/gm, '<h4>$1</h4>')
                  .replace(/^##### (.*?)$/gm, '<h5>$1</h5>')
                  // Replace markdown paragraphs
                  .replace(/^([^<#\\n].*?)$/gm, '<p>$1</p>')
                  // Replace blank lines
                  .replace(/^\\s*$/gm, '<br>')
                  // Replace bold
                  .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
                  // Replace italics
                  .replace(/\\*(.*?)\\*/g, '<em>$1</em>');
                
                return html;
              };
              
              // Create a very basic preview structure
              const convertedContent = convertToHtml(markdownContent);
              
              // Extract first lines before first h2 as abstract
              const firstHeadingIndex = markdownContent.indexOf('## ');
              const abstract = firstHeadingIndex > 0 
                ? markdownContent.substring(0, firstHeadingIndex).trim() 
                : 'No abstract provided';
              
              // Very simple preview layout
              const previewElement = document.getElementById('preview-content');
              previewElement.innerHTML = '<div class="container mx-auto py-16">' +
                '<div class="bg-white rounded-lg shadow-md p-8">' +
                '<h1 class="text-3xl font-bold mb-8">' + originalTitle + '</h1>' +
                '<div class="text-sm text-gray-500 mb-4">By ' + originalAuthors + '</div>' +
                '<div class="bg-gray-100 p-4 rounded-md mb-8">' +
                '<h2 class="text-xl font-medium mb-2">Abstract</h2>' +
                convertToHtml(abstract) +
                '</div>' +
                '<div class="prose max-w-none">' +
                convertedContent +
                '</div>' +
                '</div>' +
                '</div>';
              
              // Remove loading indicator
              document.body.removeChild(loadingDiv);
              
              // Toggle back to preview mode
              toggleEditMode();
              
              // Restore scroll position
              window.scrollTo(0, scrollPosition);
            }, 500);
          } catch (error) {
            console.error('Error updating preview:', error);
            alert('Failed to update preview. Please try again.');
            document.body.removeChild(loadingDiv);
          }
        }
      </script>
    `;
  } catch (error) {
    console.error("Error processing document:", error);
    throw new Error(`Failed to process document: ${error.message}`);
  }
}/**
 * Cleanup and enhance the markdown content 
 * Similar to the cleanupMarkdown function in BlogTemplateGenerator
 */
function cleanupMarkdown(markdown: string): string {
  // Normalize line endings
  let enhanced = markdown.replace(/\r\n/g, '\n');
  
  // Remove excessive blank lines (more than 2 consecutive)
  enhanced = enhanced.replace(/\n{3,}/g, '\n\n');
  
  // Ensure proper spacing around headings for better parsing
  enhanced = enhanced.replace(/([^\n])(\n#{1,6}\s)/g, '$1\n\n$2');
  enhanced = enhanced.replace(/(#{1,6}[^\n]+)(\n[^#\n])/g, '$1\n$2');

  // Convert various bullet point styles to standard markdown bullets
  enhanced = enhanced.replace(/^[•○◦·]\s+/gm, '* ');
  enhanced = enhanced.replace(/^[➢➤▶►→]\s+/gm, '* ');
  enhanced = enhanced.replace(/^[-–—]\s+/gm, '* ');

  // Normalize numbered list formatting
  enhanced = enhanced.replace(/^(\d+)[\.\)]\s+/gm, '$1. ');
  
  // Improve code block formatting
  enhanced = enhanced.replace(/```([a-z]*)\n\s+/g, '```$1\n');
  enhanced = enhanced.replace(/\s+\n```/g, '\n```');

  // Ensure single blank line at the end of the file
  enhanced = enhanced.replace(/\n*$/, '\n');

  return enhanced;
}

