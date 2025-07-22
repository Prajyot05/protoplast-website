"use client";

import ProductForm from "./productForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreateProduct() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="explore"
        onClick={() => setOpen(true)}
        className="mb-4 text-white explore"
      >
        Add Product
      </Button>
      <ProductForm
        open={open}
        setOpen={(val) => {
          setOpen(val);
          if (!val) {
            toast.success("Product created successfully!");
          }
        }}
      />
    </>
  );
}
