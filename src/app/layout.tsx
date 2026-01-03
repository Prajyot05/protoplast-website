import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Protoplast Studio",
  description:
    "Your one-stop solution for advanced manufacturing. We provide top-quality services to bring your ideas to life with precision and efficiency.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preload" href="/fonts/OverusedGrotesk-VF.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        </head>
        <body id="top" className={`${inter.variable} antialiased`} suppressHydrationWarning>
          <Toaster
            theme="light"
            toastOptions={{
              className:
                "bg-white border border-green-500 text-black rounded-md shadow-lg transition-all duration-300",
              style: {
                backgroundColor: "#ffffff",
                borderColor: "#22c55e",
                color: "#000000",
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)",
                borderRadius: "4px",
              },
            }}
            richColors
            closeButton
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
