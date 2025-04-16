
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white/95 shadow-sm fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/a0767fd7-b418-4f1f-a6cd-9450ec946277.png" 
            alt="Indrasol Logo" 
            className="h-12"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks className="text-gray-700 font-medium hover:text-indrasol-blue transition-colors" />
          <Link 
            to="/contact" 
            className="px-5 py-2 bg-indrasol-blue text-white rounded-md hover:bg-indrasol-darkblue transition-colors"
          >
            Contact Us
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 hover:text-indrasol-blue"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLinks className="block py-2 text-gray-700 hover:text-indrasol-blue transition-colors" />
            <Link 
              to="/contact" 
              className="block py-2 px-4 text-center bg-indrasol-blue text-white rounded-md hover:bg-indrasol-darkblue transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLinks({ className }: { className?: string }) {
  return (
    <>
      <Link to="/" className={cn(className)}>Home</Link>
      <Link to="/#services" className={cn(className)}>Services</Link>
      <Link to="/#technologies" className={cn(className)}>Technologies</Link>
      <Link to="/#products" className={cn(className)}>Products</Link>
      <Link to="/#about" className={cn(className)}>About Us</Link>
      <Link to="/#careers" className={cn(className)}>Careers</Link>
      <Link to="/#resources" className={cn(className)}>Resources</Link>
      <Link to="/#locations" className={cn(className)}>Locations</Link>
    </>
  );
}
