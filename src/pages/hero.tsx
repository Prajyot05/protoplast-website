"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { ServiceKey } from "@/types/service"
import { useState, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import ServiceModal from "@/components/services/service-modal"
import { ArrowRight, Sparkles, Zap } from "lucide-react"

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const services = [
    { id: "3d-printing", label: "3D Printing", icon: "🖨️", color: "from-blue-500 to-cyan-500" },
    { id: "cnc-cutting", label: "CNC Cutting", icon: "⚙️", color: "from-purple-500 to-pink-500" },
    { id: "cad-modeling", label: "CAD Modeling", icon: "📐", color: "from-green-500 to-emerald-500" },
    { id: "pcb-design", label: "PCB Design", icon: "🔌", color: "from-orange-500 to-red-500" },
    { id: "rapid-prototyping", label: "Rapid Prototyping", icon: "⚡", color: "from-yellow-500 to-orange-500" },
  ]

  const [isOpen, setIsOpen] = useState(false)
  const [activeServiceId, setActiveServiceId] = useState<ServiceKey | null>(null)
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  const handleOpen = (serviceId: ServiceKey) => {
    setActiveServiceId(serviceId)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setActiveServiceId(null)
  }

  return (
    <section ref={containerRef} className="min-h-screen relative overflow-hidden pt-20">
      {/* Animated Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
        <motion.video
          className="h-full w-full object-cover"
          src="/bg-bluish.mp4"
          autoPlay
          muted
          loop
          playsInline
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container z-10 mx-auto px-6 text-center relative min-h-screen flex flex-col justify-center">
        {/* Logo Section - Clean and Simple */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
          }}
          className="relative mb-8"
        >
          <Image
            alt="full logo"
            src="/logo-full-white.svg"
            className="mx-auto drop-shadow-2xl"
            width={400}
            height={400}
          />
        </motion.div>

        {/* Enhanced Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white max-w-5xl mx-auto leading-tight">
            Innovative Engineering Solutions for{" "}
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
              Tomorrow
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.div>
            </span>
          </h1>

          <motion.p
            className="text-lg md:text-xl text-gray-200 mt-6 max-w-2xl mx-auto font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Precision manufacturing meets cutting-edge technology. From concept to creation, we bring your boldest ideas
            to life.
          </motion.p>
        </motion.div>

        {/* Enhanced Service Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 py-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {services.map((service, index) => (
            <motion.button
              key={service.id}
              onClick={() => handleOpen(service.id as ServiceKey)}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              className="group relative px-6 md:px-8 py-4 border border-gray-600/50 text-white rounded-2xl backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-500 text-sm md:text-base font-medium overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated Background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                initial={false}
                animate={hoveredService === service.id ? { opacity: 0.2 } : { opacity: 0 }}
              />

              {/* Content */}
              <div className="relative flex items-center gap-3">
                <span className="text-xl">{service.icon}</span>
                <span>{service.label}</span>
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={hoveredService === service.id ? { x: 5 } : { x: 0 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>

              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl"
                initial={false}
                animate={
                  hoveredService === service.id
                    ? {
                        borderColor: "rgba(255,255,255,0.3)",
                        boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                      }
                    : {}
                }
              />
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-12"
        >
          <Link href="/products/687a816fa6b0f6a663493f5d">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <button className="group relative px-12 py-6 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-100 rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 overflow-hidden border-2 border-white/20 hover:border-white/40">
                {/* Content */}
                <div className="relative flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="font-bold">Explore Products</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </motion.div>
                </div>
              </button>
            </motion.div>
          </Link>

          {/* Additional CTA Text */}
          <motion.p
            className="text-gray-300 mt-4 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Discover our premium 3D printing solutions
          </motion.p>
        </motion.div>

        {/* Enhanced Service Modal */}
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="max-w-4xl bg-gray-900/95 border-gray-800/50 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {activeServiceId && <ServiceModal serviceId={activeServiceId} isPricing={false} onClose={handleClose} />}
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
