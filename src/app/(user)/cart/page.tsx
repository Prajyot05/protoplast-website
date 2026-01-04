"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  MapPin,
  Phone,
  Home,
  AlertCircle,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProductStore } from "@/stores/useProductStore";
import { useLocalProduct } from "@/stores/useLocalProduct";
import { toast } from "sonner";
import Script from "next/script";
import type { ProductType } from "@/models/Product";

interface AddressForm {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
];

export default function CartPage() {
  const { updateInStore } = useProductStore();
  const router = useRouter();
  const { user, isSignedIn } = useUser();
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
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<AddressForm>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  // Pre-fill user data when available
  useEffect(() => {
    if (user) {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

      setShippingAddress((prev) => ({
        ...prev,
        fullName: fullName || prev.fullName,
      }));
    }
  }, [user]);

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

  const validateAddress = (address: AddressForm): boolean => {
    const required = ["fullName", "phone", "street", "city", "state", "zip"];
    return required.every((field) =>
      address[field as keyof AddressForm]?.toString().trim()
    );
  };

  const handleAddressChange = (field: keyof AddressForm, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleProceedToPayment = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to continue");
      router.push("/sign-in");
      return;
    }
    if (!cart.length) {
      toast.error("Your cart is empty");
      return;
    }
    if (!validateAddress(shippingAddress)) {
      toast.error("Please fill in all shipping address fields");
      setShowAddressForm(true);
      return;
    }

    setIsPayLoading(true);
    try {
      // 1) Create order on backend
      const orderRes = await fetch("/api/razorpay-test/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cart.map((item) => ({
            id: item._id,
            quantity: item.quantity,
          })),
          promoCode,
          shipping: shippingAddress, // ✅ Correct key name
        }),
      });
      if (!orderRes.ok) throw new Error("Order creation failed");
      const order = await orderRes.json();
      console.log("🚀 order payload:", order);

      // 2) Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: "Protoplast Studio",
        order_id: order.id, // ✅ Pass in order_id
        prefill: {
          name: shippingAddress.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          contact: shippingAddress.phone,
        },
        handler: async (resp: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 3) Verify payment & reduce stock
            const verifyRes = await fetch("/api/razorpay-test/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                cart: cart.map((it) => ({
                  id: it._id,
                  quantity: it.quantity,
                })),
                shipping: shippingAddress, // ✅ Consistent key
              }),
            });

            const verifyData = await verifyRes.json(); // ✅ Single JSON parsing

            if (verifyRes.ok && verifyData.status === "verified") {
              verifyData.updatedProducts?.forEach((p: ProductType) =>
                updateInStore(p)
              );
              toast.success("Payment successful!");
              clearCart();
              localStorage.setItem("payment_success", "true");
              router.push("/thankyou"); // ✅ Final redirect
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Something went wrong verifying payment");
          }
        },
        theme: { color: "#22c55e" },
      };

      // @ts-expect-error: it is not typed correctly yet
      new window.Razorpay(options).open();
    } catch (err: any) {
      console.error("Order creation error:", err);
      toast.error("Something went wrong during payment");
    } finally {
      setIsPayLoading(false);
    }
  };

  // Redirect if not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="flex flex-col items-center py-16">
              <UserIcon className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-medium text-black mb-2">Sign in required</h2>
              <p className="text-gray-500 mb-4">
                Please sign in to view your cart
              </p>
              <Button onClick={() => router.push("/sign-in")} className="bg-black text-white hover:bg-gray-800">Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/products">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-3xl font-medium text-black">Shopping Cart</h1>
          </div>
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="flex flex-col items-center py-16">
              <div className="text-6xl mb-4 grayscale opacity-50">🛒</div>
              <h2 className="text-2xl font-medium text-black mb-2">
                Your cart is empty
              </h2>
              <Link href="/products">
                <Button className="bg-black text-white hover:bg-gray-800 mt-4">
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
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <h1 className="text-3xl font-medium text-black">Shopping Cart</h1>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
              </Badge>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white px-6 py-4">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-medium">Clear your cart?</DialogTitle>
                </DialogHeader>
                <p className="text-gray-500 mb-6">
                  This will remove all items from your cart permanently. This action cannot be undone.
                </p>
                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="outline" className="rounded-lg">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      className="rounded-lg"
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
            {/* Items and Address */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              {user && (
                <Card className="border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-medium">
                      <UserIcon className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <span>{user.fullName || "Name not provided"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{user.primaryEmailAddress?.emailAddress}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Address Section */}
              <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="text-sm"
                    >
                      {showAddressForm ? "Hide" : "Add/Edit"} Address
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!showAddressForm && shippingAddress.fullName ? (
                    <div className="space-y-2">
                      <div className="font-medium text-black">
                        {shippingAddress.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {shippingAddress.street}
                      </div>
                      <div className="text-sm text-gray-500">
                        {shippingAddress.city}, {shippingAddress.state}{" "}
                        {shippingAddress.zip}
                      </div>
                      <div className="text-sm text-gray-500">
                        {shippingAddress.country}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="h-4 w-4" />
                        {shippingAddress.phone}
                      </div>
                    </div>
                  ) : showAddressForm ? (
                    <div className="space-y-6">
                      {/* Shipping Address */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-900">
                          <Home className="h-4 w-4" />
                          <h3 className="font-medium">Shipping Address</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="shipping-name" className="text-gray-600">Full Name *</Label>
                            <Input
                              id="shipping-name"
                              value={shippingAddress.fullName}
                              onChange={(e) =>
                                handleAddressChange("fullName", e.target.value)
                              }
                              placeholder="Enter full name"
                              className="bg-white border-gray-200 focus:border-green-500"
                            />
                          </div>
                          <div>
                            <Label htmlFor="shipping-phone" className="text-gray-600">
                              Phone Number *
                            </Label>
                            <Input
                              id="shipping-phone"
                              value={shippingAddress.phone}
                              onChange={(e) =>
                                handleAddressChange("phone", e.target.value)
                              }
                              placeholder="Enter phone number"
                              className="bg-white border-gray-200 focus:border-green-500"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="shipping-street" className="text-gray-600">
                            Street Address *
                          </Label>
                          <Textarea
                            id="shipping-street"
                            value={shippingAddress.street}
                            onChange={(e) =>
                              handleAddressChange("street", e.target.value)
                            }
                            placeholder="Enter street address"
                            rows={2}
                            className="bg-white border-gray-200 focus:border-green-500"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="shipping-city" className="text-gray-600">City *</Label>
                            <Input
                              id="shipping-city"
                              value={shippingAddress.city}
                              onChange={(e) =>
                                handleAddressChange("city", e.target.value)
                              }
                              placeholder="Enter city"
                              className="bg-white border-gray-200 focus:border-green-500"
                            />
                          </div>
                          <div>
                            <Label htmlFor="shipping-state" className="text-gray-600">State *</Label>
                            <Select
                              value={shippingAddress.state}
                              onValueChange={(value) =>
                                handleAddressChange("state", value)
                              }
                            >
                              <SelectTrigger className="bg-white border-gray-200">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {INDIAN_STATES.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="shipping-zip" className="text-gray-600">PIN Code *</Label>
                            <Input
                              id="shipping-zip"
                              value={shippingAddress.zip}
                              onChange={(e) =>
                                handleAddressChange("zip", e.target.value)
                              }
                              placeholder="Enter PIN code"
                              className="bg-white border-gray-200 focus:border-green-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Alert className="bg-orange-50 border-orange-100 text-orange-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please add your delivery address to continue with the
                        order.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Cart Items */}
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-black">Order Items</h2>
                {cart.map((item) => (
                  <Card key={item._id} className="border-gray-100 shadow-sm overflow-hidden">
                    <CardContent className="flex gap-4 p-6">
                      <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                        <Image
                          src={item.images?.[0] || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-black text-lg">{item.title}</h3>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white py-4 px-6">
                              <DialogHeader className="mb-4">
                                <DialogTitle className="text-xl font-medium">Remove this item?</DialogTitle>
                              </DialogHeader>
                              <p className="text-gray-500 mb-6">
                                Are you sure you want to remove <span className="font-medium text-black">{item.title}</span> from your cart?
                              </p>
                              <DialogFooter className="gap-2 sm:gap-0">
                                <DialogClose asChild>
                                  <Button variant="outline" className="rounded-lg">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    variant="destructive"
                                    className="rounded-lg"
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
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="h-8 w-8 p-0 hover:bg-gray-50"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity + 1
                                )
                              }
                              disabled={item.quantity >= item.stock}
                              className="h-8 w-8 p-0 hover:bg-gray-50"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-black text-lg">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              ₹{item.price.toLocaleString()} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-medium">
                    <Tag className="h-5 w-5" />
                    Promo Code
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
                      className="bg-white border-gray-200 focus:border-green-500"
                    />
                    <Button onClick={handleApplyPromo} disabled={!promoCode} className="bg-black text-white hover:bg-gray-800">
                      Apply
                    </Button>
                  </div>
                  {discount > 0 && (
                    <p className="text-green-600 text-sm font-medium">✓ {discount}% off applied</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        `₹${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  <Separator className="bg-gray-100" />
                  <div className="flex justify-between font-bold text-lg text-black">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>

                  {/* Address validation warning */}
                  {!validateAddress(shippingAddress) && (
                    <Alert className="bg-orange-50 border-orange-100 text-orange-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please complete your address information before
                        proceeding to payment.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    className="w-full h-12 text-base bg-black hover:bg-gray-800 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handleProceedToPayment}
                    disabled={isPayLoading || !validateAddress(shippingAddress)}
                  >
                    {isPayLoading ? (
                      "Processing…"
                    ) : (
                      <>
                        <CreditCard className="inline-block mr-2 h-4 w-4" />
                        Pay ₹{total.toLocaleString()}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className="flex gap-4 text-xs text-gray-400 justify-center">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Fast Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
