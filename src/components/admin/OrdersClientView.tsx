"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Home, ChevronRight } from "lucide-react"
import OrderDetailModal from "./OrdersDetailModal"
import type { OrderType } from "@/types/order"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
    <div className="min-h-screen bg-white text-black">
      {/* Breadcrumb */}
      <div className="pt-6 pb-6 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <nav className="flex items-center space-x-3 text-sm">
            <Link href="/" className="text-gray-400 hover:text-black transition-colors flex items-center gap-1.5">
              <Home className="h-4 w-4" />
              <span className="font-medium">Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <span className="text-gray-400 font-medium">Admin</span>
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <span className="text-black font-bold uppercase tracking-widest text-[10px]">Orders</span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-4xl">
              <h1 className="text-black text-6xl md:text-8xl font-medium leading-[0.9] tracking-tighter mb-8">
                Order <br />
                <span className="text-green-600 italic">Management.</span>
              </h1>
              <p className="text-gray-500 text-xl md:text-2xl leading-relaxed max-w-2xl font-light">
                Track customer purchases, update order statuses, and manage fulfillment with precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-32">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-y border-gray-100 py-12">
          <div className="group cursor-default">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 group-hover:text-green-600 transition-colors">Total Orders</p>
            <h3 className="text-5xl md:text-7xl font-medium text-black tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{orders.length}</h3>
          </div>
          <div className="md:border-l border-gray-100 md:pl-12 group cursor-default">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 group-hover:text-yellow-600 transition-colors">Pending</p>
            <h3 className="text-5xl md:text-7xl font-medium text-black tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{orders.filter(o => o.status === "pending").length}</h3>
          </div>
          <div className="border-l border-gray-100 pl-12 group cursor-default">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 group-hover:text-blue-600 transition-colors">Shipped</p>
            <h3 className="text-5xl md:text-7xl font-medium text-black tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{orders.filter(o => o.status === "shipped").length}</h3>
          </div>
          <div className="border-l border-gray-100 pl-12 group cursor-default">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 group-hover:text-green-600 transition-colors">Delivered</p>
            <h3 className="text-5xl md:text-7xl font-medium text-black tracking-tighter group-hover:translate-x-2 transition-transform duration-500">{orders.filter(o => o.status === "delivered").length}</h3>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mb-16 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-grow group">
              <Search className="w-5 h-5 absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-300 group-focus-within:text-green-600 transition-colors" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-16 pl-14 pr-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/20 transition-all text-xl placeholder:text-gray-300"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-16 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/20 transition-all min-w-[180px] text-base font-medium">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 p-2">
                  <SelectItem value="all" className="rounded-xl py-3">All Status</SelectItem>
                  <SelectItem value="pending" className="rounded-xl py-3">Pending</SelectItem>
                  <SelectItem value="paid" className="rounded-xl py-3">Paid</SelectItem>
                  <SelectItem value="shipped" className="rounded-xl py-3">Shipped</SelectItem>
                  <SelectItem value="delivered" className="rounded-xl py-3">Delivered</SelectItem>
                  <SelectItem value="cancelled" className="rounded-xl py-3">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-16 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-4 focus:ring-green-500/5 focus:border-green-500/20 transition-all min-w-[180px] text-base font-medium">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 p-2">
                  <SelectItem value="date-desc" className="rounded-xl py-3">Newest First</SelectItem>
                  <SelectItem value="date-asc" className="rounded-xl py-3">Oldest First</SelectItem>
                  <SelectItem value="amount-desc" className="rounded-xl py-3">Highest Amount</SelectItem>
                  <SelectItem value="amount-asc" className="rounded-xl py-3">Lowest Amount</SelectItem>
                  <SelectItem value="status" className="rounded-xl py-3">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-2xl shadow-black/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Date & ID</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Products</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAndSortedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                          <Search className="w-10 h-10 text-gray-200" />
                        </div>
                        <p className="text-gray-400 text-xl font-light">No orders found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-8">
                        <div className="text-base font-medium text-black">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        <div className="text-[10px] font-mono text-gray-400 mt-1.5 uppercase tracking-widest">#{order._id.slice(-8)}</div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="text-base font-medium text-black">{order.address.fullName}</div>
                        <div className="text-sm text-gray-500 mt-1 font-light">{order.address.phone}</div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="text-sm text-gray-600 max-w-[240px] truncate font-medium">{getOrderSummary(order)}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest">
                          {order.products.reduce((sum, p) => sum + p.quantity, 0)} items
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="text-2xl font-medium text-black tracking-tighter">₹{order.totalAmount.toLocaleString()}</div>
                      </td>
                      <td className="px-8 py-8">
                        <Badge className={cn("rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border shadow-none", getStatusColor(order.status))}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openOrderModal(order)}
                          className="h-12 w-12 p-0 rounded-full hover:bg-green-50 hover:text-green-600 transition-all"
                        >
                          <Eye className="w-6 h-6" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <OrderDetailModal open={isModalOpen} onClose={() => setIsModalOpen(false)} order={selectedOrder} />
    </div>
  )
}
