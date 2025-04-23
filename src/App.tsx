import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import AiSolutions from "./pages/services/AiSolutions";
import NotFound from "./pages/NotFound";
import { LocationsSection } from "./components/sections/locations-section";
import CloudEngineeringSecurity from "./pages/services/CloudEngineeringSecurity";
import ApplicationSecurity from "./pages/services/ApplicationSecurity";
import DataEngineering from "./pages/services/DataEngineering";
import Company from "./pages/Aboutus/company";
import BizRadarProductPage from "./pages/Products/BizRadarProductPage";
import SecureTrackProductPage from "./pages/Products/SecureTrackProductPage";


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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
