import { NextResponse }     from "next/server";
import { verifySignature }  from "@/actions/razorpay";
import { razorpay }         from "@/lib/razorpayclient";
import { connectDB }        from "@/lib/db";
import Transaction          from "@/models/Transaction";
import Order                from "@/models/Order";
import { reduceProductStockBatch } from "@/actions/products";

export async function POST(req: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart } =
    await req.json();

  // 1) Verify Razorpay signature
  if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  // 2) Fetch Razorpay metadata
  const razorOrder   = await razorpay.orders.fetch(razorpay_order_id);
  const razorPayment = await razorpay.payments.fetch(razorpay_payment_id);

  await connectDB();

  // 3) Upsert Transaction
  await Transaction.findOneAndUpdate(
    { paymentId: razorpay_payment_id },
    {
      orderId:   razorpay_order_id,
      paymentId: razorpay_payment_id,
      userId:    razorOrder.notes?.userId ?? null,
      amount:    Number(razorPayment.amount) / 100,
      currency:  razorPayment.currency,
      method:    razorPayment.method,
      status:    razorPayment.status,
      metadata:  razorPayment,
    },
    { upsert: true, new: true }
  );

  // 4) Mark our Order “paid”
  await Order.findOneAndUpdate(
    { paymentIntentId: razorpay_order_id },
    { status: "paid" }
  );

  // 5) Reduce product stock in batch
  if (Array.isArray(cart) && cart.length > 0) {
    await reduceProductStockBatch(cart);
  }

  return NextResponse.json({ status: "verified" });
}
