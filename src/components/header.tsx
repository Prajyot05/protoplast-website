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
import { Menu, X, ShoppingCart, ShoppingBag } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

  const navItems = [
    { label: "Services", id: "services" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  if (!isLoaded) return null;

  // --- Admin Header (no nav items) ---
  if (isAdminPath && role === "admin") {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Image
                src="/logo-full-black.svg"
                alt="Logo"
                width={isMobile ? 110 : 160}
                height={52}
                className="flex-shrink-0 cursor-pointer invert"
                onClick={() => router.push("/")}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded border border-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-300">System Online</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-800/30 px-3 py-2 rounded border border-gray-700">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.imageUrl ?? ""} alt="Admin profile" />
                  <AvatarFallback className="bg-green-500/20 text-green-400">
                    {user?.firstName?.[0] ?? "A"}
                  </AvatarFallback>
                </Avatar>
                {!isMobile && (
                  <div className="text-white text-sm">
                    <p className="font-medium leading-tight">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-green-400">Administrator</p>
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
        isScrolled ? "bg-white shadow-sm" : "bg-white/80 backdrop-blur-sm"
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
            {navItems.map((item) => (
              pathname === "/" ? (
                <ScrollLink
                  key={item.id}
                  to={item.id}
                  spy={true}
                  smooth={true}
                  offset={-100}
                  duration={100}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer uppercase tracking-wide"
                  activeClass="text-black"
                >
                  {item.label}
                </ScrollLink>
              ) : (
                <Link
                  key={item.id}
                  href={`/#${item.id}`}
                  className="text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer uppercase tracking-wide"
                >
                  {item.label}
                </Link>
              )
            ))}
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors cursor-pointer uppercase tracking-wide ${
                pathname?.startsWith("/products") ? "text-black" : "text-gray-600 hover:text-black"
              }`}
            >
              Products
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-6">
            <SignedOut>
              <SignUpButton>
                <button className="btn-outline text-sm py-2 px-5">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-5">
                <Link href="/orders" className="group">
                  <div className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-sm font-medium hidden lg:block">
                      Orders
                    </span>
                  </div>
                </Link>

                <Link href="/cart" className="relative group">
                  <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                      {totalItems > 9 ? "9+" : totalItems}
                    </Badge>
                  )}
                </Link>

                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-9 h-9 border border-gray-200 hover:border-green-500 transition-colors",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-black hover:text-green-600 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100">
            <div className="flex flex-col gap-4">
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
                    className="text-sm font-medium text-gray-600 hover:text-black transition-colors uppercase tracking-wide py-2"
                    activeClass="text-black"
                  >
                    {item.label}
                  </ScrollLink>
                ) : (
                  <Link
                    key={item.id}
                    href={`/#${item.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium text-gray-600 hover:text-black transition-colors uppercase tracking-wide py-2"
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <Link
                href="/products"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium transition-colors uppercase tracking-wide py-2 ${
                  pathname?.startsWith("/products") ? "text-black" : "text-gray-600 hover:text-black"
                }`}
              >
                Products
              </Link>
            </div>

            <SignedIn>
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <Link href="/orders" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                      <ShoppingBag className="w-5 h-5" />
                      <span className="text-sm font-medium">Orders</span>
                    </div>
                  </Link>

                  <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                      {totalItems > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                          {totalItems > 9 ? "9+" : totalItems}
                        </Badge>
                      )}
                    </div>
                  </Link>
                </div>

                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 border border-gray-200",
                    },
                  }}
                />
              </div>
            </SignedIn>

            <SignedOut>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <SignUpButton>
                  <button className="w-full btn-primary text-sm py-3">
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
