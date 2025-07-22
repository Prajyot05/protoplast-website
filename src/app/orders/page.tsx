import { getCustomerOrders } from "@/actions/customer-order"
import OrderTracker from "@/components/OrderTracker"
import { Card, CardContent } from "@/components/ui/card"
import { OrderType } from "@/types/order"

export default async function CustomerOrdersPage() {
  const result = await getCustomerOrders()

  if (!result.success) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500">Failed to load orders: {result.error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const orders = result.data || []

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No orders found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>
      <div className="grid gap-6">
        {orders.map((order: OrderType) => (
          <OrderTracker key={order._id} order={order} />
        ))}
      </div>
    </div>
  )
}
