import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { AboutSection } from "@/components/sections/about-section";
import { BusinessUnitsSection } from "@/components/sections/business-units-section";
import { LocationsSection } from "@/components/sections/locations-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ClientsSection } from "@/components/sections/clients-section";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ChatBot } from "../components/ui/chatbot"; // Update the import path to the correct location
import PartnersSection from "@/components/sections/partners-section";
import AfterHeroSection from "@/components/sections/afterhero-section";
import TestimonialsSection from "@/components/sections/testimonials-section";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AfterHeroSection/>
        <ClientsSection />
        {/* <ServicesSection /> */}
        <AboutSection />
        <PartnersSection />
        {/* <BusinessUnitsSection /> */}
        <LocationsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop /> 
      <ChatBot /> {/* Add the ChatBot component here */}
    </div>
  );
};

export default Index;