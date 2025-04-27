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


// Create a wrapper component that gets the slug parameter
function BlogDetailWrapper() {
  const { slug } = useParams();
  return <BlogDetailPage slug={slug} />;
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
          {/* <Route path="/Resources/whitepaper" element={<WhitePaperSection />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
