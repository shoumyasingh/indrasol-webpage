// BlogTemplateGenerator.ts
// This utility handles the conversion of raw document content into formatted blog HTML

/**
 * Generate a fully formatted blog post from extracted document content
 * 
 * @param content The raw text content extracted from the document
 * @param title The blog post title
 * @param author The author name
 * @param category The blog category
 * @param excerpt A short excerpt from the content
 * @param images Array of image objects extracted from the document
 * @returns HTML string of the formatted blog post
 */
export function generateBlogTemplate(
    content: string,
    title: string,
    author: string,
    category: string,
    excerpt: string,
    images: any[]
  ): string {
    // Split content into paragraphs
    const paragraphs = content.split(/\n\n|\r\n\r\n/).filter(p => p.trim().length > 0);
    
    // Create sections based on content analysis
    const sections = createSectionsFromParagraphs(paragraphs, images);
    
    // Calculate read time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";
    
    // Format the current date
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const publishDate = currentDate.toLocaleDateString('en-US', options);
    
    // Generate a blog post using the template 
    return `
      <div class="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
        <!-- Hero Section with Featured Image -->
        <div class="relative h-80 overflow-hidden bg-gray-900">
          <div class="absolute inset-0 z-0 opacity-30">
            <img
              src="${images.length > 0 ? images[0].placeholder : '/api/placeholder/800/400'}"
              alt="${title}"
              class="w-full h-full object-cover object-center"
            />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div class="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
            <div class="max-w-4xl">
              <div class="flex items-center gap-4 mb-4">
                <div class="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  ${category}
                </div>
                <div class="flex items-center text-gray-300 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  ${publishDate}
                </div>
                <div class="flex items-center text-gray-300 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  ${readTime}
                </div>
              </div>
              <h1 class="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                ${title}
              </h1>
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold">
                    ${author.charAt(0)}
                  </div>
                  <div>
                    <div class="font-medium text-white">${author}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Main Content -->
        <div class="container mx-auto px-4 py-12">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Article Content -->
            <div class="lg:w-3/4">
              <div class="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <!-- Breadcrumb -->
                <div class="flex items-center text-sm text-gray-500 mb-8">
                  <a href="/" class="hover:text-blue-600">
                    Home
                  </a>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mx-2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  <a href="/Resources/blogs2" class="hover:text-blue-600">
                    Blog
                  </a>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mx-2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  <span class="text-gray-700 truncate max-w-xs">
                    ${title}
                  </span>
                </div>
  
                <!-- Blog introduction -->
                <div class="mb-8">
                  <p class="text-lg text-gray-700 leading-relaxed mb-6">
                    ${excerpt}
                  </p>
                </div>
  
                <!-- Blog content sections -->
                ${sections}
  
                <!-- Social sharing -->
                <div class="border-t border-gray-100 pt-6 mt-10">
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                      Share this article
                    </div>
                    <div class="flex gap-2">
                      <button class="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-700"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                      </button>
                      <button class="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-700"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                      </button>
                      <button class="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-700"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      </button>
                      <button class="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-700"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
  
                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mt-8">
                  <span class="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    #${category}
                  </span>
                  <span class="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    #Blog
                  </span>
                </div>
  
                <!-- Author bio -->
                <div class="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 class="text-xl font-bold text-gray-900 mb-3">
                    About the Author
                  </h3>
                  <div class="flex items-start gap-4">
                    <div class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold text-xl">
                      ${author.charAt(0)}
                    </div>
                    <div>
                      <h4 class="font-bold text-gray-900">${author}</h4>
                      <p class="text-gray-600 text-sm mt-2">
                        ${author} is an expert in ${category} with extensive experience in the field.
                      </p>
                      <a
                        href="#"
                        class="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-1"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="${author}'s profile"
                      >
                        <span>Connect with ${author}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Sidebar -->
            <div class="lg:w-1/4">
              <div class="sticky top-24">
                <!-- Related posts placeholder -->
                <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 class="text-lg font-bold text-gray-900 mb-4">
                    Related Articles
                  </h3>
                  <div class="space-y-4">
                    <a href="#" class="block group">
                      <div class="flex gap-3">
                        <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100"></div>
                        <div>
                          <h4 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                            Related Article 1
                          </h4>
                          <div class="flex items-center mt-1 text-xs text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            5 min read
                          </div>
                        </div>
                      </div>
                    </a>
                    <a href="#" class="block group">
                      <div class="flex gap-3">
                        <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100"></div>
                        <div>
                          <h4 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                            Related Article 2
                          </h4>
                          <div class="flex items-center mt-1 text-xs text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            4 min read
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
  
                <!-- Categories -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                  <h3 class="text-lg font-bold text-gray-900 mb-4">
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
        <div class="text-center py-12">
          <a
            href="/Resources/blogs2"
            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </a>
        </div>
      </div>
    `;
  }
  
  /**
   * Create structured sections from paragraphs
   * @param paragraphs Array of text paragraphs
   * @param images Array of image objects
   * @returns HTML string of formatted sections
   */
  function createSectionsFromParagraphs(paragraphs: string[], images: any[]): string {
    let sections = '';
    let imageIndex = 1; // Start from 1 since we used the first image in the hero section
    
    // Define potential section titles using regex patterns
    const sectionPatterns = [
      { pattern: /introduction|overview|getting started/i, title: 'Introduction' },
      { pattern: /background|context|history/i, title: 'Background' },
      { pattern: /methodology|approach|method/i, title: 'Methodology' },
      { pattern: /results|findings|outcome/i, title: 'Results' },
      { pattern: /discussion|analysis|interpretation/i, title: 'Discussion' },
      { pattern: /conclusion|summary|final thoughts/i, title: 'Conclusion' },
      { pattern: /recommendations|suggestions|next steps/i, title: 'Recommendations' },
      { pattern: /references|sources|bibliography/i, title: 'References' }
    ];
    
    // Group paragraphs into sections
    let currentSection = 'Abstract';
    let currentSectionContent = '';
    
    paragraphs.forEach((paragraph, index) => {
      // Check if this paragraph might be a section title
      let foundSection = false;
      
      // If paragraph is short and followed by longer ones, it might be a heading
      if (paragraph.length < 100 && index < paragraphs.length - 1 && paragraphs[index + 1].length > 100) {
        for (const { pattern, title } of sectionPatterns) {
          if (pattern.test(paragraph)) {
            // If we have content for the previous section, add it
            if (currentSectionContent) {
              sections += createSectionHTML(currentSection, currentSectionContent);
              currentSectionContent = '';
            }
            
            currentSection = paragraph.trim();
            foundSection = true;
            break;
          }
        }
      }
      
      if (!foundSection) {
        // Add paragraph to current section
        currentSectionContent += `<p class="mb-4">${paragraph.trim()}</p>`;
        
        // Add an image after every 3-5 paragraphs if available
        if ((index + 1) % 4 === 0 && imageIndex < images.length) {
          currentSectionContent += `
            <div class="my-6 rounded-xl overflow-hidden shadow-sm">
              <div class="bg-gray-50 p-1">
                <img
                  src="${images[imageIndex].placeholder}"
                  alt="Figure ${imageIndex}"
                  class="w-full h-auto max-h-64 object-contain rounded-lg"
                />
                <p class="text-sm text-gray-500 italic text-center py-2">
                  Figure ${imageIndex}
                </p>
              </div>
            </div>
          `;
          imageIndex++;
        }
      }
    });
    
    // Add the last section
    if (currentSectionContent) {
      sections += createSectionHTML(currentSection, currentSectionContent);
    }
    
    return sections;
  }
  
  /**
   * Create HTML markup for a section
   * @param title Section title
   * @param content Section content HTML
   * @returns HTML string for the section
   */
  function createSectionHTML(title: string, content: string): string {
    const sectionId = title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    
    return `
      <div class="mb-8" id="${sectionId}">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <div class="w-1 h-6 bg-blue-600 rounded mr-2"></div>
          ${title}
        </h2>
        <div class="text-gray-700 leading-relaxed">${content}</div>
      </div>
    `;
  }