
import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { AboutSection } from "@/components/sections/about-section";

const Company = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <AboutSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Company;
