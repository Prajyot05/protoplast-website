"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Printer,
  Settings,
  Cpu,
  DraftingCompassIcon as Drafting,
} from "lucide-react";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const services = [
    { icon: Printer, label: "3D Printing" },
    { icon: Settings, label: "CNC Cutting" },
    { icon: Cpu, label: "PCB Design" },
    { icon: Drafting, label: "CAD Modeling" },
  ];

  return (
    <section id="about" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            About Us
          </h2>
          <p className="text-lg text-gray-400">
            The story behind Protoplast.3D
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Story Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-white mb-8">
              Our Story – Protoplast.3D
            </h3>

            <p className="text-gray-400 leading-relaxed">
              It all started with a simple question:{" "}
              <span className="text-green-400 font-semibold">
                Why should innovation be limited by access to manufacturing?
              </span>
            </p>

            <p className="text-gray-400 leading-relaxed">
              We saw engineers struggling to bring their ideas to life, startups
              delaying product launches due to high prototyping costs, and
              businesses dependent on slow, expensive manufacturing methods.
              That&apos;s when{" "}
              <span className="text-green-400 font-semibold">
                Protoplast.3D
              </span>{" "}
              was born—out of a need to bridge the gap between creativity and
              production.
            </p>

            <p className="text-gray-400 leading-relaxed">
              What began as a small initiative has grown into a{" "}
              <span className="text-green-400 font-semibold">
                cutting-edge digital manufacturing hub
              </span>
              . From{" "}
              <span className="text-green-400 font-semibold">
                3D printing to CNC cutting, PCB designing to CAD modeling
              </span>
              , we&apos;ve built a space where{" "}
              <span className="text-green-400 font-semibold">
                ideas take shape, products evolve, and businesses scale faster
                than ever before
              </span>
              .
            </p>

            <p className="text-gray-400 leading-relaxed">
              At Protoplast.3D, we believe{" "}
              <span className="text-green-400 font-semibold">
                the future isn&apos;t something you wait for—it&apos;s something
                you create.
              </span>{" "}
              And we&apos;re here to help you build it.
            </p>
          </motion.div>

          {/* Visual Elements */}
          <motion.div
            className="grid grid-cols-2 gap-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.label}
                  className="text-center p-8 border border-gray-800 rounded-lg hover:border-green-400 transition-colors duration-300"
                >
                  <div className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:border-green-400 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-white font-medium">{service.label}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
