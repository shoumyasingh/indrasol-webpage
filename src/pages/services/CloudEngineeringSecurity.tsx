import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ChatBot } from "@/components/ui/chatbot";
import CloudHeroSection from "@/components/services-ai/cloud-herosection";
import CloudAfterHeroSection from "@/components/services-ai/cloud-afterherosection";

const CloudEngineeringSecurity = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section specifically for Data Engineering */}
        <CloudHeroSection />
        {/* Section showcasing Data Engineering capabilities */}
        <CloudAfterHeroSection />
      </main>
      <Footer />
      <BackToTop />
      <ChatBot />
    </div>
  );
};

export default CloudEngineeringSecurity;




























