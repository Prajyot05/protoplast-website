"use server"

import { connectDB } from "@/lib/db"
import Order from "@/models/Order"
import Address from "@/models/Address"
import Product from "@/models/Product"
import { auth } from "@clerk/nextjs/server"

export async function getCustomerOrders() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    await connectDB()

    const orders = await Order.find({ user: userId })
      .populate({
        path: "address",
        model: Address,
      })
      .populate({
        path: "products.product",
        model: Product,
        select: "title price images",
      })
      .sort({ createdAt: -1 })
      .lean()

    return {
      success: true,
      data: JSON.parse(JSON.stringify(orders)),
    }
  } catch (error: any) {
    console.error("Error fetching customer orders:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch orders",
    }
  }
}
