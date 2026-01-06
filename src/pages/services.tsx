"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ServiceKey } from "@/types/service";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ServiceModal from "@/components/services/service-modal";

export default function Services() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<ServiceKey | null>(null);

  const handleOpen = (serviceId: ServiceKey) => {
    setActiveServiceId(serviceId);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveServiceId(null);
  };

  const services = [
    {
      id: "3d-printing",
      title: "3D Printing",
      description:
        "High-precision, rapid prototypes for product development, medical applications, and industrial needs.",
    },
    {
      id: "pcb-design",
      title: "PCB Manufacturing",
      description:
        "Custom circuit board design, prototyping, and production for electronics projects of all scales.",
    },
    {
      id: "cnc-cutting",
      title: "CNC Machining",
      description:
        "Precision cutting for metals, plastics, and composites for both personal and commercial projects.",
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-16">
          <div className="section-label mb-4">OUR SERVICES</div>
          <h2 className="text-black mb-6">
            Our Capabilities
          </h2>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            Comprehensive manufacturing solutions tailored to your project&apos;s needs, from initial prototype to final production.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {services.map((service, index) => (
            <div
              key={service.id}
              onClick={() => handleOpen(service.id as ServiceKey)}
              className="group cursor-pointer border-t border-gray-200 py-12 hover:bg-gray-50 transition-colors duration-300"
            >
              <div className="grid md:grid-cols-12 gap-8 items-center">
                {/* Number */}
                <div className="md:col-span-2 text-4xl font-light text-gray-300 group-hover:text-green-500 transition-colors duration-300">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Title */}
                <div className="md:col-span-4">
                  <h3 className="text-3xl font-medium text-black group-hover:text-green-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="md:col-span-4">
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="md:col-span-2 flex justify-end">
                  <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center 
                                group-hover:bg-green-500 group-hover:border-green-500 group-hover:text-white transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 transform group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl bg-white border-gray-200 p-0 overflow-hidden max-h-[90dvh] w-[95vw] flex flex-col rounded-[2rem] sm:rounded-3xl">
          <DialogTitle className="sr-only">Service Details</DialogTitle>
          <DialogDescription className="sr-only">
            Detailed information about our {activeServiceId} service.
          </DialogDescription>
          {activeServiceId && (
            <ServiceModal
              serviceId={activeServiceId}
              isPricing={false}
              onClose={() => setIsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
