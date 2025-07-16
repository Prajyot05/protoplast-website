"use client";

import { ProductType } from "@/models/Product";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ShowAllProductsProps {
  products: ProductType[];
  isAdmin?: boolean;
}

export default function ShowAllProducts({
  products,
  isAdmin = false,
}: ShowAllProductsProps) {
  if (products.length === 0) {
    return <p className="text-muted-foreground">No products available yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product, i) => (
        <div
          key={i}
          className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-lg hover:shadow-green-600/20 transition-shadow duration-300"
        >
          {/* Image */}
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {product.title}
              </h3>

              {product.featured && (
                <span className="text-xs font-semibold px-2 py-1 bg-yellow-500 text-black rounded-full">
                  Featured
                </span>
              )}
            </div>

            <p className="text-sm text-gray-400 line-clamp-2">
              {product.description}
            </p>

            <div className="text-green-400 font-medium text-sm">
              ₹{product.price}
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>Stock: {product.stock}</span>
              <span>
                {product.category?.name
                  ? `Category: ${product.category.name}`
                  : "Uncategorized"}
              </span>
            </div>

            {isAdmin && (
              <div className="pt-3 flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-green-500 text-green-400 hover:bg-green-500/10"
                  onClick={() => console.log("Edit", product._id)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => console.log("Delete", product._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
