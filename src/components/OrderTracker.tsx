"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, CheckCircle, Clock, XCircle, Calendar, CreditCard, ExternalLink, ChevronRight } from "lucide-react"
import type { OrderType } from "@/types/order"
import { Button } from "@/components/ui/button"
import { OrderDetailsModal } from "@/components/OrderDetailsModal"
import { useState } from "react"
import Image from "next/image"

interface Props {
  order: OrderType
}

export default function OrderTracker({ order }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-100",
          badgeClass: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
          message: "Processing",
          estimatedDays: "Confirming...",
        }
      case "paid":
        return {
          icon: CreditCard,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-100",
          badgeClass: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
          message: "Paid",
          estimatedDays: "Shipping soon",
        }
      case "shipped":
        return {
          icon: Truck,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-100",
          badgeClass: "bg-blue-100 text-blue-700 hover:bg-blue-200",
          message: "Shipped",
          estimatedDays: "On the way",
        }
      case "delivered":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-100",
          badgeClass: "bg-green-100 text-green-700 hover:bg-green-200",
          message: "Delivered",
          estimatedDays: "Completed",
        }
      case "cancelled":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-100",
          badgeClass: "bg-red-100 text-red-700 hover:bg-red-200",
          message: "Cancelled",
          estimatedDays: "Refunded",
        }
      default:
        return {
          icon: Package,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-100",
          badgeClass: "bg-gray-100 text-gray-700 hover:bg-gray-200",
          message: "Unknown",
          estimatedDays: "Contact support",
        }
    }
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "pending": return 25
      case "paid": return 50
      case "shipped": return 75
      case "delivered": return 100
      case "cancelled": return 0
      default: return 0
    }
  }

  const progress = getProgressPercentage(order.status)

  return (
    <OrderDetailsModal 
      order={order} 
      open={isModalOpen} 
      onOpenChange={setIsModalOpen}
      trigger={
        <Card className="bg-white border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer overflow-hidden relative">
          <div className={`absolute top-0 left-0 w-1 h-full ${statusInfo.bgColor.replace('bg-', 'bg-').replace('50', '500')} opacity-20 group-hover:opacity-100 transition-opacity`} />
          
          <CardHeader className="pb-3 pl-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bgColor}`}>
                  <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-black group-hover:text-green-600 transition-colors truncate max-w-[180px]">
                    {order.products[0]?.product.title || "Order"}
                    {order.products.length > 1 && ` + ${order.products.length - 1} more`}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <Badge className={`${statusInfo.badgeClass} border-0 font-medium px-2.5 py-0.5 text-xs capitalize shadow-none`}>
                {order.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pl-6">
            {/* Progress Bar */}
            {order.status !== "cancelled" && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-gray-600">{statusInfo.message}</span>
                  <span className="text-gray-400">{statusInfo.estimatedDays}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      order.status === 'delivered' ? 'bg-green-500' : 'bg-black'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Products Preview - Mini */}
            <div className="flex items-center gap-2 pt-2">
              <div className="flex -space-x-2 overflow-hidden py-1">
                {order.products.slice(0, 3).map((item, index) => (
                  <div key={index} className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center overflow-hidden">
                    {item.product.images && item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Package className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                ))}
                {order.products.length > 3 && (
                  <div className="relative w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-500">
                    +{order.products.length - 3}
                  </div>
                )}
              </div>
              <div className="flex-1 text-right">
                <p className="text-sm font-bold text-black">₹{order.totalAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* Hover Action */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <div className="bg-black text-white p-2 rounded-full shadow-lg">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      }
    />
  )
}
