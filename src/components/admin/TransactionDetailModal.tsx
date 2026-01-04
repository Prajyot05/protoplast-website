"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Calendar, CreditCard, User, Receipt } from "lucide-react"
import type { TransactionType } from "@/types/transaction"
import { cn } from "@/lib/utils"

interface Props {
  open: boolean
  onClose: () => void
  transaction: TransactionType | null
}

export default function TransactionDetailModal({ open, onClose, transaction }: Props) {
  if (!transaction) return null

  // Utility for status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
      case "captured":
        return "bg-green-50 text-green-600 border-green-100"
      case "pending":
        return "bg-yellow-50 text-yellow-600 border-yellow-100"
      case "failed":
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-100"
      default:
        return "bg-gray-50 text-gray-600 border-gray-100"
    }
  }

  const getTransactionTypeColor = (type?: string) => {
    switch (type?.toLowerCase?.()) {
      case "credit":
        return "bg-emerald-50 text-emerald-600 border-emerald-100"
      case "debit":
        return "bg-rose-50 text-rose-600 border-rose-100"
      case "transfer":
        return "bg-blue-50 text-blue-600 border-blue-100"
      default:
        return "bg-slate-50 text-slate-600 border-slate-100"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-white border-gray-100 p-0 rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-medium tracking-tight text-black">Transaction Details</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1 font-mono uppercase tracking-widest">
              #{transaction._id.slice(-12)}
            </DialogDescription>
          </DialogHeader>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-10">
          {/* Status and Type */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={cn("rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider border shadow-none", getStatusColor(transaction.status))}>
              {transaction.status}
            </Badge>
            {transaction.type && (
              <Badge className={cn("rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider border shadow-none", getTransactionTypeColor(transaction.type))}>
                {transaction.type}
              </Badge>
            )}
          </div>

          {/* Amount Section */}
          <div className="bg-green-50 border border-green-100 rounded-3xl p-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-2">Transaction Amount</p>
                <p className="text-5xl font-medium text-black tracking-tighter">₹{transaction.amount?.toLocaleString()}</p>
              </div>
              {transaction.fee && (
                <div className="text-right">
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Fee</p>
                  <p className="text-xl font-medium text-black tracking-tight">₹{transaction.fee}</p>
                </div>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-8">
            {/* Sender Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-600">
                <User className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Sender Information</h3>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Name</span>
                  <span className="text-sm font-medium text-black">{transaction.sender || "—"}</span>
                </div>
                {transaction.metadata?.email && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Email</span>
                    <span className="text-sm font-medium text-black">{transaction.metadata.email}</span>
                  </div>
                )}
                {transaction.metadata?.contact && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Contact</span>
                    <span className="text-sm font-medium text-black">{transaction.metadata.contact}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Reference Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-600">
                <Receipt className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Reference Details</h3>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Reference</span>
                  <span className="text-sm font-mono text-black">{transaction.referenceNumber || "—"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Order ID</span>
                  <span className="text-sm font-mono text-black">{transaction.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Payment ID</span>
                  <span className="text-sm font-mono text-black">{transaction.paymentId}</span>
                </div>
              </div>
            </div>

            {/* Date & Method */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-3 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Date</span>
                </div>
                <p className="text-sm font-medium text-black">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(transaction.createdAt).toLocaleTimeString()}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-3 text-gray-400">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Method</span>
                </div>
                <p className="text-sm font-medium text-black capitalize">{transaction.method}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 flex justify-end bg-white">
          <Button
            onClick={onClose}
            className="h-12 px-8 rounded-full bg-black text-white hover:bg-gray-800 transition-all font-medium"
          >
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

