"use client";

import Image from "next/image";

export default function CustomersCarousel() {
    const trustedCompanies = [
        { src: "/customers/company-caltronics.jpeg", name: "Caltronics" },
        { src: "/customers/company-kfupm.png", name: "KFUPM" },
        { src: "/customers/company-p.jpeg", name: "Company P" },
        { src: "/customers/company-pbr-research.png", name: "PBR Research" },
        { src: "/customers/company-sg.jpeg", name: "SG" },
        { src: "/customers/company-stfs.jpeg", name: "STFS" },
        { src: "/customers/company-vidarbha-welfare-society.jpeg", name: "Vidarbha Welfare Society" },
    ];

    return (
        <section id="customers-carousel">
            <div className="container mx-auto px-6">
                <div className="py-10 border-y border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-8">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Trusted by
                        </span>

                        {/* Wrapper mask */}
                        <div className="flex-1 overflow-hidden flex whitespace-nowrap">
                            {/* Continuous track */}
                            <div className="flex gap-16 items-center animate-marquee shrink-0 min-w-full justify-around">
                                {[...trustedCompanies, ...trustedCompanies].map((company, index) => (
                                    /* 
                                      The Visual Equalizer:
                                      We give the wrapper a fixed width and height (e.g., w-32 h-12). 
                                      This creates an invisible uniform boundary box for each logo.
                                    */
                                    <div
                                        key={index}
                                        className="relative w-28 h-10 shrink-0 contrast-200 transition-all duration-300"
                                    >
                                        <Image
                                            src={company.src}
                                            alt={`${company.name} logo`}
                                            fill
                                            sizes="120px"
                                            className="object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}