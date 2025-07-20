import { getAllTransactions } from "@/actions/transaction";

export default async function TransactionsPage() {
  const result = await getAllTransactions();
  console.log("Transactions result:", result);

  if (!result.success) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <h2 className="text-red-400 font-semibold mb-2">Error</h2>
          <p className="text-red-300">{"Failed to load transactions"}</p>
        </div>
      </div>
    )
  }

  const transactions = "data" in result && result.data ? result.data : [];
    console.log("Transactions data:", transactions);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const formatAmount = (amount: number, currency = "INR") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100) // Assuming amount is in cents
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
        <p className="text-gray-400">View and manage all payment transactions</p>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-card-foreground">All Transactions ({transactions.length})</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Payment ID</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">User ID</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Method</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction: any, index: number) => (
                    <tr
                      key={transaction._id || index}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-mono text-sm text-card-foreground">{transaction.paymentId}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-sm text-card-foreground">{transaction.orderId}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-sm text-muted-foreground">{transaction.userId}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-card-foreground">
                          {formatAmount(transaction.amount, transaction.currency)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-card-foreground capitalize">{transaction.method}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-muted-foreground text-sm">
                          {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tablet/Mobile Card View */}
            <div className="lg:hidden">
              {transactions.map((transaction: any, index: number) => (
                <div key={transaction._id || index} className="p-4 border-b border-border last:border-b-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-card-foreground">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Payment ID:</span>
                        <div className="font-mono text-card-foreground break-all">{transaction.paymentId}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Order ID:</span>
                        <div className="font-mono text-card-foreground break-all">{transaction.orderId}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Method:</span>
                        <div className="text-card-foreground capitalize">{transaction.method}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">User ID:</span>
                        <div className="font-mono text-muted-foreground text-xs break-all">{transaction.userId}</div>
                      </div>
                    </div>

                    <div className="text-muted-foreground text-xs">
                      Created:{" "}
                      {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
