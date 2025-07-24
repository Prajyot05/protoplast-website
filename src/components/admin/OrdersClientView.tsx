"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, Package, User, MapPin, Calendar, CreditCard } from "lucide-react"
import OrderDetailModal from "./OrdersDetailModal"
import type { OrderType } from "@/types/order"

interface Props {
  orders: OrderType[]
}

export default function OrdersClientView({ orders }: Props) {
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  const filteredAndSortedOrders = useMemo(() => {
    const filtered = orders.filter((order) => {
      // Search matches
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentIntentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.phone.includes(searchTerm) ||
        order.products.some((p) => p.product.title.toLowerCase().includes(searchTerm.toLowerCase()))

      // Status matches
      const statusMatch = statusFilter === "all" || order.status === statusFilter

      return matchesSearch && statusMatch
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "amount-desc":
          return b.totalAmount - a.totalAmount
        case "amount-asc":
          return a.totalAmount - b.totalAmount
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    return filtered
  }, [orders, searchTerm, statusFilter, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 transition-colors"
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 transition-colors"
      case "paid":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30 transition-colors"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30 transition-colors"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 transition-colors"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30 transition-colors"
    }
  }

  const openOrderModal = (order: OrderType) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const getOrderSummary = (order: OrderType) => {
    const itemCount = order.products.reduce((sum, p) => sum + p.quantity, 0)
    const firstProduct = order.products[0]?.product.title || "No products"
    return itemCount > 1 ? `${firstProduct} +${itemCount - 1} more` : firstProduct
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Orders Management
          </h1>
        </div>
        <p className="text-gray-400 text-lg">Manage and track all customer orders</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">
            Total: <span className="font-semibold text-orange-400">{filteredAndSortedOrders.length}</span> orders
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-gray-900/50 border-gray-800/50 backdrop-blur-sm animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-gray-300">Filters & Search</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-orange-400 transition-colors" />
              <Input
                placeholder="Search by order ID, customer, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 transition-all"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-orange-500 focus:ring-orange-500/20 transition-all">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-orange-500 focus:ring-orange-500/20 transition-all">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="amount-desc">Highest Amount</SelectItem>
                <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table Header */}
      <div className="bg-gray-900/30 border border-gray-800/30 rounded-t-lg px-6 py-4 mb-0">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
          <div className="col-span-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date & Order ID
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Customer
          </div>
          <div className="col-span-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Products
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Amount & Status
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Shipping
          </div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
      </div>

      {/* Orders */}
      {filteredAndSortedOrders.length === 0 ? (
        <Card className="bg-gray-900/30 border-gray-800/30 backdrop-blur-sm rounded-t-none">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg">No orders found matching your criteria.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-gray-900/20 border-x border-b border-gray-800/30 rounded-b-lg">
          {filteredAndSortedOrders.map((order, index) => (
            <div
              key={order._id}
              className="border-b border-gray-800/20 last:border-b-0 hover:bg-gray-900/40 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="px-6 py-4">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Date & Order ID */}
                  <div className="col-span-2">
                    <div className="text-sm text-white font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="font-mono text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded truncate mt-1">
                      {order._id.slice(-8)}
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="col-span-2">
                    <div className="text-sm text-white font-medium truncate">{order.address.fullName}</div>
                    <div className="text-xs text-gray-400 truncate">{order.address.phone}</div>
                  </div>

                  {/* Products */}
                  <div className="col-span-3">
                    <div className="text-sm text-white truncate">{getOrderSummary(order)}</div>
                    <div className="text-xs text-gray-400">
                      {order.products.reduce((sum, p) => sum + p.quantity, 0)} items
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="col-span-2">
                    <div className="text-lg font-bold text-white">₹{order.totalAmount.toLocaleString()}</div>
                    <Badge
                      className={`${getStatusColor(order.status)} border font-medium px-2 py-1 text-xs w-fit mt-1`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Shipping */}
                  <div className="col-span-2">
                    <div className="text-sm text-white truncate">
                      {order.address.city}, {order.address.state}
                    </div>
                    <div className="text-xs text-gray-400 truncate">{order.address.zip}</div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 text-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openOrderModal(order)}
                      className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/30 hover:border-orange-500/50 transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <OrderDetailModal open={isModalOpen} onClose={() => setIsModalOpen(false)} order={selectedOrder} />
    </div>
  )
}
