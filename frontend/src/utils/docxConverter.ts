// utils/docxConverter.ts
import mammoth from 'mammoth';
import TurndownService from 'turndown';
import { supabase } from '@/supabase';

export async function convertDocxToMarkdown(
  file: File, 
  slug: string, 
  bucketType: 'blogs' | 'whitepapers'
): Promise<string> {
  // Mammoth: DOCX → HTML (keeps style-semantic structure)
  const { value: html } = await mammoth.convertToHtml(
    { arrayBuffer: await file.arrayBuffer() },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        try {
          // Read the image data
          const imageBuffer = await image.read();
          
          // Generate filename based on content type
          const extension = image.contentType?.split('/')[1] || 'png';
          const filename = `${slug}/images/img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${extension}`;
          
          // Upload to the appropriate bucket's images folder
          const { error } = await supabase.storage
            .from(bucketType)
            .upload(filename, imageBuffer, { 
              contentType: image.contentType || 'image/png'
            });
          
          if (error) {
            console.error('Error uploading image:', error);
            return { src: '#' }; // Fallback
          }
          
          // Get the public URL
          const { data } = supabase.storage
            .from(bucketType)
            .getPublicUrl(filename);
          
          return { 
            src: data.publicUrl,
            alt: 'Document image'
          };
        } catch (err) {
          console.error('Image processing error:', err);
          return { src: '#' };
        }
      })
    }
  );

  // Turndown: HTML → Markdown
  const turndown = new TurndownService({ 
    headingStyle: 'atx',
    bulletListMarker: '*',
    codeBlockStyle: 'fenced'
  });
  
  // Add custom rules for better conversion
  turndown.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    replacement: (content) => `~~${content}~~`
  });
  
  turndown.addRule('preserveTables', {
    filter: 'table',
    replacement: function(content, node) {
      // Simple table preservation
      return '\n\n' + node.outerHTML + '\n\n';
    }
  });
  
  return turndown.turndown(html);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}