import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";

// ✅ Create a reusable type for params
type RouteParams = { params: { id: string } };

// ✅ GET: Fetch a cart by ID
export async function GET(_: Request, { params }: RouteParams) {
  await connectDB();
  const cart = await Cart.findById(params.id).populate("user items.product");
  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }
  return NextResponse.json(cart);
}

// ✅ PUT: Update a cart by ID
export async function PUT(req: Request, { params }: RouteParams) {
  await connectDB();
  const updates = await req.json();
  const updated = await Cart.findByIdAndUpdate(params.id, updates, {
    new: true,
  });
  return NextResponse.json(updated);
}

// ✅ DELETE: Delete a cart by ID
export async function DELETE(_: Request, { params }: RouteParams) {
  await connectDB();
  const deleted = await Cart.findByIdAndDelete(params.id);
  return NextResponse.json(deleted);
}
