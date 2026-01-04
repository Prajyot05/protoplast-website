"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Package, MapPin, Phone, Calendar, CreditCard, Truck, CheckCircle, Clock, XCircle, ExternalLink } from "lucide-react"
import Image from "next/image"
import type { OrderType } from "@/types/order"

interface OrderDetailsModalProps {
  order: OrderType
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function OrderDetailsModal({ order, trigger, open, onOpenChange }: OrderDetailsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "paid": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "shipped": return "bg-blue-100 text-blue-700 border-blue-200"
      case "delivered": return "bg-green-100 text-green-700 border-green-200"
      case "cancelled": return "bg-red-100 text-red-700 border-red-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return Clock
      case "paid": return CreditCard
      case "shipped": return Truck
      case "delivered": return CheckCircle
      case "cancelled": return XCircle
      default: return Package
    }
  }

  const StatusIcon = getStatusIcon(order.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mr-8">
            <DialogTitle className="text-xl font-bold flex flex-col gap-0.5">
              <span className="truncate max-w-[400px]">
                {order.products[0]?.product.title || "Order Details"}
                {order.products.length > 1 && ` + ${order.products.length - 1} more`}
              </span>
            </DialogTitle>
            <Badge className={`${getStatusColor(order.status)} border px-3 py-1`}>
              <StatusIcon className="w-3 h-3 mr-1.5" />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Products Section */}
            <section>
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Items Ordered
              </h3>
              <div className="space-y-4">
                {order.products.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start group">
                    <div className="relative w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                      {item.product.images && item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.title}
                          fill
                          className="object-contain p-1 group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.product.title}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                      <p className="text-xs text-gray-500">₹{item.priceAtPurchase.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator className="bg-gray-100" />

            {/* Delivery & Payment Info Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Shipping Address */}
              <section>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Delivery Address
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm space-y-1.5">
                  <p className="font-medium text-gray-900">{order.address.fullName}</p>
                  <p className="text-gray-600">{order.address.street}</p>
                  <p className="text-gray-600">
                    {order.address.city}, {order.address.state} {order.address.zip}
                  </p>
                  <p className="text-gray-600">{order.address.country}</p>
                  <div className="flex items-center gap-2 text-gray-500 mt-2 pt-2 border-t border-gray-200/50">
                    <Phone className="w-3.5 h-3.5" />
                    {order.address.phone}
                  </div>
                </div>
              </section>

              {/* Payment Summary */}
              <section>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Summary
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <Separator className="bg-gray-200/50" />
                  <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto border-gray-200 hover:bg-white hover:text-black">
              Close
            </Button>
          </DialogClose>
          <Button className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 gap-2">
            <ExternalLink className="w-4 h-4" />
            Download Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
