import { NextResponse } from "next/server";
import { createOrder } from "@/actions/razorpay";
import { getProductById } from "@/actions/products";
import { auth } from "@clerk/nextjs/server";
import Address from "@/models/Address";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  console.log("⏳ POST /api/razorpay-test/order called");
  const { userId } = await auth();
  console.log("🔑 Auth userId:", userId);
  if (!userId) {
    console.error("❌ Unauthorized: no userId");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cart, promoCode, shipping } = await req.json();
  console.log("📦 Payload:", { cart, promoCode, shipping });

  // Validate cart
  if (!Array.isArray(cart) || cart.length === 0) {
    console.error("❌ Cart invalid or empty");
    return NextResponse.json({ error: "Cart is empty or invalid" }, { status: 400 });
  }

  // Validate shipping
  const requiredFields = ["fullName", "phone", "street", "city", "state", "zip", "country"];
  for (const field of requiredFields) {
    if (!shipping?.[field]) {
      console.error(`❌ Missing shipping field: ${field}`);
      return NextResponse.json({ error: `Missing shipping field: ${field}` }, { status: 400 });
    }
  }

  // Promo
  const promoMap: Record<string, number> = {
    SAVE10: 10,
    WELCOME15: 15,
    FIRST20: 20,
    TEST100: 100,
  };
  const discountPct = promoMap[promoCode?.toUpperCase?.()] ?? 0;
  console.log("🏷️ Promo code pct:", discountPct);

  // Calculate totals
  let subtotal = 0;
  const productDetails: Array<{ id: string; quantity: number; price: number }> = [];

  for (const item of cart) {
    const result = await getProductById(item.id);
    if (!result.success) {
      console.error("❌ Invalid product:", item.id);
      return NextResponse.json({ error: `Invalid product: ${item.id}` }, { status: 400 });
    }
    const product = result.data;
    if (item.quantity > product.stock) {
      console.error("❌ Exceeds stock for:", product.name);
      return NextResponse.json({ error: `Exceeds stock for: ${product.name}` }, { status: 400 });
    }
    subtotal += product.price * item.quantity;
    productDetails.push({ id: item.id, quantity: item.quantity, price: product.price });
  }

  const discount = (subtotal * discountPct) / 100;
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * 0.18;
  const shippingFee = 0; // testing
  const total = taxableAmount + tax + shippingFee;

  console.log("💰 Calculations:", { subtotal, discount, taxableAmount, tax, shippingFee, total });

  try {
    await connectDB();
    console.log("✅ Connected to DB");

    // Save address
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
    console.log("📍 Address saved:", addressDoc._id);

    // Create Razorpay order
    const razorOrder = await createOrder({
      amount: Math.round(total * 100), // paisa
      receipt: `rcpt_${Date.now()}`,
      notes: { userId, cart: JSON.stringify(cart), promoCode: promoCode || "" },
    });
    console.log("🔗 Razorpay order created:", razorOrder);

    // Create our Order record
    const orderDoc = await Order.create({
      user: userId,
      address: addressDoc._id,
      products: productDetails.map(p => ({
        product: p.id,
        quantity: p.quantity,
        priceAtPurchase: p.price,
      })),
      totalAmount: Math.round(total * 100) / 100,
      paymentIntentId: razorOrder.id,
    });
    console.log("🗂️ Order record created:", orderDoc._id);

    // FINAL RESPONSE
    const responsePayload = {
      id: razorOrder.id,
      amount: razorOrder.amount,
      currency: razorOrder.currency
    };
    console.log("➡️ Responding with:", responsePayload);
    return NextResponse.json(responsePayload);
  } catch (err: any) {
    console.error("💥 Order creation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
