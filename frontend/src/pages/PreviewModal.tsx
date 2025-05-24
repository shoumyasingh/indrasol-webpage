import React, { useState, useEffect } from 'react';
import { 
  Eye,
  Save,
  X,
  FileText,
  Calendar,
  Clock,
  User,
  Tag,
  BookOpen,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Code,
  Monitor
} from 'lucide-react';
import { supabase } from '@/supabase';
import { useToast } from '@/components/ui/use-toast';
import { EnhancedMarkdownRenderer } from '@/components/EnhancedMarkdownRenderer';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  document: any;
  type: 'blog' | 'whitepaper';
  onPublish?: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ 
  open, 
  onClose, 
  document, 
  type,
  onPublish 
}) => {
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');
  const [showMetadata, setShowMetadata] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (document && open) {
      fetchContent();
    }
  }, [document, open]);

  const fetchContent = async () => {
    if (!document) return;
    
    setLoadingContent(true);
    try {
      if (document.markdown_content) {
        setMarkdownContent(document.markdown_content);
      } else if (document.markdown_url) {
        const response = await fetch(document.markdown_url);
        const content = await response.text();
        setMarkdownContent(content);
      } else {
        setMarkdownContent(document.content || '');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setMarkdownContent(document.content || '');
    } finally {
      setLoadingContent(false);
    }
  };

  const handlePublish = async () => {
    if (!document?.id) {
      toast({
        title: "Error",
        description: "Cannot publish: Document ID is missing",
        variant: "destructive",
      });
      return;
    }
    
    setIsPublishing(true);
    try {
      const { error } = await supabase
        .from(type === 'blog' ? 'blogs' : 'whitepapers')
        .update({ 
          published: true,
          published_at: new Date().toISOString()
        })
        .eq('id', document.id);

      if (error) throw error;
      
      toast({
        title: "Success!",
        description: `${type === 'blog' ? 'Blog post' : 'Whitepaper'} published successfully.`,
        variant: "default",
      });
      
      if (onPublish) onPublish();
      onClose();
    } catch (error) {
      console.error('Error publishing:', error);
      toast({
        title: "Error",
        description: "Failed to publish. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return 'Unknown date';
    }
  };

  const documentStructure = document?.document_structure ? 
    (typeof document.document_structure === 'string' ? 
      JSON.parse(document.document_structure) : 
      document.document_structure) : null;

  if (!open || !document) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[95vw] h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              Preview {type === 'blog' ? 'Blog Post' : 'Whitepaper'}
            </h2>
            <span className={`px-2 py-1 text-xs rounded-full ${
              document?.published 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {document?.published ? "Published" : "Draft"}
            </span>
            {document?.processing_status && (
              <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                document.processing_status === 'completed'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {document.processing_status === 'completed' ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                {document.processing_status}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 flex items-center gap-2"
            >
              <Code className="h-4 w-4" />
              {showMetadata ? 'Hide' : 'Show'} Metadata
            </button>
            
            <div className="flex border rounded overflow-hidden">
              <button
                onClick={() => setActiveView('desktop')}
                className={`px-3 py-1.5 text-sm flex items-center gap-2 ${
                  activeView === 'desktop' 
                    ? 'bg-indrasol-blue text-white' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <Monitor className="h-4 w-4" />
                Desktop
              </button>
              <button
                onClick={() => setActiveView('mobile')}
                className={`px-3 py-1.5 text-sm flex items-center gap-2 ${
                  activeView === 'mobile' 
                    ? 'bg-indrasol-blue text-white' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <FileText className="h-4 w-4" />
                Mobile
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Main Preview */}
          <div className="flex-1 overflow-auto bg-gray-50 p-4">
            <div className={`mx-auto bg-white min-h-full shadow-sm rounded-lg ${
              activeView === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
            }`}>
              {loadingContent ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <article className="p-6 md:p-8">
                  {/* Header */}
                  <header className="mb-8">
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="px-3 py-1 bg-indrasol-blue/10 text-indrasol-blue text-xs rounded-full flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {document?.category || 'Uncategorized'}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(document?.created_at || new Date().toISOString())}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {document?.readTime || document?.read_time || '5 min read'}
                      </span>
                      {document?.word_count && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {document.word_count.toLocaleString()} words
                        </span>
                      )}
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {document?.title || 'Untitled'}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {document?.author || 'Unknown Author'}
                      </div>
                    </div>
                    
                    {document?.excerpt && (
                      <div className="mt-6 text-lg text-gray-700 border-l-4 border-indrasol-blue pl-4 italic">
                        {document.excerpt}
                      </div>
                    )}
                  </header>

                  {/* Table of Contents */}
                  {documentStructure?.tableOfContents?.length > 0 && (
                    <nav className="mb-8 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-3">Table of Contents</h3>
                      <ul className="space-y-2">
                        {documentStructure.tableOfContents.map((item: any) => (
                          <li key={item.id} className="ml-4">
                            <a 
                              href={`#${item.id}`}
                              className="text-indrasol-blue hover:underline text-sm"
                            >
                              {item.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}

                  {/* Main Content */}
                  <div className="prose prose-lg max-w-none">
                    <EnhancedMarkdownRenderer content={markdownContent} />
                  </div>

                  {/* Document Stats */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="font-semibold mb-4">Document Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-gray-500">Status</div>
                        <div className="font-medium">
                          {document?.published ? 'Published' : 'Draft'}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-gray-500">Images</div>
                        <div className="font-medium">
                          {document?.image_count || 0}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-gray-500">Tables</div>
                        <div className="font-medium">
                          {document?.table_count || 0}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-gray-500">Code Blocks</div>
                        <div className="font-medium">
                          {document?.code_block_count || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )}
            </div>
          </div>

          {/* Metadata Sidebar */}
          {showMetadata && (
            <div className="w-80 border-l bg-white p-4 overflow-auto">
              <h3 className="font-semibold mb-4">Document Metadata</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider">ID</label>
                  <div className="font-mono text-xs bg-gray-50 p-2 rounded mt-1 break-all">
                    {document?.id || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider">Slug</label>
                  <div className="font-mono bg-gray-50 p-2 rounded mt-1">
                    {document?.slug || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider">Processing Status</label>
                  <div className="mt-1">
                    {document?.processing_status || 'Unknown'}
                  </div>
                </div>
                
                {document?.markdown_url && (
                  <div>
                    <label className="text-gray-500 text-xs uppercase tracking-wider">Markdown URL</label>
                    <a 
                      href={document.markdown_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indrasol-blue hover:underline flex items-center mt-1"
                    >
                      View Markdown <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
                
                {document?.docx_url && (
                  <div>
                    <label className="text-gray-500 text-xs uppercase tracking-wider">Source Document</label>
                    <a 
                      href={document.docx_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indrasol-blue hover:underline flex items-center mt-1"
                    >
                      Download DOCX <Download className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
                
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider">Created</label>
                  <div className="mt-1">
                    {formatDate(document?.created_at || new Date().toISOString())}
                  </div>
                </div>
                
                {document?.updated_at && (
                  <div>
                    <label className="text-gray-500 text-xs uppercase tracking-wider">Last Updated</label>
                    <div className="mt-1">
                      {formatDate(document.updated_at)}
                    </div>
                  </div>
                )}
                
                {documentStructure && (
                  <div>
                    <label className="text-gray-500 text-xs uppercase tracking-wider">Document Structure</label>
                    <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-64">
                      {JSON.stringify(documentStructure, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href={`/${type === 'blog' ? 'Resources/blog' : 'components/whitepaper'}/${document?.slug || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indrasol-blue hover:underline flex items-center"
            >
              View Live Page <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            
            {!document?.published && (
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-4 py-2 bg-indrasol-blue text-white rounded-md hover:bg-indrasol-blue/90 disabled:opacity-50 flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Publish {type === 'blog' ? 'Blog' : 'Whitepaper'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};