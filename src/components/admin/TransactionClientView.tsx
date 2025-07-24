"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowUpDown, Eye, Filter, Clock, Hash, CreditCard, User } from "lucide-react"
import TransactionDetailModal from "@/components/admin/TransactionDetailModal"
import type { TransactionType } from "@/types/transaction"

interface Props {
  transactions: TransactionType[]
}

export default function TransactionClientView({ transactions }: Props) {
  const [selectedTx, setSelectedTx] = useState<TransactionType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  // Optional util checks for missing fields
  const smartField = (val: any, meta?: any, key?: string) => val ?? (meta && key ? meta[key] : "—")

  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactions.filter((tx) => {
      // Search matches
      const matchesSearch =
        (tx.sender?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (tx.receiver?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        tx._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.referenceNumber && tx.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.metadata?.email && tx.metadata.email.toLowerCase().includes(searchTerm.toLowerCase()))

      // Status matches
      const statusMatch =
        statusFilter === "all" ||
        tx.status.toLowerCase() === statusFilter ||
        (tx.status.toLowerCase() === "captured" && statusFilter === "completed")

      // Type matches
      const typeMatch = typeFilter === "all" || (typeof tx.type === "string" && tx.type.toLowerCase() === typeFilter)

      return matchesSearch && statusMatch && typeMatch
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "amount-desc":
          return b.amount - a.amount
        case "amount-asc":
          return a.amount - b.amount
        default:
          return 0
      }
    })

    return filtered
  }, [transactions, searchTerm, statusFilter, typeFilter, sortBy])

  // Status color badge
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
      case "captured":
        return "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 transition-colors"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30 transition-colors"
      case "failed":
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 transition-colors"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30 transition-colors"
    }
  }

  // Transaction type badge
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

  const openTransactionModal = (transaction: TransactionType) => {
    setSelectedTx(transaction)
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
            <ArrowUpDown className="w-4 h-4 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Transactions
          </h1>
        </div>
        <p className="text-gray-400 text-lg">Manage and view all transaction details</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">
            Total: <span className="font-semibold text-green-400">{filteredAndSortedTransactions.length}</span>{" "}
            transactions
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-gray-900/50 border-gray-800/50 backdrop-blur-sm animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-gray-300">Filters & Search</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-400 transition-colors" />
              <Input
                placeholder="Search by name, ID, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 transition-all"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-green-500 focus:ring-green-500/20 transition-all">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-green-500 focus:ring-green-500/20 transition-all">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-green-500 focus:ring-green-500/20 transition-all">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="amount-desc">Highest Amount</SelectItem>
                <SelectItem value="amount-asc">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Table Header */}
      <div className="bg-gray-900/30 border border-gray-800/30 rounded-t-lg px-6 py-4 mb-0">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
          <div className="col-span-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Date & Time
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Transaction ID
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Sender
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Amount
          </div>
          <div className="col-span-2">Status & Type</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>
      </div>

      {/* Transactions */}
      {filteredAndSortedTransactions.length === 0 ? (
        <Card className="bg-gray-900/30 border-gray-800/30 backdrop-blur-sm rounded-t-none">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg">No transactions found matching your criteria.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-gray-900/20 border-x border-b border-gray-800/30 rounded-b-lg">
          {filteredAndSortedTransactions.map((tx, index) => (
            <div
              key={tx._id}
              className="border-b border-gray-800/20 last:border-b-0 hover:bg-gray-900/40 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="px-6 py-4">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Date & Time */}
                  <div className="col-span-2">
                    <div className="text-sm text-white font-medium">{new Date(tx.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleTimeString()}</div>
                  </div>

                  {/* Transaction ID */}
                  <div className="col-span-2">
                    <div className="font-mono text-xs text-gray-300 bg-gray-800/50 px-2 py-1 rounded truncate">
                      {tx._id}
                    </div>
                  </div>

                  {/* Sender */}
                  <div className="col-span-2">
                    <div className="text-sm text-white truncate">{smartField(tx.sender, tx.metadata, "contact")}</div>
                    {tx.metadata?.email && <div className="text-xs text-gray-400 truncate">{tx.metadata.email}</div>}
                  </div>

                  {/* Amount */}
                  <div className="col-span-2">
                    <div className="text-lg font-bold text-white">₹{tx.amount.toLocaleString()}</div>
                    {tx.fee && <div className="text-xs text-gray-400">Fee: ₹{tx.fee}</div>}
                  </div>

                  {/* Status & Type */}
                  <div className="col-span-2">
                    <div className="flex flex-col gap-1">
                      <Badge className={`${getStatusColor(tx.status)} border font-medium px-2 py-1 text-xs w-fit`}>
                        {tx.status}
                      </Badge>
                      {tx.type && (
                        <Badge
                          className={`${getTransactionTypeColor(tx.type)} border font-medium px-2 py-1 text-xs w-fit`}
                        >
                          {tx.type}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 text-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openTransactionModal(tx)}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30 hover:border-green-500/50 transition-all duration-200"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <TransactionDetailModal open={isModalOpen} onClose={() => setIsModalOpen(false)} transaction={selectedTx} />
    </div>
  )
}
