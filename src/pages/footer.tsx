"use client";

import { Mail, Phone, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";

export default function Footer() {
  const navItems = [
    { label: "Solutions", id: "services" },
    { label: "Pricing", id: "pricing" },
    { label: "About", id: "about" },
    { label: "Testimonials", id: "testimonials" },
  ];

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
            <p className="text-gray-400 leading-relaxed pt-2 text-left">
              Bringing your ideas to life with advanced manufacturing solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <ScrollLink
                    to={item.id}
                    // spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    activeClass="text-green-400"
                    className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </ScrollLink>
                </li>
              ))}
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
                  className="flex gap-2 items-center text-gray-400 group hover:text-green-400 transition-colors"
                >
                  <svg className="w-[15px]" viewBox="0 0 16 16">
                    <path
                      className="fill-gray-400 group-hover:fill-green-300"
                      d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
                    ></path>
                  </svg>
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
