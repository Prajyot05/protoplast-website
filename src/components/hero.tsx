"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HeroProps {
  onServiceClick: (serviceId: string) => void;
}

export default function Hero({ onServiceClick }: HeroProps) {
  const services = [
    { id: "3d-printing", label: "3D Printing" },
    { id: "cnc-cutting", label: "CNC Cutting" },
    { id: "cad-modeling", label: "CAD Modeling" },
    { id: "pcb-design", label: "PCB Design" },
    { id: "rapid-prototyping", label: "Rapid Prototyping" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center bg-black">
      <div className="container mx-auto px-6 text-center">
        {/* Logo Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Logo Placeholder - Replace with actual logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Smiley Face Icon */}
              <div className="w-24 h-24 border-4 border-white rounded-full flex items-center justify-center mb-4 mx-auto">
                <div className="flex space-x-2">
                  <div className="w-2 h-6 bg-white rounded-full transform -rotate-12"></div>
                  <div className="w-2 h-6 bg-white rounded-full transform rotate-12"></div>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-6xl md:text-8xl font-bold mb-2">
            <span className="text-green-400">Protoplast</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mb-16">
            STUDIO
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-16 max-w-4xl mx-auto leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Flexible Solutions for Your Business
        </motion.h1>

        {/* Service Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => onServiceClick(service.id)}
              className="px-8 py-3 border border-gray-600 text-white rounded-full hover:border-green-400 hover:text-green-400 transition-all duration-300 text-sm font-medium"
            >
              {service.label}
            </button>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            href="https://wa.me/919404570482"
            className="inline-block px-12 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 text-sm"
          >
            Start free today
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
