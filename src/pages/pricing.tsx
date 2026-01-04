"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ServiceKey } from "@/types/service";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ServiceModal from "@/components/services/service-modal";

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [isOpen, setIsOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<ServiceKey | null>(
    null
  );

  const handleOpen = (serviceId: ServiceKey) => {
    setActiveServiceId(serviceId);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveServiceId(null);
  };

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
    <section id="pricing" ref={sectionRef} className="py-24">
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
              onClick={() => handleOpen(item.id as ServiceKey)}
            >
              <div>
                <h3 className="text-xl font-bold h-10 text-green-400 mb-4">
                  {item.title}
                </h3>
                <p className="text-2xl h-14 font-bold text-white mb-4">
                  {item.price}
                </p>
                <p className="text-gray-400 mb-6 h-10 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <button className="w-full py-3 border border-gray-600 text-white rounded hover:border-green-400 hover:text-green-400 transition-all duration-300 text-sm font-medium">
                Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="sr-only">Pricing Details</DialogTitle>
          <DialogDescription className="sr-only">
            Detailed pricing information for our {activeServiceId} service.
          </DialogDescription>
          <div className="text-sm text-muted-foreground">
            {activeServiceId && (
              <ServiceModal
                serviceId={activeServiceId}
                isPricing={true}
                onClose={() => setIsOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
