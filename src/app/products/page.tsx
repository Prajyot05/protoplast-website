import { getAllProducts } from "@/actions/products";
import Header from "@/components/header";
import Footer from "@/pages/footer";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import ProductsClientView from "@/components/products/ProductsClientView";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Products | Protoplast",
  description: "Browse our collection of high-quality 3D printing products.",
};

export default async function ProductsPage() {
  const { data: products, success } = await getAllProducts();

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb */}
      <div className="pt-24 pb-4 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-black font-medium">Products</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <h1 className="text-black text-5xl md:text-7xl font-medium leading-tight tracking-tight mb-6">
              Our <span className="text-green-600">Products</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
              High-quality 3D printers, filaments, and accessories for your creative needs.
              Engineered for precision and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid with Search & Filter */}
      <section className="pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          {success && products && products.length > 0 ? (
            <ProductsClientView products={products} />
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-medium text-black mb-4">No products found</h3>
              <p className="text-gray-500 mb-8">Check back later for new additions to our catalog.</p>
              <Link href="/">
                <Button className="bg-black text-white hover:bg-gray-800">Return Home</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
