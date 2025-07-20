import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/header";
import AdminSidebar from "@/components/admin/sidebar";
import { syncClerkUserToDB } from "@/actions/sync-user";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  await syncClerkUserToDB();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  return (
    <>
      <Header />
      <div className="flex pt-20">
        <AdminSidebar />
        <main className="ml-64 w-full">{children}</main>
      </div>
    </>
  );
}
