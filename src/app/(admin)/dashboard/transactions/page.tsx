import { getAllTransactions } from "@/actions/transaction";
import TransactionClientView from "@/components/admin/TransactionClientView";

export default async function TransactionsPage() {
  const result = await getAllTransactions();

  let transactions = [];
  if (result.success && "data" in result && result.data) {
    transactions = result.data;
  }

  return <TransactionClientView transactions={transactions} />;
}
