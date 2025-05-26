// markdown-enhancer.ts
// Utility for enhancing and analyzing markdown content

export interface DocumentSection {
    id: string;
    title: string;
    level: number;
    content: string;
    startIndex: number;
    endIndex: number;
    wordCount: number;
  }
  
  export interface DocumentHeading {
    level: number;
    text: string;
    id: string;
  }
  
  export interface TableOfContentsItem {
    id: string;
    text: string;
    level: number;
  }
  
  export interface DocumentStructure {
    sections: DocumentSection[];
    headings: DocumentHeading[];
    tableOfContents: TableOfContentsItem[];
    totalWordCount: number;
    estimatedReadTime: string;
    hasImages: boolean;
    hasTables: boolean;
    hasCode: boolean;
  }
  
  export interface DocumentStats {
    codeBlocks: number;
    images: number;
    links: number;
    tables: number;
  }
  
  export interface EnhancedMetadata {
    title: string;
    author: string;
    category: string;
    excerpt: string;
    stats: DocumentStats;
    [key: string]: any; // Allow additional metadata fields
  }
  
  export const MarkdownEnhancer = {
    /**
     * Enhance markdown formatting and clean up common issues
     */
    enhanceMarkdown(markdown: string): string {
      let processed = markdown
        // Fix multiple blank lines
        .replace(/\n{3,}/g, '\n\n')
        // Fix list formatting
        .replace(/^(\s*[\*\-\+])\s+/gm, '$1 ')
        .replace(/^(\s*\d+\.)\s+/gm, '$1 ')
        // Ensure headings have proper spacing
        .replace(/^(#{1,6})\s*(.+)$/gm, '\n$1 $2\n')
        // Clean up code blocks
        .replace(/```\s*\n/g, '```\n')
        .replace(/\n\s*```/g, '\n```')
        // Fix table formatting
        .replace(/\|\s+/g, '| ')
        .replace(/\s+\|/g, ' |')
        // Remove leading/trailing whitespace
        .trim();
      
      // Ensure document starts with a heading or content, not blank lines
      processed = processed.replace(/^\n+/, '');
      
      return processed;
    },
  
    /**
     * Analyze document structure and extract key information
     */
    analyzeDocumentStructure(markdown: string): DocumentStructure {
      const lines = markdown.split('\n');
      const sections: DocumentSection[] = [];
      const headings: DocumentHeading[] = [];
      const tableOfContents: TableOfContentsItem[] = [];
      let currentSection: DocumentSection | null = null;
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
        
        // Process headings
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const text = headingMatch[2].trim();
          const id = this.generateHeadingId(text);
          
          headings.push({ level, text, id });
          
          // Add to TOC if level <= 3
          if (level <= 3) {
            tableOfContents.push({ id, text, level });
          }
          
          // Create new section for level 2 headings
          if (level === 2) {
            if (currentSection) {
              sections.push(currentSection);
            }
            currentSection = {
              id,
              title: text,
              level,
              content: '',
              startIndex: index,
              endIndex: index,
              wordCount: 0
            };
          }
        } else if (currentSection) {
          currentSection.content += line + '\n';
          currentSection.endIndex = index;
          currentSection.wordCount += words.length;
        }
      });
      
      // Add the last section
      if (currentSection) {
        sections.push(currentSection);
      }
      
      // Calculate estimated read time (200 words per minute)
      const readTimeMinutes = Math.max(1, Math.ceil(totalWordCount / 200));
      const estimatedReadTime = `${readTimeMinutes} min read`;
      
      return {
        sections,
        headings,
        tableOfContents,
        totalWordCount,
        estimatedReadTime,
        hasImages,
        hasTables,
        hasCode
      };
    },
  
    /**
     * Generate a URL-friendly ID from heading text
     */
    generateHeadingId(text: string): string {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50); // Limit length
    },
  
    /**
     * Extract metadata from markdown content
     */
    extractMetadata(markdown: string, providedMetadata: Partial<EnhancedMetadata>): EnhancedMetadata {
      // Extract title from markdown if not provided
      const titleMatch = markdown.match(/^#\s+(.+)$/m);
      const extractedTitle = titleMatch ? titleMatch[1].trim() : providedMetadata.title || 'Untitled';
      
      // Generate excerpt if not provided
      let excerpt = providedMetadata.excerpt || '';
      if (!excerpt) {
        // Get first paragraph after removing headings
        const paragraphs = markdown
          .split('\n\n')
          .filter(p => !p.startsWith('#') && p.trim().length > 0);
        
        if (paragraphs.length > 0) {
          excerpt = paragraphs[0]
            .replace(/[*_`~]/g, '') // Remove markdown formatting
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
            .trim()
            .substring(0, 200);
          
          if (excerpt.length === 200) {
            excerpt += '...';
          }
        }
      }
      
      // Count various elements
      const codeBlockCount = (markdown.match(/```/g) || []).length / 2;
      const imageCount = (markdown.match(/!\[/g) || []).length;
      const linkCount = (markdown.match(/\[([^\]]+)\]\([^)]+\)/g) || []).length;
      
      // Count tables (basic detection)
      const tableLines = markdown.split('\n').filter(line => 
        line.includes('|') && line.match(/\|.*\|/)
      );
      const tableCount = tableLines.length > 0 ? Math.floor(tableLines.length / 3) : 0; // Rough estimate
      
      return {
        title: extractedTitle,
        author: providedMetadata.author || 'Unknown',
        category: providedMetadata.category || 'General',
        excerpt,
        stats: {
          codeBlocks: Math.floor(codeBlockCount),
          images: imageCount,
          links: linkCount,
          tables: tableCount
        },
        ...providedMetadata // Include any additional provided metadata
      };
    },
  
    /**
     * Convert image paths to public URLs
     */
    updateImageUrls(markdown: string, imageMap: Array<{ storagePath: string; publicUrl: string }>): string {
      let updatedMarkdown = markdown;
      
      for (const img of imageMap) {
        // Escape special regex characters in the storage path
        const escapedPath = img.storagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        updatedMarkdown = updatedMarkdown.replace(
          new RegExp(escapedPath, 'g'),
          img.publicUrl
        );
      }
      
      return updatedMarkdown;
    },
  
    /**
     * Add anchor links to headings for better navigation
     */
    addHeadingAnchors(markdown: string): string {
      return markdown.replace(
        /^(#{1,6})\s+(.+)$/gm,
        (match, hashes, title) => {
          const id = this.generateHeadingId(title);
          return `${hashes} ${title} {#${id}}`;
        }
      );
    },
  
    /**
     * Generate a table of contents markdown section
     */
    generateTableOfContents(structure: DocumentStructure): string {
      if (structure.tableOfContents.length === 0) {
        return '';
      }
  
      let toc = '## Table of Contents\n\n';
      
      structure.tableOfContents.forEach(item => {
        const indent = '  '.repeat(item.level - 1);
        toc += `${indent}- [${item.text}](#${item.id})\n`;
      });
      
      return toc + '\n';
    },
  
    /**
     * Validate markdown content
     */
    validateMarkdown(markdown: string): { isValid: boolean; errors: string[] } {
      const errors: string[] = [];
      
      // Check for empty content
      if (!markdown || markdown.trim().length === 0) {
        errors.push('Markdown content is empty');
      }
      
      // Check for title
      if (!markdown.match(/^#\s+.+$/m)) {
        errors.push('Document should have a main title (# Title)');
      }
      
      // Check for unclosed code blocks
      const codeBlockCount = (markdown.match(/```/g) || []).length;
      if (codeBlockCount % 2 !== 0) {
        errors.push('Unclosed code block detected');
      }
      
      // Check for broken images
      const imageMatches = markdown.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || [];
      imageMatches.forEach(img => {
        const srcMatch = img.match(/\(([^)]+)\)/);
        if (srcMatch && srcMatch[1] === '#') {
          errors.push('Broken image link detected');
        }
      });
      
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  };