// BlogTemplateGenerator.ts
// This utility handles the conversion of raw document content into formatted blog HTML

import { marked } from 'marked';
import TurndownService from 'turndown';
import mammoth from 'mammoth';
import { getProxiedImageUrl } from './imageUtils';

// Mammoth interface extensions for TypeScript support
interface MammothImage {
  contentType?: string;
  read(): Promise<Buffer>;
  altText?: string;
  path?: string;
}

/**
 * Process a document file (DOCX) and extract its content with better precision
 * This is a placeholder implementation. To make it fully functional, 
 * the TurndownService library needs to be installed and uncommented above.
 * 
 * @param docxBuffer The document file as an ArrayBuffer
 * @returns Promise with extracted text, images, and structure
 */
export async function processDocumentFile(docxBuffer: ArrayBuffer): Promise<{
  content: string;
  images: any[];
  structure: {
    title: string;
    author?: string;
    headings: { level: number, text: string, id: string }[];
  };
}> {
  // Enhanced options for mammoth
  const options = {
    // Fix the Image interface issue by making the function async and returning a Promise
    convertImage: mammoth.images.imgElement(async (image: any) => {
      return {
        src: '#', // We'll extract images separately
        alt: image.altText || 'Document image'
      };
    })
  };

  try {
    // Extract the document content
    const result = await mammoth.convertToHtml({ arrayBuffer: docxBuffer }, options);
    const extractedHtml = result.value;
    
    console.log("Document processed with mammoth, messages:", result.messages);
    
    // Extract images from the document
    const extractedImages = await extractImagesFromDocument(docxBuffer);
    
    // Extract document structure by parsing the HTML
    const structure = extractDocumentStructure(extractedHtml);
    
    // Convert HTML to Markdown with Turndown
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '*',
      codeBlockStyle: 'fenced',
      linkStyle: 'inlined'
    });
    
    // Customize turndown to better handle image captions
    turndownService.addRule('figureCaptions', {
      filter: (node) => {
        return node.nodeName === 'P' && 
               node.classList && node.classList.contains('caption');
      },
      replacement: (content) => {
        return `*${content}*\n\n`;
      }
    });
    
    // Add rule for code blocks
    turndownService.addRule('codeBlocks', {
      filter: (node) => {
        return node.nodeName === 'PRE' && 
               node.classList && node.classList.contains('code');
      },
      replacement: (content) => {
        return `\n\`\`\`\n${content}\n\`\`\`\n\n`;
      }
    });
    
    // Better handling of nested lists
    turndownService.addRule('nestedLists', {
      filter: ['ul', 'ol'],
      replacement: (content, node) => {
        // Check if this is a nested list
        const parent = node.parentNode;
        const isNested = parent && 
                        (parent.nodeName === 'LI' || 
                         parent.nodeName === 'UL' || 
                         parent.nodeName === 'OL');
                         
        // For nested lists, don't add extra newlines
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
 * Extract images from a DOCX document with improved precision
 * @param docxBuffer Document as ArrayBuffer
 * @returns Promise with array of extracted images
 */
async function extractImagesFromDocument(docxBuffer: ArrayBuffer): Promise<any[]> {
  try {
    // Extract images using mammoth's built-in functionality
    const imagePromises: Promise<any>[] = [];
    
    await mammoth.convertToHtml({ arrayBuffer: docxBuffer }, {
      convertImage: mammoth.images.imgElement(async (image: any) => {
        // Track each image and extract its data
        const imagePromise = image.read()
          .then(imageBuffer => {
            // Convert buffer to base64 for preview
            let mimeType = 'image/jpeg'; // Default
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
              placeholder: base64,
              alt: image.altText || 'Document image',
              caption: image.altText || 'Document image',
              position: {
                percentThroughDocument: Math.random() * 100 // We'll use random positioning for now
              }
            };
          })
          .catch(error => {
            console.error("Error extracting image:", error);
            return null;
          });
        
        imagePromises.push(imagePromise);
        
        // Return placeholder for mammoth
        return {
          src: '#',
          alt: image.altText || 'Document image'
        };
      })
    });
    
    // Wait for all image extraction to complete
    const extractedImages = await Promise.all(imagePromises);
    return extractedImages.filter(img => img !== null);
  } catch (error) {
    console.error("Error extracting images:", error);
    return [];
  }
}

/**
 * Extract document structure from HTML content
 * @param html The document HTML
 * @returns Structure object with title, author and headings
 */
function extractDocumentStructure(html: string): {
  title: string;
  author?: string;
  headings: { level: number, text: string, id: string }[];
} {
  // Since we can't use DOMParser directly in Node.js, we'll use regex for basic extraction
  // This is a simplified version - a full implementation would use a proper HTML parser
  
  // Extract title (first h1 or h2)
  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i) || html.match(/<h2[^>]*>(.*?)<\/h2>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '') : 'Untitled Document';
  
  // Try to find author info
  const authorMatch = html.match(/<p[^>]*class="document-author"[^>]*>(.*?)<\/p>/i);
  const author = authorMatch ? authorMatch[1].replace(/<[^>]*>/g, '') : undefined;
  
  // Extract headings using regex
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
 * Convert raw text content to markdown format with improved extraction
 * @param rawText The raw text extracted from the document
 * @param images Array of image objects
 * @returns Formatted markdown text
 */
function convertToMarkdown(rawText: string, images: any[]): string {
  console.log("Converting to markdown - Raw text sample:", rawText.substring(0, 200));

  // Pre-process the text to normalize line breaks and spaces
  let processed = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Check if content is HTML - if so, convert using Turndown
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(processed);
  if (isHtml) {
    console.log("HTML content detected, converting to markdown with Turndown");
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '*',
      codeBlockStyle: 'fenced'
    });
    
    // Custom rule to handle complex lists better
    turndownService.addRule('listItems', {
      filter: ['ul', 'ol'],
      replacement: function(content, node) {
        // Check if this is a nested list
        const parent = node.parentNode;
        const isNested = parent && 
                         (parent.nodeName === 'LI' || 
                          parent.nodeName === 'UL' || 
                          parent.nodeName === 'OL');
                          
        // For nested lists, don't add extra newlines
        const prefix = isNested ? '' : '\n\n';
        const suffix = isNested ? '' : '\n\n';
        
        return prefix + content + suffix;
      }
    });
    
    processed = turndownService.turndown(processed);
    console.log("Converted HTML to markdown with Turndown");
  }

  // More robust paragraph splitting that preserves list structures
  const paragraphs = [];
  let currentParagraph = '';
  let inList = false;
  
  processed.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    const isBulletPoint = /^[*\-+]\s+/.test(trimmedLine);
    const isNumberedItem = /^\d+\.\s+/.test(trimmedLine);
    
    // Handle list items
    if (isBulletPoint || isNumberedItem) {
      if (!inList) {
        // If we were building a paragraph, finish it first
        if (currentParagraph.trim()) {
          paragraphs.push(currentParagraph.trim());
          currentParagraph = '';
        }
        inList = true;
      }
      
      // Start a new list paragraph if this is the first item
      if (!currentParagraph.trim()) {
        currentParagraph = line;
      } else {
        // Add to current list
        currentParagraph += '\n' + line;
      }
    } 
    // Handle empty lines
    else if (!trimmedLine) {
      // End of paragraph or list
      if (currentParagraph.trim()) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
        inList = false;
      }
    } 
    // Regular line
    else {
      if (inList) {
        // Check if this is a continuation of a list item (indented)
        if (line.startsWith('  ') || line.startsWith('\t')) {
          currentParagraph += '\n' + line;
        } else {
          // Not a list continuation, end the list
          paragraphs.push(currentParagraph.trim());
          currentParagraph = line;
          inList = false;
        }
      } else {
        // Regular paragraph content
        if (!currentParagraph.trim()) {
          currentParagraph = line;
        } else {
          currentParagraph += ' ' + line;
        }
      }
    }
  });
  
  // Add the final paragraph if any
  if (currentParagraph.trim()) {
    paragraphs.push(currentParagraph.trim());
  }

  console.log(`Detected ${paragraphs.length} paragraphs with improved extraction`);

  // Process images and place them intelligently throughout content
  let imageData = prepareImagesForPlacement(images, paragraphs, processed);

  let markdown = '';

  // Define potential section titles using regex patterns - expanded for better detection
  const sectionPatterns = [
    { pattern: /\b(?:introduction|overview|getting started|preface|foreword|preamble|abstract|summary|executive summary)\b/i, title: 'Introduction' },
    { pattern: /\b(?:background|context|history|setting|historical perspective|prior work|previous research)\b/i, title: 'Background' },
    { pattern: /\b(?:methodology|approach|method|process|procedure|technique|framework|experiment setup|research design)\b/i, title: 'Methodology' },
    { pattern: /\b(?:results|findings|outcome|data|observations|measurements|analysis results|experimental results)\b/i, title: 'Results' },
    { pattern: /\b(?:discussion|analysis|interpretation|evaluation|assessment|implication|significance|meaning)\b/i, title: 'Discussion' },
    { pattern: /\b(?:conclusion|summary|final thoughts|closing remarks|final words|wrap-up|wrap up|takeaway|key points)\b/i, title: 'Conclusion' },
    { pattern: /\b(?:recommendations|suggestions|next steps|future work|future directions|implications|action items|proposed actions)\b/i, title: 'Recommendations' },
    { pattern: /\b(?:references|sources|bibliography|works cited|citations|literature|further reading)\b/i, title: 'References' },
    { pattern: /\b(?:appendix|appendices|supplementary|additional information|additional data)\b/i, title: 'Appendix' },
    { pattern: /\b(?:case study|example|application|implementation|demonstration|use case)\b/i, title: 'Case Study' },
    { pattern: /\b(?:benefits|advantages|strengths|value proposition|key advantages|positive aspects)\b/i, title: 'Benefits' },
    { pattern: /\b(?:challenges|limitations|constraints|drawbacks|disadvantages|issues|problems)\b/i, title: 'Challenges' },
    { pattern: /\b(?:solution|resolution|answer|remedy|fix|approach|proposal)\b/i, title: 'Solution' },
    { pattern: /\b(?:features|capabilities|functionality|specifications|characteristics|attributes)\b/i, title: 'Features' },
    { pattern: /\b(?:faq|frequently asked questions|common questions|q&a|questions and answers)\b/i, title: 'FAQ' },
    { pattern: /\b(?:data|statistics|metrics|numbers|figures|analytics|measurements)\b/i, title: 'Data Analysis' },
    { pattern: /\b(?:tools|technologies|equipment|software|hardware|resources|instruments)\b/i, title: 'Tools & Technologies' },
    { pattern: /\b(?:implementation|execution|deployment|installation|setup|configuration)\b/i, title: 'Implementation' },
    { pattern: /\b(?:impact|effect|consequence|outcome|result|influence)\b/i, title: 'Impact' },
    { pattern: /\b(?:best practices|guidelines|recommendations|tips|advice|strategies)\b/i, title: 'Best Practices' }
  ];

  // Keep track of the character position while processing
  let currentCharPos = 0;

  // Process paragraphs and convert to markdown with improved section detection
  paragraphs.forEach((paragraph, index) => {
    // Check for images that should be inserted before this paragraph
    const imagesToInsertNow = imageData.imagesToInsert.filter(img =>
      img.insertionPoint >= currentCharPos &&
      img.insertionPoint < currentCharPos + paragraph.length + 2
    );

    // Insert any images that belong here
    if (imagesToInsertNow.length > 0) {
      // Remove these images from the pending list
      imageData.imagesToInsert = imageData.imagesToInsert.filter(img =>
        !imagesToInsertNow.includes(img)
      );

      // Add images to markdown with improved error handling
      imagesToInsertNow.forEach(img => {
        try {
          // Use our proxy for image URLs with better error handling
          const imageUrl = getProxiedImageUrl(img.placeholder || img.src || 
            `/api/placeholder/800/400?text=${encodeURIComponent(img.caption || 'Image')}`);
          
          // Include proper image markdown with appropriate alt text and caption
          markdown += `\n![${img.caption || 'Image'}](${imageUrl})\n*${img.caption || 'Image caption'}*\n\n`;
        } catch (error) {
          console.error("Error inserting image:", error);
          // Add a placeholder message instead
          markdown += `\n*[Image could not be displayed]*\n\n`;
        }
      });
    }

    // Enhanced heading detection
    let isHeading = false;
    const trimmedParagraph = paragraph.trim();

    // If paragraph starts with # or ## it's definitely a heading - keep it as is
    if (/^#{1,3}\s+(.+)$/.test(trimmedParagraph)) {
      // Extract the heading level and text to ensure proper formatting
      const headingMatch = trimmedParagraph.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch) {
        const [_, hashes, headingText] = headingMatch;
        markdown += `\n${hashes} ${headingText}\n\n`;
        isHeading = true;
      } else {
        // Fallback if regex match fails
        markdown += `\n${trimmedParagraph}\n\n`;
        isHeading = true;
      }
    }
    // Check for heading patterns with improved detection
    else if (trimmedParagraph.length < 100 && !trimmedParagraph.match(/[.!?]$/)) {
      // Look for heading patterns based on format (ALL CAPS, Title Case, etc.)
      const isAllCaps = trimmedParagraph === trimmedParagraph.toUpperCase() && trimmedParagraph.length > 3;
      const isTitleCase = /^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/.test(trimmedParagraph);
      const hasNoStopWords = !/\b(and|the|or|but|for|nor|yet|so|a|an|in|on|at|by|to|from)\b/i.test(trimmedParagraph);
      
      // Check if it matches our section patterns
      let matchedSection = false;
      for (const { pattern, title } of sectionPatterns) {
        if (pattern.test(trimmedParagraph)) {
          // Add as proper markdown heading
          markdown += `\n## ${trimmedParagraph}\n\n`;
          isHeading = true;
          matchedSection = true;
          break;
        }
      }

      // If it looks like a heading by format but didn't match patterns
      if (!matchedSection && 
          (isAllCaps || 
           (isTitleCase && hasNoStopWords) || 
           trimmedParagraph.length < 50 && !trimmedParagraph.match(/[.!?]$/))) {
        markdown += `\n## ${trimmedParagraph}\n\n`;
        isHeading = true;
      }
    }

    if (!isHeading) {
      // Enhanced list processing - detect and format lists properly
      if (paragraph.includes('\n')) {
        const lines = paragraph.split('\n');

        // Check for list patterns
        const bulletPattern = /^\s*[•*\-○◦➢➤▶►·]\s+/;
        const numberedPattern = /^\s*(\d+)[.)\]]\s+/;
        
        // Count the number of list-like lines
        const listLikeLines = lines.filter(line => 
          bulletPattern.test(line) || numberedPattern.test(line)
        ).length;
        
        // If more than 50% of lines look like list items, format as a list
        if (listLikeLines > 0 && (listLikeLines / lines.length > 0.5)) {
          console.log("Detected list paragraph with", listLikeLines, "items out of", lines.length, "lines");

          let lastWasBullet = false;
          let inList = false;
          let listIndent = '';
          let listCount = 0; // Track list item numbers for better continuity

          // Process each line for better list formatting
          lines.forEach((line, lineIndex) => {
            const bulletMatch = line.match(/^\s*[•*\-○◦➢➤▶►·]\s+(.+)$/);
            const numberedMatch = line.match(/^\s*(\d+)[.)\]]\s+(.+)$/);

            if (bulletMatch) {
              // Found a bullet point - standardize format
              if (!inList || !lastWasBullet) {
                // Start a new bullet list
                if (inList) markdown += '\n'; // Add spacing between different list types
                inList = true;
                lastWasBullet = true;
                listCount = 0;
              }
              
              // Detect indentation for nested lists
              const leadingSpaces = line.match(/^(\s*)/)[1].length;
              const indent = Math.floor(leadingSpaces / 2);
              listIndent = '  '.repeat(indent);
              
              // Clean and standardize bullet format
              const cleanContent = bulletMatch[1].trim()
                .replace(/^\s*[-•*]\s*/, '') // Remove any nested bullets
                .trim();
                
              // Add the bullet point with proper indentation  
              markdown += `${listIndent}* ${cleanContent}\n`;
            } 
            else if (numberedMatch) {
              // Found a numbered list item
              if (!inList || lastWasBullet) {
                // Start a new numbered list
                if (inList) markdown += '\n'; // Add spacing between different list types
                inList = true;
                lastWasBullet = false;
                listCount = 0;
              }
              
              // Detect indentation for nested lists
              const leadingSpaces = line.match(/^(\s*)/)[1].length;
              const indent = Math.floor(leadingSpaces / 2);
              listIndent = '  '.repeat(indent);
              
              // Use continuous numbering or respect original numbers
              listCount++;
              
              // Clean content and remove any nested numbering
              const cleanContent = numberedMatch[2].trim()
                .replace(/^\s*\d+[.)\]]\s*/, '') // Remove any nested numbering
                .trim();
                
              markdown += `${listIndent}${listCount}. ${cleanContent}\n`;
            } 
            else if (line.trim()) {
              // Regular line or list continuation
              if (inList && line.match(/^\s+/) && !line.match(bulletPattern) && !line.match(numberedPattern)) {
                // This is likely a continuation of a list item
                markdown += `${listIndent}  ${line.trim()}\n`;
              } else {
                // Regular line
                inList = false;
                listCount = 0;
                markdown += `${line.trim()}\n`;
              }
            }
          });

          markdown += '\n'; // Add a blank line after the list
        } 
        else {
          // Not a list, treat as regular paragraph with line breaks
          markdown += `${paragraph.trim()}\n\n`;
        }
      } 
      else {
        // Single line paragraph
        // Check for single bullet point or numbered item for better formatting
        const bulletMatch = paragraph.match(/^\s*[•*\-○◦➢➤▶►·]\s+(.+)$/);
        const numberedMatch = paragraph.match(/^\s*(\d+)[.)\]]\s+(.+)$/);

        if (bulletMatch) {
          // Format consistent bullet points
          markdown += `* ${bulletMatch[1].trim()}\n\n`;
        } 
        else if (numberedMatch) {
          // Format consistent numbered items
          markdown += `1. ${numberedMatch[2].trim()}\n\n`;
        } 
        else {
          // Regular paragraph
          markdown += `${paragraph.trim()}\n\n`;
        }
      }
    }

    // Update character position counter
    currentCharPos += paragraph.length + 2; // +2 for the paragraph separator
  });

  // Insert any remaining images that weren't placed yet at the end of the document
  if (imageData.imagesToInsert.length > 0) {
    markdown += `\n## Additional Figures\n\n`;
    imageData.imagesToInsert.forEach(img => {
        try {
          // Use our proxy for image URLs with better error handling
          const imageUrl = getProxiedImageUrl(img.placeholder || img.src || 
            `/api/placeholder/800/400?text=${encodeURIComponent(img.caption || 'Image')}`);
          
          markdown += `\n![${img.caption || 'Image'}](${imageUrl})\n*${img.caption || 'Image caption'}*\n\n`;
        } catch (error) {
          console.error("Error inserting remaining image:", error);
          markdown += `\n*[Image could not be displayed]*\n\n`;
        }
    });
  }

  // Process the generated markdown for better formatting
  return cleanupMarkdown(markdown);
}

/**
 * Prepare images for intelligent placement in the document with improved robustness
 * @param images Array of image objects extracted from document
 * @param paragraphs Array of text paragraphs
 * @param fullText Complete text content
 * @returns Object with prepared image data and insertion points
 */
function prepareImagesForPlacement(images: any[], paragraphs: string[], fullText: string): any {
  // Ensure we have valid images to work with
  if (!images || !Array.isArray(images)) {
    console.warn("No valid images provided for placement");
    return { imagesToInsert: [] };
  }

  // Filter out invalid or problematic images
  const validImages = images.filter((img, index) => {
    if (!img) {
      console.warn(`Skipping null/undefined image at index ${index}`);
      return false;
    }
    
    // Skip first image if we have multiple images (it's used for the hero section)
    if (index === 0 && images.length > 1) {
      return false;
    }
    
    // Ensure image has either src or placeholder
    if (!img.src && !img.placeholder) {
      console.warn(`Skipping image at index ${index} with no src or placeholder`);
      return false;
    }
    
    return true;
  });

  if (validImages.length === 0) {
    console.log("No valid content images to insert");
    return { imagesToInsert: [] };
  }

  // Calculate total text length and paragraph boundaries
  const textLength = fullText.length;
  if (textLength === 0) {
    console.warn("Empty text content, cannot place images");
    return { imagesToInsert: [] };
  }
  
  // Enhanced paragraph analysis for better content structure understanding
  const enhancedParagraphs = paragraphs.map((p, index) => {
    // Detect if paragraph is a heading
    const isHeading = /^#{1,3}\s+/.test(p.trim());
    
    // Detect if paragraph is a list
    const isList = p.includes('\n') && 
                  p.split('\n').filter(line => /^\s*[*\-+]\s+/.test(line) || 
                                              /^\s*\d+\.\s+/.test(line)).length > 0;
    
    // Attempt to determine paragraph importance by length and position
    const importance = calculateParagraphImportance(p, index, paragraphs.length);
    
    return {
      text: p,
      position: index,
      isHeading,
      isList,
      importance,
      charPosition: paragraphs.slice(0, index).reduce((sum, p) => sum + p.length + 2, 0)
    };
  });
  
  // Identify logical content sections based on headings
  const contentSections = identifyContentSections(enhancedParagraphs);
  
  // Calculate paragraph boundaries for more precise placement
  const paragraphBoundaries = enhancedParagraphs.map(p => p.charPosition);
  
  // Add an ending boundary
  if (paragraphBoundaries.length > 0) {
    paragraphBoundaries.push(paragraphBoundaries[paragraphBoundaries.length - 1] + 
                            enhancedParagraphs[enhancedParagraphs.length - 1].text.length);
  }

  // Enhanced image placement with more contextual relevance
  const imagesToInsert = validImages.map((img, index) => {
    // Generate a default caption if none exists
    if (!img.caption) {
      img.caption = img.alt || `Figure ${index + 1}`;
    }
    
    // Determine best insertion point with improved context-awareness
    let bestInsertionPoint = { 
      position: 0,
      score: 0,
      sectionIndex: -1
    };

    // 1. Try to use explicit position information if available
    if (img.position) {
      if (typeof img.position.textPosition === 'number' && img.position.textPosition >= 0) {
        // Use precise text position if available
        bestInsertionPoint.position = img.position.textPosition;
        bestInsertionPoint.score = 100; // High confidence
      } else if (typeof img.position.percentThroughDocument === 'number' && img.position.percentThroughDocument >= 0) {
        // Or use percentage position
        bestInsertionPoint.position = Math.floor((textLength * img.position.percentThroughDocument) / 100);
        bestInsertionPoint.score = 80; // Good confidence
      }
    }
    
    // 2. If position info unavailable or low confidence, try to place images contextually
    if (bestInsertionPoint.score < 80 && img.caption) {
      // Extract meaningful keywords from the caption
      const captionKeywords = extractKeywords(img.caption);
      
      if (captionKeywords.length > 0) {
        // For each content section, calculate relevance score
        contentSections.forEach((section, sectionIndex) => {
          const sectionText = section.paragraphs.map(p => p.text).join(' ').toLowerCase();
          const sectionKeywords = extractKeywords(sectionText);
          
          // Calculate keyword match score
          let matchScore = 0;
          captionKeywords.forEach(keyword => {
            // Check for exact matches
            if (sectionText.includes(keyword.toLowerCase())) {
              matchScore += 5;
            }
            
            // Check for partial matches
            sectionKeywords.forEach(sectionKeyword => {
              if (sectionKeyword.includes(keyword) || keyword.includes(sectionKeyword)) {
                matchScore += 2;
              }
            });
          });
          
          // Adjust score based on section importance
          const adjustedScore = matchScore * (1 + section.importance / 10);
          
          // If this is the best match so far
          if (adjustedScore > bestInsertionPoint.score) {
            // Find optimal position within this section (after the first paragraph)
            const optimalParaIndex = section.paragraphs.length > 1 ? 1 : 0;
            const optimalPara = section.paragraphs[optimalParaIndex];
            
            bestInsertionPoint = {
              position: optimalPara.charPosition,
              score: adjustedScore,
              sectionIndex: sectionIndex
            };
          }
        });
      }
    }
    
    // 3. If still no good match, use strategic distribution
    if (bestInsertionPoint.score < 10) {
      // Place images strategically throughout the document
      // Try to place after important paragraphs
      const importantParas = enhancedParagraphs
        .filter(p => p.importance > 7 && !p.isHeading)
        .sort((a, b) => b.importance - a.importance);
      
      if (importantParas.length > 0) {
        // Distribute images among important paragraphs
        const targetIndex = index % importantParas.length;
        bestInsertionPoint.position = importantParas[targetIndex].charPosition;
        bestInsertionPoint.score = 50;
      } else {
        // Fall back to evenly distributed placement
        bestInsertionPoint.position = Math.floor((textLength / (validImages.length + 1)) * (index + 1));
        bestInsertionPoint.score = 30;
      }
    }

    // Find the nearest paragraph boundary for natural placement
    let nearestBoundary = findNearestParagraphBoundary(bestInsertionPoint.position, paragraphBoundaries);

    return {
      ...img,
      insertionPoint: nearestBoundary,
      caption: img.caption || `Figure ${index + 1}`,
      sectionIndex: bestInsertionPoint.sectionIndex
    };
  });

  // Sort by insertion point to maintain document flow
  imagesToInsert.sort((a, b) => a.insertionPoint - b.insertionPoint);

  // Improved image spacing algorithm
  // Ensure proper spacing between images and avoid clustering
  const minCharsBetweenImages = 500; // Minimum characters between images
  
  for (let i = 1; i < imagesToInsert.length; i++) {
    const prevImage = imagesToInsert[i - 1];
    const currentImage = imagesToInsert[i];
    
    // If images are too close together
    if (currentImage.insertionPoint - prevImage.insertionPoint < minCharsBetweenImages) {
      // If they belong to the same section, try to space them within the section
      if (currentImage.sectionIndex !== -1 && currentImage.sectionIndex === prevImage.sectionIndex) {
        const section = contentSections[currentImage.sectionIndex];
        const sectionParagraphs = section.paragraphs;
        
        // Find paragraphs in this section that are after the previous image
        const laterParagraphs = sectionParagraphs.filter(p => 
          p.charPosition > prevImage.insertionPoint + minCharsBetweenImages);
        
        if (laterParagraphs.length > 0) {
          // Place at the beginning of a later paragraph
          currentImage.insertionPoint = laterParagraphs[0].charPosition;
        } else {
          // Place at the end of the section
          const lastPara = sectionParagraphs[sectionParagraphs.length - 1];
          currentImage.insertionPoint = lastPara.charPosition + lastPara.text.length;
        }
      } 
      // If different sections or no section info, use general spacing
      else {
        // Find the next suitable paragraph boundary
        for (let j = 0; j < paragraphBoundaries.length; j++) {
          if (paragraphBoundaries[j] >= prevImage.insertionPoint + minCharsBetweenImages) {
            currentImage.insertionPoint = paragraphBoundaries[j];
            break;
          }
        }
      }
    }
  }

  return { imagesToInsert };
}

/**
 * Calculate importance score for a paragraph based on its content and position
 * @param paragraph The paragraph text
 * @param index Position in the document
 * @param totalParagraphs Total number of paragraphs in the document
 * @returns Importance score (0-10)
 */
function calculateParagraphImportance(paragraph: string, index: number, totalParagraphs: number): number {
  let score = 5; // Default medium importance
  
  // Headings are more important
  if (/^#{1,3}\s+/.test(paragraph.trim())) {
    score += 3;
  }
  
  // Longer paragraphs tend to be more substantive (up to a point)
  const wordCount = paragraph.split(/\s+/).length;
  if (wordCount > 100) score += 2;
  else if (wordCount > 50) score += 1;
  
  // Beginning and end of document often contain important content
  if (index < totalParagraphs * 0.2) score += 1; // First 20% of document
  if (index > totalParagraphs * 0.8) score += 1; // Last 20% of document
  
  // Cap at 10
  return Math.min(10, score);
}

/**
 * Identify logical content sections based on headings and paragraph structure
 * @param paragraphs Array of enhanced paragraphs
 * @returns Array of content sections
 */
function identifyContentSections(paragraphs: any[]): any[] {
  const sections = [];
  let currentSection = {
    title: 'Introduction',
    paragraphs: [],
    importance: 8 // Introduction is important
  };
  
  // Process paragraphs to identify logical sections
  paragraphs.forEach((para, index) => {
    // If this is a heading, it starts a new section
    if (para.isHeading) {
      // Save the current section if it has paragraphs
      if (currentSection.paragraphs.length > 0) {
        sections.push(currentSection);
      }
      
      // Extract heading text
      const headingText = para.text.replace(/^#{1,3}\s+/, '');
      
      // Start a new section
      currentSection = {
        title: headingText,
        paragraphs: [para],
        importance: 7 // Default importance for sections
      };
      
      // Adjust importance based on heading level and position
      if (para.text.startsWith('# ')) currentSection.importance += 2;
      if (index < paragraphs.length * 0.3) currentSection.importance += 1;
    } else {
      // Add this paragraph to the current section
      currentSection.paragraphs.push(para);
    }
  });
  
  // Add the last section
  if (currentSection.paragraphs.length > 0) {
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Extract meaningful keywords from text
 * @param text The text to analyze
 * @returns Array of keywords
 */
function extractKeywords(text: string): string[] {
  // Remove common stop words and punctuation
  const stopWords = ["the", "and", "a", "an", "in", "on", "at", "to", "for", "with", "by", "of", "is", "are", "was", "were"];
  
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && !stopWords.includes(word)
    )
    .slice(0, 10); // Limit to top 10 keywords
}

/**
 * Find the nearest paragraph boundary to a given position
 * @param position Target position
 * @param boundaries Array of paragraph boundaries
 * @returns Position of nearest paragraph boundary
 */
function findNearestParagraphBoundary(position: number, boundaries: number[]): number {
  if (boundaries.length === 0) return position;
  
  let nearestBoundary = boundaries[0];
  let minDistance = Math.abs(position - nearestBoundary);
  
  for (const boundary of boundaries) {
    const distance = Math.abs(boundary - position);
    if (distance < minDistance) {
      minDistance = distance;
      nearestBoundary = boundary;
    }
  }
  
  return nearestBoundary;
}

/**
 * Clean up and enhance the raw markdown for better formatting
 * @param markdown Raw markdown content
 * @returns Enhanced markdown
 */
function cleanupMarkdown(markdown: string): string {
  console.log("Cleaning up markdown...");

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
  
  // Ensure proper spacing for list items to maintain correct nesting
  // First, identify potential list items with their indentation
  const lines = enhanced.split('\n');
  const processedLines = [];
  
  // Track list state to properly format nested lists
  let currentIndent = 0;
  let inList = false;
  let listStack = [];
  let bulletListCounter = 0;
  let numberedListCounter = 0;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    
    // Trim trailing whitespace from all lines
    line = line.replace(/\s+$/, '');
    
    // Skip empty lines
    if (!line.trim()) {
      // If we're in a list and the next line might continue it, keep the empty line
      // as it might be needed for proper list formatting
      if (inList && (nextLine.trim().startsWith('*') || nextLine.trim().match(/^\d+\./))) {
        processedLines.push('');
      } 
      // If we're in a list but next line doesn't continue it, end the list
      else if (inList) {
        processedLines.push('');
        inList = false;
        currentIndent = 0;
        listStack = [];
        bulletListCounter = 0;
        numberedListCounter = 0;
      } 
      // Just a regular paragraph break
      else {
        processedLines.push('');
      }
      continue;
    }

    // Check for list items with indentation
    const bulletMatch = line.match(/^(\s*)([*\-+])\s+(.*)/);
    const numberedMatch = line.match(/^(\s*)(\d+)\.\s+(.*)/);
    
    // Handle indented bullet list items
    if (bulletMatch) {
      const [_, indent, marker, content] = bulletMatch;
      const indentLevel = Math.floor(indent.length / 2);
      
      // If starting a new list or changing indent level
      if (!inList || indentLevel !== currentIndent) {
      if (indentLevel > currentIndent) {
          // Going deeper in nesting
          for (let j = currentIndent; j < indentLevel; j++) {
            listStack.push('bullet');
          }
        } else if (indentLevel < currentIndent) {
          // Coming back up in nesting
          listStack = listStack.slice(0, indentLevel);
        }
        
        currentIndent = indentLevel;
        inList = true;
        bulletListCounter++;
        
        // Reset numbered counter when switching to bullets
        numberedListCounter = 0;
      }
      
      // Format with consistent indentation
      const properIndent = '  '.repeat(indentLevel);
      processedLines.push(`${properIndent}* ${content}`);
    }
    // Handle indented numbered list items
    else if (numberedMatch) {
      const [_, indent, number, content] = numberedMatch;
      const indentLevel = Math.floor(indent.length / 2);
      
      // If starting a new list or changing indent level
      if (!inList || indentLevel !== currentIndent) {
        if (indentLevel > currentIndent) {
          // Going deeper in nesting
          for (let j = currentIndent; j < indentLevel; j++) {
            listStack.push('number');
          }
        } else if (indentLevel < currentIndent) {
          // Coming back up in nesting
          listStack = listStack.slice(0, indentLevel);
        }
        
        currentIndent = indentLevel;
        inList = true;
        numberedListCounter++;
        
        // Reset bullet counter when switching to numbers
        bulletListCounter = 0;
      } else {
        numberedListCounter++;
      }
      
      // Format with consistent indentation and sequential numbering
      const properIndent = '  '.repeat(indentLevel);
      processedLines.push(`${properIndent}${numberedListCounter}. ${content}`);
    }
    // Regular line (not a list item)
        else {
      // If it's an indented continuation of a list item
      if (inList && line.match(/^\s+/) && !line.trim().startsWith('#')) {
        const properIndent = '  '.repeat(currentIndent + 1);
        processedLines.push(`${properIndent}${line.trim()}`);
      } 
      // Regular paragraph or heading
    else {
      processedLines.push(line);
        
        // If this is not a heading and not indented, end any current list
        if (!line.trim().startsWith('#') && !line.match(/^\s+/)) {
          inList = false;
          currentIndent = 0;
          listStack = [];
          bulletListCounter = 0;
          numberedListCounter = 0;
        }
      }
    }
  }
  
  enhanced = processedLines.join('\n');

  // Detect potential block quotes and format them correctly
  enhanced = enhanced.replace(/^(\s*"[^"]+".*?—.*)$/gm, '> $1');

  // Unify consecutive bullet points formatting - remove blank lines between items of the same list
  enhanced = enhanced.replace(/(\* [^\n]+)\n\n(\* )/g, '$1\n$2');

  // Unify consecutive numbered items formatting
  enhanced = enhanced.replace(/(\d+\. [^\n]+)\n\n(\d+\. )/g, '$1\n$2');

  // Improve code block formatting
  enhanced = enhanced.replace(/```([a-z]*)\n\s+/g, '```$1\n');
  enhanced = enhanced.replace(/\s+\n```/g, '\n```');

  // Improve table formatting if there are any tables
  if (enhanced.includes('|')) {
    // Find and format potential tables more cleanly
    const tableRegex = /^.*\|.*\n.*\|.*$/gm;
    enhanced = enhanced.replace(tableRegex, (match) => {
      // Split into rows and check if it looks like a table
      const rows = match.split('\n');
      if (rows.length >= 2 && rows[0].includes('|') && rows[1].includes('|')) {
        // Normalize the table structure
        const normalizedRows = rows.map(row => {
          // Trim cells and ensure consistent spacing
          return row.split('|')
            .map(cell => cell.trim())
            .join(' | ')
            .replace(/^\s*\|\s*/, '| ')  // Start with pipe
            .replace(/\s*\|\s*$/, ' |'); // End with pipe
        });

        // For tables that don't have a separator row, add one
        if (rows.length >= 2 && !rows[1].match(/^[\s\-\|:]+$/)) {
          const headerCells = normalizedRows[0].split('|').length - 2; // -2 for leading/trailing pipes
          const separator = '| ' + Array(headerCells).fill('---').join(' | ') + ' |';
          normalizedRows.splice(1, 0, separator);
        }

        return normalizedRows.join('\n');
      }
      return match;
    });
  }

  // Ensure single blank line at the end of the file
  enhanced = enhanced.replace(/\n*$/, '\n');

  console.log("Markdown cleaned up with improved formatting");
  return enhanced;
}

/**
 * Generate styled HTML from markdown content
 * @param markdownContent The markdown content
 * @param images Array of image objects
 * @returns HTML string with styled content
 */
function generateStyledHTMLFromMarkdown(markdownContent: string, images: any[]): string {
  // Configure marked options for better rendering
  marked.use({
    gfm: true,
    breaks: true
  });

  // First, clean the markdown to remove any stray '#' characters at the beginning of lines
  const cleanedMarkdown = markdownContent.replace(/^(#+\s+)(.+)$/gm, '$1$2');

  // Convert markdown to HTML
  const htmlContent = marked.parse(cleanedMarkdown) as string;
  
  // Post-process the HTML to clean up any remaining # characters
  const processedHtml = htmlContent
    // Remove any remaining # in headings
    .replace(/<h([1-6])>\s*#+\s*(.+?)<\/h\1>/g, '<h$1>$2</h$1>')
    // Remove any # at the beginning of paragraphs
    .replace(/<p>\s*#+\s+/g, '<p>');

  // Extract sections by splitting on <h2> tags
  const sections = processedHtml.split(/<h2/i);

  let formattedSections = '';

  // Process the first part (before any h2)
  if (sections.length > 0) {
    const introSection = sections.shift() || '';
    
    // Check if the first section already contains an Introduction heading
    const hasExplicitIntroduction = introSection.toLowerCase().includes('<h2') && 
                                   (introSection.toLowerCase().includes('introduction') || 
                                    introSection.toLowerCase().includes('overview'));

    // Enhance image rendering in the intro section
    const enhancedIntroSection = enhanceImageRendering(introSection);

    if (enhancedIntroSection.trim() && !hasExplicitIntroduction) {
      formattedSections += `
          <div class="mb-12" id="introduction">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center relative pl-4 border-l-4 border-blue-500">
              <span>Introduction</span>
            </h2>
            <div class="text-gray-700 prose prose-lg max-w-none leading-relaxed custom-paragraph-styling">${enhancedIntroSection}</div>
          </div>
        `;
    } else if (enhancedIntroSection.trim()) {
      // Just include the content without adding another Introduction heading
      formattedSections += enhancedIntroSection;
    }

    // Process the remaining sections (each starting with an h2)
    sections.forEach((section, index) => {
      // Extract the heading text and ID using a more robust regex
      const headingMatch = section.match(/id="([^"]*)"[^>]*>([^<]*)<\/h2>/i) ||
                          section.match(/>([^<]*)<\/h2>/i);

      let headingId = '';
      let headingText = '';

      if (headingMatch && headingMatch.length >= 2) {
        // Different pattern matches have the text in different groups
        headingId = headingMatch[1] || `section-${index + 1}`;
        headingText = (headingMatch.length >= 3) ? headingMatch[2].trim() : headingMatch[1].trim();
      } else {
        headingId = `section-${index + 1}`;
        headingText = `Section ${index + 1}`;
      }

      // Ensure heading doesn't contain '#' characters
      headingText = headingText.replace(/^#+\s+|#+$/g, '');

      // Generate a valid ID from the heading text if we don't have one
      if (!headingId || headingId === headingText) {
        headingId = headingText.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
      }

      // Replace the original h2 tag with an empty string to avoid duplication
      let sectionContent = section.replace(/id="([^"]*)"[^>]*>([^<]*)<\/h2>/i, '')
                                 .replace(/>([^<]*)<\/h2>/i, '');

      // Make sure there are no remaining '#' characters at the beginning of paragraphs
      sectionContent = sectionContent.replace(/<p>\s*#+\s+/g, '<p>');

      // Enhance image rendering in this section
      sectionContent = enhanceImageRendering(sectionContent);

      // Improve bullet point rendering by adding proper styling
      sectionContent = sectionContent
        // Style top-level lists
        .replace(/<ul>/g, '<ul class="list-disc ml-6 mb-6 space-y-2">')
        .replace(/<ol>/g, '<ol class="list-decimal ml-6 mb-6 space-y-2">')
        // Style nested lists with different bullets and indentation
        .replace(/<ul>\s*<li>/g, '<ul class="list-disc ml-6 mt-2 space-y-2"><li>')
        .replace(/<ol>\s*<li>/g, '<ol class="list-decimal ml-6 mt-2 space-y-2"><li>')
        // Style nested nested lists
        .replace(/<li>\s*<ul>/g, '<li class="mb-1"><ul class="list-circle ml-6 mt-2 space-y-2">')
        .replace(/<li>\s*<ol>/g, '<li class="mb-1"><ol class="list-roman ml-6 mt-2 space-y-2">')
        // Style list items
        .replace(/<li>/g, '<li class="mb-1">');

      // Add custom styles for list types
      if (sectionContent.includes('list-circle') || sectionContent.includes('list-roman')) {
        sectionContent = `
          <style>
            .list-circle { list-style-type: circle; }
            .list-roman { list-style-type: lower-roman; }
            ul ul ul { list-style-type: square; }
            ol ol ol { list-style-type: lower-alpha; }
          </style>
        ` + sectionContent;
      }

      formattedSections += `
          <div class="mb-12" id="${headingId}">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center relative pl-4 border-l-4 border-blue-500">
              <span>${headingText}</span>
            </h2>
            <div class="text-gray-700 prose prose-lg max-w-none leading-relaxed custom-paragraph-styling">${sectionContent}</div>
          </div>
        `;
    });
  }

  return formattedSections;
}

/**
 * Enhance image HTML with better rendering and captions
 * @param html HTML content containing images
 * @returns Enhanced HTML with better image rendering
 */
function enhanceImageRendering(html: string): string {
  // First pattern: <img src="..." alt="..."> followed by <em>Caption</em>
  const imgWithCaptionPattern = /<p><img src="([^"]+)"[^>]*alt="([^"]*)"[^>]*><\/p>\s*<p><em>([^<]+)<\/em><\/p>/gi;

  // Second pattern: Just an image without explicit caption
  const imgPattern = /<p><img src="([^"]+)"[^>]*alt="([^"]*)"[^>]*><\/p>/gi;

  // First replace images with captions
  let enhanced = html.replace(imgWithCaptionPattern, (match, src, alt, caption) => {
    return renderImageWithCaption(src, alt, caption);
  });

  // Then replace standalone images
  enhanced = enhanced.replace(imgPattern, (match, src, alt) => {
    return renderImageWithCaption(src, alt, alt || 'Figure');
  });

  return enhanced;
}

/**
 * Render a properly formatted image with caption
 * @param src Image source URL
 * @param alt Image alt text
 * @param caption Image caption
 * @returns HTML string for the image
 */
function renderImageWithCaption(src: string, alt: string, caption: string): string {
  // Ensure we have a valid image URL, preferring src or placeholder
  const fallbackUrl = `/api/placeholder/800/400?text=${encodeURIComponent(caption || 'Image')}`;
  const imageUrl = getProxiedImageUrl(src || fallbackUrl);
  const altText = alt || caption || 'Image';
  const captionText = caption || alt || 'Figure';

  return `
      <figure class="my-8">
        <div class="rounded-lg overflow-hidden shadow-md bg-white">
          <img 
            src="${imageUrl}" 
            alt="${altText}" 
            class="w-full h-auto object-cover max-h-[500px]"
            onerror="console.error('Content image failed to load:', this.src); this.src='/api/placeholder/800/400?text=${encodeURIComponent(captionText)}'; this.onerror=null;"
          />
          <figcaption class="px-4 py-3 text-sm text-gray-600 italic text-center border-t border-gray-100">
            ${captionText}
          </figcaption>
        </div>
      </figure>
    `;
}

/**
 * Generate an image gallery for any images that weren't placed in the main content
 * @param images Array of image objects
 * @returns HTML string with image gallery
 */
function generateImageGallery(images: any[]): string {
  // Skip the first image (hero) and only show if we have more than 1 content image
  if (!images || images.length <= 2) {
    return '';
  }

  // Skip the first image (used as hero) and take up to 6 images for the gallery
  const galleryImages = images.slice(1, 7);

  return `    <div class="my-16">
      <h3 class="text-xl font-bold text-gray-900 mb-6 relative pl-4 border-l-4 border-blue-500">
        Image Gallery
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${galleryImages.map((img, index) => `
          <figure class="group">
            <div class="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition duration-300">
              <img 
                src="${getProxiedImageUrl(img.placeholder || img.src || `/api/placeholder/800/400?text=Image%20${index + 1}`)}" 
                alt="${img.caption || `Image ${index + 1}`}" 
                class="w-full h-48 object-cover"
                onerror="console.error('Gallery image failed to load:', this.src); this.src='/api/placeholder/800/400?text=Image%20${index + 1}'; this.onerror=null;"
              />
              <figcaption class="px-3 py-2 text-sm text-gray-600 italic text-center">
                ${img.caption || `Image ${index + 1}`}
              </figcaption>
            </div>
          </figure>
        `).join('')}
      </div>
      </div>
    `;
}

/**
 * Extract headings from markdown content to create a table of contents
 * @param markdown The markdown content
 * @returns Array of heading objects with id and text
 */
function extractHeadings(markdown: string): Array<{ id: string, text: string }> {
  const headings = [];
  
  // Enhanced regex to match both standard markdown headings and HTML headings
  // Match patterns like:
  // 1. ## Heading text
  // 2. <h2>Heading text</h2>
  // 3. <h2 id="custom-id">Heading text</h2>
  const headingRegex = /(?:^|\n)(#{2,3})\s+(.+?)(?:\n|$)|<h([2-3])(?:\s+id="([^"]+)")?\s*>(.+?)<\/h\3>/gm;
  
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    // Group indexes depend on which pattern matched
    const headingLevel = match[1] ? match[1].length : parseInt(match[3]);
    
    // The heading text comes from either markdown format or HTML format
    const rawText = match[1] ? match[2] : match[5];
    
    // The ID might be explicitly specified in HTML format
    const explicitId = match[4] || '';
    
    if (!rawText) continue; // Skip if somehow no text was captured
    
    // Clean the heading text by removing any markdown formatting
    const cleanText = rawText.trim()
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic
      .replace(/`(.*?)`/g, '$1')       // Remove code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')  // Remove links, keep text
      .replace(/^#+\s+/g, '');           // Remove any remaining '#' symbols
    
    // Use explicit ID if available, otherwise generate one from the text
    const id = explicitId || cleanText.toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove special chars
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/^-+|-+$/g, '');  // Trim leading/trailing hyphens
    
    headings.push({ id, text: cleanText });
  }

  return headings;
}

/**
 * Generate a fully formatted blog post from extracted document content
 * 
 * @param content The raw text content extracted from the document
 * @param title The blog post title
 * @param author The author name
 * @param category The blog category
 * @param excerpt A short excerpt from the content
 * @param images Array of image objects extracted from the document
 * @param authorBio Optional bio text for the author
 * @returns HTML string of the formatted blog post
 */
export function generateBlogTemplate(
  content: string,
  title: string,
  author: string,
  category: string,
  excerpt: string,
  images: any[],
  authorBio?: string
): string {
  // Ensure we have at least one image for the hero section
  const heroImage = images && images.length > 0
    ? images[0]
    : {
      placeholder: `/api/placeholder/1200/800?text=${encodeURIComponent(title)}`,
      alt: title
    };

  console.log("Hero image:", heroImage);
  console.log("All images received:", images);

  // Additional check for Supabase URLs
  if (heroImage && heroImage.placeholder && heroImage.placeholder.includes('supabase')) {
    console.log("Using Supabase image URL:", heroImage.placeholder);
  }

  // Check all image URLs and log the format
  images.forEach((img, index) => {
    const url = img.placeholder || img.src;
    console.log(`Image ${index} URL:`, url);

    // Make sure URLs are using public access, not sign
    if (url && url.includes('storage/v1/object/sign')) {
      console.log(`Image ${index} has a signed URL which requires auth, correcting to public URL`);
      img.placeholder = url.replace('/storage/v1/object/sign/', '/storage/v1/object/public/');
      img.src = img.placeholder;
      console.log(`Image ${index} corrected URL:`, img.placeholder);
    }
  });

  // Convert content to markdown first for better formatting
  const markdown = convertToMarkdown(content, images);

  // Format the current date
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const publishDate = currentDate.toLocaleDateString('en-US', options);

  // Calculate read time (average 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

  // Generate styled HTML from markdown
  const styledContent = generateStyledHTMLFromMarkdown(markdown, images);

  // Use provided authorBio or default text if not provided
  const bioText = authorBio || `${author} is an expert in ${category} with extensive experience in the field. Their insights and knowledge have been valuable contributions to the industry.`;

  // Generate a blog post using the modern template 
  return `
      <div class="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
        <!-- Hero Section with Featured Image -->
        <div class="relative h-80 overflow-hidden bg-gray-50">
          <div class="absolute inset-0 z-0">
            <img
              src="${getProxiedImageUrl(heroImage.placeholder || heroImage.src || `/api/placeholder/1200/800?text=${encodeURIComponent(title)}`)}"
              alt="${title}"
              class="w-full h-full object-cover object-center"
              onerror="console.error('Hero image failed to load:', this.src); this.src='/api/placeholder/1200/800?text=Featured%20Image'; this.onerror=null;"
            />
            </div>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-90"></div>
          
          
        </div>
  
        <!-- Global styles for bullet points and nested lists -->
        <style>
          /* Base list styling */
          .prose ul, .prose ol {
            padding-left: 1.5rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
          }
          
          /* Bullet styling by level */
          .prose ul { list-style-type: disc; }
          .prose ul ul { list-style-type: circle; }
          .prose ul ul ul { list-style-type: square; }
          
          /* Numbered list styling by level */
          .prose ol { list-style-type: decimal; }
          .prose ol ol { list-style-type: lower-roman; }
          .prose ol ol ol { list-style-type: lower-alpha; }
          
          /* List item spacing */
          .prose li {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          
          /* Nested list additional indent and formatting */
          .prose li > ul, .prose li > ol {
            margin-top: 0.5rem;
            margin-bottom: 0.75rem;
            padding-left: 1.5rem;
          }
        </style>
  
        <!-- Main Content -->
        <div class="container mx-auto px-4 py-12">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Article Content -->
            <div class="lg:w-3/4">
              <div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <!-- Breadcrumb -->
                <div class="flex items-center text-sm text-gray-500 mb-8">
                  <a href="/" class="hover:text-blue-600 transition">
                    Home
                  </a>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 mx-2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  <a href="/Resources/blogs2" class="hover:text-blue-600 transition">
                    Blog
                  </a>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 mx-2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  <span class="text-gray-700 truncate max-w-xs font-medium">
                    ${title}
                  </span>
                </div>
  
                <!-- Blog introduction -->
                <div class="mb-8">
                  <p class="text-lg text-gray-700 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
                    ${excerpt}
                  </p>
                </div>
  
                <!-- Quick Navigation -->
                <div class="mb-10 p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <h3 class="font-bold text-gray-900 mb-3">
                    Quick Navigation
                  </h3>
                  <ul class="space-y-2">
                    ${!markdown.toLowerCase().includes('## introduction') && !markdown.toLowerCase().includes('## overview') ? `
                    <li>
                      <a href="#introduction" class="text-blue-600 hover:text-blue-800 transition">
                        Introduction
                      </a>
                    </li>
                    ` : ''}
                    ${extractHeadings(markdown).map((heading) => `
                      <li>
                        <a href="#${heading.id}" class="text-blue-600 hover:text-blue-800 transition">
                          ${heading.text}
                        </a>
                      </li>
        `).join('')}
                  </ul>
                </div>

                <!-- Blog content sections -->
                ${styledContent}
                
                <!-- Image Gallery (if there are images that weren't placed in content) -->
                ${generateImageGallery(images)}
  
                <!-- Social sharing -->
                <div class="border-t border-gray-100 pt-8 mt-16">
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-500 font-medium">
                      Share this article
                    </div>
                    <div class="flex gap-2">
                      <button class="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      </button>
                      <button class="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                      </button>
                      <button class="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                      </button>
                      <button class="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      </button>
                    </div>
                  </div>
                </div>
  
                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mt-8">
                  <span class="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    #${category}
                  </span>
                  <span class="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    #Blog
                  </span>
                  <span class="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    #Indrasol
                  </span>
                </div>
  
                <!-- Author bio -->
                <div class="mt-16 p-8 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 class="text-xl font-bold text-gray-900 mb-4">
                    About the Author
                  </h3>
                  <div class="flex items-start gap-6">
                    <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                      ${author.charAt(0)}
                    </div>
                    <div>
                      <h4 class="font-bold text-gray-900 text-lg">${author}</h4>
                      <p class="text-gray-600 mt-3">
                        ${bioText}
                      </p>
                      <a
                        href="#"
                        class="text-blue-600 hover:text-blue-800 font-medium flex items-center mt-4 transition"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="${author}'s profile"
                      >
                        <span>Connect with ${author}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 ml-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Sidebar -->
            <div class="lg:w-1/4 mt-16 lg:mt-0">
              <div class="sticky top-24 space-y-8">
                <!-- Related Articles -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 class="text-lg font-bold text-gray-900 mb-6 relative pl-4 border-l-4 border-blue-500">
                    Related Articles
                  </h3>
                  <div class="space-y-6">
                    <a href="#" class="block group">
                      <div class="flex gap-4">
                        <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100"></div>
                        <div>
                          <h4 class="font-medium text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                            Understanding Modern Technology Trends
                          </h4>
                          <div class="flex items-center mt-2 text-xs text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            5 min read
                          </div>
                        </div>
                      </div>
                    </a>
                    <a href="#" class="block group">
                      <div class="flex gap-4">
                        <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100"></div>
                        <div>
                          <h4 class="font-medium text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                            The Future of Business Automation
                          </h4>
                          <div class="flex items-center mt-2 text-xs text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            4 min read
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
  
                <!-- Categories -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 class="text-lg font-bold text-gray-900 mb-6 relative pl-4 border-l-4 border-blue-500">
                    Categories
                  </h3>
                  <div class="space-y-2">
                    <a
                      href="#"
                      class="block py-2 px-3 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      ${category}
                    </a>
                    <a
                      href="#"
                      class="block py-2 px-3 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Technology
                    </a>
                    <a
                      href="#"
                      class="block py-2 px-3 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Business
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Back to blog button -->
        <div class="bg-gray-50 py-16">
          <div class="container mx-auto px-4 text-center">
            <a
              href="/Resources/blogs2"
              class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back to Blog
            </a>
          </div>
      </div>
    </div>
  `;
}






