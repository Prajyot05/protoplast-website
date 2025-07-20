import { getAllProducts } from "@/actions/products"
import CreateProduct from "@/components/products/create-product"
import ShowAllProducts from "@/components/products/showAllProducts"
import { Package, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default async function AdminDashboard() {
  const result = await getAllProducts()
  const products = result.success ? result.data : []

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Create Product Button */}
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
                Total: <span className="font-semibold text-purple-400">{products.length}</span> products
              </span>
            </div>
          </div>

          {/* Create Product Button - Top Right */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Create Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900/95 border-gray-800/50 backdrop-blur-md max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Product</DialogTitle>
              </DialogHeader>
              <CreateProduct />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Section */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">All Products</h2>
        </div>

        {!result.success ? (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h3 className="text-red-400 font-semibold mb-2 text-lg">Error Loading Products</h3>
            <p className="text-red-300">Failed to load products: {result.error}</p>
          </div>
        ) : (
          <ShowAllProducts products={products} isAdmin={true} />
        )}
      </div>
    </div>
  )
}
