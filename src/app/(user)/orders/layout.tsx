import Header from "@/components/header";

export default async function UserDashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <Header />
      <main className="pt-20">{children}</main>
    </>
  );
}
