"use client"

import { usePathname, useRouter } from "next/navigation"
import { useUser, SignUpButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Bell, ShoppingCart, Settings } from "lucide-react"
import { Link as ScrollLink } from "react-scroll"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { useLocalProduct } from "@/stores/useLocalProduct"
import Link from "next/link"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoaded } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useIsMobile()
  const totalItems = useLocalProduct((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0)
  )

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSuccess = localStorage.getItem("payment_success")
      if (isSuccess === "true") {
        useLocalProduct.getState().clearCart()
        localStorage.removeItem("payment_success")
      }
    }
  }, [])

  const isAdminPath = pathname?.startsWith("/dashboard")
  const role = user?.publicMetadata?.role

  const navItems = [
    { label: "Solutions", id: "services" },
    { label: "Pricing", id: "pricing" },
    { label: "About", id: "about" },
    { label: "Testimonials", id: "testimonials" },
  ]

  if (!isLoaded) return null

  // --- Admin Header (no nav items) ---
  if (isAdminPath && role === "admin") {
    return (
      <motion.header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Image
                src="/logo-text-white.svg"
                alt="Logo"
                width={isMobile ? 90 : 120}
                height={40}
                className="flex-shrink-0 cursor-pointer"
                onClick={() => router.push("/")}
              />
            </div>

            {/* Right Side - Admin Tools */}
            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300">System Online</span>
                </div>
              </div>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hover:bg-gray-800/50 relative"
                >
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                    3
                  </Badge>
                </Button>
              </div>

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-gray-800/50"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="w-5 h-5" />
              </Button>

              {/* Admin Profile */}
              <div className="flex items-center gap-3 bg-gray-800/30 px-3 py-2 rounded-lg border border-gray-700/50">
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
      </motion.header>
    )
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
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5a3de6] transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4 relative">
                <Link href="/cart">
                  <div className="relative cursor-pointer mr-5 group">
                    <ShoppingCart className="text-white hover:text-green-400 transition-colors w-6 h-6" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                        {totalItems > 9 ? "9+" : totalItems}
                      </Badge>
                    )}
                  </div>
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-10 h-10 border-2 border-green-400/30 hover:border-green-400/60 transition-colors",
                    },
                  }}
                />
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

        {/* Mobile Menu */}
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
                  router.push("/")
                  setIsMenuOpen(false)
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
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
                  <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                    <div className="relative cursor-pointer group">
                      <ShoppingCart className="text-white hover:text-green-400 transition-colors w-6 h-6" />
                      {totalItems > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                          {totalItems > 9 ? "9+" : totalItems}
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 border-2 border-green-400/30",
                      },
                    }}
                  />
                </div>
              </SignedIn>

              <SignedOut>
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <SignUpButton>
                    <button className="w-full bg-[#6c47ff] text-white rounded-full font-medium text-sm h-12 px-5 cursor-pointer hover:bg-[#5a3de6] transition-colors">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
