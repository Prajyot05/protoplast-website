"use client";

export default function About() {
  const coreValues = [
    "Innovation",
    "Precision",
    "Quality",
    "Reliability",
    "Innovation",
    "Precision",
    "Quality",
    "Reliability",
  ];


  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Manifesto / Vision */}
        <div className="py-16 md:py-24 border-t border-gray-200">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <p className="text-sm md:text-base text-green-600 font-medium uppercase tracking-widest">
              The Vision
            </p>
            <h3 className="text-3xl md:text-5xl font-medium leading-tight text-black">
              We envision a future where <span className="text-gray-400">manufacturing adapts to imagination</span>, not the other way around.
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Democratizing production by bringing industrial-grade capabilities to every engineer, startup, and business.
            </p>
          </div>
        </div>

        {/* Our Story - Sticky Layout */}
        <div className="py-16 md:py-24 border-t border-gray-200">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky top-32">
                <h3 className="text-6xl md:text-8xl font-bold text-gray-100 mb-4 -ml-1">01</h3>
                <h3 className="text-2xl font-medium text-black mb-4">Our Journey</h3>
                <p className="text-gray-500 leading-relaxed">
                  From a simple question to a comprehensive manufacturing hub.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-20">
              <div className="group">
                <h4 className="text-xl font-medium text-black mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-green-500"></span>
                  The Spark
                </h4>
                <p className="text-gray-600 leading-relaxed text-lg pl-11">
                  It began with a frustration: why is professional manufacturing so inaccessible? We saw brilliant ideas dying on the drawing board because prototyping was too slow or too expensive. We decided to change that.
                </p>
              </div>

              <div className="group">
                <h4 className="text-xl font-medium text-black mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-gray-300 group-hover:bg-green-500 transition-colors"></span>
                  The Evolution
                </h4>
                <p className="text-gray-600 leading-relaxed text-lg pl-11">
                  What started as a garage operation has grown into a digital manufacturing ecosystem. We&apos;ve integrated 3D printing, CNC machining, and PCB design into a single, fluid workflow.
                </p>
              </div>

              <div className="group">
                <h4 className="text-xl font-medium text-black mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-gray-300 group-hover:bg-green-500 transition-colors"></span>
                  The Future
                </h4>
                <p className="text-gray-600 leading-relaxed text-lg pl-11">
                  We aren&apos;t just building parts; we&apos;re building the infrastructure for the next generation of hardware innovation. Excellence in every layer, cut, and circuit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values Marquee */}
        <div className="py-12 border-t border-gray-200 overflow-hidden">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Our Core Values
            </span>
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-16 animate-marquee">
                {[...coreValues, ...coreValues].map((value, index) => (
                  <span
                    key={index}
                    className="text-2xl md:text-3xl font-medium text-gray-300 whitespace-nowrap hover:text-green-500 transition-colors duration-300"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
