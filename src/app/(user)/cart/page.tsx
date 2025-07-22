"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Tag,
  Mail,
  UserIcon,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useProductStore } from "@/stores/useProductStore";
import { useLocalProduct } from "@/stores/useLocalProduct";
import { toast } from "sonner";
import Script from "next/script";
import type { ProductType } from "@/models/Product";

export default function CartPage() {
  const { updateInStore } = useProductStore();
  const router = useRouter();
  const { user } = useUser();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useLocalProduct();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isPayLoading, setIsPayLoading] = useState(false);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.18;
  const shipping: number = 0;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + tax + shipping - discountAmount;

  const handleQuantityChange = (id: string, qty: number) => {
    if (qty < 1) return;
    updateQuantity(id, qty);
    toast.success("Quantity updated");
  };

  const handleRemoveItem = (id: string, title: string) => {
    removeFromCart(id);
    toast.success(`${title} removed from cart`);
  };

  const handleApplyPromo = () => {
    const codes: Record<string, number> = {
      SAVE10: 10,
      WELCOME15: 15,
      FIRST20: 20,
      TEST100: 100,
    };
    const pct = codes[promoCode];
    if (pct) {
      setDiscount(pct);
      toast.success(`Promo applied: ${pct}% off`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleProceedToPayment = async () => {
    if (!cart.length) {
      toast.error("Your cart is empty");
      return;
    }
    setIsPayLoading(true);

    try {
      // 1) Create order on your backend
      const orderRes = await fetch("/api/razorpay-test/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cart.map((item) => ({ id: item._id, quantity: item.quantity })),
          promoCode,
        }),
      });
      if (!orderRes.ok) throw new Error("Order creation failed");
      const order = await orderRes.json();

      // 2) Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: "Protoplast Studio",
        order_id: order.id,
        prefill: {
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
        },
        handler: async (resp: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // — build your cart payload again —
          const cartPayload = cart.map((item) => ({
            id:       item._id,
            quantity: item.quantity,
          }));

          // 3) Verify & reduce stock on the server
          const verifyRes = await fetch("/api/razorpay-test/verify", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
              ...resp,
              cart: cartPayload,
            }),
          });
          const { status, updatedProducts } = await verifyRes.json();

          if (status === "verified") {
            // update your client store
            updatedProducts.forEach((p: ProductType) => updateInStore(p));
            toast.success("Payment successful!");
            clearCart();
            router.push("/thankyou");
          } else {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#22c55e" },
      };
      // @ts-ignore
      new window.Razorpay(options).open();
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong during payment");
    } finally {
      setIsPayLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/products/687a816fa6b0f6a663493f5d">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold mb-2">
                Your cart is empty
              </h2>
              <Link href="/products/687a816fa6b0f6a663493f5d">
                <Button className="bg-green-600 text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/products/687a816fa6b0f6a663493f5d">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <Badge variant="secondary">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
              </Badge>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-500">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Clear your cart?</DialogTitle>
                </DialogHeader>
                <p>This will remove all items permanently.</p>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        clearCart();
                        toast.success("Cart cleared");
                      }}
                    >
                      Clear Cart
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {user && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon /> Customer Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserIcon /> {user.fullName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail /> {user.primaryEmailAddress?.emailAddress}
                    </div>
                  </CardContent>
                </Card>
              )}

              {cart.map((item) => (
                <Card key={item._id}>
                  <CardContent className="flex gap-4 p-6">
                    <div className="relative w-24 h-24">
                      <Image
                        src={item.images?.[0] || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Remove this item?</DialogTitle>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleRemoveItem(item._id, item.title)
                                  }
                                >
                                  Remove
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ₹{item.price.toLocaleString()} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag /> Promo Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value.toUpperCase())
                      }
                    />
                    <Button onClick={handleApplyPromo} disabled={!promoCode}>
                      Apply
                    </Button>
                  </div>
                  {discount > 0 && (
                    <p className="text-green-600">✓ {discount}% off applied</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleProceedToPayment}
                    disabled={isPayLoading}
                  >
                    {isPayLoading ? (
                      "Processing…"
                    ) : (
                      <>
                        <CreditCard className="inline-block mr-2" />
                        Pay ₹{total.toLocaleString()}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className="flex gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield /> Secure Payment
                </div>
                <div className="flex items-center gap-2">
                  <Truck /> Fast Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
