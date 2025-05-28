// components/EnhancedMarkdownRenderer.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';
// Import these at the top of EnhancedMarkdownRenderer.tsx
import { Link, Hash } from 'lucide-react';

interface EnhancedMarkdownProps {
  content: string;
  className?: string;
}

export const EnhancedMarkdownRenderer: React.FC<EnhancedMarkdownProps> = ({
  content,
  className = ""
}) => {
  // Helper function to generate heading IDs consistently
  const generateHeadingId = (text: string): string => {
    if (typeof text !== 'string') {
      // Handle React elements by extracting text content
      const textContent = React.Children.toArray(text).join('');
      return textContent
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);
    }
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  };

  const components: Components = {
    h1: ({ children, id, ...props }) => {
      const textContent = React.Children.toArray(children).join('');
      const headingId = id || generateHeadingId(textContent);
      console.log('Rendering H1:', { children: textContent, id, generatedId: headingId });
      return (
        <h1 
          id={headingId}
          className="text-2xl md:text-3xl font-light text-gray-900 mt-16 mb-8 tracking-tight scroll-mt-24" 
          {...props}
        >
          <div className="flex items-center gap-4">
            <div className="w-1 h-6 bg-indrasol-blue rounded mr-2"></div>
            {children}
          </div>
        </h1>
      );
    },
    h2: ({ children, id, ...props }) => {
      const textContent = React.Children.toArray(children).join('');
      const headingId = id || generateHeadingId(textContent);
      console.log('Rendering H2:', { children: textContent, id, generatedId: headingId });
      return (
        <h2 
          id={headingId}
          className="text-2xl font-bold text-gray-900 mb-4 flex items-center scroll-mt-24" 
          {...props}
        >
          <div className="w-1 h-6 bg-indrasol-blue rounded mr-2"></div>
          {children}
        </h2>
      );
    },
    h3: ({ children, id, ...props }) => {
      const textContent = React.Children.toArray(children).join('');
      const headingId = id || generateHeadingId(textContent);
      console.log('Rendering H3:', { children: textContent, id, generatedId: headingId });
      return (
        <h3 
          id={headingId}
          className="text-xl md:text-2xl font-medium text-gray-700 mt-8 mb-4 flex items-center gap-3 scroll-mt-24" 
          {...props}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-indrasol-blue">
            <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.6" />
            <circle cx="10" cy="10" r="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          </svg>
          {children}
        </h3>
      );
    },
    h4: ({ children, id, ...props }) => {
      const headingId = id || generateHeadingId(children as string);
      return (
        <h4 
          id={headingId}
          className="text-lg font-medium text-gray-700 mt-6 mb-3 scroll-mt-24" 
          {...props}
        >
          {children}
        </h4>
      );
    },
    h5: ({ children, id, ...props }) => {
      const headingId = id || generateHeadingId(children as string);
      return (
        <h5 
          id={headingId}
          className="text-base font-medium text-gray-700 mt-4 mb-2 scroll-mt-24" 
          {...props}
        >
          {children}
        </h5>
      );
    },
    h6: ({ children, id, ...props }) => {
      const headingId = id || generateHeadingId(children as string);
      return (
        <h6 
          id={headingId}
          className="text-sm font-medium text-gray-700 mt-4 mb-2 scroll-mt-24" 
          {...props}
        >
          {children}
        </h6>
      );
    },
    img: ({ src, alt, ...props }) => (
      <figure className="my-8">
        <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-50">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full h-auto object-contain max-h-[600px]"
            onError={(e) => {
              e.currentTarget.src = `/api/placeholder/800/400?text=${encodeURIComponent(alt || 'Image')}`;
            }}
            {...props}
          />
        </div>
        {/* Figcaption hidden as requested */}
        {/* {alt && (
          <figcaption className="mt-3 text-center text-sm text-gray-600 italic">
            {alt}
          </figcaption>
        )} */}
      </figure>
    ),
    code: ({ node, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const inline = !match;

      return inline ? (
        <code className="bg-gray-100 text-indrasol-blue px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      ) : (
        <SyntaxHighlighter
          language={match[1]}
          style={tomorrow}
          PreTag="div"
          className="rounded-lg shadow-md my-6 text-sm"
          showLineNumbers={true}
          wrapLines={true}
          customStyle={{
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
          }}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    },
    table: ({ children }) => (
      <div className="overflow-x-auto my-8">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200 last:border-r-0">
        {children}
      </td>
    ),
    blockquote: ({ children }) => (
      <blockquote className="bg-gray-50 border-l-4 border-indrasol-blue pl-6 pr-4 py-4 my-6 italic text-gray-700 rounded-r-lg">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-outside ml-6 my-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 my-4 space-y-2">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-gray-700 leading-relaxed">{children}</li>
    ),
    a: ({ href, children, ...props }) => (
      <a
        className="text-indrasol-blue hover:text-indrasol-blue/80 underline transition-colors font-medium"
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),
    hr: () => (
      <hr className="my-8 border-t-2 border-gray-200" />
    ),
    p: ({ children }) => (
      <p className="text-gray-700 leading-relaxed my-4">
        {children}
      </p>
    ),
  };

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkMath,
        ]}
        rehypePlugins={[
          rehypeKatex,
          rehypeHighlight,
          // Remove rehypeSlug and rehypeAutolinkHeadings to avoid conflicts
          // rehypeSlug,
          // [rehypeAutolinkHeadings, { behavior: 'wrap' }]
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};