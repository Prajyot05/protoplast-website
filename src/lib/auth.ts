import { auth } from "@clerk/nextjs/server";

export async function requireAdmin() {
  const { userId, sessionClaims } = await auth();
  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }
  return { success: true };
}
