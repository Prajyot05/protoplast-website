import { getCustomerOrders } from "@/actions/customer-order";
import OrderTracker from "@/components/OrderTracker";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import type { OrderType } from "@/types/order";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const result = await getCustomerOrders();

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="bg-gray-800/50 border-red-500/20 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Unable to Load Orders
                  </h2>
                  <p className="text-red-400 font-medium">{result.error}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Please try refreshing the page or contact support if the
                    issue persists.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const orders = result.data || [];

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-gray-700/30 rounded-full flex items-center justify-center border border-gray-600/30">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    No Orders Yet
                  </h2>
                  <p className="text-gray-400">
                    You haven&apos;t placed any orders yet. Start shopping to
                    see your orders here!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalOrders = orders.length;
  const totalAmount = orders.reduce(
    (sum: any, order: { totalAmount: any }) => sum + order.totalAmount,
    0
  );
  const pendingOrders = orders.filter(
    (order: any) => order.status === "pending"
  ).length;
  const deliveredOrders = orders.filter(
    (order: any) => order.status === "delivered"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Order Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                Track and manage all your orders in one place
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 text-sm font-medium">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {totalOrders}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400 text-sm font-medium">
                      Delivered
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {deliveredOrders}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-400 text-sm font-medium">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {pendingOrders}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-400 text-sm font-medium">
                      Total Spent
                    </p>
                    <p className="text-2xl font-bold text-white">
                      ₹{totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
          {orders.map((order: OrderType, index: number) => (
            <div
              key={order._id}
              className={`transform transition-all duration-500 hover:scale-[1.02] ${
                index % 3 === 0
                  ? "lg:col-span-1"
                  : index % 3 === 1
                  ? "lg:col-span-1"
                  : "lg:col-span-1"
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <OrderTracker order={order} />
            </div>
          ))}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8">
          <button className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200">
            <Package className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
