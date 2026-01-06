"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When the path or search params change, we stop loading
    setIsLoading(false);
  }, [pathname, searchParams]);

  // Listen for the custom "navigation-start" event
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleStop = () => setIsLoading(false);

    window.addEventListener("navigation-start", handleStart);
    // Standard link clicks and router.push won't trigger this by default, 
    // so we'll need to dispatch it from our custom Link component.
    
    return () => {
      window.removeEventListener("navigation-start", handleStart);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0 }}
          style={{ originX: 0 }}
          animate={{ 
            scaleX: [0, 0.7, 0.9, 0.95],
            transition: { 
              duration: 10,
              times: [0, 0.2, 0.8, 1],
              ease: "circOut"
            }
          }}
          exit={{ 
            scaleX: 1, 
            opacity: 0,
            transition: { duration: 0.3 }
          }}
          className="fixed top-0 left-0 right-0 h-1 bg-green-500 z-[1000] shadow-[0_0_10px_rgba(34,197,94,0.5)]"
        />
      )}
    </AnimatePresence>
  );
}

export function triggerNavigation() {
  window.dispatchEvent(new CustomEvent("navigation-start"));
}
