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
              src="/lovable-uploads/a0767fd7-b418-4f1f-a6cd-9450ec946277.png" 
              alt="Indrasol Logo" 
              className="h-12 mb-4"
            />
            <p className="text-white/80 text-sm leading-relaxed">
              A global provider of consulting, implementation, and support services for Oracle solutions, cloud platforms, and data analytics.
            </p>
            <div className="flex space-x-4 mt-6">
              {/* Social media icons */}
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#D5844C] transition-colors">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#D5844C] transition-colors">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14v-.639c.962-.689 1.8-1.56 2.46-2.548l-.047-.02z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#D5844C] transition-colors">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
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
                <span className="text-white/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-[#D5844C] mr-2" />
                <span className="text-white/80">info@indrasol.com</span>
              </li>
            </ul>
          </div>
          
          {/* Quick Links section */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
              <ul className="space-y-2">
                <li><Link to="/#services" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Oracle Solutions</Link></li>
                <li><Link to="/#services" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Cloud Consulting</Link></li>
                <li><Link to="/#services" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Data Analytics</Link></li>
                <li><Link to="/#services" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Business Intelligence</Link></li>
                <li><Link to="/#services" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Cyber Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/#about" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">About Us</Link></li>
                <li><Link to="/#locations" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Locations</Link></li>
                <li><Link to="/contact" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Contact</Link></li>
                <li><a href="#" className="text-white/80 hover:text-[#D5844C] transition-colors block py-1">Careers</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Business Units section */}
        <div className="border-t border-white/20 pt-8 pb-4">
          <h3 className="text-lg font-semibold mb-4 text-white">Business Units</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <a 
              href="https://www.hyperion.support" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 bg-white/10 rounded-lg hover:bg-[#D5844C]/20 transition-all group"
            >
              <span className="text-white group-hover:text-[#D5844C]">Hyperion Support</span>
              <ExternalLink className="ml-2 h-4 w-4 text-white/60 group-hover:text-[#D5844C]" />
            </a>
            <a 
              href="https://www.peoplesoft-support.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 bg-white/10 rounded-lg hover:bg-[#D5844C]/20 transition-all group"
            >
              <span className="text-white group-hover:text-[#D5844C]">PeopleSoft Support</span>
              <ExternalLink className="ml-2 h-4 w-4 text-white/60 group-hover:text-[#D5844C]" />
            </a>
            <a 
              href="#" 
              className="flex items-center px-4 py-3 bg-white/10 rounded-lg hover:bg-[#D5844C]/20 transition-all group"
            >
              <span className="text-white group-hover:text-[#D5844C]">Cyber Security</span>
            </a>
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