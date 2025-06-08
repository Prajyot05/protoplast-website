"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { ServiceKey } from "@/types/service";

interface HeroProps {
  onServiceClick: (serviceId: ServiceKey) => void;
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
    <section className="min-h-screen pt-10 flex items-center justify-center relative">
      <motion.video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="/bg-bluish.mp4"
        autoPlay
        muted
        loop
        playsInline
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
      />
      <div className="container z-10 mx-auto px-6 text-center">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Logo */}
          <div className="relative">
            <Image
              alt="full logo"
              src="/logo-full-white.svg"
              className="mx-auto"
              width={450}
              height={450}
            />
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white max-w-4xl mx-auto leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Flexible Solutions for Your Business
        </motion.h1>

        {/* Service Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 py-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => onServiceClick(service.id as ServiceKey)}
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
          <Link target="_blank" href="https://wa.me/919404570482">
            <Button variant="explore" className="py-8">
              Start free today
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
