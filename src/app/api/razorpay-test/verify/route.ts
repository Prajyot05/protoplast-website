import { NextResponse } from "next/server";
import { verifySignature } from "@/actions/razorpay";
import { razorpay } from "@/lib/razorpayclient";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { reduceProductStockBatch } from "@/actions/products";

export async function POST(req: Request) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart } = body;

  // 1) Verify signature
  const valid = verifySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!valid) {
    console.warn("Signature mismatch", { razorpay_order_id, razorpay_signature });
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  // 2) Fetch the order back from Razorpay to get the notes (and amount/currency if needed)
  const order = await razorpay.orders.fetch(razorpay_order_id);

  // 3) Optionally fetch the payment for method/status metadata
  const payment = await razorpay.payments.fetch(razorpay_payment_id);

  // 4) Upsert into your MongoDB
  await connectDB();
  await Transaction.findOneAndUpdate(
    { paymentId: razorpay_payment_id },
    {
      orderId:   razorpay_order_id,
      paymentId: razorpay_payment_id,
      userId:    order.notes?.userId ?? null,
      amount:    Number(payment.amount) / 100,
      currency:  payment.currency,
      method:    payment.method,
      status:    payment.status,
      metadata:  payment,
    },
    { upsert: true, new: true }
  );

  console.log("✅ Payment verified and stored:", razorpay_payment_id);
  console.log("Order details:", order);
  console.log("Payment details:", payment);
  console.log("Transaction stored in MongoDB", {
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    userId: order.notes?.userId ?? null,
    amount: Number(payment.amount) / 100,
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
  });
  console.log("🧾 Razorpay verify request received");
  console.log("Cart passed:", cart);

  // Reduce stock in MongoDB
  if (Array.isArray(cart) && cart.length > 0) {
    console.log("🔧 Reducing stock for:", cart);
    await reduceProductStockBatch(cart);
    console.log("✅ Stock reduction complete");
  } else {
    console.warn("⚠️ No cart items to reduce stock for");
  }

  return NextResponse.json({ status: "verified" });
}
