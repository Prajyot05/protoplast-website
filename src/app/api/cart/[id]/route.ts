import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const cart = await Cart.findById(params.id).populate("user items.product");
  if (!cart)
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  return NextResponse.json(cart);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const updates = await req.json();
  const updated = await Cart.findByIdAndUpdate(params.id, updates, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const deleted = await Cart.findByIdAndDelete(params.id);
  return NextResponse.json(deleted);
}
