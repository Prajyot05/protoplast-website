"use server";

import { connectDB } from "@/lib/db";
import CourseBatch from "@/models/CourseBatch";
import CourseRegistration from "@/models/CourseRegistration";
import { revalidatePath } from "next/cache";

export async function getBatches() {
  await connectDB();
  const batches = await CourseBatch.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(batches));
}

export async function getActiveBatch(courseType: string) {
  await connectDB();
  const batch = await CourseBatch.findOne({ courseType, status: "active" }).lean();
  return JSON.parse(JSON.stringify(batch));
}

export async function getBatchById(batchId: string) {
  await connectDB();
  const batch = await CourseBatch.findById(batchId).lean();
  return JSON.parse(JSON.stringify(batch));
}

export async function createBatch(data: {
  courseType: string;
  startDate: string;
  endDate: string;
  timing: string;
  maxSeats: number;
}) {
  try {
    await connectDB();
    const batch = await CourseBatch.create({
      courseType: data.courseType,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      timing: data.timing,
      maxSeats: data.maxSeats,
      status: "upcoming",
    });
    revalidatePath("/dashboard/courses");
    revalidatePath("/courses");
    return { success: true, data: JSON.parse(JSON.stringify(batch)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBatchStatus(batchId: string, status: string) {
  try {
    await connectDB();
    const batch = await CourseBatch.findByIdAndUpdate(batchId, { status }, { new: true });
    revalidatePath("/dashboard/courses");
    revalidatePath("/courses");
    return { success: true, data: JSON.parse(JSON.stringify(batch)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getRegistrationsForBatch(batchId: string) {
  await connectDB();
  const registrations = await CourseRegistration.find({ batchId, paymentStatus: "paid" }).lean();
  return JSON.parse(JSON.stringify(registrations));
}
