"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);

  const services = [
    {
      id: "pcb-design",
      title: "PCB Design & Manufacturing",
      features: ["Multilayer PCB design", "PCB layout and routing", "High-density PCB design", "PCB prototyping", "PCB fabrication", "PCB assembly", "DFM/DFA optimization", "PCB testing and troubleshooting", "In-house PCB manufacturing R&D"]
    },
    {
      id: "product-design",
      title: "Product Design & CAD",
      features: ["Industrial product design", "Mechanical design", "3D CAD modelling", "Engineering drawings", "Enclosure and housing design", "Design for manufacturing", "Prototype-to-production design", "Reverse engineering and design optimization"]
    },
    {
      id: "3d-printing",
      title: "Additive Manufacturing",
      features: ["FDM 3D printing", "SLA 3D printing", "Rapid prototyping", "Functional prototypes", "Custom parts and components", "Small-batch manufacturing", "Prototype finishing and post-processing"]
    },
    {
      id: "product-rd",
      title: "Product R&D",
      features: ["Complete product research and development", "Concept → engineering → prototype → validation", "Electronics R&D", "Mechanical R&D", "Embedded systems development", "Product testing and iteration", "Proof-of-concept development"]
    },
    {
      id: "electronics-systems",
      title: "Electronics & Embedded Systems",
      features: ["Custom electronic systems", "Embedded hardware", "Microcontroller-based systems", "Sensor integration", "Data acquisition systems", "IoT hardware", "Custom PCBs and electronics", "Firmware development"]
    },
    {
      id: "iot-industrial",
      title: "IoT & Industrial Systems",
      features: ["IoT device development", "Industrial monitoring systems", "AQMS (Air Quality Monitoring Systems)", "EMS (Environmental Monitoring Systems)", "Industrial data loggers", "Remote monitoring systems", "Cloud-connected devices", "ThingsBoard-based IoT deployments"]
    },
    {
      id: "server-infrastructure",
      title: "Server & Infrastructure Solutions",
      features: ["Linux-based server setup", "Custom server creation", "Linux/Unix-based infrastructure", "Self-hosted services", "IoT server infrastructure", "Private cloud/server deployments", "Database and application server setup"]
    },
    {
      id: "oem-odm",
      title: "OEM / ODM Services",
      features: ["Custom product development", "Electronics OEM", "Electronics ODM", "Mechanical/product OEM", "Prototype-to-production services", "Custom hardware development", "White-label technology solutions"]
    }
  ];

  const handleRowClick = (index: number) => {
    // Only toggle/select on smaller viewports where clicking matters
    if (window.innerWidth < 1024) {
      setActiveIndex(activeIndex === index ? -1 : index);
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">

        {/* Section Header */}
        <div className="mb-16 border-b border-gray-200 pb-8">
          <div className="text-xs font-medium text-green-600 uppercase tracking-widest mb-2">Capabilities</div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black">What we do</h2>
        </div>

        {/* Dynamic Structural Grid */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Left Side: Professional Vertical Stack + Mobile Accordion Injection */}
          <div className="lg:col-span-7 border-b border-gray-200">
            {services.map((service, index) => {
              const isCurrentActive = activeIndex === index;

              return (
                <div key={service.id} className="border-t border-gray-200">
                  {/* Service Header Row */}
                  <div
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => handleRowClick(index)}
                    className={`group py-8 px-4 -mx-4 transition-all duration-200 flex items-center justify-between cursor-pointer lg:cursor-default ${isCurrentActive ? 'bg-gray-50/70' : 'bg-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-8">
                      <span className={`text-sm font-medium transition-colors duration-200 w-6 ${isCurrentActive ? 'text-green-600' : 'text-gray-300'
                        }`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className={`text-xl md:text-2xl font-medium transition-colors duration-200 ${isCurrentActive ? 'text-green-600' : 'text-black'
                        }`}>
                        {service.title}
                      </h3>
                    </div>

                    {/* Aesthetic Arrow Indicator */}
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${isCurrentActive
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-200 text-gray-400'
                      }`}>
                      <ArrowUpRight className={`w-4 h-4 transition-transform duration-200 ${isCurrentActive ? 'rotate-45' : ''
                        }`} />
                    </div>
                  </div>

                  {/* Mobile Accordion Container (Hidden on lg desktop viewports) */}
                  <div
                    className={`grid lg:hidden transition-all duration-300 ease-in-out ${isCurrentActive ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                      }`}
                  >
                    <div className="overflow-hidden px-4 space-y-3">
                      {service.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-2" />
                          <span className="leading-tight font-normal">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Corporate Editorial Display Dock (Hidden on mobile/tablet viewports) */}
          <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-white border border-gray-200 rounded-xl p-8 min-h-[420px] flex flex-col justify-between shadow-sm">

              <div>
                {/* Header label */}
                <div className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-6 pb-3 border-b border-gray-100">
                  Core Specializations
                </div>

                {/* Dynamic Content Frame */}
                <div className="space-y-4">
                  {services[activeIndex] && services[activeIndex].features.map((feature, fIdx) => (
                    <div
                      key={`${activeIndex}-${fIdx}`}
                      className="flex items-start gap-3 text-sm text-gray-600 animate-[fadeIn_0.3s_ease-out_forwards]"
                      style={{ animationDelay: `${fIdx * 25}ms` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-2" />
                      <span className="leading-tight font-normal">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom System Metadata Anchor */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-medium tracking-wide">
                <span>0{(activeIndex >= 0 ? activeIndex + 1 : 1).toString().padStart(2, "0")} &mdash; Overview</span>
                <span className="text-gray-400 font-normal">Hover rows to cycle breakdown</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}