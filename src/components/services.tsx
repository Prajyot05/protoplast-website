"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Printer, Cpu, Settings, Zap } from "lucide-react";

interface ServicesProps {
  onServiceClick: (serviceId: string) => void;
}

export default function Services({ onServiceClick }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const services = [
    {
      id: "3d-printing",
      icon: Printer,
      title: "3D Printing & Prototyping",
      description:
        "High-precision, rapid prototypes for product development, medical applications, and industrial needs.",
    },
    {
      id: "pcb-design",
      icon: Cpu,
      title: "PCB Designing & Manufacturing",
      description:
        "Custom circuit board design, prototyping, and production for electronics projects of all scales.",
    },
    {
      id: "cnc-cutting",
      icon: Settings,
      title: "CNC Cutting & Machining",
      description:
        "Precision cutting for metals, plastics, and composites for both personal and commercial projects.",
    },
  ];

  return (
    <section id="services" ref={sectionRef} className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Our Services Overview
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Your one-stop solution for advanced manufacturing. We provide
            top-quality services to bring your ideas to life with precision and
            efficiency. Click buttons above for details.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.id}
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.8, delay: index * 0.2 }}
                onClick={() => onServiceClick(service.id)}
              >
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                  <div className="w-20 h-20 border-2 border-gray-600 rounded-full flex items-center justify-center group-hover:border-green-400 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-gray-400 group-hover:text-green-400 transition-colors duration-300" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-green-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-8">
                  {service.description}
                </p>
                <button className="inline-flex items-center text-white hover:text-green-400 transition-colors duration-300 text-sm font-medium">
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
