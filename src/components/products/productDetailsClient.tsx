"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductType } from "@/models/Product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
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
import { useLocalProduct } from "@/stores/useLocalProduct";
import { useProductStore } from "@/stores/useProductStore";
import Footer from "@/pages/footer";

export default function ProductDetailsClient({
  product: initialProduct,
}: {
  product: ProductType;
}) {
  const productInStore = useProductStore((state) =>
    state.productList.find((p) => p._id === initialProduct._id)
  );

  const router = useRouter();
  const product = productInStore || initialProduct;
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
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="pt-24 pb-4 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-black transition-colors">
              Products
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-black font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
              <Image
                src={product.images[mainIndex] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                priority
              />

              {/* Image Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
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
                  className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all hover:scale-110 shadow-sm"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all hover:scale-110 shadow-sm"
                >
                  <Share2 className="h-4 w-4 text-gray-600" />
                </Button>
              </div>

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
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    idx === mainIndex
                      ? "border-black ring-1 ring-black/5"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`${product.title} view ${idx + 1}`}
                    fill
                    className="object-cover bg-gray-50"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-black leading-tight">
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
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2 font-medium">
                    {rating} ({reviewCount} reviews)
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <Badge
                  variant={product.stock > 0 ? "secondary" : "destructive"}
                  className={`text-sm font-normal ${product.stock > 0 ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}`}
                >
                  {product.stock > 0
                    ? "In Stock"
                    : "Out of stock"}
                </Badge>
              </div>

              <div className="text-3xl font-bold text-black">
                ₹{product.price.toLocaleString()}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Description */}
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Specifications Tabs */}
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="specs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">Specifications</TabsTrigger>
                <TabsTrigger value="features" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">Features</TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {product.specs?.printerSpeed && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Print Speed</span>
                      <span className="font-medium text-black">{product.specs.printerSpeed} mm/s</span>
                    </div>
                  )}
                  {product.specs?.maxSpeed && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Max Speed</span>
                      <span className="font-medium text-black">{product.specs.maxSpeed} mm/s</span>
                    </div>
                  )}
                  {product.specs?.acceleration && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Acceleration</span>
                      <span className="font-medium text-black">{product.specs.acceleration} mm/s²</span>
                    </div>
                  )}
                  {product.specs?.maxHeatbedTemp && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Bed Temp</span>
                      <span className="font-medium text-black">{product.specs.maxHeatbedTemp}°C</span>
                    </div>
                  )}
                  {product.specs?.maxHotendTemp && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Hotend Temp</span>
                      <span className="font-medium text-black">{product.specs.maxHotendTemp}°C</span>
                    </div>
                  )}
                </div>

                {product.specs?.volumeX && (
                  <div className="mt-6 pt-4">
                    <span className="text-gray-500 block mb-2">Build Volume</span>
                    <span className="text-lg font-medium text-black">
                      {product.specs.volumeX} × {product.specs.volumeY} × {product.specs.volumeZ} mm
                    </span>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                {product.specs?.supportedFilaments && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-black">Supported Filaments</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.specs.supportedFilaments.split(",").map((filament, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="px-3 py-1 text-sm border-gray-200 text-gray-700"
                        >
                          {filament.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Quantity and Purchase */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => changeQty(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="w-12 text-center font-medium">
                    {quantity}
                  </div>
                  <button
                    onClick={() => changeQty(1)}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Total Price</div>
                  <div className="text-2xl font-bold text-black">
                    ₹{(product.price * quantity * 1.18).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-xs text-gray-400">Including 18% GST</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  disabled={product.stock === 0}
                  className="h-14 text-base bg-black hover:bg-gray-800 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => {
                    addToCart(product, quantity);
                    setQuantity(1);
                    toast.success(`${product.title} added to cart!`);
                  }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={() => {
                    addToCart(product, quantity);
                    setQuantity(1);
                    toast.success(`${product.title} added to cart!`);
                    router.push("/cart");
                  }}
                  size="lg"
                  disabled={product.stock === 0}
                  className="h-14 text-base bg-green-600 hover:bg-green-700 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Buy Now
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-gray-50">
                  <Truck className="h-6 w-6 text-black" />
                  <span className="text-xs font-medium text-gray-600">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-gray-50">
                  <Shield className="h-6 w-6 text-black" />
                  <span className="text-xs font-medium text-gray-600">2 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-gray-50">
                  <RotateCcw className="h-6 w-6 text-black" />
                  <span className="text-xs font-medium text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
