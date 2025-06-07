"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

interface PricingProps {
  onServiceClick: (serviceId: string, isPricing?: boolean) => void;
}

export default function Pricing({ onServiceClick }: PricingProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const pricingData = [
    {
      id: "3d-printing",
      title: "FDM 3D Printing",
      price: "Starts from ₹3 / gram",
      description: "Based on material (PLA, ABS, PETG) and complexity.",
    },
    {
      id: "3d-printing",
      title: "Resin 3D Printing",
      price: "Starts from ₹10 / gram",
      description: "High detail SLA/DLP printing.",
    },
    {
      id: "cnc-cutting",
      title: "CNC Cutting",
      price: "Starts from ₹15 / cm³",
      description: "Varies by material, thickness, complexity.",
    },
    {
      id: "cad-modeling",
      title: "CAD Modeling",
      price: "Starts from ₹500 / design",
      description: "Based on project scope and complexity.",
    },
    {
      id: "pcb-design",
      title: "PCB Design",
      price: "Starts from ₹500",
      description: "Based on complexity, layers, size.",
    },
    {
      id: "pcb-design",
      title: "PCB Manufacturing",
      price: "Start from ₹500 / PCB",
      description: "Based on quantity, size, layers.",
    },
  ];

  return (
    <section id="pricing" ref={sectionRef} className="py-24 bg-gray-950">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Pricing
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Transparent pricing models designed to fit your budget and project
            scope. See details in service descriptions or contact us for custom
            quotes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          {pricingData.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              className="bg-gray-900 border border-gray-800 rounded-lg p-8 hover:border-green-400 transition-colors duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              onClick={() => onServiceClick(item.id, true)}
            >
              <h3 className="text-xl font-bold text-green-400 mb-4">
                {item.title}
              </h3>
              <p className="text-2xl font-bold text-white mb-4">{item.price}</p>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {item.description}
              </p>
              <button className="w-full py-3 border border-gray-600 text-white rounded hover:border-green-400 hover:text-green-400 transition-all duration-300 text-sm font-medium">
                Details
              </button>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center bg-gray-900 rounded-lg p-12 border border-gray-800 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to start your project?
          </h3>
          <p className="text-lg text-gray-400 mb-8">
            Get in touch for a personalized quote today!
          </p>
          <Link
            href="https://wa.me/919404570482"
            className="inline-flex items-center px-8 py-4 bg-green-500 text-white font-semibold rounded hover:bg-green-400 transition-all duration-300 text-sm"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4 8.95 8.95 0 0 0 3.1 12.95a8.93 8.93 0 0 0 1.32 4.69L3 22l4.47-1.17a8.95 8.95 0 0 0 13.53-7.88 8.85 8.85 0 0 0-3.4-6.63zm-5.55 13.68a7.45 7.45 0 0 1-3.79-1.04l-.27-.16-2.82.74.75-2.75-.18-.28a7.43 7.43 0 0 1 9.78-10.19 7.36 7.36 0 0 1 2.83 5.52 7.45 7.45 0 0 1-7.46 8.16z" />
              <path d="M9.06 7.76c-.16-.09-.59-.29-.68-.32-.09-.03-.16-.05-.22.05-.07.09-.26.32-.32.39-.06.07-.11.08-.2 0-.1-.08-.43-.17-.82-.54a3 3 0 0 1-.56-.7c-.06-.1 0-.15.04-.2l.14-.16c.05-.06.07-.1.1-.17.03-.07.01-.13-.01-.18-.03-.05-.22-.52-.3-.72-.07-.2-.15-.17-.21-.17h-.18c-.07 0-.17.03-.26.14-.09.11-.34.35-.34.85s.35.98.4 1.05c.04.07.62.95 1.5 1.33.21.09.38.14.5.18.21.07.41.06.56.03.17-.03.52-.21.6-.42.06-.2.06-.38.04-.42-.02-.03-.09-.08-.18-.12z" />
            </svg>
            Contact us on WhatsApp
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
