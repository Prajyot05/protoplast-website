"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useUser,
  SignUpButton,
  SignedOut,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, ShoppingCart } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocalProduct } from "@/stores/useLocalProcut";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const totalItems = useLocalProduct((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0)
  );

  const isAdminPath = pathname?.startsWith("/dashboard");
  const role = user?.publicMetadata?.role;

  const navItems = [
    { label: "Solutions", id: "services" },
    { label: "Pricing", id: "pricing" },
    { label: "About", id: "about" },
    { label: "Testimonials", id: "testimonials" },
  ];

  if (!isLoaded) return null;

  // --- Admin Header ---
  if (isAdminPath && role === "admin") {
    return (
      <motion.header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-y-4 md:gap-y-0">
            <div className="w-full flex items-center justify-between md:justify-start md:gap-6">
              <Image
                src="/logo-text-white.svg"
                alt="Logo"
                width={isMobile ? 90 : 120}
                height={40}
                className="flex-shrink-0 cursor-pointer"
                onClick={() => router.push("/")}
              />

              <div className="md:hidden flex-1 mx-4">
                <div className="relative w-full">
                  <Input
                    type="search"
                    placeholder="Search"
                    className="w-full bg-white/10 text-white placeholder:text-gray-300 rounded-full px-4 py-2 focus-visible:ring-2 focus-visible:ring-green-400 text-sm"
                  />
                  <kbd className="absolute top-1/2 -translate-y-1/2 right-4 text-xs text-gray-400">
                    ⌘K
                  </kbd>
                </div>
              </div>

              <div className="flex md:hidden items-center gap-4">
                <Bell className="text-white cursor-pointer hover:text-green-400 transition-colors" />
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.imageUrl ?? ""} alt="Admin profile" />
                  <AvatarFallback>{user?.firstName?.[0] ?? "A"}</AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="hidden md:flex w-full items-center justify-between">
              <div className="relative w-full max-w-lg mx-auto">
                <Input
                  type="search"
                  placeholder="Search"
                  className="w-full bg-white/10 text-white placeholder:text-gray-300 rounded-full px-4 py-2 focus-visible:ring-2 focus-visible:ring-green-400 text-sm"
                />
                <kbd className="absolute top-1/2 -translate-y-1/2 right-4 text-xs text-gray-400 hidden sm:block">
                  ⌘K
                </kbd>
              </div>

              <div className="flex items-center gap-4 ml-6">
                <Bell className="text-white cursor-pointer hover:text-green-400 transition-colors" />
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <Avatar className="w-7 h-7">
                    <AvatarImage
                      src={user?.imageUrl ?? ""}
                      alt="Admin profile"
                    />
                    <AvatarFallback>
                      {user?.firstName?.[0] ?? "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-white text-sm font-medium leading-tight">
                    <p className="font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-300 truncate max-w-[150px]">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>
    );
  }

  // --- Landing Page Header ---
  return (
    <motion.header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto px-6 py-3 md:py-4">
        <nav className="flex items-center justify-between">
          {/* Desktop Logo */}
          <div className="hidden md:block cursor-pointer" onClick={() => router.push("/")}>
            <Image alt="Logo" src="/logo-text-white.svg" width={120} height={50} />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <ScrollLink
                key={item.id}
                to={item.id}
                spy={true}
                smooth={true}
                offset={-100}
                duration={100}
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-green-400 transition-colors text-sm font-medium cursor-pointer"
                activeClass="text-green-400"
              >
                {item.label}
              </ScrollLink>
            ))}
            <SignedOut>
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4 relative">
                <Link href="/cart">
                  <div className="relative cursor-pointer mr-5">
                    <ShoppingCart className="text-white hover:text-green-400" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -left-2 bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {totalItems > 9 ? "+9" : totalItems}
                      </span>
                    )}
                  </div>
                </Link>
                <UserButton />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-green-400 transition-colors"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>

        {/* ✅ Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-6 py-6 border-t border-gray-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile Logo */}
              <div
                className="cursor-pointer mb-6"
                onClick={() => {
                  router.push("/");
                  setIsMenuOpen(false);
                }}
              >
                <Image alt="Logo" src="/logo-text-white.svg" width={100} height={40} />
              </div>

              {/* Mobile Nav Items */}
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <ScrollLink
                    key={item.id}
                    to={item.id}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:text-green-400 transition-colors text-left text-sm font-medium cursor-pointer"
                    activeClass="text-green-400"
                  >
                    {item.label}
                  </ScrollLink>
                ))}
              </div>

              {/* Mobile Cart + User */}
              <SignedIn>
                <div className="flex items-center justify-between mt-6">
                  <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                    <div className="relative cursor-pointer">
                      <ShoppingCart className="text-white hover:text-green-400" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -left-2 bg-green-700 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {totalItems > 9 ? "+9" : totalItems}
                        </span>
                      )}
                    </div>
                  </Link>
                  <UserButton />
                </div>
              </SignedIn>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
