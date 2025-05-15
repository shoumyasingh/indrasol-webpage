import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { AIHeroSection } from "@/components/services-ai/ai-herosection";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ChatBot } from "@/components/ui/chatbot";
import AIAfterHeroSection from "@/components/services-ai/ai-afterherosection";

const AISolutions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section specifically for AI Solutions */}
        <AIHeroSection />
         {/* Section showcasing AI capabilities */}
        <AIAfterHeroSection />
        
      </main>
      <Footer />
      <BackToTop />
      <ChatBot />
    </div>
  );
};

export default AISolutions;