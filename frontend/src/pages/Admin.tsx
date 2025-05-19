import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import { generateBlogTemplate } from '../utils/BlogTemplateGenerator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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
  ArrowRight
} from 'lucide-react';

const Admin = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const { toast } = useToast();

  // Preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [processedData, setProcessedData] = useState<{
    content: string;
    title: string;
    author: string;
    category: string;
    excerpt: string;
    fileName: string;
    images: any[];
  } | null>(null);

  // Set up PDF.js worker
  useEffect(() => {
    try {
      // Configure PDF.js worker (this is crucial for PDF processing)
      // Use a CDN-hosted worker file for reliability
      const pdfjsVersion = pdfjsLib.version;
      console.log("PDF.js version:", pdfjsVersion);
      GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;
      
      console.log("PDF.js worker configured successfully");
      
      // Log current user for debugging authentication state
      const checkAuth = async () => {
        const { data } = await supabase.auth.getUser();
        console.log("Current user:", data.user);
        console.log("User metadata:", data.user?.app_metadata);
      };
      checkAuth();
    } catch (err) {
      console.error("Error configuring PDF.js worker:", err);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleProcess = async () => {
    if (!file || !title || !author || !category) {
      toast({
        title: "Missing Information",
        description: "Please provide title, author, category and a file",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.name.match(/\.(pdf|docx)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      // Skip bucket verification and try to upload directly
      console.log("Starting direct upload to blogs bucket");
      
      // Upload to Supabase Storage - using 'blogs' bucket consistently
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('blogs')
        .upload(`public/${fileName}`, file);

      if (error) {
        console.error("Upload error:", error);
        throw new Error(`Storage upload failed: ${error.message}`);
      }

      console.log("File uploaded successfully:", data);

      // Process the file but don't save to database yet
      const processedResult = await processFile(fileName, title, author, category);
      
      // Store the processed data for later use
      setProcessedData(processedResult);
      
      // Generate preview HTML
      const previewHtml = generateBlogTemplate(
        processedResult.content,
        processedResult.title,
        processedResult.author,
        processedResult.category,
        processedResult.excerpt,
        processedResult.images
      );
      
      // Set the preview HTML and open the preview dialog
      setPreviewHtml(previewHtml);
      setPreviewOpen(true);
      
      toast({
        title: "Processing successful",
        description: "Preview is ready for review. Confirm to save blog.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Processing Failed",
        description: error.message || "An error occurred during processing",
        variant: "destructive",
      });
      console.error("Processing error details:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (!processedData) {
      toast({
        title: "Error",
        description: "No processed data available. Please process the file first.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Save the processed data to the database
      await saveToDatabase(
        processedData.content,
        processedData.title,
        processedData.author,
        processedData.category,
        processedData.excerpt,
        processedData.fileName,
        processedData.images
      );

      toast({
        title: "Blog Published Successfully!",
        description: "Your content is now live on the Indrasol website",
        variant: "default",
      });

      // Reset form and state
      setFile(null);
      setTitle('');
      setAuthor('');
      setCategory('');
      setProcessedData(null);
      setPreviewHtml('');
      setPreviewOpen(false);
      
      if (document.getElementById('file-upload') as HTMLInputElement) {
        (document.getElementById('file-upload') as HTMLInputElement).value = '';
      }
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "An error occurred during save",
        variant: "destructive",
      });
      console.error("Save error details:", error);
    } finally {
      setUploading(false);
    }
  };

  const processFile = async (fileName: string, title: string, author: string, category: string) => {
    console.log(`Processing file: ${fileName}`);
    
    try {
      // Generate signed URL from the blogs bucket
      const { data, error } = await supabase.storage
        .from('blogs')
        .createSignedUrl(`public/${fileName}`, 3600); // 1-hour expiration

      if (error) {
        console.error("Signed URL error:", error);
        throw new Error(`Failed to generate signed URL: ${error.message}`);
      }

      if (!data?.signedUrl) {
        throw new Error("No signed URL returned from Supabase");
      }

      console.log("Successfully generated signed URL");
      const signedUrl = data.signedUrl;
      
      let content = '';
      let images = [];
      
      try {
        if (fileName.endsWith('.pdf')) {
          console.log("Processing PDF document");
          // Extract text and images from PDF
          const result = await extractFromPdf(signedUrl);
          content = result.text;
          images = result.images;
        } else if (fileName.endsWith('.docx')) {
          console.log("Processing DOCX document");
          // Extract text and images from DOCX
          const result = await extractFromDocx(signedUrl);
          content = result.text;
          images = result.images;
        }
        
        console.log(`Extracted content length: ${content.length} characters`);
        console.log(`Extracted ${images.length} images`);
      } catch (err) {
        console.error("Document processing error:", err);
        throw new Error("Failed to process document: " + (err as Error).message);
      }

      // Create an excerpt from the content (first 200 characters)
      const excerpt = content.substring(0, 200).trim() + '...';

      // Return the processed data
      return {
        content,
        title,
        author, 
        category,
        excerpt,
        fileName,
        images
      };
    } catch (err) {
      console.error("Process file error:", err);
      throw err;
    }
  };

  // PDF extraction function that handles both text and images
  const extractFromPdf = async (url: string): Promise<{ text: string, images: any[] }> => {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    let fullText = '';
    const images = [];
    
    // Process each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      
      // Extract text
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(' ');
      
      // Try to extract images (simplified approach)
      try {
        const operatorList = await page.getOperatorList();
        for (let j = 0; j < operatorList.fnArray.length; j++) {
          if (operatorList.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
            const imgIndex = operatorList.argsArray[j][0];
            // Store image reference for later use
            images.push({
              pageNum: i,
              imgIndex: imgIndex,
              placeholder: `/api/placeholder/800/400` // Use placeholder for now
            });
          }
        }
      } catch (err) {
        console.log(`Error extracting images from page ${i}:`, err);
      }
    }
    
    return { text: fullText, images };
  };

  // DOCX extraction function that handles both text and images
  const extractFromDocx = async (url: string): Promise<{ text: string, images: any[] }> => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    
    // Extract text and references to images
    const options = {
      convertImage: mammoth.images.imgElement(function(image) {
        // Return a Promise that resolves to the image attributes
        return Promise.resolve({
          src: `/api/placeholder/800/400` // Use placeholder for now
        });
      })
    };
    
    const result = await mammoth.convertToHtml({ arrayBuffer }, options);
    const htmlContent = result.value;
    
    // Extract text from the HTML
    const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Find image references in the HTML
    const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    const images = [];
    let match;
    
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      images.push({
        src: match[1],
        placeholder: match[1]
      });
    }
    
    return { text, images };
  };

  const saveToDatabase = async (
    content: string, 
    title: string, 
    author: string, 
    category: string, 
    excerpt: string, 
    fileName: string, 
    images: any[]
  ) => {
    // Create a slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    try {
      // Log what we're trying to insert (for debugging)
      console.log("Attempting to insert blog with data:", {
        title,
        slug,
        excerpt: excerpt.substring(0, 30) + "...", // Truncate for readability
        author,
        category,
        source_file: fileName
      });

      // Generate formatted blog content using the imported utility
      const styledContent = generateBlogTemplate(content, title, author, category, excerpt, images);

      // Save to Supabase database
      const { data, error } = await supabase
        .from('blogs')
        .insert({ 
          title: title,
          content: styledContent,
          slug: slug,
          excerpt: excerpt,
          author: author,
          category: category,
          source_file: fileName,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error("Database insert error:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Database error: ${error.message || error.details || 'Unknown error'}`);
      }

      console.log("Blog saved successfully:", data);
    } catch (err: any) {
      console.error("Save error:", {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      throw new Error("Failed to save blog: " + (err.message || "Unknown error"));
    }
  };

  // Add a test function to verify Supabase connection
  const testSupabaseConnection = async () => {
    try {
      console.log("Testing Supabase connection...");
      
      // Test authentication
      const { data: authData, error: authError } = await supabase.auth.getSession();
      console.log("Auth session:", authData);
      if (authError) console.error("Auth error:", authError);
      
      // Test storage
      const { data: storageData, error: storageError } = await supabase.storage.listBuckets();
      console.log("Storage buckets:", storageData);
      if (storageError) console.error("Storage error:", storageError);
      
      // Test database
      const { data: dbData, error: dbError } = await supabase.from('blogs').select('count').limit(1);
      console.log("Database response:", dbData);
      if (dbError) console.error("Database error:", dbError);
      
      toast({
        title: "Connection Test",
        description: "Check console for results",
        variant: "default",
      });
    } catch (err) {
      console.error("Test failed:", err);
      toast({
        title: "Connection Test Failed",
        description: "See console for details",
        variant: "destructive"
      });
    }
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
          <p className="text-gray-600 dark:text-gray-400">
            Upload and manage blog content for the Indrasol website
          </p>
          <Separator className="mt-4 bg-gray-200 dark:bg-gray-700" />
        </div>
        
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="bg-indrasol-blue-100 dark:bg-indrasol-darkblue-800 p-1">
            <TabsTrigger value="upload" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
              <Upload className="h-4 w-4 mr-2 text-indrasol-blue dark:text-indrasol-darkblue" />
              Upload Content
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
              <FileText className="h-4 w-4 mr-2 text-indrasol-blue dark:text-indrasol-darkblue" />
              Manage Blogs
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
                  Upload PDF or Word documents to create blog posts for the Indrasol website
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
                        Document (PDF or DOCX)
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
                            <p className="text-xs text-gray-500 dark:text-gray-400">PDF or DOCX (MAX. 10MB)</p>
                          </div>
                          <Input
                            id="file-upload"
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <Button 
                  variant="outline"
                  onClick={handleProcess} 
                  disabled={processing || !file || !title || !author || !category}
                  className="flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-indrasol-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Process & Preview
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading || !processedData}
                  className="bg-indrasol-blue hover:bg-indrasol-darkblue text-white flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Publish Blog
                    </>
                  )}
                </Button>
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
                    <span>Only upload PDF or DOCX files</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Use well-formatted documents with clear headings and sections</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Ensure images in documents are high quality (min. 800×400px)</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Review the preview carefully before publishing to ensure proper formatting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manage">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-md p-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Blog Management</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Coming soon in the next update</p>
                <Button variant="outline" disabled className="mx-auto">
                  Manage Existing Blogs
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
            <DialogTitle className="text-xl font-semibold flex items-center">
              <Eye className="h-5 w-5 mr-2 text-indrasol-blue-600 dark:text-indrasol-darkblue-400" />
              Blog Post Preview
            </DialogTitle>
            <DialogDescription>
              Review how your blog post will appear on the Indrasol website
            </DialogDescription>
          </DialogHeader>
          
          <div 
            className="preview-container mt-4 prose prose-indrasol-blue dark:prose-invert max-w-none" 
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
          
          <DialogFooter className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 flex-row justify-between">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Back to Editing
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="bg-indrasol-blue hover:bg-indrasol-darkblue text-white"
            >
              {uploading ? 'Saving...' : 'Publish Blog Post'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;







// import { useState, useEffect } from 'react';
// import { supabase } from '../supabase';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/components/ui/use-toast';
// import * as pdfjsLib from 'pdfjs-dist';
// import mammoth from 'mammoth';
// import { GlobalWorkerOptions } from 'pdfjs-dist';
// import { generateBlogTemplate } from '../utils/BlogTemplateGenerator';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

// const Admin = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [title, setTitle] = useState('');
//   const [author, setAuthor] = useState('');
//   const [category, setCategory] = useState('');
//   const { toast } = useToast();

//   // Preview state
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewHtml, setPreviewHtml] = useState('');
//   const [processedData, setProcessedData] = useState<{
//     content: string;
//     title: string;
//     author: string;
//     category: string;
//     excerpt: string;
//     fileName: string;
//     images: any[];
//   } | null>(null);

//   // Set up PDF.js worker
//   useEffect(() => {
//     try {
//       // Configure PDF.js worker (this is crucial for PDF processing)
//       // Use a CDN-hosted worker file for reliability
//       const pdfjsVersion = pdfjsLib.version;
//       console.log("PDF.js version:", pdfjsVersion);
//       GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;
      
//       console.log("PDF.js worker configured successfully");
      
//       // Log current user for debugging authentication state
//       const checkAuth = async () => {
//         const { data } = await supabase.auth.getUser();
//         console.log("Current user:", data.user);
//         console.log("User metadata:", data.user?.app_metadata);
//       };
//       checkAuth();
//     } catch (err) {
//       console.error("Error configuring PDF.js worker:", err);
//     }
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) setFile(e.target.files[0]);
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//   };

//   const handleProcess = async () => {
//     if (!file || !title || !author || !category) {
//       toast({
//         title: "Error",
//         description: "Please provide title, author, category and a file",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Check file type
//     if (!file.name.match(/\.(pdf|docx)$/)) {
//       toast({
//         title: "Invalid file type",
//         description: "Please upload a PDF or Word document",
//         variant: "destructive",
//       });
//       return;
//     }

//     setProcessing(true);

//     try {
//       // Skip bucket verification and try to upload directly
//       console.log("Starting direct upload to blogs bucket");
      
//       // Upload to Supabase Storage - using 'blogs' bucket consistently
//       const fileName = `${Date.now()}-${file.name}`;
//       const { data, error } = await supabase.storage
//         .from('blogs')
//         .upload(`public/${fileName}`, file);

//       if (error) {
//         console.error("Upload error:", error);
//         throw new Error(`Storage upload failed: ${error.message}`);
//       }

//       console.log("File uploaded successfully:", data);

//       // Process the file but don't save to database yet
//       const processedResult = await processFile(fileName, title, author, category);
      
//       // Store the processed data for later use
//       setProcessedData(processedResult);
      
//       // Generate preview HTML
//       const previewHtml = generateBlogTemplate(
//         processedResult.content,
//         processedResult.title,
//         processedResult.author,
//         processedResult.category,
//         processedResult.excerpt,
//         processedResult.images
//       );
      
//       // Set the preview HTML and open the preview dialog
//       setPreviewHtml(previewHtml);
//       setPreviewOpen(true);
      
//       toast({
//         title: "Processing complete!",
//         description: "Preview ready. Review and confirm to save.",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Processing failed",
//         description: error.message || "An error occurred during processing",
//         variant: "destructive",
//       });
//       console.error("Processing error details:", error);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleUpload = async () => {
//     if (!processedData) {
//       toast({
//         title: "Error",
//         description: "No processed data available. Please process the file first.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setUploading(true);

//     try {
//       // Save the processed data to the database
//       await saveToDatabase(
//         processedData.content,
//         processedData.title,
//         processedData.author,
//         processedData.category,
//         processedData.excerpt,
//         processedData.fileName,
//         processedData.images
//       );

//       toast({
//         title: "Success!",
//         description: "Blog post saved successfully",
//       });

//       // Reset form and state
//       setFile(null);
//       setTitle('');
//       setAuthor('');
//       setCategory('');
//       setProcessedData(null);
//       setPreviewHtml('');
//       setPreviewOpen(false);
      
//       if (document.getElementById('file-upload') as HTMLInputElement) {
//         (document.getElementById('file-upload') as HTMLInputElement).value = '';
//       }
//     } catch (error: any) {
//       toast({
//         title: "Save failed",
//         description: error.message || "An error occurred during save",
//         variant: "destructive",
//       });
//       console.error("Save error details:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const processFile = async (fileName: string, title: string, author: string, category: string) => {
//     console.log(`Processing file: ${fileName}`);
    
//     try {
//       // Generate signed URL from the blogs bucket
//       const { data, error } = await supabase.storage
//         .from('blogs')
//         .createSignedUrl(`public/${fileName}`, 3600); // 1-hour expiration

//       if (error) {
//         console.error("Signed URL error:", error);
//         throw new Error(`Failed to generate signed URL: ${error.message}`);
//       }

//       if (!data?.signedUrl) {
//         throw new Error("No signed URL returned from Supabase");
//       }

//       console.log("Successfully generated signed URL");
//       const signedUrl = data.signedUrl;
      
//       let content = '';
//       let images = [];
      
//       try {
//         if (fileName.endsWith('.pdf')) {
//           console.log("Processing PDF document");
//           // Extract text and images from PDF
//           const result = await extractFromPdf(signedUrl);
//           content = result.text;
//           images = result.images;
//         } else if (fileName.endsWith('.docx')) {
//           console.log("Processing DOCX document");
//           // Extract text and images from DOCX
//           const result = await extractFromDocx(signedUrl);
//           content = result.text;
//           images = result.images;
//         }
        
//         console.log(`Extracted content length: ${content.length} characters`);
//         console.log(`Extracted ${images.length} images`);
//       } catch (err) {
//         console.error("Document processing error:", err);
//         throw new Error("Failed to process document: " + (err as Error).message);
//       }

//       // Create an excerpt from the content (first 200 characters)
//       const excerpt = content.substring(0, 200).trim() + '...';

//       // Return the processed data
//       return {
//         content,
//         title,
//         author, 
//         category,
//         excerpt,
//         fileName,
//         images
//       };
//     } catch (err) {
//       console.error("Process file error:", err);
//       throw err;
//     }
//   };

//   // PDF extraction function that handles both text and images
//   const extractFromPdf = async (url: string): Promise<{ text: string, images: any[] }> => {
//     const loadingTask = pdfjsLib.getDocument(url);
//     const pdf = await loadingTask.promise;
//     let fullText = '';
//     const images = [];
    
//     // Process each page
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
      
//       // Extract text
//       const textContent = await page.getTextContent();
//       fullText += textContent.items.map((item: any) => item.str).join(' ');
      
//       // Try to extract images (simplified approach)
//       try {
//         const operatorList = await page.getOperatorList();
//         for (let j = 0; j < operatorList.fnArray.length; j++) {
//           if (operatorList.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
//             const imgIndex = operatorList.argsArray[j][0];
//             // Store image reference for later use
//             images.push({
//               pageNum: i,
//               imgIndex: imgIndex,
//               placeholder: `/api/placeholder/800/400` // Use placeholder for now
//             });
//           }
//         }
//       } catch (err) {
//         console.log(`Error extracting images from page ${i}:`, err);
//       }
//     }
    
//     return { text: fullText, images };
//   };

//   // DOCX extraction function that handles both text and images
//   const extractFromDocx = async (url: string): Promise<{ text: string, images: any[] }> => {
//     const response = await fetch(url);
//     const arrayBuffer = await response.arrayBuffer();
    
//     // Extract text and references to images
//     const options = {
//       convertImage: mammoth.images.imgElement(function(image) {
//         // Return a Promise that resolves to the image attributes
//         return Promise.resolve({
//           src: `/api/placeholder/800/400` // Use placeholder for now
//         });
//       })
//     };
    
//     const result = await mammoth.convertToHtml({ arrayBuffer }, options);
//     const htmlContent = result.value;
    
//     // Extract text from the HTML
//     const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
//     // Find image references in the HTML
//     const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
//     const images = [];
//     let match;
    
//     while ((match = imgRegex.exec(htmlContent)) !== null) {
//       images.push({
//         src: match[1],
//         placeholder: match[1]
//       });
//     }
    
//     return { text, images };
//   };

//   const saveToDatabase = async (
//     content: string, 
//     title: string, 
//     author: string, 
//     category: string, 
//     excerpt: string, 
//     fileName: string, 
//     images: any[]
//   ) => {
//     // Create a slug from the title
//     const slug = title
//       .toLowerCase()
//       .replace(/[^\w\s]/gi, '')
//       .replace(/\s+/g, '-');

//     try {
//       // Log what we're trying to insert (for debugging)
//       console.log("Attempting to insert blog with data:", {
//         title,
//         slug,
//         excerpt: excerpt.substring(0, 30) + "...", // Truncate for readability
//         author,
//         category,
//         source_file: fileName
//       });

//       // Generate formatted blog content using the imported utility
//       const styledContent = generateBlogTemplate(content, title, author, category, excerpt, images);

//       // Save to Supabase database
//       const { data, error } = await supabase
//         .from('blogs')
//         .insert({ 
//           title: title,
//           content: styledContent,
//           slug: slug,
//           excerpt: excerpt,
//           author: author,
//           category: category,
//           source_file: fileName,
//           created_at: new Date().toISOString()
//         })
//         .select();

//       if (error) {
//         console.error("Database insert error:", {
//           code: error.code,
//           message: error.message,
//           details: error.details,
//           hint: error.hint
//         });
//         throw new Error(`Database error: ${error.message || error.details || 'Unknown error'}`);
//       }

//       console.log("Blog saved successfully:", data);
//     } catch (err: any) {
//       console.error("Save error:", {
//         name: err.name,
//         message: err.message,
//         stack: err.stack
//       });
//       throw new Error("Failed to save blog: " + (err.message || "Unknown error"));
//     }
//   };

//   // Add a test function to verify Supabase connection
//   const testSupabaseConnection = async () => {
//     try {
//       console.log("Testing Supabase connection...");
      
//       // Test authentication
//       const { data: authData, error: authError } = await supabase.auth.getSession();
//       console.log("Auth session:", authData);
//       if (authError) console.error("Auth error:", authError);
      
//       // Test storage
//       const { data: storageData, error: storageError } = await supabase.storage.listBuckets();
//       console.log("Storage buckets:", storageData);
//       if (storageError) console.error("Storage error:", storageError);
      
//       // Test database
//       const { data: dbData, error: dbError } = await supabase.from('blogs').select('count').limit(1);
//       console.log("Database response:", dbData);
//       if (dbError) console.error("Database error:", dbError);
      
//       toast({
//         title: "Connection Test",
//         description: "Check console for results",
//       });
//     } catch (err) {
//       console.error("Test failed:", err);
//       toast({
//         title: "Connection Test Failed",
//         description: "See console for details",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//         <div className="space-x-2">
//           <Button variant="outline" onClick={testSupabaseConnection}>
//             Test Connection
//           </Button>
//           <Button variant="outline" onClick={handleLogout}>
//             Logout
//           </Button>
//         </div>
//       </div>

//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>Upload Document</CardTitle>
//           <CardDescription>
//             Upload PDF or Word documents to create blog posts
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Blog Title</Label>
//               <Input
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Enter blog title"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="author">Author</Label>
//               <Input
//                 id="author"
//                 value={author}
//                 onChange={(e) => setAuthor(e.target.value)}
//                 placeholder="Enter author name"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="category">Category</Label>
//               <Input
//                 id="category"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 placeholder="Enter blog category"
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label htmlFor="file-upload">Document (PDF or DOCX)</Label>
//               <Input
//                 id="file-upload"
//                 type="file"
//                 accept=".pdf,.docx"
//                 onChange={handleFileChange}
//               />
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button 
//             variant="outline"
//             onClick={handleProcess} 
//             disabled={processing || !file || !title || !author || !category}
//           >
//             {processing ? 'Processing...' : 'Process & Preview'}
//           </Button>
          
//           <Button 
//             onClick={handleUpload} 
//             disabled={uploading || !processedData}
//           >
//             {uploading ? 'Saving...' : 'Save to Database'}
//           </Button>
//         </CardFooter>
//       </Card>
      
//       {/* Preview Dialog */}
//       <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
//         <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Blog Post Preview</DialogTitle>
//             <DialogDescription>
//               Review how your blog post will appear
//             </DialogDescription>
//           </DialogHeader>
          
//           <div 
//             className="preview-container mt-4" 
//             dangerouslySetInnerHTML={{ __html: previewHtml }}
//           />
          
//           <DialogFooter className="mt-4">
//             <Button variant="outline" onClick={() => setPreviewOpen(false)}>
//               Back to Editing
//             </Button>
//             <Button onClick={handleUpload} disabled={uploading}>
//               {uploading ? 'Saving...' : 'Save Blog Post'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Admin;

