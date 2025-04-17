import React, { useState } from "react";
import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";

const locations = [
  {
    city: "San Ramon",
    country: "USA",
    address: "San Ramon, California",
    isHeadquarters: true,
    phone: "+1 (510) 123-4567",
    email: "info@indrasol.com",
    mapLink: "https://maps.google.com/?q=San+Ramon,+California",
    flag: "🇺🇸"
  },
  {
    city: "Singapore",
    country: "Singapore",
    address: "Singapore Business District",
    isHeadquarters: false,
    phone: "+65 1234 5678",
    email: "singapore@indrasol.com",
    mapLink: "https://maps.google.com/?q=Singapore+Business+District",
    flag: "🇸🇬"
  },
  {
    city: "Bangalore",
    country: "India",
    address: "Bangalore, Karnataka",
    isHeadquarters: false,
    phone: "+91 1234 567890",
    email: "india@indrasol.com",
    mapLink: "https://maps.google.com/?q=Bangalore,+Karnataka,+India",
    flag: "🇮🇳"
  }
];

export function LocationsSection() {
  const [activeLocation, setActiveLocation] = useState<number>(0);

  return (
    <section id="locations" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-indrasol-gray/20"></div>
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-indrasol-blue/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-indrasol-orange/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-indrasol-blue font-semibold mb-2 bg-indrasol-blue/10 px-4 py-1 rounded-full">Worldwide</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">Our Global </span>
            <span className="text-indrasol-blue">Presence</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            With offices across three continents, we serve clients worldwide with localized expertise and global capabilities.
          </p>
        </div>
        
        {/* Location Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {locations.map((location, index) => (
            <button
              key={index}
              onClick={() => setActiveLocation(index)}
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center text-lg ${
                activeLocation === index 
                  ? "bg-indrasol-blue text-white shadow-lg shadow-indrasol-blue/20" 
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span className="mr-2 text-xl">{location.flag}</span>
              {location.city}
            </button>
          ))}
        </div>
        
        {/* Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <div 
              key={index} 
              className={`transform transition-all duration-500 ${
                activeLocation === index 
                  ? "scale-105 z-10" 
                  : "scale-95 opacity-70"
              }`}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full flex flex-col">
                {/* Map Preview (Placeholder - would be replaced with actual map) */}
                <div className="h-48 bg-indrasol-blue/10 relative">
                  <div className="absolute inset-0 bg-indrasol-blue/5 flex items-center justify-center">
                    <Globe className="h-16 w-16 text-indrasol-blue/30" strokeWidth={1} />
                  </div>
                  <a 
                    href={location.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ExternalLink className="h-5 w-5 text-indrasol-blue" />
                  </a>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-start mb-6 justify-between">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-indrasol-blue mr-3 mt-1 flex-shrink-0" strokeWidth={2} />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center flex-wrap">
                          {location.city}, {location.country}
                        </h3>
                        <p className="text-gray-600 mt-1">{location.address}</p>
                      </div>
                    </div>
                    
                    {location.isHeadquarters && (
                      <span className="ml-2 text-xs bg-indrasol-blue text-white px-3 py-1 rounded-full font-medium">
                        Headquarters
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-4 mt-auto">
                    <a 
                      href={`tel:${location.phone}`} 
                      className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="p-2 bg-indrasol-blue/10 rounded-lg mr-3 group-hover:bg-indrasol-blue/20 transition-colors">
                        <Phone className="h-5 w-5 text-indrasol-blue" strokeWidth={2} />
                      </div>
                      <span className="text-gray-700 group-hover:text-indrasol-blue transition-colors">
                        {location.phone}
                      </span>
                    </a>
                    
                    <a 
                      href={`mailto:${location.email}`} 
                      className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="p-2 bg-indrasol-blue/10 rounded-lg mr-3 group-hover:bg-indrasol-blue/20 transition-colors">
                        <Mail className="h-5 w-5 text-indrasol-blue" strokeWidth={2} />
                      </div>
                      <span className="text-gray-700 group-hover:text-indrasol-blue transition-colors">
                        {location.email}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a 
            href="/contact" 
            className="inline-flex items-center bg-indrasol-blue text-white font-medium px-8 py-3 rounded-xl shadow-lg shadow-indrasol-blue/20 hover:bg-indrasol-blue/90 transition-colors"
          >
            Get in touch with us
          </a>
        </div>
      </div>
    </section>
  );
}