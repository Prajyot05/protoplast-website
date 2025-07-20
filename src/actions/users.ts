// src/actions/users.ts
"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

/**
 * Fetch all users, for admin dashboard.
 */
export async function getAllUsers() {
  const authCheck = await requireAdmin();
  if (!authCheck.success) return authCheck;

  await connectDB();

  const users = await User.find()
    .select("name email role createdAt") 
    .sort({ createdAt: -1 })
    .lean();

  return {
    success: true,
    data: JSON.parse(JSON.stringify(users)),
  };
}

