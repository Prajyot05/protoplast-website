"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useUser,
  SignUpButton,
  SignedOut,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocalProduct } from "@/stores/useLocalProduct";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const totalItems = useLocalProduct((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0)
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSuccess = localStorage.getItem("payment_success");
      if (isSuccess === "true") {
        useLocalProduct.getState().clearCart();
        localStorage.removeItem("payment_success");
      }
    }
  }, []);

  const isAdminPath = pathname?.startsWith("/dashboard");
  const role = user?.publicMetadata?.role;
  const isLandingPage = pathname === "/";

  const navItems = [
    { label: "Services", id: "services" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  // --- Admin Header (no nav items) ---
  if (isLoaded && isAdminPath && role === "admin") {
    return (
      <header className="fixed top-0 left-0 md:left-72 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-8 py-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Online</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <Avatar className="w-8 h-8 border border-white shadow-sm">
                  <AvatarImage src={user?.imageUrl ?? ""} alt="Admin profile" />
                  <AvatarFallback className="bg-green-500/10 text-green-600 text-[10px] font-bold">
                    {user?.firstName?.[0] ?? "A"}
                  </AvatarFallback>
                </Avatar>
                {!isMobile && (
                  <div className="text-black text-sm">
                    <p className="font-bold leading-tight tracking-tight">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Administrator</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // --- Landing Page Header ---
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        (isScrolled || !isLandingPage) ? "bg-white shadow-sm" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div
            className="cursor-pointer flex-shrink-0"
            onClick={() => router.push("/")}
          >
            <Image
              alt="Protoplast Logo"
              src="/logo-full-black.svg"
              width={isMobile ? 120 : 180}
              height={56}
              className="h-10 md:h-14 w-auto"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors cursor-pointer uppercase tracking-tight ${
                pathname === "/" ? "text-green-600" : "text-gray-600 hover:text-black"
              }`}
            >
              Home
            </Link>
            {navItems.map((item) => (
              pathname === "/" ? (
                <ScrollLink
                  key={item.id}
                  to={item.id}
                  spy={true}
                  smooth={true}
                  offset={-100}
                  duration={100}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer uppercase tracking-tight"
                  activeClass="text-green-600"
                >
                  {item.label}
                </ScrollLink>
              ) : (
                <Link
                  key={item.id}
                  href={`/#${item.id}`}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer uppercase tracking-tight"
                >
                  {item.label}
                </Link>
              )
            ))}
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors cursor-pointer uppercase tracking-tight ${
                pathname?.startsWith("/products") ? "text-green-600" : "text-gray-600 hover:text-black"
              }`}
            >
              Products
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-8">
            <SignedOut>
              <SignUpButton>
                <button className="text-sm font-medium uppercase tracking-tight hover:text-green-600 transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-8">
                <Link href="/orders" className="group flex items-center gap-2">
                  <ShoppingBag className={`w-4 h-4 transition-colors ${
                    pathname === "/orders" ? "text-green-600" : "text-gray-600 group-hover:text-black"
                  }`} />
                  <span className={`text-sm font-medium uppercase tracking-tight transition-colors ${
                    pathname === "/orders" ? "text-green-600" : "text-gray-600 group-hover:text-black"
                  }`}>
                    Orders
                  </span>
                </Link>

                <Link href="/cart" className="relative group flex items-center gap-2">
                  <ShoppingCart className={`w-4 h-4 transition-colors ${
                    pathname === "/cart" ? "text-green-600" : "text-gray-600 group-hover:text-black"
                  }`} />
                  <span className={`text-sm font-medium uppercase tracking-tight transition-colors ${
                    pathname === "/cart" ? "text-green-600" : "text-gray-600 group-hover:text-black"
                  }`}>
                    Cart
                    {totalItems > 0 && (
                      <span className="ml-1 text-green-600 font-bold">
                        ({totalItems})
                      </span>
                    )}
                  </span>
                </Link>

                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-8 h-8 border border-gray-100 hover:border-green-500 transition-colors",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-xs font-bold tracking-widest uppercase p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-10 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-6">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-medium uppercase tracking-tighter ${
                  pathname === "/" ? "text-green-600" : "text-black hover:text-green-600"
                }`}
              >
                Home
              </Link>
              {navItems.map((item) => (
                pathname === "/" ? (
                  <ScrollLink
                    key={item.id}
                    to={item.id}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-medium text-black hover:text-green-600 transition-colors uppercase tracking-tighter"
                    activeClass="text-green-600"
                  >
                    {item.label}
                  </ScrollLink>
                ) : (
                  <Link
                    key={item.id}
                    href={`/#${item.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-medium text-black hover:text-green-600 transition-colors uppercase tracking-tighter"
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <Link
                href="/products"
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-medium uppercase tracking-tighter ${
                  pathname?.startsWith("/products") ? "text-green-600" : "text-black hover:text-green-600"
                }`}
              >
                Products
              </Link>
            </div>

            <SignedIn>
              <div className="flex flex-col gap-6 mt-10 pt-10 border-t border-gray-100">
                <Link href="/orders" onClick={() => setIsMenuOpen(false)} className={`text-2xl font-medium uppercase tracking-tighter flex items-center gap-3 ${
                  pathname === "/orders" ? "text-green-600" : "text-black hover:text-green-600"
                }`}>
                  <ShoppingBag className="w-6 h-6" />
                  Orders
                </Link>

                <Link href="/cart" onClick={() => setIsMenuOpen(false)} className={`text-2xl font-medium uppercase tracking-tighter flex items-center justify-between ${
                  pathname === "/cart" ? "text-green-600" : "text-black hover:text-green-600"
                }`}>
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6" />
                    Cart
                  </div>
                  {totalItems > 0 && (
                    <span className="text-green-600">({totalItems})</span>
                  )}
                </Link>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500 uppercase tracking-widest">Account</span>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 border border-gray-100",
                      },
                    }}
                  />
                </div>
              </div>
            </SignedIn>

            <SignedOut>
              <div className="mt-10 pt-10 border-t border-gray-100">
                <SignUpButton>
                  <button className="w-full bg-black text-white text-xl font-medium py-5 uppercase tracking-tighter">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        )}
      </div>
    </header>
  );
}
