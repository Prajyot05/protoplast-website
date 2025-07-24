"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Calendar, CreditCard, User, Hash, Receipt } from "lucide-react"
import type { TransactionType } from "@/types/transaction"

interface Props {
  open: boolean
  onClose: () => void
  transaction: TransactionType | null
}

export default function TransactionDetailModal({ open, onClose, transaction }: Props) {
  if (!open || !transaction) return null

  // Utility for status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
      case "captured":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTransactionTypeColor = (type?: string) => {
    switch (type?.toLowerCase?.()) {
      case "credit":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "debit":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30"
      case "transfer":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-lg bg-gray-900/95 border-gray-800/50 backdrop-blur-md shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Transaction Details
              </h2>
              <p className="text-gray-400 text-sm mt-1">Complete transaction information</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Scrollable Content */}
        <CardContent className="flex-1 overflow-y-auto space-y-4 px-6 pb-6">
          {/* Status and Type */}
          <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-gray-800/50">
            <Badge className={`${getStatusColor(transaction.status)} border font-medium px-3 py-1 text-sm`}>
              {transaction.status}
            </Badge>
            {transaction.type && (
              <Badge className={`${getTransactionTypeColor(transaction.type)} border font-medium px-3 py-1 text-sm`}>
                {transaction.type}
              </Badge>
            )}
          </div>

          {/* Amount Section */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Transaction Amount</p>
                <p className="text-2xl font-bold text-white">₹{transaction.amount?.toLocaleString()}</p>
              </div>
              {transaction.fee && (
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">Processing Fee</p>
                  <p className="text-lg font-semibold text-gray-300">₹{transaction.fee}</p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Info */}
          <div className="space-y-3">
            {/* Transaction ID */}
            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-gray-300">Transaction ID</span>
              </div>
              <p className="font-mono text-sm text-white bg-gray-800/50 px-2 py-1 rounded break-all">
                {transaction._id}
              </p>
            </div>

            {/* Sender with Contact Info */}
            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">Sender Information</span>
              </div>
              <div className="space-y-2">
                <p className="text-white font-medium">{transaction.sender || "—"}</p>
                {transaction.metadata && (
                  <div className="space-y-1 text-sm">
                    {transaction.metadata.contact && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contact:</span>
                        <span className="text-gray-300">{transaction.metadata.contact}</span>
                      </div>
                    )}
                    {transaction.metadata.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-gray-300">{transaction.metadata.email}</span>
                      </div>
                    )}
                    {transaction.metadata.vpa && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">VPA:</span>
                        <span className="text-gray-300">{transaction.metadata.vpa}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-gray-300">Date & Time</span>
              </div>
              <p className="text-white">{new Date(transaction.createdAt).toLocaleString()}</p>
            </div>

            {/* Reference Details */}
            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-gray-300">Reference Details</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Reference:</span>
                  <span className="text-white font-mono">{transaction.referenceNumber || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID:</span>
                  <span className="text-white font-mono">{transaction.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment ID:</span>
                  <span className="text-white font-mono">{transaction.paymentId}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-gray-300">Payment Method</span>
              </div>
              <p className="text-white capitalize">{transaction.method}</p>
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-3 border-t border-gray-800/50">
            <Button
              onClick={onClose}
              className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 hover:border-green-500/50 transition-all duration-200"
            >
              Close Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
