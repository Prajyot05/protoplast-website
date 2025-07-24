"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Package, User, MapPin, CreditCard, Calendar, Phone } from "lucide-react"
import { updateOrderStatus } from "@/actions/orders"
import { toast } from "sonner"
import type { OrderType } from "@/types/order"

interface Props {
  open: boolean
  onClose: () => void
  order: OrderType | null
}

export default function OrderDetailModal({ open, onClose, order }: Props) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<"pending" | "paid" | "shipped" | "delivered" | "cancelled">(order?.status || "pending")

  if (!order) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "paid":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleStatusUpdate = async (newStatus: "pending" | "paid" | "shipped" | "delivered" | "cancelled") => {
    setIsUpdating(true)
    try {
      const result = await updateOrderStatus(order._id, newStatus)
      if (result.success) {
        setCurrentStatus(newStatus)
        toast.success("Order status updated successfully")
      } else {
        toast.error(result.error || "Failed to update order status")
      }
    } catch {
      toast.error("Failed to update order status")
    } finally {
      setIsUpdating(false)
    }
  }

  const totalItems = order.products.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-400" />
            Order Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Info */}
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-400" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="font-mono text-sm text-white bg-gray-800/50 px-2 py-1 rounded">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Payment ID</p>
                  <p className="font-mono text-sm text-white bg-gray-800/50 px-2 py-1 rounded truncate">
                    {order.paymentIntentId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Order Date</p>
                  <p className="text-white flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Amount</p>
                  <p className="text-xl font-bold text-white">₹{order.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Status</p>
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(currentStatus)} border font-medium px-3 py-1`}>
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                  </Badge>
                  <Select value={currentStatus} onValueChange={handleStatusUpdate} disabled={isUpdating}>
                    <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer & Shipping */}
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-4 h-4 text-orange-400" />
                Customer & Shipping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Customer Name</p>
                <p className="text-white font-medium">{order.address.fullName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {order.address.phone}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Shipping Address</p>
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-white flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-orange-400" />
                    <span>
                      {order.address.street}
                      <br />
                      {order.address.city}, {order.address.state} {order.address.zip}
                      <br />
                      {order.address.country}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-400" />
              Products ({totalItems} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.products.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg">
                  <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.product.title}</h4>
                    <p className="text-sm text-gray-400">
                      Quantity: {item.quantity} × ₹{item.priceAtPurchase.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">₹{(item.quantity * item.priceAtPurchase).toLocaleString()}</p>
                  </div>
                </div>
              ))}

              <Separator className="bg-gray-700/50" />

              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-medium text-white">Total Amount:</span>
                <span className="text-xl font-bold text-white">₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
