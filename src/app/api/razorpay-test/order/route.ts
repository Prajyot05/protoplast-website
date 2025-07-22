import { NextResponse } from "next/server";
import { createOrder } from "@/actions/razorpay";
import { getProductById } from "@/actions/products";
import { auth } from "@clerk/nextjs/server";
import Address from "@/models/Address";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cart, promoCode, shipping } = await req.json();

  const promoMap: Record<string, number> = {
    SAVE10: 10,
    WELCOME15: 15,
    FIRST20: 20,
    TEST100: 100,
  };
  const discountPct = promoMap[promoCode] ?? 0;

  let subtotal = 0;
  for (const item of cart) {
    const result = await getProductById(item.id);
    if (!result.success)
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });

    const product = result.data;
    if (item.quantity > product.stock) {
      return NextResponse.json({ error: "Exceeds stock" }, { status: 400 });
    }

    subtotal += product.price * item.quantity;
  }

  const discount = (subtotal * discountPct) / 100;
  const tax = subtotal * 0.18;
  const shippingFee = 0; // for testing purpose only
  const total = subtotal + tax + shippingFee - discount;

  try {
    await connectDB();

    // 2) Save shipping address
    const addressDoc = await Address.create({
      user: userId,
      type: "shipping",
      fullName: shipping.fullName,
      phone: shipping.phone,
      street: shipping.street,
      city: shipping.city,
      state: shipping.state,
      zip: shipping.zip,
      country: shipping.country,
    });

    // 3) Create Razorpay order
    const razorOrder = await createOrder({
      amount: Math.round(total * 100),
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId,
        cart: JSON.stringify(cart),
        promoCode: promoCode || "",
      },
    });
    // 4) Create our Order record
    const orderDoc = await Order.create({
      user: userId,
      address: addressDoc._id,
      products: cart.map((i: any) => ({
        product: i.id,
        quantity: i.quantity,
        priceAtPurchase: Math.round(subtotal * 100) / 100, // or fetch per‑item price
      })),
      totalAmount: total,
      paymentIntentId: razorOrder.id,
    });

    return NextResponse.json({
      razorpay: razorOrder,
      ourOrderId: orderDoc._id,
    });
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
