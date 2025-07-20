"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Menu, X, LayoutDashboard, Package, Users, ArrowUpDown } from "lucide-react"

const links = [
  { label: "Products", href: "/dashboard", icon: Package },
  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowUpDown },
  { label: "Users", href: "/dashboard/users", icon: Users },
]

export default function AdminSidebar() {
  const pathname = usePathname()
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
    <nav className="flex flex-col space-y-2 px-4 py-7">
      {links.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800/50 hover:text-green-400",
            isActiveLink(href) && "bg-green-500/20 text-green-400 border border-green-500/30 shadow-lg",
          )}
          onClick={() => isMobile && setIsOpen(false)}
        >
          <Icon size={18} />
          {label}
        </Link>
      ))}
    </nav>
  )

  if (isMobile) {
    return (
      <>
        <button
          className="fixed top-16 left-4 z-[60] bg-gray-900/90 backdrop-blur-sm p-2 rounded-lg text-white border border-gray-700/50 hover:bg-gray-800/90 transition-all"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
            <aside className="w-64 h-full bg-gray-900/95 backdrop-blur-md text-white border-r border-gray-800/50">
              {sidebarContent}
            </aside>
          </div>
        )}
      </>
    )
  }

  return (
    <aside className="w-64 h-screen bg-gray-900/50 backdrop-blur-sm text-white fixed left-0 top-0 pt-20 border-r border-gray-800/50">
      {sidebarContent}
    </aside>
  )
}
