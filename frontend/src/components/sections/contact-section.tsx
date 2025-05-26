import React, { useState } from "react";
import { Mail, Phone, Send, MapPin, ArrowRight, Linkedin, Twitter } from "lucide-react";

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const [formStatus, setFormStatus] = useState<null | "submitting" | "success" | "error">(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success");
      setFormState({
        name: "",
        email: "",
        company: "",
        message: ""
      });
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-indrasol-gray/20 to-white"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indrasol-blue/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indrasol-orange/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block text-indrasol-blue font-semibold mb-2 bg-indrasol-blue/10 px-4 py-1 rounded-full">Contact Us</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900">Get in </span>
            <span className="text-indrasol-blue">Touch</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Ready to transform your business? Contact us today to discuss how our services can help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Info Section */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-full">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="p-3 bg-indrasol-blue/10 rounded-xl mr-4">
                    <Mail className="h-6 w-6 text-indrasol-blue" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Email Us</h3>
                    <a href="mailto:info@indrasol.com" className="text-indrasol-blue hover:text-indrasol-blue/80 transition-colors mt-1 block">
                      info@indrasol.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 bg-indrasol-blue/10 rounded-xl mr-4">
                    <Phone className="h-6 w-6 text-indrasol-blue" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Call Us</h3>
                    <a href="tel:+15101234567" className="text-indrasol-blue hover:text-indrasol-blue/80 transition-colors mt-1 block">
                      +1 (510) 754 2001
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-3 bg-indrasol-blue/10 rounded-xl mr-4">
                    <MapPin className="h-6 w-6 text-indrasol-blue" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Headquarters</h3>
                    <p className="text-gray-700 mt-1">
                      San Ramon, California, USA
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.linkedin.com/company/indrasol"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-indrasol-blue p-3 rounded-xl hover:bg-indrasol-blue/10 transition-colors border border-indrasol-blue/20 shadow-sm"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-6 w-6" strokeWidth={2} />
                    </a>
                    <a
                      href="https://x.com/theindrasol"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-indrasol-blue p-3 rounded-xl hover:bg-indrasol-blue/10 transition-colors border border-indrasol-blue/20 shadow-sm"
                      aria-label="X (formerly Twitter)"
                    >
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4l16 16M4 20L20 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
              {/* Decorative shape */}
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indrasol-blue/5 rounded-full"></div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6 relative z-10">Send Us a Message</h3>

              {formStatus === "success" ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h4>
                  <p className="text-gray-700">Your message has been sent successfully. We'll get back to you soon.</p>
                  <button
                    onClick={() => setFormStatus(null)}
                    className="mt-4 px-6 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indrasol-blue focus:border-indrasol-blue transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indrasol-blue focus:border-indrasol-blue transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formState.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indrasol-blue focus:border-indrasol-blue transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indrasol-blue focus:border-indrasol-blue transition-all"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="w-full px-6 py-4 bg-indrasol-blue text-white rounded-xl hover:bg-indrasol-blue/90 transition-colors flex items-center justify-center shadow-lg shadow-indrasol-blue/20 group"
                  >
                    {formStatus === "submitting" ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}