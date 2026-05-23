import { NextResponse }     from "next/server";
import { verifySignature }  from "@/actions/razorpay";
import { razorpay }         from "@/lib/razorpayclient";
import { connectDB }        from "@/lib/db";
import Transaction          from "@/models/Transaction";
import CourseRegistration   from "@/models/CourseRegistration";
import CourseBatch          from "@/models/CourseBatch";
import { sendRegistrationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

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
        userId:    razorOrder.notes?.userId !== "guest" ? razorOrder.notes?.userId : null,
        amount:    Number(razorPayment.amount) / 100,
        currency:  razorPayment.currency,
        method:    razorPayment.method,
        status:    razorPayment.status,
        metadata:  razorPayment,
      },
      { upsert: true, new: true }
    );

    // 4) Mark CourseRegistration “paid”
    const registration = await CourseRegistration.findOneAndUpdate(
      { paymentIntentId: razorpay_order_id },
      { paymentStatus: "paid" },
      { new: true }
    );

    if (registration) {
      // 5) Increment Batch Registrations
      const batch = await CourseBatch.findById(registration.batchId);
      if (batch) {
        batch.currentRegistrations += 1;
        if (batch.currentRegistrations >= batch.maxSeats) {
          batch.status = "full";
        }
        await batch.save();

        // 6) Send Email Notification
        await sendRegistrationEmail(registration, batch);
      }
    }

    return NextResponse.json({ status: "verified" });
  } catch (err: any) {
    console.error("💥 Course Verification error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
