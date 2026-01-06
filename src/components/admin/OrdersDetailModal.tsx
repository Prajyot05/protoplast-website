"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package, User, CreditCard, X } from "lucide-react"
import { updateOrderStatus } from "@/actions/orders"
import { toast } from "sonner"
import type { OrderType } from "@/types/order"
import { cn } from "@/lib/utils"

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
        return "bg-green-50 text-green-600 border-green-100"
      case "shipped":
        return "bg-blue-50 text-blue-600 border-blue-100"
      case "paid":
        return "bg-purple-50 text-purple-600 border-purple-100"
      case "pending":
        return "bg-yellow-50 text-yellow-600 border-yellow-100"
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-100"
      default:
        return "bg-gray-50 text-gray-600 border-gray-100"
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
      <DialogContent className="max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0 bg-white border-gray-100 rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="shrink-0 bg-white/80 backdrop-blur-md z-10 px-6 sm:px-8 py-4 sm:py-6 border-b border-gray-100 flex items-center justify-between">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl sm:text-2xl font-medium tracking-tight text-black">Order Details</DialogTitle>
            <DialogDescription className="text-[10px] sm:text-sm text-gray-400 mt-1 font-mono uppercase tracking-widest">
              #{order._id.slice(-12)}
            </DialogDescription>
          </DialogHeader>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100 h-10 w-10">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 sm:p-8 space-y-10 sm:space-y-12">
            {/* Top Grid: Info & Customer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Order Info */}
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center gap-3 text-green-600">
                  <CreditCard className="w-5 h-5" />
                  <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Order Information</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment ID</p>
                    <p className="text-sm font-mono text-black break-all">{order.paymentIntentId || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Date</p>
                    <p className="text-sm font-medium text-black">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Status</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge className={cn("rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider border shadow-none", getStatusColor(currentStatus))}>
                      {currentStatus}
                    </Badge>
                    <Select value={currentStatus} onValueChange={handleStatusUpdate} disabled={isUpdating}>
                      <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-transparent focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-36 sm:w-40 text-xs font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-100">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center gap-3 text-green-600">
                  <User className="w-5 h-5" />
                  <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Customer & Shipping</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</p>
                    <p className="text-sm font-medium text-black">{order.address.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                    <p className="text-sm font-medium text-black">{order.address.phone}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipping Address</p>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {order.address.street}<br />
                      {order.address.city}, {order.address.state} {order.address.zip}<br />
                      {order.address.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-6 sm:space-y-8 pb-4">
              <div className="flex items-center gap-3 text-green-600">
                <Package className="w-5 h-5" />
                <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">Products ({totalItems} items)</h3>
              </div>

              {/* Desktop View */}
              <div className="hidden md:block bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.products.map((item, index) => (
                      <tr key={index} className="group">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-black">{item.product.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">₹{item.priceAtPurchase.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-medium text-black">₹{(item.quantity * item.priceAtPurchase).toLocaleString()}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50/30">
                      <td colSpan={3} className="px-6 py-6 text-right">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Grand Total</span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className="text-2xl font-medium text-black tracking-tight">₹{order.totalAmount.toLocaleString()}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {order.products.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="text-sm font-bold text-black mb-2">{item.product.title}</div>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                      <span>{item.quantity} x ₹{item.priceAtPurchase.toLocaleString()}</span>
                      <span className="font-bold text-black">₹{(item.quantity * item.priceAtPurchase).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center p-4 bg-black text-white rounded-2xl">
                  <span className="text-xs font-bold uppercase tracking-widest">Grand Total</span>
                  <span className="text-xl font-bold tracking-tighter">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="shrink-0 p-6 sm:p-8 border-t border-gray-100 flex justify-end bg-gray-50/50">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-black text-white hover:bg-gray-800 transition-all font-medium"
          >
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
