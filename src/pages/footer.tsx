"use client";

import { Linkedin, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 relative overflow-hidden pt-16 md:pt-24 pb-8">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-32">
          {/* Left Side: Logo, Slogan, Social */}
          <div className="space-y-8">
            <div className="flex flex-col gap-4">
              <p className="text-gray-800 text-lg font-medium">
                Precision Manufacturing for the Next Generation of Innovation.
              </p>
              <div className="space-y-2">
                <a 
                  href="mailto:protoplaststudio@gmail.com" 
                  className="block text-gray-600 hover:text-green-600 transition-colors text-sm"
                >
                  protoplaststudio@gmail.com
                </a>
                <a 
                  href="tel:+919404570482" 
                  className="block text-gray-600 hover:text-green-600 transition-colors text-sm"
                >
                  +91 94045 70482
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="https://www.linkedin.com/company/protoplast-3d/"
                target="_blank"
                className="inline-flex items-center justify-center w-10 h-10 border border-gray-200 rounded-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://instagram.com/protoplast.3d/profilecard/?igsh=MXIzdm9oOHA3Y2kzdA=="
                target="_blank"
                className="inline-flex items-center justify-center w-10 h-10 border border-gray-200 rounded-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://x.com/Protoplast_3D?t=DUonkFrHINhUm_Zd2y1dWQ&s=09"
                target="_blank"
                className="inline-flex items-center justify-center w-10 h-10 border border-gray-200 rounded-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Side: Information */}
          <div className="mt-12 md:mt-0">
            <h4 className="text-black font-medium mb-6">Information</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-black transition-colors text-sm"
                >
                  Legal Notice
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-black transition-colors text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-gray-400 text-xs">
          © 2025 Protoplast | All rights reserved
        </div>
      </div>

      {/* Background Text */}
      <div className="absolute bottom-0 left-0 w-full leading-none select-none pointer-events-none overflow-hidden flex justify-center">
        <h1
          className="text-[18vw] font-bold text-gray-100 tracking-tighter translate-y-[35%]"
          style={{
            maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          }}
        >
          Protoplast
        </h1>
      </div>
    </footer>
  );
}
