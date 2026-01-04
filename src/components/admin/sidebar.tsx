"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Menu, X, ShoppingBag , Package, Users, ArrowUpDown, Globe } from "lucide-react"

const links = [
  { label: "Inventory", href: "/dashboard", icon: Package },
  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowUpDown },
  { label: "User Directory", href: "/dashboard/users", icon: Users },
  { label: "Order Logs", href: "/dashboard/orders", icon: ShoppingBag },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isOpen ? "hidden" : "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen, isMobile])

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname?.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <nav className="flex flex-col space-y-2 px-6 py-10 flex-grow">
        <div className="px-4 mb-10">
          <Image
            src="/logo-full-black.svg"
            alt="Logo"
            width={140}
            height={46}
            className="flex-shrink-0 cursor-pointer mb-10"
            onClick={() => router.push("/")}
          />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Management</p>
        </div>
        {links.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-500 group relative overflow-hidden",
              isActiveLink(href) 
                ? "bg-black text-white shadow-2xl shadow-black/20" 
                : "text-gray-500 hover:bg-gray-50 hover:text-black"
            )}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <Icon size={20} className={cn(
              "transition-all duration-500",
              isActiveLink(href) ? "text-green-500 scale-110" : "text-gray-300 group-hover:text-black group-hover:scale-110"
            )} />
            <span className="tracking-tight relative z-10">{label}</span>
            {isActiveLink(href) && (
              <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            )}
          </Link>
        ))}
      </nav>
      
      <div className="px-6 pb-10">
        <Link
          href="/"
          className="flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-black transition-all duration-500 group"
        >
          <Globe size={20} className="text-gray-300 group-hover:text-black group-hover:scale-110 transition-all duration-500" />
          <span className="tracking-tight">Back to Website</span>
        </Link>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <button
          className="fixed top-24 left-6 z-[60] bg-black text-white shadow-2xl p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all border border-white/10"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsOpen(false)}>
            <aside 
              className="w-80 h-full bg-white text-black border-r border-gray-100 shadow-2xl animate-in slide-in-from-left duration-500"
              onClick={(e) => e.stopPropagation()}
            >
              {sidebarContent}
            </aside>
          </div>
        )}
      </>
    )
  }

  return (
    <aside className="w-72 h-screen bg-white text-black fixed left-0 top-0 border-r border-gray-100 z-40">
      {sidebarContent}
    </aside>
  )
}
