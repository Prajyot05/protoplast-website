"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import BaseModal from "@/components/base-modal";
import { useProductStore } from "@/stores/useProductStore";
import type { ProductType } from "@/models/Product";
import {
  createProduct as createProductOnServer,
  updateProduct as updateProductOnServer,
} from "@/actions/products";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export interface ProductFormProps {
  product?: ProductType;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmitted?: () => void; 
}

const normalizeImage = (url: string) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http") || url.startsWith("/")) return url;
  return "/" + url.replace(/^\.?\//, "");
};

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be ≥ 0"),
  stock: z.coerce.number().min(0, "Stock can't be negative"),
  image: z.string().url("Must be a valid URL"),
  printerSpeed: z.coerce.number().optional(),
  maxSpeed: z.coerce.number().optional(),
  acceleration: z.coerce.number().optional(),
  maxAcceleration: z.coerce.number().optional(),
  volumeX: z.coerce.number().optional(),
  volumeY: z.coerce.number().optional(),
  volumeZ: z.coerce.number().optional(),
  maxHeatbedTemp: z.coerce.number().optional(),
  maxHotendTemp: z.coerce.number().optional(),
  supportedFilaments: z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export default function ProductForm({ product, open, setOpen, onSubmitted }: ProductFormProps) {
  const { addToStore, updateInStore } = useProductStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock: 0,
      image: "",
      printerSpeed: undefined,
      maxSpeed: undefined,
      acceleration: undefined,
      maxAcceleration: undefined,
      volumeX: undefined,
      volumeY: undefined,
      volumeZ: undefined,
      maxHeatbedTemp: undefined,
      maxHotendTemp: undefined,
      supportedFilaments: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title ?? "",
        description: product.description ?? "",
        price: product.price ?? 0,
        stock: product.stock ?? 0,
        image: normalizeImage(product.images?.[0]) ?? "",
        printerSpeed: Number(product?.specs?.printerSpeed ?? "") || undefined,
        maxSpeed: Number(product?.specs?.maxSpeed ?? "") || undefined,
        acceleration: Number(product?.specs?.acceleration ?? "") || undefined,
        maxAcceleration: Number(product?.specs?.maxAcceleration ?? "") || undefined,
        volumeX: Number(product?.specs?.volumeX ?? "") || undefined,
        volumeY: Number(product?.specs?.volumeY ?? "") || undefined,
        volumeZ: Number(product?.specs?.volumeZ ?? "") || undefined,
        maxHeatbedTemp: Number(product?.specs?.maxHeatbedTemp ?? "") || undefined,
        maxHotendTemp: Number(product?.specs?.maxHotendTemp ?? "") || undefined,
        supportedFilaments: product?.specs?.supportedFilaments ?? "",
      });
    }
  }, [product, form]);

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      const payload = {
        title: values.title,
        description: values.description ?? "",
        price: values.price,
        stock: values.stock,
        images: [values.image],
        specs: {
          printerSpeed: String(values.printerSpeed ?? ""),
          maxSpeed: String(values.maxSpeed ?? ""),
          acceleration: String(values.acceleration ?? ""),
          maxAcceleration: String(values.maxAcceleration ?? ""),
          volumeX: String(values.volumeX ?? ""),
          volumeY: String(values.volumeY ?? ""),
          volumeZ: String(values.volumeZ ?? ""),
          maxHeatbedTemp: String(values.maxHeatbedTemp ?? ""),
          maxHotendTemp: String(values.maxHotendTemp ?? ""),
          supportedFilaments: values.supportedFilaments ?? "",
        },
      };

      const result = product
        ? await updateProductOnServer(product._id as string, payload)
        : await createProductOnServer(payload);

      if (result.success) {
        // Update the store with the new/updated product
        if (product) {
          updateInStore(result.data);
          toast.success("Product updated successfully!");
        } else {
          addToStore(result.data);
          if (onSubmitted) onSubmitted(); 
        }
        
        // Close the form and reset
        setOpen(false);
        form.reset();
      } else {
        // Handle server-side errors
        toast.error(result.error || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={() => setOpen(false)}
      title={product ? "Edit Product" : "Create Product"}
    >
      <div className="max-h-[80vh] overflow-y-auto px-1">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
          {/* General Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="title">Title</label>
              <input 
                id="title" 
                {...form.register("title")} 
                className="input" 
                placeholder="Ender 3 V2"
                disabled={isSubmitting}
              />
              {form.formState.errors.title && (
                <span className="text-red-500 text-sm">{form.formState.errors.title.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="price">Price (₹)</label>
              <input 
                type="number" 
                id="price" 
                {...form.register("price")} 
                className="input" 
                placeholder="0.00"
                disabled={isSubmitting}
              />
              {form.formState.errors.price && (
                <span className="text-red-500 text-sm">{form.formState.errors.price.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="stock">Stock</label>
              <input 
                type="number" 
                id="stock" 
                {...form.register("stock")} 
                className="input" 
                placeholder="e.g. 50"
                disabled={isSubmitting}
              />
              {form.formState.errors.stock && (
                <span className="text-red-500 text-sm">{form.formState.errors.stock.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label htmlFor="image">Image URL</label>
              <input 
                id="image" 
                {...form.register("image")} 
                className="input" 
                placeholder="https://..."
                disabled={isSubmitting}
              />
              {form.formState.errors.image && (
                <span className="text-red-500 text-sm">{form.formState.errors.image.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                {...form.register("description")}
                className="textarea"
                placeholder="Write short description..."
                rows={4}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-md font-semibold">Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "printerSpeed", label: "Printer Speed" },
                { name: "maxSpeed", label: "Max Speed" },
                { name: "acceleration", label: "Acceleration" },
                { name: "maxAcceleration", label: "Max Acceleration" },
                { name: "volumeX", label: "Volume X" },
                { name: "volumeY", label: "Volume Y" },
                { name: "volumeZ", label: "Volume Z" },
                { name: "maxHeatbedTemp", label: "Max Heatbed Temp" },
                { name: "maxHotendTemp", label: "Max Hotend Temp" },
              ].map(({ name, label }) => (
                <div className="flex flex-col gap-1" key={name}>
                  <label htmlFor={name}>{label}</label>
                  <input 
                    id={name} 
                    type="number" 
                    {...form.register(name as keyof ProductFormValues)} 
                    className="input"
                    disabled={isSubmitting}
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1 sm:col-span-2 md:col-span-3">
                <label htmlFor="supportedFilaments">Supported Filaments</label>
                <input
                  id="supportedFilaments"
                  {...form.register("supportedFilaments")}
                  className="input"
                  placeholder="PLA, ABS, PETG, TPU..."
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : (product ? "Update Product" : "Create Product")}
          </Button>
        </form>
      </div>
    </BaseModal>
  );
}
