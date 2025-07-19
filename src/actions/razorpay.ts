// src/actions/razorpay.ts
import Razorpay from "razorpay";
import crypto from "crypto";

// 1) Centralize Razorpay client instantiation
export const razorpay = new Razorpay({
  key_id:    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// 2) Typed payload for order creation
export interface CreateOrderInput {
  amount: number;       // in paise
  currency?: "INR";     // defaulted below
  receipt: string;
}

// 3) Helper to create an order
export async function createOrder(input: CreateOrderInput) {
  return razorpay.orders.create({
    amount:   input.amount,
    currency: input.currency ?? "INR",
    receipt:  input.receipt,
  });
}

// 4) Helper to verify a payment signature
export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const hmac = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return hmac === signature;
}
