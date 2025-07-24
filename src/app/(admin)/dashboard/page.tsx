"use client"
import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Search, Filter } from "lucide-react"
import { getAllProducts } from "@/actions/products"
import ShowAllProducts from "@/components/admin/showAllProducts"
import CreateProductInline from "@/components/admin/CreateProductInline"
import type { IProduct } from "@/models/Product"

export default function AdminDashboard() {
  const [products, setProducts] = useState<IProduct[]>([])
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
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900/30 border border-gray-800/30 rounded-lg p-6 animate-fade-in">
          <p className="text-gray-300">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 animate-fade-in">
          <h3 className="text-red-400 font-semibold mb-2 text-lg">Error Loading Products</h3>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-gray-400 text-lg">Manage your products and inventory</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                Total: <span className="font-semibold text-purple-400">{filteredAndSortedProducts.length}</span>{" "}
                products
              </span>
            </div>
          </div>
          <CreateProductInline />
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-gray-900/50 border-gray-800/50 backdrop-blur-sm animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">Filters & Search</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-400 transition-colors" />
              <Input
                placeholder="Search by title, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all">
                <SelectValue placeholder="All Stock" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock (&lt;5)</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all">
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="not-featured">Not Featured</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="price-desc">Highest Price</SelectItem>
                <SelectItem value="price-asc">Lowest Price</SelectItem>
                <SelectItem value="name-asc">Title A-Z</SelectItem>
                <SelectItem value="name-desc">Title Z-A</SelectItem>
                <SelectItem value="stock-desc">Highest Stock</SelectItem>
                <SelectItem value="stock-asc">Lowest Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">All Products</h2>
          <span className="text-sm text-gray-400">
            ({filteredAndSortedProducts.length} of {products.length})
          </span>
        </div>

        <ShowAllProducts products={filteredAndSortedProducts} isAdmin={true} />
      </div>
    </div>
  )
}
