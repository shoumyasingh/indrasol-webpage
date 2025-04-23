import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { LocationsSection } from "@/components/sections/locations-section";

const Location = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <LocationsSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Location;
