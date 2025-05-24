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

interface EnhancedMarkdownProps {
  content: string;
  className?: string;
}

export const EnhancedMarkdownRenderer: React.FC<EnhancedMarkdownProps> = ({ 
  content, 
  className = "" 
}) => {
  const components: Components = {
    h1: ({children, ...props}) => (
      <h1 className="text-4xl font-bold text-gray-900 mt-10 mb-6 pb-4 border-b-2 border-gray-200" {...props}>
        {children}
      </h1>
    ),
    h2: ({children, ...props}) => (
      <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4 flex items-center" {...props}>
        <div className="w-1 h-8 bg-indrasol-blue mr-4"></div>
        {children}
      </h2>
    ),
    h3: ({children, ...props}) => (
      <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-3" {...props}>
        {children}
      </h3>
    ),
    img: ({src, alt, ...props}) => (
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
        {alt && (
          <figcaption className="mt-3 text-center text-sm text-gray-600 italic">
            {alt}
          </figcaption>
        )}
      </figure>
    ),
    code: ({node, className, children, ...props}) => {
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
    table: ({children}) => (
      <div className="overflow-x-auto my-8">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({children}) => (
      <thead className="bg-gray-50">{children}</thead>
    ),
    th: ({children}) => (
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
        {children}
      </th>
    ),
    td: ({children}) => (
      <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200 last:border-r-0">
        {children}
      </td>
    ),
    blockquote: ({children}) => (
      <blockquote className="bg-gray-50 border-l-4 border-indrasol-blue pl-6 pr-4 py-4 my-6 italic text-gray-700 rounded-r-lg">
        {children}
      </blockquote>
    ),
    ul: ({children}) => (
      <ul className="list-disc list-outside ml-6 my-4 space-y-2">{children}</ul>
    ),
    ol: ({children}) => (
      <ol className="list-decimal list-outside ml-6 my-4 space-y-2">{children}</ol>
    ),
    li: ({children}) => (
      <li className="text-gray-700 leading-relaxed">{children}</li>
    ),
    a: ({href, children, ...props}) => (
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
    p: ({children}) => (
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
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }]
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};