import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  // Testimonial data
  const testimonials = [
    {
      id: 1,
      quote: "I've worked with Indrasol team extensively over the past several years, as they not only assist us with the ongoing maintenance and support of our management financial reporting systems, but they were also our implementation partner as we moved our on-premises Hyperion instance to the cloud, while also doing a major implementation of Oracle's EPBCS (Enterprise Planning and Budgeting Cloud Solution). When it came time to choose a partner, it came down to Indrasol and one of the other big-name companies that you would think of when it comes to that sort of engagements. While the relative value they provided compared to the competition was readily apparent, that was not the major factor that tipped things in their favor – our main considerations were their expertise and skills in the area, the ready partnership and communication they showed, as well as their flexibility to adapt & adjust within reasonable bounds as the project progressed.",
      author: "David Wellman",
      position: "Vice President of Finance, Alorica ",
      company: "/logos/alorica.png",
      rating: 5
    },
    {
      id: 2,
      quote: "Having worked with the Indrasol team under Brahma's leadership over the past few years, I can say that they have strong expertise in analytics and cloud technologies. They have been assisting us with marketing analytics on the Azure platform. We are happy with  Indrasol, and I strongly recommend them.",
      author: "Chandra Sreeram",
      position: "Marketing Analytics and Operations Leader, Gigamon ",
      company: "/logos/gigamon.png",
      rating: 5
    },
    {
      id: 3,
      quote: "We've been working with Indrasol for almost three years now and plan to continue working with the team of talented people for years to come. They have the right technical staff to take up any task. Whether it's an enhancement or a year-long project, they stay on top of things with absolute commitment. They consistently exceed our expectations, providing quality services with cost efficient support, quick resolution of issues and round-the-clock availability.",
      author: "Raj Vakil",
      position: "Senior Vice President Finance , Accuray ",
      company: "/logos/accuray.png",
      rating: 5
    },
    
  ];

  // State for testimonial carousel
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);
  const timeoutRef = useRef(null);

  // Generate stars for ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-indrasol-orange fill-indrasol-orange" : "text-gray-300"
        }`}
      />
    ));
  };

  // Handle navigation
  const goToSlide = (index) => {
    let newIndex = index;
    if (newIndex < 0) {
      newIndex = testimonials.length - 1;
    } else if (newIndex >= testimonials.length) {
      newIndex = 0;
    }
    setActiveIndex(newIndex);
    resetTimeout();
  };

  const nextSlide = () => goToSlide(activeIndex + 1);
  const prevSlide = () => goToSlide(activeIndex - 1);

  // Auto play functionality
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    autoPlayRef.current = nextSlide;
  });

  useEffect(() => {
    const play = () => {
      autoPlayRef.current();
    };

    resetTimeout();
    if (isAutoPlaying) {
      timeoutRef.current = setTimeout(play, 5000); // Change slide every 5 seconds
    }

    return () => {
      resetTimeout();
    };
  }, [isAutoPlaying, activeIndex]);

  // Pause auto play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white via-indrasol-blue/5 to-white">
      {/* Background decorative elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-indrasol-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indrasol-orange/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-indrasol-blue/10 px-4 py-1 rounded-full mb-4">
            <span className="text-indrasol-blue font-semibold text-sm">Client Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Leading Organizations
          </h2>
          <p className="text-lg text-gray-700">
            See how we've helped businesses transform their AI capabilities while ensuring
            top-tier security and ethical governance.
          </p>
        </div>

        {/* Testimonials carousel */}
        <div 
          className="relative max-w-6xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Previous button */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-100 hover:bg-indrasol-blue hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/40 hidden md:block"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Testimonial display */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 px-4 md:px-12"
                >
                  <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl relative border border-gray-100">
                    {/* Quote icon */}
                    <div className="absolute top-8 right-8 text-indrasol-blue/10">
                      <Quote className="h-16 w-16" />
                    </div>
                    
                    {/* Testimonial content */}
                    <blockquote className="text-lg md:text-xl text-gray-700 italic leading-relaxed mb-8">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* Client info - without avatar */}
                    <div className="border-t border-gray-100 pt-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{testimonial.author}</h3>
                        <p className="text-gray-600 mb-2">{testimonial.position}</p>
                        <div className="flex items-start mb-2">
                          {renderStars(testimonial.rating)}
                        </div>
                        
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next button */}
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-100 hover:bg-indrasol-blue hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indrasol-blue/40 hidden md:block"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${
                  index === activeIndex ? "bg-indrasol-blue w-8" : "bg-gray-300 hover:bg-indrasol-blue/50"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Mobile navigation */}
          <div className="flex justify-center mt-6 space-x-4 md:hidden">
            <button 
              className="bg-white rounded-full p-2 shadow-md border border-gray-100 hover:bg-indrasol-blue hover:text-white transition-colors"
              onClick={prevSlide}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              className="bg-white rounded-full p-2 shadow-md border border-gray-100 hover:bg-indrasol-blue hover:text-white transition-colors"
              onClick={nextSlide}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;