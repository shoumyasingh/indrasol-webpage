import React, { useState } from "react";
import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";

const locations = [
  {
    city: "San Ramon",
    country: "USA",
    address: "6101 Bollinger canyon Rd, suite 335 C, San Ramon, California 94583",
    isHeadquarters: true,
    phone: "+1 (510) 123-4567",
    email: "info@indrasol.com",
    mapLink: "https://maps.google.com/?q=San+Ramon,+California",
    flag: "🇺🇸"
  },
  {
    city: "Singapore",
    country: "Singapore",
    address: "The Adelphi,1 Coleman Street, #05-14, Singapore 179803",
    isHeadquarters: false,
    phone: "+65 1234 5678",
    email: "singapore@indrasol.com",
    mapLink: "https://maps.google.com/?q=Singapore+Business+District",
    flag: "🇸🇬"
  },
  {
    city: "Hyderabad",
    country: "India",
    address: "814, Manjeera Trinity Corporate, JNTU Road, Kukatpally, Hyderabad, TS, 500 075",
    isHeadquarters: false,
    phone: "+91 1234 567890",
    email: "india@indrasol.com",
    mapLink: "https://www.google.com/maps/place/Indrasol/@17.4893133,78.3901066,936m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bcb91f27b5c1195:0xc97b9e2d12234798!8m2!3d17.4893082!4d78.3926815!16s%2Fg%2F11fkw7t_9g?entry=ttu&g_ep=EgoyMDI1MDQxNC4xIKXMDSoASAFQAw%3D%3Dhttps://www.google.com/maps/search/814,+Manjeera+Trinity+Corporate,+JNTU+Road,+Kukatpally,+Hyderabad,+TS,+500+075/@17.4911278,78.3908007,468m/data=!3m2!1e3!4b1?entry=ttu&g_ep=EgoyMDI1MDQxNC4xIKXMDSoASAFQAw%3D%3D",
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


// import React, { useState } from "react";
// import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";

// // Map component imports
// import GoogleMapReact from 'google-map-react';

// // Location Pin Component
// const LocationMarker = ({ text }) => (
//   <div className="absolute transform -translate-x-1/2 -translate-y-full">
//     <div className="flex flex-col items-center">
//       <div className="relative">
//         <MapPin className="h-8 w-8 text-indrasol-blue" strokeWidth={2} fill="#ffffff" />
//         <div className="absolute h-3 w-3 bg-indrasol-blue rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
//       </div>
//       <div className="bg-white text-indrasol-blue px-2 py-1 rounded-lg shadow-md text-sm font-medium -mt-1">
//         {text}
//       </div>
//     </div>
//   </div>
// );

// // SimpleMap Component
// const SimpleMap = ({ location }) => {
//   // Extract coordinates from the mapLink or use default coordinates
//   let defaultCoordinates = { lat: 0, lng: 0 };
  
//   // Parse coordinates from the locations data
//   if (location.city === "San Ramon") {
//     defaultCoordinates = { lat: 37.767399, lng: -121.963783 };
//   } else if (location.city === "Singapore") {
//     defaultCoordinates = { lat: 1.290270, lng: 103.852547 };
//   } else if (location.city === "Hyderabad") {
//     defaultCoordinates = { lat: 17.489308, lng: 78.392682 };
//   }
  
//   const defaultProps = {
//     center: defaultCoordinates,
//     zoom: 14
//   };

//   return (
//     <div className="h-48 w-full">
//       <GoogleMapReact
//         bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "" }}
//         defaultCenter={defaultProps.center}
//         defaultZoom={defaultProps.zoom}
//         options={{
//           fullscreenControl: false,
//           zoomControl: false,
//           mapTypeControl: false,
//           streetViewControl: false,
//           styles: [
//             {
//               featureType: "all",
//               elementType: "labels.text.fill",
//               stylers: [{ color: "#6c7686" }]
//             },
//             {
//               featureType: "water",
//               elementType: "geometry",
//               stylers: [{ color: "#e9e9e9" }]
//             }
//           ]
//         }}
//       >
//         <LocationMarker
//           lat={defaultProps.center.lat}
//           lng={defaultProps.center.lng}
//           text={location.city}
//         />
//       </GoogleMapReact>
//     </div>
//   );
// };

// const locations = [
//   {
//     city: "San Ramon",
//     country: "USA",
//     address: "6101 Bollinger canyon Rd, suite 335 C, San Ramon, California 94583",
//     isHeadquarters: true,
//     phone: "+1 (510) 123-4567",
//     email: "info@indrasol.com",
//     mapLink: "https://maps.google.com/?q=San+Ramon,+California",
//     flag: "🇺🇸"
//   },
//   {
//     city: "Singapore",
//     country: "Singapore",
//     address: "The Adelphi,1 Coleman Street, #05-14, Singapore 179803",
//     isHeadquarters: false,
//     phone: "+65 1234 5678",
//     email: "singapore@indrasol.com",
//     mapLink: "https://maps.google.com/?q=Singapore+Business+District",
//     flag: "🇸🇬"
//   },
//   {
//     city: "Hyderabad",
//     country: "India",
//     address: "814, Manjeera Trinity Corporate, JNTU Road, Kukatpally, Hyderabad, TS, 500 075",
//     isHeadquarters: false,
//     phone: "+91 1234 567890",
//     email: "india@indrasol.com",
//     mapLink: "https://www.google.com/maps/place/Indrasol/@17.4893133,78.3901066,936m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bcb91f27b5c1195:0xc97b9e2d12234798!8m2!3d17.4893082!4d78.3926815!16s%2Fg%2F11fkw7t_9g?entry=ttu&g_ep=EgoyMDI1MDQxNC4xIKXMDSoASAFQAw%3D%3Dhttps://www.google.com/maps/search/814,+Manjeera+Trinity+Corporate,+JNTU+Road,+Kukatpally,+Hyderabad,+TS,+500+075/@17.4911278,78.3908007,468m/data=!3m2!1e3!4b1?entry=ttu&g_ep=EgoyMDI1MDQxNC4xIKXMDSoASAFQAw%3D%3D",
//     flag: "🇮🇳"
//   }
// ];

// export function LocationsSection() {
//   const [activeLocation, setActiveLocation] = useState(0);

//   return (
//     <section id="locations" className="py-24 md:py-32 relative overflow-hidden">
//       {/* Background elements */}
//       <div className="absolute inset-0 bg-gradient-to-b from-white to-indrasol-gray/20"></div>
//       <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
      
//       {/* Decorative elements */}
//       <div className="absolute top-1/3 right-0 w-96 h-96 bg-indrasol-blue/5 rounded-full blur-3xl -z-10"></div>
//       <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-indrasol-orange/5 rounded-full blur-3xl -z-10"></div>
      
//       <div className="container mx-auto px-4 relative z-10">
//         <div className="text-center mb-16">
//           <span className="inline-block text-indrasol-blue font-semibold mb-2 bg-indrasol-blue/10 px-4 py-1 rounded-full">Worldwide</span>
//           <h2 className="text-4xl md:text-5xl font-bold mb-6">
//             <span className="text-gray-900">Our Global </span>
//             <span className="text-indrasol-blue">Presence</span>
//           </h2>
//           <p className="text-lg text-gray-700 max-w-3xl mx-auto">
//             With offices across three continents, we serve clients worldwide with localized expertise and global capabilities.
//           </p>
//         </div>
        
//         {/* Location Tabs */}
//         <div className="flex flex-wrap justify-center gap-4 mb-12">
//           {locations.map((location, index) => (
//             <button
//               key={index}
//               onClick={() => setActiveLocation(index)}
//               className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center text-lg ${
//                 activeLocation === index 
//                   ? "bg-indrasol-blue text-white shadow-lg shadow-indrasol-blue/20" 
//                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
//               }`}
//             >
//               <span className="mr-2 text-xl">{location.flag}</span>
//               {location.city}
//             </button>
//           ))}
//         </div>
        
//         {/* Location Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {locations.map((location, index) => (
//             <div 
//               key={index} 
//               className={`transform transition-all duration-500 ${
//                 activeLocation === index 
//                   ? "scale-105 z-10" 
//                   : "scale-95 opacity-70"
//               }`}
//             >
//               <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full flex flex-col">
//                 {/* Map View - Replaced placeholder with actual Google Map */}
//                 <div className="h-48 relative">
//                   <SimpleMap location={location} />
//                   <a 
//                     href={location.mapLink} 
//                     target="_blank" 
//                     rel="noopener noreferrer" 
//                     className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow z-10"
//                   >
//                     <ExternalLink className="h-5 w-5 text-indrasol-blue" />
//                   </a>
//                 </div>
                
//                 <div className="p-6 flex-grow flex flex-col">
//                   <div className="flex items-start mb-6 justify-between">
//                     <div className="flex items-start">
//                       <MapPin className="h-6 w-6 text-indrasol-blue mr-3 mt-1 flex-shrink-0" strokeWidth={2} />
//                       <div>
//                         <h3 className="text-xl font-bold text-gray-900 flex items-center flex-wrap">
//                           {location.city}, {location.country}
//                         </h3>
//                         <p className="text-gray-600 mt-1">{location.address}</p>
//                       </div>
//                     </div>
                    
//                     {location.isHeadquarters && (
//                       <span className="ml-2 text-xs bg-indrasol-blue text-white px-3 py-1 rounded-full font-medium">
//                         Headquarters
//                       </span>
//                     )}
//                   </div>
                  
//                   <div className="space-y-4 mt-auto">
//                     <a 
//                       href={`tel:${location.phone}`} 
//                       className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group"
//                     >
//                       <div className="p-2 bg-indrasol-blue/10 rounded-lg mr-3 group-hover:bg-indrasol-blue/20 transition-colors">
//                         <Phone className="h-5 w-5 text-indrasol-blue" strokeWidth={2} />
//                       </div>
//                       <span className="text-gray-700 group-hover:text-indrasol-blue transition-colors">
//                         {location.phone}
//                       </span>
//                     </a>
                    
//                     <a 
//                       href={`mailto:${location.email}`} 
//                       className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors group"
//                     >
//                       <div className="p-2 bg-indrasol-blue/10 rounded-lg mr-3 group-hover:bg-indrasol-blue/20 transition-colors">
//                         <Mail className="h-5 w-5 text-indrasol-blue" strokeWidth={2} />
//                       </div>
//                       <span className="text-gray-700 group-hover:text-indrasol-blue transition-colors">
//                         {location.email}
//                       </span>
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         <div className="mt-16 text-center">
//           <a 
//             href="/contact" 
//             className="inline-flex items-center bg-indrasol-blue text-white font-medium px-8 py-3 rounded-xl shadow-lg shadow-indrasol-blue/20 hover:bg-indrasol-blue/90 transition-colors"
//           >
//             Get in touch with us
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }