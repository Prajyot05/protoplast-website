"use client"

import type { ProductType } from "@/models/Product"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, Eye, Heart, Star } from "lucide-react"
import { getProductById, deleteProduct } from "@/actions/products"
import { useState, useEffect } from "react"
import ProductForm from "./productForm"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { useProductStore } from "@/stores/useProductStore"

interface ShowAllProductsProps {
  products: ProductType[]
  isAdmin?: boolean
}

export default function ShowAllProducts({ products, isAdmin = false }: ShowAllProductsProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>()
  const [formOpen, setFormOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<ProductType | null>(null)

  const { productList: allProducts, setProductList, removeFromStore } = useProductStore()

  useEffect(() => {
    setProductList(products)
  }, [products, setProductList])

  const handleEdit = async (productId: string) => {
    const result = await getProductById(productId)
    if (result.success) {
      setSelectedProduct(result.data)
      setFormOpen(true)
    } else {
      toast.error(result.error || "Failed to fetch product")
    }
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    try {
      const result = await deleteProduct(productToDelete._id as string)
      if (result.success) {
        removeFromStore(productToDelete._id as string)
        toast.success("Product deleted successfully!")
      } else {
        toast.error(result.error || "Failed to delete product")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setProductToDelete(null)
    }
  }

  console.log("Product ID", allProducts.map((p) => p._id));

  return (
    <>
      <ProductForm
        product={selectedProduct}
        open={formOpen}
        setOpen={(val) => {
          setFormOpen(val)
          if (!val) setSelectedProduct(undefined)
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product:{" "}
              <strong>{productToDelete?.title}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {allProducts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-muted-foreground text-lg">No products available yet.</p>
          </div>
        ) : (
          allProducts.map((product) => (
            <Card
              key={product._id as string}
              className="group relative overflow-hidden border border-border shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card backdrop-blur-sm"
            >
              <CardContent className="p-0">
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
                  <Image
                    src={
                      product.images?.[0]?.startsWith("http")
                        ? product.images[0]
                        : "/placeholder.svg?height=300&width=400"
                    }
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Dark overlay for better contrast */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />

                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-lg">
                        ⭐ Featured
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="destructive" className="shadow-lg">
                        Out of Stock
                      </Badge>
                    )}
                    {product.stock > 0 && product.stock < 5 && (
                      <Badge className="bg-orange-600 text-white border-0 shadow-lg hover:bg-orange-700">
                        Only {product.stock} left
                      </Badge>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card shadow-lg border border-border"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card shadow-lg border border-border"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-card/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-border">
                      <span className="text-lg font-bold text-green-500">₹{product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-4 bg-card">
                  {/* Title and Rating */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">(4.2)</span>
                    </div>
                  </div>

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
                  )}

                  {/* Key Specs - Simplified */}
                  <div className="bg-muted/30 rounded-lg p-3 space-y-2 border border-border/50">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Features</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {product.specs?.printerSpeed && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Speed:</span>
                          <span className="font-medium text-foreground">{product.specs.printerSpeed}mm/s</span>
                        </div>
                      )}
                      {product.specs?.maxHeatbedTemp && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bed:</span>
                          <span className="font-medium text-foreground">{product.specs.maxHeatbedTemp}°C</span>
                        </div>
                      )}
                      {product.specs?.volumeX && product.specs?.volumeY && product.specs?.volumeZ && (
                        <div className="col-span-2 pt-2 border-t border-border/50">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Build Volume:</span>
                            <span className="font-medium text-foreground text-right">
                              {product.specs.volumeX}×{product.specs.volumeY}×{product.specs.volumeZ}mm
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Supported Filaments */}
                  {product.specs?.supportedFilaments && (
                    <div className="flex flex-wrap gap-1">
                      {product.specs.supportedFilaments
                        .split(",")
                        .slice(0, 3)
                        .map((filament, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700/50"
                          >
                            {filament.trim()}
                          </Badge>
                        ))}
                      {product.specs.supportedFilaments.split(",").length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground border-border"
                        >
                          +{product.specs.supportedFilaments.split(",").length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Stock Status */}
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-green-500 border-green-500/20 hover:bg-green-500/10 transition-colors bg-transparent hover:text-green-400"
                        onClick={() => handleEdit(product._id as string)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-500 border-red-500/20 hover:bg-red-500/10 transition-colors bg-transparent hover:text-red-400"
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
          ))
        )}
      </div>
    </>
  )
}
