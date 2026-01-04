"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductForm from "./productForm";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function CreateProductInline() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex justify-end">
      {!showForm ? (
        <Button
          className="bg-black hover:bg-gray-800 text-white rounded-full px-8 h-14 text-lg font-medium transition-all duration-300 shadow-xl shadow-black/10 flex items-center gap-3"
          onClick={() => {
            setShowForm(true);
            setSubmitted(false); // reset on open
          }}
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </Button>
      ) : (
        <div className="w-full max-w-2xl">
          <ProductForm
            open={true}
            setOpen={(val: any) => {
              setShowForm(val);
              if (val === false && submitted) {
                toast.success("Product created successfully!");
              }
            }}
            onSubmitted={() => setSubmitted(true)}
          />
        </div>
      )}
    </div>
  );
}
