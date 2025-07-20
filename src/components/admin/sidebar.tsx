"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X, LayoutDashboard, Package, Users, Settings } from "lucide-react";

const links = [
  { label: "Products", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/dashboard/transactions", icon: Package },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isOpen ? "hidden" : "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, isMobile]);

  const sidebarContent = (
    <nav className="flex flex-col space-y-2 px-4 py-7">
      {links.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[#1f2937]",
            pathname?.startsWith(href) && "bg-[#1f2937] text-green-400"
          )}
          onClick={() => isMobile && setIsOpen(false)} 
        >
          <Icon size={18} />
          {label}
        </Link>
      ))}
    </nav>
  );

  if (isMobile) {
    return (
      <>
        <button
          className="fixed top-16 left-4 z-[60] bg-[#111827] p-2 rounded-md text-white"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="fixed top-4 left-55" size={24} /> : <Menu size={20} />}
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <aside className="w-64 h-full bg-[#111827] text-white">
              {sidebarContent}
            </aside>
          </div>
        )}
      </>
    );
  }

  return (
    <aside className="w-64 h-screen bg-[#111827] text-white fixed left-0 top-0 pt-20 border-r border-gray-800">
      {sidebarContent}
    </aside>
  );
}
