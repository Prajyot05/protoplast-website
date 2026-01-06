"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const CTA = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Construct WhatsApp message
    const message = `Hello! I'm reaching out from your website.%0A%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0ACompany: ${formData.company}%0A%0AMessage: ${formData.message}`;
    window.open(`https://wa.me/919404570482?text=${message}`, "_blank");
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-neutral-100">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Content */}
          <div>
            <div className="section-label mb-4">CONTACT US</div>
            <h2 className="text-black mb-6">
              Start Your Project Today
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-md">
              Ready to bring your ideas to life? Contact our engineering team for a consultation or quote. Whether you need a single prototype or full-scale production, we are here to help.
            </p>

            {/* Featured In */}
            <div className="mt-12 pt-12 border-t border-gray-300">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-6">
                Trusted by engineers and startups
              </p>
              <div className="flex items-center gap-8 opacity-60">
                <Image
                  src="/logo-full-black.svg"
                  alt="Protoplast"
                  width={100}
                  height={30}
                  className="h-8 w-auto"
                />
              </div>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="bg-white p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 text-black placeholder-gray-500 
                             focus:border-green-500 focus:outline-none transition-colors bg-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 text-black placeholder-gray-500 
                             focus:border-green-500 focus:outline-none transition-colors bg-transparent"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-black placeholder-gray-500 
                           focus:border-green-500 focus:outline-none transition-colors bg-transparent"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Enter your message..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 text-black placeholder-gray-500 
                           focus:border-green-500 focus:outline-none transition-colors bg-transparent resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-4"
              >
                Send Message
              </button>
            </form>

            {/* Alternative Contact */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Or reach us directly on{" "}
                <Link
                  href="https://wa.me/919404570482"
                  className="text-green-600 hover:text-green-700 font-medium"
                  target="_blank"
                >
                  WhatsApp
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
