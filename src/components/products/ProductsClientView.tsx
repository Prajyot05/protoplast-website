"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, ArrowRight, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductType } from "@/models/Product";

interface ProductsClientViewProps {
  products: ProductType[];
}

type SortOption = "featured" | "price-asc" | "price-desc" | "newest" | "name-asc";

export default function ProductsClientView({ products }: ProductsClientViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Reset to first page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "featured":
      default:
        // Assuming featured products come first or default order
        result.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));
        break;
    }

    return result;
  }, [products, searchQuery, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500/20"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Sort by:</span>
          </div>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-full md:w-[180px] bg-white border-gray-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
      </div>

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedProducts.map((product: any) => (
              <Link 
                href={`/products/${product._id}`} 
                key={product._id}
                className="group block"
              >
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.stock <= 0 && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                    {product.stock > 0 && product.stock < 5 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-orange-500 hover:bg-orange-600">Low Stock</Badge>
                      </div>
                    )}
                    {product.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-black text-white hover:bg-gray-800">Featured</Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-medium text-black group-hover:text-green-600 transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                      <span className="font-bold text-lg whitespace-nowrap ml-2">
                        ₹{product.price.toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10 flex-grow">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <span className="text-sm font-medium text-green-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Details <ArrowRight className="w-4 h-4" />
                      </span>
                      <Button 
                        size="sm" 
                        className="rounded-full w-10 h-10 p-0 bg-black hover:bg-gray-800 text-white"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-10 w-10 rounded-full border-gray-200 hover:bg-gray-50 hover:text-black"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded-full ${
                      currentPage === page 
                        ? "bg-black text-white hover:bg-gray-800" 
                        : "text-gray-500 hover:text-black hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-10 w-10 rounded-full border-gray-200 hover:bg-gray-50 hover:text-black"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="flex justify-center mb-4">
            <Search className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-medium text-black mb-2">No products found</h3>
          <p className="text-gray-500">
            We couldn't find any products matching "{searchQuery}".
          </p>
          <Button 
            variant="link" 
            onClick={() => setSearchQuery("")}
            className="text-green-600 mt-2"
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}
