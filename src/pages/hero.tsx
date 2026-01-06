"use client";

import Link from "next/link";
import type { ServiceKey } from "@/types/service";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ServiceModal from "@/components/services/service-modal";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  const services = [
    { id: "3d-printing", label: "3D Printing" },
    { id: "cnc-cutting", label: "CNC Cutting" },
    { id: "cad-modeling", label: "CAD Modeling" },
    { id: "pcb-design", label: "PCB Design" },
    { id: "rapid-prototyping", label: "Rapid Prototyping" },
  ];

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

  return (
    <section className="relative min-h-screen bg-white flex flex-col pt-16 md:pt-20">
      <div className="container mx-auto px-6 relative z-10 flex-grow flex flex-col justify-center">
        {/* Main Hero Content */}
        <div className="flex flex-col items-center text-center py-12">
          {/* Content */}
          <div className="space-y-8 max-w-4xl">
            <div className="inline-block px-3 py-1 border border-green-500/30 rounded-full bg-green-500/10 backdrop-blur-sm">
              <span className="text-xs font-medium text-green-700 tracking-wider uppercase">
                Featured Project
              </span>
            </div>

            <h1 className="text-black text-5xl md:text-7xl font-medium leading-tight tracking-tight">
              Engineering the <br />
              <span className="text-green-600">
                Future of Manufacturing
              </span>
            </h1>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Protoplast bridges the gap between imagination and industrial reality. We empower innovators with high-precision manufacturing delivering excellence in every layer, cut, and circuit.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/products">
                <button className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-green-500/20">
                  Explore Products
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="#services">
                <button className="btn-outline bg-white hover:bg-gray-50">
                  Our Services
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Service Quick Links */}
        <div className="w-full mt-12 md:mt-20 pb-10">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleOpen(service.id as ServiceKey)}
                className="px-4 py-3 md:px-8 md:py-4 border border-gray-200 text-gray-800 text-sm md:text-lg font-medium 
                         hover:border-green-500 hover:text-green-600 hover:bg-white transition-all duration-300
                         bg-white rounded-none"
              >
                {service.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service Modal */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl bg-white border-gray-200 p-0 overflow-hidden max-h-[90dvh] w-[95vw] flex flex-col rounded-[2rem] sm:rounded-3xl">
          <DialogTitle className="sr-only">Service Details</DialogTitle>
          <DialogDescription className="sr-only">
            Detailed information about our manufacturing services.
          </DialogDescription>
          {activeServiceId && (
            <ServiceModal
              serviceId={activeServiceId}
              isPricing={false}
              onClose={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
