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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
        if (product) {
          updateInStore(result.data);
          toast.success("Product updated successfully!");
        } else {
          addToStore(result.data);
          if (onSubmitted) onSubmitted(); 
        }
        setOpen(false);
        form.reset();
      } else {
        toast.error(result.error || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all";
  const labelClasses = "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <BaseModal
      open={open}
      onClose={() => setOpen(false)}
      title={product ? "Edit Product" : "Create Product"}
    >
      <div className="max-h-[70vh] overflow-y-auto pr-2 -mr-2">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* General Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-green-600 mb-2">
              <h3 className="text-sm font-bold uppercase tracking-widest">General Information</h3>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col">
                <label className={labelClasses} htmlFor="title">Product Title</label>
                <Input 
                  id="title" 
                  {...form.register("title")} 
                  className={inputClasses} 
                  placeholder="e.g. Protoplast X1"
                  disabled={isSubmitting}
                />
                {form.formState.errors.title && (
                  <span className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{form.formState.errors.title.message}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClasses} htmlFor="price">Price (₹)</label>
                <Input 
                  type="number" 
                  id="price" 
                  {...form.register("price")} 
                  className={inputClasses} 
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
                {form.formState.errors.price && (
                  <span className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{form.formState.errors.price.message}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClasses} htmlFor="stock">Inventory Stock</label>
                <Input 
                  type="number" 
                  id="stock" 
                  {...form.register("stock")} 
                  className={inputClasses} 
                  placeholder="e.g. 50"
                  disabled={isSubmitting}
                />
                {form.formState.errors.stock && (
                  <span className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{form.formState.errors.stock.message}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className={labelClasses} htmlFor="image">Image URL</label>
                <Input 
                  id="image" 
                  {...form.register("image")} 
                  className={inputClasses} 
                  placeholder="https://..."
                  disabled={isSubmitting}
                />
                {form.formState.errors.image && (
                  <span className="text-red-500 text-[10px] mt-1 ml-1 font-medium">{form.formState.errors.image.message}</span>
                )}
              </div>

              <div className="flex flex-col sm:col-span-2">
                <label className={labelClasses} htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  className="min-h-[120px] rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                  placeholder="Describe the product features and benefits..."
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-green-600 mb-2">
              <h3 className="text-sm font-bold uppercase tracking-widest">Technical Specifications</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: "printerSpeed", label: "Print Speed" },
                { name: "maxSpeed", label: "Max Speed" },
                { name: "acceleration", label: "Acceleration" },
                { name: "maxAcceleration", label: "Max Accel" },
                { name: "volumeX", label: "Volume X" },
                { name: "volumeY", label: "Volume Y" },
                { name: "volumeZ", label: "Volume Z" },
                { name: "maxHeatbedTemp", label: "Heatbed Temp" },
                { name: "maxHotendTemp", label: "Hotend Temp" },
              ].map(({ name, label }) => (
                <div className="flex flex-col" key={name}>
                  <label className={labelClasses} htmlFor={name}>{label}</label>
                  <Input 
                    id={name} 
                    type="number" 
                    {...form.register(name as keyof ProductFormValues)} 
                    className={inputClasses}
                    disabled={isSubmitting}
                  />
                </div>
              ))}

              <div className="flex flex-col sm:col-span-2 md:col-span-3">
                <label className={labelClasses} htmlFor="supportedFilaments">Supported Filaments</label>
                <Input
                  id="supportedFilaments"
                  {...form.register("supportedFilaments")}
                  className={inputClasses}
                  placeholder="PLA, ABS, PETG, TPU..."
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-14 rounded-full bg-black text-white hover:bg-gray-800 transition-all font-medium text-lg shadow-xl shadow-black/5"
            >
              {isSubmitting ? "Processing..." : (product ? "Update Product" : "Create Product")}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}
