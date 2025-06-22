"use client";

import { JSX, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Zap } from "lucide-react";
import { ServiceKey } from "@/types/service";
import { Dialog, DialogContent } from "../ui/dialog";
import ServiceModal from "./service-modal";

interface Service {
  id: string;
  icon: JSX.Element;
  title: string;
  description: string;
}

interface ServicesClientProps {
  services: Service[];
}

export default function ServicesClient({ services }: ServicesClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
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

  return (
    <div ref={sectionRef}>
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      />

      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            className="text-center group cursor-pointer service-card"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            onClick={() => handleOpen(service.id as ServiceKey)}
          >
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 border-2 border-gray-600 rounded-full flex items-center justify-center group-hover:border-green-400 transition-colors duration-300">
                {service.icon}
              </div>
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-green-400 transition-colors duration-300 h-14">
              {service.title}
            </h3>
            <p className="text-gray-400 leading-relaxed mb-8 h-14">
              {service.description}
            </p>
            <p className="inline-flex md:pt-5 lg:pt-0 items-center text-white group-hover:text-green-400 transition-colors duration-300 text-sm font-medium">
              Learn More
              <Zap className="w-4 h-4 ml-2" />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-sm text-muted-foreground">
            {activeServiceId && (
              <ServiceModal
                serviceId={activeServiceId}
                isPricing={false}
                onClose={() => setIsOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
