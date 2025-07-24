"use client";

import type { ProductType } from "@/models/Product";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  Eye,
  Heart,
  Star,
  RotateCcw,
  Package,
  Zap,
  Thermometer,
  Layers,
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
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

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

  const toggleFlip = (productId: string) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
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
        <AlertDialogContent className="bg-gray-900/95 border-gray-800/50 backdrop-blur-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete the
              product:{" "}
              <strong className="text-white">{productToDelete?.title}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {allProducts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg">No products available yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Products will appear here once added.
            </p>
          </div>
        ) : (
          allProducts.map((product) => {
            const isFlipped = flippedCards.has(product._id as string);

            return (
              <div
                key={product._id as string}
                className="relative h-[500px] perspective-1000"
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Front Side */}
                  <Card className="absolute inset-0 backface-hidden group overflow-hidden bg-gray-900/50 border-gray-800/50 backdrop-blur-sm shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0 h-full flex flex-col">
                      {/* Image Section */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-800/30">
                        <Image
                          src={
                            product.images?.[0]?.startsWith("http")
                              ? product.images[0]
                              : "/placeholder.svg?height=300&width=400&query=3D printer product"
                          }
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />

                        {/* Status Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.featured && (
                            <Badge className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white border-0 shadow-lg backdrop-blur-sm">
                              ⭐ Featured
                            </Badge>
                          )}
                          {product.stock === 0 && (
                            <Badge className="bg-red-500/90 text-white border-0 shadow-lg backdrop-blur-sm">
                              Out of Stock
                            </Badge>
                          )}
                          {product.stock > 0 && product.stock < 5 && (
                            <Badge className="bg-orange-500/90 text-white border-0 shadow-lg backdrop-blur-sm">
                              Only {product.stock} left
                            </Badge>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800 shadow-lg border border-gray-700/50 text-gray-300 hover:text-white"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800 shadow-lg border border-gray-700/50 text-gray-300 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => toggleFlip(product._id as string)}
                            className="h-8 w-8 rounded-full bg-purple-500/20 backdrop-blur-sm hover:bg-purple-500/30 shadow-lg border border-purple-500/30 text-purple-400 hover:text-purple-300"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price Tag */}
                        <div className="absolute bottom-3 right-3">
                          <div className="bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-gray-700/50">
                            <span className="text-lg font-bold text-green-400">
                              ₹{product.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 flex-1 flex flex-col space-y-3">
                        {/* Title and Rating */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-white group-hover:text-purple-400 transition-colors">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < 4
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-gray-600 text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">(4.2)</span>
                          </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed flex-1">
                            {product.description}
                          </p>
                        )}

                        {/* Quick Specs */}
                        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {product.specs?.printerSpeed && (
                              <>
                                <span className="text-gray-400 flex items-center gap-1">
                                  <Zap className="w-3 h-3" />
                                  Speed:
                                </span>
                                <span className="font-medium text-gray-300 text-right">
                                  {product.specs.printerSpeed}mm/s
                                </span>
                              </>
                            )}
                            {product.specs?.maxHeatbedTemp && (
                              <>
                                <span className="text-gray-400 flex items-center gap-1">
                                  <Thermometer className="w-3 h-3" />
                                  Bed Temp:
                                </span>
                                <span className="font-medium text-gray-300 text-right">
                                  {product.specs.maxHeatbedTemp}°C
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-medium ${
                              product.stock > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </span>
                        </div>

                        {/* Admin Actions */}
                        {isAdmin && (
                          <div className="flex gap-2 pt-2 border-t border-gray-700/30">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-green-400 border-green-500/30 hover:bg-green-500/10 bg-transparent hover:text-green-300 transition-colors"
                              onClick={() => handleEdit(product._id as string)}
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-red-400 border-red-500/30 hover:bg-red-500/10 bg-transparent hover:text-red-300 transition-colors"
                              onClick={() => setProductToDelete(product)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Back Side - Detailed Specs */}
                  <Card className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-900/50 border-gray-800/50 backdrop-blur-sm shadow-2xl">
                    <CardContent className="p-4 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          Technical Specifications
                        </h3>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleFlip(product._id as string)}
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800/50"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Detailed Specs */}
                      <div className="space-y-4 flex-1 overflow-y-auto">
                        {/* Performance Specs */}
                        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                          <h4 className="text-sm font-medium text-purple-400 mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Performance
                          </h4>
                          <div className="space-y-2 text-sm">
                            {product.specs?.printerSpeed && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">
                                  Print Speed:
                                </span>
                                <span className="text-gray-300">
                                  {product.specs.printerSpeed}mm/s
                                </span>
                              </div>
                            )}
                            {product.specs?.maxSpeed && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">
                                  Max Speed:
                                </span>
                                <span className="text-gray-300">
                                  {product.specs.maxSpeed}mm/s
                                </span>
                              </div>
                            )}
                            {product.specs?.acceleration && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">
                                  Acceleration:
                                </span>
                                <span className="text-gray-300">
                                  {product.specs.acceleration}mm/s²
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Temperature Specs */}
                        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                          <h4 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                            <Thermometer className="w-4 h-4" />
                            Temperature
                          </h4>
                          <div className="space-y-2 text-sm">
                            {product.specs?.maxHotendTemp && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">
                                  Hotend Max:
                                </span>
                                <span className="text-gray-300">
                                  {product.specs.maxHotendTemp}°C
                                </span>
                              </div>
                            )}
                            {product.specs?.maxHeatbedTemp && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Bed Max:</span>
                                <span className="text-gray-300">
                                  {product.specs.maxHeatbedTemp}°C
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Build Volume */}
                        {product.specs?.volumeX &&
                          product.specs?.volumeY &&
                          product.specs?.volumeZ && (
                            <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                              <h4 className="text-sm font-medium text-blue-400 mb-3 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Build Volume
                              </h4>
                              <div className="text-center">
                                <span className="text-lg font-mono text-gray-300">
                                  {product.specs.volumeX} ×{" "}
                                  {product.specs.volumeY} ×{" "}
                                  {product.specs.volumeZ}mm
                                </span>
                              </div>
                            </div>
                          )}

                        {/* Supported Filaments */}
                        {product.specs?.supportedFilaments && (
                          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                            <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
                              <Layers className="w-4 h-4" />
                              Supported Filaments
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {product.specs.supportedFilaments
                                .split(",")
                                .map((filament, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 border-blue-500/30"
                                  >
                                    {filament.trim()}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price and Actions */}
                      <div className="mt-4 pt-4 border-t border-gray-700/30">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-bold text-green-400">
                            ₹{product.price.toLocaleString()}
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              product.stock > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </span>
                        </div>

                        {isAdmin && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-green-400 border-green-500/30 hover:bg-green-500/10 bg-transparent"
                              onClick={() => handleEdit(product._id as string)}
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-red-400 border-red-500/30 hover:bg-red-500/10 bg-transparent"
                              onClick={() => setProductToDelete(product)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
}
