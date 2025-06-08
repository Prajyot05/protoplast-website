"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap } from "lucide-react";
import { ServiceKey } from "@/types/service";

interface ServicesProps {
  onServiceClick: (serviceId: ServiceKey) => void;
}

export default function Services({ onServiceClick }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const services = [
    {
      id: "3d-printing",
      icon: (
        <div className="service-icon text-gray-400 group-hover:text-green-400 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[50px] h-[50px]"
          >
            <rect x="20" y="60" width="60" height="25" rx="2" />
            <rect x="35" y="15" width="30" height="45" rx="2" />
            <line
              x1="50"
              y1="35"
              x2="50"
              y2="60"
              className="printer-filament"
            />
            <rect x="40" y="85" width="20" height="5" />
            <circle cx="50" cy="60" r="5" className="printer-nozzle" />
          </svg>
        </div>
      ),
      title: "3D Printing & Prototyping",
      description:
        "High-precision, rapid prototypes for product development, medical applications, and industrial needs.",
    },
    {
      id: "pcb-design",
      icon: (
        <div className="service-icon text-gray-400 group-hover:text-green-400 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[50px] h-[50px]"
          >
            <rect x="15" y="15" width="70" height="70" rx="2" />
            <circle cx="30" cy="30" r="5" className="component-pulse" />
            <circle cx="70" cy="30" r="5" className="component-pulse" />
            <circle cx="30" cy="70" r="5" className="component-pulse" />
            <circle cx="70" cy="70" r="5" className="component-pulse" />
            <path
              d="M30 30 L70 30 L70 70 L30 70 Z"
              className="trace-animation"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="3"
              className="led-blink"
              fill="currentColor"
            />
            <line x1="40" y1="40" x2="60" y2="40" className="circuit-pulse" />
            <line x1="40" y1="60" x2="60" y2="60" className="circuit-pulse" />
          </svg>
        </div>
      ),
      title: "PCB Designing & Manufacturing",
      description:
        "Custom circuit board design, prototyping, and production for electronics projects of all scales.",
    },
    {
      id: "cnc-cutting",
      icon: (
        <div className="service-icon text-gray-400 group-hover:text-green-400 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[50px] h-[50px]"
          >
            <circle cx="50" cy="50" r="35" fill="none" strokeWidth="1" />
            <circle cx="50" cy="50" r="5" />
            <path
              d="M50 15 L85 50 L50 85 L15 50 Z"
              className="cutter-blade"
              fill="none"
            />
            <path d="M30 30 L70 70" strokeWidth="3" />
            <path d="M30 70 L70 30" strokeWidth="3" />
          </svg>
        </div>
      ),
      title: "CNC Cutting & Machining",
      description:
        "Precision cutting for metals, plastics, and composites for both personal and commercial projects.",
    },
  ];

  return (
    <section id="services" ref={sectionRef} className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Our Services
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Your one-stop solution for advanced manufacturing. We provide
            top-quality services to bring your ideas to life with precision and
            efficiency. Click buttons above for details.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {services.map((service, index) => {
            return (
              <motion.div
                key={service.id}
                className="text-center group cursor-pointer service-card"
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.8, delay: index * 0.2 }}
                onClick={() => onServiceClick(service.id as ServiceKey)}
              >
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                  <div className="w-20 h-20 border-2 border-gray-600 rounded-full flex items-center justify-center group-hover:border-green-400 transition-colors duration-300">
                    {/* <Icon className="w-8 h-8 text-gray-400 group-hover:text-green-400 transition-colors duration-300" /> */}
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-green-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-8">
                  {service.description}
                </p>
                <button className="inline-flex items-center text-white group-hover:text-green-400 transition-colors duration-300 text-sm font-medium">
                  Learn More
                  <Zap className="w-4 h-4 ml-2" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
