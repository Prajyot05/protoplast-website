import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("HETYEYEYE");
  await connectDB();
  const products = await Product.find().populate("category");
  console.log("PRODUCTS: ", products);
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const product = await Product.create(data);
  return NextResponse.json(product, { status: 201 });
}
