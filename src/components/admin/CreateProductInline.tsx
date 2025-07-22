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
          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200"
          onClick={() => {
            setShowForm(true);
            setSubmitted(false); // reset on open
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Product
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
            // new optional prop
            onSubmitted={() => setSubmitted(true)}
          />
        </div>
      )}
    </div>
  );
}
