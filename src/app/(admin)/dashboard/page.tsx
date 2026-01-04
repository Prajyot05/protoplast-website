"use client"
import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Search, Filter, Home, ChevronRight, Plus } from "lucide-react"
import { getAllProducts } from "@/actions/products"
import ShowAllProducts from "@/components/admin/showAllProducts"
import CreateProductInline from "@/components/admin/CreateProductInline"
import type { ProductType } from "@/models/Product"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [stockFilter, setStockFilter] = useState("all")
  const [featuredFilter, setFeaturedFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getAllProducts()
        if (result.success) {
          setProducts(result.data || [])
        } else {
          setError(result.error || "Failed to load products")
        }
      } catch {
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Search matches
      const matchesSearch =
        (product.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        product._id?.toString().toLowerCase().includes(searchTerm.toLowerCase())

      // Stock matches
      const stockMatch =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.stock > 0) ||
        (stockFilter === "out-of-stock" && product.stock === 0) ||
        (stockFilter === "low-stock" && product.stock > 0 && product.stock < 5)

      // Featured matches
      const featuredMatch =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && product.featured) ||
        (featuredFilter === "not-featured" && !product.featured)

      return matchesSearch && stockMatch && featuredMatch
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "price-desc":
          return b.price - a.price
        case "price-asc":
          return a.price - b.price
        case "name-asc":
          return (a.title || "").localeCompare(b.title || "")
        case "name-desc":
          return (b.title || "").localeCompare(a.title || "")
        case "stock-desc":
          return b.stock - a.stock
        case "stock-asc":
          return a.stock - b.stock
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchTerm, stockFilter, featuredFilter, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading inventory...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-100 text-red-600 px-8 py-12 rounded-3xl shadow-sm max-w-md w-full text-center">
          <h3 className="text-2xl font-bold mb-2 text-black tracking-tight">Error Loading Products</h3>
          <p className="text-gray-500 mb-8">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-black text-white hover:bg-gray-800 rounded-full px-8">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Breadcrumb */}
      <div className="pt-6 pb-6 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <nav className="flex items-center space-x-3 text-sm">
            <Link href="/" className="text-gray-400 hover:text-black transition-colors flex items-center gap-1.5">
              <Home className="h-4 w-4" />
              <span className="font-medium">Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <span className="text-gray-400 font-medium">Admin</span>
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <span className="text-black font-bold uppercase tracking-widest text-[10px]">Inventory</span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-4xl">
              <h1 className="text-black text-6xl md:text-8xl font-medium leading-[0.9] tracking-tighter mb-8">
                Product <br />
                <span className="text-green-600 italic">Inventory.</span>
              </h1>
              <p className="text-gray-500 text-xl md:text-2xl leading-relaxed max-w-2xl font-light">
                Manage your store's catalog, track stock levels, and update product details with precision.
              </p>
            </div>
            <div className="mb-2">
              <CreateProductInline />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-32">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-y border-gray-100 py-12">
          <div className="group cursor-default">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 group-hover:text-green-600 transition-colors">Total Products</p>
            <h3 className="text-5xl md:text-7xl font-medium text-black tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{products.length}</h3>
          </div>
          <div className="md:border-l border-gray-100 md:pl-12 group cursor-default">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 group-hover:text-green-600 transition-colors">In Stock</p>
            <h3 className="text-5xl md:text-7xl font-medium text-black tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{products.filter(p => p.stock > 0).length}</h3>
          </div>
          <div className="border-l border-gray-100 pl-12 group cursor-default">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 group-hover:text-red-600 transition-colors">Out of Stock</p>
            <h3 className="text-5xl md:text-7xl font-medium text-black tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{products.filter(p => p.stock === 0).length}</h3>
          </div>
          <div className="border-l border-gray-100 pl-12 group cursor-default">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 group-hover:text-green-600 transition-colors">Featured</p>
            <h3 className="text-5xl md:text-7xl font-medium text-black tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{products.filter(p => p.featured).length}</h3>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mb-16 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-grow group">
              <Search className="w-5 h-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-16 pl-14 pr-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/20 transition-all text-xl placeholder:text-gray-300"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="h-16 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/20 transition-all min-w-[180px] text-base font-medium">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 p-2">
                  <SelectItem value="all" className="rounded-xl py-3">All Stock</SelectItem>
                  <SelectItem value="in-stock" className="rounded-xl py-3">In Stock</SelectItem>
                  <SelectItem value="low-stock" className="rounded-xl py-3">Low Stock (&lt;5)</SelectItem>
                  <SelectItem value="out-of-stock" className="rounded-xl py-3">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger className="h-16 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/20 transition-all min-w-[180px] text-base font-medium">
                  <SelectValue placeholder="Featured" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 p-2">
                  <SelectItem value="all" className="rounded-xl py-3">All Products</SelectItem>
                  <SelectItem value="featured" className="rounded-xl py-3">Featured Only</SelectItem>
                  <SelectItem value="not-featured" className="rounded-xl py-3">Not Featured</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-16 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/20 transition-all min-w-[180px] text-base font-medium">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 p-2">
                  <SelectItem value="date-desc" className="rounded-xl py-3">Newest First</SelectItem>
                  <SelectItem value="date-asc" className="rounded-xl py-3">Oldest First</SelectItem>
                  <SelectItem value="price-desc" className="rounded-xl py-3">Highest Price</SelectItem>
                  <SelectItem value="price-asc" className="rounded-xl py-3">Lowest Price</SelectItem>
                  <SelectItem value="name-asc" className="rounded-xl py-3">Title A-Z</SelectItem>
                  <SelectItem value="name-desc" className="rounded-xl py-3">Title Z-A</SelectItem>
                  <SelectItem value="stock-desc" className="rounded-xl py-3">Highest Stock</SelectItem>
                  <SelectItem value="stock-asc" className="rounded-xl py-3">Lowest Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <div className="flex items-baseline gap-4">
              <h2 className="text-4xl font-medium text-black tracking-tight">Catalog</h2>
              <span className="text-xl text-green-600 font-medium tabular-nums">
                ({filteredAndSortedProducts.length})
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Active Filters</span>
            </div>
          </div>

          <ShowAllProducts products={filteredAndSortedProducts} isAdmin={true} />
        </div>
      </div>
    </div>
  )
  
}
