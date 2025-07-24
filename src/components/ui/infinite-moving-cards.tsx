"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      const duration =
        speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  };

  const addAnimation = () => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current?.appendChild(duplicatedItem);
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  };

  addAnimation();
}, [direction, speed]); // ✅ ADD these


  const [start, setStart] = useState(false);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-6",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="relative w-[350px] md:w-[450px] shrink-0 rounded-2xl border border-green-400/20 bg-gradient-to-br from-[#0f1114] to-[#030712] p-6 shadow-lg transition-shadow hover:shadow-green-300/10"
          >
            <blockquote className="relative z-10 flex flex-col justify-between h-full">
              {/* Top border accent glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C1FF72] to-transparent opacity-40 rounded-t-xl" />

              {/* Quotation mark icon */}
              <div className="mb-4 text-green-300 text-3xl font-bold leading-none">
                &ldquo;
              </div>

              {/* Quote */}
              <p className="text-white text-base md:text-lg leading-relaxed font-light">
                {item.quote}
              </p>

              {/* Divider line */}
              <div className="mt-6 border-t border-green-400/10" />

              {/* Person Info */}
              <div className="flex items-center gap-4 mt-auto">
                {/* Image Placeholder */}
                <div className="w-12 h-12 rounded-full bg-black border border-gray-700 flex-shrink-0 shadow-inner shadow-gray-800 group-hover:shadow-[#C1FF72]/40 transition"></div>

                <div className="flex flex-col">
                  <span className="text-[#C1FF72] font-semibold text-sm md:text-base">
                    {item.name}
                  </span>
                  <span className="text-gray-400 text-xs md:text-sm">
                    {item.title}
                  </span>
                </div>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
