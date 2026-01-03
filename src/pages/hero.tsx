"use client";

import Image from "next/image";
import Link from "next/link";
import type { ServiceKey } from "@/types/service";
import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
    <section className="relative min-h-screen bg-white">
      <div className="container mx-auto px-6 relative z-10 pt-20">
        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-5rem)] py-12">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block px-3 py-1 border border-green-500/30 rounded-full bg-green-500/10 backdrop-blur-sm">
              <span className="text-xs font-medium text-green-700 tracking-wider uppercase">
                Featured Project
              </span>
            </div>

            <h1 className="text-black text-5xl md:text-7xl font-medium leading-tight tracking-tight">
              Engineering the <br />
              <span className="text-green-600">
                Future
              </span>{" "}
              of Manufacturing
            </h1>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-xl">
              We bridge the gap between concept and reality with industrial-grade 3D printing, CNC machining, and PCB design.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/products/687a816fa6b0f6a663493f5d">
                <button className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-green-500/20">
                  Explore Products
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="#services">
                <button className="btn-outline bg-white/50 backdrop-blur-sm hover:bg-white">
                  Our Services
                </button>
              </Link>
            </div>
          </div>

          {/* Right Content - Product Image */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              <Image
                alt="Protoplast 3D Printing"
                src="/logo-full-black.svg"
                width={500}
                height={500}
                className="w-full h-auto opacity-90"
                priority
              />
            </div>
          </div>
        </div>

        {/* Service Quick Links */}
        <div className="absolute bottom-10 left-0 w-full hidden md:block">
          <div className="flex flex-wrap justify-center gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleOpen(service.id as ServiceKey)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium 
                         hover:border-green-500 hover:text-green-600 hover:bg-white transition-all duration-300
                         bg-white/40 backdrop-blur-md rounded-full"
              >
                {service.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service Modal */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl bg-white border-gray-200">
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
