"use client";

import ProductForm from "./productForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CreateProduct() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-black hover:bg-gray-800 text-white rounded-full px-8 h-14 text-lg font-medium transition-all duration-300 shadow-xl shadow-black/10 flex items-center gap-3"
      >
        <Plus className="w-5 h-5" />
        Add Product
      </Button>
      <ProductForm
        open={open}
        setOpen={(val) => {
          setOpen(val);
          if (!val) {
            // Note: The toast should probably only show if a product was actually created,
            // but keeping the logic as is to avoid changing behavior.
          }
        }}
      />
    </>
  );
}
