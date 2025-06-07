"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/hero";
import Services from "@/components/services";
import Pricing from "@/components/pricing";
import About from "@/components/about";
import Footer from "@/components/footer";
import ServiceModal from "@/components/service-modal";
import Header from "@/components/header";

export default function Home() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [isPricingModal, setIsPricingModal] = useState(false);

  const openServiceModal = (serviceId: string, isPricing = false) => {
    setActiveService(serviceId);
    setIsPricingModal(isPricing);
  };

  const closeServiceModal = () => {
    setActiveService(null);
    setIsPricingModal(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeServiceModal();
      }
    };

    if (activeService) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [activeService]);

  return (
    <motion.main
      className="min-h-screen bg-gray-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <Hero onServiceClick={openServiceModal} />
      <Services onServiceClick={openServiceModal} />
      <Pricing onServiceClick={openServiceModal} />
      <About />
      <Footer />

      {activeService && (
        <ServiceModal
          serviceId={activeService}
          isPricing={isPricingModal}
          onClose={closeServiceModal}
        />
      )}
    </motion.main>
  );
}
