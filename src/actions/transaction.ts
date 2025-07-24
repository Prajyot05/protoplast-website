"use server";

import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { requireAdmin } from "@/lib/auth";

export async function getAllTransactions() {
  const authCheck = await requireAdmin();
  if (!authCheck.success) return authCheck;

  await connectDB();
  const txns = await Transaction.find().sort({ createdAt: -1 }).lean();
  return {
    success: true,
    data: JSON.parse(JSON.stringify(txns)),
  };
}
