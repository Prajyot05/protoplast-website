// lib/db.ts
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(uri!);
    isConnected = true;
    console.log(">>>>>>Connected to MongoDB<<<<<<");
  } catch (error) {
    console.error("Error connecting to DB:", error);
    throw error;
  }
}
