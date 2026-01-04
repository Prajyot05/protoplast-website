"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  CreditCard,
  Truck,
  Shield,
  Tag,
  UserIcon,
  Phone,
  Home,
  AlertCircle,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { useProductStore } from "@/stores/useProductStore";
import { useLocalProduct } from "@/stores/useLocalProduct";
import { toast } from "sonner";
import Script from "next/script";
import type { ProductType } from "@/models/Product";
import Header from "@/components/header";
import Footer from "@/pages/footer";

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
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center py-32 bg-gray-50 rounded-3xl border border-gray-100 border-dashed animate-in zoom-in-95 duration-500 max-w-2xl w-full">
            <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
              <UserIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-3xl font-medium text-black mb-3 tracking-tight">Sign in required</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
              Please sign in to view your cart and proceed with your purchase.
            </p>
            <Button onClick={() => router.push("/sign-in")} className="bg-black text-white hover:bg-gray-800 rounded-full px-10 py-6 text-lg shadow-lg shadow-black/10 transition-all hover:scale-105 active:scale-95">
              Sign In to Continue
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cart.length) {
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
                <span className="text-black font-medium">Cart</span>
              </nav>
            </div>
          </div>

          {/* Header Section */}
          <section className="py-16 px-6 bg-white">
            <div className="container mx-auto max-w-7xl">
              <h1 className="text-black text-5xl md:text-7xl font-medium leading-tight tracking-tight mb-6">
                Your <span className="text-green-600">Cart</span>
              </h1>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                Review your items and proceed to checkout
              </p>
            </div>
          </section>

          <div className="container mx-auto px-6 max-w-7xl py-12">
            <div className="text-center py-32 bg-gray-50 rounded-3xl border border-gray-100 border-dashed animate-in zoom-in-95 duration-500">
              <div className="bg-white p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-3xl font-medium text-black mb-3 tracking-tight">Your cart is empty</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                Looks like you haven&apos;t added anything to your cart yet. Explore our products to find something you love.
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white rounded-full px-10 py-6 text-lg shadow-lg shadow-green-600/20 transition-all hover:shadow-green-600/40 hover:-translate-y-1">
                <Link href="/products">
                  Start Shopping <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" async />
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
                <span className="text-black font-medium">Cart</span>
              </nav>
            </div>
          </div>

          {/* Header Section */}
          <section className="py-16 px-6 bg-white">
            <div className="container mx-auto max-w-7xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="max-w-4xl">
                  <h1 className="text-black text-5xl md:text-7xl font-medium leading-tight tracking-tight mb-6">
                    Your <span className="text-green-600">Cart</span>
                  </h1>
                  <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                    Review your items and proceed to checkout
                  </p>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-4 py-2 text-sm rounded-full">
                    {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 rounded-full px-4 h-10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Cart
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white px-6 py-4 rounded-3xl">
                      <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-medium tracking-tight">Clear your cart?</DialogTitle>
                        <DialogDescription className="sr-only">
                          Confirm if you want to remove all items from your cart.
                        </DialogDescription>
                      </DialogHeader>
                      <p className="text-gray-500 mb-6 text-lg">
                        This will remove all items from your cart permanently. This action cannot be undone.
                      </p>
                      <DialogFooter className="gap-3 sm:gap-0">
                        <DialogClose asChild>
                          <Button variant="outline" className="rounded-full px-6">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            className="rounded-full px-6"
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
              </div>
            </div>
          </section>

          <div className="container mx-auto px-6 max-w-7xl py-12">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Items and Address */}
              <div className="lg:col-span-2 space-y-12">
                {/* Customer Info */}
                {user && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-medium text-black tracking-tight border-b border-gray-100 pb-4">Customer Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Full Name</p>
                        <p className="text-xl font-medium text-black">{user.fullName || "Name not provided"}</p>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Email Address</p>
                        <p className="text-xl font-medium text-black">{user.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-3xl font-medium text-black tracking-tight">Delivery Address</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 font-medium"
                    >
                      {showAddressForm ? "Hide Form" : "Edit Address"}
                    </Button>
                  </div>
                  
                  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    {!showAddressForm && shippingAddress.fullName ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Recipient</p>
                            <p className="text-xl font-medium text-black">{shippingAddress.fullName}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Contact</p>
                            <p className="text-xl font-medium text-black flex items-center gap-2">
                              <Phone className="h-4 w-4 text-green-600" />
                              {shippingAddress.phone}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">Address</p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                              {shippingAddress.street}<br />
                              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}<br />
                              {shippingAddress.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : showAddressForm ? (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="shipping-name" className="text-sm font-medium text-gray-700 ml-1">Full Name *</Label>
                            <Input
                              id="shipping-name"
                              value={shippingAddress.fullName}
                              onChange={(e) =>
                                handleAddressChange("fullName", e.target.value)
                              }
                              placeholder="Enter full name"
                              className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="shipping-phone" className="text-sm font-medium text-gray-700 ml-1">Phone Number *</Label>
                            <Input
                              id="shipping-phone"
                              value={shippingAddress.phone}
                              onChange={(e) =>
                                handleAddressChange("phone", e.target.value)
                              }
                              placeholder="Enter phone number"
                              className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shipping-street" className="text-sm font-medium text-gray-700 ml-1">Street Address *</Label>
                          <Textarea
                            id="shipping-street"
                            value={shippingAddress.street}
                            onChange={(e) =>
                              handleAddressChange("street", e.target.value)
                            }
                            placeholder="Enter street address"
                            rows={3}
                            className="rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="shipping-city" className="text-sm font-medium text-gray-700 ml-1">City *</Label>
                            <Input
                              id="shipping-city"
                              value={shippingAddress.city}
                              onChange={(e) =>
                                handleAddressChange("city", e.target.value)
                              }
                              placeholder="Enter city"
                              className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="shipping-state" className="text-sm font-medium text-gray-700 ml-1">State *</Label>
                            <Select
                              value={shippingAddress.state}
                              onValueChange={(value) =>
                                handleAddressChange("state", value)
                              }
                            >
                              <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl">
                                {INDIAN_STATES.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="shipping-zip" className="text-sm font-medium text-gray-700 ml-1">PIN Code *</Label>
                            <Input
                              id="shipping-zip"
                              value={shippingAddress.zip}
                              onChange={(e) =>
                                handleAddressChange("zip", e.target.value)
                              }
                              placeholder="Enter PIN code"
                              className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                          </div>
                        </div>
                        <Button 
                          onClick={() => setShowAddressForm(false)}
                          className="w-full h-14 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all"
                        >
                          Save Address
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 inline-block">
                          <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <p className="text-orange-800 font-medium">Please add your delivery address to continue</p>
                          <Button 
                            variant="link" 
                            onClick={() => setShowAddressForm(true)}
                            className="text-orange-600 font-bold mt-2"
                          >
                            Add Address Now
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cart Items */}
                <div className="space-y-8">
                  <h2 className="text-3xl font-medium text-black tracking-tight border-b border-gray-100 pb-4">Order Items</h2>
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item._id} className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="relative w-full md:w-40 h-40 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                            <Image
                              src={item.images?.[0] || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-contain p-4"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-2xl font-medium text-black tracking-tight">{item.title}</h3>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full h-10 w-10 p-0">
                                      <Trash2 className="h-5 w-5" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md bg-white py-6 px-8 rounded-3xl">
                                    <DialogHeader className="mb-4">
                                      <DialogTitle className="text-2xl font-medium tracking-tight">Remove item?</DialogTitle>
                                      <DialogDescription className="sr-only">
                                        Confirm if you want to remove this item from your cart.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <p className="text-gray-500 mb-8 text-lg">
                                      Are you sure you want to remove <span className="font-medium text-black">{item.title}</span> from your cart?
                                    </p>
                                    <DialogFooter className="gap-3 sm:gap-0">
                                      <DialogClose asChild>
                                        <Button variant="outline" className="rounded-full px-6">Cancel</Button>
                                      </DialogClose>
                                      <DialogClose asChild>
                                        <Button
                                          variant="destructive"
                                          className="rounded-full px-6"
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
                              <p className="text-gray-500 text-lg line-clamp-2 leading-relaxed mb-6">
                                {item.description}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-between gap-6">
                              <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
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
                                  className="h-10 w-10 p-0 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center text-lg font-medium text-black">
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
                                  className="h-10 w-10 p-0 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <div className="text-3xl font-medium text-black tracking-tight">
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                                  ₹{item.price.toLocaleString()} / unit
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-8">
                <div className="sticky top-24 space-y-8">
                  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
                    <h3 className="text-2xl font-medium text-black tracking-tight flex items-center gap-2">
                      <Tag className="h-6 w-6 text-green-600" />
                      Promo Code
                    </h3>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) =>
                          setPromoCode(e.target.value.toUpperCase())
                        }
                        className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                      />
                      <Button 
                        onClick={handleApplyPromo} 
                        disabled={!promoCode} 
                        className="h-14 px-6 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all disabled:opacity-50"
                      >
                        Apply
                      </Button>
                    </div>
                    {discount > 0 && (
                      <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        Promo applied: {discount}% off
                      </div>
                    )}
                  </div>

                  <div className="bg-black rounded-3xl p-8 shadow-2xl shadow-black/20 text-white space-y-8">
                    <h3 className="text-2xl font-medium tracking-tight">Order Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-gray-400">
                        <span className="text-lg">Subtotal</span>
                        <span className="text-lg font-medium text-white">₹{subtotal.toLocaleString()}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-400">
                          <span className="text-lg">Discount</span>
                          <span className="text-lg font-medium">-₹{discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-400">
                        <span className="text-lg">GST (18%)</span>
                        <span className="text-lg font-medium text-white">₹{tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span className="text-lg">Shipping</span>
                        <span className="text-lg font-medium text-green-400">Free</span>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex justify-between items-end">
                          <span className="text-xl text-gray-400">Total</span>
                          <span className="text-5xl font-medium tracking-tighter">₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full h-16 text-xl bg-green-500 hover:bg-green-400 text-black font-medium rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-green-500/20 disabled:opacity-50 disabled:hover:scale-100"
                      onClick={handleProceedToPayment}
                      disabled={isPayLoading || !validateAddress(shippingAddress)}
                    >
                      {isPayLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Processing…
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <CreditCard className="h-6 w-6" />
                          Checkout Now
                        </div>
                      )}
                    </Button>
                    
                    <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Shield className="h-5 w-5 text-green-500" />
                        <span>Secure 256-bit SSL encrypted payment</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Truck className="h-5 w-5 text-green-500" />
                        <span>Free express delivery on all orders</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}