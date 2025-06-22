import ServicesClient from "@/components/services/services-client";

export default function Services() {
  const services = [
    {
      id: "3d-printing",
      icon: (
        <div className="service-icon text-gray-400 group-hover:text-green-400 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[50px] h-[50px]"
          >
            <rect x="20" y="60" width="60" height="25" rx="2" />
            <rect x="35" y="15" width="30" height="45" rx="2" />
            <line
              x1="50"
              y1="35"
              x2="50"
              y2="60"
              className="printer-filament"
            />
            <rect x="40" y="85" width="20" height="5" />
            <circle cx="50" cy="60" r="5" className="printer-nozzle" />
          </svg>
        </div>
      ),
      title: "3D Printing & Prototyping",
      description:
        "High-precision, rapid prototypes for product development, medical applications, and industrial needs.",
    },
    {
      id: "pcb-design",
      icon: (
        <div className="service-icon text-gray-400 group-hover:text-green-400 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[50px] h-[50px]"
          >
            <rect x="15" y="15" width="70" height="70" rx="2" />
            <circle cx="30" cy="30" r="5" className="component-pulse" />
            <circle cx="70" cy="30" r="5" className="component-pulse" />
            <circle cx="30" cy="70" r="5" className="component-pulse" />
            <circle cx="70" cy="70" r="5" className="component-pulse" />
            <path
              d="M30 30 L70 30 L70 70 L30 70 Z"
              className="trace-animation"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="3"
              className="led-blink"
              fill="currentColor"
            />
            <line x1="40" y1="40" x2="60" y2="40" className="circuit-pulse" />
            <line x1="40" y1="60" x2="60" y2="60" className="circuit-pulse" />
          </svg>
        </div>
      ),
      title: "PCB Designing & Manufacturing",
      description:
        "Custom circuit board design, prototyping, and production for electronics projects of all scales.",
    },
    {
      id: "cnc-cutting",
      icon: (
        <div className="service-icon text-gray-400 group-hover:text-green-400 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-[50px] h-[50px]"
          >
            <circle cx="50" cy="50" r="35" fill="none" strokeWidth="1" />
            <circle cx="50" cy="50" r="5" />
            <path
              d="M50 15 L85 50 L50 85 L15 50 Z"
              className="cutter-blade"
              fill="none"
            />
            <path d="M30 30 L70 70" strokeWidth="3" />
            <path d="M30 70 L70 30" strokeWidth="3" />
          </svg>
        </div>
      ),
      title: "CNC Cutting & Machining",
      description:
        "Precision cutting for metals, plastics, and composites for both personal and commercial projects.",
    },
  ];

  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Our Services
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Your one-stop solution for advanced manufacturing. We provide
            top-quality services to bring your ideas to life with precision and
            efficiency. Click buttons above for details.
          </p>
        </div>

        <ServicesClient services={services} />
      </div>
    </section>
  );
}
