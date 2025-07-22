import { NextResponse } from "next/server";
import { createOrder } from "@/actions/razorpay";
import { getProductById } from "@/actions/products";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cart, promoCode } = await req.json();

  const promoMap: Record<string, number> = {
    SAVE10: 10,
    WELCOME15: 15,
    FIRST20: 20,
    TEST100: 100
  };
  const discountPct = promoMap[promoCode] ?? 0;

  let subtotal = 0;
  for (const item of cart) {
    const result = await getProductById(item.id);
    if (!result.success) return NextResponse.json({ error: "Invalid product" }, { status: 400 });

    const product = result.data;
    if (item.quantity > product.stock) {
      return NextResponse.json({ error: "Exceeds stock" }, { status: 400 });
    }

    subtotal += product.price * item.quantity;
  }

  const discount = (subtotal * discountPct) / 100;
  const tax = subtotal * 0.18;
  const shipping = 0; // for testing purpose only
  const total = subtotal + tax + shipping - discount;

  try {
    const order = await createOrder({
      amount: Math.round(total * 100),
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: userId,
        cart: JSON.stringify(cart),
        promoCode: promoCode || "",
      }   
    });
    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
