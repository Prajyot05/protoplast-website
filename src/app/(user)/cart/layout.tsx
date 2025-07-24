import Header from "@/components/header";
import Script from "next/script";

export default async function UserDashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <>
      {/* Razorpay checkout script loaded globally for any child page */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

      <Header />
      <main className="pt-20">{children}</main>
    </>
  );
}
