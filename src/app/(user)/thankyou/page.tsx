"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, PartyPopper, Home, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalProduct } from "@/stores/useLocalProduct";
import { useProductStore } from "@/stores/useProductStore";
import Header from "@/components/header";
import Footer from "@/pages/footer";

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
  }, [clearCart, reduceStockForCart, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <div className="flex-grow">
        {/* Breadcrumb */}
        <div className="pt-4 pb-4 border-b border-gray-100">
          <div className="container mx-auto px-6 max-w-7xl">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
                <Home className="h-4 w-4" />
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-black font-medium">Success</span>
            </nav>
          </div>
        </div>

        {/* Header Section */}
        <section className="py-16 px-6 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-4xl">
                <h1 className="text-black text-5xl md:text-7xl font-medium leading-tight tracking-tight mb-6">
                  Order <span className="text-green-600">Confirmed</span>
                </h1>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                  Thank you for your purchase. Your order has been placed successfully.
                </p>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <PartyPopper className="w-12 h-12 text-yellow-400 animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 max-w-7xl py-12">
          <div className="text-center py-32 bg-gray-50 rounded-3xl border border-gray-100 border-dashed animate-in zoom-in-95 duration-500">
            <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-3xl font-medium text-black mb-3 tracking-tight">Payment Successful</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
              We&apos;ve received your order and are getting it ready for shipment. You can track your order status in your dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="bg-black text-white hover:bg-gray-800 rounded-full px-10 py-6 text-lg shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95">
                <Link href="/orders">
                  View My Orders <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-200 hover:bg-gray-100 rounded-full px-10 py-6 text-lg transition-all hover:scale-105 active:scale-95">
                <Link href="/products">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats/Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 border-t border-gray-100 pt-16">
            <div className="group cursor-default">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 group-hover:text-green-600 transition-colors">Confirmation</p>
              <h3 className="text-2xl font-medium text-black tracking-tight">Email Sent</h3>
              <p className="text-gray-500 mt-2">Check your inbox for order details</p>
            </div>
            <div className="border-l border-gray-100 pl-8 group cursor-default">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 group-hover:text-green-600 transition-colors">Shipping</p>
              <h3 className="text-2xl font-medium text-black tracking-tight">Fast Delivery</h3>
              <p className="text-gray-500 mt-2">Estimated delivery in 3-5 business days</p>
            </div>
            <div className="border-l border-gray-100 pl-8 group cursor-default">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 group-hover:text-green-600 transition-colors">Support</p>
              <h3 className="text-2xl font-medium text-black tracking-tight">24/7 Help</h3>
              <p className="text-gray-500 mt-2">Contact us anytime for assistance</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
