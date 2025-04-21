import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { AIHeroSection } from "@/components/services-ai/ai-herosection";
import { AboutSection } from "@/components/sections/about-section";
import { LocationsSection } from "@/components/sections/locations-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ChatBot } from "@/components/ui/chatbot";
import PartnersSection from "@/components/sections/partners-section";
import AIAfterHeroSection from "@/components/services-ai/ai-afterherosection";

// Assuming we would create these AI-specific components
// import { AICaseStudiesSection } from "@/components/sections/ai-case-studies-section";
// import { AICapabilitiesSection } from "@/components/sections/ai-capabilities-section";
// import { AISecuritySection } from "@/components/sections/ai-security-section";

const AISolutions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section specifically for AI Solutions */}
        <AIHeroSection />
        <AIAfterHeroSection />
        
        {/* Section showcasing AI capabilities */}
        {/* <AICapabilitiesSection />
         */}
        {/* Section highlighting security aspects of AI solutions */}
        {/* <AISecuritySection /> */}
        
        {/* Case studies specific to AI implementations */}
        {/* <AICaseStudiesSection />
         */}
        {/* Partner section - showing technology partners for AI */}
        {/* <PartnersSection /> */}
        
        {/* About section - company information */}
        {/* <AboutSection /> */}
        
        {/* Locations section - where we operate */}
        {/* <LocationsSection /> */}
        
        {/* Contact section - for inquiries */}
        {/* <ContactSection /> */}
      </main>
      <Footer />
      <BackToTop />
      <ChatBot />
    </div>
  );
};

export default AISolutions;