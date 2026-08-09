"use client";

import Link from "next/link";
import type { ServiceKey } from "@/types/service";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ServiceModal from "@/components/services/service-modal";
import { ArrowUpRight } from "lucide-react";
import HeroVideo from "@/components/hero-video";
import CustomersCarousel from "@/components/customers-carousel";

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<ServiceKey | null>(
    null,
  );

  const handleClose = () => {
    setIsOpen(false);
    setActiveServiceId(null);
  };

  return (
    <section className="relative min-h-screen bg-white flex flex-col pt-16 md:pt-20">
      <div className="container mx-auto px-6 relative z-10 flex-grow flex flex-col justify-center">
        {/* Main Hero Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between py-12 gap-12 lg:gap-8">

          {/* Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 lg:w-1/2">
            <div className="space-y-3 w-full">
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-semibold tracking-tighter leading-[1.05] md:leading-[0.95] text-black">
                {/* Line 1 Group */}
                <span className="md:block">
                  Prototyping <span className="text-gray-400 font-normal">made</span>
                  {/* On small screens, this is an inline space. On large screens, it breaks to a new line. */}
                  <span className="inline md:block text-gray-400 font-normal md:mt-1"> easy.</span>
                </span>

                {/* Line 2 Group */}
                <span className="block text-green-600 font-bold mt-4 md:mt-6 xl:mt-8">
                  Innovation <span className="text-gray-400 font-normal">made</span>
                  {/* On small screens, this is an inline space. On large screens, it breaks to a new line. */}
                  <span className="inline md:block text-gray-400 font-normal md:mt-1"> real.</span>
                </span>
              </h1>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <Link href="/products">
                <button className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-green-500/20 px-6 py-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all font-medium">
                  Explore Products
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="#services">
                <button className="btn-outline px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium">
                  Our Services
                </button>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative z-0 flex items-center justify-center">
            {/* <HeroModel /> */}
            <HeroVideo />
          </div>
        </div>

        {/* Service Quick Links */}
        {/* <div className="w-full mt-12 md:mt-20 pb-10">
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
        </div> */}
      </div>

      <CustomersCarousel />

      {/* Service Modal */}
      {/* <Dialog open={isOpen} onOpenChange={handleClose}>
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
      </Dialog> */}
    </section>
  );
}
