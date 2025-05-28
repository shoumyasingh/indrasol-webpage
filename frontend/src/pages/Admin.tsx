import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { slugify } from '../utils/docxConverter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { PreviewModal } from './PreviewModal'; // ADD THIS IMPORT
import { MarkdownEnhancer } from '@/components/MarkdownEnhancer';
import { 
  LogOut, 
  Upload, 
  FileType, 
  Database, 
  User, 
  Tag, 
  FileText, 
  Eye, 
  Save, 
  FileCheck, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Pencil,
  Trash2,
  Search,
  Calendar,
  RefreshCw,
  FileInput,
  Download,
  XCircle
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Admin = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [author_desc, setAuthor_desc] = useState('');
  const [author_profile_url, setAuthor_profile_url] = useState('');
  const [category, setCategory] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const { toast } = useToast();

  // State for managing existing blogs
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [viewBlogDialog, setViewBlogDialog] = useState(false);
  const [viewBlogContent, setViewBlogContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload workflow state for blogs
  const [uploadedBlogPath, setUploadedBlogPath] = useState<string>('');
  const [canPreviewBlog, setCanPreviewBlog] = useState(false);
  const [canPublishBlog, setCanPublishBlog] = useState(false);
  const [previewingBlog, setPreviewingBlog] = useState(false);

  // Whitepaper state
  const [wpFile, setWpFile] = useState<File | null>(null);
  const [wpUploading, setWpUploading] = useState(false);
  const [wpTitle, setWpTitle] = useState('');
  const [wpAuthor, setWpAuthor] = useState('');
  const [wpCategory, setWpCategory] = useState('');
  const [whitepapers, setWhitepapers] = useState<any[]>([]);
  const [loadingWhitepapers, setLoadingWhitepapers] = useState(false);
  const [selectedWhitepaper, setSelectedWhitepaper] = useState<any>(null);
  const [confirmDeleteWhitepaperDialog, setConfirmDeleteWhitepaperDialog] = useState(false);
  const [wpSearchQuery, setWpSearchQuery] = useState('');
  const [wpProcessing, setWpProcessing] = useState(false);

  // Upload workflow state for whitepapers
  const [uploadedWpPath, setUploadedWpPath] = useState<string>('');
  const [canPreviewWp, setCanPreviewWp] = useState(false);
  const [canPublishWp, setCanPublishWp] = useState(false);
  const [previewingWp, setPreviewingWp] = useState(false);

  // ADD THESE NEW STATE VARIABLES FOR PREVIEW
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  const [previewType, setPreviewType] = useState<'blog' | 'whitepaper'>('blog');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    try {
      const checkAuth = async () => {
        const { data } = await supabase.auth.getUser();
        console.log("Current user:", data.user);
        console.log("User metadata:", data.user?.app_metadata);
      };
      checkAuth();
    } catch (err) {
      console.error("Error during authentication check:", err);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Blog Upload Function
  const handleBlogUpload = async () => {
    if (!file || !title || !author || !category) {
      toast({
        title: "Missing Information",
        description: "Please provide title, author, category and a file",
        variant: "destructive",
      });
      return;
    }

    if (!file.name.match(/\.docx$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a Word document (.docx)",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // First, check if the bucket exists and is accessible
      console.log("Checking bucket access...");
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error("Bucket access error:", bucketError);
        throw new Error(`Storage access issue: ${bucketError.message}`);
      }
      
      const blogsBucket = buckets?.find(bucket => bucket.name === 'blogs');
      if (!blogsBucket) {
        console.error("Available buckets:", buckets?.map(b => b.name));
        throw new Error("Blogs bucket not found. Please contact administrator.");
      }
      
      console.log("Bucket access confirmed:", blogsBucket);

      const slug = slugify(title);
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const originalPath = `${slug}/${sanitizedFileName}`;
      
      console.log("Uploading to path:", originalPath);
      console.log("File size:", file.size, "bytes");
      
      // Try upload with minimal options first
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blogs')
        .upload(originalPath, file, { 
          upsert: false
        });

      if (uploadError) {
        console.error("Detailed upload error:", {
          error: uploadError,
          path: originalPath,
          fileSize: file.size,
          fileName: file.name
        });
        
        // Try alternative approach if database error
        if (uploadError.message?.includes('DatabaseError') || uploadError.message?.includes('unrecognized configuration')) {
          console.log("Attempting alternative upload method...");
          
          // Try with different path structure
          const simplePath = `${slug}-${Date.now()}.docx`;
          const { data: retryData, error: retryError } = await supabase.storage
            .from('blogs')
            .upload(simplePath, file);
            
          if (retryError) {
            throw new Error(`Upload failed (retry): ${retryError.message}. This appears to be a Supabase configuration issue. Please check your project settings.`);
          }
          
          console.log("Alternative upload successful:", retryData);
          setUploadedBlogPath(simplePath);
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
      } else {
        console.log("File uploaded successfully:", uploadData);
        setUploadedBlogPath(originalPath);
      }
      
      setCanPreviewBlog(true);
      setCanPublishBlog(true);
      
      toast({
        title: "File Uploaded Successfully!",
        description: "Your file is ready for preview. Click Preview to see how it will look.",
        variant: "default",
      });

    } catch (error: any) {
      console.error("Complete upload error:", error);
      
      let errorMessage = error.message || "An error occurred during upload";
      
      // Provide specific guidance for common issues
      if (error.message?.includes('DatabaseError') || error.message?.includes('unrecognized configuration')) {
        errorMessage = "Supabase configuration issue detected. Please check your project settings or contact support.";
      } else if (error.message?.includes('not found')) {
        errorMessage = "Storage bucket not found. Please verify your Supabase project setup.";
      } else if (error.message?.includes('permission')) {
        errorMessage = "Permission denied. Please check your storage policies.";
      }
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Blog Preview Function
  const handleBlogPreview = async () => {
    if (!uploadedBlogPath) {
      toast({
        title: "No File Uploaded",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }

    setPreviewingBlog(true);

    try {
      // Create a temporary preview document
      const previewDoc = {
        title,
        author,
        author_desc,
        author_profile_url,
        category,
        excerpt: `An insightful article about ${title} by ${author}.`,
        slug: slugify(title),
        created_at: new Date().toISOString(),
        content: `
          <div class="preview-notice bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <h3 class="text-yellow-800 font-semibold mb-2">🔍 Preview Mode</h3>
            <p class="text-yellow-700 text-sm">This is a preview of your uploaded document. The actual content will be processed when you click Publish.</p>
          </div>
          <h1>${title}</h1>
          <p><strong>Author:</strong> ${author}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>File:</strong> ${file?.name}</p>
          <p>Your DOCX content will be converted to rich HTML format with images and formatting preserved.</p>
        `
      };

      setPreviewDocument(previewDoc);
      setPreviewType('blog');
      setShowPreview(true);
      
    } catch (error: any) {
      toast({
        title: "Preview Failed",
        description: error.message || "An error occurred during preview",
        variant: "destructive",
      });
    } finally {
      setPreviewingBlog(false);
    }
  };

  // ------------------------- BLOG PUBLISH START ------------------------------------
  // Blog Publish Function
  const handleBlogPublish = async () => {
    if (!uploadedBlogPath) {
      toast({
        title: "No File Uploaded",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }
  
    setProcessing(true);
  
    try {
      console.log("Step 1: Processing document with edge function...");
      const slug = slugify(title);
  
      // Step 1: Call edge function to process and store the document
      const payload = {
        bucket: 'blogs',
        path: uploadedBlogPath,
        metadata: { 
          slug,
          title,
          author,
          author_desc,
          author_profile_url,
          category
        }
      };
  
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'process-document',
        { body: payload }
      );
  
      if (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(`Processing failed: ${functionError.message}`);
      }
  
      if (!functionData.success) {
        throw new Error(functionData.error || 'Document processing failed');
      }
  
      console.log("Document processed successfully:", functionData);
  
      // Step 2: Download the raw markdown from storage
      console.log("Step 2: Downloading raw markdown...");
      const { data: markdownData, error: downloadError } = await supabase.storage
        .from('blogs')
        .download(functionData.markdownPath);
  
      if (downloadError) {
        throw new Error(`Failed to download markdown: ${downloadError.message}`);
      }
  
      // Convert blob to text
      const rawMarkdown = await markdownData.text();
      console.log("Raw markdown downloaded, length:", rawMarkdown.length);
  
      // Step 3: Validate markdown
      const validation = MarkdownEnhancer.validateMarkdown(rawMarkdown);
      if (!validation.isValid) {
        console.warn("Markdown validation warnings:", validation.errors);
        // Continue processing but log warnings
      }
  
      // Step 4: Update image URLs to use public URLs
      // console.log("Step 3: Updating image URLs...");
      // const imageMap = functionData.images.map((img: any) => {
      //   const { data: imgUrl } = supabase.storage
      //     .from('blogs')
      //     .getPublicUrl(img.storagePath);
        
      //   return {
      //     storagePath: img.storagePath,
      //     publicUrl: imgUrl.publicUrl
      //   };
      // });
  
      // let enhancedMarkdown = MarkdownEnhancer.updateImageUrls(rawMarkdown, imageMap);
  
      // Step 5: Apply markdown enhancements
      console.log("Step 4: Enhancing markdown...");
      let enhancedMarkdown = MarkdownEnhancer.enhanceMarkdown(rawMarkdown);
  
      // Step 6: Analyze document structure
      console.log("Step 5: Analyzing document structure...");
      const structure = MarkdownEnhancer.analyzeDocumentStructure(enhancedMarkdown);
  
      // Optional: Add table of contents if needed
      if (structure.tableOfContents.length > 3) { // Only add TOC for longer documents
        const toc = MarkdownEnhancer.generateTableOfContents(structure);
        // Insert TOC after the main title
        const titleMatch = enhancedMarkdown.match(/^(#\s+.+\n)/m);
        if (titleMatch) {
          enhancedMarkdown = enhancedMarkdown.replace(
            titleMatch[0],
            titleMatch[0] + '\n' + toc
          );
        }
      }
  
      // Step 7: Extract enhanced metadata
      console.log("Step 6: Extracting metadata...");
      const metadata = MarkdownEnhancer.extractMetadata(enhancedMarkdown, {
        title,
        author,
        author_desc,
        author_profile_url,
        category,
        excerpt: null
      });
  
      // Step 8: Upload enhanced markdown to storage
      console.log("Step 7: Uploading enhanced markdown...");
      const enhancedMarkdownPath = `${slug}/${slug}.md`;
      const { error: uploadError } = await supabase.storage
        .from('blogs')
        .upload(enhancedMarkdownPath, new TextEncoder().encode(enhancedMarkdown), {
          contentType: 'text/markdown',
          upsert: true
        });
  
      if (uploadError) {
        throw new Error(`Failed to upload enhanced markdown: ${uploadError.message}`);
      }
  
      // Get public URLs
      const { data: mdUrlData } = supabase.storage
        .from('blogs')
        .getPublicUrl(enhancedMarkdownPath);
      
      const { data: docxUrlData } = supabase.storage
        .from('blogs')
        .getPublicUrl(uploadedBlogPath);
  
      // Step 9: Insert record into database
      console.log("Step 8: Publishing to database...");
      const blogRecord = {
        title: metadata.title,
        slug,
        content: enhancedMarkdown,
        markdown_content: enhancedMarkdown,
        markdown_url: mdUrlData.publicUrl,
        docx_url: docxUrlData.publicUrl,
        source_file: uploadedBlogPath,
        excerpt: metadata.excerpt,
        readtime: structure.estimatedReadTime,
        author: metadata.author,
        author_desc: metadata.author_desc,
        author_profile_url: metadata.author_profile_url,
        category: metadata.category,
        created_at: new Date().toISOString(),
        
        // Enhanced metadata
        word_count: structure.totalWordCount,
        has_images: structure.hasImages,
        has_tables: structure.hasTables,
        has_code: structure.hasCode,
        image_count: functionData.images.length,
        
        // Store structure as JSON
        document_structure: JSON.stringify(structure),
        
        // SEO metadata
        meta_description: metadata.excerpt?.substring(0, 160),
        
        // Document stats
        stats: metadata.stats
      };
  
      // Insert into database with basic fields fallback
      const { data: insertData, error: insertError } = await supabase
        .from('blogs')
        .upsert(blogRecord, { onConflict: 'slug' })
        .select()
        .single();
  
      if (insertError) {
        // If error is about missing columns, try with basic fields only
        if (insertError.message.includes('column')) {
          console.log('Retrying with basic fields only...');
          const basicRecord = {
            title: metadata.title,
            slug,
            content: enhancedMarkdown,
            markdown_content: enhancedMarkdown,
            markdown_url: mdUrlData.publicUrl,
            docx_url: docxUrlData.publicUrl,
            source_file: uploadedBlogPath,
            excerpt: metadata.excerpt,
            readtime: structure.estimatedReadTime,
            author: metadata.author,
            author_desc: metadata.author_desc,
            author_profile_url: metadata.author_profile_url,
            category: metadata.category,
            created_at: new Date().toISOString()
          };
  
          const { data: retryData, error: retryError } = await supabase
            .from('blogs')
            .upsert(basicRecord, { onConflict: 'slug' })
            .select()
            .single();
  
          if (retryError) {
            throw new Error(`Failed to publish blog: ${retryError.message}`);
          }
  
          console.log("Blog published successfully (basic mode):", retryData);
        } else {
          throw new Error(`Failed to publish blog: ${insertError.message}`);
        }
      } else {
        console.log("Blog published successfully:", insertData);
        console.log("- Word count:", structure.totalWordCount);
        console.log("- Read time:", structure.estimatedReadTime);
        console.log("- Images:", functionData.images.length);
        console.log("- Sections:", structure.sections.length);
      }
  
      toast({
        title: "Blog Published Successfully!",
        description: `Your blog "${metadata.title}" has been published.`,
        variant: "default",
      });
  
      // Reset form and workflow state
      resetBlogForm();
      setUploadedBlogPath('');
      setCanPreviewBlog(false);
      setCanPublishBlog(false);
  
      // Refresh the blogs list
      setTimeout(() => {
        refreshBlogs();
      }, 2000);
  
    } catch (error: any) {
      toast({
        title: "Publish Failed",
        description: error.message || "An error occurred during publishing",
        variant: "destructive",
      });
      console.error("Publishing error details:", error);
    } finally {
      setProcessing(false);
    }
  };


  // ------------------------- BLOG PUBLISH END ------------------------------------
  // Whitepaper Upload Function
  const handleWpUpload = async () => {
    if (!wpFile || !wpTitle || !wpAuthor || !wpCategory) {
      toast({
        title: "Missing Information",
        description: "Please provide title, author, category and a file",
        variant: "destructive",
      });
      return;
    }

    if (!wpFile.name.match(/\.docx$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a Word document (.docx)",
        variant: "destructive",
      });
      return;
    }

    setWpUploading(true);

    try {
      // Check if whitepapers bucket exists
      console.log("Checking whitepaper bucket access...");
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        console.error("Bucket access error:", bucketError);
        throw new Error(`Storage access issue: ${bucketError.message}`);
      }
      
      const wpBucket = buckets?.find(bucket => bucket.name === 'whitepapers');
      if (!wpBucket) {
        console.error("Available buckets:", buckets?.map(b => b.name));
        throw new Error("Whitepapers bucket not found. Please contact administrator.");
      }
      
      console.log("Whitepaper bucket access confirmed:", wpBucket);

      const slug = slugify(wpTitle);
      const sanitizedFileName = wpFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const originalPath = `${slug}/${sanitizedFileName}`;
      
      console.log("Uploading whitepaper to path:", originalPath);
      console.log("File size:", wpFile.size, "bytes");
      
      // Try upload with minimal options first
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('whitepapers')
        .upload(originalPath, wpFile, { 
          upsert: true
        });

      if (uploadError) {
        console.error("Detailed whitepaper upload error:", {
          error: uploadError,
          path: originalPath,
          fileSize: wpFile.size,
          fileName: wpFile.name
        });
        
        // Try alternative approach if database error
        if (uploadError.message?.includes('DatabaseError') || uploadError.message?.includes('unrecognized configuration')) {
          console.log("Attempting alternative whitepaper upload method...");
          
          // Try with different path structure
          const simplePath = `wp-${slug}-${Date.now()}.docx`;
          const { data: retryData, error: retryError } = await supabase.storage
            .from('whitepapers')
            .upload(simplePath, wpFile);
            
          if (retryError) {
            throw new Error(`Whitepaper upload failed (retry): ${retryError.message}. This appears to be a Supabase configuration issue.`);
          }
          
          console.log("Alternative whitepaper upload successful:", retryData);
          setUploadedWpPath(simplePath);
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
      } else {
        console.log("Whitepaper uploaded successfully:", uploadData);
        setUploadedWpPath(originalPath);
      }
      
      setCanPreviewWp(true);
      setCanPublishWp(true);
      
      toast({
        title: "Whitepaper Uploaded Successfully!",
        description: "Your whitepaper is ready for preview. Click Preview to see how it will look.",
        variant: "default",
      });

    } catch (error: any) {
      console.error("Complete whitepaper upload error:", error);
      
      let errorMessage = error.message || "An error occurred during upload";
      
      // Provide specific guidance for common issues
      if (error.message?.includes('DatabaseError') || error.message?.includes('unrecognized configuration')) {
        errorMessage = "Supabase configuration issue detected. Please check your project settings or contact support.";
      } else if (error.message?.includes('not found')) {
        errorMessage = "Storage bucket not found. Please verify your Supabase project setup.";
      } else if (error.message?.includes('permission')) {
        errorMessage = "Permission denied. Please check your storage policies.";
      }
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setWpUploading(false);
    }
  };

  // Whitepaper Preview Function
  const handleWpPreview = async () => {
    if (!uploadedWpPath) {
      toast({
        title: "No File Uploaded",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }

    setPreviewingWp(true);

    try {
      // Create a temporary preview document
      const previewDoc = {
        title: wpTitle,
        author: wpAuthor,
        category: wpCategory,
        excerpt: `A comprehensive whitepaper on ${wpTitle} by ${wpAuthor}.`,
        slug: slugify(wpTitle),
        created_at: new Date().toISOString(),
        content: `
          <div class="preview-notice bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <h3 class="text-yellow-800 font-semibold mb-2">🔍 Preview Mode</h3>
            <p class="text-yellow-700 text-sm">This is a preview of your uploaded whitepaper. The actual content will be processed when you click Publish.</p>
          </div>
          <h1>${wpTitle}</h1>
          <p><strong>Author:</strong> ${wpAuthor}</p>
          <p><strong>Category:</strong> ${wpCategory}</p>
          <p><strong>File:</strong> ${wpFile?.name}</p>
          <p>Your DOCX content will be converted to rich HTML format with images and formatting preserved in professional whitepaper styling.</p>
        `
      };

      setPreviewDocument(previewDoc);
      setPreviewType('whitepaper');
      setShowPreview(true);
      
    } catch (error: any) {
      toast({
        title: "Preview Failed",
        description: error.message || "An error occurred during preview",
        variant: "destructive",
      });
    } finally {
      setPreviewingWp(false);
    }
  };

  // Whitepaper Publish Function
  const handleWpPublish = async () => {
    if (!uploadedWpPath) {
      toast({
        title: "No File Uploaded",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }

    setWpProcessing(true);

    try {
      console.log("Calling edge function to publish whitepaper...");
      
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'process-document',
        {
          body: {
            bucket: 'whitepapers',
            path: uploadedWpPath,
            metadata: { 
              title: slugify(wpTitle), 
              author: wpAuthor, 
              category: wpCategory,
              excerpt: `A comprehensive whitepaper on ${wpTitle} by ${wpAuthor}.`
            }
          }
        }
      );

      if (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(`Publishing failed: ${functionError.message}`);
      }

      console.log("Whitepaper published successfully:", functionData);
      
      toast({
        title: "Whitepaper Published Successfully!",
        description: "Your whitepaper is being processed and will be available shortly.",
        variant: "default",
      });

      // Reset form and workflow state
      resetWhitepaperForm();
      setUploadedWpPath('');
      setCanPreviewWp(false);
      setCanPublishWp(false);

      // Refresh the whitepapers list
      setTimeout(() => {
        refreshWhitepapers();
      }, 2000);

    } catch (error: any) {
      toast({
        title: "Publish Failed",
        description: error.message || "An error occurred during publishing",
        variant: "destructive",
      });
      console.error("Publishing error details:", error);
    } finally {
      setWpProcessing(false);
    }
  };

  // ADD THESE NEW HANDLER FUNCTIONS
  const handlePreviewBlog = (blog: any) => {
    setPreviewDocument(blog);
    setPreviewType('blog');
    setShowPreview(true);
  };

  const handlePreviewWhitepaper = (whitepaper: any) => {
    setPreviewDocument(whitepaper);
    setPreviewType('whitepaper');
    setShowPreview(true);
  };

  const handlePublishFromPreview = () => {
    // Refresh the appropriate list after publishing
    if (previewType === 'blog') {
      refreshBlogs();
    } else {
      refreshWhitepapers();
    }
  };

  // Reset functions
  const resetBlogForm = () => {
    setFile(null);
    setTitle('');
    setAuthor('');
    setAuthor_desc('');
    setAuthor_profile_url('');
    setCategory('');
    setUploadedBlogPath('');
    setCanPreviewBlog(false);
    setCanPublishBlog(false);
    
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const resetWhitepaperForm = () => {
    setWpFile(null);
    setWpTitle('');
    setWpAuthor('');
    setWpCategory('');
    setUploadedWpPath('');
    setCanPreviewWp(false);
    setCanPublishWp(false);
    
    const fileInput = document.getElementById('wp-file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const testSupabaseConnection = async () => {
    try {
      console.log("=== COMPREHENSIVE SUPABASE CONNECTION TEST ===");
      
      // 1. Test Auth
      console.log("1. Testing Authentication...");
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) {
        console.error("❌ Auth error:", authError);
      } else {
        console.log("✅ Auth session:", authData?.session ? "Active" : "No session");
        console.log("User:", authData?.session?.user?.email || "Not logged in");
      }
      
      // 2. Test Storage Access
      console.log("\n2. Testing Storage Access...");
      const { data: storageData, error: storageError } = await supabase.storage.listBuckets();
      if (storageError) {
        console.error("❌ Storage error:", storageError);
      } else {
        console.log("✅ Available buckets:", storageData?.map(b => b.name) || []);
        
        // If no buckets visible, test bucket access directly
        if (!storageData || storageData.length === 0) {
          console.log("⚠️ No buckets visible - testing direct bucket access...");
          
          // Test direct bucket access
          const requiredBuckets = ['blogs', 'whitepapers'];
          for (const bucketName of requiredBuckets) {
            try {
              const { data: listData, error: listError } = await supabase.storage
                .from(bucketName)
                .list('', { limit: 1 });
                
              if (listError) {
                console.log(`❌ ${bucketName} bucket: ${listError.message}`);
              } else {
                console.log(`✅ ${bucketName} bucket: Accessible (${listData?.length || 0} items)`);
              }
            } catch (err) {
              console.log(`❌ ${bucketName} bucket: Error accessing`);
            }
          }
        } else {
          // Check specific buckets normally
          const requiredBuckets = ['blogs', 'whitepapers'];
          requiredBuckets.forEach(bucketName => {
            const exists = storageData?.find(b => b.name === bucketName);
            console.log(`${exists ? '✅' : '❌'} ${bucketName} bucket:`, exists ? 'Found' : 'NOT FOUND');
          });
        }
      }
      
      // 3. Test Database
      console.log("\n3. Testing Database Access...");
      const { data: dbData, error: dbError } = await supabase.from('blogs').select('count').limit(1);
      if (dbError) {
        console.error("❌ Database error:", dbError);
      } else {
        console.log("✅ Database access: Working");
      }
      
      // 4. Test Storage Upload (small test file)
      console.log("\n4. Testing Storage Upload...");
      try {
        const testBlob = new Blob(['test'], { type: 'text/plain' });
        const testFile = new File([testBlob], 'connection-test.txt', { type: 'text/plain' });
        
        const { data: uploadTest, error: uploadTestError } = await supabase.storage
          .from('blogs')
          .upload(`test/connection-test-${Date.now()}.txt`, testFile);
          
                 if (uploadTestError) {
           console.error("❌ Upload test failed:", uploadTestError);
           console.error("Upload error details:", {
             message: uploadTestError.message,
             fullError: uploadTestError
           });
        } else {
          console.log("✅ Upload test: Success");
          
          // Clean up test file
          await supabase.storage.from('blogs').remove([uploadTest.path]);
        }
      } catch (uploadErr) {
        console.error("❌ Upload test exception:", uploadErr);
      }
      
      // 5. Test Edge Functions
      console.log("\n5. Testing Edge Functions...");
      const { data: functionsData, error: functionsError } = await supabase.functions.invoke('process-document', {
        body: { test: true }
      });
      if (functionsError) {
        console.error("❌ Edge function error:", functionsError);
      } else {
        console.log("✅ Edge functions: Available");
      }
      
      console.log("\n=== CONNECTION TEST COMPLETE ===");
      
      // Summary
      const issues = [];
      if (authError) issues.push("Authentication");
      if (storageError) issues.push("Storage Access");
      if (dbError) issues.push("Database");
      if (functionsError) issues.push("Edge Functions");
      
      toast({
        title: issues.length === 0 ? "All Tests Passed!" : "Issues Detected",
        description: issues.length === 0 
          ? "All Supabase services are working correctly" 
          : `Issues found with: ${issues.join(', ')}. Check console for details.`,
        variant: issues.length === 0 ? "default" : "destructive",
      });
      
    } catch (err) {
      console.error("❌ Connection test failed:", err);
      toast({
        title: "Connection Test Failed",
        description: "See console for detailed error information",
        variant: "destructive"
      });
    }
  };

  // Fetch blogs and whitepapers
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlogs(true);
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching blogs:", error);
          toast({
            title: "Error",
            description: "Failed to load blogs",
            variant: "destructive",
          });
          return;
        }
        
        setBlogs(data || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoadingBlogs(false);
      }
    };
    
    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchWhitepapers = async () => {
      try {
        setLoadingWhitepapers(true);
        const { data, error } = await supabase
          .from('whitepapers')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching whitepapers:", error);
          toast({
            title: "Error",
            description: "Failed to load whitepapers",
            variant: "destructive",
          });
          return;
        }
        
        setWhitepapers(data || []);
      } catch (err) {
        console.error("Failed to fetch whitepapers:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoadingWhitepapers(false);
      }
    };
    
    fetchWhitepapers();
  }, []);

  const handleWpFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setWpFile(e.target.files[0]);
  };

  // Management functions
  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setViewBlogContent(blog.content);
    setViewBlogDialog(true);
  };
  
  const handleDeleteClick = (blog) => {
    setSelectedBlog(blog);
    setConfirmDeleteDialog(true);
  };
  
  const confirmDelete = async () => {
    if (!selectedBlog) return;
    
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', selectedBlog.id);
        
      if (error) {
        console.error("Error deleting blog:", error);
        toast({
          title: "Error",
          description: "Failed to delete blog",
          variant: "destructive",
        });
        return;
      }
      
      setBlogs(blogs.filter(blog => blog.id !== selectedBlog.id));
      
      toast({
        title: "Success",
        description: "Blog deleted successfully",
        variant: "default",
      });
      
      setConfirmDeleteDialog(false);
    } catch (err) {
      console.error("Delete operation failed:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWhitepaperClick = (whitepaper) => {
    setSelectedWhitepaper(whitepaper);
    setConfirmDeleteWhitepaperDialog(true);
  };
  
  const confirmDeleteWhitepaper = async () => {
    if (!selectedWhitepaper) return;
    
    try {
      const { error } = await supabase
        .from('whitepapers')
        .delete()
        .eq('id', selectedWhitepaper.id);
        
      if (error) {
        console.error("Error deleting whitepaper:", error);
        toast({
          title: "Error",
          description: "Failed to delete whitepaper",
          variant: "destructive",
        });
        return;
      }
      
      setWhitepapers(whitepapers.filter(wp => wp.id !== selectedWhitepaper.id));
      
      toast({
        title: "Success",
        description: "Whitepaper deleted successfully",
        variant: "default",
      });
      
      setConfirmDeleteWhitepaperDialog(false);
    } catch (err) {
      console.error("Delete operation failed:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const refreshBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error refreshing blogs:", error);
        toast({
          title: "Error",
          description: "Failed to refresh blogs",
          variant: "destructive",
        });
        return;
      }
      
      setBlogs(data || []);
      
      toast({
        title: "Refreshed",
        description: "Blog list updated",
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to refresh blogs:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoadingBlogs(false);
    }
  };

  const refreshWhitepapers = async () => {
    try {
      setLoadingWhitepapers(true);
      const { data, error } = await supabase
        .from('whitepapers')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error refreshing whitepapers:", error);
        toast({
          title: "Error",
          description: "Failed to refresh whitepapers",
          variant: "destructive",
        });
        return;
      }
      
      setWhitepapers(data || []);
      
      toast({
        title: "Refreshed",
        description: "Whitepaper list updated",
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to refresh whitepapers:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoadingWhitepapers(false);
    }
  };
  
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    blog.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWhitepapers = whitepapers.filter(wp => 
    wp.title.toLowerCase().includes(wpSearchQuery.toLowerCase()) || 
    wp.author.toLowerCase().includes(wpSearchQuery.toLowerCase()) ||
    wp.category.toLowerCase().includes(wpSearchQuery.toLowerCase())
  );
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                  <img 
                    src="/lovable-uploads/Indrasol company logo_.png" 
                    alt="Indrasol Logo" 
                    className="h-8"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={testSupabaseConnection}
                className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
              >
                <Database className="h-4 w-4 mr-2 text-indrasol-blue dark:text-indrasol-darkblue" />
                Test Connection
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2 text-indrasol-blue dark:text-indrasol-darkblue" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Content Management</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              Upload and manage content for the Indrasol website
            </p>
            <div className="flex items-center gap-2">
              <Label htmlFor="debug-mode" className="text-sm font-medium text-gray-600">
                Debug Mode
              </Label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="debug-mode"
                  checked={debugMode}
                  onChange={(e) => setDebugMode(e.target.checked)}
                  className="h-4 w-4 text-indrasol-blue focus:ring-indrasol-blue border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
          <Separator className="mt-4 bg-gray-200 dark:bg-gray-700" />
        </div>
        
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="bg-indrasol-blue-100 dark:bg-indrasol-darkblue-800 p-1">
            <TabsTrigger value="upload" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
              <Upload className="h-4 w-4 mr-2 text-indrasol-blue dark:text-indrasol-darkblue" />
              Upload Blogs
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
              <FileText className="h-4 w-4 mr-2 text-indrasol-blue dark:text-indrasol-darkblue" />
              Manage Blogs
            </TabsTrigger>
            <TabsTrigger value="wp-upload" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
              <FileInput className="h-4 w-4 mr-2 text-indrasol-blue dark:text-indrasol-darkblue" />
              Upload Whitepapers
            </TabsTrigger>
            <TabsTrigger value="wp-manage" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
              <FileCheck className="h-4 w-4 mr-2 text-indrasol-blue dark:text-indrasol-darkblue" />
              Manage Whitepapers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-md">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pb-4">
                <CardTitle className="flex items-center text-xl font-semibold">
                  <FileType className="h-5 w-5 mr-2 text-indrasol-blue dark:text-indrasol-darkblue" />
                  New Blog Post
                </CardTitle>
                <CardDescription>
                  Upload Word documents (DOCX) to create blog posts. The document will be automatically processed and converted.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        Blog Title
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter blog title"
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-sm font-medium flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        Author
                      </Label>
                      <Input
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter author name"
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-sm font-medium flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        Author Description
                      </Label>
                      <Input
                        id="author_desc"
                        value={author_desc}
                        onChange={(e) => setAuthor_desc(e.target.value)}
                        placeholder="Enter author description"
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-sm font-medium flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        Author Profile URL
                      </Label>
                      <Input
                        id="author_profile_url"
                        value={author_profile_url}
                        onChange={(e) => setAuthor_profile_url(e.target.value)}
                        placeholder="Enter author profile URL"
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        Category
                      </Label>
                      <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Enter blog category"
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="file-upload" className="text-sm font-medium flex items-center">
                        <Upload className="h-4 w-4 mr-2 text-gray-500" />
                        Document (DOCX)
                      </Label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="file-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              {file ? file.name : <span>Click to upload or drag and drop</span>}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">DOCX files only (MAX. 10MB)</p>
                          </div>
                          <Input
                            id="file-upload"
                            type="file"
                            accept=".docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500">
                    {debugMode && "Debug mode enabled - Check console for details"}
                  </p>
                  {uploadedBlogPath && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ File uploaded successfully - Ready for preview
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleBlogUpload} 
                    disabled={uploading || !file || !title || !author || !category || !!uploadedBlogPath}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                  
                  {/* <Button 
                    onClick={handleBlogPreview} 
                    disabled={!canPreviewBlog || previewingBlog}
                    variant="outline"
                    className="flex items-center gap-2 text-indrasol-blue border-indrasol-blue/20"
                  >
                    {previewingBlog ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Previewing...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Preview
                      </>
                    )}
                  </Button> */}
                  
                  <Button 
                    onClick={handleBlogPublish} 
                    disabled={!canPublishBlog || processing}
                    className="bg-indrasol-blue hover:bg-indrasol-darkblue text-white flex items-center gap-2"
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Publish
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Tips Card */}
            <Card className="bg-blue-50 dark:bg-indrasol-darkblue border-indrasol-blue dark:border-indrasol-darkblue">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-indrasol-blue dark:text-indrasol-darkblue">Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-indrasol-blue-700 dark:text-indrasol-darkblue-400">
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <ArrowRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Only upload DOCX (Word) files</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Documents are automatically converted to markdown and processed</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Images are extracted and optimized automatically</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Processing happens in the background - your content will appear shortly</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-md">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <FileText className="h-5 w-5 mr-2 text-indrasol-blue dark:text-indrasol-darkblue" />
                    Manage Blogs
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshBlogs}
                    disabled={loadingBlogs}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingBlogs ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                <CardDescription>
                  View, edit, and manage your existing blog posts
                </CardDescription>
                
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search blogs by title, author, or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {loadingBlogs ? (
                  <div className="flex items-center justify-center p-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-indrasol-blue dark:text-indrasol-darkblue" />
                    <span className="ml-2 text-gray-500 dark:text-gray-400">Loading blogs...</span>
                  </div>
                ) : filteredBlogs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Published</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBlogs.map((blog) => (
                          <TableRow key={blog.id}>
                            <TableCell className="font-medium">{blog.title}</TableCell>
                            <TableCell>{blog.author}</TableCell>
                            <TableCell>{blog.category}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-500" />
                                {formatDate(blog.created_at)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePreviewBlog(blog)} 
                                  className="flex items-center gap-1 text-indrasol-blue hover:text-indrasol-darkblue border-indrasol-blue/20 hover:border-indrasol-blue/40"
                                  title="Preview blog post"
                                >
                                  <Eye className="h-4 w-4" />
                                  Preview
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(blog)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  title="Delete blog post"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      {searchQuery ? 'No matching blogs found' : 'No blogs yet'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchQuery 
                        ? 'Try adjusting your search or clear the filter'
                        : 'Upload your first blog post to get started'
                      }
                    </p>
                    {searchQuery && (
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchQuery('')}
                        className="mx-auto"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Whitepaper Upload Tab */}
          <TabsContent value="wp-upload" className="space-y-6">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-md">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pb-4">
                <CardTitle className="flex items-center text-xl font-semibold">
                  <FileInput className="h-5 w-5 mr-2 text-indrasol-blue dark:text-indrasol-darkblue" />
                  New Whitepaper
                </CardTitle>
                <CardDescription>
                  Upload Word documents (DOCX) to create whitepapers. Documents are automatically converted and processed.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="wp-title" className="text-sm font-medium flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        Whitepaper Title
                      </Label>
                      <Input
                        id="wp-title"
                        value={wpTitle}
                        onChange={(e) => setWpTitle(e.target.value)}
                        placeholder="Enter whitepaper title"
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wp-author" className="text-sm font-medium flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        Author
                      </Label>
                      <Input
                        id="wp-author"
                        value={wpAuthor}
                        onChange={(e) => setWpAuthor(e.target.value)}
                        placeholder="Enter author name"
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="wp-category" className="text-sm font-medium flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        Category
                      </Label>
                      <Input
                        id="wp-category"
                        value={wpCategory}
                        onChange={(e) => setWpCategory(e.target.value)}
                        placeholder="Enter whitepaper category"
                        className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wp-file-upload" className="text-sm font-medium flex items-center">
                        <Upload className="h-4 w-4 mr-2 text-gray-500" />
                        Document (DOCX)
                      </Label>
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="wp-file-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              {wpFile ? wpFile.name : <span>Click to upload or drag and drop</span>}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">DOCX files only (MAX. 20MB)</p>
                          </div>
                          <Input
                            id="wp-file-upload"
                            type="file"
                            accept=".docx"
                            onChange={handleWpFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between items-center border-t border-gray-200 dark:border-gray-800 pt-6">
                <div className="flex flex-col">
                  <Button 
                    variant="outline" 
                    onClick={resetWhitepaperForm}
                    disabled={wpProcessing || wpUploading}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Clear Form
                  </Button>
                  {uploadedWpPath && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Whitepaper uploaded - Ready for preview
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleWpUpload} 
                    disabled={wpUploading || !wpFile || !wpTitle || !wpAuthor || !wpCategory || !!uploadedWpPath}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {wpUploading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleWpPreview} 
                    disabled={!canPreviewWp || previewingWp}
                    variant="outline"
                    className="flex items-center gap-2 text-indrasol-blue border-indrasol-blue/20"
                  >
                    {previewingWp ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Previewing...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Preview
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleWpPublish} 
                    disabled={!canPublishWp || wpProcessing}
                    className="bg-indrasol-blue hover:bg-indrasol-darkblue text-white flex items-center gap-2"
                  >
                    {wpProcessing ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Publish
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Tips Card */}
            <Card className="bg-blue-50 dark:bg-indrasol-darkblue border-indrasol-blue dark:border-indrasol-darkblue">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-indrasol-blue dark:text-indrasol-darkblue">Simplified Whitepaper System</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-indrasol-blue-700 dark:text-indrasol-darkblue-400">
                <ul className="space-y-1">
                  <li className="flex items-start">
                    <ArrowRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Whitepapers are processed exactly like blogs</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>DOCX files are converted to markdown automatically</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Images are extracted and optimized</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Professional whitepaper styling is applied automatically</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Manage Whitepapers Tab */}
          <TabsContent value="wp-manage">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-md">
              <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl font-semibold">
                    <FileCheck className="h-5 w-5 mr-2 text-indrasol-blue dark:text-indrasol-darkblue" />
                    Manage Whitepapers
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshWhitepapers}
                    disabled={loadingWhitepapers}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingWhitepapers ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                <CardDescription>
                  View and manage your published whitepapers
                </CardDescription>
                
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search whitepapers by title, author, or category..."
                      value={wpSearchQuery}
                      onChange={(e) => setWpSearchQuery(e.target.value)}
                      className="pl-8 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {loadingWhitepapers ? (
                  <div className="flex items-center justify-center p-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-indrasol-blue dark:text-indrasol-darkblue" />
                    <span className="ml-2 text-gray-500 dark:text-gray-400">Loading whitepapers...</span>
                  </div>
                ) : filteredWhitepapers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Published</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredWhitepapers.map((whitepaper) => (
                          <TableRow key={whitepaper.id}>
                            <TableCell className="font-medium">{whitepaper.title}</TableCell>
                            <TableCell>{whitepaper.author}</TableCell>
                            <TableCell>{whitepaper.category}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-500" />
                                {formatDate(whitepaper.created_at)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePreviewWhitepaper(whitepaper)} 
                                  className="flex items-center gap-1 text-indrasol-blue hover:text-indrasol-darkblue border-indrasol-blue/20 hover:border-indrasol-blue/40"
                                  title="Preview whitepaper"
                                >
                                  <Eye className="h-4 w-4" />
                                  Preview
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteWhitepaperClick(whitepaper)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  title="Delete whitepaper"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      {wpSearchQuery ? 'No matching whitepapers found' : 'No whitepapers yet'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {wpSearchQuery 
                        ? 'Try adjusting your search or clear the filter'
                        : 'Upload your first whitepaper to get started'
                      }
                    </p>
                    {wpSearchQuery && (
                      <Button 
                        variant="outline" 
                        onClick={() => setWpSearchQuery('')}
                        className="mx-auto"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Delete Confirmation Dialogs */}
      <Dialog open={confirmDeleteDialog} onOpenChange={setConfirmDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBlog && (
            <div className="py-4">
              <p className="font-medium">{selectedBlog.title}</p>
              <p className="text-sm text-gray-500">by {selectedBlog.author} in {selectedBlog.category}</p>
            </div>
          )}
          
          <DialogFooter className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Blog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={confirmDeleteWhitepaperDialog} onOpenChange={setConfirmDeleteWhitepaperDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this whitepaper? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedWhitepaper && (
            <div className="py-4">
              <p className="font-medium">{selectedWhitepaper.title}</p>
              <p className="text-sm text-gray-500">by {selectedWhitepaper.author} in {selectedWhitepaper.category}</p>
            </div>
          )}
          
          <DialogFooter className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteWhitepaperDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteWhitepaper}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Whitepaper
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Content Dialog (shared for blogs and whitepapers) */}
      <Dialog open={viewBlogDialog} onOpenChange={setViewBlogDialog}>
        <DialogContent className="max-w-7xl h-[80vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold flex items-center">
                <Eye className="h-5 w-5 mr-2 text-indrasol-blue-600 dark:text-indrasol-darkblue-400" />
                Content Preview
              </DialogTitle>
              
              {(selectedBlog || selectedWhitepaper) && (
                <div className="flex items-center">
                  <span className="px-2 py-1 bg-indrasol-blue/10 text-indrasol-blue text-xs font-medium rounded-full">
                    {(selectedBlog || selectedWhitepaper)?.category}
                  </span>
                </div>
              )}
            </div>
            
            {(selectedBlog || selectedWhitepaper) && (
              <div className="mt-2">
                <h3 className="text-lg font-medium">{(selectedBlog || selectedWhitepaper)?.title}</h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <User className="h-3 w-3 mr-1" />
                  <span>{(selectedBlog || selectedWhitepaper)?.author}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate((selectedBlog || selectedWhitepaper)?.created_at)}</span>
                </div>
              </div>
            )}
          </DialogHeader>
          
          <div 
            className="preview-container mt-4 prose prose-indrasol-blue dark:prose-invert max-w-none" 
            dangerouslySetInnerHTML={{ __html: viewBlogContent }}
          />
          
          <DialogFooter className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedBlog) {
                      const currentIndex = blogs.findIndex(blog => blog.id === selectedBlog?.id);
                      if (currentIndex > 0) {
                        const prevBlog = blogs[currentIndex - 1];
                        handleViewBlog(prevBlog);
                      }
                    } else if (selectedWhitepaper) {
                      const currentIndex = whitepapers.findIndex(wp => wp.id === selectedWhitepaper?.id);
                      if (currentIndex > 0) {
                        const prevWp = whitepapers[currentIndex - 1];
                        setSelectedWhitepaper(prevWp);
                        setViewBlogContent(prevWp.content);
                        setViewBlogDialog(true);
                      }
                    }
                  }}
                  disabled={(!selectedBlog || blogs.findIndex(blog => blog.id === selectedBlog?.id) <= 0) && 
                           (!selectedWhitepaper || whitepapers.findIndex(wp => wp.id === selectedWhitepaper?.id) <= 0)}
                  className="flex items-center gap-1"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedBlog) {
                      const currentIndex = blogs.findIndex(blog => blog.id === selectedBlog?.id);
                      if (currentIndex < blogs.length - 1) {
                        const nextBlog = blogs[currentIndex + 1];
                        handleViewBlog(nextBlog);
                      }
                    } else if (selectedWhitepaper) {
                      const currentIndex = whitepapers.findIndex(wp => wp.id === selectedWhitepaper?.id);
                      if (currentIndex < whitepapers.length - 1) {
                        const nextWp = whitepapers[currentIndex + 1];
                        setSelectedWhitepaper(nextWp);
                        setViewBlogContent(nextWp.content);
                        setViewBlogDialog(true);
                      }
                    }
                  }}
                  disabled={(!selectedBlog || blogs.findIndex(blog => blog.id === selectedBlog?.id) >= blogs.length - 1) &&
                           (!selectedWhitepaper || whitepapers.findIndex(wp => wp.id === selectedWhitepaper?.id) >= whitepapers.length - 1)}
                  className="flex items-center gap-1"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setViewBlogDialog(false);
                    setTimeout(() => {
                      if (selectedBlog) {
                        handleDeleteClick(selectedBlog);
                      } else if (selectedWhitepaper) {
                        handleDeleteWhitepaperClick(selectedWhitepaper);
                      }
                    }, 100);
                  }}
                  className="h-9 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setViewBlogDialog(false)}
                  className="h-9"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* ADD PREVIEW MODAL HERE */}
      {showPreview && previewDocument && (
        <PreviewModal
          open={showPreview}
          onClose={() => {
            setShowPreview(false);
            setPreviewDocument(null);
          }}
          document={previewDocument}
          type={previewType}
          onPublish={handlePublishFromPreview}
        />
      )}
    </div>
  );
};

export default Admin;




