
import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/a0767fd7-b418-4f1f-a6cd-9450ec946277.png" 
              alt="Indrasol Logo" 
              className="h-12 invert"
            />
            <p className="text-gray-400">
              A global provider of consulting, implementation, and support services for Oracle solutions, cloud platforms, and data analytics.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/#services" className="text-gray-400 hover:text-white transition-colors">Oracle Solutions</Link></li>
              <li><Link to="/#services" className="text-gray-400 hover:text-white transition-colors">Cloud Consulting</Link></li>
              <li><Link to="/#services" className="text-gray-400 hover:text-white transition-colors">Data Analytics</Link></li>
              <li><Link to="/#services" className="text-gray-400 hover:text-white transition-colors">Business Intelligence</Link></li>
              <li><Link to="/#services" className="text-gray-400 hover:text-white transition-colors">Cyber Security</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/#about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/#locations" className="text-gray-400 hover:text-white transition-colors">Locations</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Business Units</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.hyperion.support" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center"
                >
                  Hyperion Support <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.peoplesoft-support.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors inline-flex items-center"
                >
                  PeopleSoft Support <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cyber Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Indrasol. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
