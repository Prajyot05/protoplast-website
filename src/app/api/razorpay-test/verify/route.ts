import { NextResponse } from "next/server";
import { verifySignature, razorpay } from "@/actions/razorpay";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function POST(req: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    await req.json();

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
      userId:    order.notes?.userId ?? null,       // ← the user who created the order
      amount:    Number(payment.amount) / 100,     // convert paise → rupees
      currency:  payment.currency,
      method:    payment.method,
      status:    payment.status,
      metadata:  payment,                  // store full payment object if you like
    },
    { upsert: true, new: true }
  );

  console.log("✅ Payment verified and stored:", razorpay_payment_id);
  return NextResponse.json({ status: "verified" });
}
