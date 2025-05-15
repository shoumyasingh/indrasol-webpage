import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import AiSolutions from "./pages/services/AiSolutions";
import NotFound from "./pages/NotFound";
import { LocationsSection } from "./components/sections/locations-section";
import CloudEngineeringSecurity from "./pages/services/CloudEngineeringSecurity";
import ApplicationSecurity from "./pages/services/ApplicationSecurity";
import DataEngineering from "./pages/services/DataEngineering";
import Company from "./pages/Aboutus/Company";
import BizRadarProductPage from "./pages/Products/BizRadarProductPage";
import SecureTrackProductPage from "./pages/Products/SecureTrackProductPage";
import BlogPage from "./pages/Resources/BlogPage";
import WhitePaperSection from "./pages/Resources/WhitePaperSection";
import BlogPageSection from "./pages/Resources/BlogPageSection";
import CyberBlogDetailPage from "./pages/Resources/BlogPageSection";
// import { BlogPost } from "./cyber-risk-management/BlogPageSection";
import BlogDetailPage from "./components/blog/cyber-risk-management";
// Import the whitepaper detail component
import WhitePaper1 from "./components/whitepaper/ai-augmented-pen-testing";
// Import WhitePaperDetailPage component from WhitePaperSection
import { WhitePaperDetailPage } from "./pages/Resources/WhitePaperSection";

// Import Admin component and Protected Route component
import Admin from "./pages/Admin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// Create a wrapper component that gets the slug parameter for blog
function BlogDetailWrapper() {
  const { slug } = useParams();
  return <BlogDetailPage slug={slug} />;
}

// Create a wrapper component for whitepaper detail page
function WhitePaperDetailWrapper() {
  const { slug } = useParams();
  return <WhitePaperDetailPage slug={slug} />;
}

// Create a wrapper to handle specific whitepaper routes
function WhitePaperRouter() {
  const { slug } = useParams();
  
  // You can create a mapping of slugs to specific components if needed
  if (slug === "ai-augmented-penetration-testing") {
    return <WhitePaper1 />;
  }
  
  // Default to the generic detail page
  return <WhitePaperDetailPage slug={slug} />;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/company" element={<Company />} />
          <Route path="/locations" element={<LocationsSection />} />
          <Route path="/services/aisolutions" element={<AiSolutions />} />
          <Route path="/services/cloud-engineering" element={<CloudEngineeringSecurity />} />
          <Route path="/services/application-security" element={<ApplicationSecurity />} />
          <Route path="/services/data-engineering" element={<DataEngineering />} />
          <Route path="/Products/Bizradar" element={<BizRadarProductPage />} />
          <Route path="/Products/Securetrack" element={<SecureTrackProductPage />} />
          {/* <Route path="/Resources/blogs" element={<BlogPage />} /> */}
          <Route path="/Resources/blogs2" element={<BlogPageSection />} />
          <Route path="/blog/:slug" element={<BlogDetailWrapper />} />
          
          {/* Whitepaper routes */}
          <Route path="/Resources/whitepaper" element={<WhitePaperSection />} />
          <Route path="/components/whitepaper/:slug" element={<WhitePaperRouter />} />
          
          {/* Protected Admin Route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;