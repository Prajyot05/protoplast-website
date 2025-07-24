"use server"

import { connectDB } from "@/lib/db"
import Order from "@/models/Order"
import Address from "@/models/Address"
import Product from "@/models/Product"

export async function getAllOrders() {
  try {
    await connectDB()

    const orders = await Order.find({})
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
    console.error("Error fetching orders:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch orders",
    }
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await connectDB()

    const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: "Invalid status",
      }
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })

    if (!order) {
      return {
        success: false,
        error: "Order not found",
      }
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(order)),
    }
  } catch (error: any) {
    console.error("Error updating order status:", error)
    return {
      success: false,
      error: error.message || "Failed to update order status",
    }
  }
}
