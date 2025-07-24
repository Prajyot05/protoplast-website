"use server";

import crypto from "crypto";
import { razorpay } from "@/lib/razorpayclient";
import { reduceProductStockForPayment } from "@/actions/products";
import { connectDB } from "@/lib/db";

export interface CreateOrderInput {
  amount: number;              
  currency?: "INR";              
  receipt: string;
  notes?: Record<string, string>; 
}

// 3) Helper to create an order
export async function createOrder(input: CreateOrderInput) {
  try {
    const order = await razorpay.orders.create({
      amount: input.amount,
      currency: input.currency ?? "INR",
      receipt: input.receipt,
      notes: input.notes,
    });
    
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Failed to create payment order");
  }
}

// 4) Helper to verify a payment signature
export async function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const hmac = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return hmac === signature;
}

// 5) NEW: Handle post-payment success with stock management
export async function handlePaymentSuccess({
  userId,
  cartItems,
  paymentInfo,
}: {
  userId: string;
  cartItems: { productId: string; quantity: number }[];
  paymentInfo: any; // Razorpay response object
}) {
  try {
    await connectDB();

    const updatedProducts: any[] = [];
    const errors: string[] = [];
    
    console.log("Processing payment success for:", { userId, cartItems, paymentInfo });

    // Verify payment signature first (if signature data is available)
    if (paymentInfo.razorpay_order_id && paymentInfo.razorpay_payment_id && paymentInfo.razorpay_signature) {
      const isValid = verifySignature(
        paymentInfo.razorpay_order_id,
        paymentInfo.razorpay_payment_id,
        paymentInfo.razorpay_signature
      );

      if (!isValid) {
        return {
          success: false,
          error: "Invalid payment signature"
        };
      }
    }

    // Process stock reduction for each item
    for (const item of cartItems) {
      try {
        const result = await reduceProductStockForPayment(item.productId, item.quantity);

        if (!result.success) {
          errors.push(`Product ${item.productId}: ${result.error}`);
          console.error(`Failed to update stock for ${item.productId}:`, result.error);
        } else {
          updatedProducts.push(result.data);
          console.log(`Successfully updated stock for ${item.productId}`);
        }
      } catch (error) {
        const errorMsg = `Product ${item.productId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(`Exception updating stock for ${item.productId}:`, error);
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: `Failed to update stock: ${errors.join(', ')}`,
        partialSuccess: updatedProducts.length > 0,
        updatedProducts,
      };
    }

    return {
      success: true,
      message: "Stock updated successfully after payment.",
      updatedProducts,
    };
  } catch (error) {
    console.error("Payment success handler error:", error);
    return {
      success: false,
      error: "Internal server error during payment processing"
    };
  }
}
