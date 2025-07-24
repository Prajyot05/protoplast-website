"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, CheckCircle, Clock, XCircle, Calendar, CreditCard, ExternalLink } from "lucide-react"
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
          color: "text-yellow-400",
          bgColor: "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10",
          borderColor: "border-yellow-500/30",
          badgeClass: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          message: "Order is being processed",
          estimatedDays: "1-2 business days to confirm",
        }
      case "paid":
        return {
          icon: CreditCard,
          color: "text-emerald-400",
          bgColor: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10",
          borderColor: "border-emerald-500/30",
          badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          message: "Payment confirmed, preparing for shipment",
          estimatedDays: "2-3 business days to ship",
        }
      case "shipped":
        return {
          icon: Truck,
          color: "text-blue-400",
          bgColor: "bg-gradient-to-br from-blue-500/20 to-blue-600/10",
          borderColor: "border-blue-500/30",
          badgeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          message: "Order is on the way",
          estimatedDays: "3-5 business days for delivery",
        }
      case "delivered":
        return {
          icon: CheckCircle,
          color: "text-green-400",
          bgColor: "bg-gradient-to-br from-green-500/20 to-green-600/10",
          borderColor: "border-green-500/30",
          badgeClass: "bg-green-500/20 text-green-400 border-green-500/30",
          message: "Order delivered successfully",
          estimatedDays: "Completed",
        }
      case "cancelled":
        return {
          icon: XCircle,
          color: "text-red-400",
          bgColor: "bg-gradient-to-br from-red-500/20 to-red-600/10",
          borderColor: "border-red-500/30",
          badgeClass: "bg-red-500/20 text-red-400 border-red-500/30",
          message: "Order has been cancelled",
          estimatedDays: "Refund in 5-7 business days",
        }
      default:
        return {
          icon: Package,
          color: "text-gray-400",
          bgColor: "bg-gradient-to-br from-gray-500/20 to-gray-600/10",
          borderColor: "border-gray-500/30",
          badgeClass: "bg-gray-500/20 text-gray-400 border-gray-500/30",
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
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl hover:bg-gray-800/70 transition-all duration-300 group overflow-hidden relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-600/30">
              <Package className="w-5 h-5 text-gray-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">#{order._id.slice(-8).toUpperCase()}</h3>
              <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <Badge className={`${statusInfo.badgeClass} border font-medium px-3 py-1 text-sm`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Status Section */}
        <div className={`p-3 rounded-lg ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gray-800/30">
              <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white text-sm truncate">{statusInfo.message}</h4>
              <p className="text-xs text-gray-400 truncate">{statusInfo.estimatedDays}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {order.status !== "cancelled" && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-300">Progress</span>
              <span className="text-xs font-medium text-gray-400">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/20">
            <p className="text-xs text-gray-400">Amount</p>
            <p className="text-lg font-bold text-white">₹{order.totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/20">
            <p className="text-xs text-gray-400">Items</p>
            <p className="text-lg font-bold text-white">{order.products.reduce((sum, p) => sum + p.quantity, 0)}</p>
          </div>
        </div>

        {/* Products Preview */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-300">Products:</p>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {order.products.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between items-center text-xs bg-gray-700/20 rounded p-2">
                <span className="text-gray-300 truncate flex-1 mr-2">{item.product.title}</span>
                <span className="text-gray-400 whitespace-nowrap">×{item.quantity}</span>
              </div>
            ))}
            {order.products.length > 2 && (
              <p className="text-xs text-gray-400 text-center py-1">+{order.products.length - 2} more items</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full mt-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30 rounded-lg p-2 text-sm text-blue-400 font-medium transition-all duration-200 flex items-center justify-center gap-2 group">
          View Details
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </CardContent>
    </Card>
  )
}
