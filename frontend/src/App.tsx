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
import Services from "./pages/Services";
import Products from "./pages/Products";

import BizRadarProductPage from "./pages/Products/BizRadarProductPage";
import SecureTrackProductPage from "./pages/Products/SecureTrackProductPage";
import BlogPage from "./pages/Resources/BlogPage";
import WhitePaperSection from "./pages/Resources/WhitePaperSection";
import BlogPageSection from "./pages/Resources/BlogPageSection";
import BlogDetailPage from "./pages/Resources/BlogDetailPage";
// Import the whitepaper detail component
import WhitePaper1 from "./components/whitepaper/ai-augmented-pen-testing";
// Import the new standalone WhitepaperDetailPage component
import WhitepaperDetailPage from "./pages/Resources/WhitepaperDetailPage";


// Import Admin component and Protected Route component
import Admin from "./pages/Admin";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// Create a wrapper component for whitepaper detail page (using the new component)
function WhitePaperDetailWrapper() {
  const { slug } = useParams();
  return <WhitepaperDetailPage />;
}

// Create a wrapper to handle specific whitepaper routes
function WhitePaperRouter() {
  const { slug } = useParams();
  
  // You can create a mapping of slugs to specific components if needed
  if (slug === "ai-augmented-penetration-testing") {
    return <WhitePaper1 />;
  }
  
  // Use the new standalone WhitepaperDetailPage instead of the one from WhitePaperSection
  return <WhitepaperDetailPage />;
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
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services/aisolutions" element={<AiSolutions />} />
          <Route path="/services/cloud-engineering" element={<CloudEngineeringSecurity />} />
          <Route path="/services/application-security" element={<ApplicationSecurity />} />
          <Route path="/services/data-engineering" element={<DataEngineering />} />
          <Route path="/Products/Bizradar" element={<BizRadarProductPage />} />
          <Route path="/Products/Securetrack" element={<SecureTrackProductPage />} />
        
          {/* <Route path="/Resources/blogs" element={<BlogPage />} /> */}
          <Route path="/Resources/blogs2" element={<BlogPageSection />} />
          <Route path="/Resources/blog/:slug" element={<BlogDetailPage />} />
          
          {/* Whitepaper routes */}
          <Route path="/Resources/whitepaper" element={<WhitePaperSection />} />
          <Route path="/resources/whitepaper/:slug" element={<WhitePaperRouter />} />
          
          {/* Legacy route for backward compatibility */}
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