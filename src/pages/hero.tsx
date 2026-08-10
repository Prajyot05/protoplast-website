"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import HeroVideo from "@/components/hero-video";
import CustomersCarousel from "@/components/customers-carousel";

export default function Hero() {
  return (
    <div className="relative flex flex-col w-full">
      {/* Upper Hero Block: Contains Video and Main Content */}
      <section className="relative min-h-screen bg-black flex flex-col pt-16 md:pt-20 overflow-hidden">
        {/* Background Video Wrapper (Bounded inside this section only) */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <HeroVideo />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex-grow flex flex-col justify-center">
          {/* Main Hero Content - Changed to a clean, max-width centered column layout */}
          <div className="flex flex-col items-center justify-center text-center py-12 max-w-5xl mx-auto w-full">

            {/* Text Content - Forces items, text alignment, and buttons to center globally */}
            <div className="flex flex-col items-center text-center space-y-8 w-full">
              <div className="space-y-3 w-full">
                <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-semibold tracking-tighter leading-[1.05] md:leading-[0.95] text-white">
                  {/* Line 1 Group - Changed line breaks to look balanced when centered */}
                  <span className="block">
                    Prototyping <span className="text-gray-300 font-normal">made</span> easy.
                  </span>

                  {/* Line 2 Group */}
                  <span className="block text-green-400 font-bold mt-2 md:mt-4">
                    Innovation <span className="text-gray-300 font-normal">made</span> real.
                  </span>
                </h1>
              </div>

              {/* Buttons Wrapper - Centered for all screen sizes */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link href="/products">
                  <button className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-white/10 px-6 py-3 rounded-full bg-white text-black hover:bg-gray-100 transition-all font-medium">
                    Explore Products
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="#services">
                  <button className="btn-outline px-6 py-3 rounded-full border border-white !border-white !text-white hover:bg-white/10 transition-all font-medium">
                    Our Services
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Carousel sits outside the video block on its own background */}
      <div className="relative bg-white z-10 pt-5">
        <CustomersCarousel />
      </div>
    </div>
  )
}
