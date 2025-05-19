import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ChatBot } from "@/components/ui/chatbot";
import DataAfterHeroSection from "@/components/services-ai/data-afterherosection";
import DataHeroSection from "@/components/services-ai/data-herosection";


const DataEngineering = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section specifically for Data Engineering */}
        <DataHeroSection />
        {/* Section showcasing Data Engineering capabilities */}
        <DataAfterHeroSection />
      </main>
      <Footer />
      <BackToTop />
      <ChatBot />
    </div>
  );
};

export default DataEngineering;