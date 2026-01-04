import { getCustomerOrders } from "@/actions/customer-order"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import OrderTracker from "@/components/OrderTracker"
import { ShoppingBag, AlertCircle, ArrowRight, Home, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/pages/footer"

export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const { data: orders, success, error } = await getCustomerOrders()

  if (!success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-8 rounded-2xl shadow-sm max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-black">Error Loading Orders</h3>
          <p className="text-sm text-red-500 mb-6">{error}</p>
          <Button asChild variant="outline" className="border-red-200 hover:bg-red-100 text-red-700 w-full">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const activeOrders = orders?.filter((o: any) => ["pending", "paid", "shipped"].includes(o.status)) || []
  const pastOrders = orders?.filter((o: any) => ["delivered", "cancelled"].includes(o.status)) || []
  const deliveredCount = orders?.filter((o: any) => o.status === "delivered").length || 0

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Header />
      
      <div className="flex-grow">
        {/* Breadcrumb */}
        <div className="pt-4 pb-4 border-b border-gray-100">
          <div className="container mx-auto px-6 max-w-7xl">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
                <Home className="h-4 w-4" />
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-black font-medium">Orders</span>
            </nav>
          </div>
        </div>

        {/* Header Section */}
        <section className="py-16 px-6 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-4xl">
                <h1 className="text-black text-5xl md:text-7xl font-medium leading-tight tracking-tight mb-6">
                  Order <span className="text-green-600">Dashboard</span>
                </h1>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                  Track and manage your recent purchases
                </p>
              </div>
              <Button asChild className="bg-black text-white hover:bg-gray-800 px-8 h-14 text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 mb-2 rounded-full">
                <Link href="/products" className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Overview - Typographic Style */}
          <div className="grid grid-cols-3 gap-8 mb-16 border-y border-gray-100 py-10">
            <div className="text-center md:text-left group cursor-default">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 group-hover:text-green-600 transition-colors">Total Orders</p>
              <h3 className="text-5xl md:text-7xl font-medium text-black tracking-tighter group-hover:scale-105 origin-left transition-transform duration-500">{orders?.length || 0}</h3>
            </div>
            <div className="text-center md:text-left border-l border-gray-100 pl-8 md:pl-12 group cursor-default">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 group-hover:text-green-600 transition-colors">In Transit</p>
              <h3 className="text-5xl md:text-7xl font-medium text-black tracking-tighter group-hover:scale-105 origin-left transition-transform duration-500">{activeOrders.length}</h3>
            </div>
            <div className="text-center md:text-left border-l border-gray-100 pl-8 md:pl-12 group cursor-default">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 group-hover:text-green-600 transition-colors">Delivered</p>
            <h3 className="text-5xl md:text-7xl font-medium text-black tracking-tighter group-hover:scale-105 origin-left transition-transform duration-500">{deliveredCount}</h3>
            </div>
          </div>

          {/* Orders Grid */}
          {orders && orders.length > 0 ? (
            <div className="space-y-20">
              {activeOrders.length > 0 && (
                <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="flex items-baseline gap-4 mb-10 border-b border-gray-100 pb-4">
                    <h2 className="text-3xl md:text-4xl font-medium text-black tracking-tight">Active Orders</h2>
                    <span className="text-lg text-green-600 font-medium">
                      ({activeOrders.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {activeOrders.map((order: any) => (
                      <OrderTracker key={order._id} order={order} />
                    ))}
                  </div>
                </section>
              )}

              {pastOrders.length > 0 && (
                <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                  <div className="flex items-baseline gap-4 mb-10 border-b border-gray-100 pb-4">
                    <h2 className="text-3xl md:text-4xl font-medium text-black tracking-tight">Order History</h2>
                    <span className="text-lg text-gray-400 font-medium">
                      ({pastOrders.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {pastOrders.map((order: any) => (
                      <OrderTracker key={order._id} order={order} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-32 bg-gray-50 rounded-3xl border border-gray-100 border-dashed animate-in zoom-in-95 duration-500">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">No orders yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                Looks like you haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white rounded-full px-10 py-6 text-lg shadow-lg shadow-green-600/20 transition-all hover:shadow-green-600/40 hover:-translate-y-1">
                <Link href="/products">
                  Start Shopping <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}