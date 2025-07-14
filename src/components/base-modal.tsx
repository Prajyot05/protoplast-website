"use client";

import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function BaseModal({
  open,
  onClose,
  title,
  children,
  className,
}: BaseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "rounded-2xl max-w-2xl w-full bg-gray-900 text-white shadow-lg backdrop-blur-md p-8 border border-green-400/20",
          className
        )}
      >
        {/* Close Button */}
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-green-400 transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <DialogTitle className="text-2xl font-bold text-green-400 border-b border-green-400/30 pb-4">
            {title}
          </DialogTitle>

          {children}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
