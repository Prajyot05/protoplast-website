"use client";

import type { ProductType } from "@/models/Product";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  Eye,
  Star,
  Package,
  Zap,
  Thermometer,
  Layers,
  MoreHorizontal,
} from "lucide-react";
import { getProductById, deleteProduct } from "@/actions/products";
import { useState, useEffect } from "react";
import ProductForm from "./productForm";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useProductStore } from "@/stores/useProductStore";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShowAllProductsProps {
  products: ProductType[];
  isAdmin?: boolean;
}

export default function ShowAllProducts({
  products,
  isAdmin = false,
}: ShowAllProductsProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>();
  const [formOpen, setFormOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductType | null>(
    null
  );

  const {
    productList: allProducts,
    setProductList,
    removeFromStore,
  } = useProductStore();

  useEffect(() => {
    setProductList(products);
  }, [products, setProductList]);

  const handleEdit = async (productId: string) => {
    const result = await getProductById(productId);
    if (result.success) {
      setSelectedProduct(result.data);
      setFormOpen(true);
    } else {
      toast.error(result.error || "Failed to fetch product");
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const result = await deleteProduct(productToDelete._id as string);
      if (result.success) {
        removeFromStore(productToDelete._id as string);
        toast.success("Product deleted successfully!");
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <>
      <ProductForm
        product={selectedProduct}
        open={formOpen}
        setOpen={(val) => {
          setFormOpen(val);
          if (!val) setSelectedProduct(undefined);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent className="bg-white border-gray-100 rounded-3xl shadow-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-medium tracking-tight text-black">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 text-base">
              This will permanently remove <span className="text-black font-medium">{productToDelete?.title}</span> from your inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-full h-12 px-6 border-gray-100 hover:bg-gray-50 text-black font-medium">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-full h-12 px-6 bg-red-600 text-white hover:bg-red-700 font-medium border-0"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProducts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-black text-xl font-medium">No products found</p>
            <p className="text-gray-500 mt-2">Your inventory is currently empty.</p>
          </div>
        ) : (
          allProducts.map((product) => (
            <div
              key={product._id as string}
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col"
            >
              {/* Image Section */}
              <div 
                className="relative aspect-[4/3] overflow-hidden bg-gray-50 cursor-pointer"
                onClick={() => handleEdit(product._id as string)}
              >
                <Image
                  src={
                    product.images?.[0]?.startsWith("http")
                      ? product.images[0]
                      : "/placeholder.svg?height=300&width=400&query=3D printer product"
                  }
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.featured && (
                    <Badge className="bg-black text-white border-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                      Featured
                    </Badge>
                  )}
                  {product.stock === 0 ? (
                    <Badge className="bg-red-50 text-red-600 border border-red-100 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                      Out of Stock
                    </Badge>
                  ) : product.stock < 5 ? (
                    <Badge className="bg-orange-50 text-orange-600 border border-orange-100 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                      Low Stock: {product.stock}
                    </Badge>
                  ) : null}
                </div>

                {/* Admin Quick Actions */}
                {isAdmin && (
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md border-0 shadow-lg hover:bg-white transition-all">
                          <MoreHorizontal className="h-5 w-5 text-black" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-gray-100 p-2 min-w-[160px]">
                        <DropdownMenuItem 
                          onClick={() => handleEdit(product._id as string)}
                          className="rounded-xl px-4 py-3 focus:bg-green-50 focus:text-green-600 cursor-pointer gap-3 font-medium"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setProductToDelete(product)}
                          className="rounded-xl px-4 py-3 focus:bg-red-50 focus:text-red-600 cursor-pointer gap-3 font-medium"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 
                    className="text-2xl font-medium tracking-tight text-black leading-tight group-hover:text-green-600 transition-colors cursor-pointer"
                    onClick={() => handleEdit(product._id as string)}
                  >
                    {product.title}
                  </h3>
                  <div className="text-2xl font-medium text-black tracking-tighter">
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-8 leading-relaxed">
                  {product.description || "No description provided for this product."}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Zap className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Speed</span>
                    </div>
                    <div className="text-sm font-medium text-black">
                      {product.specs?.printerSpeed ? `${product.specs.printerSpeed}mm/s` : "—"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Thermometer className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Temp</span>
                    </div>
                    <div className="text-sm font-medium text-black">
                      {product.specs?.maxHotendTemp ? `${product.specs.maxHotendTemp}°C` : "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      product.stock > 0 ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {product.stock > 0 ? `${product.stock} Units` : "Sold Out"}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleEdit(product._id as string)}
                    className="text-xs font-bold uppercase tracking-widest text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-auto"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
