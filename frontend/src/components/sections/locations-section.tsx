import React, { useState } from "react";
import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";

const locations = [
  {
    city: "San Ramon",
    country: "USA",
    address: "6101 Bollinger canyon Rd, suite 335 C, San Ramon, California 94583",
    isHeadquarters: true,
    phone: "+1 (510) 754 2001",
    email: "sales@indrasol.com",
    mapLink: "https://www.google.com/maps/place/6101+Bollinger+Canyon+Rd+suite+335+C,+San+Ramon,+CA+94583,+USA/@37.7597674,-121.9584625,655m/data=!3m2!1e3!4b1!4m6!3m5!1s0x808fed7d76100001:0x80d9a02c84cc6cc1!8m2!3d37.7597632!4d-121.9558876!16s%2Fg%2F11sy74klzp?entry=ttu&g_ep=EgoyMDI1MDYwMS4wIKXMDSoASAFQAw%3D%3Dhttps://maps.google.com/?q=San+Ramon,+California",
    flag: "🇺🇸",
    img_url: "/locations/San_Ramon_USA.png",
  },
  {
    city: "Singapore",
    country: "Singapore",
    address: "The Adelphi,1 Coleman Street, #05-14, Singapore 179803",
    isHeadquarters: false,
    phone: " +65 90267032",
    email: "sales@indrasol.com",
    mapLink: "https://www.google.com/maps/place/The+Adelphi/@1.2911899,103.8486418,829m/data=!3m3!1e3!4b1!5s0x31da190a6a7e722b:0x356b15a7d5d6fa4c!4m6!3m5!1s0x31da19a728e85ce3:0x33f3d7270d0f9c68!8m2!3d1.2911845!4d103.8512167!16s%2Fg%2F11f_4rltdr?entry=ttu&g_ep=EgoyMDI1MDYwMS4wIKXMDSoASAFQAw%3D%3Dhttps://maps.google.com/?q=Singapore+Business+District",
    flag: "🇸🇬",
    img_url: "/locations/Singapore.png",
  },
  {
    city: "Hyderabad",
    country: "India",
    address: "814, Manjeera Trinity Corporate, JNTU Road, Kukatpally, Hyderabad, TS, 500 075",
    isHeadquarters: false,
    phone: " +91 9966636305",
    email: "sales@indrasol.com",
    mapLink: "https://www.google.com/maps/place/Indrasol/@17.4893133,78.3901066,936m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bcb91f27b5c1195:0xc97b9e2d12234798!8m2!3d17.4893082!4d78.3926815!16s%2Fg%2F11fkw7t_9g?entry=ttu&g_ep=EgoyMDI1MDQxNC4xIKXMDSoASAFQAw%3D%3Dhttps://www.google.com/maps/search/814,+Manjeera+Trinity+Corporate,+JNTU+Road,+Kukatpally,+Hyderabad,+TS,+500+075/@17.4911278,78.3908007,468m/data=!3m2!1e3!4b1?entry=ttu&g_ep=EgoyMDI1MDQxNC4xIKXMDSoASAFQAw%3D%3D",
    flag: "🇮🇳",
    img_url: "/locations/Hyderabad_India.png",
  },
  {
    city: "Mexico City",
    country: "Mexico",
    address: "Av Independencia 89-7 col. Amomolulco Lerma Estado de Mèxico c.p. 52005",
    isHeadquarters: false,
    phone: "+1 (510) 754 2001",
    email: "sales@indrasol.com",
    mapLink: "https://maps.google.com/?q=Paseo+de+la+Reforma+222+Mexico+City",
    flag: "🇲🇽",
    img_url: "/locations/Mexico.png",
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
        <div className="text-center mb-12">
          <span className="inline-block text-indrasol-blue font-semibold mb-2 bg-indrasol-blue/10 px-4 py-1 rounded-full">Worldwide</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">Our Global </span>
            <span className="text-indrasol-blue">Presence</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            With offices across three continents, we serve clients worldwide with localized expertise and global capabilities.
          </p>
        </div>

        {/* World Map */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative">
            <img
              src="/lovable-uploads/worldmap.png"
              alt="Indrasol Global Offices"
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Location Tabs */}
        {/* <div className="flex flex-wrap justify-center gap-3 mb-10">
          {locations.map((location, index) => (
            <button
              key={index}
              onMouseOver={() => setActiveLocation(index)}
              className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center text-base ${
                activeLocation === index 
                  ? "bg-indrasol-blue text-white shadow-md shadow-indrasol-blue/20" 
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span className="mr-2">{location.flag}</span>
              {location.city}
            </button>
          ))}
        </div> */}

        {/* Location Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className="transform transition-all duration-500 hover:scale-105 hover:z-150 hover:shadow-lg"
            //   activeLocation === index 
            //     ? "scale-105 z-10" 
            //     : "scale-95 opacity-70"
            // }`}
            >
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-full flex flex-col">
                {/* Map Preview (Placeholder - would be replaced with actual map) */}
                <div className="h-36 bg-indrasol-blue/10 relative">
                  <a
                    href={location.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=""
                  >
                    <div className="">
                      <div className="absolute inset-0 bg-indrasol-blue/5 flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:z-100 hover:shadow-lg">
                        {/* <Globe className="h-12 w-12 text-indrasol-blue/30" strokeWidth={1} /> */}

                        <img
                          src={location.img_url}
                          alt={location.address}
                          className="w-full h-auto rounded-xl shadow-lg"
                        />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white p-1.5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <ExternalLink className="h-4 w-4 text-indrasol-blue" />
                      </div>
                    </div>
                  </a>
                </div>

                <div className="p-4 mt-6 flex-grow flex flex-col">
                  <div className="flex items-start mb-4 justify-between">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-indrasol-blue mr-2 mt-1 flex-shrink-0" strokeWidth={2} />
                      <div>
                        <h3 className="text-lg font-bold text-block-900 flex items-center flex-wrap">
                          {location.city}, {location.country}
                        </h3>
                        <p className="text-sm text-block-700 mt-1">{location.address}</p>
                      </div>
                    </div>

                    {location.isHeadquarters && (
                      <span className="ml-1 text-xs bg-indrasol-blue text-white px-2 py-0.5 rounded-full font-medium">
                        HQ
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mt-auto">
                    <a
                      href={`tel:${location.phone}`}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="p-1.5 bg-indrasol-blue/10 rounded-lg mr-2 group-hover:bg-indrasol-blue/20 transition-colors">
                        <Phone className="h-4 w-4 text-indrasol-blue" strokeWidth={2} />
                      </div>
                      <span className="text-sm text-block-700 group-hover:text-indrasol-blue transition-colors">
                        {location.phone}
                      </span>
                    </a>

                    <a
                      href={`mailto:${location.email}`}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="p-1.5 bg-indrasol-blue/10 rounded-lg mr-2 group-hover:bg-indrasol-blue/20 transition-colors">
                        <Mail className="h-4 w-4 text-indrasol-blue" strokeWidth={2} />
                      </div>
                      <span className="text-sm text-block-700 group-hover:text-indrasol-blue transition-colors">
                        {location.email}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/contact"
            className="inline-flex items-center bg-indrasol-blue text-white font-medium px-6 py-2.5 rounded-xl shadow-lg shadow-indrasol-blue/20 hover:bg-indrasol-blue/90 transition-colors"
          >
            Get in touch with us
          </a>
        </div>
      </div>
    </section >
  );
}

