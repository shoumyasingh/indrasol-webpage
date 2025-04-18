import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const clientLogos = [
  // Row 1
  {
    name: "Facebook",
    logo: "/logos/facebook.png",
    url: "https://www.facebook.com/"
  },
  {
    name: "Accuray",
    logo: "/logos/accuray.png",
    url: "https://www.accuray.com/"
  },
  {
    name: "Alorica",
    logo: "/logos/alorica.png",
    url: "https://www.alorica.com/"
  },
  {
    name: "TSTT",
    logo: "/logos/tstt.png",
    url: "https://www.tstt.co.tt/"
  },
  {
    name: "Urban Development Corporation",
    logo: "/logos/udc.png",
    url: "https://udcja.com/"
  },
  {
    name: "Guardian Group",
    logo: "/logos/guardian-group.png",
    url: "https://trinidad.myguardiangroup.com/"
  },
  {
    name: "Complete Genomics",
    logo: "/logos/complete-genomics.png",
    url: "https://www.completegenomics.com/"
  },
  // Row 2
  {
    name: "Annapurna Studios",
    logo: "/logos/annapurna-studios.png",
    url: "https://annapurnastudios.com/"
  },
  {
    name: "GAP",
    logo: "/logos/gap.png",
    url: "https://www.gap.com/"
  },
  {
    name: "Essex Property Trust",
    logo: "/logos/essex.png",
    url: "https://www.essex.com/"
  },
  {
    name: "SonicWall",
    logo: "/logos/sonicwall.png",
    url: "https://www.sonicwall.com/"
  },
  {
    name: "YuMe",
    logo: "/logos/yume.png",
    url: "https://www.yume.com/"
  },
  {
    name: "Mervyn's",
    logo: "/logos/mervyns.png",
    url: "https://www.mervyns.com/"
  },
  {
    name: "Concerto Health",
    logo: "/logos/concerto-health.png",
    url: "https://www.concertohealth.com/"
  },
  // Row 3
  {
    name: "Charlotte Russe",
    logo: "/logos/charlotte-russe.png",
    url: "https://www.charlotterusse.com/"
  },
  {
    name: "Palo Alto Networks",
    logo: "/logos/palo-alto.png",
    url: "https://www.paloaltonetworks.com/"
  },
  {
    name: "Banana Republic",
    logo: "/logos/banana-republic.png",
    url: "https://www.bananarepublic.com/"
  },
  {
    name: "Gigamon",
    logo: "/logos/gigamon.png",
    url: "https://www.gigamon.com/"
  },
  {
    name: "Cisco",
    logo: "/logos/cisco.png",
    url: "https://www.cisco.com/"
  },
  {
    name: "Planet",
    logo: "/logos/planet.png",
    url: "https://www.planet.com/"
  },
  {
    name: "T&TEC",
    logo: "/logos/ttec.png",
    url: "https://ttec.co.tt/"
  }
];

export function ClientsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('clients-section');
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };
    
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Check visibility on initial load
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  // Function to calculate tilt based on mouse position
  const calculateTilt = (index) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const card = containerRef.current.children[index];
    if (!card) return { x: 0, y: 0 };
    
    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    
    // Calculate distance from mouse to card center
    const distX = mousePosition.x - (cardCenterX - rect.left);
    const distY = mousePosition.y - (cardCenterY - rect.top);
    
    // Calculate tilt (max 10 degrees)
    const tiltX = (distY / (rect.height / 2)) * 5;
    const tiltY = -(distX / (rect.width / 2)) * 5;
    
    return { x: tiltX, y: tiltY };
  };

  return (
    <section 
      id="clients-section"
      className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
    >
      {/* 3D Accent Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-64 h-64 bg-[#367ABB]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-[#D5844C]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-60 w-40 h-40 bg-[#9FA1A1]/5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-block">
            <span className="inline-block text-indrasol-blue font-semibold mb-2 bg-indrasol-blue/10 px-4 py-1 rounded-full">
              Our Clients
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Trusted by 
            <span className="text-indrasol-blue relative">
              <span className="relative z-10"> Industry Leaders</span>
              {/* <svg className="absolute -bottom-2 left-0 w-full z-0 text-indrasol-blue/10" viewBox="0 0 200 15" preserveAspectRatio="none">
                <path d="M0,15 Q50,0 100,15 Q150,30 200,15 L200,0 L0,0 Z" fill="currentColor"/>
              </svg> */}
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Our collaboration with diverse industry leaders demonstrates our adaptability and expertise across sectors
          </p>
        </motion.div>
        
        <motion.div 
          ref={containerRef}
          variants={container}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 md:gap-6"
        >
          {clientLogos.map((client, index) => {
            const tilt = calculateTilt(index);
            return (
              <motion.a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                variants={item}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  rotate: 0,
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{ 
                  transform: activeIndex === index ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : "none",
                  transition: "transform 0.2s ease-out"
                }}
                className="group flex flex-col items-center justify-center p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#367ABB]/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#367ABB]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 h-14 flex items-center justify-center w-full">
                  <img 
                    src={client.logo} 
                    alt={`${client.name} logo`} 
                    className="max-h-10 max-w-full object-contain filter transition-all duration-300 group-hover:scale-110"
                  />
                </div>
                
                <div className="mt-3 text-center overflow-hidden h-0 group-hover:h-auto transition-all duration-300">
                  <span className="text-[#367ABB] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 block">
                    {client.name}
                  </span>
                </div>
                
                {/* Hover effect */}
                <motion.div
                  className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#D5844C]/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </motion.div>
              </motion.a>
            );
          })}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-16 text-center"
        >
          <a 
            href="#success-stories" 
            className="inline-flex items-center justify-center px-8 py-4 bg-[#367ABB] text-white rounded-full hover:bg-[#367ABB]/90 transition-colors shadow-lg hover:shadow-xl group"
          >
            <span className="font-medium mr-2">View Success Stories</span>
            <span className="relative w-6 h-6 bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white/30">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 transition-transform duration-300 transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M7 7l5 5-5 5" />
              </svg>
            </span>
          </a>
        </motion.div>
      </div>
      
      {/* Diagonal divider */}
      <div className="absolute bottom-0 left-0 w-full h-16 overflow-hidden">
        <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1440 70" preserveAspectRatio="none">
          <path fill="#fff" d="M0,70 L1440,0 L1440,70 L0,70 Z"></path>
        </svg>
      </div>
    </section>
  );
}

export default ClientsSection;