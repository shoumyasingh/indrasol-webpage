
import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const locations = [
  {
    city: "San Ramon",
    country: "USA",
    address: "San Ramon, California",
    isHeadquarters: true,
    phone: "+1 (510) 123-4567",
    email: "info@indrasol.com"
  },
  {
    city: "Singapore",
    country: "Singapore",
    address: "Singapore Business District",
    isHeadquarters: false,
    phone: "+65 1234 5678",
    email: "singapore@indrasol.com"
  },
  {
    city: "Bangalore",
    country: "India",
    address: "Bangalore, Karnataka",
    isHeadquarters: false,
    phone: "+91 1234 567890",
    email: "india@indrasol.com"
  }
];

export function LocationsSection() {
  return (
    <section id="locations" className="py-16 md:py-24 bg-indrasol-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Global Presence</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            With offices across three continents, we serve clients worldwide with localized expertise and global capabilities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <div className="flex items-start mb-4">
                <MapPin className="h-6 w-6 text-indrasol-blue mr-2 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {location.city}, {location.country}
                    {location.isHeadquarters && (
                      <span className="ml-2 text-xs bg-indrasol-blue text-white px-2 py-1 rounded">Headquarters</span>
                    )}
                  </h3>
                  <p className="text-gray-700 mt-1">{location.address}</p>
                </div>
              </div>
              
              <div className="space-y-3 pl-8">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-indrasol-blue mr-2" />
                  <a href={`tel:${location.phone}`} className="text-gray-700 hover:text-indrasol-blue">
                    {location.phone}
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-indrasol-blue mr-2" />
                  <a href={`mailto:${location.email}`} className="text-gray-700 hover:text-indrasol-blue">
                    {location.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
