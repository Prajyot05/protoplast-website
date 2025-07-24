import { getAllOrders } from "@/actions/orders"
import OrdersClientView from "@/components/admin/OrdersClientView"

export default async function OrdersPage() {
  const result = await getAllOrders()

  let orders = []
  if (result.success && "data" in result && result.data) {
    orders = result.data
  }

  return <OrdersClientView orders={orders} />
}
