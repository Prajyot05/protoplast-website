import { NextResponse } from "next/server";
import { createOrder } from "@/actions/razorpay";
import { auth } from "@clerk/nextjs/server";
import CourseRegistration from "@/models/CourseRegistration";
import CourseBatch from "@/models/CourseBatch";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    const formData = await req.json();

    if (!formData.batchId) {
      return NextResponse.json({ error: "Batch ID is required" }, { status: 400 });
    }

    await connectDB();

    // Verify batch exists and is active and has seats
    const batch = await CourseBatch.findById(formData.batchId);
    if (!batch || batch.status !== "active") {
      return NextResponse.json({ error: "This batch is no longer active." }, { status: 400 });
    }

    if (batch.currentRegistrations >= batch.maxSeats) {
      return NextResponse.json({ error: "This batch is full." }, { status: 400 });
    }

    // The course fee is dynamic based on the batch
    const courseFeeAmount = batch.price || 4999;
    const totalPaisa = courseFeeAmount * 100;

    // Create Razorpay order
    const razorOrder = await createOrder({
      amount: totalPaisa,
      receipt: `course_${Date.now()}`,
      notes: { 
        userId: userId || "guest", 
        course: "30-Day Hands-On Industrial Training Program",
        batchId: formData.batchId
      },
    });

    // Create CourseRegistration record
    await CourseRegistration.create({
      user: userId || null,
      batchId: formData.batchId,
      
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob,
      gender: formData.gender,
      fullAddress: formData.fullAddress,

      mobile: formData.mobile,
      email: formData.email,
      emergencyName: formData.emergencyName,
      emergencyNumber: formData.emergencyNumber,
      emergencyRelation: formData.emergencyRelation,

      college: formData.college,
      degree: formData.degree,
      branch: formData.branch,
      currentYear: formData.currentYear,
      cgpa: formData.cgpa,
      graduationYear: formData.graduationYear,

      priorExperience: formData.priorExperience,
      relevantSkills: formData.relevantSkills,
      ownLaptop: formData.ownLaptop,

      referralSource: formData.referralSource,
      motivation: formData.motivation,
      questions: formData.questions,

      amount: courseFeeAmount,
      paymentStatus: "pending",
      paymentIntentId: razorOrder.id,
    });

    return NextResponse.json({
      id: razorOrder.id,
      amount: razorOrder.amount,
      currency: razorOrder.currency
    });
  } catch (err: any) {
    console.error("💥 Course Order creation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
