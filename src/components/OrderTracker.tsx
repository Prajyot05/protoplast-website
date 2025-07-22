"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import type { OrderType } from "@/types/order"

interface Props {
  order: OrderType
}

export default function OrderTracker({ order }: Props) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          message: "Order is being processed",
          estimatedDays: "1-2 business days to confirm",
        }
      case "paid":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          message: "Payment confirmed, preparing for shipment",
          estimatedDays: "2-3 business days to ship",
        }
      case "shipped":
        return {
          icon: Truck,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          message: "Order is on the way",
          estimatedDays: "3-5 business days for delivery",
        }
      case "delivered":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-600/10",
          message: "Order delivered successfully",
          estimatedDays: "Completed",
        }
      case "cancelled":
        return {
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          message: "Order has been cancelled",
          estimatedDays: "Refund in 5-7 business days",
        }
      default:
        return {
          icon: Package,
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
          message: "Status unknown",
          estimatedDays: "Contact support",
        }
    }
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "pending":
        return 25
      case "paid":
        return 50
      case "shipped":
        return 75
      case "delivered":
        return 100
      case "cancelled":
        return 0
      default:
        return 0
    }
  }

  const progress = getProgressPercentage(order.status)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Order #{order._id.slice(-8)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
            <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
          </div>
          <div>
            <Badge variant="outline" className={`${statusInfo.color} border-current`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <p className="text-sm text-gray-600 mt-1">{statusInfo.message}</p>
            <p className="text-xs text-gray-500">{statusInfo.estimatedDays}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {order.status !== "cancelled" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Order Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-4">
          <h4 className="font-medium">Order Timeline</h4>
          <div className="space-y-3">
            {/* Order Placed */}
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div>
                <p className="text-sm font-medium">Order Placed</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Payment Confirmed */}
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  ["paid", "shipped", "delivered"].includes(order.status) ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <div>
                <p className="text-sm font-medium">Payment Confirmed</p>
                <p className="text-xs text-gray-500">
                  {["paid", "shipped", "delivered"].includes(order.status) ? "Completed" : "Pending"}
                </p>
              </div>
            </div>

            {/* Shipped */}
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  ["shipped", "delivered"].includes(order.status) ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <div>
                <p className="text-sm font-medium">Shipped</p>
                <p className="text-xs text-gray-500">
                  {["shipped", "delivered"].includes(order.status) ? "In transit" : "Waiting for shipment"}
                </p>
              </div>
            </div>

            {/* Delivered */}
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${order.status === "delivered" ? "bg-green-500" : "bg-gray-300"}`}
              />
              <div>
                <p className="text-sm font-medium">Delivered</p>
                <p className="text-xs text-gray-500">
                  {order.status === "delivered" ? "Completed" : "Pending delivery"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Amount</p>
              <p className="font-medium">₹{order.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Items</p>
              <p className="font-medium">{order.products.reduce((sum, p) => sum + p.quantity, 0)} items</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
