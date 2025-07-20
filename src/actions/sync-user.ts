
"use server";

import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function syncClerkUserToDB() {
  const clerkUser = await currentUser();
  if (!clerkUser) return;

  await connectDB();

  const existingUser = await User.findOne({ clerkId: clerkUser.id });

  if (!existingUser) {
    await User.create({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      name: clerkUser.firstName + " " + clerkUser.lastName,
      role: "user",
    });
  }
}
