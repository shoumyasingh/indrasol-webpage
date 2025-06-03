import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#367ABB] text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Top section with logo and company info */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          <div className="max-w-sm mb-8 md:mb-0">
            <img
              src="/lovable-uploads/Indrasol company logo_.png"
              alt="Indrasol Logo"
              className="h-12 mb-4"
            />
            <p className="text-white/80 text-sm leading-relaxed">
              A global provider of consulting, implementation, and support services for Oracle solutions, cloud platforms, and data analytics.
            </p>
            <div className="flex space-x-4 mt-6">
              {/* Social media icons */}
              <a href="https://www.youtube.com/@IndrasolTech" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#FF0000] rounded-full hover:scale-110 hover:shadow-lg transition-all duration-200">
                <svg className="h-4 w-4" fill="white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="https://x.com/theindrasol" target="_blank" rel="noopener noreferrer" className="p-2 bg-black rounded-full hover:scale-110 hover:shadow-lg transition-all duration-200">
                <svg className="h-4 w-4" fill="white" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/indrasol" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#0077B5] rounded-full hover:scale-110 hover:shadow-lg transition-all duration-200">
                <svg className="h-4 w-4" fill="white" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact information section */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#D5844C] mr-2 mt-0.5" />
                <span className="text-white/80">6101 Bollinger canyon Rd, suite 335 C, <br />San Ramon, CA 94583</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-[#D5844C] mr-2" />
                <span className="text-white/80">+1 (510) 754 2001</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-[#D5844C] mr-2" />
                <span className="text-white/80">sales@indrasol.com</span>
              </li>
            </ul>
          </div>

          {/* Quick Links section */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
              <ul className="space-y-2">
                <li><Link to="/services/aisolutions" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">AI Solutions & Security</Link></li>
                <li><Link to="/services/cloud-engineering" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Cloud Engineering & Security</Link></li>
                <li><Link to="/services/application-security" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Application Security & Compliance</Link></li>
                <li><Link to="/services/data-engineering" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Data Engineering & Security</Link></li>

              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/#about" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">About Us</Link></li>
                <li><Link to="/#locations" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Locations</Link></li>
                <li><Link to="https://www.linkedin.com/company/indrasol/" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Contact</Link></li>
                <li><a href="#" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Careers</a></li>
              </ul>
            </div>
          </div>
        </div>


        {/* Bottom copyright section */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#9FA1A1] text-sm">
            &copy; {new Date().getFullYear()} Indrasol. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-[#9FA1A1] hover:text-[#D5844C] transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-[#9FA1A1] hover:text-[#D5844C] transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-[#9FA1A1] hover:text-[#D5844C] transition-colors text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}