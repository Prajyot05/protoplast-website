import { NextResponse } from "next/server";
import { verifySignature } from "@/actions/razorpay";

export async function POST(req: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    await req.json();

  const valid = verifySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!valid) {
    console.warn("Signature mismatch", { razorpay_order_id, razorpay_signature });
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  console.log("✅ TEST payment verified:", razorpay_payment_id);
  return NextResponse.json({ status: "verified" });
}
