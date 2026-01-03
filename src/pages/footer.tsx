"use client";

import { Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 relative overflow-hidden pt-24 pb-8">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-32">
          {/* Left Side: Logo, Slogan, Social */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <Image
                alt="Protoplast Logo"
                src="/logo-text-black.svg"
                width={140}
                height={40}
                className="h-8 w-auto"
              />
              <div className="hidden md:block h-5 w-px bg-gray-300"></div>
              <p className="text-gray-500 text-sm font-medium">
                Autonomy, Designed for Everyday Life.
              </p>
            </div>

            <div>
              <Link
                href="https://www.linkedin.com/company/protoplast-3d/"
                target="_blank"
                className="inline-flex items-center justify-center w-10 h-10 border border-gray-200 rounded-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
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
          © 2025 Protoplast | Webdesigned by We-R | All rights reserved
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
