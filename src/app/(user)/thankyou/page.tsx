"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, PartyPopper } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalProduct } from "@/stores/useLocalProduct";
import { useProductStore } from "@/stores/useProductStore";

export default function ThankYouPage() {
  const router = useRouter();

  // 1) Hook into your Zustand product store…
  const reduceStockForCart = useProductStore((s) => s.reduceStockForCart);

  // 2) …and your cart store
  const clearCart = useLocalProduct((s) => s.clearCart);

  useEffect(() => {
    // a) Make sure this page was reached after payment
    const paidFlag = localStorage.getItem("payment_success");
    if (paidFlag !== "true") {
      router.replace("/products/687a816fa6b0f6a663493f5d");
      return;
    }

    // b) Remove the flag, so this only runs once
    localStorage.removeItem("payment_success");

    // c) Grab the cart items you stored before payment
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

    // d) 1️⃣ Update client‑side stock…
    reduceStockForCart(cartItems);

    // e) 2️⃣ Clear the cart
    clearCart();

    // f) (optional) Clean up your saved cartDetails
    localStorage.removeItem("cartItems");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card
        className="w-full max-w-md text-center shadow-lg border border-green-500 animate-fade-in 
                   transition-shadow hover:shadow-2xl hover:border-green-600 group"
      >
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle
              className="w-12 h-12 text-green-500 animate-pulse"
              aria-label="Payment Success"
            />
            <PartyPopper
              className="w-7 h-7 text-yellow-400 animate-bounce"
              aria-label="Celebration"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            Thank You!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Your payment was successful. We appreciate your purchase!
          </p>
          <Link href="/products/687a816fa6b0f6a663493f5d">
            <Button
              className="w-full flex items-center justify-center gap-2 transition duration-200 bg-green-500 hover:bg-green-600  hover:scale-[1.03] focus:ring-2 focus:ring-green-400 group"
              aria-label="Back to Product"
            >
              Back to Product
              <ArrowRight
                className="w-5 h-5 ml-1 text-white group-hover:translate-x-1 transition-transform duration-200"
              />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
