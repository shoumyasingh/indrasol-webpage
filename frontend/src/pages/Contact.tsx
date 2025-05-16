
import React from "react";
import { Navbar } from "@/components/ui/navbar";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-28 pb-16 bg-indrasol-gray">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-indrasol-blue hover:text-indrasol-darkblue mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-lg text-gray-700 mt-4 max-w-2xl">
            Ready to transform your business with our expertise? Reach out to our team to discuss how we can help your organization achieve its technology goals.
          </p>
        </div>
      </div>
      <main className="flex-grow">
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Contact;
