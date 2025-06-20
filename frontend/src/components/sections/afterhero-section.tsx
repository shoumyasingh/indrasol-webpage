import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AfterHeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('afterhero-section');
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Check visibility on initial load
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section 
      id="afterhero-section"
      className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
    >
      {/* Enhanced 3D Accent Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-72 h-72 bg-[#367ABB]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-[#D5844C]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-60 w-40 h-40 bg-[#9FA1A1]/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-40 w-32 h-32 bg-[#367ABB]/5 rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-block">
            <span className="inline-block text-indrasol-blue font-semibold mb-2 bg-indrasol-blue/10 px-4 py-1 rounded-full shadow-sm">
              Our Expertise
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Comprehensive 
            <span className="text-indrasol-blue relative ml-2">
              <span className="relative z-10">Service Architecture</span>
              
            </span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            Our integrated approach delivers end-to-end solutions across key domains,
            bringing together expertise in AI, cloud, application security, and data engineering
          </p>
        </motion.div>
        
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="relative mx-auto max-w-5xl"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden p-6 md:p-8 border border-gray-100">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#367ABB]/5 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#D5844C]/5 rounded-full blur-xl"></div>
            
            <div className="relative aspect-[16/12] w-full group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#367ABB]/10 to-transparent rounded-2xl opacity-50"></div>
              <img 
                src="/lovable-uploads/indrasol-sevice-architecture.png" 
                alt="Indrasol's Service Architecture" 
                className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
              />
              
              {/* Highlight spots */}
              <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-[#367ABB]/30 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-[#D5844C]/30 rounded-full blur-sm animate-pulse" style={{animationDelay: "1s"}}></div>
              <div className="absolute bottom-1/3 right-1/4 w-5 h-5 bg-[#9FA1A1]/30 rounded-full blur-sm animate-pulse" style={{animationDelay: "0.5s"}}></div>
            </div>
            
            {/* <div className="mt-6 text-center">
              <span className="text-sm font-medium text-gray-500">Tap into our comprehensive service ecosystem</span>
            </div> */}
          </div>
        </motion.div>
        
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          transition={{ delay: 0.2 }}
          className="text-center mt-12"
        >
          <div className="bg-[#367ABB]/5 rounded-2xl p-6 max-w-3xl mx-auto border border-[#367ABB]/10">
            <p className="text-gray-700 text-lg leading-relaxed">
              Our service architecture is designed to deliver holistic solutions that address every aspect 
              of your digital transformation journey, from development and security to compliance and management.
            </p>
          </div>
          
          <div className="mt-10">
            {/* <a 
              href="#services" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[#367ABB] text-white rounded-full hover:bg-[#367ABB]/90 transition-colors shadow-lg hover:shadow-xl group relative overflow-hidden"
            > */}
              {/* Button background effect */}
              {/* <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#367ABB]/0 via-white/20 to-[#367ABB]/0 -translate-x-full group-hover:animate-shine"></span> */}
              
              {/* <span className="font-medium mr-2 relative z-10">Explore Our Services</span> */}
              {/* <span className="relative w-6 h-6 bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 z-10">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 transition-transform duration-300 transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M7 7l5 5-5 5" />
                </svg>
              </span> */}
            {/* </a> */}
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced diagonal divider with animation */}
      <div className="absolute bottom-0 left-0 w-full h-0 overflow-hidden">
        <motion.svg 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-0 w-full h-0" 
          viewBox="0 0 1440 70" 
          preserveAspectRatio="none"
        >
          <path fill="#fff" d="M0,70 L1440,0 L1440,70 L0,70 Z"></path>
        </motion.svg>
      </div>
      
      {/* Add keyframes for shine animation */}
      <style>{`
        @keyframes shine {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shine {
          animation: shine 1.5s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}

export default AfterHeroSection;