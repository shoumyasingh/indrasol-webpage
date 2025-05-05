import React, { useState, useEffect, useRef } from "react";
import { 
  Menu, 
  X, 
  Settings, 
  Users, 
  Cloud, 
  Shield, 
  ChevronDown,
  BarChart,
  Database,
  LineChart,
  FileText,
  ClipboardCheck,
  File,
  Newspaper,
  Video,
  Activity,
  Lock,
  Building,
  Briefcase,
  MapPin,
  Cpu,
  Code
} from "lucide-react";
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
            src="/lovable-uploads/Indrasol company logo_.png" 
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
          {isMenuOpen ? <X size={24} className="stroke-4" /> : <Menu size={24} className="stroke-4" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLinks className="block py-2 text-gray-700 hover:text-indrasol-blue transition-colors" isMobile={true} />
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

function NavLinks({ className, isMobile = false }: { className?: string, isMobile?: boolean }) {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  
  const toggleServicesDropdown = () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
    if (resourcesDropdownOpen) setResourcesDropdownOpen(false);
    if (productsDropdownOpen) setProductsDropdownOpen(false);
    if (aboutDropdownOpen) setAboutDropdownOpen(false);
  };
  
  const toggleResourcesDropdown = () => {
    setResourcesDropdownOpen(!resourcesDropdownOpen);
    if (servicesDropdownOpen) setServicesDropdownOpen(false);
    if (productsDropdownOpen) setProductsDropdownOpen(false);
    if (aboutDropdownOpen) setAboutDropdownOpen(false);
  };
  
  const toggleProductsDropdown = () => {
    setProductsDropdownOpen(!productsDropdownOpen);
    if (servicesDropdownOpen) setServicesDropdownOpen(false);
    if (resourcesDropdownOpen) setResourcesDropdownOpen(false);
    if (aboutDropdownOpen) setAboutDropdownOpen(false);
  };
  
  const toggleAboutDropdown = () => {
    setAboutDropdownOpen(!aboutDropdownOpen);
    if (servicesDropdownOpen) setServicesDropdownOpen(false);
    if (resourcesDropdownOpen) setResourcesDropdownOpen(false);
    if (productsDropdownOpen) setProductsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target as Node)) {
        setResourcesDropdownOpen(false);
      }
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle Services dropdown keyboard navigation
  const handleServicesKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleServicesDropdown();
      event.preventDefault();
    } else if (event.key === 'Escape' && servicesDropdownOpen) {
      setServicesDropdownOpen(false);
    }
  };
  
  // Handle Resources dropdown keyboard navigation
  const handleResourcesKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleResourcesDropdown();
      event.preventDefault();
    } else if (event.key === 'Escape' && resourcesDropdownOpen) {
      setResourcesDropdownOpen(false);
    }
  };
  
  // Handle Products dropdown keyboard navigation
  const handleProductsKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleProductsDropdown();
      event.preventDefault();
    } else if (event.key === 'Escape' && productsDropdownOpen) {
      setProductsDropdownOpen(false);
    }
  };
  
  // Handle About dropdown keyboard navigation
  const handleAboutKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      toggleAboutDropdown();
      event.preventDefault();
    } else if (event.key === 'Escape' && aboutDropdownOpen) {
      setAboutDropdownOpen(false);
    }
  };
  
  return (
    <>
      <Link to="/" className={cn(className)}>Home</Link>
      
      {/* Services Dropdown */}
      {isMobile ? (
        <>
          <div className={cn(className)}>
            <div 
              onClick={toggleServicesDropdown}
              onKeyDown={handleServicesKeyDown}
              className="flex items-center w-full text-left cursor-pointer"
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={servicesDropdownOpen}
            >
              Services <ChevronDown className="ml-1 h-4 w-4 stroke-4" />
            </div>
            
            {servicesDropdownOpen && (
              <div className="pl-4 mt-2 space-y-2">
                <Link 
                  to="/services/aisolutions" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <Cpu className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  AI Solutions & Security
                </Link>
                <Link 
                  to="/services/cloud-engineering"
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <Cloud className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  Cloud Engineering & Security
                </Link>
                <Link 
                  to="/services/application-security" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <Code className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  Application Security & Compliance
                </Link>
                <Link 
                  to="/services/data-engineering" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <Database className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  Data Engineering & Security
                </Link>
              </div>
            )}
          </div>
          
          {/* Products Dropdown (Mobile) */}
          <div className={cn(className)}>
            <div 
              onClick={toggleProductsDropdown}
              onKeyDown={handleProductsKeyDown}
              className="flex items-center w-full text-left cursor-pointer"
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={productsDropdownOpen}
            >
              Products <ChevronDown className="ml-1 h-4 w-4 stroke-4" />
            </div>
            
            {productsDropdownOpen && (
              <div className="pl-4 mt-2 space-y-2">
                <Link 
                  to="/Products/Bizradar" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <Activity className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  Bizradar
                </Link>
                <Link 
                  to="/Products/Securetrack" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <Lock className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  Securetrack
                </Link>
              </div>
            )}
          </div>
          
          {/* Resources Dropdown (Mobile) */}
          <div className={cn(className)}>
            <div 
              onClick={toggleResourcesDropdown}
              onKeyDown={handleResourcesKeyDown}
              className="flex items-center w-full text-left cursor-pointer"
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={resourcesDropdownOpen}
            >
              Resources <ChevronDown className="ml-1 h-4 w-4 stroke-4" />
            </div>
            
            {resourcesDropdownOpen && (
              <div className="pl-4 mt-2 space-y-2">
                <Link 
                  to="/Resources/blogs2" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <FileText className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  Blogs
                </Link>
                {/* <Link 
                  to="/resources/case-studies" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <ClipboardCheck className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  Case Studies
                </Link> */}
                <Link 
                  to="/Resources/whitepaper" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <File className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  White Papers
                </Link>
                {/* <Link 
                  to="/resources/news" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <Newspaper className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  News
                </Link> */}
                {/* <Link 
                  to="/resources/videos" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <Video className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  Videos
                </Link> */}
              </div>
            )}
          </div>
          
          {/* About Us Dropdown (Mobile) */}
          <div className={cn(className)}>
            <div 
              onClick={toggleAboutDropdown}
              onKeyDown={handleAboutKeyDown}
              className="flex items-center w-full text-left cursor-pointer"
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={aboutDropdownOpen}
            >
              About Us <ChevronDown className="ml-1 h-4 w-4 stroke-4" />
            </div>
            
            {aboutDropdownOpen && (
              <div className="pl-4 mt-2 space-y-2">
                <Link 
                  to="/company" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <Building className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  Company
                </Link>
                <Link 
                  to="https://www.linkedin.com/company/indrasol/" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <Briefcase className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  Careers
                </Link>
                <Link 
                  to="/locations" 
                  className="flex items-center py-2 text-sm text-gray-700 hover:text-indrasol-blue"
                >
                  <MapPin className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                  Locations
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Services Dropdown (Desktop) */}
          <div className="relative inline-block" ref={servicesDropdownRef}>
            <div 
              onClick={toggleServicesDropdown}
              onKeyDown={handleServicesKeyDown}
              className={cn(className, "flex items-center cursor-pointer")}
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={servicesDropdownOpen}
            >
              Services <ChevronDown className="ml-1 h-4 w-4 stroke-4" />
            </div>
            
            {servicesDropdownOpen && (
              <div 
                className="absolute z-50 mt-2 w-60 bg-white rounded-md shadow-lg"
                role="menu"
              >
                <div className="py-1">
                  <Link 
                    to="/services/aisolutions" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Cpu className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    AI Solutions & Security
                  </Link>
                  <Link 
                    to="/services/cloud-engineering"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Cloud className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    Cloud Engineering & Security
                  </Link>
                  <Link 
                    to="/services/application-security" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Code className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    Application Security & Compliance
                  </Link>
                  <Link 
                    to="/services/data-engineering" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Database className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    Data Engineering, Analytics & Security
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Products Dropdown (Desktop) */}
          <div className="relative inline-block" ref={productsDropdownRef}>
            <div 
              onClick={toggleProductsDropdown}
              onKeyDown={handleProductsKeyDown}
              className={cn(className, "flex items-center cursor-pointer")}
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={productsDropdownOpen}
            >
              Products <ChevronDown className="ml-1 h-4 w-4 stroke-4" />
            </div>
            
            {productsDropdownOpen && (
              <div 
                className="absolute z-50 mt-2 w-48 bg-white rounded-md shadow-lg"
                role="menu"
              >
                <div className="py-1">
                  <Link 
                    to="/Products/Bizradar" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Activity className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    Bizradar
                  </Link>
                  <Link 
                    to="/Products/Securetrack" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Lock className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    Securetrack
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Resources Dropdown (Desktop) */}
          <div className="relative inline-block" ref={resourcesDropdownRef}>
            <div 
              onClick={toggleResourcesDropdown}
              onKeyDown={handleResourcesKeyDown}
              className={cn(className, "flex items-center cursor-pointer")}
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={resourcesDropdownOpen}
            >
              Resources <ChevronDown className="ml-1 h-4 w-4 stroke-4" />
            </div>
            
            {resourcesDropdownOpen && (
              <div 
                className="absolute z-50 mt-2 w-56 bg-white rounded-md shadow-lg"
                role="menu"
              >
                <div className="py-1">
                  <Link 
                    to="/Resources/blogs2" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FileText className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    Blogs
                  </Link>
                  {/* <Link 
                    to="/resources/case-studies" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ClipboardCheck className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    Case Studies
                  </Link> */}
                  <Link 
                    to="/Resources/whitepaper" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <File className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    White Papers
                  </Link>
                  {/* <Link 
                    to="/resources/news" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Newspaper className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    News
                  </Link> */}
                  {/* <Link 
                    to="/resources/videos" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Video className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    Videos
                  </Link> */}
                </div>
              </div>
            )}
          </div>
          
          {/* About Us Dropdown (Desktop) */}
          <div className="relative inline-block" ref={aboutDropdownRef}>
            <div 
              onClick={toggleAboutDropdown}
              onKeyDown={handleAboutKeyDown}
              className={cn(className, "flex items-center cursor-pointer")}
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={aboutDropdownOpen}
            >
              About Us <ChevronDown className="ml-1 h-4 w-4 stroke-4" />
            </div>
            
            {aboutDropdownOpen && (
              <div 
                className="absolute z-50 mt-2 w-48 bg-white rounded-md shadow-lg"
                role="menu"
              >
                <div className="py-1">
                  <Link 
                    to="/company" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Building className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    Company
                  </Link>
                  <Link 
                    to="https://www.linkedin.com/company/indrasol/" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Briefcase className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    Careers
                  </Link>
                  <Link 
                    to="/locations" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <MapPin className="mr-2 h-4 w-4 text-indrasol-blue stroke-4" />
                    Locations
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
