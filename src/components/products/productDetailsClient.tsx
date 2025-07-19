"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductType } from "@/models/Product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Home,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useLocalProduct } from "@/stores/useLocalProcut";

export default function ProductDetailsClient({
  product,
}: {
  product: ProductType;
}) {
  const [mainIndex, setMainIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const changeQty = (delta: number) => {
    setQuantity((q) => Math.max(1, Math.min(product.stock, q + delta)));
  };
  const addToCart = useLocalProduct((state) => state.addToCart);
  // Mock rating data (Needs to be replaced with actual data)
  const rating = 4.5;
  const reviewCount = 127;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Home className="h-4 w-4" />
            <ChevronRight className="h-4 w-4" />
            <span>Products</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 max-w-6xl mx-auto">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-border group">
              <Image
                src={product.images[mainIndex] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105"
                priority
              />

              {/* Image Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card opacity-0 group-hover:opacity-100 transition-opacity border border-border"
                    onClick={() =>
                      setMainIndex(
                        mainIndex === 0
                          ? product.images.length - 1
                          : mainIndex - 1
                      )
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-16 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card opacity-0 group-hover:opacity-100 transition-opacity border border-border"
                    onClick={() =>
                      setMainIndex(
                        mainIndex === product.images.length - 1
                          ? 0
                          : mainIndex + 1
                      )
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Floating Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-all hover:scale-110 border border-border"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isWishlisted ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-all hover:scale-110 border border-border"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-4">
                  <Badge
                    variant="secondary"
                    className="bg-card/80 backdrop-blur-sm border border-border"
                  >
                    {mainIndex + 1} / {product.images.length}
                  </Badge>
                </div>
              )}

              {/* Product Badge */}
              {product.stock > 0 && product.stock < 5 && (
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="animate-pulse">
                    Only {product.stock} left!
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                    idx === mainIndex
                      ? "border-primary ring-2 ring-primary/20 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`${product.title} view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  {idx === mainIndex && (
                    <div className="absolute inset-0 bg-primary/10" />
                  )}
                </button>
              ))}
            </div>

            {/* Image Gallery Dots */}
            {product.images.length > 1 && (
              <div className="flex justify-center gap-2">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === mainIndex
                        ? "bg-primary w-6"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {product.title}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : i < rating
                              ? "fill-yellow-400/50 text-yellow-400"
                              : "fill-muted text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        {rating} ({reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-green-500">
                  ₹{product.price.toLocaleString()}
                </div>
                <Badge
                  variant={product.stock > 0 ? "secondary" : "destructive"}
                  className="text-sm"
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </Badge>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator className="bg-border" />

            {/* Specifications Tabs */}
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {product.specs?.printerSpeed && (
                        <div className="space-y-1">
                          <dt className="text-sm font-medium text-muted-foreground">
                            Print Speed
                          </dt>
                          <dd className="text-sm font-semibold text-foreground">
                            {product.specs.printerSpeed} mm/s
                          </dd>
                        </div>
                      )}
                      {product.specs?.maxSpeed && (
                        <div className="space-y-1">
                          <dt className="text-sm font-medium text-muted-foreground">
                            Max Speed
                          </dt>
                          <dd className="text-sm font-semibold text-foreground">
                            {product.specs.maxSpeed} mm/s
                          </dd>
                        </div>
                      )}
                      {product.specs?.acceleration && (
                        <div className="space-y-1">
                          <dt className="text-sm font-medium text-muted-foreground">
                            Acceleration
                          </dt>
                          <dd className="text-sm font-semibold text-foreground">
                            {product.specs.acceleration} mm/s²
                          </dd>
                        </div>
                      )}
                      {product.specs?.maxAcceleration && (
                        <div className="space-y-1">
                          <dt className="text-sm font-medium text-muted-foreground">
                            Max Acceleration
                          </dt>
                          <dd className="text-sm font-semibold text-foreground">
                            {product.specs.maxAcceleration} mm/s²
                          </dd>
                        </div>
                      )}
                      {product.specs?.maxHeatbedTemp && (
                        <div className="space-y-1">
                          <dt className="text-sm font-medium text-muted-foreground">
                            Bed Temperature
                          </dt>
                          <dd className="text-sm font-semibold text-foreground">
                            {product.specs.maxHeatbedTemp}°C
                          </dd>
                        </div>
                      )}
                      {product.specs?.maxHotendTemp && (
                        <div className="space-y-1">
                          <dt className="text-sm font-medium text-muted-foreground">
                            Hotend Temperature
                          </dt>
                          <dd className="text-sm font-semibold text-foreground">
                            {product.specs.maxHotendTemp}°C
                          </dd>
                        </div>
                      )}
                    </div>

                    {product.specs?.volumeX &&
                      product.specs?.volumeY &&
                      product.specs?.volumeZ && (
                        <div className="mt-6 pt-6 border-t border-border">
                          <div className="space-y-1">
                            <dt className="text-sm font-medium text-muted-foreground">
                              Build Volume
                            </dt>
                            <dd className="text-lg font-semibold text-foreground">
                              {product.specs.volumeX} × {product.specs.volumeY}{" "}
                              × {product.specs.volumeZ} mm
                            </dd>
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    {product.specs?.supportedFilaments && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">
                          Supported Filaments
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.specs.supportedFilaments
                            .split(",")
                            .map((filament, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs border-border"
                              >
                                {filament.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Separator className="bg-border" />

            {/* Quantity and Purchase */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">
                  Quantity:
                </span>
                <div className="flex items-center border border-border rounded-lg shadow-sm bg-card">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => changeQty(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-r-none hover:bg-muted transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center justify-center w-16 h-10 text-sm font-medium border-x border-border bg-muted/30">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => changeQty(1)}
                    disabled={quantity >= product.stock}
                    className="h-10 w-10 rounded-l-none hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="text-sm text-muted-foreground">
                    Total:{" "}
                    <span className="font-semibold text-foreground">
                      ₹
                      {(product.price * quantity).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <br />
                    <span className="text-xs text-muted-foreground">
                      (Includes GST: ₹
                      {(product.price * quantity * 0.18).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                      )
                    </span>
                    <br />
                    <span className="text-xs text-muted-foreground italic">
                      Included GST @18%
                    </span>
                    <br />
                    <span className="font-semibold text-foreground text-2xl block mt-1">
                      Grand Total: ₹
                      {(product.price * quantity * 1.18).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  disabled={product.stock === 0}
                  className="flex-1 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    addToCart(product, quantity);
                    setQuantity(1);
                    toast.success(
                      `${product.title} added to cart!`
                    );
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  disabled={product.stock === 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  Buy Now
                </Button>
              </div>

              {/* Trust Badges with animations */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default">
                  <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default">
                  <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span>2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default">
                  <div className="p-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
                    <RotateCcw className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
