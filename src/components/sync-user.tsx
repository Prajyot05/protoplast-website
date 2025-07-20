"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { syncClerkUserToDB } from "@/actions/sync-user";

export default function SyncUser() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;
    syncClerkUserToDB().catch((err) =>
      console.error("Failed to sync user:", err)
    );
  }, [isSignedIn]);

  return null;
}
