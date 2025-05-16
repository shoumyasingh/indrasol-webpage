import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { AppHeroSection } from "@/components/services-ai/app-herosection";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ChatBot } from "@/components/ui/chatbot";
import AppAfterHeroSection from "@/components/services-ai/app-afterherosection";

const ApplicationSecurity = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section specifically for Application Security */}
        <AppHeroSection />
        {/* Section showcasing Application Security capabilities */}
        <AppAfterHeroSection /> 
      </main>
      <Footer />
      <BackToTop />
      <ChatBot />
    </div>
  );
};

export default ApplicationSecurity;