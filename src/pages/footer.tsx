"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MessageCircle,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Image
              alt="logo"
              src="/logo-text-white.svg"
              width={120}
              height={50}
            />
            <p className="text-gray-400 leading-relaxe pt-2 text-left">
              Bringing your ideas to life with advanced manufacturing solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="mailto:protoplast.3d.info@gmail.com"
                  className="flex items-center text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  protoplast.3d.info@gmail.com
                </Link>
              </li>
              <li>
                <Link
                  href="tel:+919404570482"
                  className="flex items-center text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +91 94045 70482
                </Link>
              </li>
              <li>
                <Link
                  href="https://wa.me/919404570482"
                  className="flex items-center text-gray-400 hover:text-green-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Follow Us</h4>
            <div className="flex space-x-4">
              <Link
                href="https://x.com/Protoplast_3D?t=DUonkFrHINhUm_Zd2y1dWQ&s=09"
                target="_blank"
                className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-green-400 transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.instagram.com/protoplast.3d/profilecard/?igsh=MXIzdm9oOHA3Y2kzdA=="
                target="_blank"
                className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-green-400 transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/protoplast-3d/"
                target="_blank"
                className="w-10 h-10 border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-green-400 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 Protoplast.3D. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
