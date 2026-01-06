import type React from "react"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Header from "@/components/header"
import AdminSidebar from "@/components/admin/sidebar"
import { syncClerkUserToDB } from "@/actions/sync-user"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  await syncClerkUserToDB()

  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      <div className="flex flex-grow pt-16 md:pt-20">
        <AdminSidebar />
        <main className="flex-grow md:ml-72 w-full min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
